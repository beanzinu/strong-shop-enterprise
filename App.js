import React from 'react';
import MainPage from './pages/shop/MainPage' ;
import Register from './pages/shop/Register';
import NewRegister from './pages/shop/NewRegister';

//test
import messaging from '@react-native-firebase/messaging';
import TestMain from './pages/shop/Test/MainTest';



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
    // <NewRegister />
    // <MainPage />
    <TestMain />
  );
};

export default App;
