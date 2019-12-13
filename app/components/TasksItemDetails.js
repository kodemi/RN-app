import React from 'react';
import {
    View,
    Text,
    BackAndroid,
    ScrollView,
    PixelRatio
} from 'react-native';
import {
    Text as NBText,
    Button,
    Icon,
} from 'native-base';
import moment from 'moment';

import SwitchToNewTaskModal from './modals/SwitchToNewTaskModal';
import ConfirmTaskRejectModal from './modals/ConfirmTaskRejectModal';
import CantStartTaskModal from './modals/CantStartTaskModal';
import DelayedTaskAction from './DelayedTaskAction';
import { formatTime } from '../utils';
import { taskStatuses, getTaskStatus, canStartTask, thereAreNewTasks } from '../api';

export default class TasksItemDetails extends React.Component {
    state = {
        orientation: null,
        switchToNewTaskModalVisible: this.props.data.newTask,
        confirmTaskRejectModalVisible: false,
        cantStartTaskModalVisible: false
    }

    componentDidMount = () => {
        BackAndroid.addEventListener('hardwareBackPress', this.unselectTask);
    }

    componentWillUnmount = () => {
        BackAndroid.removeEventListener('hardwareBackPress', this.unselectTask);
    }

    componentWillReceiveProps = (nextProps) => {
        const { task } = nextProps;
        if (!task) { return; }
        const status = getTaskStatus(task);
        if (status === taskStatuses.FINISHED) {
            this.goBack();
        }
        if (nextProps.data.newTask && thereAreNewTasks(nextProps.data.tasks)) {
            this.toggleSwitchToNewTaskModal(true);
            this.props.newTaskHandled();
        }
    }

    getAction = () => {
        const { width, orientation } = this.props.layout;
        const wide = orientation === 'LANDSCAPE';
        const status = getTaskStatus(this.props.task);
        const styles = _styles(wide, width);
        let actionProps = {};
        switch (status) {
            case taskStatuses.NOTCONFIRMED:
                actionProps = { text: 'Принять', taskField: 'confirmationTime', style: 'action_NOTCONFIRMED' };     
                break;
            case taskStatuses.NEW:
                return (
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <DelayedTaskAction action={this.updateTask} text={'Начать'} textStyle={styles.actionTextShort} style={{...styles.actionButton, ...styles['action_NEW']}} taskField={'startTime'} />
                        <DelayedTaskAction action={this.updateTask} text={'Ожидать'} textStyle={styles.actionTextShort} style={{...styles.actionButton, ...styles['action_WAITING']}} taskField={'startWaitingTime'} />                       
                    </View>    
                );
            case taskStatuses.WAITING:
                actionProps = { text: 'Начать', taskField: 'startTime', style: 'action_NEW' }; 
                break;                
            case taskStatuses.STARTED:
                actionProps = { text: 'Завершить', taskField: 'endTime', style: 'action_STARTED' }; 
                break;
            case taskStatuses.ENDED:
            case taskStatuses.REJECTED:
                actionProps = { text: 'Вернулся', taskField: 'returnTime', style: 'action_ENDED' };
                break; 
            case taskStatuses.FINISHED:
                return <NBText style={styles['action_FINISHED']}>ЗАВЕРШЕНА</NBText>;
        }
        actionProps = {
            ...actionProps, 
            disabled: this.props.data.updatingTask === this.props.task.id, 
            textStyle: styles.actionText, 
            style: {...styles.actionButton, ...styles[actionProps.style]}
        };
        return <DelayedTaskAction {...actionProps} action={this.updateTask} />;
    }

    updateTask = (field) => {
        const { updateTask, updateTasks, auth, task, data: {tasks} } = this.props;
        if (field === 'confirmationTime' && !canStartTask(task, tasks)) {
            this.toggleCantStartTaskModal(true);
            return;
        }
        const actionTime = moment.utc().format();
        setTimeout(() => updateTask(auth.token, task, {[field]: actionTime}), 500);
        if (field === 'confirmationTime') {
            const notFinishedTasks = tasks.filter(_task => _task.id !== task.id && !_task.finishTime);
            if (notFinishedTasks.length) {
                updateTasks(notFinishedTasks, {startAnotherTaskTime: actionTime});
            }
        }
    }

