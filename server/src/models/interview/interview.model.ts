import mongoose, { Document, Model, Schema } from "mongoose";
import getDb from "./db";

interface Interview extends Document {
    interviewer: string;
    intervieweeName: string;
    intervieweeId: mongoose.Types.ObjectId;
    position: string;
    date: Date;
    questions: string[];
    evaluation: string[];
    feedback: string;
}

const interviewSchema = new Schema<Interview>({
    interviewer: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value: string) => {
                return value === "AI" || value === "String";
            },
            message: "Interviewer must be 'AI' or 'String'"
        }
    },
    intervieweeName: {
        type: String,
        required: true,
        trim: true
    },
    intervieweeId: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    questions: {
        type: [String],
        required: true
    },
    evaluation: {
        type: [String],
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
});

function InterviewModel(intervieweeId: mongoose.Types.ObjectId): Model<Interview> {
    const modelName = intervieweeId.toHexString(); 
    return getDb('interviews').models[modelName] || getDb('interviews').model<Interview>(modelName, interviewSchema);
}

export default InterviewModel;
