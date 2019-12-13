import { NavigationActions } from 'react-navigation';
import AppNavigator from '../AppNavigator';

export default (state, action) => AppNavigator.router.getStateForAction(action, state) || state;

export function navigateTo (routeName, resetStack) {
    return dispatch => {
        if (resetStack) {
            dispatch(NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName })
                ]
            }));
        } else {
            dispatch(NavigationActions.navigate({ routeName }));
        }
    }
}