import React from 'react';
import {
    ActivityIndicator,
} from 'react-native';
import {
    Button,
    Text
} from 'native-base';

export default class TaskAction extends React.Component {
    callAction = () => {
        this.props.action(this.props.taskField);
    }

    render() {
        const { style, textStyle, text } = this.props;
        return (
            <Button capitalize block
                disabled={this.props.disabled}
                style={{...style, justifyContent: 'center', alignItems: 'center'}} 
                onPress={this.callAction}>
                {!this.props.disabled 
                    ? <Text style={textStyle}>{text.toUpperCase()}</Text>
                    : <ActivityIndicator color={textStyle.color || 'white'} animating size={textStyle.fontSize || 'small'} />
                }
            </Button>
        );
    }
}