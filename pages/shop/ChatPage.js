import React from 'react' ;
import styled from 'styled-components';
import { Avatar , Card , Title , 
    Paragraph , Button , Banner } from 'react-native-paper';
import {  GiftedChat } from 'react-native-gifted-chat';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
// pages 
import ChatDetailPage from './ChatDetailPage';
import ProgressPage from './ProgressPage/ProgressPage';
import colors from '../../color/colors';
const styles = {
    Button : {
        flex: 1
    }

};
const View = styled.SafeAreaView``;
const Stack = createStackNavigator() ; 


const chatData = [
    {
        name : '홍길동' ,
        lastMessage : '축하드립니다..' ,
        unRead : 3 ,
    }
    ,
    {
        name : '김갑수' ,
        lastMessage : '고객님, 저희가' ,
        unRead : 4 ,
    }
    ,
    {
        name : '김기덕' ,
        lastMessage : '사진' ,
        unRead : 5 ,
    }
    ,

] ;

const ChatView = ( props ) =>   {
    return(
    <View>
        {
        chatData.map( ( chat , i ) =>  {
            return (
                <Card 
                    key = {i} // key로 구분
                    onPress={ () => { props.navigation.navigate('ProgressPage' , { name : chat.name })  } }>
                    <Card.Title title={`${chat.name} 고객`} subtitle={chat.lastMessage} 
                                left={ props => <Avatar.Icon {...props} icon="account" style={{ backgroundColor : colors.main}} /> } 
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