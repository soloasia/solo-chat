/**
 * @format
 */

import App from './App';
import {name as appName} from './app.json';
import {AppRegistry,LogBox,Text,TextInput} from 'react-native';
import PushNotification from "react-native-push-notification";
import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'



LogBox.ignoreLogs(["Require cycle", "Warning"]);
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state'
])

if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

if(__DEV__) {
    import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
PushNotification.createChannel(
  {
    channelId: "solochat-notification", // (required)
    channelName: "Solochat Notification"
});
