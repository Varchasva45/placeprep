import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  getSubmissionDetails,
  getUserDetails,
  updateUserDetails,
  updateUsername,
  handleUpdateEmail
} from "../controllers/user";

const router = express.Router();

router.get("/:userId", isAuthenticated, getUserDetails);
router.get("/submissions/:userId", isAuthenticated, getSubmissionDetails);
router.put("/:userId", isAuthenticated, updateUserDetails);
router.put("/username/:userId", isAuthenticated, updateUsername);
router.put("/email/:userId", isAuthenticated, handleUpdateEmail);

export { router as userRouter };
