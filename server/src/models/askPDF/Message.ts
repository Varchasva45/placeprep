import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

interface Message extends Document {
    text: string;
    isUserMessage: boolean;
    file: ObjectId;
    user: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<Message>({
    text: {
        type: String,
        trim: true,
        required: true
    },
    isUserMessage: {
        type: Boolean,
        required: true
    },
    file: {
        type: Schema.Types.ObjectId,
        ref: "File",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const Message: Model<Message> = mongoose.model<Message>("Message", messageSchema);
export default Message;
