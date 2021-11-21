import React from 'react';
import MainPage from './pages/shop/MainPage' ;
import Register from './pages/shop/Register';
import NewRegister from './pages/shop/NewRegister';
import { View } from 'react-native';
import { Title } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo'
import axios from 'axios';
import AppContext from './storage/AppContext';
import { Alert } from 'react-native';
import moment from 'moment';
import { Appearance } from 'react-native';
//test
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './storage/store';
import fetch from './storage/fetch';
import server from './server/server';


function App (props) {
  const [mainVisible,setMainVisible] = React.useState(false);
  const [loading,setLoading] = React.useState(false);
  // 정보
  const [infoRefresh,setInfoRefresh] = React.useState(false);
  // 갤러리
  const [refresh,setRefresh] = React.useState(false);
  //취급상품
  const [product,setProduct]  = React.useState(null);
  const [productRefresh,setProductRefresh] = React.useState(false);
  // 리뷰
  const [reviewRefresh,setReviewRefresh] = React.useState(false) ;
  // Push Notification
  const [noti,setNoti] = React.useState(0);
  const [notiData,setNotiData] = React.useState(null);
  // TabRefresh
  const [homeRef,setHomeRef] = React.useState(false);
  const [bidRef,setBidRef] = React.useState(false);
  const [chatRef,setChatRef] = React.useState(false);
  
  const LOGOUT = () => {
    setMainVisible(false);
  }

  const userSettings = {
    state : mainVisible ,
    LOGOUT ,
    infoRefresh ,
    setInfoRefresh ,
    refresh : refresh ,
    setRefresh ,
    product , 
    setProduct ,
    productRefresh ,
    setProductRefresh ,
    reviewRefresh,
    setReviewRefresh ,
    noti,
    setNoti ,
    homeRef,setHomeRef,bidRef,setBidRef,chatRef,setChatRef
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
  
  const cacheNotifications = (remoteMessage) => {
    const notification = remoteMessage.notification;

    fetch('noti')
    .then( res => {
      let data;
      if ( res == null ) data = [] ;
      else data = res.data ;

      data.push({
        title : notification.title ,
        body : notification.body ,
        // createdAt : '2021-11-20' ,
        createdAt : moment(new Date()).utc(true).format('YYYY-MM-DD hh:mm') ,
        read: false ,
      })

      store('noti',{data : data})
      
    })
    .catch ( e => { })

  }

  React.useEffect(() => {


    // alert(Appearance.getColorScheme())

    messaging().getToken()
    .then( res => {
      console.log(res);
    })

    const authStatus = messaging().requestPermission();

      

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const notification = remoteMessage.notification;
      Alert.alert(remoteMessage.data.index,notification.body);

      cacheNotifications(remoteMessage);

    });

    // 알람 눌러서 들어왔을때
    messaging().onNotificationOpenedApp(remoteMessage => {

        cacheNotifications(remoteMessage);
        setNoti(2);
        
    });

      // setNoti(2);
     
      // 인터넷 연결상태 확인
      // const unsubscribe = NetInfo.addEventListener( async (state) => {
      //   if ( !state.isInternetReachable ) setLoading(false);
      // });


      // jwt 캐시 ( accesstoken 만료  => refreshToken => jwt accessToken )
      fetch('auth')
      .then( async(res) => {
        if ( res.auth != null ) 
        setMainVisible(true);
      //     await requestNewToken(res.auth)
      //     .then( ()=> { alert('refreshToken 성공'); setMainVisible(true); })
      //     .catch( () => { } )
      })
      .catch(e => { })
      
      setLoading(true);

      return unsubscribe;
      


  },[]);


  return (
      <AppContext.Provider value={userSettings}>
        { 
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
        }

        {/* <NewRegister />  */}
        {/* <MainPage state={mainVisible}/> */}
      </AppContext.Provider>
  );
};

export default App;
