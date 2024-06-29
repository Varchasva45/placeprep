import express from "express";
import Problem from "../models/Problem";

const router = express.Router();

router.post("/api/problems", async (req, res) => {
  try {
    console.log("reached", req.body);
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).send(problem);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/api/problems", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const filterQuery = req.query.filter
      ? JSON.parse(req.query.filter as string)
      : {};

    const problems = await Problem.find(filterQuery)
      .sort({ question_id: 1 })
      .skip(skip)
      .limit(pageSize);
    const totalProblems = await Problem.countDocuments(filterQuery);

    res.status(200).json({
      problems,
      totalProblems,
      totalPages: Math.ceil(totalProblems / pageSize),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch problems" });
  }
});

router.get("/api/problems/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).send();
    }
    res.send(problem);
  } catch (error) {
    res.status(500).send();
  }
});

export { router as problemRouter };
