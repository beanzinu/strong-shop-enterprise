import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components';
import Swiper from 'react-native-swiper';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert, Dimensions, Image , TouchableOpacity } from 'react-native';
import { Card , Avatar , Title , Button , IconButton , Provider , Modal , Portal } from 'react-native-paper';
import colors from '../../../color/colors';
import LottieView from 'lottie-react-native';
import {check, PERMISSIONS, RESULTS , request , openSettings } from 'react-native-permissions';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import ImageCompressor from "@nomi9995/react-native-image-compressor";
import DraggableFlatList , {ScaleDecorator} from 'react-native-draggable-flatlist';
import axios from 'axios';
import { LogBox } from 'react-native';
import AppContext from '../../../storage/AppContext';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import fetch from '../../../storage/fetch';
import server from '../../../server/server';


// Warning 메시지 무시 
// library 내부 Component 문제
LogBox.ignoreLogs([
  'ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component is no longer necessary. You can now directly use the ref instead. This method will be removed in a future release.',
]);

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
    const [pictures,setPictures]= React.useState(null) ;
    const [cache,setCache] = React.useState([]);
    const [text,setText] = React.useState('');
    const [inputHeight,setInputHeight] = React.useState(120);
    const [refresh,setRefresh] = React.useState(false);
    const [requesting,setRequesting] = React.useState(false) ;
    const ModalRef = React.useRef(null);
    const MyContext = React.useContext(AppContext)
    
    openNew = async () => {
        request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        await MultipleImagePicker.openPicker({
            mediaType: 'image',
            selectedAssets: cache ,
            doneTitle: "완료",
            selectedColor: "#162741",
            maxSelectedAssets: 10 ,
            maximumMessageTitle: '최대 10장까지만 등록해주세요.' ,
            maximumMessage: '' ,
            cancelTitle: '취소' ,
            numberOfColumn: 3 ,
            
        })
        .then(res => {
           setCache(res);

           url = [] ;
           res.map( async ( file ) =>  {
               newPath = file.path.replace('file://','').replace('file:///','file://');

            //    const result = await ImageCompressor.compress(
            //     file.path,
            //     {
            //       quality: 1.0 ,
            //     })
            //     ;
               
            //    url.push(result);

               url.push(file.path);
           });
          
           setPictures(url);
           // Refresh Swiper
           setRefresh(true);
           setTimeout(()=>{
            setRefresh(false);
           },2000);

        }) 
        .catch(e => { });
       
    }
    
    removePictures = () =>  {
        Alert.alert('사진을 모두 지우시겠습니까?','',[
            {
                text: '확인' ,
                onPress: () => { setPictures(null); setCache([]); }
            }
            ,{
                text: '취소'
            }
        ])
    }

    uploadData = async() =>  {
        if( pictures == null ) {
            Alert.alert('사진없음','사진을 올려주세요.')
            return;
        }
        // 폼데이터 생성
        var body = new FormData();
        // 현재 사용자가 불러온 이미지 리스트들 => 각각 폼데이터에 넣어준다.
        pictures?.map( (picture,index) =>{
            var photo = {
                uri: picture ,
                type: 'multipart/form-data',
                name: `${index}.jpg` ,
                
            }
            body.append('files',photo);
        })
        body.append('content',text);
       
        // 서버에게 전송
        setRequesting(true);
        await fetch('auth')
        .then(res => {
            const auth = res.auth ;
            axios.post(`${server.url}/api/gallery`,body,{
                headers: {'content-type': 'multipart/form-data' , Auth: auth }
            })
            .then(res => {
                if ( res.data.statusCode == 201 ) {
                    MyContext.setRefresh(!MyContext.refresh);
                    props.navigation.goBack();
                    
                }
            })
            .catch(e => {
                setRequesting(false);
            })

        })
        .catch(e => {

        })
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
        <Provider>
        <KeyboardAwareScrollView 
        ref={ ref => this.flatList = ref }
        style={{ backgroundColor: 'white' }}>

        <Portal>
            <Modal visible={requesting} style={{ alignItems: 'center' , justifyContent: 'center' , backgroundColor: 'transparent' }} >
                <LottieView style={{ width: 200, height: 100 }} source={require('./2.json')} autoPlay={true} loop={true}/>
            </Modal>
        </Portal>

        <BottomSheetModalProvider>
            <Card style={ styles.Card }>
                <Card.Title 
                    titleStyle={ styles.title }
                    title= { props.route.params.name } 
                    left = { (props)=>  <Avatar.Icon {...props} icon='account' size={24} style={{ backgroundColor: colors.main}}/>  }
                    // right = { (props) => <Button onPress={removePictures} color='red'>사진 지우기</Button>}
                />
            </Card>
            <Row>
                <OptionView onPress={() => openNew() }>
                    <IconButton icon='image-plus' />
                </OptionView>
                {/* {
                    pictures != null && pictures.length > 1 && (
                <OptionView onPress={() => ModalRef.current?.present() }>
                    <IconButton icon='tools'/>
                    <Text style={{ fontSize: 12 }}>사진 수정</Text>
                </OptionView>
                    )
                } */}
            </Row>
            {
                pictures != null && (
                    <SwiperView>
                    <Swiper horizontal={true} refreshControl={refresh} showsHorizontalScrollIndicator={true} loop={false}>
                        {
                            pictures.map((picture) =>{
                               return(
                                    <SwiperView>
                                        <Image resizeMode='cover' source={{ uri: picture }} style={{ flex: 1 }}/>
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
                    onBlur={() => { this.flatList.scrollToEnd(true) }}
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
                    { requesting ? '등록중...' : '등록하기'}
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
        </Provider>
    );
}