import React from 'react';
import {VisualTimer} from "react-visual-timer";
import '../index.css';

export default {
    component: VisualTimer,
    title: 'Visual Timer'
};

export const autoStart = () => <VisualTimer minutes={3} seconds={20} autoStart={true} />;
export const doubleSpeed = () => <VisualTimer minutes={3} seconds={20} autoStart={true} speed={2} />;

