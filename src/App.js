import "./App.css";
import "./style.css";
import React, { useState, useRef } from "react";
import ControlPanel from "./ControlPanel";
import Header from "./Header";

const App = () => {
  
  const [isDarkMode , setIsDarkMode] = useState(true);
  const [svgString, setSvgString] = useState(` `);
  
  const svgRef = useRef();
  
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeSvgString = (svgString) => {
    setSvgString(svgString);
  }
 
  return (
    <div className="App">
      <Header isDarkMode={isDarkMode} handleToggleTheme={handleToggleTheme}  />
      
      <ControlPanel svgRef={svgRef} changeSvgString={changeSvgString} svgString={svgString} isDarkMode={isDarkMode} />
      <div
        ref={svgRef}
        style={{ maxWidth: "100%", width: "100%" }}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
      <p className="author-info">
        Created by{" "}
        <a className="author-link" target="_blank" href="https://github.com/artem-lobanov-w">
          Artem Lobanov
        </a>
      </p>
    </div>
  );
}

export default App;
