import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

interface Message extends Document {
  text: string;
  isUserMessage: boolean;
  fileId: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<Message>(
  {
    text: {
      type: String,
      trim: true,
      required: true,
    },
    isUserMessage: {
      type: Boolean,
      required: true,
    },
    fileId: {
      type: Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Message: Model<Message> = mongoose.model<Message>(
  "Message",
  messageSchema,
);
export default Message;
