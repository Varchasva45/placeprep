import { useEffect, useRef, useState } from 'react';
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "../components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

type EditProfilePageProps = {
    setIsEditProfilePageVisible: (visible: boolean) => void;
};

const personalInfoLabels = [
    { field: 'Name', placeholder: 'Your Name' },
    { field: 'College', placeholder: 'Your College' },
    { field: 'Summary', placeholder: 'Your Summary' },
    { field: 'LinkedIn', placeholder: 'Your LinkedIn Account' },
    { field: 'GitHub', placeholder: 'Your GitHub Account' }
]

const accountInfoLabels = [
    { field: 'Email', placeholder: 'Your Email' },
    { field: 'Password', placeholder: 'Your Password' },
    { field: 'Username', placeholder: 'Your Username' }
]

const EditProfilePage = ({ setIsEditProfilePageVisible }: EditProfilePageProps) => {
    const [editMode, setEditMode] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<object>({
        Name: '',
        College: '',
        Summary: '',
        LinkedIn: '',
        GitHub: '',
        Email: '',
        Password: '',
        Username: ''
    });

    useEffect(() => {
        if(editMode) {
            inputRef.current?.focus();
        }
    }, [editMode]);


    const handleEditClick = (field: string) => {
        setEditMode(field);
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    return (
        <div className='p-6 w-full select-none'>
            <TooltipProvider>
                <div className='mb-6'>
                    <h1 className='text-lg flex items-center font-semibold ml-3 mb-2'>
                        Personal Information 
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger className='cursor-pointer ml-1.5'>
                                <HelpCircle className='h-4 w-4' />
                            </TooltipTrigger>
                            <TooltipContent className='w-80 p-2 mb-4 border text-red-600 bg-white border-gray-200 rounded-md'>
                                This information will be displayed on your profile page.
                            </TooltipContent>
                        </Tooltip>
                    </h1>
                    <div className='flex flex-col'>
                        {personalInfoLabels.map(({ field, placeholder }, index) => (
                            <div key={index} className='flex items-center justify-between border-b py-4 px-3 border-gray-200'>
                                <div className='flex w-full items-center'>
                                    <h1 className='w-[20%] text-gray-800 mr-12'>{field}</h1>
                                    {editMode === field ? (
                                        <input
                                            type='text'
                                            className={`flex-1 focus:outline-none text-gray-600 rounded-md`}
                                            value={formData[field as keyof typeof formData]}
                                            onChange={(e) => handleInputChange(e, field)}
                                            placeholder={placeholder}
                                            ref={inputRef}
                                        />
                                    ) : (
                                        <p className='flex-1 text-gray-600'>{formData[field as keyof typeof formData] === '' ? <span className='text-gray-400'>{placeholder}</span> : formData[field as keyof typeof formData]}</p>
                                    )}

                                    {editMode === field 
                                        ? <h1 className='text-red-600 hover:cursor-pointer hover:shadow-red-500 ml-12' onClick={() => setEditMode(null)}>Close</h1>
                                        : <h1 className='text-blue-600 hover:cursor-pointer hover:shadow-blue-500 ml-12' onClick={() => handleEditClick(field)}>Edit</h1>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='mb-6'>
                    <h1 className='text-lg flex items-center font-semibold ml-3 mb-2'>
                        Account Information 
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger className='cursor-pointer ml-1.5'>
                                <HelpCircle className='h-4 w-4' />
                            </TooltipTrigger>
                            <TooltipContent className='w-80 p-2 mb-4 border text-red-600 bg-white border-gray-200 rounded-md'>
                                This information will not be displayed on your profile page and will remain private.
                            </TooltipContent>
                        </Tooltip>
                    </h1>
                    <div className='flex flex-col'>
                        {accountInfoLabels.map(({ field, placeholder }, index) => (
                            <div key={index} className='flex items-center justify-between border-b py-4 px-3 border-gray-200'>
                                <div className='flex w-full items-center'>
                                    <h1 className='w-[20%] text-gray-800 mr-12'>{field}</h1>
                                    {editMode === field ? (
                                        <input
                                            type='text'
                                            className={`flex-1 focus:outline-none text-gray-600 rounded-md`}
                                            value={formData[field as keyof typeof formData]}
                                            onChange={(e) => handleInputChange(e, field)}
                                            placeholder={placeholder} 
                                            ref={inputRef}
                                        />
                                    ) : (
                                        <span className='flex-1 text-gray-600'>{formData[field as keyof typeof formData] === '' ? <span className='text-gray-400'>{placeholder}</span> : formData[field as keyof typeof formData]}</span>
                                    )}

                                    {editMode === field 
                                        ? <h1 className='text-red-600 hover:cursor-pointer hover:shadow-red-500 ml-12' onClick={() => setEditMode(null)}>Close</h1>
                                        : <h1 className='text-blue-600 hover:cursor-pointer hover:shadow-blue-500 ml-12' onClick={() => handleEditClick(field)}>Edit</h1>
                                    }

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </TooltipProvider>
        </div>
    );
}

export default EditProfilePage;
