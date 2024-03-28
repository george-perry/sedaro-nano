import React, { useEffect, useState } from 'react';
import PlotComponent from './Components/Plot/PlotComponent';
import ControlPanel from './Components/ControlPanel/ControlPanel';
import './App.css';

const App = () => {
  const [plotData, setPlotData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [maxIndex, setMaxIndex] = useState(0);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    // fetch plot data when the component mounts
    async function fetchData() {
      try {
        // 'data.json' should be populated from a run of sim.py
        const response = await fetch('data.json');
        const data = await response.json();
        const updatedPlotData = {};

        data.forEach(([t0, t1, frame]) => {
          for (let [agentId, { x, y }] of Object.entries(frame)) {
            updatedPlotData[agentId] = updatedPlotData[agentId] || { x: [], y: [] };
            updatedPlotData[agentId].x.push(x);
            updatedPlotData[agentId].y.push(y);
          }
        });

        setPlotData(Object.values(updatedPlotData));
        console.log('plotData:', Object.values(updatedPlotData));
        // Set the max index to the length of the data
        setMaxIndex(data.length - 1);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      // Clear the interval when the component unmounts
      if (timerId) clearInterval(timerId);
    };
  }, [timerId]);

  const play = () => {
    // If the plot is already fully shown
    if (currentIndex >= maxIndex) {
      reset();
    }
    if (!isPlaying) {
      setIsPlaying(true);
      // Set interval to update the current index
      const id = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= maxIndex) {
            clearInterval(id);
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, 100);
      setTimerId(id);
    }
  };

  const pause = () => {
    // Pause the plot
    setIsPlaying(false);
    if (timerId) clearInterval(timerId);
  };

  const reset = () => {
    // Reset the plot
    setIsPlaying(false);
    setCurrentIndex(0);
    if (timerId) clearInterval(timerId);
  };

  const skipToEnd = () => {
    // Skip to the end of the plot
    setCurrentIndex(maxIndex);
    setIsPlaying(false);
    if (timerId) clearInterval(timerId);
  };

  return (
    <div className="app-container">
      <PlotComponent
        plotData={plotData}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onPlay={play}
        onPause={pause}
        onReset={reset}
        onSkipToEnd={skipToEnd}
        setMaxIndex={setMaxIndex}
      />
      <ControlPanel
        currentIndex={currentIndex}
      />
    </div>
  );
};

export default App;