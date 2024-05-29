import React, { useState } from "react";
import {toast} from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FaGoogle } from "react-icons/fa";
import NavBar from "./NavBar";
import { authEndpoints } from "../services/apis";
import axios  from "axios";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import authState from "../recoil/atoms/auth";
import userState from "../recoil/atoms/user";
import { motion } from "framer-motion";

const Signup: React.FC = () => {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { signUp_API } = authEndpoints;
    const setAuthState = useSetRecoilState(authState);
    const setUserState = useSetRecoilState(userState);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if(!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post(signUp_API, {
                email,
                password
            });
        
            if(response.data.success) {
                // Error while Updating States
                const { token, user } = response.data;
                Cookies.set('token', token);
                Cookies.set('user', JSON.stringify(user));
                setAuthState({ isAuthenticated: true, token });
                // setUserState(user);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message || 'An error occurred, please try again');
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
        <div className="bg-gray-100 flex flex-col h-screen">
        <NavBar />
        <div className="grid grid-cols-1 md:grid-cols-2 h-screen w-full">
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
            <button className="text-white border-white border-2 px-4 py-2 rounded hover:bg-white hover:text-gray-900 flex items-center">
              <FaGoogle className="mr-2 h-5 w-5" />
              Sign in with Google
            </button>
          </div>
          <div className="bg-white flex flex-col justify-center items-center">
            <motion.div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01]
            }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Sign Up</h2>
                <p className="text-gray-600">Enter your details to create an account.</p>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-gray-600">Email</label>
                  <input id="email" type="email" placeholder="Enter your email" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-gray-600">Password</label>
                  <div className="relative">
                    <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Sign Up</button>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account? 
                <a href="#" className="font-medium underline text-black hover:text-neutral-700"> Log in</a>
              </div>
            </motion.div>
          </div>
        </div>
        </div>
      );
}

export default Signup;