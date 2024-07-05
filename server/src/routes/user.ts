import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  getSubmissionDetails,
  getUserDetails,
  updateUserDetails,
  updateUsername,
  handleUpdateEmail,
  postController,
  getPosts,
  getPost,
  updatePostController,
  postCommentController,
  deletePostController,
  deleteCommentController,
  editPostController,
  editCommentController
} from "../controllers/user";

const router = express.Router();

router.get("/postDiscussion", getPosts)
router.get("/:userId", isAuthenticated, getUserDetails);
router.get("/submissions/:userId", isAuthenticated, getSubmissionDetails);
router.put("/:userId", isAuthenticated, updateUserDetails);
router.put("/username/:userId", isAuthenticated, updateUsername);
router.put("/email/:userId", isAuthenticated, handleUpdateEmail);
router.get("/postDiscussion/:id", getPost)
router.post("/postDiscussion", postController);
router.patch("/postDiscussion/:id", updatePostController);
router.post("/comments/:id", postCommentController);
router.patch("/deletePost/:id", deletePostController);
router.patch("/deleteComment/:id", deleteCommentController);
router.patch("/updatePost/:id", editPostController);
router.patch("/updateComment/:id", editCommentController);


export { router as userRouter };
