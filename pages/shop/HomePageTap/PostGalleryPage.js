import React from 'react';
import styled from 'styled-components';
import { FlatList } from 'react-native';
import { Button  , Avatar , Title, ActivityIndicator } from 'react-native-paper';
import { Image } from 'react-native';
import colors from '../../../color/colors';

// storage
import API from '../../../server/API';
import axios from 'axios';
import server from '../../../server/server';
import fetch from '../../../storage/fetch';
import FastImage from 'react-native-fast-image';
import AppContext from '../../../storage/AppContext';
import commonStyles from '../../../components/commonStyles';

const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;
const ButtonRow = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`;
const PostButton = styled.TouchableOpacity`
    width: 33.3%;
    height: 120px;
    border: 1.5px white;
    justify-content: center;
    align-items: center;
`;
const View= styled.View``;
const PostView = styled.TouchableOpacity``;

const styles = {
    button : {
        alignSelf: 'flex-end' ,
        padding: 5 ,
    } ,
    view : {
        borderWidth: 1 , borderColor: colors.main , backgroundColor: colors.submain , paddingBottom: 30 , marginLeft: 10 , marginRight: 10 , borderRadius: 5
    }
}

export const GalleryContext = React.createContext();
export default function( props ) {
   const [loading,setLoading] = React.useState(true);
   const [postData,setPostData] = React.useState([]);
   const [shopName,setShopName] = React.useState();
   const [imageUrl,setImageUrl] = React.useState();
   const MyContext = React.useContext(AppContext);

    requestImage = () =>  {

        API.get('/api/gallery')
        .then( res => {
            setPostData(res.data.data) ;
            setLoading(false);
        })
        .catch(e  => {
            //
        })
        
    }

    React.useEffect(() =>  {

        fetch('Info')
        .then(res => {
            setShopName(res?.company_name)
            setImageUrl(res?.backgroundImageUrl);
        })
        
        // 사진요청
        requestImage();

    },[MyContext.refresh]);


  // 1개의 게시물 
  const RenderItem = ({ item }) =>  {
        return(
        <PostButton key={item.id} onPress= { () =>  { props.navigation.navigate('Post',{ imageUrl: imageUrl  , uri : item.imageUrls , content : item.content , name : shopName , id : item.id }) }}>
            <FastImage resizeMode={FastImage.resizeMode.cover}  source= { { uri: item?.imageUrls[0]?.imageUrl }  } style={{ width: '100%' , height: '100%' }} />
        </PostButton>    
        );
    }



    return (
        <View style={{ backgroundColor: 'white' , flex: 1 , ...commonStyles.view }}>  
        {
            loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} size='large' color='black'/>
            ):
            (
                <>
                    <Row style={commonStyles.titleRow}>
                        <Title style= {{ fontSize: 23 , fontFamily: 'Jua-Regular'  }}> 작업갤러리 </Title>
                        <ButtonRow 
                            style={{ right: 0 , position: 'absolute' }}
                            onPress={ () =>  { props.navigation.navigate('PostRegister', { data : props.data ,  name : shopName , imageUrl: imageUrl  }) }}
                        >
                            <Image resizeMode='contain' source={require('../../../resource/gallery_icon.png')}  style={{ width: 15, height: 15, alignSelf: 'center', marginBottom: 2 }} />
                            <Button
                                labelStyle={{ fontSize: 15 , fontFamily: 'Jua-Regular' }}
                                color={colors.main}
                                >
                                등록하기
                            </Button>
                        </ButtonRow>
                    </Row>
                {
                    postData.length == 0 ? (
                        <PostView style={{ backgroundColor: 'transparent' , justifyContent: 'center' , alignItems: 'center' , flex: 1}}
                            onPress={() => { props.navigation.navigate('PostRegister', { data : props.data ,  name : shopName , imageUrl : imageUrl   }) }}
                        >
                            <Image resizeMode='contain' source={require('../../../resource/gallery_icon.png')}  style={{ width: 50, height: 50, alignSelf: 'center', margin: 10 }} />
                            <Title style={{ color: colors.emptyTitle }}>시공사진을 등록해보세요.</Title>
                        </PostView>
                    ) :
                    (
                        <FlatList
                            ref={ ref => this.flatList = ref }
                            data={ postData } 
                            renderItem = {RenderItem}
                            horizontal={false}
                            numColumns={3}
                            keyExtractor={(item) => item.id }
                        />
                    )
                }
                </>
            )
        }      
        </View>       
    );
}
