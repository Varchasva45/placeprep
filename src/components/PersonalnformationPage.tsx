import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
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
} from './ui/alert-dialog';

type EditProfilePageProps = {
    setIsEditProfilePageVisible: (visible: boolean) => void;
};

const personalInfoLabels = [
    { field: 'Name', placeholder: 'Your Name' },
    { field: 'College', placeholder: 'Your College' },
    { field: 'Summary', placeholder: 'Your Summary' },
    { field: 'Location', placeholder: 'Your Location'},
    { field: 'LinkedIn', placeholder: 'Your LinkedIn Account' },
    { field: 'GitHub', placeholder: 'Your GitHub Account' },
]

const PersonalInformationPage = ({ setIsEditProfilePageVisible }: EditProfilePageProps) => {
    const [editMode, setEditMode] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<object>({
        Name: '',
        College: '',
        Summary: '',
        Location: '',
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
            <div>
                <h1 className='text-lg flex items-center font-semibold ml-3 mb-3'> Personal Information </h1>
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

                <AlertDialog>
                    <AlertDialogTrigger className='w-full'>
                        <div className='mt-6 flex items-center justify-center'>
                            <Button>Save Changes</Button>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to update the information?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently update the information.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>
                                {/* Logic to update the information on Accept Also dont forget to add the loading state */ }
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    );
}

export default PersonalInformationPage;
