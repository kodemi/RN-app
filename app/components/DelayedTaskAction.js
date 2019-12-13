import React from 'react';

import TaskAction from './TaskAction';

const INITIAL_COUNTER = 5;

export default class DelayedTaskAction extends React.Component {
    state = {
        counter: INITIAL_COUNTER,
        started: false
    }

    counterIntervalId = null;

    componentWillUnmount = () => {
        clearInterval(this.counterIntervalId);
    }

    decrementCounter = () => {
        if (this.state.counter === 0) {
            clearInterval(this.counterIntervalId);
            this.setState({started: false, counter: INITIAL_COUNTER});
            return;
        }
        this.setState({counter: --this.state.counter});
    }

    startCountdown = () => {
        this.setState({started: true, counter: INITIAL_COUNTER});
        this.counterIntervalId = setInterval(this.decrementCounter, 1000);
    }

    stopCountdown = (action, args) => {
        clearInterval(this.counterIntervalId);
        this.setState({started: false})
        action(...args);
    }

    render() {
        const { text, action, ...props } = this.props;
        return (
            <TaskAction {...props} 
                action={this.state.started ? (...args) => this.stopCountdown(action, args) : this.startCountdown} 
                text={text + (this.state.started && ` ... ${this.state.counter}` || '')} 
            />
        );
    }
}