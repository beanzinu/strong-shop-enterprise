import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components';
import Swiper from 'react-native-swiper';
import { Alert, Dimensions, Image , TouchableOpacity , Platform } from 'react-native';
import { Card , Avatar , Title , Button , IconButton , Provider , Modal , Portal } from 'react-native-paper';
import colors from '../../../color/colors';
import LottieView from 'lottie-react-native';
import {check, PERMISSIONS, RESULTS , request , openSettings } from 'react-native-permissions';
import API from '../../../server/API';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import AppContext from '../../../storage/AppContext';


// Warning 메시지 무시 
// library 내부 Component 문제


const PictureButton = styled.TouchableOpacity`
    flex: 1 ;
    border: 1px lightgray;
    justify-content: center;
    align-items: center;
`;
const SwiperView = styled.View`
    width: 100% ;
    height: 350px ;
    
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
        fontWeight: 'bold' ,
        fontFamily: 'NotoSansKR-Medium'
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
    // const [refresh,setRefresh] = React.useState(false);
    const [requesting,setRequesting] = React.useState(false) ;
    const MyContext = React.useContext(AppContext);
    
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
            // 임시
            usedCameraButton: false
            
        })
        .then(res => {
           setCache(res);

           url = [] ;
           res.map( async ( file ) =>  {
               let newPath ;
               // ios
               if ( Platform.OS == 'ios' ) newPath = file.path.replace('file://','').replace('file:///','file://');
            //    if ( Platform.OS == 'ios' ) newPath = file.path ;
               // android
               else {
                if ( file.path.startsWith('content')) newPath = file.path ;
                else newPath = 'file://' + file.path ;
               } 
            //    const result = await ImageCompressor.compress(
            //     file.path,
            //     {
            //       quality: 1.0 ,
            //     })
            //     ;
               
            //    url.push(result);

               url.push(newPath);
           });
          
           setPictures(url);
           // Refresh Swiper
            //    setRefresh(true);
            //    setTimeout(()=>{
            //     setRefresh(false);
            //    },2000);

        }) 
        .catch(e => { });
       
    }
    
    removePictures = () =>  {
        Alert.alert('사진을 모두 지우시겠습니까?','',[
            {
                text: '취소'
            },
            {
                text: '확인' ,
                onPress: () => { setPictures(null); setCache([]); }
            }
            
        ])
    }

    uploadData = () =>  {
        if( pictures == null ) {
            Alert.alert('사진없음','사진을 올려주세요.')
            return;
        }
        if ( text.length > 500 ) {
            Alert.alert('글자 수','500자 안으로 해주세요.')
            return;
        }
        // 서버에게 전송
        setRequesting(true);

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
               
        API.post('/api/gallery',body,{
            headers : { 'content-type' : 'multipart/form-data' }
        })
        .then( res => {
            if ( res.data.statusCode == 201 ) {
                props.navigation.goBack();
                // refresh 'PostGalleryPage'
                MyContext.setRefresh(!MyContext.refresh)
            }
        })
        .catch( e => { 
            setRequesting(false) 
        });

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
        ref={ ref => this.scrollView = ref }
        style={{ backgroundColor: 'white' }}>
        <Portal>
            <Modal visible={requesting} style={{ alignItems: 'center' , justifyContent: 'center' , backgroundColor: 'transparent' }} >
                <LottieView style={{ width: 200, height: 100 }} source={require('./2.json')} autoPlay={true} loop={true}/>
            </Modal>
        </Portal>

            <Card style={ styles.Card }>
                <Card.Title 
                    titleStyle={ styles.title }
                    title= { props.route.params.name } 
                    left = { ()=>  <Avatar.Image style={{ backgroundColor: colors.main }} {...props} source = {{ uri: props.route.params.imageUrl }}size={24} />  }
                    // right = { (props) => <Button onPress={removePictures} color='red'>사진 지우기</Button>}
                />
            </Card>
            <Row>
                <OptionView onPress={ () => openNew() }>
                    <IconButton icon='image-plus' />
                </OptionView>
            </Row>
            {
                pictures != null && (
                    <SwiperView>
                    <Swiper horizontal={true} showsHorizontalScrollIndicator={true} loop={false}>
                        {
                            pictures.map((picture) =>{
                               return(
                                    <SwiperView>
                                        <Image resizeMode='contain' source={{ uri: picture }} style={{ flex: 1 }}/>
                                    </SwiperView>
                                )
                            })
                        }
                     </Swiper> 
                    </SwiperView> 
                )
            }
            
            
            <Row>
                <Title style={{ padding: 10 }}> 내용 </Title>
                <Title style={{ color: text.length > 500 ? 'red' : 'lightgray' , fontSize: 15 }}>( {text.length}/500 )</Title>
            </Row>
                <TextInput 
                    placeholder='내용을 입력하세요.'
                    onSubmitEditing={() => { this.scrollView.scrollToEnd() }} 
                    blurOnSubmit={true}
                    style={{ height: inputHeight , backgroundColor: 'white' , margin: 5 }}
                    value={text} 
                    onChangeText={value => setText(value) }
                    onContentSizeChange={e=>{
                        if ( e.nativeEvent.contentSize.height > inputHeight ) setInputHeight(inputHeight+50);
                    }}
                    multiline={true}/>
                <Button 
                    ref={ ref => { this.b = ref }}
                    style={{ height: 50 , justifyContent: 'center' , marginTop: 10 , marginBottom: 50 , marginLeft: 5 , marginRight: 5 }} 
                    theme={{ colors: { primary: colors.main } }}
                    labelStyle={{ fontWeight: 'bold' , color: 'white' }}
                    mode='contained'
                    onPress={() =>  { uploadData() }}
                    disabled={requesting}
                >
                    { requesting ? '등록중...' : '등록하기'}
                </Button>
        </KeyboardAwareScrollView>
        </Provider>
    );
}