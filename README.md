#### George Perry
#### 3/27/2024

# Sedaro Nano
## Setup

1. Clone this repository.
2. To compile and run the app, execute the following command
   - ```docker compose up app```
3. View the page on a web browser at http://localhost:3000/

## Write-up

### React enhancements

My main focus throughout this process was to improve the experience on the frontend. I wanted to create functionality to play the simulation from start to finish, giving users the ability to easily navigate through the entire simulation and pause the sequence at any point. I also added a slider with increment/decrement buttons to further give the user more control, and I added functionality to display the satellite's velocities and current time for each individual frame. I thought this would be useful because an interactive animation can break down complex concepts or patterns in a simulation and process them into more digestible pieces. Dynamic content like this is also more likely to be more engaging and accommodating, especially when it comes to data visualization.

To accomplish this, I first modularized the React components into separate files - I used a stateful parent component (App.js) that controlled logic related to shared component data, then split the visuals for the plot (PlotComponent.js) and the control panel (ControlPanel.js) into stateless child components. Doing so made the code more understandable and maintainable.  

The state management properties I used correspond to the simulation’s progress – the “currentIndex” and “maxIndex” properties are used to keep track of the current frame being displayed by the plot and the final possible frame. The “isPlaying” property determines if a simulation is already running. Additionally, the usage of “timerId” and intervals are used to manage the intervals responsible for progressing the animation, so the playback control is accurate from start to finish. The “play()” function handles most of this described logic, and there are also functions and corresponding buttons to pause, reset, and skip to the end of the animated simulation. The only other extra functions and properties I declared are used to streamline the creation of these additional custom buttons and their icons and to increase or decrease the current displayed frame from the control panel.

### Simulation enhancements

The changes I made to the Python file weren’t nearly as involved, but I would argue that they still make a difference. The first thing I did was move some of the logic from the propagate function into a new function that calculates the gravitational effect on velocity, and I felt that this improved readability and made it a bit less complex. It also added necessary logic to prevent a division by 0. The only other change I made was in the simulation loop at the end of the file – I changed the set comparison to an all() function to avoid temporary data structure creation. The previous implementation would have created 2 sets from the keys of “universe” and “init” before comparing them, unnecessarily increasing the computational overhead. The all() function, on the other hand, prevents this and uses short-circuit evaluation which will stop the loop as soon as it encounters a False condition.


### Challenges & Potential Future Work

One of the challenges I faced throughout the React enhancement implementation was to integrate my ideas into the pre-existing Plotly component logic. Adding custom buttons to the Modebar wasn’t too tricky; the plotly.com documentation gave me more than enough information to implement the UI changes. I did run into some issues with the built-in zoom/autoscale/hide trace features while the actual animation was running – there didn’t seem to be a way to allow a user to zoom into the plot or hide one of the traces while simultaneously changing the data displayed on the axes. So, I figured it would be best to keep the plot in a fixed position and hide zooming functionality unless the animation was paused or complete.

If I had more time outside of schoolwork/extracurriculars to further enhance the frontend experience, I would have considered scalability - as the data set becomes more complex, it’s crucial to implement some sort of data caching to reduce the load on the server and decrease the longer times it would take the user to load content. I would look towards a type of client-side caching to speed up repeated data accesses, such as if a user chooses to continuously navigate between the same few frames.

One possible additional area of improvement in the simulation file would be the “QRangeStore” data structure. The current implementation uses a list to store range-value pairs, which has a linear time complexity for insertion and lookups. To improve this, I could rework the class and the file’s logic to make use of a tree-type structure, such as a Binary Search Tree. This data structure would store each interval on a node, and it would be ordered by the starting point of each interval. This type of structure would allow for better performance, as its operations would have a logarithmic time complexity. 

### Additional thoughts on the simulation fluctuations

Throughout the process of improving visualizations, I encountered a discrepancy. The data fed into Plotly describes each object's position in separate arrays, with each array element storing an object that includes an x/y coordinate. In theory, an animation should show both objects' respective x/y positions at the same time. The challenge arises because the timestamps for both objects do not perfectly align. For example, the fifth element ```currentIndex = 4``` of each array represents slightly different moments in time. Looking at the Python simulation file, we can see this discrepancy is a result of the values calculated with ```'timeStep': 0.01+random()*0.09```.

These fluctuations in time steps made it hard to provide a completely accurate animation visualization. I did some research on discrepancies in simulation data and found that using a variable time step like this may be trying to mimic ephemeris errors or some degree of uncertainty/unpredictability in real-world scenarios. I concluded that interpolating the positions of both entities to align their times would be the best solution to this issue, even if the exact times are not present in the original data. My research resulted in the following process to interpolate a single frame:

- First, choose a target time $\LARGE (t)$ to represent a specific frame
- Then, identify 2 data points in each array that we want to use to represent that single frame
- Calculate the new position at the desired time point by interpolating these points, as shown by the following formula, where $\LARGE x_0$ is the initial x-coordinate, $\LARGE (x_1 - x_0) \over \LARGE (t_1 - t_0)$ represents the rate of change between the 2 points, and $\LARGE (t - t_0)$ calculates how far our target time $\LARGE t$ is away from $\LARGE t_0$ (same goes for the $\LARGE y$ calculation)
   - $\LARGE x = x_0 + {(x_1 - x_0)\over(t_1 - t_0)} * (t - t_0)$
   - $\LARGE y = y_0 + {(y_1 - y_0)\over(t_1 - t_0)} * (t - t_0)$
- The resulting $\LARGE x$ and $\LARGE y$ coordinates are the estimated values for our target time $\LARGE t$
- Repeat this process for each object, and for however many frames we wish to represent
 
To help explain this further I'll give a simple example - say we wish to interpolate the position of a planet traveling in a straight line, with the following known positions:

- $\LARGE x_0 = 0$ at $\LARGE t_0 = 0$
- $\LARGE x_1 = 100$ at $\LARGE t_1 = 10$

We want to get the position at $\LARGE t = 5$:
- $\LARGE x = x_0 + {(x_1 - x_0)\over(t_1 - t_0)} * (t - t_0) = 0 + {(100 - 0)\over(10 - 0)} * (5 - 0) = 50$ meters
 
By doing this, we are estimating a value between 2 known values, assuming that the change between these values is linear... that in itself is a difficult assumption because the movement of planets and satellites is not linear, so this "solution" would only work for the Sedaro Nano mini-project, and I thought it might even be a bit out-of-scope. I learned a lot exploring this idea, and it's definitely an interesting topic I'd like to come back to if I had more time. 



