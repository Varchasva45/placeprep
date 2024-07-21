import { Request, Response } from "express";
import { openai2 } from "../config/openAI";
import Message from "../models/chatBot/Message";
import Chat from "../models/chatBot/Chat";

export const fetchMessages = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;
    const cursor = req.query.cursor;
    let query;
    if (cursor !== "undefined") {
      query = { chatId, userId: req.user.id, _id: { $lte: cursor } };
    } else {
      query = { chatId, userId: req.user.id };
    }

    const messages = await Message.find(query).limit(6).sort({ createdAt: -1 });
    if (!messages) {
      return res
        .status(404)
        .json({ message: "Messages not found", success: false });
    }

    let nextCursor: any = undefined;
    if (messages.length > 5) {
      nextCursor = messages[5]?._id;
      messages.pop();
    }

    res.status(200).json({ messages, nextCursor, success: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    //   const fileId = req.params.fileId;
    const { message, chatId } = req.body;
    const userId = req.user.id;
    //   const file = await File.findById(fileId);

    //   if (!file) {
    //     return res
    //       .status(404)
    //       .json({ message: "File not found", success: false });
    //   }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found", success: false });
    }
    if (chat.name === "New Chat") {
      // generate a valid name from the first message
      chat.name = message.substring(0, 20);
      await chat.save();
    }

    await Message.create({
      text: message,
      isUserMessage: true,
      chatId,
      userId,
    });

    const prevMessages = await Message.find({ chatId, userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedPrevMessages: any = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: msg.text,
    }));

    const stream = await openai2.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      temperature: 0,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "You are a coding expert who will help users on a coding plattform to do the following. Use the following user message (or previous conversaton if needed) to answer the users question in markdown format.",
        },
        {
          role: "user",
          content: `Use the following user message (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
                  
              \n----------------\n
              
            PREVIOUS CONVERSATION:
            ${formattedPrevMessages.map((message: any) => {
              if (message.role === "user") return `User: ${message.content}\n`;
              return `Assistant: ${message.content}\n`;
            })}
            
            \n----------------\n
              
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
      chatId,
      userId,
    });

    const AIMessage = {
      text: responseMessage,
      isUserMessage: false,
      chatId,
      userId,
    };

    const userMessage = {
      text: message,
      isUserMessage: true,
      chatId,
      userId,
    };

    res.status(200).json({
      message: "Message sent successfully",
      success: true,
      AIMessage,
      userMessage,
      chat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const createChat = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    const chat = await Chat.create({ name, userId });
    res.status(200).json({ chat, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ userId, isDeleted: false }).sort({
      createdAt: -1,
    });
    console.log(chats);
    res.status(200).json({ chats, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const updateChat = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;
    const { name } = req.body;
    const userId = req.user.id;
    const chat = await Chat.findOneAndUpdate({ _id: chatId, userId }, { name });
    res.status(200).json({ chat, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.user.id;
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { isDeleted: true },
    );
    res.status(200).json({ chat, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
