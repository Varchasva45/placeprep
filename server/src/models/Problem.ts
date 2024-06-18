import { Schema, model, Document } from "mongoose";

// Define the problem interface
interface IProblem extends Document {
  isDeleted: boolean;
  question_id: number;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  createdBy: string;
  updatedBy: string;
}

// Define the problem schema
const problemSchema = new Schema<IProblem>(
  {
    isDeleted: { type: Boolean, default: false },
    question_id: { type: Number, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => {
          return value === "Easy" || value === "Medium" || value === "Hard";
        },
        message: "Difficulty must be 'easy', 'medium', or 'hard'",
      },
    },
    tags: { type: [String], required: true },
    createdBy: { type: String, default: "admin" },
    updatedBy: { type: String, default: "admin" },
  },
  { timestamps: true },
);

// Pre-save hook to increment the question_id
problemSchema.pre<IProblem>("save", async function (next) {
  if (!this.question_id) {
    const lastProblem = await Problem.findOne(
      {},
      {},
      { sort: { question_id: -1 } },
    );
    this.question_id = lastProblem ? lastProblem.question_id + 1 : 1;
  }
  next();
});

// Create and export the Problem model
const Problem = model<IProblem>("Problem", problemSchema);

export default Problem;
