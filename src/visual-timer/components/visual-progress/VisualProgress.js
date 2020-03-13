import React from "react";

import "./VisualProgress.scss";

export class VisualProgress extends React.Component {

    totalSecs = 0;
    elapsedSecs = 0;
    percentage = '0%';

    constructor(props) {
        super(props);
        /*  totalSecs prop won't change for entire life cycle so safe to copy to instance variable for reuse */
        this.totalSecs = props.totalSecs || 0;
    }

    render() {
        this.percentage = Math.floor(((this.props.elapsedSecs||0) * 100)
            / this.totalSecs) + "%";
        return (
        <div className="VisualProgress">
            <div className="VisualProgress--bar" style={{
                width: this.percentage
            }}/>
        </div>
        );
    }
}
