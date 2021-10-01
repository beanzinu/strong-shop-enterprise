import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components';
import Swiper from 'react-native-swiper';
import ImagePicker from 'react-native-image-crop-picker';
import { Image } from 'react-native';
import { Card , Avatar , Title , Button } from 'react-native-paper';
import InputScrollView from 'react-native-input-scroll-view';
import colors from '../../../color/colors';
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
        
        let url = [] ;

        await ImagePicker.openPicker({
            width: this.width,
            height: this.height,
            includeBase64 : true,
            multiple: true,
          }).then( image => {
              image.map( (item )  => {
                   url = [ ...url , { uri : item.sourceURL }] ;   
              } )

              setPictures(url) ;
              setLoading(true);
            // if ( value == 1 ) setPictures( { ...pictures, a : image.sourceURL } )
        })
        .catch(e => console.log(e)) ;

       

    } ;

    return(
        <KeyboardAwareScrollView>
            <Card style={ styles.Card }>
                <Card.Title 
                    titleStyle={ styles.title }
                    title= {props.route.params.data.shopName} 
                    left = { (props)=>  <Avatar.Icon {...props} icon='account' size={24} style={{ backgroundColor: colors.main}}/>  }
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
            <Title> 내용 </Title>
            <InputScrollView topOffset={40}>
                {/* <TextInput label='내용' multiline={true} value={text}
                        onChangeText={ value => setText(value) }
                /> */}
                <TextInput 
                    placeholder='내용을 입력하세요.'
                    value={text} 
                    onChangeText={value => setText(value) }  
                    multiline={true}/>
            </InputScrollView>
            <Button>추가하기</Button>
            </KeyboardAwareScrollView>
    );
}