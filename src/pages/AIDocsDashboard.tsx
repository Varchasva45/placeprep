import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import authState from "../recoil/atoms/auth";
import { useRecoilValue } from "recoil";
import { askPDFEndpoints } from "../services/apis";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { buttonVariants } from "../components/ui/button";
import UploadButton from "../components/UploadButton";
import mongoose from "mongoose";
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
} from "../components/ui/alert-dialog";
import Cookies from "js-cookie";

type file = {
  _id: string;
  name: string;
  url: string;
  key: string;
  owner: mongoose.Types.ObjectId;
  uploadStatus: string;
  messages: string[];
  createdAt: Date;
};

const AIDocsDashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string[] | null
  >(null);
  const auth = useRecoilValue(authState);
  const [files, setFiles] = useState<file[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const { fetchFiles_API, deleteFile_API } = askPDFEndpoints;

  const fetchFiles = async () => {
    setLoading(true);
    const toastId = toast.loading("Fetching files...");
    try {
      const response = await axios.get(fetchFiles_API, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        toast.dismiss(toastId);
        setFiles(response.data.files);
      } else {
        toast.error(
          response.data.message
            ? response.data.message
            : "Failed to fetch files",
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
          : "Failed to fetch files",
      );
    }

    toast.dismiss(toastId);
    setLoading(false);
  };

  const handleDeleteFile = async (fileId: string) => {
    setCurrentlyDeletingFile(
      currentlyDeletingFile ? [...currentlyDeletingFile, fileId] : [fileId],
    );
    const toastId = toast.loading("Deleting file...");

    try {
      const apiUrl = `${deleteFile_API}/${fileId}`;
      const response = await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        toast.dismiss(toastId);
        toast.success("File deleted successfully");
        setFiles(files?.filter((file) => file._id !== fileId));
      } else {
        toast.dismiss(toastId);
        toast.error(
          response.data.message
            ? response.data.message
            : "Failed to delete file",
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
          : "Failed to delete file",
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
    toast.dismiss(toastId);
    setCurrentlyDeletingFile(
      currentlyDeletingFile
        ? currentlyDeletingFile.filter((id) => id !== fileId)
        : null,
    );
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="w-screen h-full">
      <main className="mx-auto max-w-6xl md:p-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
          <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>

          <UploadButton />
        </div>

        {loading ? (
          <div className="mt-16 flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-zinc-800 animate-spin"></Loader2>
            <h3 className="font-semibold text-xl">Fetching files...</h3>
          </div>
        ) : files && files.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {files
              .sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((file: any) => (
                <li
                  key={file._id}
                  className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                >
                  <a
                    href={`/dashboard/${file._id}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-lg font-medium text-zinc-900">
                            {file.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </a>

                  <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {format(new Date(file.createdAt), "MMM yyyy")}
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      mocked
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger className="w-full">
                        <div
                          className={buttonVariants({
                            variant: "destructive",
                            width: "full",
                          })}
                        >
                          {currentlyDeletingFile?.includes(file._id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this file?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this file and remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>
                            <div onClick={() => handleDeleteFile(file._id)}>
                              Continue
                            </div>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800"></Ghost>
            <h3 className="font-semibold text-xl">Pretty empty around here</h3>
            <p>Let's upload your first PDF</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIDocsDashboard;
