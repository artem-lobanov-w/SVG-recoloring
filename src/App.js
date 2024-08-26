import "./App.css";
import "./style.css";
import React, { useState, useEffect, useRef } from "react";
import ToggleSwitch from "./ToggleSwitch";

function App() {
  const [svgString, setSvgString] = useState(` `);
  const [svgStringFile, setSvgStringFile] = useState(null);
  const [fileAdd, setFileAdd] = useState(false);
  const [newColor, setNewColor] = useState("#de1717");

  const [isOn, setIsOn] = useState(true);

  const handleToggle = () => {
    setIsOn(!isOn);
  };
  useEffect(() => {
    if (svgStringFile) {
      handleColorChange();
    }
  }, [isOn]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svgString);
      alert("Текст скопирован в буфер обмена!");
    } catch (err) {
      console.error("Не удалось скопировать текст: ", err);
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
    if (isOn) {
      colR = hslToHex(h2, s1, l1);
    } else {
      colR = hslToHex(0, 0, l1);
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

    const masks = doc.querySelectorAll("mask");
    masks.forEach((mask) => {
      mask.setAttribute("style", "mask-type:alpha");
    });

    const modifiedSVG = new XMLSerializer().serializeToString(doc);
    setSvgString(modifiedSVG);
  };

  const handleFileChange = (event) => {
    setIsOn(true);
    const file = event.target.files[0];

    if (file && file.type === "image/svg+xml") {
      setFileAdd(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        const svgContent = e.target.result;
        setSvgStringFile(svgContent);
        setSvgString(svgContent);
      };

      reader.readAsText(file);
    } else {
      console.error("Выбран неверный тип файла.");
    }
  };

  return (
    <div className="App">
      <h2>SVG recolor</h2>
      <div className="switch-container">
        <ToggleSwitch
          isOn={isOn}
          handleToggle={handleToggle}
          onColor={newColor}
        />
        <p className="switch-description">
          Режим {" "}
          <span style={isOn ? { color: newColor } : { color: "#ffffff" }}>
            {isOn ? "полноцветный" : "монохромный"}
          </span>
        </p>
      </div>
      <div className="control-panel">
        <form>
          <label className="input-file-label">
            <input
              className="input-file"
              type="file"
              onChange={handleFileChange}
            />
            <span className="input-file-btn">Выберите SVG-файл</span>
          </label>
        </form>
        <div className="change-color">
          <div className="input-color">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />
          </div>
          <button
            className="change-color-button"
            onClick={fileAdd ? handleColorChange : null}
            style={{ border: `1px solid ${newColor}` }}
          >
            Изменить цвет
          </button>
        </div>
        <button onClick={handleCopy}>Копировать SVG</button>
      </div>
      <div style={{paddingBottom: '100px'}} dangerouslySetInnerHTML={{ __html: svgString }} />
      <p className="author-info">Created by <a className="author-link" href="https://github.com/artem-lobanov-w">Artem Lobanov</a></p>
    </div>
  );
}

export default App;
