import { Schema, model, Document, Types } from "mongoose";
interface IComment extends Document {
  isDeleted: boolean;
  content: string;
  postId: Types.ObjectId;
  createdBy: string;
  updatedBy: string;
  username: string;
}

const commentSchema = new Schema<IComment>(
  {
    isDeleted: { type: Boolean, default: false },
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    createdBy: { type: String, default: "admin" },
    updatedBy: { type: String, default: "admin" },
    username: { type: String, default: "admin" },
  },
  { timestamps: true },
);
const Comment = model<IComment>("Comment", commentSchema);
export default Comment;
