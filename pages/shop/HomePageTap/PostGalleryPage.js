import React from 'react';
import styled from 'styled-components';
import { FlatList } from 'react-native';
import { Button  , Avatar , Title } from 'react-native-paper';
import { Image } from 'react-native';
import colors from '../../../color/colors';

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
   const postData = [];
  // 1개의 게시물 
  const RenderItem = ({ item }) =>  {
        return(
        <PostButton onPress= { () =>  { props.navigation.navigate('Post',{ data: props.data  , uri : item.uri }) }}>
            <Image source= { { uri: item.uri }  } style={{ width: '100%' , height: '100%' }} />
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