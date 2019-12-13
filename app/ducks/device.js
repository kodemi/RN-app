const SET_DEVICE_ID = 'vnukovo3.ru/device/SET_DEVICE_ID';
const SET_NOTIFICATION_DEVICE_ID = 'vnukovo3.ru/device/SET_NOTIFICATION_DEVICE_ID';
const SET_GEOLOCATION_STARTED = 'vnukovo3.ru/device/SET_GEOLOCATION_STARTED';
const SET_DEVICE_CONNECTED = 'vnukovo3.ru/device/SET_DEVICE_CONNECTED';
const SET_APP_VERSION = 'vnukovo3.ru/device/SET_APP_VERSION';

const initialState = {
    notificationDeviceId: null,
    deviceId: null,
    deviceReady: false,
    geolocationStarted: false,
    deviceConnected: true,
    appVersion: null,
}

export default function device(state=initialState, action) {
    switch(action.type) {
        case SET_DEVICE_ID:
            return {
                ...state,
                deviceId: action.payload.deviceId
            }
        case SET_NOTIFICATION_DEVICE_ID:
            return {
                ...state,
                notificationDeviceId: action.payload.deviceId,
                deviceReady: action.payload.deviceId && state.geolocationStarted
            }
        case SET_GEOLOCATION_STARTED:
            return {
                ...state,
                geolocationStarted: action.payload.isStarted,
                deviceReady: state.notificationDeviceId && action.payload.isStarted
            }
        case SET_DEVICE_CONNECTED:
            return {
                ...state,
                deviceConnected: action.payload.isConnected
            }
        case SET_APP_VERSION:
            return {
                ...state,
                appVersion: action.payload.appVersion
            }
        default:
            return state;
    }
}

export function setDeviceId(deviceId) {
    return {
        type: SET_DEVICE_ID,
        payload: {deviceId}
    }
}

export function setAppVersion(appVersion) {
    return {
        type: SET_APP_VERSION,
        payload: {appVersion}
    }
}

export function setNotificationDeviceId(deviceId) {
    return {
        type: SET_NOTIFICATION_DEVICE_ID,
        payload: {deviceId}
    }
}

export function setGeolocationStarted(isStarted) {
    return {
        type: SET_GEOLOCATION_STARTED,
        payload: {isStarted}
    }
}

export function setDeviceConnected(isConnected) {
    return {
        type: SET_DEVICE_CONNECTED,
        payload: {isConnected}
    }
}