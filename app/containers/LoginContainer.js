import { connect } from 'react-redux';

import { loginUser } from '../ducks/auth';
import Login from '../components/Login';

const mapStateToProps = (state) => ({
    layout: state.layout,
    auth: state.auth,
    device: state.device,
    data: state.data
})

export default connect(mapStateToProps, {loginUser})(Login);