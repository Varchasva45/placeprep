import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

interface File extends Document {
    name: string;
    uploadStatus: string;
    url: string;
    key: string;
    owner: ObjectId;
    messages: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const fileSchema = new Schema<File>({
    name: {
        type: String,
        trim: true,
        required: true
    },
    uploadStatus: {
        type: String,
        default: "Success",
        trim: true,
        required: true
    },
    url: {
        type: String,
        trim: true,
        required: true
    },
    key: {
        type: String,
        trim: true,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message",
    }]
}, {
    timestamps: true
});

const File: Model<File> = mongoose.model<File>("File", fileSchema);
export default File;
