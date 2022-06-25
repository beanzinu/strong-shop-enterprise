import React from 'react';
import { Appbar , Text , IconButton , Title, ActivityIndicator , Button , Provider , Modal , Portal , Divider , Badge } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Collapsible from 'react-native-collapsible';
import styled from 'styled-components';
import * as Progress from 'react-native-progress';
import { Dimensions , FlatList , SectionList, Image } from 'react-native';
import colors from '../../../color/colors';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import LottieView from 'lottie-react-native';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import { request , PERMISSIONS } from 'react-native-permissions';
import { Alert } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useIsFocused } from '@react-navigation/native';
import database from '@react-native-firebase/database';
// page
import BidList from '../BidPage/BidList';
// server
import API from '../../../server/API';
import commonStyles from '../../../components/commonStyles';
import customfun from '../../../components/customfun';
const SwiperView = styled.View`
    width: 100%;
    height: 700px;
`;
const RButton = styled.TouchableOpacity`
    width: 100%;
    height: 40px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 10px;
`;
const View = styled.View`
    flex: 1 ;
`;
const Row = styled.View`
    flex-direction: row ;
    align-items: center;
`;

const titles = [ {
    title : '시공 전' ,
    description: '시공 전 차량상태를 확인하세요.'
    } , 
    {
    title : '시공 진행' ,
    description : '시공진행 상황을 올려보세요.'
    } ,
    {
    title : '출고 대기' ,
    description : '고객님이 출고를 위해 방문할 예정이에요.'
    }
]

const state_number = {
    PRE_CONSTRUCTING: 1 ,
    CONSTRUCTING: 2 ,
    CONSTRUCTION_COMPLETED: 3
}

const care_state = {
    PRE_CONSTRUCTING: '시공 전' ,
    CONSTRUCTING: '시공 중' ,
    CONSTRUCTION_COMPLETED: '출고 대기'
}

