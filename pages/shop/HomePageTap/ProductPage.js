import React from 'react';
import { DataTable , Title , Card , Button , IconButton , FAB, Avatar } from 'react-native-paper';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Collapsible from 'react-native-collapsible';
import colors from '../../../color/colors';
import { FlatList } from 'react-native';
import { random } from 'lodash';
// async
import fetch from '../../../storage/fetch';

const styles = {
    title : {
        fontWeight: 'bold' ,
        color : colors.main ,
        padding: 10 ,
        fontFamily : 'DoHyeon-Regular' ,
        fontSize : 30
    } ,
    button : {
        alignSelf: 'center' , 
        height: 45 ,
        borderWidth : 1 ,
        borderColor : 'lightgray' ,
        margin : 5 , 
        flex : 1 , 
        padding : 5
    } ,
    fab : {
        position: 'absolute' ,
        margin: 16 ,
        right: 0 ,
        bottom: 0 ,
        backgroundColor : colors.main
    }
} ;

const Row = styled.View`
    flex-direction: row;
`;
const Text = styled.Text`
    padding: 5px ;
    font-weight: bold;
`;
const SubText = styled.Text`
    padding : 5px ; 
    border : 1px lightgray;
`;

const TouchableOpacity = styled.TouchableOpacity`
    width: 56px; 
    height: 56px;
    background-color: ${colors.main}; 
`;


const View = styled.View``;
  
// const DATA = [
//     {
//        name : '솔라가드 NR SMOKE 5' ,
//        price : 150000 ,
//        description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% 가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
//     } ,
//     {
//        name : '솔라가드 NR SMOKE 7' ,
//        price : 320000 ,
//        description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
//     } ,
//     {
//        name : '솔라가드 NR SMOKE 5' ,
//        price : 150000 ,
//        description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% 가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
//     } ,
//     {
//        name : '솔라가드 NR SMOKE 7' ,
//        price : 320000 ,
//        description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
//     } ,
//     {
//        name : '솔라가드 NR SMOKE 5' ,
//        price : 150000 ,
//        description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% 가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
//     } ,
//     {
//        name : '솔라가드 NR SMOKE 7' ,
//        price : 320000 ,
//        description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
//     } ,
//     {
//        name : '솔라가드 NR SMOKE 5' ,
//        price : 150000 ,
//        description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% 가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
//     } ,
//     {
//        name : '솔라가드 NR SMOKE 7' ,
//        price : 320000 ,
//        description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
//     } ,
// ] ;

function ProductItem( {item} ) {
    const [visible,setVisible] = React.useState(false) ;
    return (
        <Card>
        <Card.Content>
            <Row style= {{ alignItems: 'center' }}>
                <Text>{item.name}</Text>
                <IconButton icon={ visible ? 'chevron-up' : 'chevron-down'  } 
                    color='black'
                    size={20}
                    onPress={ () => setVisible(!visible) } 
                />
            </Row>
            {
                visible && (
                    <SubText  >{item.description}</SubText>
                )
            }                        
        </Card.Content>
        </Card>
    )
}

function Product( {DATA} ) {
    // FlatList의 각 항목
    const RenderItem = ({item}) =>  {
        return (
                <ProductItem item ={item} />
            )
    }
 // function 의 리턴
    return(
        <>
        {
            DATA.length == 0 ? (
                <View style={{ backgroundColor: 'white' , justifyContent: 'center' , alignItems: 'center' , flex: 1}}>
                    <Avatar.Icon icon='note-plus' style={{ backgroundColor: 'transparent'}} color={colors.main}/>
                    <Title>취급상품을 등록해보세요.</Title>
                </View>
            ) :
            (
            <FlatList
            nestedScrollEnabled={true}
            onScrollEndDrag={ this.handleScroll }
            data={ DATA } 
            renderItem = {RenderItem}
            horizontal={false}
            keyExtractor={(item) => {random()%1000}}
            // onMomentumScrollEnd={() => {
            //     DATA.push(
            //         {
            //             name : '데이터 끝나면 추가' ,
            //             price : 320000 ,
            //             description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
            //         } ,
            //     ) ;
            // }
            // }
            /> 
            )
        }
        </>
    )


}



export default function( props ) {
    const [value,setValue] = React.useState(0);
    const [DATA,setDATA] = React.useState(null);

    React.useEffect( async ()=>{
        await fetch('Product')
        .then( res => {
            setDATA(res.tinting);
            setValue(1);
        })
        .catch(e=>{ console.log(e) }) ;

        console.log('loading');

    },[]);

       
    handleScroll = function( event ) {
        props.setScroll(event.nativeEvent.contentOffset.y);
    } ;

    return(
        <View style={{ flex: 1 }}>
        
         <View style={{ height: 70 }}> 
         <ScrollView horizontal={true}  style={{ height : 70  , backgroundColor: 'white'  }} showsHorizontalScrollIndicator={false}>
            <Button icon='car-cog' style={ styles.button }
                    color={ colors.main }
                    onPress={ () => {  setValue(1) }}
                    mode= { value == 1 && 'contained' }
            >
            틴팅
            </Button>
            <Button icon='car-cog' style={ styles.button }
                    color={ colors.main }
                    onPress={ () => { setValue(2) }}
                    mode= { value == 2 && 'contained' }
            >
            블랙박스      
            </Button>
            <Button icon='car-cog' style={ styles.button }
                    color={ colors.main }
                    onPress={ () => { setValue(3) }}
                    mode= { value == 3 && 'contained' }
            >
            PPF       
            </Button>
            <Button icon='car-cog' style={ styles.button }
                    color={ colors.main }
                    onPress={ () => { setValue(4) }}
                    mode= { value == 4 && 'contained' }
            >
            유리막코팅      
            </Button>
         </ScrollView>
         </View>
        
         {/* 틴팅 */}
         {
             value == 1 && (
                 <Product DATA = { DATA} />
             )
         }
        {/* 블랙박스 */}
        {
            value == 2 && (
                <Product DATA = { DATA} />
            )
        }
        {/* PPF */}
        {
             value == 3 && (
                <Product DATA = { DATA} />
             )
         }
        {/* 유리막코팅 */}
        {
             value == 4 && (
                <Product DATA = { DATA} />
             )
         }

         <FAB style={styles.fab} icon='pencil' color='white' 
            onPress={ () => { props.navigation.navigate('ProductRegister',{ data : DATA}) }}
         />

        </View>
    );
}