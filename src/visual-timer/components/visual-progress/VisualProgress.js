import React from "react";
import PropTypes from 'prop-types';

import "./VisualProgress.scss";

/*  Component to display progress indicator
See propTypes below for parameters
 */
export function VisualProgress(props) {

    //  For now only this one visual style is supported
    const visualStyle = 'bar';

    let { totalSecs, elapsedSecs } = props;
    if (!totalSecs) return null;
    if (!elapsedSecs) elapsedSecs = 0;

    /* Progress percentage as string for setting CSS width */
    const percentage = Math.round(elapsedSecs * 100
        / totalSecs) + "%";
    return (
        <div className={'VisualProgress' + (props.alarming ? ' alarming' : '')}>
            {visualStyle === 'bar' &&
            <div className="VisualProgress--bar" style={{
                width: percentage
            }}/>
            }
        </div>
    );
}

VisualProgress.propTypes = {
    totalSecs: PropTypes.number.isRequired,     // Total seconds
    elapsedSecs: PropTypes.number.isRequired,   // Elapsed seconds
    alarming: PropTypes.bool                    // Alarm state
};

