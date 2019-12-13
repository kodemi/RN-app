import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { StyleProvider } from 'native-base';
import SplashScreen from 'react-native-splash-screen'
import getTheme from './theme/components';

import { rootReducer } from './ducks/reducer';
import AppWithNavigationState from './AppWithNavigationState';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

export class App extends React.Component {
	componentDidMount() {
        SplashScreen.hide();
    }

	render() {
		return (
			<Provider store={store}>
				<StyleProvider style={getTheme()}>
					<AppWithNavigationState />
				</StyleProvider>
			</Provider>
		);
	}
}

export default App;