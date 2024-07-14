import { useRecoilValue } from "recoil";
import userState from "../recoil/atoms/user";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ChatWrapper from "../components/ChatWrapper";
import authState from "../recoil/atoms/auth";
import { askPDFEndpoints } from "../services/apis";
import PdfRenderer from "../components/PdfRenderer";

const PdfChatPage = () => {
  const fileId = location.pathname.split("/").pop();
  const auth = useRecoilValue(authState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const { fetchFileDetails_API } = askPDFEndpoints;

  const fetchFileDetails = async () => {
    try {
      const apiUrl = `${fetchFileDetails_API}/${fileId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      });

      const file = response.data.file;

      if (!file.url) {
        navigate("/dashboard");
      }

      setFileUrl(file.url);
      setFileName(file.name);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!fileId) {
      navigate("/dashboard");
    }

    fetchFileDetails();
  }, []);

  return (
    <>
      <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)] bg-zinc-100 max-h-screen">
        <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2 max-h-full">
          <div className="flex-1 xl:flex h-full justify-center">
            <div className="px-4 py-3 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6 h-full">
              <PdfRenderer fileName={fileName} fileUrl={fileUrl} />
            </div>
          </div>

          <div className="bg-white shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            <ChatWrapper isSubscribed={user.isSubscribed!} fileId={fileId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PdfChatPage;
