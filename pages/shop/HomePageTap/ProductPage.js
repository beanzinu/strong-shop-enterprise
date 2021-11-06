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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        borderRadius: 20,
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
            DATA == null || DATA.length == 0 ? (
                <View style={{ backgroundColor: 'white' , justifyContent: 'center' , alignItems: 'center' , flex: 1}}>
                    <Avatar.Icon icon='note-plus' style={{ backgroundColor: 'transparent'}} color={colors.main}/>
                    <Title>취급상품을 등록해보세요.</Title>
                </View>
            ) :
            (
            <FlatList
                onScrollEndDrag={ this.handleScroll }
                data={ DATA } 
                renderItem = {RenderItem}
                horizontal={false}
                keyExtractor={(item) => {item.name}}
            /> 
            )
        }
        </>
    )


}


const options = [
    { name : '틴팅'} ,
    { name : 'PPF'} ,
    { name : '블랙박스'} ,
    { name : '보조배터리'} ,
    { name : '애프터블로우'} ,
    { name : '방음'} ,
    { name : '랩핑'} ,
    { name : '유리막코팅'} ,
    { name : '언더코팅'} ,
    { name : '기타'} ,
];

export default function( props ) {
    const [value,setValue] = React.useState(1);
    const [DATA,setDATA] = React.useState(null);

    React.useEffect( async ()=>{
        await fetch('Product')
        .then( res => {
            setDATA(res);
            setValue(1);
        })
        .catch(e=>{ console.log(e) }) ;

    },[]);

       
    handleScroll = function( event ) {
        props.setScroll(event.nativeEvent.contentOffset.y);
    } ;

    return(
        <View style={{ flex: 1 }}>
        
         <View style={{ height: 60 }}> 
         <ScrollView horizontal={true}  style={{ height : 70  , backgroundColor: 'white'  }} showsHorizontalScrollIndicator={false}>
            {
                options.map((item,i)=>{
                    return(
                        <Button key={i} style={{ ...styles.button }} color={colors.main} onPress={ () => { setValue(i+1) }} mode = { value == i+1 && 'contained'}>
                            {item.name}
                        </Button>
                    )
                })
            }
         </ScrollView>
         </View>
        { value == 1 && <Product DATA={DATA?.tinting}/> }
        { value == 2 && <Product DATA={DATA?.ppf}/> }
        { value == 3 && <Product DATA={DATA?.blackbox}/> }
        { value == 4 && <Product DATA={DATA?.battery}/> }
        { value == 5 && <Product DATA={DATA?.afterblow}/> }
        { value == 6 && <Product DATA={DATA?.deafening}/> }
        { value == 7 && <Product DATA={DATA?.wrapping}/> }
        { value == 8 && <Product DATA={DATA?.glasscoating}/> }
        { value == 9 && <Product DATA={DATA?.undercoating}/> }
        { value == 10 && <Product DATA={DATA?.etc}/> }

         <FAB style={styles.fab} icon='pencil' color='white' 
            onPress={ () => { props.navigation.navigate('ProductRegister',{ data : DATA}) }}
         />

        </View>
    );
}