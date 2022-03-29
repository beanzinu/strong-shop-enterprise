import React from 'react';
import styled from 'styled-components';
import { Avatar , IconButton } from 'react-native-paper';
import { FlatList } from 'react-native';
import { Image } from 'react-native';
import { Alert } from 'react-native';
import _ from 'lodash';
// Storage
import store from '../../../storage/store';
import fetch from '../../../storage/fetch';
const Container = styled.SafeAreaView``;

const Button = styled.TouchableOpacity`
    width: 100% ;
    height: 150px ;

    justify-content: center;
 

    border: 1px gray;
`;
const AddButton = styled.TouchableOpacity`
    width: 100% ;
    height: 150px ;

    justify-content: center;
    align-items: center;

    border: 1px lightgray;
`;
const SubmitButton = styled.TouchableOpacity`
    width: 100%  ;
    height: 50px ;

    justify-content: center;
    align-items: center;
    border: 1px lightgray;
`;
const Text = styled.Text`
    padding: 5px;
`;
const Row = styled.View`
    flex-direction: row;
`;

const styles = {
    image : {
        width: '30%' , 
        height: '90%' ,
        borderWidth: 1 ,
        borderColor: 'gray',
    } ,
    Text :  {
       flex: 1
    } ,
    title :  {
        fontSize: 20 ,
        fontWeight: 'bold' ,
        alignSelf: 'center' ,
        marginLeft: 10
    }
}

// temp 
const DATA = [
    {
        page : '2' ,
        uri : 'https://picsum.photos/100' ,
        text : `TouchableRipple : A wrapper for views that should respond to touches. Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop). On unsupported platforms, it falls back to a highlight effect.`
    } ,
    {
        page : '1' ,
        uri : 'https://picsum.photos/300' ,
        text : `TouchableRipple : A wrapper for views that should respond to touches. Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop). On unsupported platforms, it falls back to a highlight effect.`
    } ,

];


export default function( props ) {
    const [data,setData] = React.useState() ;

    // FlatList 각각의 Item
    const RenderItem = ({item}) =>  {
        return (
            <Button>
                <Row>
                    <Text style={ styles.title}>페이지 {item.page}</Text>
                    <IconButton icon='close-circle' color='red' 
                        onPress={() =>{ 
                            Alert.alert(`${item.page}페이지`,`삭제하시겠습니까?`,
                            [
                                {
                                    'text' : '취소' ,
                                    onPress : () => {  }
                                } ,
                                {
                                    'text' : '삭제' ,
                                    onPress : () => {
                                        deletePost(data,item.page);
                                    }
                                }
                            ]
                            )  
                        } }
                    />
                </Row>
                <Row style={{ flex: 1 , marginLeft: 10 }}>
                    <Image source={{ uri : item.uri }} style={styles.image} />
                    <Text style={ styles.Text }>{`${item.text.substring(0,60)}...`}</Text>
                </Row>
            </Button>
        );
    }

    // 페이지 오름차순으로 정렬
    const sort = React.useCallback( ( value ) => {

        value = _.orderBy(value,'page','asc')  ;

        setData(value);

        console.log(value);
    },[]);

    // 페이지 삭제 
    const deletePost = React.useCallback( ( data , page ) =>  {
        
        console.log('result : ');
        console.log( _.filter( data, function(object) {
            return object.page !== page ;
        }) ) ;

        

    },[]);

    // 페이지 저장 및 처리
    React.useEffect( async () =>  {

        // 쓰던 페이지가 있는지 확인
        await fetch('post')
        .then( res =>  {
            let tmp = [] ;
            
            // 불러온 object -> Array
            for (const [key, value] of Object.entries(res) ) {
                tmp.push(value);
            }    
            sort(tmp);

        })
        .catch( e => { 
            // 쓰던 페이지가 없을 시

        })
    

    },[]);

    return(
        <Container>
            <FlatList 
                data = {data} 
                renderItem = { RenderItem }
                keyExtractor= { item => item.page }
            />
            <AddButton 
                onPress = { () => { props.navigation.navigate('PostRegister',{ data : props.route.params.data }) } }
            >
                <Avatar.Icon icon='plus-box' size={24} />
                <Text>페이지 추가하기</Text>
            </AddButton>
            <SubmitButton 
                style={{ backgroundColor: DATA.length != 0 ? 'rgb(89,13,229)' : 'white' }}>
                <Text style= {{ color: DATA.length != 0 ? 'white' : 'black'  }}> 
                    등록하기 
                </Text>
            </SubmitButton>
        </Container>
    );
}