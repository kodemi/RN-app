import { connect } from 'react-redux';

import Settings from '../components/Settings';
import { setApiRoot, stopScheduleGetTasks, clearTasks } from '../ducks/data';
import { logoutUser } from '../ducks/auth';

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { setApiRoot, logoutUser, stopScheduleGetTasks, clearTasks })(Settings);