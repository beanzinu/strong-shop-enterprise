import React from 'react';
import MainPage from './pages/shop/MainPage' ;
import Register from './pages/shop/Register';
import NewRegister from './pages/shop/NewRegister';
import fetch from './storage/fetch';
import { View } from 'react-native';
import { Title } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo'
//test
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './storage/store';


// import TestMain from './pages/shop/Test/MainTest';

function App (props) {
  const [mainVisible,setMainVisible] = React.useState(false);
  const [loading,setLoading] = React.useState(false);
  
  React.useEffect(async() => {
     
      // 인터넷 연결상태 확인
      // const unsubscribe = NetInfo.addEventListener( async (state) => {
      //   if ( !state.isInternetReachable ) setLoading(false);
      // });
      
      // jwt 캐시 ( accesstoken 만료  => refreshToken => jwt accessToken )
      await fetch('auth')
      .then( res => {
        if ( res.auth != null ) setMainVisible(true);
      })
      .catch(e => { })
      
      setLoading(true);
      


  },[]);


  return (
        // loading ? ( 
        //   mainVisible ? 
        //     <MainPage/> : 
        //     <NewRegister getMain={setMainVisible}/>
        // ) 
        // : 
        // (
        //   <View style={{ alignItems: 'center' , justifyContent: 'center' , flex: 1 }}>
        //     <Title>최강샵</Title>
        //   </View>
        // )   


      // <NewRegister /> 
      <MainPage state={mainVisible}/>
  );
};

export default App;
