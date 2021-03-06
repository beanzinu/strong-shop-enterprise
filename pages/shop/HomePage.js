import React from 'react' ;
import styled from 'styled-components';
import { Appbar , Card , Title , Avatar , Badge, List, IconButton } from 'react-native-paper';
import { Alert, SafeAreaView  ,useWindowDimensions , Platform } from 'react-native';
import Collapsible from 'react-native-collapsible';
import colors from '../../color/colors';
import Swiper from 'react-native-swiper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import AppContext from '../../storage/AppContext';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import { Image } from 'react-native';
import { TabView , SceneMap , TabBar } from 'react-native-tab-view';
import { useIsFocused } from '@react-navigation/native';
// Pages
import InfoPage from './HomePageTap/InfoPage';
import PostGalleryPage from './HomePageTap/PostGalleryPage';
import ProductPage from './HomePageTap/ProductPage';
import ReviewPage from './HomePageTap/ReviewPage';
// server
import API  from '../../server/API';
import axios from 'axios';
import server from '../../server/server';
import fetch from '../../storage/fetch';
import store from '../../storage/store';
// Tab Navigator
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import analytics from '@react-native-firebase/analytics';
import CustomBar from '../../components/CustomBar';


const Tab = createMaterialTopTabNavigator();
// 

const View = styled.View``;
const ImageView = styled.TouchableOpacity``;
const Row = styled.View`
    flex-direction: row;
    background-color: white;
`;
const ButtonRow = styled.TouchableOpacity`
    flex-direction: row;
    background-color: white;
`;
const MenuButton = styled.TouchableOpacity`
    flex: 1 ;
    border-bottom-width: 5px ;
    height: 50px ;

    align-items: center;
    justify-content: center;
`;
const Text = styled.Text`
    align-self: center;
    font-size: 15px ;
    padding: 5px ;
`;

const data = {
    shopName : '?????????' , 
    location : '????????? ????????? 507-3' ,
    paragraph :  'Then launch simulator to preview. Note that you just need to edit the source file src/index.js, the change will auto sync to examples.\n After development, you should add test for your modification and make all tests passed to prevent other contributors break the feature in the future accidentally. We use detox + jest for e2e test now, you can read Detox for more deta' ,
}

const thumbnails = null ;

const styles = {
    card : {
        // padding: 20 , 
        // backgroundColor : colors.main , 
        borderWidth: 1 ,
        borderColor: 'lightgray' ,
        // borderRadius: 0 ,
        height : 300 ,
    } ,
    cover : {
        height: 200 ,
        marginBottom: 20 ,
    } 
}



  
function TabViews({ navigation  }) {
    // const layout = useWindowDimensions();
    // const [listControl,setListControl] = React.useState(false);
    const [index, setIndex] = React.useState(0);
    const MyContext = React.useContext(AppContext);

    const [routes] = React.useState([
      { key: 'first', title: '#??????' },
      { key: 'second', title: '#?????????' },
      { key: 'third', title: '#????????????' },
      { key: 'fourth', title: '#??????' },
    ]);
  
    const renderScene = ({ route }) => {
        switch (route.key) {
          case 'first':
            return  <InfoPage navigation={navigation} />;
          case 'second':
            return <PostGalleryPage navigation={navigation}  />
          case 'third':
            return <ProductPage navigation={navigation} />
          case 'fourth':
            return <ReviewPage navigation={navigation} />
          
          default:
            return null;
        }
    };
 
    const handleIndex = (index) => {
        if ( index == 0 ) {
            // Google Analytics
            analytics().logScreenView({
                screen_class: 'Home' ,
                screen_name: 'Information'
            })
        }
        else if ( index == 1 ) {
            // Google Analytics
            analytics().logScreenView({
                screen_class: 'Home' ,
                screen_name: 'Gallery'
            })
            MyContext.setRefresh(!MyContext.refresh);
        }
        else if ( index == 2 ) {
            // Google Analytics
            analytics().logScreenView({
                screen_class: 'Home' ,
                screen_name: 'Product'
            })
        }
        else if ( index == 3 ) {
            // Google Analytics
            analytics().logScreenView({
                screen_class: 'Home' ,
                screen_name: 'Review'
            })
            MyContext.setReviewRefresh(!MyContext.reviewRefresh);
        }
        setIndex(index);
    }

    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(index) => { handleIndex(index) }}
        // lazy={true}
        renderTabBar={ props => 
            <TabBar {...props}
            indicatorStyle={{ backgroundColor: 'white' , borderWidth: 2 , borderColor: 'transparent' }}
            style={{ backgroundColor: 'white' , elevation: 0  }}
            renderLabel={ 
                props => 
                <Text 
                style={{ color: props.focused ? 'black' : '#d18b60' , fontSize : props.focused ? 13 : 12 , fontFamily: 'NotoSansKR-Medium'  }}>
                    {props.route.title}
                </Text>}
            // activeColor={'white'} 
            // inactiveColor={'#d18b60'}
            />
        }
        // initialLayout={{ width: layout.width }}
      />
    );
}
  


