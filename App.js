import React from 'react';
import MainPage from './pages/shop/MainPage' ;
import Register from './pages/shop/Register';
import NewRegister from './pages/shop/NewRegister';
import fetch from './storage/fetch';
import { View } from 'react-native';
import { Title } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo'
import axios from 'axios';
import AppContext from './storage/AppContext';
//test
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './storage/store';
import server from './server/server';


function App (props) {
  const [mainVisible,setMainVisible] = React.useState(false);
  const [loading,setLoading] = React.useState(false);
  // 정보
  const [info,setInfo] = React.useState(null);
  // 갤러리
  const [refresh,setRefresh] = React.useState(false);
  //취급상품
  const [product,setProduct]  = React.useState(null);
  const [productRefresh,setProductRefresh] = React.useState(false);
  // 리뷰
  const [reviewRefresh,setReviewRefresh] = React.useState(false) ;
  
  const LOGOUT = () => {
    setMainVisible(false);
  }

  const userSettings = {
    state : mainVisible ,
    LOGOUT ,
    refresh : refresh ,
    setRefresh ,
    product , 
    setProduct ,
    productRefresh ,
    setProductRefresh ,
    reviewRefresh,
    setReviewRefresh
  };

  // RefreshToken
  function requestNewToken(token) {
    return new Promise(
      function(resolve,reject) {
        axios({
          method: 'get',
          url: `${server.url}/token/refresh`,
          headers: { Auth: token }
          })
          .then(  async(res) => {
            await store('auth',{ auth: res.headers.auth });
            // 성공
            resolve();
          })
          .catch( e => {
            //실패
            reject();
          })
      }
    ) 
  }
  

  React.useEffect(async() => {
     
      // 인터넷 연결상태 확인
      // const unsubscribe = NetInfo.addEventListener( async (state) => {
      //   if ( !state.isInternetReachable ) setLoading(false);
      // });

      
      // AsyncStorage.removeItem('auth');
      // AsyncStorage.removeItem('Info');

      // jwt 캐시 ( accesstoken 만료  => refreshToken => jwt accessToken )
      await fetch('auth')
      .then( async(res) => {
        if ( res.auth != null ) setMainVisible(true);
          // await requestNewToken(res.auth)
          // .then( ()=> { alert('refreshToken 성공'); setMainVisible(true); })
          // .catch( () => { } )
      })
      .catch(e => { })
      
      setLoading(true);
      


  },[]);


  return (
    <AppContext.Provider value={userSettings}>
        {/* { 
          loading ? ( 
            mainVisible ? 
              <MainPage/> : 
              <NewRegister getMain={setMainVisible}/>
          ) 
          : 
          (
            <View style={{ alignItems: 'center' , justifyContent: 'center' , flex: 1 }}>
              <Title>최강샵</Title>
            </View>
          )   
        } */}

        <NewRegister /> 
        {/* <MainPage state={mainVisible}/> */}
      </AppContext.Provider>
  );
};

export default App;
