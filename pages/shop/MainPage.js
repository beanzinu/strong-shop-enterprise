import React from 'react' ;
import styled from 'styled-components';
import { Appbar , BottomNavigation , Text } from 'react-native-paper';
import { createStackNavigator  } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// pages 
import BidPage from './BidPage';
import ChatPage from './ChatPage';
import HomePage from './HomePage';
import PostPage from './PostPage';
import InfoRegister from './Register/InfoRegister';
import PostRegister from './Register/PostRegister';
import PostPageRegister from './Register/PostPageRegister';


const View = styled.SafeAreaView``;

const Stack = createStackNavigator() ;

const styles = {
    bottom : {
        position: 'absolute',
        top: 50 ,
        left: 0,
        right: 0,
        bottom: 0,
    }
} ; 

const homeRoute = () => {
    return(
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Home' component={HomePage}  options={{ headerShown : false }}/>
            <Stack.Screen name='Post' component={PostPage} />
            <Stack.Screen name='InfoRegister' component={InfoRegister} options={{ title: '업체 소개' }} />
            <Stack.Screen name='PostPageRegister' component={PostPageRegister} options={{ title: '작업갤러리 등록' }}/>
            <Stack.Screen name='PostRegister' component={PostRegister} options={{ title: '작업갤러리 상세등록' }} />
        </Stack.Navigator>
    </NavigationContainer>
    );
}


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