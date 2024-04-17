import  { useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import LanguageDropdown from "./LanguageDropdown";
import { languageOptions } from "../constants/languageOptions";
import  ThemeDropdown from "./ThemeDropdown";

const Playground = () => {
    const [language, setLanguage] = useState(languageOptions[0]);

    const onSelectChange = (sl) => {
        console.log("selected Option...", sl);
        setLanguage(sl);
    };

    return(
        <div>
            <LanguageDropdown onSelectChange={onSelectChange} />
            <ThemeDropdown />
            <CodeEditorWindow onChange={""} language={language?.value} code={""} theme={""} />
        </div>
    )

}

export default Playground;