import React from "react";

import "./Demo.scss";
import {VisualTimer} from "../visual-timer/components/visual-timer/VisualTimer";

export class Demo extends React.Component {
    state = {
        timerRunning: false
    };

    startTimer = (event) => {
        this.setState({ timerRunning: true});
    };
    stopTimer = (event) => {
        this.setState({ timerRunning: false});
    };
    render() {
        const running = this.state.timerRunning;
        return (
            <div className="Demo">
                <VisualTimer seconds={20} autoStart={true}/>
                {!running ?
                    <button onClick={this.startTimer}>Start</button>
                    : <button onClick={this.stopTimer}>Stop</button>
                }
            </div>
        );
    }
}