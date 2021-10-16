import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components';
import Swiper from 'react-native-swiper';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert, Image } from 'react-native';
import { Card , Avatar , Title , Button } from 'react-native-paper';
import InputScrollView from 'react-native-input-scroll-view';
import colors from '../../../color/colors';
import {check, PERMISSIONS, RESULTS , request , openSettings } from 'react-native-permissions';
const PictureButton = styled.TouchableOpacity`
    flex: 1 ;
    border: 1px lightgray;
    justify-content: center;
    align-items: center;
`;
const SwiperView = styled.View`
    width: 100% ;
    height: 300px ;
    
`;
const Text = styled.Text`
    font-size: 18px;
    font-weight: bold ;
    color: ${colors.main};
`;
const TextInput = styled.TextInput`
    border: 2px lightgray;
    height: 150px;
    padding: 10px;
`;


const styles= {
    Card : {
    } ,
    Image : {
        flex: 1
    } ,
    title : {
        fontSize: 15 , 
        fontWeight: 'bold'
    } ,
    text : {
        margin: 10 ,
    }
}



export default function( props ) {
    const [pictures,setPictures]= React.useState([]) ;
    const [loading,setLoading] = React.useState(false);
    const [text,setText] = React.useState('');
    
    loadImage = async ( value ) =>  {

        // openSettings().catch(() => console.warn('cannot open settings'));
        
        
        check(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then((result) => {
          switch (result) {
            case RESULTS.GRANTED:
                let url = pictures ;

                ImagePicker.openPicker({
                    width: this.width,
                    height: this.height,
                    includeBase64 : true,
                    multiple: true,
                    cropping: true ,
                }).then( image => {
                    image.map( (item )  => {
                        
                        

                        url = [ ...url , { uri : item.sourceURL }] ; 
                        console.log(url);
                    } )

                    setPictures(url) ;
                    setLoading(true);
                    // if ( value == 1 ) setPictures( { ...pictures, a : image.sourceURL } )
                })
                .catch(e => console.log(e)) ;
                
                break;
            default :
                Alert.alert('라이브러리 사용을 허용해주세요.','',[
                    {
                        text : '설정으로 가기' ,
                        onPress : () =>  {
                            openSettings().catch(() => console.warn('cannot open settings'));
                        }
                    } ,
                    {
                        text : '취소' ,
                        onPress : () => { }
                    }
                ])
                break;
                
          }
        })
        .catch((error) => {
          // …
        });
        
        
     

       

    } ;

    return(
        <KeyboardAwareScrollView>
            <Card style={ styles.Card }>
                <Card.Title 
                    titleStyle={ styles.title }
                    title= {props.route.params.data.shopName} 
                    left = { (props)=>  <Avatar.Icon {...props} icon='account' size={24} style={{ backgroundColor: colors.main}}/>  }
                    right = { (props) => <Button onPress={()=>{ setPictures([]); setLoading(false); }} color='red'>사진 지우기</Button>}
                />
            </Card>
            <SwiperView>
                            {
                                !loading ? (
                                    <SwiperView>
                                        <PictureButton onPress={ () => { loadImage(1) } }>
                                            <Avatar.Icon icon='image' size={30} style= {{ margin: 10 }} style={{ backgroundColor: colors.main}}/>
                                            <Text>여기를 눌러 사진을 추가하세요.</Text>
                                        </PictureButton>
                                    </SwiperView>
                                ) : (
                                    <Swiper loop = {false}>
                                    {
                                        pictures.map( ( picture ) =>  {
                                            return(
                                                <SwiperView key = { picture.uri }>
                                                    <Image source={{ uri : picture.uri }}  style={{ width: '100%' , height: '100%' }} />
                                                </SwiperView>             
                                            );
                                        } )
                                    }
                                    </Swiper>                           
                                )
                            }
            </SwiperView>
            <Title style={{ padding: 10 }}> 내용 </Title>
                <TextInput 
                    placeholder='내용을 입력하세요.'
                    value={text} 
                    onChangeText={value => setText(value) }  
                    multiline={true}/>
                <Button color={colors.main} mode='contained' style={{ marginTop: 10}}>추가하기</Button>
        </KeyboardAwareScrollView>
    );
}