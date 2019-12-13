import { connect } from 'react-redux';
import AppNavigator from '../components/AppNavigator';
import { logoutUser } from '../ducks/auth';
import { 
    setDeviceId, 
    setDeviceConnected, 
    setAppVersion, 
} from '../ducks/device';
import { setAppLayout } from '../ducks/layout';

const mapStateToProps = (state) => ({
    navigation: state.navigation,
    auth: state.auth,
    device: state.device,
    layout: state.layout
});

const mapDispatchToProps = {
    logout: logoutUser,
    setAppLayout,
    setDeviceId,
    setDeviceConnected,
    setAppVersion,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);