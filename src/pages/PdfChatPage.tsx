import { useRecoilValue } from "recoil";
import userState from "../recoil/atoms/user";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PdfRenderer from "../components/PdfRenderer";
import ChatWrapper from "../components/ChatWrapper";

const PdfChatPage = () => {

    const fileId = location.pathname.split('/').pop();
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const [fileUrl, setFileUrl] = useState<string>('https://testplaceprep.s3.ap-south-1.amazonaws.com/Varchasva_Resume.pdf');

    const fetchFileDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/askPdf/files/${fileId}`);
            
            if(!response.data.fileUrl) {
                navigate('/dashboard');
            }

            setFileUrl(response.data.fileUrl);
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if(!fileId) {
            navigate('/dashboard');
        }

        // fetchFileUrl();
    }, []); 

    return (
        <>
            <div className="shadow-lg border-b border-zinc-300 h-[3.5rem]">

            </div>
            <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)] bg-zinc-100 max-h-screen'>
                <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2 max-h-full'>

                    <div className='flex-1 xl:flex h-full justify-center'>
                        <div className='px-4 py-3 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6 h-full'>
                            <PdfRenderer fileName={'Varchasva_Resume'} fileUrl={fileUrl} />
                        </div>
                    </div>
                    
                    <div className='bg-white shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
                        <ChatWrapper isSubscribed={user.isSubscribed} fileId={fileId} />
                    </div>
                </div>
            </div>
        </>
    );
}


export default PdfChatPage;