import Config from 'react-native-config';
import axios from 'axios';
import { NativeModules } from 'react-native';
import RNFS from 'react-native-fs';

import { checkHttpStatus } from '../utils';

const { API_ROOT, AUTH_ROOT, MOCK_API_ROOT } = Config;
const DEV_MODE = Config.DEV_MODE === 'true'
const TIMEOUT = 30000;
export const HEARTBEAT_INTERVAL = 60000;

const NOTCONFIRMED = 'TASK_STATUS/NOTCONFIRMED';
const NEW = 'TASK_STATUS/NEW';
const STARTED = 'TASK_STATUS/STARTED';
const ENDED = 'TASK_STATUS/ENDED';
const WAITING = 'TASK_STATUS/WAITING';
const RETURNED = 'TASK_STATUS/RETURNED';
const REJECTED = 'TASK_STATUS/REJECTED';
const ANOTHER_TASK = 'TASK_STATUS/ANOTHER_TASK';
const FINISHED = 'TASK_STATUS/FINISHED';

const SOPP_AGENT_ARRIVAL = 'TASK_TYPE/SOPP_AGENT_ARRIVAL';
const SOPP_AGENT_DEPARTURE = 'TASK_TYPE/SOPP_AGENT_DEPARTURE';
const SOPP_DRIVER_ARRIVAL = 'TASK_TYPE/SOPP_DRIVER_ARRIVAL';
const SOPP_DRIVER_DEPARTURE = 'TASK_TYPE/SOPP_DRIVER_DEPARTURE';
const SST = 'TASK_TYPE/SST';

const apiRequest = axios.create({
    baseURL: `${API_ROOT}`,
    timeout: TIMEOUT,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});
const authRequest = axios.create({
    baseURL: `${AUTH_ROOT}/`,
    timeout: TIMEOUT,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export const authenticate = ({pin, userId, deviceId, position}, apiRoot) => {
    if (!apiRoot) {
        throw new Error('You must provide apiRoot');
    }
    const data = { pin, userId, deviceId, position };
    const config = {
        params: {
            api: apiRoot
        }
    };
    return authRequest.post('authenticate', data, config)
        .then(checkHttpStatus)
        .then(res => res.data)
        .then(data => data.token);
};

export const heartbeat = ({token, userId, deviceId=null, notificationDeviceId, position=null, type='status', apiRoot}) => {
    if (!apiRoot) {
        throw new Error('You must provide apiRoot');
    }
    const data = { userId, deviceId, notificationDeviceId, position, type };
    const config = {
        headers: {
            'x-access-token': token
        },
        params: {
            api: apiRoot
        }
    };
    return apiRequest.post('heartbeat', data, config)
        .then(checkHttpStatus)
        // .catch(error => console.log('heartbeat... ' + error.message));
}

export const getTasks = (token, mockData=false, apiRoot) => {
    if (!apiRoot) {
        throw new Error('You must provide apiRoot');
    }
    const config = {
        headers: {
            'x-access-token': token
        },
        params: {
            api: apiRoot
        }
    };
    return apiRequest.get('tasks', config)
        .then(checkHttpStatus)
        .then(res => res.data);
}

export const updateTask = (token, id, data, apiRoot) => {
    if (!apiRoot) {
        throw new Error('You must provide apiRoot');
    }
    const config = {
        headers: {
            'x-access-token': token
        },
        params: {
            api: apiRoot
        }
    };
    return apiRequest.patch(`tasks/${id}`, data, config)
        .then(res => res.data);
}

export const getTaskStatus = (task) => {
        if (task.finishTime) {
            return FINISHED;
        }
        if (task.rejectTime) {
            return REJECTED;
        }
        if (task.startAnotherTaskTime) {
            return ANOTHER_TASK;
        }
        if (!task.confirmationTime) {
            return NOTCONFIRMED
        }
        if (!task.startTime && task.startWaitingTime) {
            return WAITING;
        }
        if (!task.startTime) {
            return NEW;
        }
        if (!task.endTime) {
            return STARTED;
        }
        if (!task.returnTime) {
            return ENDED;
        }
        return RETURNED;
    }

export const getTaskType = (task) => {
    switch (task.service.toLowerCase()) {
        case 'встреча пассажиров':
            return SOPP_AGENT_ARRIVAL;
        case 'посадка пассажиров':
            return SOPP_AGENT_DEPARTURE;
        case 'снятие багажа':
            return SOPP_DRIVER_ARRIVAL;
        case 'загрузка багажа':
            return SOPP_DRIVER_DEPARTURE;
        default: 
            return SST;
    }
}

export const canStartTask = (task, tasks) => {
    return !tasks.filter(item => task.id !== item.id && !item.endTime && !item.rejectTime).length;
}

export const thereAreNewTasks = (tasks) => {
    return tasks.filter(item => task.id !== item.id && !item.confirmationTime).length;
}

export const taskTypes = {
    SOPP_AGENT_ARRIVAL,
    SOPP_AGENT_DEPARTURE,
    SOPP_DRIVER_ARRIVAL,
    SOPP_DRIVER_DEPARTURE,
    SST
};

export const taskStatuses = {
    NOTCONFIRMED,
    WAITING,
    NEW,
    STARTED,
    ENDED,
    RETURNED,
    REJECTED,
    ANOTHER_TASK,
    FINISHED
}

export const removeAppFile = () => {
    const filePath = RNFS.DocumentDirectoryPath + `/Vnukovo3PoS${DEV_MODE ? '-dev' : ''}.apk`;
    return RNFS.exists(filePath)
        .then(exist => {
            if (exist) {
                return RNFS.unlink(filePath)
                    .then(() => {
                        console.log('App apk deleted');
                    })
                    .catch(error => console.log('[ERROR] ' + error.message));
            }
        })
    
}

export const downloadAppFile = (progressCallback) => {
    const filePath = RNFS.DocumentDirectoryPath + `/Vnukovo3PoS${DEV_MODE ? '-dev' : ''}.apk`;
    const download = RNFS.downloadFile({
        fromUrl: `${API_ROOT}/download${DEV_MODE  ? '?dev=true' : ''}`,
        toFile: filePath,
        progress: res => {
            const progress = res.bytesWritten / res.contentLength;
            progressCallback && progressCallback(progress);
        },
        progressDivider: 1
    });
    download.promise.then(result => {
        if (result.statusCode == 200) {
            NativeModules.InstallApk.install(filePath);
        }
    })
}

export const getAppVersion = () => {
    return apiRequest.get('version')
        .then(res => res.data.version);
}

export const getApiRoots = () => {
    return apiRequest.get('apiRoots')
        .then(res => res.data);
}

export default {
    authenticate,
    getTasks,
    updateTask,
    getTaskStatus,
    getTaskType,
    taskStatuses,
    taskTypes,
    heartbeat,
    downloadAppFile,
    removeAppFile,
    getAppVersion,
    getApiRoots,
    canStartTask
};