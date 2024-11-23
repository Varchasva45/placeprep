import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authEndpoints } from "../services/apis";
import axios from "axios";
import Cookies from "js-cookie";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import authState from "../recoil/atoms/auth";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import userState from "../recoil/atoms/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import OTPInput from "../components/OtpInput";

const Signup = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { signUp_API } = authEndpoints;
  const [authAtom, setAuthAtom] = useRecoilState(authState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setUserAtom = useSetRecoilState(userState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Signing up...");

    if (!email || !password) {
      toast.error("Please fill in all fields");
      toast.dismiss(toastId);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(signUp_API, {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        if (token) {
          Cookies.set("token", token);
        }

        if (user) {
          Cookies.set("user", JSON.stringify(user));
        }

        setUserAtom(user);
        setAuthAtom({ isAuthenticated: true, token });
        toast.success(response.data.message);
        navigate(`/u/${user.username}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "An error occurred, please try again",
      );
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  const handleSignupWithGoogle = async () => {
    try {
      window.open(`http://localhost:3000/api/auth/google`, "_self");
      if (Cookies.get("token")) {
        toast.success("Logged in successfully");
        setAuthAtom({ isAuthenticated: true, token: Cookies.get("token")! });
      }
    } catch (error) {
      toast.error("Failed to login with Google");
    }
  };

  const handleSignUpWithGithub = async () => {
    try {
      window.open(`http://localhost:3000/api/auth/github`, "_self");
      if (Cookies.get("token")) {
        setAuthAtom({ isAuthenticated: true, token: Cookies.get("token")! });
        toast.success("Logged in successfully");
      }
    } catch (error) {
      toast.error("Failed to login with Github");
    }
  };

  const textVariant = {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: "rgba(255, 255, 255, 0)",
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: "rgba(255, 255, 255, 1)",
    },
  };

  if (authAtom.isAuthenticated) {
    return <Link to={`/u/${user.username}`} />;
  }

  return (
    <div className="bg-white flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
        <div className="bg-gray-900 flex flex-col justify-center items-center">
          <motion.h1
            className="text-white text-4xl font-bold mb-4"
            initial="hidden"
            animate="visible"
            variants={textVariant}
            transition={{
              default: { duration: 2, ease: "easeInOut" },
              fill: { duration: 2, ease: [1, 0, 0.8, 1] },
            }}
          >
            Welcome to PlacePrep
          </motion.h1>
          <p className="text-gray-400 text-lg mb-8">
            Sign up or log in to get started
          </p>
          <div className="flex gap-2">
            <Button
              disabled={isLoading}
              onClick={handleSignupWithGoogle}
              className="text-white border-white border-2 px-4 py-2 rounded-lg hover:bg-white hover:text-gray-900 flex items-center mb-4"
            >
              <FaGoogle className="mr-2 h-5 w-5" />
              Signup with Google
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleSignUpWithGithub}
              className="text-white border-white border-2 px-4 py-2 rounded-lg hover:bg-white hover:text-gray-900 flex items-center mb-4"
            >
              <FaGithub className="mr-2 h-5 w-5" />
              Signup with Github
            </Button>
          </div>
        </div>
        <div className="bg-zinc-100 flex flex-col justify-center items-center">
          <motion.div
            className="w-full max-w-md bg-white shadow-xl rounded-lg p-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Sign Up</h2>
              <p className="text-gray-600">
                Enter your details to create an account.
              </p>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-600">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-gray-600">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                disabled={isLoading}
                className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Sign Up
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  
                </DialogTrigger>
                <DialogContent className="h-6/12 w-4/12 bg-gray-100 px-10 py-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl mb-2">
                      Verify Your Email
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 text-md">
                      We have sent a 6-digit code to your email. Enter the code
                      to confirm that it's you.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <OTPInput />
                  </div>
                  <div className="flex text-md mt-4">
                    Didn't Recieve Code?{" "}
                    <span className="text-blue-600 ml-2">Resend Code</span>
                  </div>
                  <Button
                    onClick={() => {
                      handleFormSubmit;
                    }}
                  >
                    Submit
                  </Button>
                </DialogContent>
              </Dialog>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?
              <Link
                to={"/login"}
                className="font-medium underline text-black hover:text-neutral-700 pl-2"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
