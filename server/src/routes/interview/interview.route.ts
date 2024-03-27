import express from 'express';
import { spawn } from "child_process";
import mongoose from 'mongoose';
import InterviewModel from '../../models/interview/interview.model';

const router = express.Router();

router.post('/take-interview', async (req, res) => {

  // console.log("inside /take-interview in interview route");

  // const pythonProcess = spawn("python", ["../server/src/interview_llm/listen_and_evaluate.py"]);

  // pythonProcess.stdout.on("data", (data) => {
  //   console.log(`Evaluation for the interview: ${data}`);
  //   res.send(data.toString());
  // });


  // pythonProcess.stderr.on("data", (data) => {
  //   console.error(`Python script error: ${data}`);
  //   res.status(500).send("Internal Server Error");
  // });

  // pythonProcess.on("close", (code) => {
  //   console.log(`Python script exited with code ${code}`);
  // })

  try {
    const interviewData = {
      interviewer: "AI",
      intervieweeName: "Nandini Sharma",
      intervieweeId: new mongoose.Types.ObjectId("6226e4e7a9e12a001e5c3a5e"),
      position: "Software Engineer",
      date: new Date(),
      questions: ["Tell me about yourself.", "What are your strengths and weaknesses?"],
      evaluation: ["Excellent communication skills.", "Strong technical background."],
      feedback: "Great candidate!"
    };

    
    await InterviewModel(interviewData.intervieweeId).create(interviewData);
    res.status(200).json({ message: "Interview saved successfully!" });

  } catch (error) {
    console.error("Error saving interview:", error);
    res.status(500).json({ message: "Failed to save interview." });
  }

});

export { router as interviewRouter };