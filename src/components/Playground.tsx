import { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import LanguageDropdown from "./LanguageDropdown";
import { languageOptions } from "../constants/languageOptions";
import ThemeDropdown from "./ThemeDropdown";
import { loader } from "@monaco-editor/react";
import CustomInput from "./CustomInput";
import OutputWindow from "./OutputWindow";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

type Language = {
    id: number;
    name: string;
    value: string;
    label: string;
}

type Theme = {
    label: string;
    value: string;
    key: string;
}

const codeDefault = `// some comment`;

const Playground = () => {
    const [language, setLanguage] = useState<Language>(languageOptions[0]);
    const [theme, setTheme] = useState<string>("vs-dark");
    const [processing, setProcessing] = useState<boolean | null>(null);
    const [customInput, setCustomInput] = useState<string>("");
    const [code, setCode] = useState<string>(codeDefault);

    useEffect(() => {
      console.log('useEffect')
      const setInitialTheme = async () => {
        try {
          const themeData = await fetch(`/themes/Blackboard.json`).then((res) => res.json());
          const monaco = await loader.init();
          monaco.editor.defineTheme("Blackboard", themeData);
          setTheme("Blackboard");
        } catch (error) {
          console.log("Error setting theme:", error);
        }
      }

      setInitialTheme();
    }, []);

    const onSelectChange = (selectedLanguage: Language) => {
        console.log("Selected language:", selectedLanguage);
        setLanguage(selectedLanguage);
    };

    const handleThemeChange = async (selectedTheme: Theme) => {
        try {
            const themeData = await fetch(`/themes/${selectedTheme.label}.json`).then((res) => res.json());
            console.log("Setting theme:", selectedTheme);
            const monaco = await loader.init();
            monaco.editor.defineTheme(selectedTheme.value, themeData);
            setTheme(selectedTheme.value);
        } catch (error) {
            console.error("Error setting theme:", error);
            // Handle error appropriately (show message to the user, retry, etc.)
        }
    }    

    const checkStatus = async () => {
        // We will come to the implementation later in the code
    };

    const handleCompile = async () => {
      setProcessing(true);
      const formData = {
          language_id: language.id,
          source_code: btoa(code),
          stdin: btoa(customInput),
      }

      const options = {
          method: "POST",
          url: "process.env.REACT_APP_RAPID_API_URL",
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "content-type": "application/json",
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "process.env.REACT_APP_RAPID_API_HOST",
            "X-RapidAPI-Key": "process.env.REACT_APP_RAPID_API_KEY",
          },
          data: formData,
      };

      try {
          const response = await axios.request(options);
          console.log("res.data", response.data);
          const token = response.data.token;
          checkStatus();
      } catch (err: any) {
          let error = err.response ? err.response.data : err;
          setProcessing(false);
          console.log(error);
      }
    }

    return (
        <div className="h-screen flex flex-col p-4 gap-4 relative bg-gray-300">
            <div className="lg:flex hidden gap-4">
                <LanguageDropdown onSelectChange={onSelectChange} />
                <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
                <button onClick={handleCompile} className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/12 absolute left-1/2 transform -translate-x-1/2 shadow-lg flex flex-row gap-2 justify-center">
                  {processing ? "Processing..." : "Compile"}
                  <span><FontAwesomeIcon icon={faPlay}/></span>
                </button>
            </div>
            <div className="flex flex-row gap-4">
                <div className="w-4/6">
                  <CodeEditorWindow onChange={""} language={language?.value} code={""} theme={theme} shadow-lg/>
                </div>
                <div className="flex flex-col w-2/6 gap-5">
                  <OutputWindow />
                  <CustomInput />
                </div>
            </div>
        </div>
    );
}

export default Playground;
