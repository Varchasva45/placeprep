import Select from "react-select";
import { customStyles } from "../constants/customStyles";
import monacoThemes from "monaco-themes/themes/themelist";

const ThemeDropdown = () => {
    return (
        <div>
            <Select 
                placeholder={`Select Theme`}
                styles={customStyles}
                options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
                    label: themeName,
                    value: themeId,
                    key: themeId,
                }))}
            />
        </div>
    );
}

export default ThemeDropdown;