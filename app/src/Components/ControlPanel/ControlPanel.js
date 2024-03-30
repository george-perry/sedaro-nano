import React from 'react';
import '../../CSS/ControlPanel.css';

const ControlPanel = ({ currentIndex, currentVx, currentVy, currentTime, setCurrentIndex, maxIndex }) => {
    
    const incrementIndex = () => {
        // Prevent the index from going too high
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
    };

    const decrementIndex = () => {
        // Prevent the index from going too low
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    return (
      <div className="control-panel-container">
        <div className="plot-data">
          <h3>Satellite Data:</h3>
          <div className="plot-data-label">
            vx = {currentVx}
          </div>
          <div className="plot-data-label">
            vy = {currentVy}
          </div>
          <div className="plot-data-label">
            time = {currentTime}
          </div>
        </div>
        <div className="slider-header-button-container">
          <h4>Frame {currentIndex}</h4>
          <div className="slider-button-container">
            <button className="button increment" onClick={decrementIndex}>-</button>
            <input className="slider"
              type="range"
              min="0"
              max={maxIndex}
              value={currentIndex}
              onChange={(e) => setCurrentIndex(parseInt(e.target.value, 10))}
            />
            <button className="button decrement" onClick={incrementIndex}>+</button>
          </div>
        </div>
      </div>
    );
  };
  
export default ControlPanel;