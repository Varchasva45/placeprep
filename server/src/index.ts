import express, { Request, Response } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import { questionRouter } from "./routes/question";
import { interviewRouter } from "./routes/interview";
import { problemRouter } from "./routes/problem";
import { authRouter } from "./routes/auth";
import { askPDFRouter } from "./routes/askPDF";
import cors from "cors";
import dotenv from "dotenv";
import "./passport";
import session from "express-session";
import passport from "passport";
import { userRouter } from "./routes/user";

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/placeprep_db";

const app = express();

app.use(
  session({
    name: "placeprep",
    secret: "Skey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 86400000 },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());

app.use("/interview", interviewRouter);
app.use("/question", questionRouter);
app.use("/auth", authRouter);
app.use("/askPDF", askPDFRouter);
app.use("/problem", problemRouter);
app.use("/users", userRouter);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log("Connected to database");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
}

startServer();
