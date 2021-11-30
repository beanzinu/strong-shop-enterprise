import React from 'react' ;
import styled from 'styled-components';
import { Appbar , Card , Title , Avatar , Badge, List } from 'react-native-paper';
import { Alert, SafeAreaView  ,useWindowDimensions , Platform } from 'react-native';
import Collapsible from 'react-native-collapsible';
import colors from '../../color/colors';
import Swiper from 'react-native-swiper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import AppContext from '../../storage/AppContext';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import { TabView , SceneMap , TabBar } from 'react-native-tab-view';
import { useIsFocused } from '@react-navigation/native';
// Pages
import InfoPage from './HomePageTap/InfoPage';
import PostGalleryPage from './HomePageTap/PostGalleryPage';
import ProductPage from './HomePageTap/ProductPage';
import ReviewPage from './HomePageTap/ReviewPage';
import axios from 'axios';
import server from '../../server/server';
import fetch from '../../storage/fetch';
import store from '../../storage/store';
// Tab Navigator
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

const View = styled.View``;
const ImageView = styled.TouchableOpacity``;
const Row = styled.View`
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
    shopName : '최강샵' , 
    location : '서울시 광진구 507-3' ,
    paragraph :  'Then launch simulator to preview. Note that you just need to edit the source file src/index.js, the change will auto sync to examples.\n After development, you should add test for your modification and make all tests passed to prevent other contributors break the feature in the future accidentally. We use detox + jest for e2e test now, you can read Detox for more deta' ,
}

const thumbnails = null ;

const styles = {
    card : {
        padding: 20 , 
        // backgroundColor : colors.main , 
        borderWidth: 1 ,
        borderColor: 'lightgray' ,
        // borderRadius: 0 ,
        height : 320 ,
    } ,
    cover : {
        height: 280 ,
        marginBottom: 20 ,
    } 
}



  
function TabViews({ navigation, listControl }) {
    // const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const MyContext = React.useContext(AppContext);

    const [routes] = React.useState([
      { key: 'first', title: '정보' },
      { key: 'second', title: '작업갤러리' },
      { key: 'third', title: '취급상품' },
      { key: 'fourth', title: '리뷰' },
    ]);
  
    const renderScene = ({ route }) => {
        switch (route.key) {
          case 'first':
            return  <InfoPage navigation={navigation} listControl = {listControl} />;
          case 'second':
            return <PostGalleryPage navigation={navigation} listControl = {listControl} />
          case 'third':
            return <ProductPage navigation={navigation}  listControl = {listControl} />
          case 'fourth':
            return <ReviewPage navigation={navigation} listControl = {listControl} />
          
          default:
            return null;
        }
    };
 

    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(index) => {
            if ( index == 1 ) MyContext.setRefresh(!MyContext.refresh);
            if ( index == 3 ) MyContext.setReviewRefresh(!MyContext.reviewRefresh);
            setIndex(index);
        }}
        // lazy={true}
        renderTabBar={ props => 
            <TabBar {...props}
            indicatorStyle={{ backgroundColor: colors.main }}
            style={{ backgroundColor: 'white' , borderColor: colors.main  }} 
            activeColor={colors.main} 
            inactiveColor='lightgray'/>
        }
        // initialLayout={{ width: layout.width }}
      />
    );
}
  


export default function( props ) {
    // 1.  정보  2. 작업갤러리 3. 취급상품 4. 리뷰
    const [value, setValue] = React.useState(1);
    const [listControl,setListControl] = React.useState(false);
    const [collapsed,setCollapsed] = React.useState(true);
    // 업체 썸네일
    const [picture,setPicture] = React.useState(null);
    const [loading,setLoading] = React.useState(false);
    // 업체이름
    const [shopName,setShopName] = React.useState('');
    // 알람존재여부
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
                const token = await fetch('auth') ;
                const auth = await token.auth ;
                // 1. 서버에게 요청하여 Info 정보 받아옴.
                axios({
                    method: 'get',
                    url: `${server.url}/api/companyinfo` ,
                    headers: {
                        Auth:  auth ,
                    }
                })
                .then( res => {
                    // 2. Info 정보를 setData()
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
                .catch (e => {
                    //
                });
            }
        })

        

    },[]);

    React.useEffect(() => {

        // setValue(1);
        
        
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

    // 썸네일 등록
    function requestThumbnail(){
        setLoading(true);
        MultipleImagePicker.openPicker({
            mediaType: 'image' ,
            maxSelectedAssets: 1 ,
            maximumMessageTitle: '업체 썸네일' ,
            maximumMessage: '한장만 등록해주세요.' ,
            doneTitle: "완료",
            selectedColor: "#162741",
            tapHereToChange: '여기를 눌러 변경' ,
            cancelTitle: '취소' ,
            singleSelectedMode: true ,
            // 임시
            usedCameraButton: false
        })
        .then(async (res) => {
            setLoading(false);
            // 서버에 등록 후 캐시
            const token = await fetch('auth');
            const auth = token.auth;
                // 폼데이터 생성
                var body = new FormData();
                 // 현재 사용자가 불러온 이미지 리스트들 => 각각 폼데이터에 넣어준다.
    
                if ( Platform.OS == 'ios' ) var response = res[0];
                else var response = res ;
                var url ;
                // ios
                if ( Platform.OS == 'ios' ) url = response.path.replace('file://','').replace('file:///','file://');
                // android
                else url = 'file://' + response.path ;

                var photo = {
                    uri: url ,
                    type: 'multipart/form-data',
                    name: `0.jpg` ,
                    
                }
                body.append('file',photo);
                axios.post(`${server.url}/api/companyinfo/bgi`,body,{
                    headers: {'content-type': 'multipart/form-data' , Auth: auth }
                })
                .then( async(res) => {
                    if ( res.data.statusCode == 200 ) {
                               // 사진 등록
                               const res_url = res.data.data.url ;
                               try{
                                   await store('Info',{ 'backgroundImageUrl' : res_url })
                                   setPicture( res_url ) ;
                               }
                               catch{
                                   Alert.alert('다시 시도해주세요.');
                               }
                    }
                })
                .catch( e => {
                    // console.log(e);
                })


     
        })
        .catch( e => {
            setLoading(false);

        })
        setLoading(false);
    }

    return (
        <>
        <Appbar.Header style={{ backgroundColor: colors.main , borderColor: 'lightgray' , borderBottomWidth: 1 , alignItems: 'center'  }}>
        <Appbar.Content  onPress={()=> { setCollapsed(!collapsed) }}  title={shopName} titleStyle={{  fontFamily : 'DoHyeon-Regular' , fontSize: shopName.length > 10 ? 12 : shopName.length > 5 ? 20 : 25  }}  />
        <Appbar.Action icon={ collapsed ? 'chevron-down' : 'chevron-up' } onPress={() => { setCollapsed(!collapsed)}} style={{}}/>
        <Appbar.Action  style={{ flex: 1 }}/>
        


        <View>
        <Appbar.Action color='white' icon="bell-outline" onPress={() => { props.navigation.navigate('Notifications')}}  />
        {
            isalarm && <Badge size={ 8 } style={{ position: 'absolute' , right: 9 , top : 9  }}/>
        }
        </View>
        <Appbar.Action icon="cog-outline" onPress={() => { props.navigation.navigate('MyPage',{ name: shopName , picture: picture })}} />
        </Appbar.Header>  
        
        

        {/* 커버사진 */}
        <Collapsible 
            collapsed={collapsed}
            // collapsed={ scroll > 0  ? true : false }
            // collapsedHeight={10}
            duration={0}
        >
        
        <Card style={ styles.card }>

                    {
                        picture == null ? 
                        (
                            
                            // loading ?
                            <>
                            <ImageView onPress={requestThumbnail} style={{flex: 1 , justifyContent: 'center' , alignItems:'center'}}>
                            <LottieView source={require('../../LottieJson/4.json')} style={{ position: 'absolute' }}  autoPlay={true} loop={true}/>
                            {/* <Avatar.Icon size={100} icon='gesture-tap' style={{ backgroundColor: 'transparent', position: 'absolute', bottom: 10 }} color='lightgray'/> */}
                            <Title style={{position: 'absolute', bottom: 10 , textAlign: 'center' , fontSize: 15 }} >여기를 눌러{'\n'}업체 썸네일을 등록해보세요.</Title>
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
 
        </Collapsible>


       
        {/* <Row>
            <MenuButton 
                style={{ borderBottomColor : value === 1 ? colors.main : 'white' }} 
                onPress = { () => {setValue(1) , setListControl(!listControl) } }>
                <Text style={{ color : value === 1 ? colors.main : 'gray'}}> 정보 </Text>
            </MenuButton>
            <MenuButton 
                style={{ borderBottomColor : value === 2 ? colors.main  : 'white' }} 
                onPress = { () => {setValue(2) , setListControl(!listControl) } }>
                <Text style={{ color : value === 2 ? colors.main : 'gray'}}> 작업갤러리 </Text>
            </MenuButton>
            <MenuButton 
                style={{ borderBottomColor : value === 3 ? colors.main  : 'white' }} 
                onPress = { () => {setValue(3) , setListControl(!listControl) } }>
                <Text style={{ color : value === 3 ? colors.main : 'gray'}}> 취급상품 </Text>
            </MenuButton>
            <MenuButton 
                style={{ borderBottomColor : value === 4 ? colors.main  : 'white' }} 
                onPress = { () => {setValue(4) , setListControl(!listControl) } }>
                <Text style={{ color : value === 4 ? colors.main : 'gray'}}> 리뷰 </Text>
            </MenuButton>
        </Row> */}

        <TabViews listControl={listControl} navigation={props.navigation}/>


        {/* <Tab.Navigator sceneContainerStyle={{ backgroundColor: 'white' }} 
            screenOptions={{  tabBarActiveTintColor: colors.main , tabBarIndicatorStyle: { backgroundColor: colors.main }  }}   
            keyboardDismissMode='none'
            initialRouteName={InfoPage}
            
        >
            <Tab.Screen name="InfoPage" 
                 listeners={() => ({
                    tabPress: e => {
                      setListControl(!listControl);
                    },
                  })}
                children={() => <InfoPage data={data} navigation={props.navigation} setScroll={setScroll} listControl = {listControl} /> } 
                options={{ title: '정보' }}  />
            <Tab.Screen name="PostGalleryPage" 
                listeners={() => ({
                    tabPress: e => {
                      setListControl(!listControl);
                    },
                })}
                children={() => <PostGalleryPage navigation={props.navigation}  data ={data} setScroll={setScroll}  listControl = {listControl} shopName={shopName}/>} 
                options={{ title: '작업갤러리'  }}/>
            <Tab.Screen name="ProductPage"
                listeners={() => ({
                    tabPress: e => {
                    setListControl(!listControl);
                    },
                })} 
                children={() => <ProductPage navigation={props.navigation} setScroll={setScroll} listControl = {listControl} />} 
                options={{ title: '취급상품' }}/>
            <Tab.Screen name="ReviewPage"
            listeners={() => ({
                tabPress: e => {
                  setListControl(!listControl);
                },
                })} 
                children={() => <ReviewPage setScroll={setScroll} listControl = {listControl} />} 
                options={{ title: '리뷰' }}
            />
        </Tab.Navigator>         */}
        

        
        </>
    );
}