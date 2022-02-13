/**
 * @format
 */
import messaging from '@react-native-firebase/messaging';
import { cacheNotifications } from './App';
// import React from 'react';
//
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    const notification = remoteMessage.notification;
    const index = remoteMessage.data.index ;
    if ( index === '120' || index === '002' ) return;
    // notifications
    cacheNotifications(remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      return null;
    }
  
    return <App/>;
}

AppRegistry.registerComponent(appName, () => App);
