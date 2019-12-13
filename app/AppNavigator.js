import { StackNavigator } from 'react-navigation';
import TasksScreen from './containers/TasksScreenContainer';
import LoginScreen from './containers/LoginContainer';
import TaskDetailsScreen from './containers/TasksItemDetailsContainer';
import SettingsScreen from './containers/SettingsContainer';

const AppNavigator = StackNavigator({
    Login: {
        name: 'Login',
        screen: LoginScreen,
    },
    Tasks: {
        name: 'Задачи',
        screen: TasksScreen
    },
    TaskDetails: {
        name: 'Task Details',
        screen: TaskDetailsScreen
    },
    Settings: {
        name: 'Settings',
        screen: SettingsScreen
    }
}, {
    initialRouteName: 'Login',
    headerMode: 'none'
});

export default AppNavigator;