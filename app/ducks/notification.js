import _ from 'lodash';

const SET_LOADING = 'vnukovo3.ru/data/SET_LOADING';

const INDICATOR_TIMEOUT = 2000;

const initialState = {
    loading: false
}

export default function notification(state=initialState, action) {
    switch(action.type) {
        case SET_LOADING: 
            return {...state, loading: action.payload.loading};
        default:
            return state;
    }
}

const d = _.debounce((dispatch, loading) => {
    dispatch({
        type: SET_LOADING,
        payload: { loading }
    });
}, INDICATOR_TIMEOUT);

export function setLoading(loading) {
    return dispatch => {
        if (!loading) {
            d.cancel();
            dispatch({
                type: SET_LOADING,
                payload: { loading }
            });
        } else {
            d(dispatch, loading);
        }
    }
}