import Select from "react-select";
import { customStyles } from "../constants/customStyles";
import monacoThemes from "monaco-themes/themes/themelist";


const ThemeDropdown: React.FC<any>= ({handleThemeChange, theme}) => {
    return (
        <div>
            <Select 
                placeholder={`Select Theme`}
                options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
                    label: themeName,
                    value: themeId,
                    key: themeId,
                }))}
                value={theme}
                styles={customStyles}
                onChange={handleThemeChange}
            />
        </div>
    );
}

export default ThemeDropdown;