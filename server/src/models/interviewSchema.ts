import mongoose, { Document, Schema } from "mongoose";
import getDb from "./db";

interface Interview extends Document {
    interviewer: string;
    interviewee: string;
}

const interviewSchema = new Schema<Interview>({
    interviewer: {
        type: String,
        required: true
    },
    interviewee: {
        type: String,
        required: true
    }
});

const InterviewModel = getDb('interview_db').model<Interview>("Interview", interviewSchema);
export default InterviewModel;
