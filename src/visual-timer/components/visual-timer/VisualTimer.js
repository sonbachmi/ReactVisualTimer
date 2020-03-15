import React from "react";
import PropTypes from 'prop-types';

import {VisualProgress} from "../visual-progress/VisualProgress";
import "./VisualTimer.scss";

const propTypes = {
    seconds: PropTypes.number,      // Timeout in seconds
    minutes: PropTypes.number,      // Timeout in minutes (overridden by seconds if present)
    showHours: PropTypes.bool,      // Display hours, default hidden unless necessary
    showLabels: PropTypes.bool,      // Display labels above digits, default shown
    showProgress: PropTypes.bool,      // Display progress indicator below clock, default shown
    autoStart: PropTypes.bool,      // Auto run timer immediately
    alarmBefore: PropTypes.number,  // Timeout in seconds before entering alarm state
    clockStyle: PropTypes.string,  // For now this is ignored and only one value 'flipclock' is used
    /*  State management and communication with consumer    */
    running: PropTypes.bool,        // Flag to control timer. Use this to start/stop timer instead of calling component methods directly
    onStart: PropTypes.func,        // Callback when timer starts
    onStop: PropTypes.func,         // Callback when timer stops
    onEnd: PropTypes.func,          // Callback when timer reaches timeout
    /*  Extra tweaks  */
    speed: PropTypes.number         // Speed multiplication factor (2 = x2 faster) useful for testing long timeout
};

export class VisualTimer extends React.Component {

    /* System timer management */
    /* JavaScript setInterval timer instance */
    timer = null;
    /*  Store start time for each run of timer  */
    startTime = NaN;
    /*  Fraction of 1 second for timer interval  */
    timerResolution = 0.1; // default 10ms. Increase this to save resources, but not above 1

    totalSecs = 0;          // Store value for timeout in total seconds
    alarmSecs = 10;          // Store value for alarm timeout in seconds

    running = false;        // Store the state of running to detect change against props.running control flag

    static InitialState = {
        started: false,     // Timer has started (but possibly being paused)
        alarming: false,    // Timer entered alarm period (defined by props.alarmBefore)
        stopped: false,     // Timer is being stopped/paused
        ended: false,     // Timer ended (reached timeout)
        elapsedSecs: 0,      // Elapsed running seconds since start
        showHours: false    // Whether to display hours
    };
    /*  Component state */
    state = Object.assign({}, VisualTimer.InitialState);

    static DefaultClockFace = {
        hour1: 0,
        hour2: 0,
        min1: 0,
        min2: 0,
        sec1: 0,
        sec2: 0
    };
    /* Store display values for two digits of each time component
    * Updated by timer logic, and read by render()  */
    clockFace = Object.assign({}, VisualTimer.DefaultClockFace);

    constructor(props) {
        super(props);

        /*  These parameters are not expected to change during a timer run,
        so it's safe to save as instance variables for reuse
         */
        this.totalSecs = (props.seconds || (props.minutes || 0) * 60) || 0;
        this.alarmSecs = this.props.alarmBefore || (this.totalSecs >= 20 ? 10 : 0);
        /*  Decide whether to display hours */
        const hours = Math.floor(this.totalSecs / 3600);
        this.state.showHours = this.props.showHours || hours > 0;
    }

