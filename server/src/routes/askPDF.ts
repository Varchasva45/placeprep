import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createFile, deleteFile, fetchFileDetails, fetchFiles } from "../controllers/askPDF";

const router = express.Router();

// add validations

router.post('/createFile', isAuthenticated, createFile);
router.delete('/deleteFile/:fileId', isAuthenticated, deleteFile); 
router.get('/fetchFiles', isAuthenticated, fetchFiles);
router.get('/files/:fileId', isAuthenticated, fetchFileDetails);
router.post('/message', isAuthenticated);

export { router as askPDFRouter }