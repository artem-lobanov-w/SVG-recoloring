import "./App.css";
import "./style.css";
import React, { useState, useEffect, useRef } from "react";
import ToggleSwitch from "./ToggleSwitch";
import deleteSvg from "./img/Delete.svg";
import recoverSvg from "./img/Recover.svg";
import pickerSvg from "./img/Picker.svg";

function App() {
  const [svgString, setSvgString] = useState(` `);
  const [svgStringFile, setSvgStringFile] = useState(null);
  const [fileAdd, setFileAdd] = useState(false);
  const [newColor, setNewColor] = useState("#fffaaa");
  const [isOn, setIsOn] = useState(false);
  const [originalSvgString, setOriginalSvgString] = useState('');

  const svgRef = useRef();

  const handleToggle = () => {
    setIsOn(!isOn);
  };
  useEffect(() => {
    if (svgStringFile) {
      handleColorChange();
    }
  }, [isOn]);
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStringFile, "image/svg+xml");
    const svgs = doc.querySelectorAll("svg");
    if (svgStringFile) {
      svgs.forEach((svg) => {
        svg.setAttribute("style", "max-width: 1160px; height: 520px; ");
      });
      const modifiedSVG = new XMLSerializer().serializeToString(doc);
      setSvgString(modifiedSVG);
    }
  }, [svgStringFile]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svgString);
      alert("Код SVG скопирован в буфер обмена!");
    } catch (err) {
      console.error("Не удалось скопировать код SVG: ", err);
    }
  };

  function changeHue(color1, color2) {
    // Функция для преобразования HEX в HSL
    function hexToHSL(hex) {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;

      let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // оттенок отсутствует, ахроматический
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return [h * 360, s * 100, l * 100];
    }

    // Функция для преобразования HSL в HEX
    function hslToHex(h, s, l) {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, "0");
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    }

    // Получаем HSL значения обоих цветов
    let [h1, s1, l1] = hexToHSL(color1);
    let [h2, s2, l2] = hexToHSL(color2);
    let colR;
    if (!isOn) {
      colR = hslToHex(h2, s1, l1);
    } else {
      colR = hslToHex(h2, s2, l1);
    }

    // Создаем новый цвет с тоном второго цвета и насыщенностью/яркостью первого
    return colR;
  }
  const nameToHex = (colorName) => {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = colorName;
    return ctx.fillStyle;
  };

  const handleColorChange = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStringFile, "image/svg+xml");

    const elements = doc.querySelectorAll("*");

    elements.forEach((element) => {
      let fillColor = element.getAttribute("fill");
      if (fillColor && !fillColor.startsWith("url(#") && fillColor !== "none") {
        if (!fillColor.startsWith("#") && !fillColor.startsWith("rgb")) {
          fillColor = nameToHex(fillColor);
        }
        const colorResult = changeHue(fillColor, newColor);
        element.setAttribute("fill", colorResult);
      }

      let strokeColor = element.getAttribute("stroke");
      if (
        strokeColor &&
        !strokeColor.startsWith("url(#") &&
        strokeColor !== "none"
      ) {
        if (!strokeColor.startsWith("#") && !strokeColor.startsWith("rgb")) {
          strokeColor = nameToHex(strokeColor);
        }
        const colorResult = changeHue(strokeColor, newColor);
        element.setAttribute("stroke", colorResult);
      }
    });

    // Изменение градиентов
    const gradients = doc.querySelectorAll("linearGradient, radialGradient");
    gradients.forEach((gradient) => {
      const stops = gradient.querySelectorAll("stop");
      stops.forEach((stop) => {
        let gradientColor = stop.getAttribute("stop-color");
        if (gradientColor && gradientColor !== "none") {
          if (
            !gradientColor.startsWith("#") &&
            !gradientColor.startsWith("rgb")
          ) {
            gradientColor = nameToHex(gradientColor);
          }
          const colorResult = changeHue(gradientColor, newColor);
          stop.setAttribute("stop-color", colorResult);
        }
      });
    });

    const svg = doc.querySelectorAll("svg")[0];
    svg.setAttribute("style", "max-width: 1160px; height: 520px; ");

    const masks = doc.querySelectorAll("mask");
    masks.forEach((mask) => {
      mask.setAttribute("style", "mask-type:alpha");
    });

    const modifiedSVG = new XMLSerializer().serializeToString(doc);
    setSvgString(modifiedSVG);
  };

  const handleDeleteFile = () => {
    setFileAdd(false);
    setSvgStringFile(null);
    setSvgString(null);
  };

  const handleFileChange = (event) => {
    setIsOn(false);
    const file = event.target.files[0];
  
    if (file && file.type === "image/svg+xml") {
      setFileAdd(true);
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const svgContent = e.target.result;
        setSvgStringFile(svgContent);
        setSvgString(svgContent);

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, "image/svg+xml");
        const svgOriginal = doc.querySelectorAll("svg")[0];
        svgOriginal.setAttribute("style", "max-width: 1160px; height: 520px; ");
        const modifiedSVG = new XMLSerializer().serializeToString(doc);
        // Исходное состояние файла
        setOriginalSvgString(modifiedSVG); 
      };
  
      reader.readAsText(file);
    } else {
      console.error("Выбран неверный тип файла.");
    }
  };

  const handleDownloadSVG = () => {
    const svgElement = svgRef.current.querySelectorAll("svg")[0];
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);

    const blob = new Blob([source], { type: "image/svg+xml" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recolored-svg-image.svg";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const ResetFile = () => {
    setSvgString(originalSvgString); // Восстанавливаем исходное состояние
  };

  return (
    <div className="App">
      <h1>SVG recolor</h1>
      <div className="control-panel">
        <div className="change-color-container">
          <form>
            <label className="input-file-label">
              <input
                className="input-file"
                type="file"
                onChange={handleFileChange}
              />
              <span className="input-file-btn" style={svgStringFile ? { boxShadow: "0 0 70px #ffffff00", border: "1px solid #696969" } : { boxShadow: "0 0 70px #ffffff70", border: "1px solid #ffffff" }}>Выбрать SVG-файл</span>
            </label>
          </form>
          <div className="delete-btn" onClick={ResetFile} style={svgStringFile ? { opacity: "100%", pointerEvents: "auto" } : { opacity: "30%", pointerEvents: "none" }}>
            <img className="delete-icon" src={recoverSvg} alt="Восстановить" />
            <p>Восстановить исходный</p>
          </div>
        </div>
        <div className="change-color-container" style={svgStringFile ? { opacity: "100%", pointerEvents: "auto" } : { opacity: "30%", pointerEvents: "none" }}>
          <div className="change-color">
            <div className="input-color" style={svgStringFile ? { boxShadow: `0 0 40px ${newColor}80` } : { boxShadow: `0 0 40px ${newColor}00` }}>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <img className="recover-icon" src={pickerSvg} alt="Восстановить" />
            </div>
            <button
              className="change-color-button"
              onClick={fileAdd ? handleColorChange : null}
              style={{ border: `1px solid ${newColor}` }}
            >
              Применить
            </button>
            {/* <div className="input-color" onClick={ResetFile}></div> */}
          </div>
          <div className="switch-container">
            <ToggleSwitch
              isOn={isOn}
              handleToggle={handleToggle}
              onColor={newColor}
            />
            <p className="switch-description">
              Режим{" "}
              <span style={isOn ? { color: newColor } : { color: "#ffffff" }}>
                {isOn ? "хроматический" : "ахроматический"}
              </span>
            </p>
          </div>
        </div>
        <div className="download-container" style={svgStringFile ? { opacity: "100%", pointerEvents: "auto" } : { opacity: "30%", pointerEvents: "none" }}>
          <button onClick={svgStringFile ? handleDownloadSVG : null}>Скачать SVG</button>
          <p className="download-code-svg" onClick={svgStringFile ? handleCopy : null}>Скопировать код SVG</p>
        </div>
      </div>
      <div
        ref={svgRef}
        style={{ maxWidth: "100%", width: "100%" }}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
      <p className="author-info">
        Created by{" "}
        <a className="author-link" href="https://github.com/artem-lobanov-w">
          Artem Lobanov
        </a>
      </p>
    </div>
  );
}

export default App;
