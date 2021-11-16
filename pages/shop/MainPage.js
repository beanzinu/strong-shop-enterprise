import React from 'react' ;
import styled from 'styled-components';
import { Appbar , BottomNavigation , Text , IconButton } from 'react-native-paper';
import { createStackNavigator  } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import colors from '../../color/colors';
import messaging from '@react-native-firebase/messaging';
// pages 
import BidPage from './BidPage/BidPage';
import BidRegister from './BidPage/BidRegister';
import ChatPage from './ChatPage';
import ChatDetailPage from './ChatDetailPage';
import HomePage from './HomePage';
import PostPage from './PostPage';
import InfoRegister from './Register/InfoRegister';
import PostRegister from './Register/PostRegister';
import PostPageRegister from './Register/PostPageRegister';
import ProductRegister from './Register/ProductRegister';
import ProductDetailRegister from './Register/ProductDetailRegister';
import MyPage from './MyPage';

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

// 홈
const homeRoute = () => {
    return(
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerLeft : props => ( <IconButton {...props} icon='chevron-left' size={24} /> ) }}>
            <Stack.Screen name='Home' component={HomePage}  options={{ headerShown : false }}/>
            <Stack.Screen name='MyPage' component={MyPage}  options={{ headerShown : false }}/>
            <Stack.Screen name='Post' component={PostPage} />
            <Stack.Screen name='InfoRegister' component={InfoRegister} options={{ headerShown: false }} />
            <Stack.Screen name='PostPageRegister' component={PostPageRegister} options={{ title: '작업갤러리 등록' }}/>
            <Stack.Screen name='PostRegister' component={PostRegister} options={{ title: '작업갤러리 상세등록' }} />
            <Stack.Screen name='ProductRegister' component={ProductRegister} options={{ title: '취급상품 등록'}}/>
            <Stack.Screen name='ProductDetailRegister' component={ProductDetailRegister} options={{ title: '취급상품 상세등록'}}/>
        </Stack.Navigator>
    </NavigationContainer>
    );
}

//  입찰
const bidRoute = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerLeft : props => ( <IconButton {...props} icon='chevron-left' size={24} /> ) }}>
                <Stack.Screen name='BidPage' component={BidPage} options={{ headerShown : false }}/>
                <Stack.Screen name='BidRegister' component={BidRegister} options={{ title: '입찰 등록' }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

// 문의 및 채팅
const chatRoute = () => <ChatPage/>

export default function() {

    React.useEffect(()=>{
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
            setIndex(2);
          });
    },[]);
    
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'home', title: '홈', icon: 'home'  },
      { key: 'bid', title: '입찰', icon: 'alarm-plus' },
      { key: 'chat', title: '시공', icon: 'car-door' , badge: true },
    ]);
    const renderScene = BottomNavigation.SceneMap({
        home: homeRoute,
        bid: bidRoute,
        chat: chatRoute,
      });

    return(
        <BottomNavigation
            barStyle= {{ backgroundColor: 'white' }}
            activeColor={colors.main}
            navigationState={{ index, routes }}
            shifting={true}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />  
    );
}