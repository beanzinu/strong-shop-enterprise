import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components';
import Swiper from 'react-native-swiper';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert, Image , TouchableOpacity } from 'react-native';
import { Card , Avatar , Title , Button , IconButton } from 'react-native-paper';
import colors from '../../../color/colors';
import {check, PERMISSIONS, RESULTS , request , openSettings } from 'react-native-permissions';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import DraggableFlatList , {ScaleDecorator} from 'react-native-draggable-flatlist';
import axios from 'axios';
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
const Row = styled.View`
    flex-direction: row;
    width: 100%;
    height: 120px;
    align-items: center;
`;
const BasicRow = styled.View`
    flex-direction: row;
    align-items: center;
`;
const OptionView = styled.TouchableOpacity`
    width: 70px;
    height: 70px;
    margin: 5px;
    border: 1px lightgray;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
`;
const View = styled.View``;

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
    const [text,setText] = React.useState('');
    const [inputHeight,setInputHeight] = React.useState(120);
    const ModalRef = React.useRef(null);
    
    openLibrary = async () =>  {
        ModalRef.current?.dismiss();
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

    openCamera = async() =>  {
        ModalRef.current?.dismiss();
        check(PERMISSIONS.IOS.CAMERA)
        .then((result)=>{
            switch (result) {
                case RESULTS.GRANTED:
                    let url = pictures ;
    
                    ImagePicker.openCamera({
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
                    })
                    .catch(e => console.log(e)) ;
                    break;
    
                default :
                    Alert.alert('카메라 사용을 허용해주세요.','',[
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
        .catch(e => { 
            // 
        })
    }

    uploadData = async() =>  {
        // 폼데이터 생성
        var body = new FormData();
        // 현재 사용자가 불러온 이미지 리스트들 => 각각 폼데이터에 넣어준다.
        pictures?.map( (picture,index) =>{
            var photo = {
                uri: picture.uri ,
                type: 'multipart/form-data',
                name: `${index}.jpg`
            }
            body.append('image',photo);
        })
        //test
        console.log(body?._parts[0][1]);
        // 서버에게 전송
        // axios.post('serverUrl',body,{
        //     headers: {'content-type': 'multipart/form-data'}
        // })
    }

    
    const RenderItem = ({ item, drag, isActive }) => {
        return (
            <TouchableOpacity
              onLongPress={drag}
              disabled={isActive}
              style={{ width: 100 , height: 100 , padding: 5 }}
            >
              <Image source={{ uri : item.uri }} style={{ flex: 1 }} />
            </TouchableOpacity>
        );
      };
    
    return(
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
        <BottomSheetModalProvider>
            <Card style={ styles.Card }>
                <Card.Title 
                    titleStyle={ styles.title }
                    title= { props.route.params.data.shopName } 
                    left = { (props)=>  <Avatar.Icon {...props} icon='account' size={24} style={{ backgroundColor: colors.main}}/>  }
                    right = { (props) => <Button onPress={()=>{ setPictures([]); }} color='red'>사진 지우기</Button>}
                />
            </Card>
            <Row>
                <OptionView onPress={() => openCamera() }>
                    <IconButton icon='camera-plus' />
                </OptionView>
                <OptionView onPress={() => openLibrary() }>
                    <IconButton icon='image-plus' />
                </OptionView>
                {
                    pictures.length > 1 && (
                <OptionView onPress={() => ModalRef.current?.present() }>
                    <IconButton icon='tools'/>
                    <Text style={{ fontSize: 12 }}>사진 수정</Text>
                </OptionView>
                    )
                }
            </Row>
            {
                pictures.length != 0 && (
                    <SwiperView>
                    <Swiper horizontal={true}>
                        {
                            pictures.map((picture) =>{
                               return(
                                    <SwiperView>
                                        <Image source={{ uri: picture.uri }} style={{ flex: 1 }}/>
                                    </SwiperView>
                                )
                            })
                        }
                    </Swiper> 
                    </SwiperView>
                )
            }
            
            

            <Title style={{ padding: 10 }}> 내용 </Title>
                <TextInput 
                    placeholder='내용을 입력하세요.'
                    style={{ height: inputHeight }}
                    value={text} 
                    onChangeText={value => setText(value) }  
                    onContentSizeChange={e=>{
                        if ( e.nativeEvent.contentSize.height > inputHeight ) setInputHeight(inputHeight+50);
                    }}
                    multiline={true}/>
                <Button 
                    style={{ height: 50 , justifyContent: 'center' , marginTop: 10 , marginBottom: 50 }} 
                    theme={{ colors: { primary: colors.main } }}
                    labelStyle={{ fontWeight: 'bold' }}
                    mode='contained'
                    onPress={() =>  { uploadData() }}
                >
                    등록하기
                </Button>
            <BottomSheetModal
                ref={ModalRef}
                snapPoints={['40%']}
                bottomInset={inputHeight}
            >
                <BasicRow>
                    <Text style={{ fontSize: 25 , margin: 20 }}>👆 순서를 바꿔보세요.</Text>
                    <Button style={{ position: 'absolute', right: 0  }} labelStyle={{ fontSize: 15 , fontWeight: 'bold'}} color={colors.main}
                        onPress={() => { ModalRef.current?.dismiss() }}
                    >
                        완료
                    </Button>
                </BasicRow>
                <DraggableFlatList 
                    nestedScrollEnabled={true}
                    style={{ marginLeft: 20 }}
                    horizontal={true}
                    data={pictures}
                    onDragEnd={ ({data})=>{ setPictures(data) }}
                    keyExtractor={(item)=>item.uri}
                    renderItem={RenderItem}
                />
            </BottomSheetModal>
        </BottomSheetModalProvider>            
        </KeyboardAwareScrollView>
    );
}