import { connect } from 'react-redux';

import SideBar from '../components/SideBar';
import { logoutUser } from '../ducks/auth';
import { setMockData, refreshTasks } from '../ducks/data';

const mapStateToProps = (state) => ({
    auth: state.auth,
    data: state.data,
    device: state.device
});

const actions = {
    logout: logoutUser,
    refreshTasks,
    setMockData
}

export default connect(mapStateToProps, actions)(SideBar);