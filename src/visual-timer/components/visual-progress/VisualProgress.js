import React from "react";

export class VisualProgress extends React.Component {

    totalSecs = 0;
    elapsedSecs = 0;

    constructor(props) {
        super(props);
        this.totalSecs = props.totalSecs || 0;
        this.elapsedSecs = props.elapsedSecs || 0;
    }

    getProgressPercentage() {
        return Math.round((this.elapsedSecs * 100) / this.totalSecs) + "%";
    }

    render() {
        return (
        <div className="vtimer-progress">
            <div className="vtimer-progress--bar" style={{
                width: this.getProgressPercentage(this.state.elapsedSecs)
            }}/>
        </div>
        );
    }
}
