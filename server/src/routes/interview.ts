import express from 'express';
import { spawn } from "child_process";
import mongoose from 'mongoose';
import InterviewModel from '../models/interview/interview.model';
import questionModel from '../models/interview/question.model';

const router = express.Router();

router.post('/take-interview', async (req, res) => {

  const { position, topic, intervieweeName} = req.body;
  const questionsDocument = await questionModel.find({position: position, topic: topic}).limit(5);
  const questions = questionsDocument[0]?.questions.map((question: any) => question.statement);

  const pythonProcess = spawn("python", ["../server/src/interview_llm/listen_and_evaluate.py"]);

  pythonProcess.stdin.write(JSON.stringify(questions));
  pythonProcess.stdin.end();

  let evaluationData: any;

  pythonProcess.stdout.on("data", (data) => {
    const response = data.toString();
    const startIndex = response.indexOf("evaluations:") + "evaluations:".length;
    evaluationData = response.substring(startIndex);
    console.log("here", response, "here2", evaluationData);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python script error: ${data}`);
    res.status(500).send("Internal Server Error in processing the interview");
  });

  pythonProcess.on("close", async (code) => {
    console.log(`Python script exited with code ${code}`);
    try {
      const interviewData = {
        interviewer: "AI",
        intervieweeName: intervieweeName,
        intervieweeId: new mongoose.Types.ObjectId("6226e4e7a9e12a001e5c3a5e"),
        position: position,
        date: new Date(),
        questions: questions,
        evaluation: evaluationData,
        feedback: "Great candidate!"
      };
  
      await InterviewModel(interviewData.intervieweeId).create(interviewData);
      res.status(200).json({ message: "Interview saved successfully!"});
  
    } catch (error) {
      console.error("Error saving interview:", error);
      res.status(500).json({ message: "Failed to save interview." });
    }
  });

});

export { router as interviewRouter };