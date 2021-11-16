import React from 'react';
import styled from 'styled-components';
import { FlatList } from 'react-native';
import { Button  , Avatar , Title, ActivityIndicator } from 'react-native-paper';
import { Image } from 'react-native';
import colors from '../../../color/colors';
import axios from 'axios';
import server from '../../../server/server';
import fetch from '../../../storage/fetch';
import AppContext from '../../../storage/AppContext';
import FastImage from 'react-native-fast-image';



const PostButton = styled.TouchableOpacity`
    width: 33.3%;
    height: 100px;
    border:1px lightgray;
    justify-content: center;
    align-items: center;
`;
const View= styled.View``;

const styles = {
    button : {
        alignSelf: 'flex-end' ,
        padding: 5 ,
    }
}


export default function( props ) {
   const [postData,setPostData] = React.useState([]);
   const MyContext = React.useContext(AppContext);

    requestImage = async() =>  {

        const token = await fetch('auth') ;
        const auth = token.auth ;

        axios({
            url: `${server.url}/api/gallery`,
            method: 'get' ,
            headers : {
                Auth : auth
            }
        })
        .then ( res =>  {
            setPostData(res.data.data) ;
        })
        .catch(e  => {
            //
        })
    }


    React.useEffect(() =>  {
        // 사진요청
        requestImage();

    },[MyContext.refresh]);


  // 1개의 게시물 
  const RenderItem = ({ item }) =>  {
        return(
        <PostButton onPress= { () =>  { props.navigation.navigate('Post',{ data: props.data  , uri : item.imageUrls , content : item.content }) }}>
            <FastImage source= { { uri: item.imageUrls[0].imageUrl }  } style={{ width: '100%' , height: '100%' }} />
        </PostButton>    
        );
    }

    handleScroll = function( event ) {
        props.setScroll(event.nativeEvent.contentOffset.y);
    } ;


    return (
        <View style={{ backgroundColor: 'white' , flex: 1}}>  
        <Button icon='pencil-plus-outline' 
            style={ styles.button }
            color={ colors.main }
            onPress={ () =>  { props.navigation.navigate('PostRegister', { data : props.data }) }}
        >
            작성하기
        </Button>
        {
            postData.length == 0 ? (
                <View style={{ backgroundColor: 'white' , justifyContent: 'center' , alignItems: 'center' , flex: 1}}>
                    <Avatar.Icon icon='camera-plus' style={{ backgroundColor: 'transparent'}} color={colors.main}/>
                    <Title>시공사진을 등록해보세요.</Title>
                </View>
            ) :
            (
                <FlatList
                onScrollEndDrag={this.handleScroll}
                data={ postData } 
                renderItem = {RenderItem}
                horizontal={false}
                numColumns={3}
                keyExtractor={(item) => item.uri}
                />
            )
        }
        
        </View>       
    );
}