import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Text as NBText, Button, ListItem, Badge } from 'native-base';
import moment from 'moment';

import { formatTime } from '../utils';
import { getTaskStatus, getTaskType, taskStatuses, taskTypes } from '../api';
import SOPPAgentArrivalDataView from './SOPPAgentArrivalDataView';
import SOPPDriverArrivalDataView from './SOPPDriverArrivalDataView';
import DelayedTaskAction from './DelayedTaskAction';

export default class TaskItem extends Component {
    getAction = () => {
        const status = getTaskStatus(this.props.task);
        const styles = _styles(this.props.wide);
        let actionProps = {};
        switch (status) {
            case taskStatuses.NOTCONFIRMED:
                actionProps = { text: 'Принять', taskField: 'confirmationTime', style: 'action_NOTCONFIRMED' };     
                break;
            case taskStatuses.NEW:
                actionProps = { text: 'Начать', taskField: 'startTime', style: 'action_NEW' }; 
                break;
            case taskStatuses.STARTED:
                actionProps = { text: 'Завершить', taskField: 'endTime', style: 'action_STARTED' }; 
                break;
            case taskStatuses.ENDED:
                actionProps = { text: 'Вернулся', taskField: 'returnTime', style: 'action_ENDED' };
                break; 
            case taskStatuses.RETURNED:
                return <NBText style={styles['action_RETURNED']}>ЗАВЕРШЕНА</NBText>;
        }
        actionProps = {...actionProps, textStyle: styles.actionText, style: {...styles.actionButton, ...styles[actionProps.style]}};
        return <DelayedTaskAction {...actionProps} action={this.updateTask} />;
    }

    updateTask = (field, value) => {
        const { updateTask, auth, task } = this.props;
        setTimeout(() => updateTask(auth.token, task, {[field]: value || moment.utc().format()}), 500);
        this.props.toggleActions(this.props.task);
    }

    toggleActions = () => {
        if (getTaskStatus(this.props.task) === taskStatuses.ENDED) { return; }
        this.props.toggleActions(this.props.task);
    }

    getStatusStyle = (status) => {
        switch(status) {
            case taskStatuses.NOTCONFIRMED:
                return 'status_NOTCONFIRMED';
            case taskStatuses.NEW:
                return 'status_NEW';
            case taskStatuses.STARTED:
                return 'status_STARTED';
            case taskStatuses.ENDED:
                return 'status_ENDED';
            case taskStatuses.FINISHED:
                return 'status_FINISHED';
            case taskStatuses.REJECTED:
                return 'status_REJECTED';
            case taskStatuses.WAITING:
                return 'status_WAITING';
        }
    }

    render() {
        const { task, showActions, wide, setTaskTimesModalVisible, setTaskDataModalVisible } = this.props;
        const taskType = getTaskType(task);    
        const status = getTaskStatus(task);
        const statusStyle = this.getStatusStyle(status);
        const styles = _styles(wide);
        const selectAction = taskType === taskTypes.SST ? () => this.props.onTaskSelect(task) : this.toggleActions;

        return (
            <ListItem style={styles.item} onPress={selectAction}>
                <View style={styles.container}>
                    <View style={[styles.task, styles[statusStyle], showActions && styles.taskOverlayed]}>
                        <TaskInfo {...{task, styles}} />
                        <TaskData {...{task, taskType, status, styles, setTaskDataModalVisible, setTaskTimesModalVisible}} />
                        {showActions && 
                            <View style={styles.actions}>
                                {this.getAction()}
                            </View>
                        }
                    </View>
                </View>
            </ListItem>
        );
    }
}

const TaskInfo = ({ task, styles }) => (
    <View>
        <View style={styles.title}>
            <Text style={styles.service}>{task.service && task.service.toUpperCase()}</Text>
            {!task.confirmationTime && <Badge style={styles.newBadge}><Text style={styles.newBadgeText}>НОВ</Text></Badge>}
        </View>
        <View style={styles.infoWrapper}>
            <Text style={styles.infoText}>ВС: { task.ac }</Text>
            <Text style={styles.infoText}>ТИП: { task.acType }</Text>
            <Text style={styles.infoText}>СТОЯНКА: { task.parkingArea }</Text>
            {!!task.terminal && <Text style={styles.infoText}>ТЕРМИНАЛ: { task.terminal }</Text>}
            {!!task.route && <Text style={styles.infoText}>МАРШРУТ: { task.route }</Text>}
        </View>
    </View>
)

