import mongoose, { Document, Schema } from "mongoose";

// Define the ISubmission interface
interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  question_id: mongoose.Types.ObjectId;
  result: string;
  timeTaken: number;
  memoryUsed: number;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
    timeTaken: {
      type: Number,
      required: true,
    },
    memoryUsed: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Submission = mongoose.model<ISubmission>("Submission", SubmissionSchema);

export default Submission;
