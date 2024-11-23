import { useState, useRef } from "react";

const OTPInput = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputs: any = useRef([]);

  const handleChange = (element: any, index: any) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Move to next input box if the current box is filled
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e: any, index: any) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  return (
    <div className="flex justify-center space-x-5 mt-4">
      {otp.map((data, index) => {
        return (
          <input
            className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:border-3 focus:border-gray-900 focus:shadow-outline-blue"
            type="text"
            name="otp"
            key={index}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputs.current[index] = el)}
          />
        );
      })}
    </div>
  );
};

export default OTPInput;
