import React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { View, TouchableOpacity } from 'react-native';
import { Text, Button } from 'native-base';
import moment from 'moment';

import BaseModal from './BaseModal';
import { formatTime } from '../../utils';

const ValueField = ({style, onPress, value, disabled=false}) => (
    <TouchableOpacity onPress={disabled ? () => {} : onPress} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
        <Text style={style}>{ formatTime(value, {asUTC: false}) }</Text>
    </TouchableOpacity>
)

export default class TaskTimesModal extends React.Component {
    state = {
        dateTimePickerVisible: false,
        field: null,
        date: null
    }

    handleInputValueChange = (value, field) => {
        this.props.updateTask(field, value);
    }

    _showDateTimePicker = field => this.setState({ dateTimePickerVisible: true, field, date: new Date(this.props.task[field]) });

    _hideDateTimePicker = () => this.setState({ dateTimePickerVisible: false, field: null, date: null });

    _handleDatePicked = date => {
        const value = moment(date).tz('UTC').format();
        this.props.updateTask(this.state.field, value, false);
        this._hideDateTimePicker();       
    };

    render() {
        const { visible, setModalVisible, task, title } = this.props;
        if (!task) {
            console.log('No task!', visible);
            return null;
        }

        return (
            <View style={{flex: 1}}>
                <BaseModal
                    onRequestClose = {() => setModalVisible(false)}
                    visible={visible}
                    contentPadding={20}
                    titleComponent={
                        <View>
                            <Text style={{fontSize: 12, textAlign: 'center', fontWeight: 'bold'}}>ЗАДАЧА</Text>
                            <Text style={{fontSize: 16, textAlign: 'center', fontWeight: 'bold'}}>{title.toUpperCase()}</Text>
                        </View>
                    }
                    actionsComponent={
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Button transparent onPress={() => setModalVisible(false)}>
                                <Text>ЗАКРЫТЬ</Text>
                            </Button>
                        </View>
                    }
                >
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20}}>
                        <View>
                            <Text style={styles.infoText}>НАЧАТА:</Text>
                            <Text style={styles.infoText}>ЗАВЕРШЕНА:</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'stretch'}}>
                            <ValueField style={styles.valueText} onPress={() => this._showDateTimePicker('startTime')} value={task.startTime} />
                            <ValueField style={styles.valueText} disabled={!task.startTime} onPress={() => this._showDateTimePicker('endTime')} value={task.endTime} />
                        </View>
                    </View>
                </BaseModal>
                <DateTimePicker
                    isVisible={this.state.dateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    mode='datetime'
                    date={this.state.date}
                />
            </View>
        )
    }
}

const styles = {
    infoText: {
        alignSelf: 'flex-start',
        paddingBottom: 15,
        fontSize: 16
    },
    valueText: {
        fontSize: 16,
        paddingBottom: 15,
    }
};
