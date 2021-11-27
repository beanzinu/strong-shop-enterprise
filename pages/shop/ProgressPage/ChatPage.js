import React from 'react' ;
import styled from 'styled-components';
import { Avatar , Card , Title , 
    Paragraph , Button , Banner } from 'react-native-paper';
import {  GiftedChat } from 'react-native-gifted-chat';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
// import database from '@react-native-firebase/database';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Alert, Image } from 'react-native';
import server from '../../../server/server';
import { useIsFocused } from '@react-navigation/native';
import AppContext from '../../../storage/AppContext';
// pages 
import ChatDetailPage from './ChatDetailPage';
import ProgressPage from './ProgressPage';
import colors from '../../../color/colors';
import fetch from '../../../storage/fetch';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const styles = {
    Button : {
        flex: 1
    }

};

const View = styled.SafeAreaView``;
const Stack = createStackNavigator() ; 

const ImageView = styled.View`
    width: 50px ;
    height: 50px ;
    /* border:1px black; */
    border-radius: 50px;
    align-items: center;
    overflow: hidden;
`;

const testData = [
    {"bidding_id": 5, "constructionImageUrlResponseDtos": [], "detail": "{\"tinting\":\"루마\",\"tintingPrice\":\"100\",\"totalPrice\":\"100\",\"carName\":\"AVANTE HYBRID\"}", "id": 6, "inspectionImageUrlRequestDtos": [], "order_id": 4, "shipmentLocation": null, "state": "CAR_EXAMINATION", "userResponseDto": {"birth": null, "email": "ys05143@naver.com", "gender": null, "id": 1, "nickname": "허지훈", "phoneNumber": "01012341234", "profileImage": "http://k.kakaocdn.net/dn/bnznMs/btrazLTprkY/9wznFjIGhM1VNPc1PGZG11/img_640x640.jpg", "realName": null, "thumbnailImage": "http://k.kakaocdn.net/dn/bnznMs/btrazLTprkY/9wznFjIGhM1VNPc1PGZG11/img_110x110.jpg"}},
]

const state = {
    DESIGNATING_SHIPMENT_LOCATION : '출고지 지정' ,
    CAR_EXAMINATION : '신차검수' ,
    CAR_EXAMINATION_FIN : '신차검수 완료' ,
    CONSTRUCTING : '시공진행' ,
    CONSTRUCTION_COMPLETED : '시공완료/출고'
}

const ChatView = ( props  ) =>   {
    const MyContext = React.useContext(AppContext);
    const [temp,setTemp] = React.useState({});
    const [data,setData]  = React.useState([]);
    const [reload,setReload] = React.useState(false);
    const isFocused = useIsFocused();


    const handleUnRead = (value) => {
        
        database().goOnline();
        
        var tmp = { };
        value.map( (item,index) => {
            var count = 0 ;
            var obj ;
            database().ref(`chat${item.id}`).once('value',snapshot => {

                obj = Object.values( snapshot.toJSON() ) ;
                obj.map( msg => {
                    if ( msg.user._id == 2 && msg.received != true ) count = count + 1 ; 
                }) ;
                tmp[item.id] = count ;
                total = total + count ;
                // Last Index
                if ( index == value.length-1 ) {
                    total = 0 ;
                    for ( key in tmp )
                        total += tmp[key];
                    MyContext.setBadge(total);

                    setData(value);
                    setTemp(tmp) ;
                }
            }) // db

        } ) // value.map


            
    }

    React.useEffect( () => {

    // 채팅
        // database().goOnline();
        // database().ref('chat').orderByKey('createdAt').limitToLast(1).once('value',snapshot=>{
        //     record = Object.values(snapshot.val())[0];
        //     setTemp(record);
        // });
        
        if ( isFocused  ) {

            fetch('auth')
            .then( res => {
                const auth = res.auth ;
                axios({
                    method: 'get' ,
                    url: `${server.url}/api/contract` ,
                    headers: { Auth: auth }
                })
                .then( res => {
                    // if ( JSON.stringify(data ) !== JSON.stringify(res.data.data) )
                    // {
                        // alert('reload');
                        handleUnRead(res.data.data);
                    // }
    
                })
                .catch( e => {
                    // console.log(e);
                    if ( e?.response?.hasOwnProperty('status') && e?.response?.status == 403 ) {
                        Alert.alert('새로운 기기','다른 기기에서 로그인하여 로그아웃 되었습니다.');
                        AsyncStorage.clear();
                        MyContext.LOGOUT();
                    }
                    else { 
                        Alert.alert('다시 시도해주세요.');
                    }
                })// axios
            })
            .catch( e => {

            }) ;

            
        }

    },[ isFocused ]);

 

    function RenderItem({ item , i }) {
        return (
                <Card 
                    key = {i} // key로 구분
                    onPress={ () => { props.navigation.navigate('ProgressPage' , { data: item, imageUrl : item.userResponseDto.profileImage.includes('https') ? item.userResponseDto.profileImage : item.userResponseDto.profileImage.replace('http','https') })  } }>
                    <Card.Title title={`${item.userResponseDto.nickname} 고객`} subtitle={state[item.state]} 
                                titleStyle={{ margin: 10 }} subtitleStyle= {{ margin: 10 }}
                                left={ props => <ImageView><Image source={{ uri: item.userResponseDto.profileImage.includes('https') ? item.userResponseDto.profileImage : item.userResponseDto.profileImage.replace('http','https') }} style={{ width: '100%', height: '100%' }} /></ImageView>  } 
                                right={ props => temp[item.id] > 0 && <Avatar.Text {...props} label={temp[item.id]} style={{ marginRight: 10  , backgroundColor : colors.main }} /> }
                    />
                </Card>
        )
    }

    return(
    <KeyboardAwareScrollView>
        {
        data == null || data.length == 0 ?
        <ActivityIndicator  size='large' style={{ marginTop: 20 }} /> 
        :
        data.map( ( item , i ) =>  {
            return (
                // 고객마다 
                <RenderItem key={item.id} item={ item } i = { i } />
            );
        }  )
        }
    </KeyboardAwareScrollView>
    );
}




export default function() {
    return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='ChatList' component={ChatView} options={{ title: '시공관리' }}/>
            <Stack.Screen name='ProgressPage' component={ProgressPage} options = {{ headerShown : false }}/>
            <Stack.Screen name='ChatDetail' component = {ChatDetailPage} options={{ headerShown : false }} />
        </Stack.Navigator>
   </NavigationContainer>
    );
}