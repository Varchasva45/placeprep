import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { fetchMessages, sendMessage, createChat, getChats} from "../controllers/chatBot";

const router = express.Router();

router.post("/createChat", isAuthenticated, createChat);
router.get("/chats", isAuthenticated, getChats);
router.post("/message", isAuthenticated, sendMessage);
router.get("/messages/:chatId", isAuthenticated, fetchMessages);


export { router as chatBotRouter };
