# react-visual-timer
React component for visual time control clock

## Get Started
~~~~
    $ npm install react-visual-timer
~~~~
Import and use in your React component:
~~~~
    import {VisualTimer} from "react-visual-timer";
    ...
    <VisualTimer minutes={30} />
~~~~
You can further customize or control the component with additional props:
~~~~
    <VisualTimer 
        minutes={5} seconds={30}
        showLabels={false}
        autoStart={true}
        alarmBefore={60}
        running={this.state.timerRunning}
        onEnd={() => console.log('You run out of time!')}
         />
~~~~
Full documentation and demo coming soon.
