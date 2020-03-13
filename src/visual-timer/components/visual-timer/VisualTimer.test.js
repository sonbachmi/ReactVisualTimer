import React from 'react';
import {act, render} from '@testing-library/react';
import {VisualTimer} from "./VisualTimer";

let container = null;
const defaultSecs = 20;

beforeEach(() => {
});

test('renders all digits except hours with initial values matching total seconds', () => {
    const secs = defaultSecs % 60;
    const sec2 = secs % 10;
    const sec1 = Math.floor(secs / 10) % 60;
    const { container } = render(<VisualTimer id="testComponent" seconds={defaultSecs}/>);
    ['sec-1', 'sec-2', 'min-1', 'min-2'].forEach(digitName => {
        const digit  = container.querySelector('.figure.' + digitName + ' .top');
        expect(digit).toBeVisible();
        if (digitName.startsWith('.sec')) {
            expect(digit && digit.textContent).toBe(digitName.endsWith(1) ? sec1.toString() : sec2.toString());
        }
    });
    const hours  = container.querySelectorAll('.figure.hour .top');
    expect(hours).toHaveLength(0);
});
test('renders hours when enabled with initial values 0', () => {
    const { container } = render(<VisualTimer id="testComponent" seconds={defaultSecs} showHours={true} />);
    ['hour-1', 'hour-2'].forEach(digitName => {
        const digit  = container.querySelector('.figure.' + digitName + ' .top');
        expect(digit && digit.textContent).toBe('0');
    });
});
test('by default is not running after 5 seconds', () => {
    jest.useFakeTimers();
    const { container } = render(<VisualTimer seconds={defaultSecs}/>);
    act(() => {
        jest.advanceTimersByTime(5000);
    });
    const secondUnit  = container.querySelector('.figure.sec-2 .top');
    expect(secondUnit.textContent).toBe('0');
});
test('auto starts and decrements seconds by 1 after 1 second', () => {
    const secs = defaultSecs % 60;
    const sec2 = secs % 10;
    const sec1 = Math.floor(secs / 10) % 60;
    jest.useFakeTimers();
    const { container } = render(<VisualTimer seconds={defaultSecs} autoStart={true}/>);
    act(() => {
        jest.advanceTimersByTime(2000);
    });
    const secondx10  = container.querySelector('.figure.sec-1 .top');
    const second = container.querySelector('.figure.sec-2 .top');
    console.log(secondx10.textContent, second.textContent);
    expect(+secondx10.textContent).toBe(sec1-1);
    expect(second.textContent).toBe('9');
});
