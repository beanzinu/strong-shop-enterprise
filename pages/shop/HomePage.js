import React from 'react' ;
import styled from 'styled-components';
import { Appbar , Card , Title , Avatar , Badge } from 'react-native-paper';
import { Alert, SafeAreaView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import colors from '../../color/colors';
import Swiper from 'react-native-swiper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import AppContext from '../../storage/AppContext';
import FastImage from 'react-native-fast-image';
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
        borderRadius: 0 ,
        height : 320 ,
    } ,
    cover : {
        height: 280 ,
        marginBottom: 20 ,
    } 
}

export default function( props  ) {
    // 1.  정보  2. 작업갤러리 3. 취급상품 4. 리뷰
    const [value, setValue] = React.useState(1);
    const [scroll,setScroll] = React.useState(0);
    const [listControl,setListControl] = React.useState(false);
    const [collapsed,setCollapsed] = React.useState(true);
    // 업체 썸네일
    const [picture,setPicture] = React.useState(null);
    // 업체이름
    const [shopName,setShopName] = React.useState('');
    const MyContext = React.useContext(AppContext);
    // 알람존재여부
    const [isalarm,setIsAlarm] = React.useState(false);
    const isFocused = useIsFocused();

    React.useEffect(() => {

        fetch('Info')
        .then( async(res) => {
            if (res?.backgroundImageUrl != null) {
                setPicture( res.backgroundImageUrl);
            }
            if (res?.company_name != null)
                setShopName(res.company_name);
            else {
                const token = await fetch('auth') ;
                const auth = await token.auth ;
                // 1. 서버에게 요청하여 Info 정보 받아옴.
                axios({
                    method: 'get',
                    url: `${server.url}/api/companyinfo`,
                    headers: {
                        Auth:  auth ,
                    }
                })
                .then( res => {
                    // 2. Info 정보를 setData()
                    try {
                        if ( res.data.statusCode == 200 ) {
                            setShopName(res.data.data.company_name)
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
        
        if ( isFocused ) {
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
        }

    },[MyContext.homeRef , isFocused ]);

    // 썸네일 등록
    function requestThumbnail(){
        MultipleImagePicker.openPicker({
            mediaType: 'image' ,
            maxSelectedAssets: 1 ,
            maximumMessageTitle: '업체 썸네일' ,
            maximumMessage: '한장만 등록해주세요.' ,
            doneTitle: "완료",
            selectedColor: "#162741",
            tapHereToChange: '여기를 눌러 변경' ,
            cancelTitle: '취소' ,
            singleSelectedMode: true
        })
        .then(async (res) => {
            // 서버에 등록 후 캐시

            const token = await fetch('auth');
            const auth = token.auth;
                // 폼데이터 생성
                var body = new FormData();
                 // 현재 사용자가 불러온 이미지 리스트들 => 각각 폼데이터에 넣어준다.
    
                var url = res[0].path;
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

        })
    }

    return (
        <>
        <Appbar.Header style={{ backgroundColor: 'white' , borderColor: 'lightgray' , borderBottomWidth: 1 , alignItems: 'center'  }}>
        <Appbar.Content  onPress={()=> { setCollapsed(!collapsed) }}  title={shopName} titleStyle={{  fontFamily : 'DoHyeon-Regular' , fontSize: shopName.length > 10 ? 12 : shopName.length > 5 ? 20 : 25  }}  />
        <Appbar.Action icon={ collapsed ? 'chevron-down' : 'chevron-up' } onPress={() => { setCollapsed(!collapsed)}} style={{}}/>
        <Appbar.Action  style={{ flex: 1 }}/>
        
        <View>
        <Appbar.Action icon="bell-outline" color='black' onPress={() => { props.navigation.navigate('Notifications')}}  />
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
            collapsedHeight={0}
            duration={1000}
        >

        <Card style={ styles.card }>

                    {
                        picture == null ? 
                        (
                            <ImageView style={{flex: 1 , justifyContent: 'center' , alignItems:'center'}} onPress={requestThumbnail}>
                                <Avatar.Icon icon='gesture-tap' style={{ backgroundColor: 'transparent'}} color='black'/>
                                <Title>업체 썸네일을 등록해보세요.</Title>
                            </ImageView>
                        ) :
                        (   
                                <ImageView onPress={requestThumbnail}>
                                    <FastImage source = {{ uri : picture }} style={ styles.cover }/>
                                </ImageView>
                        )
                    }

        </Card>
 
        </Collapsible>


       
        <Row>
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
        </Row>

       
           {/* 정보 화면 */}
           {
               value === 1 && (
                    <>
                    <InfoPage data={data} navigation={props.navigation} setScroll={setScroll} listControl = {listControl} />
                    </>
                )
           }
           {/* 작업갤러리 화면 */}
           {
               value === 2  && (
                   <PostGalleryPage navigation={props.navigation}  data ={data} setScroll={setScroll}  listControl = {listControl} shopName={shopName}/>
               )
           }
           {/* 취급상품 화면 */}
           {
               value === 3 && (
                  <ProductPage navigation={props.navigation} setScroll={setScroll} listControl = {listControl} />
               )
           }
           {/* 리뷰 화면 */}
           {
               value === 4 && (
                   <ReviewPage setScroll={setScroll} listControl = {listControl} />
               )
           }
        

        
        </>
    );
}