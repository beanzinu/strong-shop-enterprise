import React from 'react';
import MainPage from './pages/shop/MainPage' ;
import Register from './pages/shop/Register';
import NewRegister from './pages/shop/NewRegister';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import ProductDetailRegister from './pages/shop/Register/ProductDetailRegister';


//test
import messaging from '@react-native-firebase/messaging';
// import TestMain from './pages/shop/Test/MainTest';



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
  

  return (
    // <Register />
    // <NewRegister />
    <MainPage />
    // <ProductDetailRegister />
    // <TestMain />
  );
};

export default App;
