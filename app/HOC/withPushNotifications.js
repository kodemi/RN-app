import React from 'react';
import OneSignal from 'react-native-onesignal';
import { connect } from 'react-redux';
import { setNotificationDeviceId } from '../ducks/device';
import { newTaskReceived, getTasks } from '../ducks/data';

export default function withPushNotifications(WrappedComponent) {
    class WithPushNotifications extends React.Component {
        componentWillMount() {
            OneSignal.addEventListener('received', this.onReceived);
            OneSignal.addEventListener('opened', this.onOpened);
            OneSignal.addEventListener('registered', this.onRegistered);
            OneSignal.addEventListener('ids', this.onIds);
            OneSignal.inFocusDisplaying(0);
        }

        componentWillUnmount() {
            OneSignal.removeEventListener('received', this.onReceived);
            OneSignal.removeEventListener('opened', this.onOpened);
            OneSignal.removeEventListener('registered', this.onRegistered);
            OneSignal.removeEventListener('ids', this.onIds);
        }

        onReceived = (notification) => {
        if (this.props.isAuthenticated && notification.payload.groupKey === 'new_task') {
            this.props.newTaskReceived();
            this.props.getTasks(this.props.authToken);
        }
    }

        onOpened(openResult) {
            console.log('Message: ', openResult.notification.payload.body);
            console.log('Data: ', openResult.notification.payload.additionalData);
            console.log('isActive: ', openResult.notification.isAppInFocus);
            console.log('openResult: ', openResult);
        }

        onRegistered(notifData) {
            console.log("Device had been registered for push notifications!", notifData);
        }

        onIds = (device) => {
            console.log('Device info: ', device.userId);
            this.props.setNotificationDeviceId(device.userId);
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }

    WithPushNotifications.displayName = `WithPushNotifications(${getDisplayName(WrappedComponent)})`;
    const mapStateToProps = (state) => ({
        isAuthenticated: state.auth.isAuthenticated,
        authToken: state.auth.token
    })
    return connect(mapStateToProps, {setNotificationDeviceId, newTaskReceived, getTasks})(WithPushNotifications);
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}