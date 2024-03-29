import React from 'react';
import '../../CSS/ControlPanel.css';

const ControlPanel = ({ currentIndex, setCurrentIndex, maxIndex, showVelocities, setShowVelocities }) => {
    
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
        <h4>Frame {currentIndex}</h4>
        <div className="slider-container">
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
    );
  };
  
export default ControlPanel;
