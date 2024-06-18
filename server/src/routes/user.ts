import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  getSubmissionDetails,
  getUserDetails,
  updateUserDetails,
  updateUsername,
} from "../controllers/user";

const router = express.Router();

router.get("/:userId", isAuthenticated, getUserDetails);
router.get("/submissions/:userId", isAuthenticated, getSubmissionDetails);
router.put("/:userId", isAuthenticated, updateUserDetails);
router.put("/username/:userId", isAuthenticated, updateUsername);

export { router as userRouter };
