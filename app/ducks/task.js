const TOGGLE_TASK_TIMES_MODAL = 'vnukovo3.ru/data/TOGGLE_TASK_TIMES_MODAL';
const TOGGLE_TASK_DATA_MODAL = 'vnukovo3.ru/data/TOGGLE_TASK_DATA_MODAL';

const initialState = {
    taskId: null,
    showTaskTimesModal: false,
    showTaskDataModal: false
}

export default function task(state=initialState, action) {
    switch(action.type) {
        case TOGGLE_TASK_TIMES_MODAL:
            return {...state, showTaskTimesModal: action.payload.visible, taskId: action.payload.taskId || null}
        case TOGGLE_TASK_DATA_MODAL:
            return {...state, showTaskDataModal: action.payload.visible, taskId: action.payload.taskId || null}
        default:
            return state;
    }
}

export function toggleTaskTimesModal(visible, task) {
    return {
        type: TOGGLE_TASK_TIMES_MODAL,
        payload: { visible, taskId: task && task.id || null }
    }
}

export function toggleTaskDataModal(visible, task) {
    return {
        type: TOGGLE_TASK_DATA_MODAL,
        payload: { visible, taskId: task && task.id || null }
    }
}