import React, { useEffect, useState } from "react";
import {toast} from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authEndpoints } from "../services/apis";
import axios  from "axios";
import Cookies from "js-cookie";
import { useRecoilState, useSetRecoilState } from "recoil";
import authState from "../recoil/atoms/auth";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const Login = () => {

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login_API } = authEndpoints;
  const [authAtom, setAuthAtom] = useRecoilState(authState);
  const setUserAtom = useSetRecoilState(authState);
  const navigate = useNavigate();

  useEffect(() => {
    if(authAtom.isAuthenticated) {
      navigate('/');
    }
  },  [authAtom, setAuthAtom]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const toastId = toast.loading('Logging in...');
      const formData = new FormData(e.currentTarget);
      console.log(formData, e);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if(!email || !password) {
          toast.error('Please fill in all fields');
          return;
      }

      try {
          const response = await axios.post(login_API, {
              email,
              password
          });
      
          if(response.data.success) {
              const { token , user } = response.data;
              if(token) {
                Cookies.set('token', token);
              }

              if(user) {
                Cookies.set('user', JSON.stringify(user));
              }

              setAuthAtom({ isAuthenticated: true, token });
              setUserAtom(user);
              toast.success(response.data.message);
          } else {
              toast.error(response.data.message);
          }
      } catch (error: any) {
          toast.error(error.response.data.message ? error.response.data.message : 'An error occurred, please try again');
      }

      toast.dismiss(toastId);
  }

  const handleSignupWithGoogle = async () => {
    try {
      window.open(`http://localhost:3000/auth/google`, '_self');
      if(Cookies.get('token')) {
        toast.success('Logged in successfully');
        setAuthAtom({ isAuthenticated: true, token: Cookies.get('token')! });
      }
    } catch (error) {
      toast.error('Failed to login with Google');
    }
  }

  const handleSignUpWithGithub = async () => { 
    try {
      window.open(`http://localhost:3000/auth/github`, '_self');
      if(Cookies.get('token')) {
        toast.success('Logged in successfully');
        setAuthAtom({ isAuthenticated: true, token: Cookies.get('token')! });
      }
    } catch (error) {
      toast.error('Failed to login with Github');
    }
  }

  const textVariant = {
      hidden: {
          opacity: 0,
          pathLength: 0,
          fill: "rgba(255, 255, 255, 0)"
        },
        visible: {
          opacity: 1,
          pathLength: 1,
          fill: "rgba(255, 255, 255, 1)"
        }
    };

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
              fill: { duration: 2, ease: [1, 0, 0.8, 1] }
            }}
            >
            Welcome to PlacePrep
            </motion.h1>
            <p className="text-gray-400 text-lg mb-8">Sign up or log in to get started.</p>
            <div className="flex gap-2">
              <Button className="text-white border-white border-2 px-4 py-2 rounded-lg hover:bg-white hover:text-gray-900 flex items-center mb-4" onClick={handleSignupWithGoogle}>
                <FaGoogle className="mr-2 h-5 w-5" />
                Login with Google
              </Button>
              <Button className="text-white border-white border-2 px-4 py-2 rounded-lg hover:bg-white hover:text-gray-900 flex items-center mb-4" onClick={handleSignUpWithGithub}>
                <FaGithub className="mr-2 h-5 w-5" />
                Login with Github
              </Button>
            </div>
            
          </div>
          <div className="bg-zinc-100 flex flex-col justify-center items-center">
            <motion.div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0, 0.71, 0.2, 1.01]
            }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Log In</h2>
                <p className="text-gray-600">Enter your details to login to your account</p>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-gray-600">Email</label>
                  <input id="email" name="email" type="email" placeholder="Enter your email" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-gray-600">Password</label>
                  <div className="relative">
                    <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Login</Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Don't have an account? 
                <Link to={'/signup'} className="font-medium underline text-black hover:text-neutral-700 pl-2">Signup</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
}

export default Login;