    unselectTask = () => {
        setTimeout(() => this.props.selectTask(null), 500);
    }

    goBack = () => {
        this.unselectTask();
        this.props.navigateTo('Tasks', true);
    }

    rejectTask = () => {
        this.updateTask('rejectTime');
    }

    showRejectTask = () => {
        const { task } = this.props;
        return task.confirmationTime && !task.endTime && !task.returnTime && !task.rejectTime;
    }

    switchToTask = () => {
        const task = this.props.data.tasks.filter(task => task.id !== this.props.task.id)[0];
        this.toggleSwitchToNewTaskModal(false);
        this.props.selectTask(task);
        this.props.navigation.navigate('TaskDetails');
    }

    toggleSwitchToNewTaskModal = (visible) => {
        this.setState({switchToNewTaskModalVisible: visible});
    }

    toggleCantStartTaskModal = (visible) => {
        this.setState({cantStartTaskModalVisible: visible});
    }

    showConfirmRejectTaskModal = () => {
        this.setState({confirmTaskRejectModalVisible: true});
    }

    hideConfirmRejectTaskModal = () => {
        this.setState({confirmTaskRejectModalVisible: false});
    }

    confirmTaskReject = () => {
        this.rejectTask();
        this.hideConfirmRejectTaskModal();
    }

    cancelTaskReject = () => {
        this.hideConfirmRejectTaskModal();
    }

    render() {
        const { task } = this.props;
        if (!task) {
            return null; 
        }       
        const { width, orientation } = this.props.layout;
        const wide = orientation === 'LANDSCAPE';
        const styles = _styles(wide, width);
        const tasksCount = this.props.data.tasks.filter(task => getTaskStatus(task) !== taskStatuses.ENDED).length;
        const acFontSize = wide ? getFontSize(width, 14 * task.ac.length / 8, 14) : getFontSize(width, 9 * task.ac.length / 8, 9);
        const serviceFontSize = wide ? getFontSize(width, 38 * task.service.length / 30, 38) : getFontSize(width, 20 * task.service.length / 30, 20);
        const parkingAreaNumberFontSize = wide ? getFontSize(width, 15 * task.parkingArea.length / 20, 15) : getFontSize(width, 7 * task.parkingArea.length / 20, 12);
        
        return (
            <View style={{flex:1}}>
                <View style={styles.container}>
                    {/** Left pane **/}
                    <View style={styles.leftPane}>
                        <TaskInfo task={task} styles={styles} {...{parkingAreaNumberFontSize, serviceFontSize, acFontSize}} />
                        {tasksCount > 1 && <BackButton onPress={this.goBack} styles={styles} />}                       
                    </View>

                    {/** Right pane **/}
                    <View style={styles.rightPane}>
                        {!wide && this.showRejectTask() && <RejectButton onPress={this.showConfirmRejectTaskModal} styles={styles} />}
                        <TaskData task={task} styles={styles} />
                        <View style={styles.actionContainer}>
                            {this.getAction()}
                        </View>
                    </View>
                    {wide && this.showRejectTask() && <RejectButton onPress={this.showConfirmRejectTaskModal} styles={styles} position={{right: null, top: null, bottom: 10, left: 10}} />}                 
                </View>

                <SwitchToNewTaskModal 
                    visible={this.state.switchToNewTaskModalVisible}
                    setModalVisible={this.toggleSwitchToNewTaskModal}
                    switchToTask={this.switchToTask}
                />

                <ConfirmTaskRejectModal
                    visible={this.state.confirmTaskRejectModalVisible}
                    confirmReject={this.confirmTaskReject}
                    cancelReject={this.cancelTaskReject}
                />

                <CantStartTaskModal
                    visible={this.state.cantStartTaskModalVisible}
                    setModalVisible={this.toggleCantStartTaskModal}
                />
            </View>
        );
    }
}

const BackButton = ({onPress, styles}) => (
    <Button transparent style={styles.backButton} onPress={onPress}>
        <Icon name='md-arrow-back' style={styles.backButtonIcon} />
    </Button>
)

