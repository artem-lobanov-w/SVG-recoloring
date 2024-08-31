import React from "react";
import { useEffect } from "react";
import InstructionPopup from "./InstructionPopup";
import ToggleSwitch from "./ToggleSwitch";
import "./style.css";
const Header = ({ isDarkMode, handleToggleTheme }) => {
  const themeStyles = {
    "--background-color": ["#111111", "#fafafa"],
    "--text-color": ["#e9e9e9", "#333"],
    "--background-not-addded-file-btn": ["#2e2e2e", "#f0f0f0"],
    "--border-not-addded-file-btn": ["#fff", "#333"],
    "--background-addded-file-btn": ["#2e2e2e", "#f0f0f0"],
    "--border-addded-file-btn": ["#696969", "#d1d1d1"],
    "--background-change-color-btn": ["#2e2e2e", "#f0f0f0"],
    "--text-color-btn-dwnld": ["#111111", "#fff"],
    "--background-btn-dwnld": ["#fff", "#2e2e2e"],
    "--color-lines": ["#2c2c2c", "#d1d1d1"],
    "--color-lines-instructions": ["#4b4b4b", "#d1d1d1"],
    "--border-color-input-file-btn": ["#696969", "#c3c0c0"],
    "--text-color-author": ["#555555", "#c3c0c0"],
  };
  useEffect(() => {
    Object.entries(themeStyles).forEach(([styleName, colors]) => {
      document.documentElement.style.setProperty(
        styleName,
        colors[isDarkMode ? 0 : 1]
      );
    });
  }, [isDarkMode]);
  return (
    <div className="header">
      <h1>SVG recolor</h1>
      <div className="switch-container switch-theme-container">
        <ToggleSwitch
          isOn={isDarkMode}
          isThemeSwitch={true}
          handleToggle={handleToggleTheme}
          onColor={"#898989"}
        />
        <p className="switch-description">
          <span
            style={isDarkMode ? { fontWeight: "bold" } : { fontWeight: "bold" }}
          >
            {isDarkMode ? "Тёмная " : "Светлая "}
          </span>
          тема
        </p>
      </div>
      <div className="switch-container instructions-container">
        <p>Инструкция</p>
        <InstructionPopup isDarkModeNow={isDarkMode} />
      </div>
    </div>
  );
};

export default Header;
