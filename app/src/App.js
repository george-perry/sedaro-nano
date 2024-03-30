import React, { useEffect, useState } from 'react';
import PlotComponent from './Components/Plot/PlotComponent';
import ControlPanel from './Components/ControlPanel/ControlPanel';
import './CSS/App.css';

const App = () => {
  const [plotData, setPlotData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [maxIndex, setMaxIndex] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [showVelocities, setShowVelocities] = useState({ planet: false, satellite: false });

  useEffect(() => {
    // fetch plot data when the component mounts
    async function fetchData() {
      try {
        // 'data.json' should be populated from a run of sim.py
        const response = await fetch('data.json');
        const data = await response.json();
        const updatedPlotData = {};

        data.forEach(([t0, t1, frame]) => {
          for (let [agentId, { x, y, vx, vy, time }] of Object.entries(frame)) {
            updatedPlotData[agentId] = updatedPlotData[agentId] || { x: [], y: [], vx: [], vy: [], time: [] };
            updatedPlotData[agentId].x.push(x);
            updatedPlotData[agentId].y.push(y);
            updatedPlotData[agentId].time.push(time);
            updatedPlotData[agentId].vx.push(vx);
            updatedPlotData[agentId].vy.push(vy);
          }
        });

        setPlotData(Object.values(updatedPlotData));
        console.log('plotData:', Object.values(updatedPlotData));
        // Set the max index to the length of the longer object
        setMaxIndex(Math.max(Object.values(updatedPlotData)[0]['x'].length, Object.values(updatedPlotData)[1]['x'].length));
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
        currentVx={
          plotData[1] && plotData[1].vx && currentIndex >= 0 && currentIndex < plotData[1].vx.length
            ? plotData[1].vx[currentIndex]
            : 'N/A'
        }
        currentVy={
          plotData[1] && plotData[1].vy && currentIndex >= 0 && currentIndex < plotData[1].vy.length
            ? plotData[1].vy[currentIndex]
            : 'N/A'
        }
        currentTime={
          plotData[1] && plotData[1].time && currentIndex >= 0 && currentIndex < plotData[1].time.length
            ? plotData[1].time[currentIndex]
            : 'N/A'
        }
        setCurrentIndex={setCurrentIndex}
        maxIndex={maxIndex}
        showVelocities={showVelocities}
        setShowVelocities={setShowVelocities}
      />
    </div>
  );
};

export default App;