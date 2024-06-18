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
  setIsEditProfilePageVisible: (visible: boolean) => void;
  userDetails: IuserDetails | null;
  setUserDetails: any;
};

const AccountInformationPage = ({
  setIsEditProfilePageVisible,
  userDetails,
  setUserDetails,
}: EditProfilePageProps) => {
  const auth = useRecoilValue(authState);
  const [editMode, setEditMode] = useState<string | null>("Password");
  const inputRef = useRef<HTMLInputElement>(null);
  const [newEmail, setNewEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    Email: "",
    Password: userDetails?.password || "",
    Username: "",
  });

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
      const response = await axios.post(
        `http://localhost:3000/auth/sendOtp/${userDetails?._id}`,
        body,
        config,
      );

      toast.dismiss(toastId);

      if (response.data?.success) {
        toast.success("Sent OTP to your Email");
      } else {
        const errorMessage = response.data?.message || "Error sending OTP";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.dismiss(toastId);
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
      const body = {
        email: formData.Email,
        otp,
      };

      const response = await axios.post(
        `http://localhost:3000/auth/updateEmail/${userDetails?._id}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );

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
      console.log(error);
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

      const updateBody = {
        username: formData.Username,
      };

      const response = await axios.put(
        `http://localhost:3000/users/username/${userDetails?._id}`,
        updateBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );

      if (response.data.success) {
        console.log(response.data);
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
      console.log(error);
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
                setNewEmail("");
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

  // if(editMode === 'Password') {
  //   return (
  //     <div className="p-6 w-full select-none">
  //     <div>
  //       <h1 className="text-lg flex items-center font-semibold ml-3 mb-3">
  //         <IoMdArrowRoundBack
  //           className='h-5 w-5 mr-2 font-bold hover:cursor-pointer'
  //           onClick={() => {
  //             setNewEmail('');
  //             setOtp('');
  //             setEditMode(null);
  //           }}
  //         />
  //         {formData.Password === "" ? 'Create Password' : 'Change Password'}
  //       </h1>

  //       <div>
  //         <div className="flex py-4 px-3 w-full items-center">
  //           <h1 className="w-[20%] font-semibold mr-12">Current Password</h1>
  //           <div className="flex-1 relative">
  //             <input
  //               id="current-password"
  //               type={showCurrentPassword ? "text" : "password"}
  //               className="w-full p-2 focus:outline-none font-semibold text-black rounded-md border border-gray-300"
  //               value={newEmail}
  //               onChange={(e) => setNewEmail(e.target.value)}
  //               placeholder="Enter Current Password"
  //               ref={inputRef}
  //             />
  //             <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
  //               <button
  //                 type="button"
  //                 className="focus:outline-none"
  //                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
  //               >
  //                 {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
  //               </button>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="flex py-4 px-3 w-full items-center">
  //           <h1 className="w-[20%] font-semibold mr-12">New Password</h1>
  //           <div className="flex-1 relative">
  //             <input
  //               id="new-password"
  //               type={showNewPassword ? "text" : "password"}
  //               className="w-full p-2 focus:outline-none font-semibold text-black rounded-md border border-gray-300"
  //               value={newPassword}
  //               onChange={(e) => setNewPassword(e.target.value)}
  //               placeholder="Enter New Password"
  //             />
  //             <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
  //               <button
  //                 type="button"
  //                 className="focus:outline-none"
  //                 onClick={() => setShowNewPassword(!showNewPassword)}
  //               >
  //                 {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
  //               </button>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="flex py-4 px-3 w-full items-center">
  //           <h1 className="w-[20%] font-semibold mr-12">Confirm Password</h1>
  //           <div className="flex-1 relative">
  //             <input
  //               id="confirm-password"
  //               type={showConfirmPassword ? "text" : "password"}
  //               className="w-[40%] p-2 focus:outline-none font-semibold text-black rounded-md border border-gray-300"
  //               value={confirmPassword}
  //               onChange={handleConfirmPasswordChange}
  //               placeholder="Confirm Password"
  //             />
  //             <div className="absolute inset-y-0 right-28 pr-3 flex items-center">
  //               <button
  //                 type="button"
  //                 className="focus:outline-none"
  //                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  //               >
  //                 {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //         {!passwordMatch && (
  //           <div className="text-red-500 text-sm mt-1 ml-32">Passwords do not match</div>
  //         )}
  //       </div>
  //     </div>

  //     <div className="mt-6 w-full flex items-center justify-center">
  //       <AlertDialog>
  //         <AlertDialogTrigger>
  //             <Button disabled={otp.length === 0}>{formData.Password === '' ? 'Create Password' : 'Update Password'}</Button>
  //         </AlertDialogTrigger>
  //         <AlertDialogContent>
  //           <AlertDialogHeader>
  //             <AlertDialogTitle>
  //               Are you sure you want to change your password?
  //             </AlertDialogTitle>
  //             <AlertDialogDescription>
  //               This action cannot be undone. This will permanently update your password.
  //             </AlertDialogDescription>
  //           </AlertDialogHeader>
  //           <AlertDialogFooter>
  //             <AlertDialogCancel>Cancel</AlertDialogCancel>
  //             <AlertDialogAction>
  //               {/* Logic to update the information on Accept. Don't forget to add the loading state */}
  //               Continue
  //             </AlertDialogAction>
  //           </AlertDialogFooter>
  //         </AlertDialogContent>
  //       </AlertDialog>
  //     </div>
  //   </div>
  //   );
  // }

  if (editMode === "Username") {
    return (
      <div className="p-6 w-full select-none">
        <div>
          <h1 className="text-lg flex items-center font-semibold ml-3 mb-1">
            <IoMdArrowRoundBack
              className="h-5 w-5 mr-2 font-bold hover:cursor-pointer"
              onClick={() => {
                setNewEmail("");
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

          {/* Password div */}
          {/* <div className="flex items-center justify-between border-b py-4 px-3 border-gray-200">
            <div className="flex w-full items-center">

              <h1 className="w-[20%] text-gray-800 mr-12">Password</h1>

              <p className="flex-1 text-gray-600">
                {formData.Password === "" ? (
                  <span className="text-gray-400">Your Password</span>
                ) : (
                  '***********'
                )}
              </p>
            
              <h1
                className="text-blue-600 hover:cursor-pointer hover:shadow-blue-500 ml-12"
                onClick={() => handleEditClick("Password")}
              >
                {formData.Password === "" ? "Create Password" : "Change Password"}
              </h1>

            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AccountInformationPage;
