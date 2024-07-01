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

router.post("/create", isAuthenticated, createFile);
router.get("/fetchFiles", isAuthenticated, fetchFiles);
router.delete("/:fileId", isAuthenticated, deleteFile);
router.get("/:fileId", isAuthenticated, fetchFileDetails);
router.get("/status/:fileId", isAuthenticated, fetchFileStatus);
router.get("/messages/:fileId", getFileMessages);
router.post("/messages/:fileId", isAuthenticated, sendMessage);
router.post("/vectorize", isAuthenticated, vectorizePDF);

export { router as askPDFRouter };
