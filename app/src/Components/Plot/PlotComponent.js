import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import '../../CSS/PlotComponent.css';

const PlotComponent = ({
  plotData,
  currentIndex,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onSkipToEnd,
}) => {

  // Create a button object
  const createButton = (name, iconPath, action) => {
    return {
      name,
      icon: {
        'width': 500,
        'height': 600,
        'path': iconPath,
      },
      click: action,
    };
  }
  
  // Get the configuration for the plot
  const getConfig = () => {
    const commonConfig = {
      scrollZoom: !isPlaying,
      displayModeBar: true,
    };
    // If the plot is playing, show the pause button
    if (isPlaying) {
      return {
        ...commonConfig,
        modeBarButtonsToAdd: [pauseButton, resetButton, skipButton],
        modeBarButtonsToRemove: [
          'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 
          'autoScale2d', 'resetScale2d', 'toImage'
        ],
      };
    }
    // If the plot is not playing, show the play button 
    else {
      return {
        ...commonConfig,
        modeBarButtonsToAdd: [playButton, resetButton, skipButton],
      };
    }
  };

  // Define the SVG paths for the icons
  const iconPaths = {
    play : 'M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z',
    pause : 'M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z',
    reset : 'M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z',
    skip : 'M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z'
  }

  const playButton = createButton('Play', iconPaths.play, onPlay);
  const pauseButton = createButton('Pause', iconPaths.pause, onPause);
  const resetButton = createButton('Reset', iconPaths.reset, onReset);
  const skipButton = createButton('Skip', iconPaths.skip, onSkipToEnd);

  // Display the plot data up to the current index
  const displayData = plotData.map(dataSet => ({
    ...dataSet,
    x: dataSet.x.slice(0, currentIndex + 1),
    y: dataSet.y.slice(0, currentIndex + 1),
  }));

  // Retrieve the min/max x&y values to set plot range
  const calculateMinMaxValues = (data) => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    data.forEach(dataSet => {
      dataSet.x.forEach(value => {
        if (value < minX) minX = value;
        if (value > maxX) maxX = value;
      });
  
      dataSet.y.forEach(value => {
        if (value < minY) minY = value;
        if (value > maxY) maxY = value;
      });
    });
    return { minX, maxX, minY, maxY };
  };

  const { minX, maxX, minY, maxY } = calculateMinMaxValues(plotData);

  return (
    <div className="plot-container">
      <Plot
        style={{ width: '100%', height: '85vh', left: 0, top: 0 }}
        data={displayData}
        layout={{
          title: 'Visualization',
          xaxis: { 
            range: [minX, maxX] 
          },
          yaxis: {
            range: [minY, maxY],
            scaleanchor: 'x',
          },
          autosize: true,
          
        }}
        config={getConfig()}
      />
    </div>
  );
};

export default PlotComponent;