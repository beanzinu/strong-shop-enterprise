import React from 'react' ;
import styled from 'styled-components';
import { Appbar , BottomNavigation , Text , IconButton } from 'react-native-paper';
import { createStackNavigator ,  } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import colors from '../../color/colors';
import axios from 'axios';
import server from '../../server/server';
import fetch from '../../storage/fetch';
import database from '@react-native-firebase/database';
import AppContext from '../../storage/AppContext';
// pages 
import BidPage from './BidPage/BidPage';
import BidRegister from './BidPage/BidRegister';
import ChatPage from './ProgressPage/ChatPage'
import ChatDetailPage from './ProgressPage/ChatDetailPage';
import HomePage from './HomePage';
import PostPage from './HomePageTap/PostPage';
import InfoRegister from './Register/InfoRegister';
import PostRegister from './Register/PostRegister';
import PostPageRegister from './Register/PostPageRegister';
import ProductRegister from './Register/ProductRegister';
import ProductDetailRegister from './Register/ProductDetailRegister';
import MyPage from './AppBarContents/MyPage';
import Receipt from './AppBarContents/Receipt';
import Notifications from './AppBarContents/Notifications';
import CS from './AppBarContents/CS';

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
function HomeRoute() {
    return(
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerLeft : props => ( <IconButton {...props} icon='chevron-left' size={24} /> ) }}>
            <Stack.Screen name='Home' component={HomePage}  options={{ headerShown : false }}/>
            <Stack.Screen name='MyPage' component={MyPage}  options={{ title: '마이페이지' }}/>
            <Stack.Screen name='Receipt' component={Receipt}  options={{ title: '과거 시공내역'  }}/>
            <Stack.Screen name='CS' component={CS}  options={{ title: '고객문의'  }}/>
            <Stack.Screen name='Notifications' component={Notifications} options={{ title: '알림센터' }}/>
            <Stack.Screen name='Post' component={PostPage} options={{ title: '게시물' }} />
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
function BidRoute() {
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerLeft : props => ( <IconButton {...props} icon='chevron-left' size={24} /> ) }}>
                <Stack.Screen name='BidPage' component={BidPage} options={{ headerShown : false }}/>
                <Stack.Screen name='BidRegister' component={BidRegister} options={{ title: '입찰 등록' }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}




export default function( props ) {
    const MyContext = React.useContext(AppContext);
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'home', title: '홈', icon: 'home' },
      { key: 'bid', title: '입찰', icon: 'alarm-plus' },
      { key: 'chat', title: '시공', icon: 'car-door' },
    ]);

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
    
                }
            }) // db

        } ) // value.map


            
    }


    // 문의 및 채팅
    function ChatRoute() { return <ChatPage /> }
    
    
    // const renderScene = BottomNavigation.SceneMap({
    //     home: HomeRoute,
    //     bid: BidRoute,
    //     chat: ChatRoute,
    //   });  

    const renderScene = ({ route }) => {
    switch (route.key) {
        case 'home':
        return  <HomeRoute />;
        case 'bid':
        return <BidRoute />;
        case 'chat':
        return <ChatPage />;
        
        default:
        return null;
    }
    };


    // 각 Tab을 다시 눌렀을때 다시 정보 load
    const handleTabPress  = ( route ) => {
        if ( route.key == 'home' ) {
            MyContext.setHomeRef(!MyContext.homeRef);
            // MyContext.setChatRef(!MyContext.chatRef);
        }
        else if ( route.key == 'chat' ) {
            MyContext.setChatRef(!MyContext.chatRef);
        }
        else if ( route.key == 'bid' ) {
            MyContext.setBidRef(!MyContext.bidRef);
            // MyContext.setChatRef(!MyContext.chatRef);
        }

    } 


    // 채팅 Tab으로 이동
    React.useEffect(() => {

        if ( MyContext.noti ==2 ) {
            setIndex(2);
            MyContext.setNoti(0);
        }

    },[MyContext.noti]);

    // 채팅있는지 1번 확인

    React.useEffect(() => {
        fetch('auth')
            .then( res => {
                const auth = res.auth ;
                axios({
                    method: 'get' ,
                    url: `${server.url}/api/contract` ,
                    headers: { Auth: auth }
                })
                .then( res => {   
                    handleUnRead(res.data.data);
                })
                .catch( e => {
                })// axios
            })
        .catch( e => {
        }) ;
    },[]);


    return(
        <BottomNavigation
            style={{ }}
            barStyle= {{ backgroundColor: 'white' , borderTopLeftRadius: 10 , borderTopRightRadius: 10 }}
            getBadge={ (routes) => {
                if ( routes.route.key == 'chat') return MyContext.badge
            } } 
            activeColor={'black'}
            inactiveColor='lightgray'
            navigationState={{ index, routes  }}
            shifting={true}
            onTabPress={(index) => { handleTabPress(index.route) }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />    
    );
}