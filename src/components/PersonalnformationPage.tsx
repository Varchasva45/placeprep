import { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import authState from "../recoil/atoms/auth";
import mongoose from "mongoose";
import { userEndpoints } from "../services/apis";
import Cookies from "js-cookie";

interface IuserDetails {
  _id: mongoose.Types.ObjectId;
  name?: string;
  username?: string;
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
  userId: string;
  setUserDetails: any;
};

type FormData = {
  Name: string;
  College: string;
  Summary: string;
  Location: string;
  LinkedIn: string;
  GitHub: string;
};

const personalInfoLabels = [
  { field: "Name", placeholder: "Your Name" },
  { field: "College", placeholder: "Your College" },
  { field: "Summary", placeholder: "Your Summary" },
  { field: "Location", placeholder: "Your Location" },
  { field: "LinkedIn", placeholder: "Your LinkedIn Account" },
  { field: "GitHub", placeholder: "Your GitHub Account" },
];

const PersonalInformationPage = ({
  userDetails,
  userId,
  setUserDetails,
}: EditProfilePageProps) => {
  const { updateUserDetails_API } = userEndpoints;
  const auth = useRecoilValue(authState);
  const [editMode, setEditMode] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    Name: userDetails?.name || "",
    College: userDetails?.personalInformation.education || "",
    Summary: userDetails?.personalInformation.summary || "",
    Location: userDetails?.personalInformation.location || "",
    LinkedIn: userDetails?.personalInformation.linkedInLink || "",
    GitHub: userDetails?.personalInformation.githubLink || "",
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

  const handleSaveChanges = async () => {
    try {
      const apiUrl = `${updateUserDetails_API}/${userId}`;
      const updateBody = {
        updatedData: {
          name: formData.Name,
          personalInformation: {
            summary: formData.Summary,
            location: formData.Location,
            education: formData.College,
            linkedInLink: formData.LinkedIn,
            githubLink: formData.GitHub,
          },
        },
      };

      const response = await axios.put(apiUrl, updateBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        toast.success("User details updated successfully");
        setUserDetails(response.data.userDetails);
      } else {
        toast.error(
          response.data.message
            ? response.data.message
            : "Error while updating user details, please try again!",
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
          : "Error while updating user details, please try again!",
      );
    }
  };

  return (
    <div className="p-6 w-full select-none">
      <div>
        <h1 className="text-lg flex items-center font-semibold ml-3 mb-3">
          {" "}
          Personal Information{" "}
        </h1>
        <div className="flex flex-col">
          {personalInfoLabels.map(({ field, placeholder }, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b py-4 px-3 border-gray-200"
            >
              <div className="flex w-full items-center">
                <h1 className="w-[20%] text-gray-600 mr-12">{field}</h1>
                {editMode === field ? (
                  <input
                    type="text"
                    className={`flex-1 focus:outline-none text-gray-600 rounded-md`}
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => handleInputChange(e, field)}
                    placeholder={placeholder}
                    ref={inputRef}
                  />
                ) : (
                  <p className="flex-1 text-gray-600">
                    {formData[field as keyof typeof formData] === "" ? (
                      <span className="text-gray-400">{placeholder}</span>
                    ) : (
                      formData[field as keyof typeof formData]
                    )}
                  </p>
                )}

                {editMode === field ? (
                  <h1
                    className="text-red-600 font-semibold hover:cursor-pointer hover:shadow-red-500 ml-12"
                    onClick={() => setEditMode(null)}
                  >
                    Close
                  </h1>
                ) : (
                  <h1
                    className="text-blue-600 hover:cursor-pointer hover:shadow-blue-500 ml-12"
                    onClick={() => handleEditClick(field)}
                  >
                    Edit
                  </h1>
                )}
              </div>
            </div>
          ))}
        </div>

        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <div className="mt-6 flex items-center justify-center">
              <Button>Save Changes</Button>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to update the information?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently update the
                information.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveChanges}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PersonalInformationPage;
