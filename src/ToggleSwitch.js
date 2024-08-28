
import React, { useId } from 'react';
import './ToggleSwitch.css'; // Стили вынесены в отдельный файл

const ToggleSwitch = ({ isOn, handleToggle, onColor, isThemeSwitch }) => {
  const id = useId(); // Используем useId для генерации уникального id

  return (
    <div className="toggle-switch">
      <input
        checked={isOn}
        onChange={handleToggle}
        className="toggle-switch-checkbox"
        id={id}
        type="checkbox"
      />
      <label
        style={{ background: isOn && onColor }}
        className={isThemeSwitch ? "toggle-switch-label switch-theme" : "toggle-switch-label"}
        htmlFor={id}
      >
        <div className={`toggle-switch-button`}>  </div>
      </label>
    </div>
  );
};
export default ToggleSwitch;