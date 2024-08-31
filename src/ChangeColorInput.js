import React from 'react'

const ChangeColorInput = ({ newColor, setNewColor, handleColorChange, fileAdded, isDarkMode }) => {

    return (
        <div className="change-color">
            <div className="input-color" style={fileAdded && isDarkMode ? { boxShadow: `0 0 40px ${newColor}80` } : { boxShadow: `0 0 40px ${newColor}00` }}>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <div className="indicator-color" style={{ backgroundColor: newColor }}></div>
              <button
                className="change-color-button"
                onClick={fileAdded ? handleColorChange : null}
                style={isDarkMode ? { border: `1px solid ${newColor}` } : { border: `1px solid #696969` }}
              >
                Изменить цвет
              </button>
            </div>
          </div>
    )
}

export default ChangeColorInput