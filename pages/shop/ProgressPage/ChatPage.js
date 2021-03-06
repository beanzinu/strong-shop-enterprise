import React from 'react' ;
import styled from 'styled-components';
import { Avatar , Card , Title , 
    Paragraph , Button , Banner , ActivityIndicator, IconButton, Appbar , Text , Badge, Divider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Image } from 'react-native';
import server from '../../../server/server';
import { useIsFocused } from '@react-navigation/native';
import AppContext from '../../../storage/AppContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../../color/colors';
// server
import API from '../../../server/API';
// pages 
import ChatDetailPage from './ChatDetailPage';
import ProgressPage from './ProgressPage';
import CarePage from './CarePage';
// analytics
import analytics from '@react-native-firebase/analytics'

const styles = {
    Button : {
        flex: 1
    }

};

const View = styled.SafeAreaView``;
const Stack = createStackNavigator() ; 

const CView = styled.TouchableOpacity`
    width: 95%;
    height: 85px;
    flex-direction: row;
    align-items: center;
    /* border: 1px ${colors.main}; */
    /* border-bottom-width: 0.5px ; */
    /* border-color: lightgray; */
    border-radius: 10px;
    align-self: center;
    margin: 5px;
`;

const ImageView = styled.View`
    width: 60px ;
    height: 60px ;
    /* border: 2px ${colors.main}; */
    margin: 10px;
    /* border-radius: 30px; */
    /* border-bottom-right-radius: 5px; */
    align-items: center;
    overflow: hidden;
    /* top: -15 */
`;

const state = {
    DESIGNATING_SHIPMENT_LOCATION : '출고지 지정' ,
    CAR_EXAMINATION : '신차검수' ,
    CAR_EXAMINATION_FIN : '신차검수 완료' ,
    CONSTRUCTING : '시공진행' ,
    CONSTRUCTION_COMPLETED : '시공완료/출고'
}

const care_state = {
    PRE_CONSTRUCTING: '시공 전' ,
    CONSTRUCTING: '시공 중' ,
    CONSTRUCTION_COMPLETED: '출고 대기'
}

const testData = [
    {"bidding_id": 1234, "constructionImageUrlResponseDtos": [], "detail": "{\"tinting\":\"틴팅A\",\"tintingPrice\":\"10\",\"blackbox\":\"블박B\",\"blackboxPrice\":\"10\",\"battery\":\"보조C\",\"batteryPrice\":\"10\",\"afterblow\":\"애프터블로우D\",\"afterblowPrice\":\"10\",\"totalPrice\":\"40\",\"carName\":\"AVANTE N\"}", "id": 92, "inspectionImageUrlRequestDtos": [], "order_id": 90, "shipmentLocation": "부산 영도구 중리북로 5 12", "state": "CAR_EXAMINATION", "userResponseDto": {"birth": null, "email": "wlsdn1372@hanmail.net", "gender": null, "id": 44, "loginMethod": "KAKAO", "nickname": "케어", "phoneNumber": "01012341234", "profileImage": "http://k.kakaocdn.net/dn/cJBhWJ/btrfjR1BULj/IGUGK4GpNJfoqFAtkZH02k/img_640x640.jpg", "realName": null, "thumbnailImage": "http://k.kakaocdn.net/dn/cJBhWJ/btrfjR1BULj/IGUGK4GpNJfoqFAtkZH02k/img_110x110.jpg"}}
]

