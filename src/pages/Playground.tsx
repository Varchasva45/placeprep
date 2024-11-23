import { useEffect, useState } from "react";
import { languageOptions } from "../constants/languageOptions";
import { loader } from "@monaco-editor/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import CodeEditorWindow from "../components/CodeEditorWindow";
import LanguageDropdown from "../components/LanguageDropdown";
import ThemeDropdown from "../components/ThemeDropdown";
import CustomInput from "../components/CustomInput";
import OutputWindow from "../components/OutputWindow";
import { Button } from "../components/ui/button";

type Language = {
  id: number;
  name: string;
  value: string;
  label: string;
  defaultCode?: string;
};

type Theme = {
  label: string;
  value: string;
  key: string;
};

const codeDefault = `console.log("Hello, World!");`;

const Playground = () => {
  const [language, setLanguage] = useState<Language>(languageOptions[0]);
  const [theme, setTheme] = useState<string>("vs-dark");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState<boolean | null>(null);
  const [customInput, setCustomInput] = useState("");
  const [code, setCode] = useState<string>(codeDefault);

  useEffect(() => {
    const setInitialTheme = async () => {
      try {
        const themeData = await fetch(`/themes/Blackboard.json`).then((res) =>
          res.json(),
        );
        const monaco = await loader.init();
        monaco.editor.defineTheme("Select Theme", themeData);
        setTheme("Select Theme");
      } catch (error) {
        console.log("Error setting theme:", error);
      }
    };

    setInitialTheme();
  }, []);

  const onSelectChange = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setCode(selectedLanguage.defaultCode || "");
  };

  const handleThemeChange = async (selectedTheme: Theme) => {
    try {
      const themeData = await fetch(`/themes/${selectedTheme.label}.json`).then(
        (res) => res.json(),
      );
      const monaco = await loader.init();
      monaco.editor.defineTheme(selectedTheme.value, themeData);
      setTheme(selectedTheme.value);
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  };

  const checkStatus = async (token: string) => {
    console.log("Checking status...");
    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions" + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "a6e9189d6amshea6c01c5706eee7p139652jsn6a7ac716f5f1",
      },
    };
    try {
      const response = await axios.request(options);
      console.log("res.data", response.data);
      const status = response.data.status.id;
      if (status < 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
      }
    } catch (err: any) {
      let error = err.response ? err.response.data : err;
      setProcessing(false);
      console.log(error);
    }
  };

  const onChange = (action: any, data: any) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleCompile = async () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      source_code: btoa(code),
      stdin: btoa(customInput),
    };

    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "a6e9189d6amshea6c01c5706eee7p139652jsn6a7ac716f5f1",
      },
      data: formData,
    };

    try {
      const response = await axios.request(options);
      console.log("res.data", response.data);
      const token = response.data.token;
      checkStatus(token);
    } catch (err: any) {
      let error = err.response ? err.response.data : err;
      setProcessing(false);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col p-4 gap-4 bg-gray-100 h-[calc(100vh-3.5rem)]">
      <div className="flex gap-4 justify-center items-center lg:justify-start relative">
        <div className="hidden lg:flex gap-3">
          <LanguageDropdown onSelectChange={onSelectChange} />
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <Button
          onClick={handleCompile}
          className="bg-blue-500 hover:bg-blue-500/90 font-bold px-4 rounded shadow-lg flex items-center justify-center gap-2 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2"
        >
          {processing ? "Processing..." : "Compile"}
          <FontAwesomeIcon icon={faPlay} />
        </Button>
      </div>
      <div className="flex flex-row gap-4 h-full">
        <div className="w-2/3 shadow-lg h-full">
          <CodeEditorWindow
            onChange={onChange}
            language={language?.value}
            code={code}
            theme={theme}
          />
        </div>
        <div className="flex flex-col w-1/3 gap-4 h-full">
          <OutputWindow
            outputDetails={outputDetails}
            className="bg-white p-4 shadow-lg flex-grow"
          />
          <CustomInput
            customInput={customInput}
            setCustomInput={setCustomInput}
          />
        </div>
      </div>
    </div>
  );
};

export default Playground;
