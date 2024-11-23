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
  editCommentController,
  getUserPosts
} from "../controllers/user";

const router = express.Router();

router.get("/postDiscussion", getPosts);
router.get("/discussions/:username", getUserPosts);
router.post("/postDiscussion", isAuthenticated, postController);
router.get("/:username", getUserDetails);
router.get("/submissions/:userId", getSubmissionDetails);
router.put("/:userId", isAuthenticated, updateUserDetails);
router.put("/username/:userId", isAuthenticated, updateUsername);
router.put("/email/:userId", isAuthenticated, handleUpdateEmail);
router.get("/postDiscussion/:id", getPost);
router.patch("/postDiscussion/:id", updatePostController);
router.post("/comments/:id", isAuthenticated, postCommentController);
router.patch("/deletePost/:id", isAuthenticated, deletePostController);
router.patch("/deleteComment/:id", isAuthenticated,  deleteCommentController);
router.patch("/updatePost/:id", isAuthenticated, editPostController);
router.patch("/updateComment/:id", isAuthenticated, editCommentController);

export { router as userRouter };
