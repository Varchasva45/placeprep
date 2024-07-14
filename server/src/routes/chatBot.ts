import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { fetchMessages, sendMessage } from "../controllers/chatBot";


const router = express.Router();

router.get("/messages/:chatId", isAuthenticated, fetchMessages);
router.post("/message", isAuthenticated, sendMessage);

export { router as chatBotRouter };