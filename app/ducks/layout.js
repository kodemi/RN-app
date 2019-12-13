const SET_LAYOUT = 'vnukovo3/drawer/SET_LAYOUT';

const initialState = {
    width: 0,
    height: 0,
    isTablet: false,
    orientation: null
};

export default function layout(state=initialState, action) {
    switch(action.type) {
        case SET_LAYOUT:
            return {...state, ...action.payload, isTablet: action.payload.width > 800};
        default:
            return state;
    }
}

export function setAppLayout(layout) {
    return {
        type: SET_LAYOUT,
        payload: layout
    };
}