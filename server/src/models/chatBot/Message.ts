import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

interface Message extends Document {
  text: string;
  isUserMessage: boolean;
  chatId: ObjectId;
  userId: ObjectId;
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
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
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
  "ChatMessage",
  messageSchema,
);
export default Message;
