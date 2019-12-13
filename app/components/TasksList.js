import React, { Component } from 'react';
import { ScrollView, RefreshControl, StyleSheet, View, Text as RNText, FlatList } from 'react-native';
import { List, Text,  } from 'native-base';
import Tabs from 'react-native-tabs';
import moment from 'moment';
import _ from 'lodash';

import TasksItem from '../containers/TasksItemContainer';
import TaskTimesModal from './modals/TaskTimesModal';
import SOPPAgentArrivalModal from './modals/SOPPAgentArrivalModal';
import SOPPDriverArrivalModal from './modals/SOPPDriverArrivalModal';

import { getTaskType, taskTypes, getTaskStatus, taskStatuses } from '../api';

export default class TasksList extends Component {
    state = {
        tab: 'actual',
        showActionsTask: null,
        showDataModal: null,
        showTaskTimesChangeModal: null,
        filteredTasks: [],
    }

    scheduleId = null;

    componentWillReceiveProps = (nextProps) => {
        const filteredTasks = this.state.tab === 'all' ? [...nextProps.tasks] : nextProps.tasks.filter(task => this.getTaskStatus(task) === this.state.tab);
        const task = filteredTasks[0];
        if (!nextProps.data.selectedTask 
          && filteredTasks.length === 1 
          && getTaskType(task) === taskTypes.SST 
          && getTaskStatus(task) !== taskStatuses.FINISHED) {
            this.handleTaskSelect(task);
        }
        this.setState({ filteredTasks });
    }
    
    _onRefresh = () => {
        const { token } = this.props.auth;
        this.props.refreshTasks(token);
    }

    handleTabSelect = (el) => {
        this.setState({
            tab: el.props.name,
            showActionsTask: null,
            filteredTasks: el.props.name === 'all' ? [...this.props.tasks] : this.props.tasks.filter(task => this.getTaskStatus(task) === el.props.name)
        });
    }

    getTaskStatus = (task) => {
        const taskType = getTaskType(task);
        if (taskType === taskTypes.SST && !task.finishTime || taskType !== taskTypes.SST && !task.endTime) {
            return 'actual';
        }
        return 'ended';
    }

    getTaskDataModal = () => {
        const currentTask = this.getCurrentTask();
        if (!currentTask) { return null; }
        const taskType = getTaskType(currentTask);
        switch(taskType) {
            case taskTypes.SOPP_AGENT_ARRIVAL:
                return SOPPAgentArrivalModal;
            case taskTypes.SOPP_DRIVER_ARRIVAL:
                return SOPPDriverArrivalModal;
            default:
                return null;
        }
    }

    toggleActions = (task) => {
        this.setState({showActionsTask: this.state.showActionsTask === task.id ? null : task.id});
    }

    handleShowDataModal = (visible, task) => {
        if (visible) {
            clearTimeout(this.scheduleId);
            this.props.stopScheduleGetTasks();
        } else {
            this.scheduleId = setTimeout(() => this.props.startScheduleGetTasks(this.props.auth.token), 3000);
        }
        this.setState({showDataModal: visible ? task.id : null});        
    }

    handleTaskSelect = (task) => {
        const status = getTaskStatus(task);
        if (status === taskStatuses.FINISHED) {
            return;
        }
        this.props.selectTask(task);
        this.props.navigation.navigate('TaskDetails');
    }

    updateTask = (field, value) => {
        const { updateTask, auth } = this.props;
        updateTask(auth.token, this.getCurrentTask(), {[field]: value || moment.utc().format()});
    }

    getCurrentTask = () => _.find(this.props.tasks, task => task.id === this.props.taskState.taskId)

    setTaskTimesModalVisible = (visible, task) => {
        this.props.toggleTaskTimesModal(visible, visible && task || null);
    }

    setTaskDataModalVisible = (visible, task) => {
        this.props.toggleTaskDataModal(visible, visible && task || null);
    }

    saveTaskData = (data) => {
        const { updateTask, auth } = this.props;
        const task = this.getCurrentTask();
        updateTask(auth.token, task, { data });
        this.setTaskDataModalVisible(false);
    }

    render() {
        const { style, layout } = this.props;
        const { filteredTasks } = this.state;
        const wide = layout.isTablet;
        const currentTask = this.getCurrentTask();
        const Modal = this.getTaskDataModal();
    
        return (
            <View style={{flex: 1}}>
                {filteredTasks.length 
                    ? <FlatList
                        data={filteredTasks} 
                        renderItem={({item}) => <TasksItem
                            task={item} 
                            toggleActions={this.toggleActions} 
                            onTaskSelect={this.handleTaskSelect}
                            showActions={this.state.showActionsTask === item.id} 
                            onShowDataModal={this.handleShowDataModal} 
                            showDataModal={this.state.showDataModal === item.id}
                            setTaskTimesModalVisible={this.setTaskTimesModalVisible}
                            setTaskDataModalVisible={this.setTaskDataModalVisible}
                            wide={wide}
                        />}
                        keyExtractor={item => item.id}
                        refreshing={this.props.data.tasksRefreshing}
                        onRefresh={this._onRefresh}
                        style={{marginBottom: 45}}
                    />
                : <Text style={StyleSheet.flatten(styles.emptyList)}>На данный момент нет заданий</Text>}

                <Tabs 
                    style={styles.tabs}
                    selected={this.state.tab}
                    selectedStyle={styles.selectedTabText}
                    selectedIconStyle={styles.selectedTab}
                    onSelect={this.handleTabSelect}
                >
                    <RNText style={styles.tab} name='actual'>В РАБОТЕ</RNText>
                    <RNText style={styles.tab} name='ended'>ЗАВЕРШЕННЫЕ</RNText>
                </Tabs>
                {currentTask && <TaskTimesModal
                    visible={this.props.taskState.showTaskTimesModal}
                    setModalVisible={this.setTaskTimesModalVisible}
                    task={currentTask}
                    title={currentTask.service}
                    updateTask={this.updateTask}
                />}

                {currentTask && Modal && <Modal 
                    visible={this.props.taskState.showTaskDataModal}
                    setModalVisible={this.setTaskDataModalVisible}
                    saveTaskData={this.saveTaskData}
                    data={currentTask.data}
                    title={currentTask.service}
                />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    emptyList: {
        textAlign: 'center',
        paddingTop: 30,
        color: '#696969'
    },
    selectedTabText: {
        color: '#000',
        fontWeight: 'bold',
    },
    selectedTab: {
        backgroundColor: '#ddd'
    },
    tabs: {
        bottom: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 4,
        backgroundColor: '#eee',
        height: 45
    },
    tab: {
        fontSize: 14
    }
});