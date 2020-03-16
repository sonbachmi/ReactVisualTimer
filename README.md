# react-visual-timer
React component for visual time control clock

## Get Started
~~~shell script
    $ npm install react-visual-timer
~~~
Import and use in your React app:
~~~jsx harmony
    import {VisualTimer} from "react-visual-timer";
    ...
    <VisualTimer minutes={30} />
~~~
You can further customize or control the component with additional props:
~~~jsx harmony
    <VisualTimer 
        minutes={5} seconds={30}
        showLabels={false}
        autoStart={true}
        alarmBefore={60}
        running={this.state.timerRunning}
        onEnd={() => console.log('You run out of time!')}
         />
~~~
## Configuration
Pass these props to the component to customize settings and display behavior. All are optional.

#### minutes
Timeout in minutes
#### seconds
Timeout in seconds. This will be added to `minutes` if both present.
Either `seconds` and/or `minutes` must be specified for component to work.
#### showHours
(Boolean) whether to show hours. Default is `false`. This only applies for timeout less than one hour. When timeout is more than one hour will always display hours regardless of this setting.
#### showLabels
(Boolean) whether to show text labels above digits (_Hours_, _Minutes_ and _Seconds_). Default is `true`.
#### showProgress
(Boolean) whether to show progress indicator. Default is `true`.
#### alarmBefore
Number of seconds remaining before entering alarm mode, which renders red color to warn user to hurry up. Default is 10 seconds if timeout is more than 20 seconds, or 0 otherwise.
#### clockStyle
Display theme of the timer. Currently only one style is used (flip clock) so this is ignored.

## Control
The component promotes the rule of unidirectional flow and encourages consumer to pass the following props to control behavior instead of calling component methods directly.
#### autoStart
(`Boolean`) Whether timer starts immediately. Default is `false`.
#### running
(`Boolean`) Pass a control flag that the consumer sets dynamically. To start the timer (if not running), set it to `true`.
To stop the timer (if running), set it to `false`.
#### onStart
(`Function`) Callback that the timer will call on starting. Actions initiated by the consumer (like setting `running`) will bypass this call.
#### onStop
(`function`) Callback that the timer will call on stopping. Actions initiated by the consumer (like setting `running`) will bypass this call.
#### onEnd
(`Function`) Callback that the timer will call on ending (timeout reached)

## Debug
#### speed
(`Number`) Multiplication factor to speed up timer, useful for testing long timeout. For example, `10` will run the timer 10x faster.

## Project Structure
`/package/` is the independent directory reserved for the component with build tools to publish as NPM package.

Otherwise it is just a CRA app that presents a demo. You can refer to the source code of the demo for practical example of how to use the component.