const ChatView = ( props  ) =>   {
    const MyContext = React.useContext(AppContext);
    const [temp,setTemp] = React.useState({});
    const [data,setData]  = React.useState(null);
    const [reload,setReload] = React.useState(false);
    const isFocused = useIsFocused();

    const handleUnRead = (value) => {
        
        database().goOnline();
        
        var tmp = { };
        value.map( (item,index) => {
            var count = 0 ;
            var obj ;
            database().ref(`chat${item.id}`).once('value',snapshot => {
                if ( snapshot.toJSON() &&  snapshot.toJSON() !== null  )  {

                    obj = Object.values( snapshot.toJSON() ) ;
                    obj.map( msg => {
                        if ( msg.user._id == 2 && msg.received != true ) count = count + 1 ; 
                    }) ;
                    tmp[item.id] = count ;
                    
                }
                // Last Index
                if ( index == value.length-1 ) {
                    total = 0 ;
                    for ( key in tmp )
                        total += tmp[key];
                    MyContext.setBadge(total);
    
                    setTemp(tmp) ;
                }
            }) // db

        } ) // value.map


            
    }
    // 고객 다시 불러오기
    const reloadClients = () => {

        // Google Analytics
        analytics().logScreenView({
            screen_class: 'Contract' ,
            screen_name: 'ContractList'
        })

        API.get('/api/contract')
        .then( res => {
            if ( res.data.data.length == 0 ) {
                setData([]);
                MyContext.setBadge(0);
            }
            else if ( JSON.stringify( data ) !== JSON.stringify(res.data.data) ){
                setData(res.data.data);   
            }
            if ( res.data.data.length != 0 )
                handleUnRead(res.data.data);
        })
        .catch( e => {
            if ( e?.response?.hasOwnProperty('status') && e?.response?.status == 403 ) {
                Alert.alert('새로운 기기','다른 기기에서 로그인하여 로그아웃 되었습니다.');
                AsyncStorage.clear();
                MyContext.LOGOUT();
            }
            else { 
                Alert.alert('다시 시도해주세요.');
            }
        })
    }

    React.useEffect( () => {

        // 채팅
        database().goOnline();
        
        if ( isFocused ) {
            reloadClients();
        }

    },[ MyContext.chatRef , isFocused ]);

 
    // 한명의 고객
    function RenderItem({ item , i }) {
        let detail = JSON.parse(item.detail) ;
        return (
                <CView
                key={i}
                onPress={ () => { 
                    detail.kind == 'Care' ? 
                    props.navigation.navigate('CarePage', { data: item })
                    :
                    props.navigation.navigate('ProgressPage' , { id : item.id , data: item, imageUrl : item.userResponseDto.profileImage.includes('https') ? item.userResponseDto.profileImage : item.userResponseDto.profileImage.replace('http','https') })  
                }} >
                <ImageView><Image source={{ uri: item.userResponseDto.profileImage.includes('https') ? item.userResponseDto.profileImage : item.userResponseDto.profileImage.replace('http','https') }} style={{ width: '100%', height: '100%' , borderRadius: 25 }} /></ImageView>
                <View style={{  }}>
                    <View style={{ flexDirection: 'row' , alignItems: 'center' }}>
                        <Text style={{ margin: 7 ,color: 'black' , fontSize: 17 , fontFamily: 'NotoSansKR-Medium' }}>{`${item.userResponseDto.nickname} 고객`}</Text>
                        {
                            detail.kind == 'Care' ? 
                            <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 5 , backgroundColor: colors.care , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>케어</Badge>
                            :
                            <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 5 , backgroundColor: colors.main , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>신차</Badge>
                        }
                        {/* <Text style={{ marginLeft: 3 , marginBottom: 1.5 , alignSelf: 'center' , fontSize: 15 , color: detail.kind == 'Care'? colors.care : colors.main }}>{ detail.kind == 'Care' ? '케어' : '신차'}</Text> */}
                    </View>
                    <Text style={{ marginLeft: 7 , color: 'lightgray' }}>{`[ ${detail.carName} ] `}{detail.kind == 'Care' ?  care_state[item.state] : state[item.state]}</Text>
                </View>
                { temp[item.id] > 0 && <Avatar.Text size={30} {...props} label={temp[item.id]} labelStyle={{ color: 'white' }} style={{  position: 'absolute' , right: 0 , marginRight: 10  , backgroundColor : colors.main }} /> }
                </CView>
                // <Card 
                //     key = {i} // key로 구분
                //     onPress={ () => { 
                //         detail.kind == 'Care' ? 
                //         props.navigation.navigate('CarePage', { data: item })
                //         :
                //         props.navigation.navigate('ProgressPage' , { id : item.id , data: item, imageUrl : item.userResponseDto.profileImage.includes('https') ? item.userResponseDto.profileImage : item.userResponseDto.profileImage.replace('http','https') })  
                //     }}>
                //     <Card.Title title={`${item.userResponseDto.nickname} 고객`} subtitle={ detail.kind == 'Care' ?  care_state[item.state] : state[item.state]} 
                //                 titleStyle={{ margin: 10 , color: 'black' }} subtitleStyle= {{ margin: 10 }}
                //                 left={ props => <ImageView><Image source={{ uri: item.userResponseDto.profileImage.includes('https') ? item.userResponseDto.profileImage : item.userResponseDto.profileImage.replace('http','https') }} style={{ width: '100%', height: '100%' }} /></ImageView>  } 
                //                 right={ props => temp[item.id] > 0 && <Avatar.Text {...props} label={temp[item.id]} style={{ marginRight: 10  , backgroundColor : colors.main }} /> }
                //     />
                // </Card>
        )
    }

    return(
    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
        {
        data == null  ?
            <ActivityIndicator color={'black'}  size='large' style={{ marginTop: 100 }} /> 
        :
        <>
            <Appbar.Header style={{ backgroundColor: 'white' , elevation: 0 }}>
                <Appbar.Content titleStyle={{ fontFamily: 'NotoSansKR-Medium' }} title='시공 관리' />
                <Appbar.Action icon='refresh' onPress={() => { reloadClients() }} />
            </Appbar.Header>
            <Divider />
            {
                data.map( ( item , i ) =>  {
                    return (
                        // 고객마다 
                        <RenderItem key={item.id} item={ item } i = { i } />
                    );
                }  )
            }
        </>
        }
    </KeyboardAwareScrollView>
    );
}

export default function() {
    return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='ChatList' component={ChatView} options={{ headerShown: false  }}/>
            <Stack.Screen name='ProgressPage' component={ProgressPage} options = {{ headerShown : false }}/>
            <Stack.Screen name='ChatDetail' component = {ChatDetailPage} options={{ headerShown : false }} />
            <Stack.Screen name='CarePage' component = {CarePage} options={{ headerShown : false }} />
        </Stack.Navigator>
   </NavigationContainer>
    );
}