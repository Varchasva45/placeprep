import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useRecoilValue } from "recoil";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import mongoose from "mongoose";
import axios from "axios";
import authState from "../recoil/atoms/auth";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authEndpoints, userEndpoints } from "../services/apis";
import Cookies from "js-cookie";
interface IuserDetails {
  _id: mongoose.Types.ObjectId;
  name?: string;
  username: string;
  email?: string;
  password: string;
  imageUrl: string;
  githubAccount?: string;
  linkedInAccount?: string;
  personalInformation: {
    summary: string;
    location: string;
    education: string;
    linkedInLink: string;
    githubLink: string;
    _id: mongoose.Types.ObjectId;
  };
  profileStats: {
    views: number;
    respect: number;
    activeDays: { count: number; year: number }[];
    submissionCount: { count: number; year: number }[];
    programmingLanguages: { language: string; problemCount: number }[];
    _id: mongoose.Types.ObjectId;
  };
  isSubscribed: boolean;
  role: string;
}

type EditProfilePageProps = {
  userDetails: IuserDetails | null;
  setUserDetails: any;
};

const AccountInformationPage = ({
  userDetails,
  setUserDetails,
}: EditProfilePageProps) => {
  const auth = useRecoilValue(authState);
  const [editMode, setEditMode] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    Email: "",
    Password: userDetails?.password || "",
    Username: "",
  });
  const { sendOtp_API } = authEndpoints;
  const { updateEmail_API, updateUsername_API } = userEndpoints;
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode) {
      inputRef.current?.focus();
    }
  }, [editMode]);

  const handleEditClick = (field: string) => {
    setEditMode(field);
    inputRef.current?.focus();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Sending OTP to your Email");

    if (!formData.Email || !isEmailValid(formData.Email)) {
      toast.error("Please enter a valid email address");
      toast.dismiss(toastId);
      setIsLoading(false);
      return;
    }

    const body = {
      email: formData.Email,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    };

    try {
      const apiUrl = `${sendOtp_API}/${userDetails?._id}`;

      const response = await axios.post(apiUrl, body, config);

      toast.dismiss(toastId);

      if (response.data?.success) {
        toast.success("Sent OTP to your Email");
      } else {
        const errorMessage = response.data?.message || "Error sending OTP";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.dismiss(toastId);

      if(error.response.status === 401) {
        Object.keys(Cookies.get()).forEach(cookieName => {
          Cookies.remove(cookieName);
        });

        window.location.href = '/login'
      }

      const errorMessage = error.response?.data?.message || "Error sending OTP";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Verifying OTP");
    if (
      !formData.Email ||
      !isEmailValid(formData.Email) ||
      !otp ||
      otp.length < 6 ||
      otp.length > 6
    ) {
      toast.error("Please enter a valid email and OTP");
      toast.dismiss(toastId);
      setIsLoading(false);
      return;
    }
    try {
      const apiUrl = `${updateEmail_API}/${userDetails?._id}`;
      const body = {
        email: formData.Email,
        otp,
      };

      const response = await axios.post(apiUrl, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        toast.dismiss(toastId);
        toast.success("Email updated successfully");
        setUserDetails({
          ...userDetails,
          email: response.data.email,
        });
        formData.Email = "";
        setOtp("");
        setEditMode(null);
      } else {
        toast.dismiss(toastId);
        toast.error(
          response.data.message
            ? response.data.message
            : "Error updating email",
        );
      }
    } catch (error: any) {
      
      if(error.response.status === 401) {
        Object.keys(Cookies.get()).forEach(cookieName => {
          Cookies.remove(cookieName);
        });

        window.location.href = '/login'
      }

      toast.dismiss(toastId);
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "Error updating email",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    setIsLoading(true);
    try {
      if (!formData.Username) {
        toast.error("The username is empty");
      }

      if (formData.Username.length < 6) {
        toast.error("The username should be atleast 6 characters long");
        return;
      }

      const apiUrl = `${updateUsername_API}/${userDetails?._id}`;
      const updateBody = {
        username: formData.Username,
      };

      const response = await axios.put(apiUrl, updateBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        setUserDetails({
          ...userDetails,
          username: response.data.username,
        });
        toast.success("Username updated successfully");
      } else {
        toast.error(
          response.data.message
            ? response.data.message
            : "Error updating username",
        );
      }
    } catch (error: any) {
      
      if(error.response.status === 401) {
        Object.keys(Cookies.get()).forEach(cookieName => {
          Cookies.remove(cookieName);
        });

        window.location.href = '/login'
      }

      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "Error updating username",
      );
    }

    formData.Username = "";
    setEditMode(null);
    setIsLoading(false);
  };

  if (editMode === "Email") {
    return (
      <div className="p-6 w-full select-none">
        <div>
          <h1 className="text-lg flex items-center font-semibold ml-3 mb-3">
            <IoMdArrowRoundBack
              className="h-5 w-5 mr-2 font-bold hover:cursor-pointer"
              onClick={() => {
                formData.Email = "";
                setOtp("");
                setEditMode(null);
              }}
            />
            {userDetails?.email ? "Change Email" : "Add Email"}
          </h1>

          <div className="flex py-4 px-3 w-full items-center border-b border-gray-200">
            <h1 className="w-[20%] font-semibold mr-12">Email</h1>
            <input
              id="email"
              type="email"
              className={`flex-1 focus:outline-none font-semibold text-black rounded-md`}
              value={formData.Email}
              onChange={(e) => handleInputChange(e, "Email")}
              placeholder={"Enter Email"}
              ref={inputRef}
            />

            <button
              className={`${isLoading || !formData.Email ? "text-gray-600" : "text-red-600"} font-semibold hover:cursor-pointer`}
              onClick={handleVerifyEmail}
              disabled={isLoading || !formData.Email}
            >
              Verify Email
            </button>
          </div>

          <div className="flex py-4 px-3 w-full items-center border-b border-gray-200">
            <h1 className="w-[20%] font-semibold mr-12">OTP</h1>
            <input
              id="otp"
              type="text"
              className={`flex-1 focus:outline-none font-semibold text-black rounded-md`}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={"Enter OTP"}
              maxLength={6}
            />
          </div>
        </div>

        <div className="mt-6 w-full flex items-center justify-center">
          <AlertDialog>
            <AlertDialogTrigger
              disabled={
                otp.length === 0 ||
                isLoading ||
                !formData.Email ||
                !isEmailValid(formData.Email)
              }
            >
              <Button
                disabled={
                  otp.length === 0 ||
                  isLoading ||
                  !formData.Email ||
                  !isEmailValid(formData.Email)
                }
              >
                {userDetails?.email ? "Change Email" : "Add Email"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to change your email?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently update
                  your email.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleUpdateEmail}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  if (editMode === "Username") {
    return (
      <div className="p-6 w-full select-none">
        <div>
          <h1 className="text-lg flex items-center font-semibold ml-3 mb-1">
            <IoMdArrowRoundBack
              className="h-5 w-5 mr-2 font-bold hover:cursor-pointer"
              onClick={() => {
                formData.Email = "";
                setOtp("");
                setEditMode(null);
              }}
            />
            {userDetails?.username ? "Change Username" : "Grab Username"}
          </h1>

          <div className="flex flex-col py-4 px-1 space-y-3 w-full items-center justify-center">
            <h1 className="font-semibold">Username</h1>
            <input
              id="email"
              type="email"
              className={`p-2 font-semibold border outline-0 border-gray-500 bg-gray-100 text-gray-600 text-center rounded-md w-[30%]`}
              value={formData.Username}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const word = e.target.value;
                if (word.length > 15) {
                  return;
                }
                handleInputChange(e, "Username");
              }}
              placeholder={"Enter Your Desired Username"}
              ref={inputRef}
            />
          </div>
        </div>

        <div className="mt-3 w-full flex items-center justify-center">
          <AlertDialog>
            <AlertDialogTrigger>
              <Button disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : userDetails?.username ? (
                  "Change Username"
                ) : (
                  "Grab Username"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want this username?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will update your username.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleUpdateUsername}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full select-none">
      <div>
        <h1 className="text-lg flex items-center font-semibold ml-3 mb-3">
          Account Information
        </h1>

        <div className="flex flex-col">
          {/* Username div */}
          <div className="flex items-center justify-between border-b py-4 px-3 border-gray-200">
            <div className="flex w-full items-center">
              <h1 className="w-[20%] text-gray-800 mr-12">Username</h1>

              <p className="flex-1 text-gray-600">
                {userDetails?.username ? (
                  userDetails.username
                ) : (
                  <span className="text-gray-400">Your Username</span>
                )}
              </p>

              <h1
                className="text-blue-600  hover:cursor-pointer hover:shadow-blue-500 ml-12"
                onClick={() => handleEditClick("Username")}
              >
                {userDetails && userDetails.username === ""
                  ? "Grab Username"
                  : "Change Username"}
              </h1>
            </div>
          </div>

          {/* Email div */}
          <div className="flex items-center justify-between border-b py-4 px-3 border-gray-200">
            <div className="flex w-full items-center">
              <h1 className="w-[20%] text-gray-800 mr-12">Email</h1>

              <p className="flex-1 text-gray-600">
                {userDetails?.email ? (
                  userDetails.email
                ) : (
                  <span className="text-gray-400">Your Email</span>
                )}
              </p>

              <h1
                className="text-blue-600 hover:cursor-pointer hover:shadow-blue-500 ml-12"
                onClick={() => handleEditClick("Email")}
              >
                {userDetails?.email ? "Change Email" : "Add Email"}
              </h1>
            </div>
          </div>

          {/*Password div*/}
          <div className="flex items-center justify-between border-b py-4 px-3 border-gray-200">
            <div className="flex w-full items-center">
              <h1 className="w-[20%] text-gray-800 mr-12">Password</h1>

              <p className="flex-1 text-gray-600">
                {formData.Password === "" ? (
                  <span className="text-gray-400">Create a New Password</span>
                ) : (
                  "***********"
                )}
              </p>

              {formData.Password === "" ? (
                <h1
                  className="text-blue-600 hover:cursor-pointer hover:shadow-blue-500 ml-12"
                  onClick={() => navigate(`/account/password/create`)}
                >
                  Create Password
                </h1>
              ) : (
                <h1
                  className="text-blue-600 hover:cursor-pointer hover:shadow-blue-500 ml-12"
                  onClick={() => navigate(`/account/password/change`)}
                >
                  Change Password
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInformationPage;
