import { useEffect, useState } from 'react';
import UploadButton from './UploadButton';
import toast from 'react-hot-toast';
import axios from 'axios';
import authState from '../recoil/atoms/auth';
import { useRecoilValue } from 'recoil';
import { askPDFEndpoints } from '../services/apis';
import { Ghost, Loader2, MessageSquare, Plus, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from './ui/button';

// type File = {
//     name: string;
//     url: string;
//     key: string;
//     owner: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

const ExploreDashboard = () => {

    const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<string[] | null>(null)
    const auth = useRecoilValue(authState);
    const [files, setFiles] = useState<any>();
    const { fetchFiles_API } = askPDFEndpoints;

    useEffect(() => {
        const fetchFiles = async () => {
            const toastId = toast.loading('Fetching files...');
            try {
                const response = await axios.get(fetchFiles_API, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });

                if(response.data.success) {
                    setFiles(response.data.files);
                } else {
                    toast.error(response.data.message ? response.data.message : 'Failed to fetch files');
                }
                
            } catch (error: any) {
                toast.error(error.response.data.message ? error.response.data.message : 'Failed to fetch files');
            }
    
            toast.dismiss(toastId);
        };

        fetchFiles();
    }, []);

    const handleDeleteFile = (fileId: string) => {
        setCurrentlyDeletingFile(currentlyDeletingFile ? [...currentlyDeletingFile, fileId] : [fileId]);
        // Delete file
        setCurrentlyDeletingFile(currentlyDeletingFile ? currentlyDeletingFile.filter((id) => id !== fileId): null);
    }
    
    return (
        <main className='mx-auto max-w-7xl md:p-10'>
            <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
                <h1 className='mb-3 font-bold text-5xl text-gray-900'>
                    My Files
                </h1>

                <UploadButton />
            </div>

            {files && files.length > 0 ? (
                <ul className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {files.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((file: any) => (
                        <li key={file._id} className='col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg'>
                            <Link 
                                to={`/dashboard/${file._id}`}
                                className='flex flex-col gap-2'
                            >
                                <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                                    <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500' />
                                    <div className='flex-1 truncate'>
                                        <div className='flex items-center space-x-3'>
                                            <h3 className='truncate text-lg font-medium text-zinc-900'>
                                            {file.name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500'>
                                <div className='flex items-center gap-2'>
                                    <Plus className='h-4 w-4' />
                                    {format(
                                        new Date(file.createdAt),
                                        'MMM yyyy'
                                    )}
                                </div>

                                <div className='flex items-center gap-2'>
                                    <MessageSquare className='h-4 w-4' />
                                    mocked
                                </div>

                                <Button
                                    size='sm'
                                    className='w-full'
                                    variant='destructive'
                                    onClick={() => handleDeleteFile(file._id)}
                                >  
                                    {
                                        currentlyDeletingFile?.includes(file._id) ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash className='h-4 w-4' />
                                    }
                                    
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className='mt-16 flex flex-col items-center gap-2'>
                    <Ghost className='h-8 w-8 text-zinc-800'></Ghost>
                    <h3 className='font-semibold text-xl'>Pretty empty around here</h3>
                    <p>Let's upload your first PDF</p>
                </div>
            )}


        </main>
    );
}

export default ExploreDashboard;