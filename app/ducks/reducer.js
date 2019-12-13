import { combineReducers } from 'redux';
import auth from './auth';
import navigation from './navigation';
import layout from './layout';
import data from './data';
import device from './device';
import notification from './notification';
import task from './task';

export const rootReducer = combineReducers({
    auth,
    nav: navigation,
    layout,
    data,
    device,
    notification,
    task
});