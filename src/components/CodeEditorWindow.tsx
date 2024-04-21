import React, { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorWindowProps {
  onChange: any;
  language: any;
  code: any;
  theme: any;
}

const CodeEditorWindow: React.FC<CodeEditorWindowProps> = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState<string>(code || "");

  const handleEditorChange = (value: string) => {
    setValue(value);
    onChange("code", value);
  };
  

  return (
    <div className="overlay rounded-lg overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        // onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditorWindow;
