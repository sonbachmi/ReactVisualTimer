import React from "react";

import "./Demo.scss";
import {VisualTimer} from "../visual-timer/components/visual-timer/VisualTimer";

export class Demo extends React.Component {
    state = {
        timerRunning: false,
        timerStopped: false,
        showStopButton: false,
        showRestartButton: false,
    };

    /*  Demo UI actions to control timer */
    startTimer = (event) => {
        this.setState({timerRunning: true, showStopButton: true, showRestartButton: false});
    };
    stopTimer = (event) => {
        this.setState({timerRunning: false, showStopButton: false});
    };
    restartTimer = (event) => {
        /*  Same effect as start, but timer should know this is restart   */
        this.setState({timerRunning: true, showStopButton: true, showRestartButton: false});
    };

    /*  Callback hooks for call by timer   */
    onStart = () => {
        console.log('started');
        this.setState({timerRunning: true, showStopButton: true, showRestartButton: false});
    };
    onStop = () => {
        console.log('stopped');
        this.setState({timerRunning: false, timerStopped: true, showStopButton: false});
    };
    onEnd = () => {
        console.log('ended');
        this.setState({timerRunning: false, showStopButton: false, showRestartButton: true});
    };

    render() {
        return (
            <div className="Demo">
                <VisualTimer seconds={10} autoStart={false} running={this.state.timerRunning}
                             onStart={this.onStart} onStop={this.onStop} onEnd={this.onEnd}/>
                {this.state.showRestartButton ?
                    <button onClick={this.restartTimer}>Restart</button>
                    : !this.state.showStopButton ?
                        <button onClick={this.startTimer}>{this.state.timerStopped ? 'Resume' : 'Start'}</button>
                        : <button onClick={this.stopTimer}>Stop</button>
                }
            </div>
        );
    }
}
