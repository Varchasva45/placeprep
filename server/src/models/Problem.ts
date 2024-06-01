import { Schema, model, Document } from 'mongoose';

interface IProblem extends Document {
  question_id: number;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
}

const problemSchema = new Schema<IProblem>({
  question_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  tags: { type: [String], required: true },
});

const Problem = model<IProblem>('Problem', problemSchema);

export default Problem;
