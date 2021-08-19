import React from 'react' ;
import styled from 'styled-components';
import { Appbar , BottomNavigation , Text } from 'react-native-paper';

// pages 
import BidPage from './BidPage';
import ChatPage from './ChatPage';
import HomePage from './HomePage';

const View = styled.SafeAreaView``;

const styles = {
    bottom : {
        position: 'absolute',
        top: 50 ,
        left: 0,
        right: 0,
        bottom: 0,
    }
} ; 

const homeRoute = () => <HomePage/>


const bidRoute = () => <BidPage/>

const chatRoute = () => <ChatPage/>

export default function() {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'home', title: '홈', icon: 'home' },
      { key: 'bid', title: '입찰요청', icon: 'alarm-plus' },
      { key: 'chat', title: '문의', icon: 'chat' },
    ]);
    const renderScene = BottomNavigation.SceneMap({
        home: homeRoute,
        bid: bidRoute,
        chat: chatRoute,
      });

    return(
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />  
    );
}