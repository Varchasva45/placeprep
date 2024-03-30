import mongoose, { Document, Model, Schema } from "mongoose";
import getDb from "./db";

interface Questions extends Document {
    position: string;
    topic: string;
    questions: [Object];
    type: string;
    difficulty: string;
}

const questionSchema = new Schema<Questions>({
    position: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value: string) => {
                return value === "theoritical" || value === "coding" || value === "behavioral";
            },
            message: "Type must be 'technical' or 'behavioral'"
        }
    },
    difficulty: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value: string) => {
                return value === "easy" || value === "medium" || value === "hard";
            },
            message: "Difficulty must be 'easy', 'medium', or 'hard'"
        }
    },
    questions: {
        type: [Object],
        required: true
    }
});


const questionModel = mongoose.connection.model<Questions>("Questions", questionSchema);

export default questionModel;
