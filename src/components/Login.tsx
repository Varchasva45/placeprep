import React, { useState } from "react";
import {toast} from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import NavBar from "./NavBar";
import { authEndpoints } from "../services/apis";
import axios  from "axios";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import authState from "../recoil/atoms/auth";
import userState from "../recoil/atoms/user";

const Login: React.FC = () => {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { login_API } = authEndpoints;
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
            const response = await axios.post(login_API, {
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

    return (
        <div className="bg-gray-100 flex flex-col h-screen">
            <NavBar />
    
            <div className="flex flex-grow justify-center items-center">
                <form className="w-[30%] h-[90%] flex flex-col items-center justify-center bg-white shadow-sm rounded-lg" onSubmit={handleFormSubmit}>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" name="email" id="email" />
    
                    <label htmlFor="password">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password" 
                            id="password" 
                        />
                        <button 
                            type="button" 
                            className="absolute top-1/2 right-2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>

                    <button 
                        type="submit"    
                    >
                        Login   
                    </button>
                </form>
            </div>            
        </div>
    );    
}

export default Login;
