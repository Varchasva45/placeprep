import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  createFile,
  deleteFile,
  fetchFileDetails,
  fetchFileStatus,
  fetchFiles,
  getFileMessages,
  sendMessage,
  vectorizePDF,
} from "../controllers/askPDF";

const router = express.Router();

// add validations
router.post("/createFile", isAuthenticated, createFile);
router.delete("/deleteFile/:fileId", isAuthenticated, deleteFile);
router.get("/fetchFiles", isAuthenticated, fetchFiles);
router.get("/files/:fileId", isAuthenticated, fetchFileDetails);
router.get("/files/fileStatus/:fileId", isAuthenticated, fetchFileStatus);
router.post("/message", isAuthenticated, sendMessage);
router.get("/getFileMessages", getFileMessages);
router.post("/vectorize-pdf", isAuthenticated, vectorizePDF);

export { router as askPDFRouter };