export default function CarePage( props ){
    const [loading,setLoading] = React.useState(true);
    const [collapsed,setCollapsed] = React.useState(true);
    const [state,setState] = React.useState(1);
    const [detail,setDetail] = React.useState(null);
    // 스와이퍼 인덱스
    const [swiperIndex,setSwiperIndex] = React.useState(1);
    const [list1,setList1] = React.useState(false);
    const [list2,setList2] = React.useState(false);
    // 시공 전 사진
    const [pictures,setPictures] = React.useState([]);
    // 시공진행 사진
    const [currentPictures,setCurrentPictures] = React.useState([]);

    // 시공 전 사진 자세히보기
    const [visible,setVisible] = React.useState(false);
    const [index,setIndex] = React.useState(0);
    // 시공진행 사진 자세히보기
    const [currentVisible,setCurrentVisible] = React.useState(false);
    const [currentIndex,setCurrentIndex] = React.useState(0);
    // 사진 미리보기
    const [modalVisible,setModalVisible] = React.useState(false);
    const [refresh,setRefresh] = React.useState(false);
    const [newPictures,setNewPictures] = React.useState([]);

    const [newMsg,setNewMsg] = React.useState(0);
    const isFocused = useIsFocused();


    React.useEffect(() => {
        if ( isFocused) {
            database().ref(`chat${props.route.params.data.id}`).off();
            database().ref(`chat${props.route.params.data.id}`).once('value',snapshot => {
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
        
        setDetail( JSON.parse(props.route.params.data.detail) );

        
        setState( state_number[props.route.params.data.state] ,
            setSwiperIndex(state_number[props.route.params.data.state]-1) ,
        );

        // 시공 전 사진
        API.get(`/api/contract/care/3/${props.route.params.data.id}`)
        .then( res => {
            let tmp = res.data.data.imageUrlResponseDtos ;
            for( i in tmp ){
                tmp[i]["url"] = tmp[i].imageUrl ;
            }
            setPictures(tmp);
        })
        .catch( e => {
        })
        // 시공 중 사진
        API.get(`/api/contract/care/4/${props.route.params.data.id}`)
        .then( res => {
            let tmp = res.data.data.responseDtos ;
            for( i in tmp ){
                tmp[i]["url"] = tmp[i].imageUrl ;
            }
            setCurrentPictures(tmp);
        })
        .catch( e => {
        })

        setLoading(false);

        
    },[]);

    // 사진 추가하기
    const openNew = async () => {

        // 라이브러리 허용
        request(PERMISSIONS.IOS.PHOTO_LIBRARY);

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

    function uploadImage(images) {

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


            API.post(`/api/contract/care/${ state_number[props.route.params.data.state] == 1 ?'3':'4'}/${props.route.params.data.id}`,body,{
                headers: { 'content-type': 'multipart/form-data' }
            })
            .then(res => {
                if ( res.data.statusCode == 200 )
                {   
                    console.log(res.data.data);
                    if( state_number[props.route.params.data.state] == 1 ) setPictures(res.data.data.imageUrlResponseDtos);
                    else setCurrentPictures(res.data.data.responseDtos);

                    setRefresh(false);
                    setModalVisible(false);
                }
            })
            .catch( e => {
                Alert.alert('다시 시도해주세요.')
                setRefresh(false);
            })

    }

    function requestFinish(){
        title = state_number[props.route.params.data.state] == 1 ? '시공진행' : '시공완료'
        subtitle = state_number[props.route.params.data.state] == 1 ? '시공 전 사진들은 이후에도 확인 가능해요.' : '고객님에게 출고소식을 알릴게요.'
        Alert.alert(title,subtitle,[
            {
                text: '취소'
            } ,
            {
                text: '확인' ,
                onPress : () => {
                    // 시공 전
                    if( state_number[props.route.params.data.state] == 1 ) {
                        API.put(`/api/contract/care/3/${props.route.params.data.order_id}`)
                        .then( res => {
                            setState(state+1);
                        })
                        .catch( e => {
                            Alert.alert('다시 시도해주세요.');
                        })
                    }
                    // 시공 중
                    else {
                        API.put(`/api/contract/care/4`,{ id : props.route.params.data.id })
                        .then( res => {
                            setState(state+1);
                        })
                        .catch( e => {
                            Alert.alert('다시 시도해주세요.');
                        })
                    }
                }
            }
        ])

        
    }

    return(
        <Provider>
        <Appbar.Header style={{ backgroundColor: 'white' , height: 50 , elevation: 0  }}>
        <Appbar.BackAction  color='black' onPress={() => { props.navigation.goBack() }} />
        <Appbar.Content subtitle={detail?.carName} subtitleStyle={{ marginTop: 2 , fontSize: 13}} style={{ alignItems: 'center' }} title={`${props.route.params.data.userResponseDto.nickname} 고객님`} titleStyle={{ fontSize: 20 , fontWeight: 'bold' , marginTop: 3 }} />
        <Appbar.Action icon="chat" onPress={() => { props.navigation.navigate('ChatDetail',{ name :  props.route.params.data?.userResponseDto?.nickname , id : props.route.params.data.id , imageUrl : props.route.params.imageUrl }) }} style={{ backgroundColor: 'transparent' , margin: 0}} size={30}/>
        <Badge size={18} style={{ position: 'absolute' , right: 4 , top: 4 }}>{newMsg}</Badge>
        </Appbar.Header>
        {
            loading ? 
            <ActivityIndicator color={colors.main} size='large' style={{ marginTop: 50 }} /> 
            :
            <KeyboardAwareScrollView nestedScrollEnabled={true} style={{ backgroundColor: 'white' }}>

            <Portal>
            {/* 시공 전 사진 자세히보기 */}
            <Modal visible={visible} onDismiss={() => { setVisible(false) }} contentContainerStyle={{ width: '100%', height: '100%' , backgroundColor: 'black' , elevation: 3  }}>
            <ImageViewer 
                renderImage={ props =>
                <FastImage resizeMode={FastImage.resizeMode.contain}  source={{ uri : props.source.uri }} style={{ width: '100%' , height: '90%' }}/>
                } 
                imageUrls={pictures} enableSwipeDown={true} onCancel={ () => {setVisible(false)} } index={index} 
                enablePreload={true}
                renderHeader={() =><IconButton icon='close' style={{ alignSelf: 'flex-end'  }} color='white' onPress={ () => { setVisible(false) }} /> }
            />
            </Modal>
            {/* 시공 진행 사진 자세히보기 */}
            <Modal visible={currentVisible} onDismiss={() => { setCurrentVisible(false) }} contentContainerStyle={{ width: '100%', height: '100%' , backgroundColor: 'black' , elevation: 3  }}>
            <ImageViewer 
                renderImage={ props =>
                <FastImage resizeMode={FastImage.resizeMode.contain}  source={{ uri : props.source.uri }} style={{ width: '100%' , height: '90%' }}/>
                } 
                imageUrls={currentPictures} enableSwipeDown={true} onCancel={ () => {setCurrentVisible(false)} } index={currentIndex} 
                enablePreload={true}
                renderHeader={() =><IconButton icon='close' style={{ alignSelf: 'flex-end'  }} color='white' onPress={ () => { setCurrentVisible(false) }} /> }
            />
            </Modal>
            {/* 사진 추가하기 미리보기 */}
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
                                loop={false}
                            >
                                {
                                    newPictures != null &&
                                    newPictures.map(picture => {
                                        return(
                                            <SwiperView key={picture} style={{ width: '90%' , height: 300 , alignSelf: 'center' }} key={picture.id}>
                                                <FastImage resizeMode={FastImage.resizeMode.contain}  key={picture} source={{ uri: picture.path }} style={{ width: '100%' , height: '100%' }} />
                                            </SwiperView>
                                        )
                                    })
                                } 
                        </Swiper>
                        }
                        </SwiperView>
                        <Button style={{ alignSelf: 'center' , width: '80%' , marginTop: 20 }} mode='contained' color={colors.main}
                            disabled={refresh}
                            onPress={ () => { uploadImage(newPictures)  }}
                            labelStyle={{ color: 'white'}}
                        >
                            전송하기
                        </Button>
            </Modal>
            </Portal>

            <View style={{ ...commonStyles.view, marginTop: 20 }}>

                <Row style={commonStyles.titleRow}>
                    <Title style={{ fontFamily: 'Jua-Regular' }}>{titles[state-1].title}</Title>
                </Row>
                <Title style={{ marginBottom: 20 , marginTop: 10 , paddingLeft: 15 , color : 'gray' , fontSize: 17 , fontFamily: 'NotoSansKR-Medium' }}>    
                    {titles[state-1].description}             
                </Title> 
                {/* <Progress.Bar progress={state/3} width={ Dimensions.get('screen').width *0.9 } 
                        height={12}
                        color={colors.main}
                        unfilledColor='lightgray'
                        borderRadius={30}
                        style={{ alignSelf: 'center', borderWidth: 0 , margin: 10 }}
                    >
                </Progress.Bar> */}
                
                <Row style={{ width: '100%' }}>
                    
                    <View style={{ flex: 2 , alignItems: 'center' }}>
                        {
                            state == 1 ?
                            <Image resizeMode='contain' source={require('../../../resource/progress_2_on.png')}  style={{ width: 40 , height: 40   }} /> :
                            <Image resizeMode='contain' source={require('../../../resource/progress_2_off.png')}  style={{ width: 40 , height: 40  , overlayColor: 'red' }} />
                        }
                        <Text style={{ marginTop: 5 , fontSize: 13 , color: state ==1 ? colors.main : 'lightgray' }}>{'시공 전'}</Text>
                    </View>
                    <Divider style={{ borderWidth:2, borderColor: colors.main, flex: 0.2}}/>

                    <View style={{ flex: 2 , alignItems: 'center' }}>
                        {
                            state == 2 ?
                            <Image resizeMode='contain' source={require('../../../resource/progress_4_on.png')}  style={{ width: 40 , height: 40   }} /> :
                            <Image resizeMode='contain' source={require('../../../resource/progress_4_off.png')}  style={{ width: 40 , height: 40  , overlayColor: 'red' }} />
                        }
                        <Text style={{ marginTop: 5 , fontSize: 13 , color: state ==2 ? colors.main : 'lightgray' }}>{'시공 진행'}</Text>
                    </View>
                    <Divider style={{ borderWidth:2, borderColor: colors.main, flex: 0.2}}/>

                    <View style={{ flex: 2 , alignItems: 'center' }}>
                        {
                            state == 3 ?
                            <Image resizeMode='contain' source={require('../../../resource/progress_5_on.png')}  style={{ width: 40 , height: 40   }} /> :
                            <Image resizeMode='contain' source={require('../../../resource/progress_5_off.png')}  style={{ width: 40 , height: 40  , overlayColor: 'red' }} />
                        }
                        <Text style={{ marginTop: 5 , fontSize: 13 , color: state ==3 ? colors.main : 'lightgray' }}>{'출고 대기'}</Text>
                    </View>
                    
                </Row>
            </View>
            
            {/* 시공내역 */}
            <View style={{ ...commonStyles.view , marginTop: 20 }}>
            <RButton  onPress={() => { setCollapsed(!collapsed) }}>
                <Text style={{  fontSize: 15, color: collapsed? colors.main : 'lightgray' ,fontFamily: 'NotoSansKR-Medium'  }}>시공내역</Text>
                <IconButton style={{ right: 0 , position: 'absolute' }} icon='chevron-down' color={ collapsed? 'black' : 'lightgray' } />
            </RButton>
            {
                collapsed &&
                <Text style={{ alignSelf: 'center' , fontFamily: 'NotoSansKR-Medium' , marginTop: 20  }}>{customfun.countCareItems(JSON.parse(props.route.params.data.detail))}</Text>
            }
            <Collapsible collapsed={collapsed}>
                <BidList.Care_C item={JSON.parse(props.route.params.data.detail)} />   
            </Collapsible>
            </View>

            <Divider  style={{ height: 7 , marginBottom: 10 ,marginTop: 10 , backgroundColor: 'rgb(244,244,244)'  }} />

            <SwiperView>
            <Swiper scrollToOverflowEnabled={false} ref={ ref=> this.swiper = ref } index={swiperIndex} loop={false} showsPagination={false} >
            { 
                state >= 1 &&
                <SwiperView> 
                {
                    state >= 2 && 
                    <ItemButton style={{ alignSelf: 'flex-end' , marginBottom: 10 }}onPress={() => { this.swiper.scrollTo(1)  }}>
                    <Title style={{ color: 'gray' , fontSize: 17 }}>시공 진행</Title>
                    <IconButton color='gray' icon='chevron-right' />
                    </ItemButton> 
                }

                {
                        state == 1 &&
                        <Row style={{ justifyContent: 'flex-end' , alignItems: 'center' , marginBottom: 10 }}>
                            <Button style={{ padding: 3 , margin: 5 , borderRadius: 10, elevation: 0  }}
                                onPress={openNew}
                                mode='contained'
                                color={colors.main}
                                labelStyle={{ color: colors.submain, fontFamily: 'NotoSansKR-Medium', fontWeight: 'bold' }}
                                icon='image'
                            >
                                {'추가하기'}
                            </Button>
                            <Button style={{ padding: 3 , margin: 5 ,  borderRadius: 10, elevation: 0  }}
                                onPress={requestFinish}
                                mode='contained'
                                color={colors.main}
                                labelStyle={{ color: colors.submain, fontFamily: 'NotoSansKR-Medium' }}
                                icon='check'
                            >
                                {'확인완료'}
                            </Button>
                        </Row>
                }
                <FlatList 
                    style={{ width: '100%' , alignSelf: 'center' , marginBottom: 20 }}
                    scrollEnabled={false}
                    data={pictures}
                    renderItem={BeforeItem} 
                    numColumns={3}
                    keyExtractor={ item => item.id }
                />
                {/* </Collapsible> */}
                </SwiperView>
            }
            {
                state >= 2 &&
                <SwiperView>

                <Row style={{ alignItems: 'center' , height: 60 , width: '100%' }}>
                <ItemButton style={{ flex:1 }} onPress={() => {  this.swiper.scrollTo(0)  }}>
                    <IconButton color='gray' icon='chevron-left' />
                    <Title style={{ color: 'gray' , fontSize: 17 }}>시공 전</Title>
                </ItemButton>
                {
                    state == 3 &&    
                    <ItemButton style={{ flex:1 , justifyContent: 'flex-end' }}  onPress={() => {  this.swiper.scrollTo(2)  }}>
                        <Title style={{ color: 'gray' , fontSize: 17 }}>출고 대기</Title>
                        <IconButton color='gray' icon='chevron-right' />
                    </ItemButton>    
                }
                </Row>
                
                {/* <ItemButton onPress={() => { setList2(!list2) }}>
                    <IconButton icon='play' color={state == 2 ? 'black' : 'lightgray'}/>
                    <Title style={{ fontSize: 17 , fontWeight: 'bold' , color : state == 2 ? 'black' : 'lightgray' }}>
                        시공 진행
                    </Title>
                    <IconButton icon='chevron-down' color={ state == 2 ? 'black' : 'lightgray' } />
                </ItemButton>
                <Collapsible collapsed={list2}> */}
                {
                        state == 2 &&
                        <Row style={{ justifyContent: 'flex-end' , alignItems: 'center' }}>
                            <Button style={{ padding: 3 , margin: 5 , borderRadius: 10, elevation: 0  }}
                                onPress={openNew}
                                mode='contained'
                                color={colors.main}
                                labelStyle={{ color: colors.submain, fontFamily: 'NotoSansKR-Medium' }}
                                icon='image'
                            >
                                {'추가하기'}
                            </Button>
                            <Button style={{ padding: 3 , margin: 5 ,  borderRadius: 10, elevation: 0  }}
                                onPress={requestFinish}
                                mode='contained'
                                color={colors.main}
                                labelStyle={{ color: colors.submain, fontFamily: 'NotoSansKR-Medium' }}
                                icon='check'
                            >
                                {'시공완료'}
                            </Button>
                        </Row>
                }
                <FlatList 
                    style={{ width: '100%' , alignSelf: 'center' , marginBottom: 20 }}
                    scrollEnabled={false}
                    data={currentPictures}
                    renderItem={CurrentItem} 
                    numColumns={3}
                    keyExtractor={ item => item.id }
                />
                {/* </Collapsible> */}
                </SwiperView>
            }
            {
                state == 3 && 
                <SwiperView>
                    {
                    state == 3 && 
                    <ItemButton onPress={() => {  this.swiper.scrollTo(1)  }}>
                    <IconButton color='gray' icon='chevron-left' />
                    <Title style={{ color: 'gray' , fontSize: 17 }}>시공 진행</Title>
                    </ItemButton>  
                    }
                    <LottieView source={require('./1.json')} autoPlay={true} loop={true} style={{  width: '100%' }} />
                </SwiperView>
            }
            </Swiper>
            </SwiperView>
            

            </KeyboardAwareScrollView>
        }
        </Provider>
    );

    // 시공 전
    function BeforeItem({ item }){
        return (
            <ImageView onPress={() => { setIndex( findIndex(item.id) ) , setVisible(true) }}>
            <FastImage source={{ uri: item.imageUrl }} style={{ width: '100%' , height: '100%' }} />
            </ImageView>
        );
    }
    // 시공 진행
    function CurrentItem({ item }){
        return (
            <ImageView onPress={() => { setCurrentIndex( findCurrentIndex(item.id) ) , setCurrentVisible(true) }}>
                <FastImage source={{ uri: item.imageUrl }} style={{ width: '100%' , height: '100%' }} />
            </ImageView>
        );
    }

    function findIndex(id){
        for( i in pictures ){
            if( pictures[i].id == id ) return Number(i);
        }
    }
    function findCurrentIndex(id){
        for( i in currentPictures ){
            if( currentPictures[i].id == id ) return Number(i);
        }
    }

}

const test =[{ id : 1 },{ id : 2 },{ id : 3 },{ id : 4 },{ id : 5 }, { id : 6 } ]

const ItemButton = styled.TouchableOpacity`
    margin-left: 5px;
    /* padding-left: 10px; */
    margin-bottom: 5px;
    flex-direction: row;
    align-items: center;
`;

const ImageView = styled.TouchableOpacity`
    width: 33%;
    height: 100px;
    margin: 1px;
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