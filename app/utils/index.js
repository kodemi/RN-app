import Snackbar from 'react-native-snackbar';
import Sound from 'react-native-sound';
import moment from 'moment-timezone';

const INFO_COLOR = '#F5DEB3';
const SUCCESS_COLOR = '#32CD32';
const ERROR_COLOR = '#F00';

const TIME_FORMAT = 'DD.MM HH:mm';

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export function parseJSON(response) {
    return response.json();
}

export function showMessage(message, {type='info', duration=null, action={}}) {
    let color;
    switch (type) {
        case 'info':
            color = INFO_COLOR;
            break;
        case 'success': 
            color = SUCCESS_COLOR;
            break;
        case 'error':
            color = ERROR_COLOR;
            break;
        default:
            color = INFO_COLOR;
    }
    Snackbar.show({
        title: message,
        duration: duration && Snackbar['LENGTH_' + duration.toUpperCase()] || (type === 'error' ? Snackbar.LENGTH_LONG : Snackbar.LENGTH_SHORT),
        action: {
            title: 'OK',
            color,
            onPress: () => {},
            ...action
        }
    })
}

export function playSoundNotification() {
    const newTaskSound = new Sound('new_task.mp3', Sound.MAIN_BUNDLE, (error) => {
        newTaskSound.play(success => newTaskSound.release());
    });
}



export function formatTime(value, {format=TIME_FORMAT, asUTC=true, emptyValue='-'}) {
    return value && (asUTC ? moment(value).tz('UTC').format(format) : moment(value).format(format)) || emptyValue;
}

