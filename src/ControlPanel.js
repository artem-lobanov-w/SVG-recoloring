import React, { useState, useEffect, useRef } from "react";

import ImportFile from "./ImportFile";
import ChangeColorInput from "./ChangeColorInput";
import ToggleSwitch from "./ToggleSwitch";
import DownloadButtons from "./DownloadButtons";

import "./App.css";
import "./style.css";

const ControlPanel = ({ isDarkMode, svgString, changeSvgString, svgRef }) => {
  const [isOn, setIsOn] = useState(false);
  const [svgStringFile, setSvgStringFile] = useState(null);
  const [newColor, setNewColor] = useState("#41e19c");
  const [originalSvgString, setOriginalSvgString] = useState("");
  const newName = useRef();
  const [isFileAdded, setIsFileAdded] = useState(false);
  
  const handleToggleMode = () => {
    setIsOn(!isOn);
  };

  const ResetFile = () => {
    changeSvgString(originalSvgString);
  };

  const changeHue = (color1, color2) => {
    // Функция для преобразования HEX в HSL
    const hexToHSL = (hex) => {
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
    };

    // Функция для преобразования HSL в HEX
    const hslToHex = (h, s, l) => {
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
    };

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
  };
  const nameToHex = (colorName) => {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = colorName;
    return ctx.fillStyle;
  };

  const handleColorChange = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStringFile, "image/svg+xml");

    const elements = doc.querySelectorAll("*");

    function processColorAttribute(element, attributeName, newColor) {
      let color = element.getAttribute(attributeName);
      if (color && !color.startsWith("url(#") && color !== "none") {
        if (!color.startsWith("#") && !color.startsWith("rgb")) {
          color = nameToHex(color);
        }
        const colorResult = changeHue(color, newColor);
        element.setAttribute(attributeName, colorResult);
      }
    }

    elements.forEach((element) => {
      processColorAttribute(element, "fill", newColor);
      processColorAttribute(element, "stroke", newColor);
    });

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
    changeSvgString(modifiedSVG);
  };

  const handleFileChange = (event) => {
    setIsOn(false);
    const file = event.target.files[0];

    if (file && file.type === "image/svg+xml") {
    setIsFileAdded(true);
      const fileName = file.name.slice(0, -4);
      newName.current = fileName;
      const reader = new FileReader();

      reader.onload = (e) => {
        const svgContent = e.target.result;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, "image/svg+xml");
        const svgOriginal = doc.querySelectorAll("svg")[0];
        svgOriginal.setAttribute("style", "max-width: 1160px; height: 520px; ");
        const modifiedSVG = new XMLSerializer().serializeToString(doc);

        // Исходное состояние файла
        setOriginalSvgString(modifiedSVG);

        setSvgStringFile(modifiedSVG);
        changeSvgString(modifiedSVG);
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
    link.download = newName.current + "-recolored.svg";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStringFile, "image/svg+xml");
    const svgs = doc.querySelectorAll("svg");

    if (svgStringFile) {
      svgs.forEach((svg) => {
        svg.setAttribute("style", "max-width: 1160px; height: 520px; ");
      });
      const modifiedSVG = new XMLSerializer().serializeToString(doc);
      changeSvgString(modifiedSVG);
    }
  }, [svgStringFile]);

  useEffect(() => {
    if (isFileAdded) {
      handleColorChange();
    }
  }, [newColor, isOn]);
  
  return (
    <div className="control-panel">
      <ImportFile
        handleFileChange={handleFileChange}
        ResetFile={ResetFile}
        isDarkTheme={isDarkMode}
        fileAdded={isFileAdded}
      />

      <div
        className="change-color-container"
        style={
            isFileAdded
            ? { opacity: "100%", pointerEvents: "auto" }
            : { opacity: "30%", pointerEvents: "none" }
        }
      >
        <ChangeColorInput
          isFileAdded={isFileAdded}
          newColor={newColor}
          setNewColor={setNewColor}
          handleColorChange={handleColorChange}
          fileAdded={isFileAdded}
        />

        <div className="switch-container">
          <ToggleSwitch
            isThemeSwitch={false}
            isOn={isOn}
            handleToggle={handleToggleMode}
            onColor={newColor}
          />
          <p className="switch-description">
            Режим{" "}
            <span
              style={
                isOn
                  ? { color: newColor, fontWeight: "bold" }
                  : { fontWeight: "bold" }
              }
            >
              {isOn ? "хроматический" : "ахроматический"}
            </span>
          </p>
        </div>
      </div>
      <DownloadButtons
        isDarkTheme={isDarkMode}
        fileAdded={isFileAdded}
        handleDownloadSVG={handleDownloadSVG}
        svgString={svgString}
      />
    </div>
  );
};

export default ControlPanel;
