import mongoose, { Schema, model, Document } from "mongoose";

interface IPost extends Document {
  isDeleted: boolean;
  title: string;
  content: string;
  tag: string;
  createdBy: string;
  updatedBy: string;
  username: string;
  likes: number;
  dislikes: number;
  views: number;
  comments: mongoose.Types.ObjectId[];
}

const postSchema = new Schema<IPost>(
  {
    isDeleted: { type: Boolean, default: false },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String },
    createdBy: { type: String, default: "admin" },
    updatedBy: { type: String, default: "admin" },
    username: { type: String, default: "admin" },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true },
);

const Post = model<IPost>("Post", postSchema);
export default Post;
