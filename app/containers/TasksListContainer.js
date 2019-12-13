import { connect } from 'react-redux';

import TasksList from '../components/TasksList';
import { refreshTasks, startScheduleGetTasks, stopScheduleGetTasks, selectTask, updateTask } from '../ducks/data';
import { toggleTaskTimesModal, toggleTaskDataModal } from '../ducks/task';

const mapStateToProps = (state) => ({
    auth: state.auth,
    data: state.data,
    layout: state.layout,
    taskState: state.task
});

const actions = {
    refreshTasks, 
    startScheduleGetTasks, 
    stopScheduleGetTasks, 
    selectTask, 
    updateTask,
    toggleTaskTimesModal,
    toggleTaskDataModal
}

export default connect(mapStateToProps, actions)(TasksList); 
