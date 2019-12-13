import api from '../api';
import { showMessage, playSoundNotification } from '../utils';
import Config from 'react-native-config';
import _ from 'lodash';
import { AsyncStorage } from 'react-native';

const FETCH_TASKS_REQUEST = 'vnukovo3.ru/data/FETCH_TASKS_REQUEST';
const FETCH_TASKS_SUCCESS = 'vnukovo3.ru/data/FETCH_TASKS_SUCCESS';
const FETCH_TASKS_FAILURE = 'vnukovo3.ru/data/FETCH_TASKS_FAILURE';

const TASKS_REFRESH_START = 'vnukovo3.ru/data/TASKS_REFRESH_START';
const TASKS_REFRESH_FINISH = 'vnukovo3.ru/data/TASKS_REFRESH_FINISH';

const UPDATE_TASK_REQUEST = 'vnukovo3.ru/data/UPDATE_TASK_REQUEST';
const UPDATE_TASK_SUCCESS = 'vnukovo3.ru/data/UPDATE_TASK_SUCCESS';
const UPDATE_TASK_FAILURE = 'vnukovo3.ru/data/UPDATE_TASK_FAILURE';

const UPDATE_TASKS_SUCCESS = 'vnukovo3.ru/data/UPDATE_TASKS_SUCCESS';
const UPDATE_TASKS_FAILURE = 'vnukovo3.ru/data/UPDATE_TASKS_FAILURE';

const SET_FETCH_TASKS_SCHEDULE_ID = 'vnukovo3.ru/data/SET_FETCH_TASKS_SHEDULE_ID';
const CLEAR_FETCH_TASKS_SCHEDULE_ID = 'vnukovo3.ru/data/CLEAR_FETCH_TASKS_SHEDULE_ID';
const CLEAR_TASKS = 'vnukovo3.ru/data/CLEAR_TASKS';

const SELECT_TASK = 'vnukovo3.ru/data/SELECT_TASK';
const SET_MOCK_DATA = 'vnukovo3.ru/data/SET_MOCK_DATA';
const NEW_TASK_RECEIVED = 'vnukovo3.ru/data/NEW_TASK_RECEIVED';
const NEW_TASK_HANDLED = 'vnukovo3.ru/data/NEW_TASK_HANDLED';
const SET_API_ROOTS = 'vnukovo3.ru/data/SET_API_ROOTS';
const SET_API_ROOT = 'vnukovo3.ru/data/SET_API_ROOT';

const DATA_FETCH_TIMEOUT = 30000;
const initialState = {
    tasks: [],
    scheduleTasksId: null,
    tasksRefreshing: false,
    selectedTask: null,
    devMode: Config.DEV_MODE === 'true',
    apiRoots: [],
    apiRoot: null,
    defaultApiRoot: null,
    newTask: false,
    updatingTask: null
};

export default function data(state=initialState, action) {
    switch (action.type) {
        case FETCH_TASKS_SUCCESS:
            return {...state, tasks: action.payload.tasks};
        case SET_FETCH_TASKS_SCHEDULE_ID:
            return {...state, scheduleTasksId: action.payload};
        case CLEAR_FETCH_TASKS_SCHEDULE_ID:
            return {...state, scheduleTasksId: null};
        case UPDATE_TASK_REQUEST:
            return {...state, updatingTask: action.payload.task.id}
        case UPDATE_TASK_SUCCESS:
            const updatedTask = action.payload.task;
            const updatedTaskIdx = state.tasks.findIndex(item => item.id === updatedTask.id);
            return {...state, updatingTask: null, tasks: [...state.tasks.slice(0, updatedTaskIdx), updatedTask, ...state.tasks.slice(updatedTaskIdx + 1)]}
        case UPDATE_TASK_FAILURE:
            const oldTask = action.payload.task;
            const oldTaskIdx = state.tasks.findIndex(item => item.id === oldTask.id);
            return {...state, updatingTask: null, tasks: [...state.tasks.slice(0, oldTaskIdx), oldTask, ...state.tasks.slice(oldTaskIdx + 1)]}
        case TASKS_REFRESH_START:
            return {...state, tasksRefreshing: true};
        case TASKS_REFRESH_FINISH:
            return {...state, tasksRefreshing: false};
        case SELECT_TASK:
            return {...state, selectedTask: action.payload.task && action.payload.task.id};
        case SET_API_ROOTS:
            return {...state, apiRoots: _.values(action.payload.apiRoots)};
        case SET_API_ROOT:
            return {...state, ...action.payload};
        case CLEAR_TASKS:
            return {...state, tasks: []};
        case NEW_TASK_RECEIVED:
            return {...state, newTask: true};
        case NEW_TASK_HANDLED:
            return {...state, newTask: false};
        default:
            return state;
    }
}

