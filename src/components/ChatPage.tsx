import { useEffect, useState } from 'react'
import ChatWrapper from './ChatWrapper'
import PDFRenderer from './PDFRenderer'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

// interface PageProps {
//   params: {
//     fileid: string
//   }
// }

// interface file {
//     id: string
//     url: string
// }

const ChatPage = () => {

    // const [file, setFile] = useState<file>({id: '1', url: 'abc'});
    // const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchFile = async () => {
    //         const toastId = toast.loading('Fetching file...')
    //         try {
    //             // fetch File
    //             // if(!file) { 
    //             //     navigate('/dashboard')
    //             // }
    //         } catch (error) {   
    //             toast.error('Failed to fetch file')
    //         }

    //         toast.dismiss(toastId)  
    //     }

    //     fetchFile();
    // }, [])


    return (
        <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
            <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
                <div className='flex-1 xl:flex'>
                    <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
                        <PDFRenderer url={'abc'} />
                    </div>
                </div>

                <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
                    <ChatWrapper/>
                </div>
            </div>
        </div>
    )
};

export default ChatPage;