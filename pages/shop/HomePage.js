import React from 'react' ;
import styled from 'styled-components';
import { Appbar , Card , ToggleButton ,
    Button , Title , Avatar , DataTable
} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { Image } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';

// Pages
import InfoPage from './HomePageTap/InfoPage';
import PostGalleryPage from './HomePageTap/PostGalleryPage';
import ProductPage from './HomePageTap/ProductPage';
import ReviewPage from './HomePageTap/ReviewPage';

const Row = styled.View`
    flex-direction: row;
    background-color: white;
`;
const MenuButton = styled.TouchableOpacity`
    flex: 1 ;
    border-bottom-width: 5px ;
    padding: 5px;
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

const styles = {
    card : {
        padding: 20 , 
        backgroundColor : 'rgb(89,13,229)' , 
        borderRadius: 0 ,
        height : 250 ,
    } ,
    cover : {
        height: 150 ,
    }
}

export default function( props  ) {
    // 1.  정보  2. 작업갤러리 3. 취급상품 4. 리뷰
    const [value, setValue] = React.useState(4);
    const [scroll,setScroll] = React.useState(0);

    handleScroll = function( event ) {
        setScroll(event.nativeEvent.contentOffset.y);
    } ;
    

    return (
        <>
        <Appbar.Header>
        <Appbar.Content title="최강샵" titleStyle={{ alignSelf: 'center'}} />
        <Appbar.Action icon="bell-outline" onPress={() => {}} />
        <Appbar.Action icon="cog-outline" onPress={() => {}} />
        </Appbar.Header>  
        
        <Collapsible collapsed={ value == 3 && scroll > 0  ? true : false }
            collapsedHeight={0}
            duration={1000}
        >

        <Card style={ styles.card }>
                <Card.Cover source={{ uri : 'https://picsum.photos/0' }} style={ styles.cover }/>
                <Card.Title title={data.shopName} subtitle={data.location}  
                            titleStyle={{ color: 'white' }} subtitleStyle={{ color: 'white' }}>
                    {data.shopName}
                </Card.Title>
        </Card>
 
        </Collapsible>


       
        <Row>
            <MenuButton 
                style={{ borderBottomColor : value === 1 ? 'purple' : 'white' }} 
                onPress = { () => setValue(1) }>
                <Text> 정보 </Text>
            </MenuButton>
            <MenuButton 
                style={{ borderBottomColor : value === 2 ? 'purple' : 'white' }} 
                onPress = { () => setValue(2) }>
                <Text> 작업갤러리 </Text>
            </MenuButton>
            <MenuButton 
                style={{ borderBottomColor : value === 3 ? 'purple' : 'white' }} 
                onPress = { () => setValue(3) }>
                <Text> 취급상품 </Text>
            </MenuButton>
            <MenuButton 
                style={{ borderBottomColor : value === 4 ? 'purple' : 'white' }} 
                onPress = { () => setValue(4) }>
                <Text> 리뷰 </Text>
            </MenuButton>
        </Row>

       <>
           {/* 정보 화면 */}
           {
               value === 1 && (
                    <>
                    <InfoPage data={data} navigation={props.navigation}  />
                    </>
                )
           }
           {/* 작업갤러리 화면 */}
           {
               value === 2  && (
                   <PostGalleryPage navigation={props.navigation}  data ={data} />
               )
           }
           {/* 취급상품 화면 */}
           {
               value === 3 && (
                    
                <KeyboardAwareScrollView
                    onScroll={this.handleScroll}
                >
                  <ProductPage/>
                </KeyboardAwareScrollView>    
               )
           }
           {/* 리뷰 화면 */}
           {
               value === 4 && (
                   <ReviewPage/>
               )
           }
        </>

        </>
    );
}