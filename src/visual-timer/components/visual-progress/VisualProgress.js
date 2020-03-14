import React from "react";

import "./VisualProgress.scss";

export function VisualProgress(props) {

    //  For now only this one visual style is supported
    const visualStyle = 'bar';

    let { totalSecs, elapsedSecs } = props;
    if (!totalSecs) totalSecs = 1;
    if (!elapsedSecs) elapsedSecs = 0;

    /* Progress percentage as string for setting CSS width */
    const percentage = Math.round(elapsedSecs * 100
        / totalSecs) + "%";
    return (
        <div className="VisualProgress">
            {visualStyle === 'bar' &&
            <div className="VisualProgress--bar" style={{
                width: percentage
            }}/>
            }
        </div>
    );
}