const RejectButton = ({styles, onPress, position={}}) => (
    <Button danger style={{...styles.rejectFab, ...position}} onPress={onPress}>
        <Text style={styles.rejectFabText}>ТЕХ. ОТКАЗ</Text>
    </Button>
)

const TaskInfo = ({task, styles, serviceFontSize, parkingAreaNumberFontSize, acFontSize}) => (
    <View style={{alignItems: 'center'}}>
        <Text style={[styles.service, {fontSize: serviceFontSize, lineHeight: serviceFontSize}]}>
            {task.service && task.service.toUpperCase()}
        </Text>
        <Text style={[styles.ac, {fontSize: acFontSize, lineHeight: acFontSize}]}>{task.ac}</Text>
        <Text style={styles.acType}>{task.acType}</Text>
        <View style={styles.parkingAreaWrapper}>
            <Text style={[styles.parkingAreaNumber, {fontSize: parkingAreaNumberFontSize, lineHeight: parkingAreaNumberFontSize}]}>{task.parkingArea}</Text>
            <Text style={styles.parkingAreaText}>стоянка</Text>
        </View>
    </View>
)

const TaskData = ({task, styles}) => {
    const status = getTaskStatus(task);
    return (
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
                <View style={{paddingRight: 30}}>
                    <Text style={[styles.infoText, status === taskStatuses.NOTCONFIRMED && {fontWeight: 'bold'}]}>ПЕРЕДАНА:</Text>
                    <Text style={[styles.infoText, status === taskStatuses.NEW && {fontWeight: 'bold'}]}>ПРИНЯТА:</Text>
                    {!!task.startWaitingTime && <Text style={[styles.infoText, status === taskStatuses.WAITING && {fontWeight: 'bold'}]}>ОЖИДАНИЕ:</Text>}
                    <Text style={[styles.infoText, status === taskStatuses.STARTED && {fontWeight: 'bold'}]}>НАЧАТА:</Text>
                    <Text style={[styles.infoText, status === taskStatuses.ENDED && {fontWeight: 'bold'}]}>ЗАВЕРШЕНА:</Text>
                    {!!task.rejectTime && <Text style={[styles.infoText, status === taskStatuses.REJECTED && {fontWeight: 'bold', color: 'red'}]}>ТЕХ. ОТКАЗ:</Text>}
                    {!(task.rejectTime && task.finishTime) && <Text style={[styles.infoText, status === taskStatuses.RETURNED && {fontWeight: 'bold'}]}>ВЕРНУЛСЯ:</Text>}
                </View>
                <View>
                    <Text style={[styles.infoText]}>{ formatTime(task.sendTime, {asUTC: false, emptyValue: ' '}) }</Text>
                    <Text style={[styles.infoText]}>{ formatTime(task.confirmationTime, {asUTC: false, emptyValue: ' '}) }</Text>
                    {!!task.startWaitingTime && <Text style={[styles.infoText]}>{ formatTime(task.startWaitingTime, {asUTC: false, emptyValue: ' '}) }</Text>}
                    <Text style={[styles.infoText]}>{ formatTime(task.startTime, {asUTC: false, emptyValue: ' '}) }</Text>
                    <Text style={[styles.infoText]}>{ formatTime(task.endTime, {asUTC: false, emptyValue: ' '}) }</Text>
                    {!!task.rejectTime && <Text style={styles.infoText}>{ formatTime(task.rejectTime, {asUTC: false, emptyValue: ' '}) }</Text>}
                    {!(task.rejectTime && task.finishTime) && <Text style={[styles.infoText]}>{ formatTime(task.returnTime, {asUTC: false, emptyValue: ' '}) }</Text>}
                </View>
            </View>
            {task.comment
                ? <View style={styles.commentWrapper}>
                    <Text style={styles.infoText}>КОММЕНТАРИЙ:</Text>
                    <Text numberOfLines={3} style={styles.comment}>{task.comment}</Text>
                </View>
                : null
            }
        </View>
    )
}

const fontScale = PixelRatio.getFontScale();

const getFontSize = (width, fontRatio, maxRatio=1) => {
    return Math.round(width / (fontRatio < maxRatio ? maxRatio : fontRatio) / fontScale);
}

