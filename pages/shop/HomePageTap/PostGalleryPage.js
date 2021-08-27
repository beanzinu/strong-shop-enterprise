import React from 'react';
import styled from 'styled-components';
import { FlatList } from 'react-native';
import { Button  } from 'react-native-paper';
import { Image } from 'react-native';

const postData = [
    {
        uri : 'https://picsum.photos/0'
    } ,
    {
        uri : 'https://picsum.photos/100'
    } ,
    {
        uri : 'https://picsum.photos/200'
    } ,
    {
        uri : 'https://picsum.photos/300'
    } ,
    {
        uri : 'https://picsum.photos/0'
    } ,
    {
        uri : 'https://picsum.photos/100'
    } ,
    {
        uri : 'https://picsum.photos/200'
    } ,
    {
        uri : 'https://picsum.photos/300'
    } ,
    {
        uri : 'https://picsum.photos/0'
    } ,
    {
        uri : 'https://picsum.photos/100'
    } ,
    {
        uri : 'https://picsum.photos/200'
    } ,
    {
        uri : 'https://picsum.photos/300'
    } ,

];

const PostRow = styled.View`
    width: 100%;
    height: 100px;
    flex-direction: row;
`;
const PostButton = styled.TouchableOpacity`
    width: 33.3%;
    height: 100px;
    border:1px lightgray;
    justify-content: center;
    align-items: center;
`;

const styles = {
    button : {
        alignSelf: 'flex-end' ,
        padding: 5 ,
    }
}

export default function( props ) {

  // 1개의 게시물 
  const RenderItem = ({ item }) =>  {
    return(
    <PostButton onPress= { () =>  { props.navigation.navigate('Post',{ data: props.data  , uri : item.uri }) }}>
        <Image source= { { uri: item.uri }  } style={{ width: '100%' , height: '100%' }} />
    </PostButton>    
    );
}


    return (
        <>  
        <Button icon='pencil-plus-outline' 
            style={ styles.button }
            onPress={ () =>  { props.navigation.navigate('PostPageRegister', { data : props.data }) }}
        >
            작성하기
        </Button>
         <FlatList
             data={ postData } 
             renderItem = {RenderItem}
             horizontal={false}
             numColumns={3}
             keyExtractor={(item) => item.uri}
             
         />
        </>       

    );
}