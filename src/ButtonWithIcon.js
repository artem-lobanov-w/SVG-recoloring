import "./App.css";
import "./style.css";
import React from "react";

const ButtonWithIcon = ({ fileAdded, handleFunction, iconSrc, text }) => {
  return (
    <div
      className="btn-with-icon"
      onClick={fileAdded ? handleFunction : null}
    >
      <img className="recover-icon" src={iconSrc} alt="Восстановить" />
      <p className="download-code-svg">{text}</p>
    </div>
  );
};

export default ButtonWithIcon;
