import { connect } from 'react-redux';
import TasksItemDetails from '../components/TasksItemDetails';
import { updateTask, updateTasks, selectTask, newTaskHandled } from '../ducks/data';
import { navigateTo } from '../ducks/navigation';

const mapStateToProps = (state) => ({
    auth: state.auth,
    data: state.data,
    layout: state.layout,
    task: state.data.tasks.find(task => task.id === state.data.selectedTask)
});

export default connect(mapStateToProps, { updateTask, updateTasks, selectTask, navigateTo, newTaskHandled })(TasksItemDetails);