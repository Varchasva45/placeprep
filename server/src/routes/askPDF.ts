import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { fetchFiles } from "../controllers/askPDF";

const router = express.Router();

router.get('/fetchFiles', isAuthenticated, fetchFiles);

export { router as askPDFRouter }