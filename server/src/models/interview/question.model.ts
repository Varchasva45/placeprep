import mongoose, { Document, Model, Schema } from "mongoose";
import getDb from "./db";
import { isQuestionOrPlusOrMinusToken } from "typescript";

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
        type: [{
            statement: {
                type: String,
                required: true,
                trim: true
            },
            testCases: {
                type: [{input: Object, output: Object}]
            }, 
            constraints: {
                type: Object
            }
        }],
        required: true
    }
});

function questionModel(position: string): Model<Questions> { 
    return getDb('questions').models[position] || getDb('questions').model<Questions>(position, questionSchema);
}

export default questionModel;
