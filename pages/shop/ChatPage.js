import React from 'react' ;
import styled from 'styled-components';
import { Avatar , Card , Title , 
    Paragraph , Button , Banner } from 'react-native-paper';
import {  GiftedChat } from 'react-native-gifted-chat';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import axios from 'axios';
import { Image } from 'react-native';
import server from '../../server/server';
// pages 
import ChatDetailPage from './ChatDetailPage';
import ProgressPage from './ProgressPage/ProgressPage';
import colors from '../../color/colors';
import fetch from '../../storage/fetch';
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

const testData = [{"bidding_id": 5, "constructionImageUrlResponseDtos": [], "detail": "{\"tinting\":\"루마\",\"tintingPrice\":\"100\",\"totalPrice\":\"100\",\"carName\":\"AVANTE HYBRID\"}", "id": 6, "inspectionImageUrlRequestDtos": [], "order_id": 4, "shipmentLocation": null, "state": "DESIGNATING_SHIPMENT_LOCATION", "userResponseDto": {"birth": null, "email": "ys05143@naver.com", "gender": null, "id": 1, "nickname": "허지훈", "phoneNumber": "01012341234", "profileImage": "http://k.kakaocdn.net/dn/bnznMs/btrazLTprkY/9wznFjIGhM1VNPc1PGZG11/img_640x640.jpg", "realName": null, "thumbnailImage": "http://k.kakaocdn.net/dn/bnznMs/btrazLTprkY/9wznFjIGhM1VNPc1PGZG11/img_110x110.jpg"}}]

const state = {
    DESIGNATING_SHIPMENT_LOCATION : '출고지 지정' ,
    CAR_EXAMINATION : '신차검수' ,
    CONSTRUCTING : '시공진행' ,
    CONSTRUCTION_COMPLETED : '시공완료/출고'
}

const ChatView = ( props ) =>   {
    const [temp,setTemp] = React.useState({});
    const [data,setData]  = React.useState([]);
    React.useEffect(async () => {
        database().goOnline();
        database().ref('chat').orderByKey('createdAt').limitToLast(1).once('value',snapshot=>{
            record = Object.values(snapshot.val())[0];
            setTemp(record);
        });

        const token = await fetch('auth') ;
        const auth = token.auth ;

        axios({
            method: 'get' ,
            url: `${server.url}/api/contract` ,
            headers: { Auth: auth }
        })
        .then( res => {
            console.log(res.data.data) ;
            setData(res.data.data);
        })
        .catch( e => {
            //
            console.log(e);
        })



    },[]);

    return(
    <View>
        {
        testData.map( ( chat , i ) =>  {
            return (
                <Card 
                    key = {i} // key로 구분
                    onPress={ () => { props.navigation.navigate('ProgressPage' , { data: chat })  } }>
                    <Card.Title title={`${chat.userResponseDto.nickname} 고객`} subtitle={state[chat.state]} 
                                titleStyle={{ margin: 10 }} subtitleStyle= {{ margin: 10 }}
                                left={ props => <ImageView><Image source={{ uri: chat.userResponseDto.profileImage.replace('http','https') }} style={{ width: '100%', height: '100%' }} /></ImageView>  } 
                                right={ props => <Avatar.Text {...props} label={chat.unRead} style={{ marginRight: 10  , backgroundColor : colors.main }} /> }
                    />
                </Card>
            );
        }  )
        }
    </View>
    );
}




export default function() {
    return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='ChatList' component={ChatView} options={{ title: '채팅' }}/>
            <Stack.Screen name='ProgressPage' component={ProgressPage} options = {{ headerShown : false }}/>
            <Stack.Screen name='ChatDetail' component = {ChatDetailPage} options={{ headerShown : false }} />
        </Stack.Navigator>
   </NavigationContainer>
    );
}