import React from 'react';

interface CustomInputProps {
    customInput: string;
    setCustomInput: React.Dispatch<React.SetStateAction<string>>;
}

const CustomInput: React.FC<CustomInputProps> = ({ customInput, setCustomInput }) => {
    return (
        <div>
            {" "}
            <textarea 
                rows={11} 
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Custom Input"
                className="focus:outline-none w-full border-2 border-black shadow-lg rounded-md p-2 bg-[#120b38] text-white">
            </textarea>
        </div>
    );
}

export default CustomInput;
