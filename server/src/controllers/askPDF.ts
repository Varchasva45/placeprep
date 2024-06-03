import { Request, Response } from "express";
import File from "../models/askPDF/File";

const fetchFiles = async (req: Request, res: Response) => {
    try {
        const files = await File.find({ owner: req.user.id });
        res.status(200).json({ files, message: 'Files fetched successfully', success: true });
    } catch (error) {
        console.log('500 error while fetching files', error)
        res.status(500).json({ message: "Internal server error", success: false});
    }
};

export { fetchFiles };