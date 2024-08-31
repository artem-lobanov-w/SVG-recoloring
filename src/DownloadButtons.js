import "./App.css";
import "./style.css";
import { useEffect, useState } from "react";
import ButtonWithIcon from "./ButtonWithIcon";
import copyCode from "./img/copyCode.svg";
import copyCodeWhite from "./img/copyCodeWhite.svg";

const DownloadButtons = ({ fileAdded, handleDownloadSVG, isDarkTheme, svgString }) => {
    const [iconSrc, setIconSrc] = useState(copyCode);
    const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(svgString);
          alert("Код SVG скопирован в буфер обмена!");
        } catch (err) {
          console.error("Не удалось скопировать код SVG: ", err);
        }
    };

    useEffect(() => {
        if (isDarkTheme) {
            setIconSrc(copyCodeWhite);
        } else {
            setIconSrc(copyCode);
        }
    }, [isDarkTheme]);
    
    return ( 
        <div className="download-container" style={fileAdded ? { opacity: "100%", pointerEvents: "auto" } : { opacity: "30%", pointerEvents: "none" }}>
          <button onClick={fileAdded ? handleDownloadSVG : null}>Скачать SVG</button>
          <ButtonWithIcon fileAdded={fileAdded} handleFunction={handleCopy} iconSrc={iconSrc} text="Скопировать код SVG" />
        </div>
    );
}

export default DownloadButtons;