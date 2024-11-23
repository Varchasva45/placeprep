import Select from "react-select";
// import monacoThemes from "monaco-themes/themes/themelist";
import { customStyles } from "../constants/customStyles";

const ThemeDropdown = ({ handleThemeChange, theme }: {
  handleThemeChange: any;
  theme: string;
}) => {
  return (
    <Select
      className="hidden lg:flex"
      placeholder="Select Theme"
      value={{ label: theme, value: theme, key: theme }}
      // options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
      //   label: themeName,
      //   value: themeId,
      //   key: themeId,
      // }))}
      styles={customStyles}
      onChange={handleThemeChange}
    />
  );
};

export default ThemeDropdown;
