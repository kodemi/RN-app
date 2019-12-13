import React, { Component } from 'react';
import { Input } from 'native-base';

export default class NumericInput extends Component {
    render () {
        const { value, name, onChange, autoFocus, disabled=false } = this.props;
        return (
            <Input keyboardType='numeric'
                ref={name}
                value={value && value.toString() || ''}
                selectTextOnFocus={true}
                autoFocus={autoFocus}
                disabled={disabled}
                onSubmitEditing={() => this.refs[name]._root.blur()}
                onChangeText={(value) => onChange(value || 0, name)} />
        );
    }
}