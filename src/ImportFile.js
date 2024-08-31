import { useEffect, useState } from 'react';
import './App.css';
import './style.css';
import recoverSvg from "./img/Recover.svg";
import recoverSvgWhite from "./img/RecoverWhite.svg";
import ButtonWithIcon from "./ButtonWithIcon";

const ImportFile = ({ handleFileChange, ResetFile, fileAdded, isDarkTheme }) => { 
    const [iconSrc, setIconSrc] = useState(recoverSvgWhite);

    useEffect(() => {
        if (isDarkTheme) {
            setIconSrc(recoverSvg);
        } else {
            setIconSrc(recoverSvgWhite);
        }
    }, [isDarkTheme]);

    return (
        <div className="change-color-container">
          <form>
            <label className="input-file-label">
              <input
                className="input-file"
                type="file"
                onChange={handleFileChange}
              />
              <span className={`input-file-btn ${fileAdded ? "btn-added-file" : "btn-not-added-file"}`} style={!fileAdded ? { boxShadow: "0 0 70px #ffffff70" } : { boxShadow: "0 0 70px #ffffff00" }}>Выбрать SVG-файл</span>
            </label>
          </form>
          <div style={fileAdded ? { pointerEvents: "auto" } : { opacity: "30%", pointerEvents: "none" }}>
            <ButtonWithIcon fileAdded={fileAdded} iconSrc={iconSrc} handleFunction={ResetFile} text="Восстановить исходный" />
          </div>
        </div>
    );
}

export default ImportFile