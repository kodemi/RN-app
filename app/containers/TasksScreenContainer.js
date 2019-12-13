import { connect } from 'react-redux';
import { DrawerNavigator } from 'react-navigation';
import SideBar from './SideBarContainer';

import TasksScreen from '../components/TasksScreen';
import { getTasks, startScheduleGetTasks, stopScheduleGetTasks } from '../ducks/data';

const mapStateToProps = (state) => ({
    layout: state.layout,
    data: state.data,
    auth: state.auth,
    device: state.device,
})

const connectTasksScreen = connect(mapStateToProps, {getTasks, startScheduleGetTasks, stopScheduleGetTasks})(TasksScreen);

const Drawer = DrawerNavigator({
    Tasks: {
        screen: connectTasksScreen
    }
}, {
    drawerWidth: 250,
    contentComponent: SideBar
});

export default Drawer;