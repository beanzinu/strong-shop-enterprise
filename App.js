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
import {Notification} from "react-native-in-app-message";
import { Appearance } from 'react-native';
import colors from './color/colors';
//test
import CareRegister from './pages/shop/BidPage/CareRegister';
import CarePage from './pages/shop/ProgressPage/CarePage';
import MainTest from './pages/shop/Test/MainTest';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './storage/store';
import fetch from './storage/fetch';
import server from './server/server';
import { ImageBackground } from 'react-native';
import { Image } from 'react-native'

export const cacheNotifications = (remoteMessage) => {
  const notification = remoteMessage.notification;

  fetch('noti')
  .then( res => {
    let data;
    if ( res == null ) data = [] ;
    else data = res.data ;

    data.push({
      title : notification.title ,
      body : `${remoteMessage.data.name} 고객님이 ${notification.body}하셨습니다.`  ,
      // createdAt : '2021-11-20' ,
      // createdAt : moment(new Date()).utc(true).format('YYYY-MM-DD hh:mm') ,
      createdAt : moment(remoteMessage.data.time).format('YYYY-MM-DD hh:mm') ,
      read: false ,
    })

    store('noti',{data : data})
    
  })
  .catch ( e => { })

}


function App (props) {
  const [mainVisible,setMainVisible] = React.useState(false);
  const [loading,setLoading] = React.useState(false);
  const [inApp,setInApp] = React.useState('');
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
  // badge
  const [badge,setBadge] = React.useState(0);
  
  const LOGOUT = () => {
    setMainVisible(false);
  }

  const userSettings = {
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
    homeRef,setHomeRef,bidRef,setBidRef,chatRef,setChatRef,
    badge,
    setBadge

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
  
 

  React.useEffect(() => {


    // alert(Appearance.getColorScheme())

    const authStatus = messaging().requestPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      
      const notification = remoteMessage.notification;
      const index = remoteMessage.data.index ;
      if ( index === '120' ) return;
      // chat
      else if ( index === '002' ) {
        setInApp(` ${notification.title} 고객\n ${notification.body}\n`)
        this.ref?.show();
        return;
      } 
      // notifications
      else{
        setInApp(` ${remoteMessage.data.name} 고객님이 ${notification.body}하셨습니다.\n` )
        this.ref?.show();
      }

      // console.log('inApp',remoteMessage);
      cacheNotifications(remoteMessage);

    });

    // 알람 눌러서 들어왔을때
    const onNotification = messaging().onNotificationOpenedApp(remoteMessage => {
      const notification = remoteMessage.notification;
      const index = remoteMessage.data.index ;

      if ( index == '002' || index === '120' ) return;

        remoteMessage= { ...remoteMessage , read: true } ;
        cacheNotifications(remoteMessage);
        setNoti(2);
        
    });


      // jwt 캐시 ( accesstoken 만료  => refreshToken => jwt accessToken )
      fetch('auth')
      .then( async(res) => {
        if ( res.auth != null ) {
            setMainVisible(true);
        }
      })
      .catch(e => { })
      
      setTimeout(() => {
        setLoading(true);
      },2000);

      return unsubscribe,onNotification;
      


  },[]);

  // return(
  //   <CareRegister />
  // )

  return (
      <AppContext.Provider value={userSettings}>
        { 
          loading ? ( 
            mainVisible ? 
              <>
              <MainPage/>
              <Notification hideStatusBar={false} duration={3000} 
                style={{ backgroundColor: 'rgb(244,244,244)' , margin: 10 , alignItems: 'flex-start' , margin: 5 , borderWidth:1 , borderColor: 'lightgray' , borderRadius: 10 }} 
                textColor={'black'}     
                showKnob={false}
                text={inApp} 
                ref={ref => this.ref = ref } 
                onPress={() => { setNoti(2); this.ref.hide() }}/> 
              </>
              : 
              <NewRegister getMain={setMainVisible}/>
          ) 
          : 
          ( 
            <View style={{ backgroundColor: colors.main , flex: 1 , alignItems: 'center' , justifyContent: 'center' }}>
              <ImageBackground resizeMode='cover' source={require('./resource/Loading.jpeg')} style={{ width: '100%' , height: '100%' }} />
            </View>
          )   
        } 

        {/* <NewRegister />  */}
        {/* <MainPage state={mainVisible}/> */}
      </AppContext.Provider>
  );
};

export default App;
