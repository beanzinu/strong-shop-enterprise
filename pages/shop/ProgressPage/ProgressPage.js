import React from 'react';
import styled from 'styled-components';
import { Title  , ProgressBar, Avatar , Appbar , List , Badge , Button , IconButton , Modal , Portal , Provider , FAB , Divider , Text }  
from 'react-native-paper';
import { Alert, Dimensions, FlatList , ScrollView , SectionList } from 'react-native';
import colors from '../../../color/colors';
import _ from 'lodash';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import { request , PERMISSIONS } from 'react-native-permissions';
import Swiper  from 'react-native-swiper';
import ImageViewer from 'react-native-image-zoom-viewer';
import Collapsible from 'react-native-collapsible';
import database from '@react-native-firebase/database';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LottieView from 'lottie-react-native';
import fetch from '../../../storage/fetch';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import server from '../../../server/server';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
// components
import BidList from '../BidPage/BidList';
// server
import API from '../../../server/API';
// analytics
import analytics from '@react-native-firebase/analytics'

export default function( props ) {
    const [data,setData] = React.useState(null) ;
    const [collapsed,setCollapsed] = React.useState(true);
    const [listEnabled,setListEnabled] = React.useState(false);
    const [item,setItem] = React.useState([]);
    // 현재단계
    const[state,setState] = React.useState(1);
    // 현재 사진들
    const[pictures,setPictures] = React.useState(null);
    // 업로드할 사진들 
    const[newPictures,setNewPictures] = React.useState(null);

    const[refresh,setRefresh] = React.useState(false);
    // Modal
    const[visible,setVisible] = React.useState(false);
    // UploadModal
    const [modalVisible,setModalVisible] = React.useState(false);

    const [loadRefresh,setLoadRefresh] = React.useState(false);

    const [index,setIndex] = React.useState(0);

    const [newMsg,setNewMsg] = React.useState(0);
    const isFocused = useIsFocused();


    React.useEffect(() => {
        if ( isFocused) {
            database().ref(`chat${props.route.params.id}`).off();
            database().ref(`chat${props.route.params.id}`).once('value',snapshot => {
                var count = 0 ; 
                if ( snapshot.toJSON() != null ) {
                obj = Object.values( snapshot.toJSON() ) ;
                obj.map( msg => {
                    if ( msg.user._id == 2 && msg.received != true ) count = count + 1 ; 
                }) ;
                setNewMsg(count);
                }
                
            
            }) // db
        }
    }, [ isFocused ] ) ;

    React.useEffect(() => {

        // Google Analytics
        analytics().logScreenView({
            screen_class: 'Contract' ,
            screen_name: 'Progress'
        })

        setItem( JSON.parse( props.route.params.data.detail )) ;

        setData( props.route.params.data) ;
        // 서버로부터 받은 현재 시공단계
        setState(states[props.route.params.data.state]);

    },[]);

    React.useEffect(() => {
        
        if ( states[props.route.params.data.state]== 2 ||  states[props.route.params.data.state] == 4 )
            requestImage();
    },[loadRefresh]);

    // 사진 추가하기
    const openNew = async () => {

        // 라이브러리 허용
        request(PERMISSIONS.IOS.PHOTO_LIBRARY);

        // 

        await MultipleImagePicker.openPicker({
            mediaType: 'image',
            // selectedAssets: pictures,
            doneTitle: "완료",
            maxSelectedAssets: 5 ,
            maximumMessageTitle: '최대 5장까지만 등록해주세요.' ,
            maximumMessage: '' ,
            selectedColor: "#162741",
            tapHereToChange: '여기를 눌러 변경' ,
            cancelTitle: '취소' ,
            numberOfColumn: 3 ,
            // 임시
            usedCameraButton: false
        })
        .then(res => {
            
        
           url = [] ;
           res.map((file,index) =>  {
                let newPath ;
                // ios
                if ( Platform.OS == 'ios' ) newPath = file.path.replace('file://','').replace('file:///','file://');
                // android
                else {
                    if ( file.path.startsWith('content')) newPath = file.path ;
                    else newPath = 'file://' + file.path ;
                }

               url.push({
                   path: newPath ,
                   id: index 
               });
           });
          
           setNewPictures(url);
           
           setModalVisible(true);
         

        }) 
        .catch(e => { 

        });
       
    }

    // 새로운 사진 추가
    function requestUploadImage(images) {
        // 폼데이터 생성
        var body = new FormData();
        // 현재 사용자가 불러온 이미지 리스트들 => 각각 폼데이터에 넣어준다.
        images?.map( (picture,index) =>{
            var photo = {
                uri: picture.path ,
                type: 'multipart/form-data',
                name: `${index}.jpg` ,
                
            }
            body.append('files',photo);
        })
        setRefresh(true);

        API.post(`/api/contract/${state ==2 ?'4':'6'}/${data.id}`,body,{
            headers: { 'content-type': 'multipart/form-data' }
        })
        .then(res => {
            if ( res.data.statusCode == 200 )
            {
                setLoadRefresh(!loadRefresh);
                setRefresh(false);
                setModalVisible(false);
            }
        })
        .catch( e => {
            Alert.alert('다시 시도해주세요.')
            setRefresh(false);
        })

    }

    // 서버로부터 이미지 불러오기
    function requestImage() {
        API.get(`/api/contract/${states[props.route.params.data.state] ==2 ?'4':'6'}/${props.route.params.data.id}`)
        .then(res => {
            let tmp = [] ;
            if ( states[props.route.params.data.state] == 2 )
                res.data.data.imageUrlResponseDtos.map( (picture,id) => {
                    tmp.push({ url : picture.imageUrl , id : id });
                })
            else if ( states[props.route.params.data.state] == 4 )
                res.data.data.responseDtos.map( (picture,id) => {
                    tmp.push({ url : picture.imageUrl , id : id });
                })
            setPictures(tmp);
                //refresh
                // setRefresh(true);
                // setRefresh(false);
        })
        .catch(e=>{
            // console.log(e.response.status);
        })   
    }


    // 검수완료 알림창
    function requestExamFin(){
        Alert.alert('검수완료','고객님이 최종 인수결정을 내리게됩니다.',[
            {
                text: '확인' ,
                onPress: () => { requestExamFinServer() }
            },
            {
                text: '취소'
            }
        ])
    }
    // 검수완료 (서버)
    function requestExamFinServer(){

        API.put('/api/contract/4',{ id : data.id })
        .then( res => {
            // console.log('검수완료 : ' , res ) ;
            // 성공
            if ( res.data.statusCode == 200)
                setState(3);
        })
        .catch( e => { 
            //
        });
    }
    //시공완료 알림
    function requestConstructFin(){
        Alert.alert('시공완료','고객님에게 출고소식을 알릴게요.',[
            {
                text: '확인' ,
                onPress: () => { requestConstructFinServer() }
            },
            {
                text: '취소'
            }
        ])
    }
    // 시공완료 (서버)
    function requestConstructFinServer(){
        API.put('/api/contract/6',{ id : data.id })
        .then( res => {
            // 성공
            if ( res.data.statusCode == 200)
                setState(5);
        })
        .catch( e => { 
            //
        });
    }


    const RenderItem = ({item}) =>  {
        return(
            <CButton key={item} onPress={ () =>  { setIndex(item.id) ; setVisible(true) }}>
                <FastImage resizeMode={FastImage.resizeMode.cover}  key={item.url} source={{ uri : item.url }} style={{ width: '100%' , height: '100%' }}/>
            </CButton>
        )
    }

    return(
        <Provider>
        {/* 사진 상세보기 */}
        <Portal>
        <Modal visible={visible} onDismiss={() => { setVisible(false) }} contentContainerStyle={{ width: '100%', height: '100%' , backgroundColor: 'black' , elevation: 3  }}>
            {/* <IconButton icon='close' style={{   }} color='white' onPress={ () => { setVisible(false) }} /> */}
            <ImageViewer 
                renderImage={ props =>
                <FastImage resizeMode={FastImage.resizeMode.cover}  source={{ uri : props.source.uri }} style={{ width: '100%' , height: '100%' }}/>
            } 
                imageUrls={pictures} enableSwipeDown={true} onCancel={ () => {setVisible(false)} } index={index} 
                enablePreload={true}
                renderHeader={() =><IconButton icon='close' style={{ alignSelf: 'flex-end'  }} color='white' onPress={ () => { setVisible(false) }} /> }
            />
        </Modal>
        <Modal visible={modalVisible} onDismiss={() => { setModalVisible(false); setRefresh(false); }} contentContainerStyle={{ width: '100%', height: '100%' , backgroundColor: 'transparent' }}>
            {
                !refresh &&
                <IconButton icon='close' style={{ alignSelf: 'flex-end'}} color='white' onPress={ () => { setModalVisible(false);  setRefresh(false); }} />
            }
            <SwiperView style={{ width: '90%' , height: 300 , alignSelf: 'center' }}>
            {
                refresh ? 
                <LottieView source={require('../Register/2.json')} autoPlay={true} loop={true} /> 
                :

            <Swiper 
            horizontal={true}
            // index={index}
            loop={false}
            // prevButton={<IconButton icon='chevron-left' color={'gray'}/>}
            // nextButton={<IconButton icon='chevron-right' color={'gray'}/>}
            >
                    {
                        newPictures != null &&
                        newPictures.map(picture => {
                            return(
                                <SwiperView key={picture} style={{ width: '90%' , height: 300 , alignSelf: 'center' }} key={picture.id}>
                                    <FastImage resizeMode={FastImage.resizeMode.cover}  key={picture} source={{ uri: picture.path }} style={{ width: '100%' , height: '100%' }} />
                                </SwiperView>
                            )
                        })
                    } 
            </Swiper>
            }
            </SwiperView>
            <Button style={{ alignSelf: 'center' , width: '80%' , marginTop: 20 }} mode='contained' color={colors.main}
                disabled={refresh}
                onPress={ () => { requestUploadImage(newPictures) }}
                labelStyle={{ color: 'white'}}
            >
                전송하기
            </Button>
        </Modal>
        </Portal>

        <>
            <Appbar.Header style={{ backgroundColor: 'white' , height: 50 , elevation: 0  }}>
            <Appbar.BackAction  color='black' onPress={() => { props.navigation.goBack() }} />
            <Appbar.Content style={{ alignItems: 'center' }} title={`${data?.userResponseDto?.nickname} 고객님`} titleStyle={{ fontSize: 20 , fontWeight: 'bold' }} />
            {/* <Appbar.Content style={{  position: 'absolute' , right: 0 }} title={'시공내역'} titleStyle={{  fontSize: 15 , right: 2 , color: collapsed ? 'black' : 'gray' }} onPress={ () =>  { setCollapsed(!collapsed) }} /> */}
            <Appbar.Action icon="chat" onPress={() => { props.navigation.navigate('ChatDetail',{ name : data?.userResponseDto?.nickname , id : props.route.params.data.id , imageUrl : props.route.params.imageUrl }) }} style={{ backgroundColor: 'transparent' , margin: 0}} size={30}/>
            <Badge size={18} style={{ position: 'absolute' , right: 4 , top: 4 }}>{newMsg}</Badge>
            </Appbar.Header>

            <KeyboardAwareScrollView
                style={{ backgroundColor: 'white' }} 
                ref={ ref => {this.scrollView = ref}}
                nestedScrollEnabled={true}
                // onMomentumScrollEnd={
                //     (event) => { 
                //         if (event.nativeEvent.contentOffset.y > 0 ) setListEnabled(true);
                // }}
            >
            
            <Title style={styles.title}>시공 진행상황</Title>
            <Title style={{ marginLeft: 10 , paddingLeft: 10 , color : 'gray' , marginBottom : 20 , fontSize: 17 }}>    
            {(state == 1 ? TEXT.first : state == 2 ? TEXT.second : state == 3 ? TEXT.third : state == 4? TEXT.fourth : TEXT.fifth ) 
            }                    
            </Title> 
            <Progress.Bar progress={state/5} width={ Dimensions.get('screen').width *0.9 } 
                height={12}
                color={colors.main}
                unfilledColor='lightgray'
                borderRadius={30}
                style={{ alignSelf: 'center', borderWidth: 0 , margin: 10 }}
            >
            </Progress.Bar>
                <Row style={{ width: Dimensions.get('screen').width *0.95 }}>
                <View style={{ flex: 1 , alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 12 , color: state >=1 ? colors.main : 'lightgray' }}>출고지 지정</Text>
                </View>
                <View style={{ flex: 1 , alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12 , color: state >=2 ? colors.main : 'lightgray'  }}>신차검수</Text>
                </View>
                <View style={{ flex: 1 , alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12 , color: state >=3 ? colors.main : 'lightgray'   }}>검수완료</Text>
                </View>
                <View style={{ flex: 1 , alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12 , color: state >=4 ? colors.main : 'lightgray'   }}>시공진행</Text>
                </View>
                <View style={{ flex: 1 , alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12 , color: state >=5 ? colors.main : 'lightgray'  }}>출고대기</Text>
                </View>
                </Row>

            <Divider  style={{ height: 7 , marginTop: 10 , backgroundColor: 'rgb(244,244,244)'  }} />


            {/* 시공내역 */}
            <RButton  onPress={() => { setCollapsed(!collapsed) }}>
                <Text style={{ marginLeft: 10 , paddingLeft: 10 , fontSize: 17, color: collapsed? 'black' : 'lightgray' }}>시공내역</Text>
                <IconButton style={{ right: 0 , position: 'absolute' }} icon='chevron-down' color={ collapsed? 'black' : 'lightgray' } />
            </RButton>
            <Collapsible collapsed={collapsed} style={{ borderWidth: 1 , borderColor: 'lightgray'  }}>
                <BidList.C item={item} />   
            </Collapsible>

            <Divider  style={{ height: 7 , marginBottom: 20 , backgroundColor: 'rgb(244,244,244)'  }} />
            
            {/* <SwiperView>
            <Swiper horizontal={true} index={state-1}
                loop={false}
                // showsButtons={true}
                showsHorizontalScrollIndicator={true}
                scrollEnabled={false}
                showsPagination={false}
                // prevButton={<IconButton icon='chevron-left' color={'gray'}/>}
                // nextButton={<IconButton icon='chevron-right' color={'gray'}/>}
                // overScrollMode='auto'
                // renderPagination = { (index,total) => <Title style={{ alignSelf: 'center'}}>{ index+1}/{total}</Title>}

            > */}
            {
                progress.map(item => {
                    return (
                            // <SwiperView>
                            <>
                                {
                                    item.value == 1 && state == 1 && (
                                        <>
                                        <Title style={{ marginLeft: 10 , padding: 10 , color : 'gray' , marginBottom : 10 , fontWeight: 'bold' }}>
                                            주소: {props.route.params.data.shipmentLocation}
                                        </Title>
                                        <CView style={{  alignItems: 'center', justifyContent: 'center' ,  height: 300 }}>
                                            <LottieView source={require('./1.json')} autoPlay={true} loop={true} style={{  width: '100%' }} />
                                        </CView>
                                        </>
                                    ) 
                                }
                                {
                                    ( item.value == 3 || item.value == 5 ) && state == item.value && (
                                        <CView style={{  alignItems: 'center', justifyContent: 'center' ,  height: 300 }}>
                                            <LottieView source={require('./1.json')} autoPlay={true} loop={true} style={{  width: '100%' }} />
                                        </CView>
                                    )
                                }
                                {
                                    (item.value ==2 || item.value == 4) && item.value == state && (
                                    <>
                                    <Row style={{ justifyContent: 'flex-end' , marginBottom: 5 }}>
                                    <Button style={{ alignSelf: 'flex-end' , padding: 3 , margin: 5 ,  borderRadius: 10  }}
                                        onPress={ () => { openNew() } }
                                        mode='contained'
                                        color={colors.main}
                                        labelStyle={{ color: 'white'}}
                                        icon='image'
                                    >
                                        {'추가하기'}
                                    </Button>
                                    <Button style={{ alignSelf: 'flex-end' , padding: 3 , margin: 5 , borderRadius: 10  }}
                                        onPress={ () => { state == 2 ? requestExamFin() : requestConstructFin() } }
                                        mode='contained'
                                        color={colors.main}
                                        labelStyle={{ color: 'white'}}
                                        icon='check'
                                    >
                                        {state == 2 ? '검수완료' : '시공완료' }
                                    </Button>
                                    </Row>
                                    <FlatList
                                        scrollEnabled={false}
                                        nestedScrollEnabled={true}
                                        ref={ ref => this.flatList = ref }
                                        onMomentumScrollEnd={(event)=>{
                                            if ( event.nativeEvent.contentOffset.y < 5 ) {
                                                this.scrollView.scrollToPosition(0,0) ;
                                                setListEnabled(false);
                                            }  
                                        }}
                                        // onScrollEndDrag={(event) => { 
                                        //     if ( event.nativeEvent.contentOffset.y < 5 ) {
                                        //         this.scrollView.scrollToPosition(0,0) ;
                                        //         setListEnabled(false);
                                        //     }  
                                        // }}
                                        style={{ width: '100%', alignSelf: 'center' , marginBottom: 40 }}
                                        data={pictures}
                                        renderItem={RenderItem}
                                        numColumns={3}
                                        keyExtractor={item => item.id }
                                    />
                                    </>
                                )
                                }
                                </>
                            // </SwiperView>
                    )
                })
            }
            {/* </Swiper>
            </SwiperView> */}
            </KeyboardAwareScrollView>
        </>
        </Provider>
    );
}