    /* Update clock face values for render(). Moved to standalone method to make render() clean */
    updateClockFace(remainingSecs, forceUpdate = false) {
        /*  Calculate decimal digits, just basic arithmetic */
        const secs = remainingSecs % 60;
        const sec2 = secs % 10;
        const sec1 = Math.floor(secs / 10) % 60;
        const mins = Math.floor(remainingSecs / 60) % (this.props.showHours ? 60 : 61);
        const min2 = mins % 10;
        const min1 = Math.floor(mins / 10);
        let hour1 = 0;
        let hour2 = 0;
        const hours = Math.floor(remainingSecs / 3600) % 100;
        if (this.state.showHours) {
            hour2 = hours % 10;
            hour1 = Math.floor(hours / 10);
        }
        this.clockFace = {sec1, sec2, min1, min2, hour1, hour2};
        /*  Since clockFace is not part of state and hence no change detection, this is often necessary */
        if (forceUpdate) {
            this.forceUpdate();
        }
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            this.startTime = NaN;
        }
    }

    /* Start (or resume) timer. Can optionally decide whether to suppress notifying consumer by callback,
         typically when consumer actively initiated this */
    start(notify = true) {
        if (!this.totalSecs) return;
        /* Check for current total elapsed seconds, this may not be zero when timer has been paused */
        let totalElapsedSecs = this.state.elapsedSecs;
        /*  If timer already ended, then reset state */
        if (this.state.ended) {
            this.setState(VisualTimer.InitialState);
            totalElapsedSecs = 0;
            this.clockFace = Object.assign({}, VisualTimer.DefaultClockFace);
            this.updateClockFace(this.totalSecs);
        }
        const speed = Math.round(this.props.speed || 1);
        const scale = 1000/speed;
        if (!this.timer) {
            // Base time for comparison must take into account total elapsed time before pausing
            this.startTime = Date.now() - totalElapsedSecs * scale;
            //  setInterval timer handler
            this.timer = setInterval(() => {
                    //  Only proceed if one more second passed since last check
                    const elapsedSecs = Math.floor((Date.now() - this.startTime) / scale);
                    if (elapsedSecs <= totalElapsedSecs)
                        return;
                    //  Omly proceed if timer running
                    if (!this.state.started || this.state.stopped || this.state.ended) {
                        return;
                    }
                    //  If one second passed, update state and clock
                    totalElapsedSecs++;
                    this.setState(state => ({elapsedSecs: totalElapsedSecs}));
                    const remainingSecs = this.totalSecs - totalElapsedSecs;
                    // If timeout reached, end timer
                    if (remainingSecs <= 0) {
                        this.end();
                    } else {
                        // If alarm timeout reached, update state
                        this.setState({
                            alarming: remainingSecs < this.alarmSecs
                        });
                    }
                    this.updateClockFace(remainingSecs, true);
                },
                /* calling timer handler every one-tenth second, or more or less depending on resolution */
                Math.round(1000 * this.timerResolution)
            )
        }
        this.setState(
            {started: true, stopped: false});
        if (notify && this.props.onStart) {
            this.props.onStart();
        }
    }

    /* Stop/pause timer */
    stop() {
        this.setState(
            {stopped: true});
        this.clearTimer();
        if (this.props.onStop) {
            this.props.onStop();
        }
    }

    /* End timer when timeout reached */
    end() {
        this.setState(
            {started: false, stopped: false, ended: true});
        this.clearTimer();
        if (this.props.onEnd) {
            this.props.onEnd();
        }
    }

    componentDidMount() {
        this.updateClockFace(this.totalSecs, true);
        if (this.props.autoStart) {
            this.start();
        }
    }

    componentDidUpdate() {
        /*  Check for change from props.running control flag, and start/stop timer accordingly\
        */
        if (this.running === this.props.running) return;
        this.running = this.props.running;
        if ((!this.state.started || this.state.stopped || this.state.ended) && this.running) {
            this.start(false);  // Suppress callback as it may create loops
        } else if (this.state.started && !this.state.stopped && this.running === false) {
            this.stop();
        }
    }

    render() {
        if (!this.totalSecs) return null;   // Fall back to nothing if missing user parameters
        const {showLabels = true, showProgress = true} = this.props;
        const {hour1, hour2, min1, min2, sec1, sec2} = this.clockFace;
        return (
            <div className={'VisualTimer' + (this.state.alarming && !this.state.ended ? ' alarming' : '')}
                 style={{borderStyle: 'solid'}}>
                <div className="countdown">
                    {this.state.showHours &&
                    <div className="bloc-time hours">
                        {showLabels &&
                        <span className="count-title">Hours</span>
                        }
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
                        {showLabels &&
                        <span className="count-title">Minutes</span>
                        }

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
                        {showLabels &&
                        <span className="count-title">Seconds</span>
                        }

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
                {(this.state.started || this.state.ended) &&
                showProgress &&
                <VisualProgress total={this.totalSecs} current={this.state.elapsedSecs}
                alarming={this.state.alarming && !this.state.ended}/>
                }
            </div>
        );
    }

    componentWillUnmount() {
        /*  Dispose timer on cleanup. Failing to do this will cause bad leaks */
        this.clearTimer();
    }
}

VisualTimer.propTypes = propTypes;
