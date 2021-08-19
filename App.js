import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Alert } from 'react-native';
import Icon  from "react-native-vector-icons/Ionicons";
import Register from './pages/shop/Register';
import MainPage from './pages/shop/MainPage' ;

//test
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';



async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

function App (props) {

  // React.useEffect( () => {
    
  //   firebase.messaging()
  //     .getToken()
  //     .then(token => console.log(token))
  //     .catch(e => console.log(e));
    

  //     const unsubscribe = messaging().onMessage(async remoteMessage => {
  //       Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //     });
  //     return unsubscribe;

  //   // requestUserPermission();

  // } , [] ) ;

  return (
    // <Register />
    <MainPage />
  );
};

export default App;
