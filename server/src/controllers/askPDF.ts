import { Request, Response } from "express";
import File from "../models/askPDF/File";


const createFile = async (req: Request, res: Response) => {
    try {
        const { url, name, key, owner } = req.body;
        const newFile = await File.create({ url, name, key, owner });
        res.status(201).json({ message: 'File created successfully', success: true, fileId: newFile._id});
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false});
    }
}

const deleteFile = async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;
        await File.findByIdAndDelete(fileId);
        res.status(200).json({ message: 'File deleted successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false});
    }
}

const fetchFiles = async (req: Request, res: Response) => {
    try {
        const files = await File.find({ owner: req.user.id });
        res.status(200).json({ message: 'Files fetched successfully', success: true, files});
    } catch (error) {
        console.log('500 error while fetching files', error)
        res.status(500).json({ message: "Internal server error", success: false});
    }
};


const fetchFileDetails = async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;
        const file = await File.findById(fileId);
        res.status(200).json({ message: 'File details fetched successfully', success: true, file });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false});
    }
}

export { 
    createFile,
    deleteFile,
    fetchFiles,
    fetchFileDetails
};