const TaskData = ({ task, taskType, status, styles, setTaskTimesModalVisible, setTaskDataModalVisible }) => {
    const DataView = getTaskDataView(taskType);

    return (
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{paddingRight: 10}}>
                        <Text style={[styles.infoText, status === taskStatuses.NOTCONFIRMED && {fontWeight: 'bold'}]}>ПЕРЕДАНА:</Text>
                        <Text style={[styles.infoText, status === taskStatuses.NEW && {fontWeight: 'bold'}]}>ПРИНЯТА:</Text>
                        {!!task.startWaitingTime && <Text style={[styles.infoText, status === taskStatuses.WAITING && {fontWeight: 'bold'}]}>ОЖИДАНИЕ:</Text>}
                        <Text style={[styles.infoText, status === taskStatuses.STARTED && {fontWeight: 'bold'}]}>НАЧАТА:</Text>
                        <Text style={[styles.infoText, status === taskStatuses.ENDED && {fontWeight: 'bold'}]}>ЗАВЕРШЕНА:</Text>
                        {!!task.rejectTime && 
                            <Text style={[styles.infoText, (status === taskStatuses.REJECTED || task.rejectTime && task.finishTime && !task.returnTime) && {fontWeight: 'bold'}, task.rejectTime && {color: 'red'}]}>
                                ТЕХ. ОТКАЗ:
                            </Text>
                        }
                        {taskType === taskTypes.SST && !(task.rejectTime && task.finishTime && !task.returnTime) && (!task.startAnotherTaskTime 
                            ? <Text style={[styles.infoText, status === taskStatuses.FINISHED && {fontWeight: 'bold'}]}>ВЕРНУЛСЯ:</Text>
                            : <Text style={[styles.infoText, status === taskStatuses.ANOTHER_TASK && {fontWeight: 'bold'}]}>ПЕРЕКЛЮЧИЛСЯ:</Text>
                        )}
                    </View>
                    <View>
                        <Text style={[styles.infoText]}>{ formatTime(task.sendTime, {asUTC: false}) }</Text>
                        <Text style={[styles.infoText]}>{ formatTime(task.confirmationTime, {asUTC: false}) }</Text>
                        {!!task.startWaitingTime && <Text style={[styles.infoText]}>{ formatTime(task.startWaitingTime, {asUTC: false}) }</Text>}
                        <Text style={[styles.infoText]}>{ formatTime(task.startTime, {asUTC: false}) }</Text>
                        <Text style={[styles.infoText]}>{ formatTime(task.endTime, {asUTC: false}) }</Text>
                        {!!task.rejectTime && <Text style={styles.infoText}>{ formatTime(task.rejectTime, {asUTC: false}) }</Text>}
                        {taskType === taskTypes.SST && !(task.rejectTime && task.finishTime && !task.returnTime) && (!task.startAnotherTaskTime 
                            ? <Text style={[styles.infoText]}>{ formatTime(task.returnTime, {asUTC: false}) }</Text>
                            : <Text style={[styles.infoText]}>{ formatTime(task.startAnotherTaskTime, {asUTC: false}) }</Text>
                        )}
                    </View>
                </View>
                <View style={{justifyContent: 'center'}}>
                    {!!task.confirmationTime && taskType !== taskTypes.SST && <Button transparent onPress={() => setTaskTimesModalVisible(true,  task)}>
                        <NBText>ИЗМЕНИТЬ</NBText>
                    </Button>}
                </View>
            </View>
            {task.data && (
                <View style={styles.dataWrapper}>
                    {DataView && <DataView 
                        data={task.data}
                        editable={status !== taskStatuses.NOTCONFIRMED}
                        openModal={() => setTaskDataModalVisible(true, task)}
                    />}
                </View>
            )}
            {task.comment 
                ? <View style={styles.commentWrapper}>
                    <Text style={styles.commentTitle}>КОММЕНТАРИЙ:</Text>
                    <Text style={styles.comment}>{task.comment}</Text>
                </View>
                : null
            }
        </View>
    );
}

const getTaskDataView = (taskType) => {
    switch(taskType) {
        case taskTypes.SOPP_AGENT_ARRIVAL:
            return SOPPAgentArrivalDataView;
        case taskTypes.SOPP_DRIVER_ARRIVAL:
            return SOPPDriverArrivalDataView;
        default:
            return null;
    }
}

const DEFAULT_FONT_SIZE = 12;
const WIDE_FONT_SIZE = DEFAULT_FONT_SIZE * 1.4;

const _styles = (wide) => ({
    dialogContentView: {
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    item: {
        paddingBottom: 0,
        paddingRight: 0,
        paddingTop: 0,
        marginLeft: 0,
    },
    service: {
        paddingBottom: 10,
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: wide ? WIDE_FONT_SIZE * 1.1 : DEFAULT_FONT_SIZE * 1.1
    },
    infoText: {
        fontSize: wide ? WIDE_FONT_SIZE : DEFAULT_FONT_SIZE
    },
    infoWrapper: {
        paddingBottom: 5
    },
    dataWrapper: {
        paddingTop: 5
    },
    commentWrapper: {
        paddingTop: 5
    },
    commentTitle: {
        fontSize: wide ? WIDE_FONT_SIZE : DEFAULT_FONT_SIZE,
        fontWeight: 'bold'
    },
    actionButton: {
        elevation: 5,
        height: 100,
    },
    actionText: {
        color: 'white',
        fontSize: 28
    },
    action_NOTCONFIRMED: {
        backgroundColor: '#ffb31a',
    },
    action_NEW: {
        backgroundColor: '#00cc99',
    },
    action_STARTED: {
        backgroundColor: '#994d00',
    },
    action_ENDED: {
        backgroundColor: '#660033'
    },
    action_RETURNED: {
        color: 'rgba(0, 0, 0, 0.3)'
    },
    status_NOTCONFIRMED: {
        borderColor: '#ff3333',
    },
    status_NEW: {
        borderColor: '#ffb31a'
    },
    status_STARTED: {
        borderColor: '#00cc99',
    },
    status_ENDED: {
        borderColor: '#994d00',
    },
    status_FINISHED: {
        borderColor: '#660033',
    },
    status_REJECTED: {
        borderColor: '#b30000'
    },
    status_WAITING: {
        borderColor: '#ff6666'
    },
    newBadgeText: {
        color: '#ffffff',
        fontSize: DEFAULT_FONT_SIZE,
        lineHeight: DEFAULT_FONT_SIZE + 1
    },
    newBadge: {
        height: 14,
        marginLeft: 5,
        marginTop: 3
    },
    statusBadge: {
        padding: 5,
        backgroundColor: '#00cc99',
        color: 'white'
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actions: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, .45)'
    },
    task: {
        borderLeftWidth: 10,
        paddingLeft: 15,
        paddingRight: 10,
        paddingVertical: 15
    },
    taskOverlayed : {
        borderLeftWidth: 0, 
        paddingLeft: 25
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10
    }
});
