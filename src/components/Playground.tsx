import { useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import LanguageDropdown from "./LanguageDropdown";
import { languageOptions } from "../constants/languageOptions";
import ThemeDropdown from "./ThemeDropdown";
import { loader } from "@monaco-editor/react";

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

const Playground = () => {
    const [language, setLanguage] = useState<Language>(languageOptions[0]);
    const [theme, setTheme] = useState<string>("vs-dark");

    const onSelectChange = (selectedLanguage: Language) => {
        console.log("Selected language:", selectedLanguage);
        setLanguage(selectedLanguage);
    };

    async function handleThemeChange(selectedTheme: Theme) {
        try {
            const themeData = await fetch(`/themes/${selectedTheme.label}.json`).then((res) => res.json());
            console.log("Setting theme:", selectedTheme);
            const monaco = await loader.init();
            monaco.editor.defineTheme(selectedTheme.label, themeData);
            setTheme(selectedTheme.label);
        } catch (error) {
            console.error("Error setting theme:", error);
            // Handle error appropriately (show message to the user, retry, etc.)
        }
    }    

    return (
        <div>
            <LanguageDropdown onSelectChange={onSelectChange} />
            <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
            <CodeEditorWindow onChange={""} language={language?.value} code={""} theme={theme} />
        </div>
    );
}

export default Playground;
