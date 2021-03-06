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

    // FlatList ????????? Item
    const RenderItem = ({item}) =>  {
        return (
            <Button>
                <Row>
                    <Text style={ styles.title}>????????? {item.page}</Text>
                    <IconButton icon='close-circle' color='red' 
                        onPress={() =>{ 
                            Alert.alert(`${item.page}?????????`,`?????????????????????????`,
                            [
                                {
                                    'text' : '??????' ,
                                    onPress : () => {  }
                                } ,
                                {
                                    'text' : '??????' ,
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

    // ????????? ?????????????????? ??????
    const sort = React.useCallback( ( value ) => {

        value = _.orderBy(value,'page','asc')  ;

        setData(value);

        console.log(value);
    },[]);

    // ????????? ?????? 
    const deletePost = React.useCallback( ( data , page ) =>  {
        
        console.log('result : ');
        console.log( _.filter( data, function(object) {
            return object.page !== page ;
        }) ) ;

        

    },[]);

    // ????????? ?????? ??? ??????
    React.useEffect( async () =>  {

        // ?????? ???????????? ????????? ??????
        await fetch('post')
        .then( res =>  {
            let tmp = [] ;
            
            // ????????? object -> Array
            for (const [key, value] of Object.entries(res) ) {
                tmp.push(value);
            }    
            sort(tmp);

        })
        .catch( e => { 
            // ?????? ???????????? ?????? ???

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
                <Text>????????? ????????????</Text>
            </AddButton>
            <SubmitButton 
                style={{ backgroundColor: DATA.length != 0 ? 'rgb(89,13,229)' : 'white' }}>
                <Text style= {{ color: DATA.length != 0 ? 'white' : 'black'  }}> 
                    ???????????? 
                </Text>
            </SubmitButton>
        </Container>
    );
}