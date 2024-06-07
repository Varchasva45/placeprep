import Dropzone from 'react-dropzone';
import { Cloud, File, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getS3Url, uploadToS3 } from '../lib/uploadToS3';
import { useRecoilValue } from 'recoil';
import userState from '../recoil/atoms/user';
import axios from 'axios';
import authState from '../recoil/atoms/auth';

type UploadDropzoneProps = {
    isSubscribed: boolean;
}

const UploadDropzone = ({isSubscribed}: UploadDropzoneProps) => {

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const user = useRecoilValue(userState);
    const auth = useRecoilValue(authState);

    const startSimulateProgress = () => {   
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                prevProgress += 10;
                if(prevProgress >= 95) {
                    clearInterval(interval);
                    return prevProgress;
                }
                return prevProgress + 5;
            })
        }, 50);

        return interval;
    }

    const handleOnDrop = async (acceptedFiles: any) => {
        setIsUploading(true);

        if(acceptedFiles.length === 0 || acceptedFiles[0].type !== 'application/pdf') {
            toast.error('Only PDF files are allowed');
            setIsUploading(false);
            return;
        }

        if(isSubscribed) {  
            if(acceptedFiles[0].size > 16 * 1024 * 1024) {
                toast.error('Pro Plan allows upto 16 MB file size.');
                setIsUploading(false);
                return;
            }
        } else {
            if(acceptedFiles[0].size > 4 * 1024 * 1024) {
                toast.error('Free Plan allows upto 4 MB file size.');
                setIsUploading(false);
                return;
            }
        }
        
        const interval = startSimulateProgress();
        
        try {
            const data = await uploadToS3(acceptedFiles[0]);
            const url = getS3Url(data.file_key);

            const newFile = {
                url: url,
                name: data.file_name,
                key: data.file_key,
                owner: user.id
            }

            const response = await axios.post('http://localhost:3000/askPdf/createFile', newFile,  {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            if(response.data.success) {
                window.location.href = `/dashboard/${response.data.fileId}`;
            } else {
                toast.error('Failed to upload file');
            }
        } catch (err: any) {
            console.log(err);
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
    }

    return (
        <Dropzone 
            multiple={false} 
            onDrop={handleOnDrop}
        >
            {
                ({ getRootProps, getInputProps, acceptedFiles}) => (
                    <div {...getRootProps()} className='border h-64 m-4 border-dashed border-gray-300 rounded-lg '>
                        <div className={`flex items-center justify-center h-full w-full transition hover:bg-zinc-200 ${isUploading ? 'bg-zinc-200': 'bg-zinc-100'}`}>
                            <label
                                htmlFor='dropzone-file'
                                className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer'
                            >   
                                
                                <input {...getInputProps()} type='file' id='dropzone-file' className='hidden' />
                                

                                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                    <Cloud className='h-6 w-6 text-zinc-500 mb-2'></Cloud>
                                    <p className='mb-2 text-sm text-zinc-700'>
                                        <span className='font-semibold'>Click to upload</span>{' '} or drag and drop
                                    </p>
                                    <p className='text-xs text-zinc-500'>PDF upto {isSubscribed ? '16 MB' : '4 MB'}</p>
                                </div>

                                {acceptedFiles && acceptedFiles[0] ? (
                                    <div className='max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                                        <div className='px-3 py-2 h-full grid place-items-center'>
                                            <File className='h-4 w-4 text-blue-500'></File>
                                        </div>
                                        <div className='px-3 py-2 h-full text-sm truncate'>
                                            {acceptedFiles[0].name}
                                        </div>
                                    </div>
                                ) : null}

                                {isUploading ? (
                                    <div className='w-full mt-4 max-w-xs mx-auto'>
                                        <Progress 
                                            value={uploadProgress} 
                                            className='h-1 w-full bg-zinc-200'
                                        />
                                    

                                        {uploadProgress === 100 ? (
                                            <div className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                                                <Loader2 className='h-3 w-3 animate-spin' />
                                                Redirecting...
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}

                            </label>
                        </div>
                    </div>
                )
            }
        </Dropzone>
    );
}


export default UploadDropzone;