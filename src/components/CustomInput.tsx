const CustomInput: React.FC = () => {
    return (
        <div>
            <textarea 
                rows={11} 
                placeholder="Custom Input"
                className="focus:outline-none w-full border-2 border-black shadow-lg rounded-md p-2 bg-[#120b38] text-white">
            </textarea>
        </div>
    );
}

export default CustomInput;