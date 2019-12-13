import { connect } from 'react-redux';

import TasksItem from '../components/TasksItem';
import { updateTask } from '../ducks/data';

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps, { updateTask })(TasksItem);