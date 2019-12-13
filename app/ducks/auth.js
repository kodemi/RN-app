import jwtDecode from 'jwt-decode';
import { 
    AsyncStorage
} from 'react-native';
import api from '../api';
import { navigateTo } from './navigation';
import { home } from '../constants/routes';
import { showMessage } from '../utils';
import { setLoading } from './notification';

const LOGIN_REQUEST = 'vnukovo3.ru/auth/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'vnukovo3.ru/auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'vnukovo3.ru/auth/LOGIN_FAILURE';
const LOGOUT_SUCCESS = 'vnukovo3.ru/auth/LOGOUT_SUCCESS';
const LOGOUT_REQUEST = 'vnukovo3.ru/auth/LOGOUT_REQUEST';

const initialState = {
    token: null,
    user: {},
    isAuthenticated: false,
    isFetching: false,
    statusText: null,
}

export default function auth(state=initialState, action) {
    const payload = action.payload;
    switch(action.type) {
        case LOGIN_REQUEST:
            return {...state, isFetching: true};
        case LOGIN_SUCCESS:
            return {
                ...state, 
                isAuthenticated: true, 
                isFetching: false,
                user: payload.user,
                token: payload.token,
                statusText: payload.statusText
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                isFetching: false,
                token: null,
                user: {},
                statusText: payload.statusText
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                isFetching: true
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                isFetching: false,
                token: null,
                user: {},
                statusText: payload.statusText
            };
        default:
            return state;
    }
}

export function loginUserRequest() {
    return {
        type: LOGIN_REQUEST,
        payload: {
            isFetching: true,
            isAuthenticated: false
        }
    }
}

export function loginUserSuccess(token, redirectTo=home) {
    return async (dispatch, getState) => {
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
        const user = jwtDecode(token);
        const state = getState();
        const { deviceId, notificationDeviceId } = state.device;
        const { apiRoot } = state.data;
        dispatch({
            type: LOGIN_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: true,
                token,
                user,
            }
        });
        navigateTo('Tasks', true)(dispatch);
        api.heartbeat({token, userId: user.userId, type: 'login', deviceId, notificationDeviceId, apiRoot}).catch(()=>{});
    }
}

export function loginUserFailure() {
    return {
        type: LOGIN_FAILURE,
        payload: {
            isFetching: false,
            isAuthenticated: false,
        }
    }
}

export function logoutUserRequest() {
    return {
        type: LOGOUT_REQUEST,
        payload: {
            isFetching: true,
            isAuthenticated: true
        }
    }
}

export function logoutUserSuccess() {
    return async (dispatch) => {
        try {
            await AsyncStorage.removeItem('token');
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
        dispatch({
            type: LOGOUT_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: false,
            }
        });
        navigateTo('Login', true)(dispatch);
    }
}

export function loginUser(creds, redirectTo=home) {
    return async (dispatch, getState) => {
        dispatch(loginUserRequest());
        dispatch(setLoading(true));
        const state = getState();
        const { apiRoot } = state.data;
        try {
            const token = await api.authenticate(creds, apiRoot);
            dispatch(loginUserSuccess(token, redirectTo));
            // setTimeout(() => dispatch(setLoading(false)), 10000);
            dispatch(setLoading(false));
        } catch (e) {
            const error = {
                status: e.response && e.response.status,
                message: e.response && e.response.data.message
            }
            dispatch(loginUserFailure(error));
            dispatch(setLoading(false));
            showMessage(`Не удалось войти: ${error.message}`, {type: 'error'});
        }
    }
}

export function logoutUser() {
    return (dispatch, getState) => {
        const state = getState();
        const { user, token } = state.auth;
        const { deviceId, notificationDeviceId } = state.device;
        const { apiRoot } = state.data;
        dispatch(logoutUserRequest());
        dispatch(logoutUserSuccess());
        api.heartbeat({token, userId: user.userId, type: 'logout', deviceId, notificationDeviceId, apiRoot}).catch(()=>{});
    }
}

