
import React, { useState, useId } from 'react';
import './ToggleSwitch.css'; // Стили вынесены в отдельный файл

const ToggleSwitch = ({ isOn, handleToggle, onColor }) => {
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
        className="toggle-switch-label"
        htmlFor={id}
      >
        <span className={`toggle-switch-button`} />
      </label>
    </div>
  );
};
export default ToggleSwitch;