const padding = (width) => width / 30;

const _styles = (wide, width) => ({
    container: {
        flexDirection: wide ? 'row' : 'column', 
        justifyContent: wide ? 'space-between' : 'flex-start', 
        flex: 1, 
    },
    leftPane : {
        alignItems: 'center', 
        elevation: 3, 
        paddingBottom: wide ? 0 : padding(width) * 1.5, 
        paddingTop: padding(width),
        flex: wide ?  1 : null, 
        backgroundColor: 'white'
    },
    rightPane: {
        justifyContent: wide ? 'space-between' : 'flex-start', 
        flex: 1, 
        paddingVertical: padding(width),
        paddingHorizontal: padding(width),
    },
    backButton : {
        position: 'absolute',
        left: wide ? -13 : -10,
        top: wide ? 10 : 0
    },
    backButtonIcon: {
        fontSize: wide ? getFontSize(width, 15) : getFontSize(width, 10), 
        opacity: 0.8,
        color: '#777'
    },
    ac: {
        fontSize: wide ? getFontSize(width, 10) : getFontSize(width, 7),
        lineHeight: wide ? getFontSize(width, 10) : getFontSize(width, 7),
        fontWeight: 'bold',
        paddingBottom: padding(width) * 0.5
    },
    acType: {
        fontSize: wide ? getFontSize(width, 16) : getFontSize(width, 10),
        lineHeight: wide ? getFontSize(width, 14) : getFontSize(width, 10)
    },
    parkingAreaWrapper: {
        paddingTop: wide ? padding(width) * 0.5 : padding(width) * 1.5, 
        alignItems: 'center'
    },
    parkingAreaNumber: {
        fontSize: wide ? getFontSize(width, 10) : getFontSize(width, 7),
        lineHeight: wide ? getFontSize(width, 10) : getFontSize(width, 7)
    },
    parkingAreaText: {
        fontSize: wide ? getFontSize(width, 25) : getFontSize(width, 20)
    },
    service: {
        // fontSize: wide ? getFontSize(width, 25) : getFontSize(width, 15),
        lineHeight: wide ? getFontSize(width, 25) : getFontSize(width, 15),
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: wide ? padding(width) * 2 : padding(width) * 4,
        paddingBottom: padding(width),
    },
    infoText: {
        fontSize: wide ? getFontSize(width, 37) : getFontSize(width, 22)
    },
    actionButton: {
        elevation: 7,
        flex: 1
    },
    action_NOTCONFIRMED: {
        backgroundColor: '#ffb31a',
    },
    action_NEW: {
        backgroundColor: '#00cc99',
        marginRight: 5
    },
    action_WAITING: {
        backgroundColor: '#ff6666',
    },
    action_STARTED: {
        backgroundColor: '#994d00',
    },
    action_ENDED: {
        backgroundColor: '#660033'
    },
    action_FINISHED: {
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: getFontSize(width, 20),
        lineHeight: getFontSize(width, 20),
        alignSelf: 'center'
    },
    actionContainer: {
        paddingTop: padding(width) * 0.5,
        height: 60        
    },
    actionText: {
        fontSize: wide ? getFontSize(width, 20) : getFontSize(width, 12),
        color: 'white',
    },
    actionTextShort: {
        fontSize: wide ? getFontSize(width, 46) : getFontSize(width, 22),
        lineHeight: wide ? getFontSize(width, 46) : getFontSize(width, 22),
        color: 'white'
    },
    commentWrapper: {
        paddingTop: padding(width) * .5
    },
    comment: {
        fontSize: wide ? getFontSize(width, 35) : getFontSize(width, 25),
        maxWidth: wide ? width / 2.2 : null
    },
    rejectFab: {
        backgroundColor: '#ff3333',
        borderRadius: 40,
        width: 75,
        height: 75,
        position: 'absolute',
        right: 10,
        top: -35,
        elevation: 5
    },
    rejectFabWide: {
        right: null,
        top: null,
        bottom: 10,
        left: 10
    },
    rejectFabText: {
        color: 'white',
        fontSize: 12 / fontScale,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})