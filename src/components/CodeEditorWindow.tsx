import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import 'react-resizable/css/styles.css';

interface CodeEditorWindowProps {
  onChange: any;
  language: any;
  code: any;
  theme: any;
}

const CodeEditorWindow: React.FC<CodeEditorWindowProps> = ({
  onChange,
  language,
  code,
  theme,
}) => {
  const [value, setValue] = useState<string>(code || "");

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setValue(value);
      onChange("code", value);
    }
  };

  return (
    <div className="overlay overflow-hidden w-full h-full">
      <Editor
        height="88vh"
        width={`100%`}
        language={language || "javascript"}
        value={code}
        theme={theme}
        defaultValue="Yaha se code likho..."
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditorWindow;