export function fetchTasksRequest() {
    return {
        type: FETCH_TASKS_REQUEST
    };
}

export function fetchTasksSuccess(data) {
    return {
        type: FETCH_TASKS_SUCCESS,
        payload: data
    };
}

export function fetchTasksFailure(message) {
    return {
        type: FETCH_TASKS_FAILURE,
        payload: message
    };
}

export function getTasks(token) {
    return async (dispatch, getState) => {
        try {
            const state = getState()
            const { mockData, apiRoot } = state.data;
            let data = await api.getTasks(token, mockData, apiRoot);
            if (!data.tasks) {
                data = {tasks: data};
            }
            dispatch(fetchTasksSuccess(data));
        } catch (e) {
            console.log(e);
            showMessage('Не удалось получить задачи', {type: 'error'});
            dispatch(fetchTasksFailure(e.message));
        }
    }
}

export function refreshTasks(token) {
    return async (dispatch, getState) => {
        dispatch({
            type: TASKS_REFRESH_START
        });
        await getTasks(token)(dispatch, getState);
        dispatch({
            type: TASKS_REFRESH_FINISH
        });
    }
}

export function startScheduleGetTasks(token) {
    return (dispatch, getState) => {
        if (getState().data.scheduleTasksId) {
            stopScheduleGetTasks()(dispatch, getState);
        }
        let scheduleTasksId;
        function periodicFetchData() {
            getTasks(token)(dispatch, getState);
            scheduleTasksId = setTimeout(periodicFetchData, DATA_FETCH_TIMEOUT);
            dispatch({
                type: SET_FETCH_TASKS_SCHEDULE_ID,
                payload: scheduleTasksId
            });
        }
        getTasks(token)(dispatch, getState);
        scheduleTasksId = setTimeout(periodicFetchData, DATA_FETCH_TIMEOUT);
        dispatch({
            type: SET_FETCH_TASKS_SCHEDULE_ID,
            payload: scheduleTasksId
        });
    }
}

export function stopScheduleGetTasks() {
    return (dispatch, getState) => {
        const scheduleTasksId = getState().data.scheduleTasksId;
        clearTimeout(scheduleTasksId);
        dispatch({
            type: CLEAR_FETCH_TASKS_SCHEDULE_ID
        });
    }
}

export function updateTask(token, task, data) {
    return async (dispatch, getState) => {
        dispatch({
            type: UPDATE_TASK_REQUEST,
            payload: {task}
        });
        try {
            const state = getState();
            const { apiRoot } = state.data;
            const updatedTask = await api.updateTask(token, task.id, data, apiRoot);
            showMessage('Задача обновлена', {type: 'success'});
            dispatch({
                type: UPDATE_TASK_SUCCESS,
                payload: {task: updatedTask}
            });
        } catch(e) {
            console.log(e);
            dispatch({
                type: UPDATE_TASK_FAILURE,
                payload: {
                    message: e.message,
                    task
                }
            });
            showMessage('Не удалось обновить задачу', {type: 'error'});
        }
        
    }
}

export function selectTask(task) {
    return {
        type: SELECT_TASK,
        payload: {task}
    };
}

export function newTaskReceived() {
    return dispatch => {
        playSoundNotification();
        showMessage('Поступила новая задача', {type: 'info', duration: 'long'});
        dispatch({
            type: NEW_TASK_RECEIVED
        });
    }
}

export function setApiRoots() {
    return async dispatch => {
        const { apiRoots, defaultApiRoot } = await api.getApiRoots();
        const storredApiRoot = await AsyncStorage.getItem('apiRoot');
        dispatch({
            type: SET_API_ROOTS,
            payload: { apiRoots, defaultApiRoot }
        });
        setApiRoot(storredApiRoot || defaultApiRoot)(dispatch);
    }
}

export function setApiRoot(apiRoot) {
    return async dispatch => {
        await AsyncStorage.setItem('apiRoot', apiRoot);
        dispatch({
            type: SET_API_ROOT,
            payload: { apiRoot }
        });
    }
}

export function clearTasks() {
    return {
        type: CLEAR_TASKS
    }
}

export function newTaskHandled() {
    return {
        type: NEW_TASK_HANDLED
    }
}

export function updateTasks(tasks, data) {
    return async (dispatch, getState) => {
        const state = getState();
        const { token } = state.auth;
        const { apiRoot } = state.data;
        try {
            await Promise.all(tasks.map(task => api.updateTask(token, task.id, data, apiRoot)));
            showMessage('Задачи обновлены', {type: 'success'});
        } catch(e) {
            console.log(e);
            showMessage('Не удалось обновить задачи', {type: 'error'});
            dispatch({
                type: UPDATE_TASKS_FAILURE
            })
        }
        getTasks(token)(dispatch, getState);
    }
}