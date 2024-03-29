import React from 'react';
import '../../CSS/ControlPanel.css';

const ControlPanel = ({ currentIndex, setCurrentIndex, maxIndex, showVelocities, setShowVelocities }) => {
    
    return (
      <div className="slider-container">
        <h4>Adjust Frame</h4>
        <input className="slider"
          type="range"
          min="0"
          max={maxIndex}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(parseInt(e.target.value, 10))}
        />
      </div>
    );
  };
  
  export default ControlPanel;
  