export default function( props ) {
    // 1.  ??????  2. ??????????????? 3. ???????????? 4. ??????
    const [value, setValue] = React.useState(1);
    const [collapsed,setCollapsed] = React.useState(true);
    // ?????? ?????????
    const [picture,setPicture] = React.useState(null);
    const [loading,setLoading] = React.useState(false);
    // ????????????
    const [shopName,setShopName] = React.useState('');
    // ??????????????????
    const [isalarm,setIsAlarm] = React.useState(false);
    const isFocused = useIsFocused();
    const MyContext = React.useContext(AppContext);

    
    

    React.useEffect(() => {


        fetch('Info')
        .then( async(res) => {
            if (res?.backgroundImageUrl != null) {
                setPicture( res.backgroundImageUrl);
            }
            if (res?.company_name != null )
                setShopName(res['company_name']);
            else {
                // 1. ???????????? ???????????? Info ?????? ?????????.
                API.get('/api/companyinfo')
                .then(res=> {
                    // 2. Info ????????? setData()
                    try {
                        if ( res.data.statusCode == 200 ) {
                            setShopName(res.data.data.company_name)
                            setPicture( res.data.data.backgroundImageUrl);

                        }
                    }
                    catch(e) {
                        //
                    }
                })
                .catch( e => { 
                    // console.log(e.response);
                 })


            }
        })

        

    },[]);

    // ?????? ?????? 
    React.useEffect(() => {
                
        fetch('noti')
        .then(res => {
            let flag = false ;
            if ( res.data != null) {
                res.data.map(item => {
                    if ( !item.read ) flag = true ;
                })
            }
            setIsAlarm(flag);
        })
        .catch(e => {
        })

    },[MyContext.homeRef]);

    

    return (
        <View style={{ backgroundColor: 'white' , flex: 1}}>
        <Appbar.Header style={{ backgroundColor: colors.main , justifyContent: 'flex-end' , height: 70 , elevation: 0  }}>
            {/* <Appbar.Content onPress={()=> { setCollapsed(!collapsed) }}  title={shopName} titleStyle={{  color: 'white' , fontWeight: 'bold' , fontSize: shopName?.length > 10 ? 12 : shopName?.length > 5 ? 24 : 25  }}  /> */}
            <View>
                <Appbar.Action color={colors.title} icon="bell-outline" onPress={() => { props.navigation.navigate('Notifications')}}  />
                {
                    isalarm && <Badge size={ 8 } style={{ position: 'absolute' , right: 9 , top : 9  }}/>
                }
            </View>
            <Appbar.Action color={colors.title}  icon="cog-outline" onPress={() => { props.navigation.navigate('MyPage',{ name: shopName , picture: picture })}} />
        </Appbar.Header>  
        <CustomBar.B title={shopName} />
        
        {/* ???????????? */}
        {/* <Collapsible 
            collapsed={collapsed}
            // collapsed={ scroll > 0  ? true : false }
            // collapsedHeight={10}
            duration={0}
        > 
            <View>
            <Card style={ styles.card }>

                        {
                            picture == null ? 
                            (
                                
                                // loading ?
                                <>
                                <ImageView onPress={requestThumbnail} style={{flex: 1 , justifyContent: 'center' , alignItems:'center'}}>
                                <LottieView source={require('../../LottieJson/4.json')} style={{ position: 'absolute' }}  autoPlay={true} loop={true}/>
                                <Title style={{position: 'absolute', bottom: 10 , textAlign: 'center' , fontSize: 15 }} >????????? ??????{'\n'}?????? ???????????? ??????????????????.</Title>
                                </ImageView>
                                </>
                                // :
                                // <ImageView style={{flex: 1 , justifyContent: 'center' , alignItems:'center'}} onPress={requestThumbnail}>
                                // </ImageView>
                                
                            ) :
                            (   
                                    <ImageView onPress={requestThumbnail}>
                                        <FastImage source = {{ uri : picture }} style={ styles.cover } resizeMode='contain' />
                                    </ImageView>
                            )
                        }

            </Card> 
            </View>
        </Collapsible> */}

        <TabViews navigation={props.navigation}/>
        </View>
    );
}