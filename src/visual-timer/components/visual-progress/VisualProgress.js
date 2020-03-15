import React from "react";
import PropTypes from 'prop-types';

import "./VisualProgress.scss";

/*  Component to display progress indicator
See propTypes below for parameters
 */
export function VisualProgress({total = 0, current = 0, alarming}) {

    //  For now only this one visual style is supported
    const visualStyle = 'bar';

    if (!total) return null;

    /* Progress percentage as string for setting CSS width */
    const percentage = total && Math.round(current * 100 / total) || 0;
    return (
        <div className={'VisualProgress' + (alarming ? ' alarming' : '')}>
            {visualStyle === 'bar' &&
            <div className="VisualProgress--bar" style={{
                width: percentage + '%'
            }}/>
            }
        </div>
    );
}

VisualProgress.propTypes = {
    total: PropTypes.number.isRequired,     // Total seconds
    current: PropTypes.number.isRequired,   // Elapsed seconds
    alarming: PropTypes.bool                    // Alarm state
};

