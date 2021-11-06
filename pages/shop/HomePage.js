import React from 'react' ;
import styled from 'styled-components';
import { Appbar , Card , Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import colors from '../../color/colors';
import Swiper from 'react-native-swiper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
// Pages
import InfoPage from './HomePageTap/InfoPage';
import PostGalleryPage from './HomePageTap/PostGalleryPage';
import ProductPage from './HomePageTap/ProductPage';
import ReviewPage from './HomePageTap/ReviewPage';

const View = styled.View``;
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
        height : 300 ,
    } ,
    cover : {
        height: 300 ,
    } 
}

export default function( props  ) {
    // 1.  정보  2. 작업갤러리 3. 취급상품 4. 리뷰
    const [value, setValue] = React.useState(1);
    const [scroll,setScroll] = React.useState(0);
    const [listControl,setListControl] = React.useState(false);
    const [collapsed,setCollapsed] = React.useState(true);
    return (
        <>
        <Appbar.Header style={{ backgroundColor: 'white' , borderColor: 'lightgray' , borderWidth: 1  }}>
        <Appbar.Content onPress={()=> { setCollapsed(!collapsed) }}  title={data.shopName} titleStyle={{  fontFamily : 'DoHyeon-Regular' , fontSize: 20  }}  />
        <Appbar.Action icon={ collapsed ? 'chevron-down' : 'chevron-up' } onPress={() => { setCollapsed(!collapsed)}} style={{}}/>
        <Appbar.Action  style={{ flex: 2 }}/>
        
        <Appbar.Action icon="bell-outline" onPress={() => {}} />
        <Appbar.Action icon="cog-outline" onPress={() => { props.navigation.navigate('MyPage')}} />
        </Appbar.Header>  
        
        {/* 커버사진 */}
        <Collapsible 
            collapsed={collapsed}
            // collapsed={ scroll > 0  ? true : false }
            collapsedHeight={0}
            duration={1000}
        >

        <Card style={ styles.card }>

                <Swiper autoplay={true}>
                    {
                        thumbnails == null ? 
                        (
                            <View style={styles.cover}>
                                <Title>업체 썸네일을 등록해보세요.</Title>
                            </View>
                        ) :
                        (   
                            <>
                            <Card.Cover source = {{ uri : 'https://picsum.photos/0' }} style={ styles.cover }/>
                            <Card.Cover source = {{ uri : 'https://picsum.photos/0' }} style={ styles.cover }/>
                            <Card.Cover source = {{ uri : 'https://picsum.photos/0' }} style={ styles.cover }/>
                            </>
                        )
                    }
                </Swiper>

        </Card>
 
        </Collapsible>


       
        <Row>
            <MenuButton 
                style={{ borderBottomColor : value === 1 ? colors.main : 'white' }} 
                onPress = { () => {setValue(1) , setScroll(0) } }>
                <Text style={{ color : value === 1 ? colors.main : 'gray'}}> 정보 </Text>
            </MenuButton>
            <MenuButton 
                style={{ borderBottomColor : value === 2 ? colors.main  : 'white' }} 
                onPress = { () => {setValue(2) , setScroll(0)} }>
                <Text style={{ color : value === 2 ? colors.main : 'gray'}}> 작업갤러리 </Text>
            </MenuButton>
            <MenuButton 
                style={{ borderBottomColor : value === 3 ? colors.main  : 'white' }} 
                onPress = { () => {setValue(3) , setScroll(0)} }>
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
                    <InfoPage data={data} navigation={props.navigation} setScroll={setScroll} />
                    </>
                )
           }
           {/* 작업갤러리 화면 */}
           {
               value === 2  && (
                   <PostGalleryPage navigation={props.navigation}  data ={data} setScroll={setScroll}  />
               )
           }
           {/* 취급상품 화면 */}
           {
               value === 3 && (
                  <ProductPage navigation={props.navigation} setScroll={setScroll} />
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