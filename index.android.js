import { AppRegistry } from 'react-native';
import App from './app/App';

global.XMLHttpRequest = global.originalXMLHttpRequest ?
  global.originalXMLHttpRequest :
  global.XMLHttpRequest;
global.FormData = global.originalFormData ?
  global.originalFormData :
  global.FormData;

AppRegistry.registerComponent('vnukovo3_sts', () => App);
