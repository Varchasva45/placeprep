import React from "react";

interface CustomInputProps {
  customInput: string;
  setCustomInput: React.Dispatch<React.SetStateAction<string>>;
}

const CustomInput: React.FC<CustomInputProps> = ({
  customInput,
  setCustomInput,
}) => {
  return (
    <div>
      {" "}
      <textarea
        rows={11}
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Custom Input"
        className="focus:outline-none w-full border-2 shadow-lg p-2 bg-black text-white resize-none"
        style={{background: '#1E1E1E'}}
      ></textarea>
    </div>
  );
};

export default CustomInput;
