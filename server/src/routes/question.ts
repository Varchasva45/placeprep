import express from "express";
import questionModel from "../models/interview/question.model";

const router = express.Router();

router.post("/add-question", async (req, res) => {
  const { position, topic, type, difficulty, questions } = req.body;

  try {
    const questionData = {
      position,
      topic,
      type,
      difficulty,
      questions,
    };

    await questionModel.create(questionData);
    res.status(200).send("Question added successfully!");
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).send("Failed to add question.");
  }
});

export { router as questionRouter };
