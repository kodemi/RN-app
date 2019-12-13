import React from 'react';
import { StyleSheet, Text, View, Vibration, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MAX_LENGTH = 5;
const VIBRATION_PATTERN = [0, 200];

function makeDots(num) {
    let ret = '';
    while (num > 0) {
        ret += ' ○ ';
        num--;
    }
    return ret;
}

export default class Pin extends React.Component {
    state = {
        value: '',
        disabled: false,
        orientation: null
    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.waiting && nextProps.waiting !== this.props.waiting) {
            this.setState({value: '', disabled: true});
        } else if (!nextProps.waiting && nextProps.waiting !== this.props.waiting) {
            this.setState({disabled: false});
        }
    }

    handleClear() {
        Vibration.vibrate(VIBRATION_PATTERN);       
        this.setState({value: ''});
    }

    handlePress(num) {
        Vibration.vibrate(VIBRATION_PATTERN);
        if (this.state.disabled) { return; }
        let {value} = this.state;
        if (value.length !== MAX_LENGTH) {
            value += String(num);
        }
        this.setState({value});

        if (value.length === MAX_LENGTH) {
            this.setState({disabled: true});
            setTimeout(() => {
                this.props.onSubmit(value);
                this.props.onDone && this.props.onDone();
            }, 500);
        }
    }

    handleRemove() {
        Vibration.vibrate(VIBRATION_PATTERN);       
        const {value} = this.state;
        this.setState({value: value.substr(0, value.length - 1)});
    }

    renderButton(num) {
        return (
            <Text onPress={() => this.handlePress(num)} style={styles.btn}>{String(num)}</Text>
        );
    }

    render() {
        const { value } = this.state;
        const { layout } = this.props;
        const marks = value.replace(/./g, ' ● ');
        const dots = makeDots(MAX_LENGTH - value.length);
        const title = this.props.title || 'Enter pin:';
        const landscape = layout.height < 400;

        return (<View style={[styles.pad, {flexDirection: landscape ? 'row' : 'column'}]}>
            <View style={{flex: 1, paddingTop: 20}}>
                <Text style={styles.header}>
                    {title}
                </Text>

                <View style={styles.pinRow}>
                    <Text style={[styles.pin]}>{marks}{dots}</Text>
                </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', padding: 30, justifyContent: 'center', backgroundColor: 'white'}}>
                <View style={{maxWidth: 400, maxHeight: 450, flex: 1, alignSelf: 'center'}}>
                    <View style={styles.row} >
                        {this.renderButton(1)}
                        {this.renderButton(2)}
                        {this.renderButton(3)}
                    </View>

                    <View style={styles.row} >
                        {this.renderButton(4)}
                        {this.renderButton(5)}
                        {this.renderButton(6)}
                    </View>

                    <View style={styles.row} >
                        {this.renderButton(7)}
                        {this.renderButton(8)}
                        {this.renderButton(9)}
                    </View>

                    <View style={styles.row} >
                        <Text onPress={()=> this.handleClear()} style={styles.btn}>C</Text>
                        {this.renderButton(0)}
                        <Text onPress={()=> this.handleRemove()} style={[styles.btn, {paddingTop: 10}]}><Icon size={Math.round(50 / fontScale)} name='md-backspace' /></Text>
                    </View>
                </View>
            </View>
        </View>);
    }
}

const fontScale = PixelRatio.getFontScale();

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pinRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pad: {
        flex: 1,
        backgroundColor: '#5c68a0'
        // margin: 20,
    },
    btn: {
        fontFamily: 'Droid Sans Mono',
        fontSize: 50 / fontScale,
        lineHeight: Math.round(50 / fontScale),
        height: 60 / fontScale,
        width: 60 / fontScale,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black'
    },
    header: {
        fontSize: 30 / fontScale,
        paddingHorizontal: 10,
        fontWeight: '500',
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
    },
    pin: {
        fontFamily: 'Droid Sans Mono',
        fontSize: 35 / fontScale,
        fontWeight: '500',
        color: 'white',
    },

});