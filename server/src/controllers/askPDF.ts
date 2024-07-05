import { Request, Response } from "express";
import { embeddings, openai } from "../config/openAI";
import { pinecone } from "../config/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { vectorizePinconePDF } from "../utils/vectorizePDF";
import Message from "../models/askPDF/Message";
import File from "../models/askPDF/File";

const createFile = async (req: Request, res: Response) => {
  try {
    const { url, name, key, owner } = req.body;
    const newFile = await File.create({ url, name, key, owner });
    res.status(201).json({
      message: "File created successfully",
      success: true,
      fileId: newFile._id,
      uploadStatus: "Pending",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const deleteFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    await File.findByIdAndDelete(fileId);
    res
      .status(200)
      .json({ message: "File deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const fetchFiles = async (req: Request, res: Response) => {
  try {
    const files = await File.find({ owner: req.user.id });
    res
      .status(200)
      .json({ message: "Files fetched successfully", success: true, files });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const fetchFileDetails = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    res.status(200).json({
      message: "File details fetched successfully",
      success: true,
      file,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const fetchFileStatus = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) {
      res.status(404).json({ message: "File not found", success: false });
    }

    res.status(200).json({
      message: "File status fetched successfully",
      success: true,
      status: file!.uploadStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const vectorizePDF = async (req: Request, res: Response) => {
  const { fileUrl, fileKey } = req.body;

  try {
    const vectorizeStatus = await vectorizePinconePDF({ fileUrl, fileKey });

    if (!vectorizeStatus.success) {
      await File.findOneAndUpdate({ key: fileKey }, { uploadStatus: "Failed" });
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }

    await File.findOneAndUpdate({ key: fileKey }, { uploadStatus: "Success" });
    res
      .status(200)
      .json({ message: "PDF vectorized successfully", success: true });
  } catch (error) {
    await File.findOneAndUpdate({ key: fileKey }, { uploadStatus: "Failed" });
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const getFileMessages = async (req: Request, res: Response) => {
  const fileId = req.params.fileId;
  const { userId, cursor } = req.query;
  const file = await File.findById(fileId);

  if (!file) {
    return res.status(404).json({ message: "File not found", success: false });
  }

  let query: any = { fileId, userId };
  if (cursor !== "undefined") {
    query._id = { $lte: cursor };
  }

  const messages = await Message.find(query).limit(11).sort({ createdAt: -1 });

  let nextCursor: typeof cursor | undefined = undefined;
  if (messages.length > 10) {
    const nextItem: any = messages.pop();
    nextCursor = nextItem?._id;
  }

  res.status(200).json({
    message: "Messages fetched successfully",
    success: true,
    messages,
    nextCursor,
  });
};

const sendMessage = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.fileId;
    const { message } = req.body;
    const file = await File.findById(fileId);

    if (!file) {
      return res
        .status(404)
        .json({ message: "File not found", success: false });
    }

    await Message.create({
      text: message,
      isUserMessage: true,
      fileId,
      userId: req.user.id,
    });

    const pineconeIndex = pinecone.Index("placeprep");
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.key,
    });

    const results = await vectorStore.similaritySearch(message, 4);

    const prevMessages = await Message.find({ fileId, userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedPrevMessages: any = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: msg.text,
    }));

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
        },
        {
          role: "user",
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer. Also dont give an answer if no context is provided.
                
            \n----------------\n
            
            PREVIOUS CONVERSATION:
            ${formattedPrevMessages.map((message: any) => {
              if (message.role === "user") return `User: ${message.content}\n`;
              return `Assistant: ${message.content}\n`;
            })}
            
            \n----------------\n
            
            CONTEXT:
            ${results.map((r) => r.pageContent).join("\n\n")}
            
            USER INPUT: ${message}`,
        },
      ],
    });

    // let responseMessage = '';

    // res.writeHead(200, {
    //     'Content-Type': 'text/plain',
    //     'Transfer-Encoding': 'chunked'
    // });

    // for await (const part of stream) {
    //     const chunk = part.choices[0].delta.content;
    //     responseMessage += chunk;
    //     console.log(chunk);
    //     // res.write(chunk);
    // }

    const responseMessage = stream.choices[0].message.content;

    await Message.create({
      text: responseMessage,
      isUserMessage: false,
      fileId,
      userId: req.user.id,
    });

    res.status(200).json({
      message: "Message sent successfully",
      success: true,
      responseMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export {
  createFile,
  deleteFile,
  fetchFiles,
  fetchFileDetails,
  vectorizePDF,
  fetchFileStatus,
  sendMessage,
  getFileMessages,
};
