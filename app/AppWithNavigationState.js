import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    BackAndroid,
    View,
    NetInfo,
    AppState,
} from 'react-native'
import DeviceInfo from 'react-native-device-info';
import BackgroundTimer from 'react-native-background-timer';
import Orientation from 'react-native-orientation';
import { addNavigationHelpers } from 'react-navigation';

import AppNavigator from './AppNavigator';
import withGeolocation from './HOC/withGeolocation';
import withPushNotifications from './HOC/withPushNotifications';
import withCodePush from './HOC/withCodePush';
import ActivityIndicator from './components/ActivityIndicator';

import { 
    setDeviceId, 
    setDeviceConnected, 
    setAppVersion, 
} from './ducks/device';
import { setAppLayout } from './ducks/layout';
import { setApiRoots } from './ducks/data';

import MissingConnectionWarning from './components/MissingConnectionWarning';
import { heartbeat, HEARTBEAT_INTERVAL } from './api';


class AppWithNavigationState extends Component {
    state = {
        foreground: false
    }

    componentWillMount() {
        this.props.setDeviceId(DeviceInfo.getUniqueID());
        this.props.setAppVersion(DeviceInfo.getVersion());
        this.props.setAppLayout({orientation: Orientation.getInitialOrientation()});
        this.props.setApiRoots();
        
        NetInfo.isConnected.fetch().then(isConnected => {
            this.props.setDeviceConnected(isConnected);
        });
        NetInfo.isConnected.addEventListener('change',
            this.handleConnectivityChange
        );
    }

    handleConnectivityChange = (isConnected) => {
        this.props.setDeviceConnected(isConnected);
    }

    heartbeat = () => {
        const { isAuthenticated, token, user } = this.props.auth;
        const { deviceId, notificationDeviceId, deviceReady } = this.props.device;
        const { apiRoot } = this.props.data;
        if (isAuthenticated && deviceReady) {
            heartbeat({type: 'status', token, userId: user.userId, position: this.props.position, deviceId, notificationDeviceId, apiRoot});
                // .then(() => this.props.setDeviceConnected(true))
                // .catch(error => this.state.foreground && this.props.setDeviceConnected(false));
        }
    }

    _orientationDidChange = (orientation) => {
        this.props.setAppLayout({orientation});
    }

    _handleAppStateChange = (nextAppState) => {
        this.setState({
            foreground: nextAppState === 'active' 
        });
    }

    _onLayout = event => this.props.setAppLayout(event.nativeEvent.layout)

    _handleBackAction = () => {
        const { dispatch, nav } = this.props;
        const navigation = addNavigationHelpers({
            dispatch,
            state: nav,
        });
        navigation.goBack();
        return true;
    }

    componentDidMount = () => {
        BackAndroid.addEventListener('hardwareBackPress', this._handleBackAction);
        Orientation.addOrientationListener(this._orientationDidChange);
        AppState.addEventListener('change', this._handleAppStateChange);
        this.heartbeatId = BackgroundTimer.setInterval(this.heartbeat, HEARTBEAT_INTERVAL);
    }

    componentWillUnmount = () => {
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBackAction);
        NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange);
        Orientation.removeOrientationListener(this._orientationDidChange);
        AppState.removeEventListener('change', this._handleAppStateChange);
        BackgroundTimer.clearInterval(this.heartbeatId);
    }

    render() {
        const { deviceConnected } = this.props.device;
        return (
            <View onLayout={this._onLayout} style={{flex: 1}}>
                {!deviceConnected && <MissingConnectionWarning />}
                <AppNavigator
                    navigation={addNavigationHelpers({
                        dispatch: this.props.dispatch,
                        state: this.props.nav,
                    })}
                />
                <ActivityIndicator animating={this.props.notification.loading} />
            </View>
        );
    }
}

const mapStateToProps = ({ nav, auth, device, notification, data }) => ({ nav, auth, device, notification, data });
const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        ...bindActionCreators({setAppLayout, setDeviceConnected, setDeviceId, setAppVersion, setApiRoots}, dispatch)
    }
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps), 
    withGeolocation, 
    withPushNotifications, 
    withCodePush
)(AppWithNavigationState);