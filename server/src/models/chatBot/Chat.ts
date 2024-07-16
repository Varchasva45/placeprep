import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

interface Chat extends Document {
  name: string;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<Chat>(
  {
    name: {
      type: String,
      trim: true,
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

const Chat: Model<Chat> = mongoose.model<Chat>("Chat", chatSchema);
export default Chat;
