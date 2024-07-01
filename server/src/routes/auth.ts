import express from "express";
import passport from "passport";
import { validateData } from "../middlewares/validateData";
import { loginSchema, signupSchema } from "../validations/auth";
import {
  googleLogin,
  githubLogin,
  login,
  signup,
  handleSendOtp,
  handleUpdatePassword,
} from "../controllers/auth";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.post("/signup", validateData(signupSchema), signup);
router.post("/login", validateData(loginSchema), login);
router.post("send-otp/:userId", isAuthenticated, handleSendOtp);
router.put("/password/:userId", isAuthenticated, handleUpdatePassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
  }),
  googleLogin,
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["profile", "email"] }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login/failed",
  }),
  githubLogin,
);

router.get("/login/failed", (req, res) => {
  res.status(401).json({ message: "Login failed" });
});

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.user,
    });
  }
  res.status(401).json({ message: "Login failed" });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5173/");
  });
});

export { router as authRouter };
