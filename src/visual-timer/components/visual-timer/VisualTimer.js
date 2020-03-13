import React from "react";

import {VisualProgress} from "../visual-progress/VisualProgress";
import "./VisualTimer.scss";

export class VisualTimer extends React.Component {

    /* JavaScript setInterval timer instance */
    timer = null;

    style = 'flipclock';

    totalSecs = 0;
    alarmSecs = 3;

    running = false;

    state = {
        started: false,
        alarming: false,
        stopped: false,
        elapsedSecs: 0,
        clockFace: {
            /* Store display values for two digits of each time component
            * Updated by timer logic, and read by render()  */
            hour1: 0,
            hour2: 0,
            min1: 0,
            min2: 0,
            sec1: 0,
            sec2: 0
        }
    };

    constructor(props) {
        super(props);

        this.totalSecs = (props.seconds || (props.minutes || 0) * 60) || 0;
    }

    updateClockFace(remainingSecs) {
        const secs = remainingSecs % 60;
        const sec2 = secs % 10;
        const sec1 = Math.floor(secs / 10) % 60;
        const mins = Math.floor(remainingSecs / 60) % (this.props.showHours ? 60 : 61);
        const min2 = mins % 10;
        const min1 = Math.floor(mins / 10);
        let hour1 = 0;
        let hour2 = 0;
        if (this.props.showHours) {
            const hours = Math.floor(remainingSecs / 3600) % 60;
            hour2 = hours % 10;
            hour1 = Math.floor(hours / 10);
            this.setState({clockFace: {hour1, hour2}});
        }
        this.setState({clockFace: {sec1, sec2, min1, min2, hour1, hour2}});
    }

    start() {
        if (!this.totalSecs) return;
        if (!this.timer) {
            const speed = Math.round(this.props.speed || 1);
            this.timer = setInterval(() => {
                    if (!this.state.started || this.state.stopped) return;
                    this.setState(state => ({elapsedSecs: state.elapsedSecs + 1}));
                    const remainingSecs = this.totalSecs - this.state.elapsedSecs;
                    if (remainingSecs <= 0) {
                        this.end();
                    }
                    this.setState({
                        alarming: remainingSecs < this.alarmSecs
                    });
                    this.updateClockFace(remainingSecs);
                },
                /* calling timer handler every one second, or less depending on speed */
                Math.round(1000 / speed)
            );
        }
        this.setState(
            {started: true, stopped: false});
    }

    stop() {
        this.setState(
            {stopped: true});
    }

    end() {
        this.setState(
            {started: false, stopped: false});
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    componentDidMount() {
        this.updateClockFace(this.totalSecs);
        if (this.props.autoStart) {
            this.start();
            this.forceUpdate();
        }
    }

    componentDidUpdate() {
        if (this.running === this.props.running) return;
        this.running = this.props.running;
        if ((!this.state.started || this.state.stopped) && this.props.running) {
            this.start();
        } else if (this.state.started && !this.state.stopped && this.props.running === false) {
            this.stop();
        }
    }

    render() {
        if (!this.totalSecs) return null;
        const {hour1, hour2, min1, min2, sec1, sec2} = this.state.clockFace;
        return (
            <div className={'VisualTimer' + (this.state.alarming ? ' alarming' : '')}
                 style={{borderStyle: 'solid'}}>

                <div className="countdown">
                    {
                        this.props.showHours &&
                        <div className="bloc-time hours">
                            <span className="count-title">Hours</span>
                            <div className="figure hours hour-1">
                                <span className="top">{hour1}</span>
                                <span className="top-back">
                <span>{hour1}</span>
              </span>
                                <span className="bottom">{hour1}</span>
                                <span className="bottom-back">
                <span>{hour1}</span>
              </span>
                            </div>

                            <div className="figure hours hour-2">
                                <span className="top">{hour2}</span>
                                <span className="top-back">
                <span>{hour2}</span>
              </span>
                                <span className="bottom">{hour2}</span>
                                <span className="bottom-back">
                <span>{hour2}</span>
              </span>
                            </div>
                        </div>
                    }

                    <div className="bloc-time min">
                        <span className="count-title">Minutes</span>

                        <div className="figure min min-1">
                            <span className="top">{min1}</span>
                            <span className="top-back">
                        <span>{min1}</span>
                        </span>
                            <span className="bottom">{min1}</span>
                            <span className="bottom-back">
                        <span>0</span>
                        </span>
                        </div>

                        <div className="figure min min-2">
                            <span className="top">{min2}</span>
                            <span className="top-back">
                        <span>0</span>
                        </span>
                            <span className="bottom">{min2}</span>
                            <span className="bottom-back">
                        <span>0</span>
                        </span>
                        </div>
                    </div>
                    <div className="bloc-time sec">
                        <span className="count-title">Seconds</span>

                        <div className="figure sec sec-1">
                            <span className="top">{sec1}</span>
                            <span className="top-back">
                        <span>0</span>
                        </span>
                            <span className="bottom">{sec1}</span>
                            <span className="bottom-back">
                        <span>0</span>
                        </span>
                        </div>

                        <div className="figure sec sec-2">
                            <span className="top">{sec2}</span>
                            <span className="top-back">
                        <span>0</span>
                        </span>
                            <span className="bottom">{sec2}</span>
                            <span className="bottom-back">
                        <span>0</span>
                        </span>
                        </div>
                    </div>
                </div>

                {/*Display visual progress*/}
                {
                    this.state.started &&
                    <VisualProgress totalSecs={this.totalSecs} elapsedSecs={this.state.elapsedSecs}/>
                }
            </div>
        );
    }

    componentWillUnmount() {
        /*  Dispose timer on cleanup. Failing to do this will cause disaster */
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
