import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { sendMessage } from "../controllers/chatBot";


const router = express.Router();
router.post("/message", sendMessage);


export { router as chatBotRouter };