const Container = styled.SafeAreaView``;
const CView = styled.View``;
const View = styled.View`
    flex: 1 ;
`;
const Row = styled.View`
    flex-direction: row ;
    align-items: center;
`;
const CButton = styled.TouchableOpacity`
    width: 33.3%;
    height: 120px;
    border: 1.5px white;
`;
const RButton = styled.TouchableOpacity`
    width: 100%;
    height: 50px;
    flex-direction: row;
    align-items: center;
`;
const SwiperView = styled.View`
    width: 100%;
    height: 700px;
`;

const styles = {
    title : {
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 28 ,
        paddingLeft: 20 ,
        paddingTop: 15 
    } ,
    progress : {
      height: 5
    },
    icon : {
        backgroundColor: 'transparent'

    } ,
    text : {
        fontSize: 17 ,
        fontWeight: 'bold'
    }
}

// 산차 검수 데이터
DATA = [
    {
    uri : 'https://picsum.photos/0'
    } ,
    {
    uri : 'https://picsum.photos/0'
    } ,
    {
    uri : 'https://picsum.photos/0'
    } ,
]

const TEXT = {
    first : '고객님이 출고지를 지정중이에요.' ,
    second : '신차검수 현황을 올려보세요.' ,
    third : '고객님이 인수여부를 결정중이에요.' ,
    fourth : '시공진행 상황을 올려보세요.' ,
    fifth : '고객님이 출고를 위해 방문할 예정이에요.'
}

// 진행 상황 
const progress = [
    {
        title : '차량 탁송지 지정' ,
        value : 1 ,
    } ,
    {
        title : '신차검수' ,
        value : 2 ,
    } ,
    {
        title : '검수완료' ,
        value : 3 ,
    } ,
    {
        title : '시공진행' ,
        value : 4 ,
    } ,
    {
        title : '시공완료/출고' ,
        value : 5 ,
    } ,
]

const states = {
    DESIGNATING_SHIPMENT_LOCATION : 1 ,
    CAR_EXAMINATION : 2 ,
    CAR_EXAMINATION_FIN : 3 ,
    CONSTRUCTING : 4 ,
    CONSTRUCTION_COMPLETED : 5
}