import axios from "axios";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChatInput from "./ChatInput";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import { plans } from "../constants/plans";

type ChatWrapperProps = {
    isSubscribed: boolean;
    fileId: string | undefined;
}

const ChatWrapper = ({ isSubscribed, fileId } : ChatWrapperProps) => {

    const [fileStatus, setFileStatus] = useState<string>('Success');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchFileStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/askPdf/files/fileStatus/${fileId}`);
            if(!response.data.status) {
                setFileStatus('Failed');
                setIsLoading(true)
            }

            if(response.data.status === 'Pending') {
                setIsLoading(true);
            } else if(response.data.status === 'Failed' || response.data.status === 'Success') {
                setIsLoading(false);
            }

            setFileStatus(response.data.status);
        } catch(err) {
            toast.error('Failed to fetch file status');
        }
    }

    useEffect(() => {
        // fetchFileStatus();
    }, []);

    if (isLoading) {
        return (
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
                <div className='flex-1 flex justify-center items-center flex-col mb-28'>
                    <div className='flex flex-col items-center gap-2'>
                    <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
                    <h3 className='font-semibold text-xl'>
                        Loading...
                    </h3>
                    <p className='text-zinc-500 text-sm'>
                        We&apos;re preparing your PDF.
                    </p>
                    </div>
                </div>
        
                <ChatInput isDisabled />
            </div>
        );
    }

    if (fileStatus === 'Pending') {
        return (
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
                <div className='flex-1 flex justify-center items-center flex-col mb-28'>
                    <div className='flex flex-col items-center gap-2'>
                    <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
                    <h3 className='font-semibold text-xl'>
                        Processing PDF...
                    </h3>
                    <p className='text-zinc-500 text-sm'>
                        This won&apos;t take long.
                    </p>
                    </div>
                </div>
        
                <ChatInput isDisabled />
            </div>
        );
    }
    
    if (fileStatus === 'Failed') {
        return (
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
                <div className='flex-1 flex justify-center items-center flex-col mb-28'>
                    <div className='flex flex-col items-center gap-2'>
                        <XCircle className='h-8 w-8 text-red-500' />
                        <h3 className='font-semibold text-xl'>
                            Too many pages in PDF
                        </h3>
                        <p className='text-zinc-500 text-sm'>
                            Your{' '}
                            <span className='font-medium'>
                            {isSubscribed ? 'Pro' : 'Free'}
                            </span>{' '}
                            plan supports up to{' '}
                            {isSubscribed
                            ? plans.find((p) => p.name === 'Pro')
                                ?.pagesPerPdf
                            : plans.find((p) => p.name === 'Free')
                                ?.pagesPerPdf}{' '}
                            pages per PDF.
                        </p>
                        <Link
                            to='/dashboard'
                            className={buttonVariants({
                            variant: 'secondary',
                            className: 'mt-4',
                            })}>
                            <ChevronLeft className='h-3 w-3 mr-1.5' />
                            Back
                        </Link>
                    </div>
                </div>
        
                <ChatInput isDisabled={true} />
            </div>
        );
    }

    return (
        <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
            <div className='flex-1 justify-between flex flex-col mb-28'>
                
            </div>
    
            <ChatInput isDisabled={false} />
        </div>
    );
};

export default ChatWrapper;