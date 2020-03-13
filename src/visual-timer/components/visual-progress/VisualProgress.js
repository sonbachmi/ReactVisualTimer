import React from "react";

import "./VisualProgress.scss";

export class VisualProgress extends React.Component {

    totalSecs = 0;
    elapsedSecs = 0;

    /* Progress percentage as string
    Used by render() to set CSS width */
    percentage = '0%';

    visualStyle = 'bar';

    constructor(props) {
        super(props);
        /*  These props won't change once timer started so safe to copy to instance variables for reuse */
        this.totalSecs = props.totalSecs || 0;
        this.visualStyle = props.visualStyle || 'bar';
    }

    render() {
        this.percentage = (Math.floor((this.props.elapsedSecs || 0) * 100)
            / (this.totalSecs || 0)) + "%";
        return (
            <div className="VisualProgress">
                {this.visualStyle === 'bar' &&
                <div className="VisualProgress--bar" style={{
                    width: this.percentage
                }}/>
                }
            </div>
        );
    }
}
