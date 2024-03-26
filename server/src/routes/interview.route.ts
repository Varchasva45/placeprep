import express from 'express';
import { spawn } from "child_process";
import InterviewModel from '../models/interviewSchema';
const router = express.Router();

router.post('/take-interview', async (req, res) => {

  console.log("inside /take-interview in interview route");

  const pythonProcess = spawn("python", ["../server/src/interview_llm/listen_and_evaluate.py"]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Evaluation for the interview: ${data}`);
    res.send(data.toString());
  });


  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python script error: ${data}`);
    res.status(500).send("Internal Server Error");
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
  })
 
});

export default router;