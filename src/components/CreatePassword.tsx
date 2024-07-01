import React, { useState } from "react";
import { Card, CardTitle, CardContent, CardFooter } from "./ui/card";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import authState from "../recoil/atoms/auth";
import toast from "react-hot-toast";
import userState from "../recoil/atoms/user";
import { authEndpoints } from "../services/apis";

export default function CreatePassword() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useRecoilValue(authState);
  const user = useRecoilValue(userState);

  const navigate = useNavigate();
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setConfirmPassword(e.target.value);

  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const { updatePassword_API } = authEndpoints;

  const validatePasswords = () => {
    const errors = [];
    if (newPassword !== confirmPassword) {
      errors.push("*New password and confirm password do not match");
    }
    if (newPassword.length < 8) {
      errors.push("*Password must contain at least 8 characters");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      errors.push("*Password must contain a special character");
    }
    return errors;
  };

  const errors = validatePasswords();

  const handleChangePassword = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Changing password...");
    try {
      const apiUrl = `${updatePassword_API}/${user.id}`;
      const reqBody = {
        newPassword,
      };

      const response = await axios.put(apiUrl, reqBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      console.log(response);

      if (response.data.success) {
        toast.success("Password changed successfully");
        setIsLoading(false);
        navigate(`/u/${user.username}`);
      } else {
        toast.error("Error while changing password");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "Error while changing password",
      );
      console.error("Error while changing password", error);
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto transform translate-y-[26%]">
      <h1 className="flex justify-center items-center space-x-2 p-5">
        <IoArrowBackOutline
          className="h-6 w-6 cursor-pointer"
          onClick={() => {
            setNewPassword("");
            setConfirmPassword("");
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            navigate(`/u/${user.username}`);
          }}
        />
        <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
      </h1>
      <CardContent className="space-y-4 mt-4">
        <div className="relative space-y-3">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
            className="text-gray-600"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2.5 right-1 h-7 w-7"
            onClick={toggleNewPasswordVisibility}
          >
            {showNewPassword ? (
              <AiOutlineEyeInvisible className="h-4 w-4" />
            ) : (
              <AiOutlineEye className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle password visibility</span>
          </Button>
        </div>
        <div className="relative space-y-3">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className="text-gray-600"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2.5 right-1 h-7 w-7"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible className="h-4 w-4" />
            ) : (
              <AiOutlineEye className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle password visibility</span>
          </Button>
        </div>
        <div className="flex flex-col justify-center">
          {errors.map((error, index) => (
            <div key={index} className="text-red-500 font-medium">
              {error}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger
            disabled={errors.length > 0 || isLoading}
            className="w-full"
          >
            <Button
              className="w-full mt-4"
              disabled={errors.length > 0 || isLoading}
            >
              Change Password
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to change your email?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently update your
                email.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleChangePassword}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
