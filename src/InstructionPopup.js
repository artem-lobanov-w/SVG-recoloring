import React, { useState, useEffect } from "react";

// Импортируем иконки (например, можно использовать библиотеку react-icons)
// import { FaQuestionCircle, FaTimesCircle } from 'react-icons/fa';
import QuestionMark from "./img/QuestionMark.svg";
import QuestionMarkWhite from "./img/QuestionMarkWhite.svg";
import CloseIcon from "./img/CloseIcon.svg";
import CloseIconWhite from "./img/CloseIconWhite.svg";

const InstructionPopup = ({ isDarkModeNow }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [srcIcon, setSrcIcon] = useState(QuestionMarkWhite);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    if (isPopupOpen) {
      if (!isDarkModeNow) {
        setSrcIcon(CloseIcon);
      } else {
        setSrcIcon(CloseIconWhite);
      }
    } else {
      if (!isDarkModeNow) {
        setSrcIcon(QuestionMark);
      } else {
        setSrcIcon(QuestionMarkWhite);
      }
    }
  }, [isPopupOpen, isDarkModeNow]);

  return (
    <div
      style={{ position: "relative", display: "inline-block", height: "22px" }}
    >
      <img src={srcIcon} alt="copy-code" onClick={togglePopup} />

      {isPopupOpen && (
        <div
          style={{
            position: "absolute",
            width: "400px",
            textAlign: "left",
            top: "30px",
            right: "-262px",
            transform: "translateX(-50%)",
            backgroundColor: "var(--background-not-addded-file-btn)",
            border: "1px solid var(--color-lines)",
            padding: "30px",
            zIndex: 1000,
            lineHeight: "normal",
            fontSize: "14px",
            fontWeight: "400",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid var(--color-lines)",
              paddingBottom: "20px",
            }}
          >
            <b>ВАЖНО:</b> Перед загрузкой файла необходимо{" "}
            <b>экспортировать файл из Фигмы</b>!
            <br />
            <br />
            Это необходимо, чтобы привести все цвета в SVG файле к одному виду — шеснадцатиричной форме записи, например, #000000.
          </div>
          <div
            style={{
              borderBottom: "1px solid var(--color-lines)",
              paddingBottom: "20px",
              color: "var(--text-color)",
            }}
          >
            <br />В программу можно загрузить <b>только SVG файлы</b>.
          </div>
          <div
            style={{
              borderBottom: "1px solid var(--color-lines)",
              paddingBottom: "20px",
              color: "var(--text-color)",
            }}
          >
            <br />
            <b>Ахроматический режим</b> - регулирует только тон цвета,
            насыщенность и светлота исходного файла сохраняются.
            <br />
            <br />
            <b>Хроматический режим</b> - регулирует тон и насыщенность цвета,
            светлота исходного файла сохраняются.
          </div>
          <div>
            <br />
            <b>Копирование кода</b>
            <br />
            При нажатии кнопки "Копировать код SVG", файл можно вставить прямо в Фигму, воспользовавашись <a сlassName="plagin-link" target="_blank" href="https://www.figma.com/community/plugin/1053060499715879789/svg-text-import-export" style={{ color: "var(--text-color)" }}>плагином импорта/экспорта SVG</a>.  
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionPopup;
