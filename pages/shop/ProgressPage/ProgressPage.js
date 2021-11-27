import React from 'react';
import styled from 'styled-components';
import { Title  , ProgressBar, Avatar , Appbar , List , Badge , Button , IconButton , Modal , Portal , Provider , FAB , Divider , Text }  
from 'react-native-paper';
import { Alert, FlatList , ScrollView } from 'react-native';
import colors from '../../../color/colors';
import { Image } from 'react-native';
import _, { set } from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import { request , PERMISSIONS } from 'react-native-permissions';
import Swiper  from 'react-native-swiper';
import { Dimensions } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Collapsible from 'react-native-collapsible';
import database from '@react-native-firebase/database';
import LottieView from 'lottie-react-native';
import fetch from '../../../storage/fetch';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import server from '../../../server/server';
import FastImage from 'react-native-fast-image';


const Container = styled.SafeAreaView``;
const View = styled.View``;
const Row = styled.View`
    flex-direction: row ;
    align-items: center;
`;
const CButton = styled.TouchableOpacity`
    width: 30%;
    height: 100px;
`;
const SwiperView = styled.View`
    width: 100%;
    height: 500px;
`;

const styles = {
    title : {
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30 ,
        padding: 20
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


export default function( props ) {
    const [data,setData] = React.useState(null) ;
    const [collapsed,setCollapsed] = React.useState(true);
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
    openNew = async () => {

        // 라이브러리 허용
        request(PERMISSIONS.IOS.PHOTO_LIBRARY);

        // 
        await MultipleImagePicker.openPicker({
            mediaType: 'image',
            // selectedAssets: pictures,
            doneTitle: "완료",
            selectedColor: "#162741",
            tapHereToChange: '여기를 눌러 변경' ,
            cancelTitle: '취소'
        })
        .then(res => {
           url = [] ;
           res.map((file,index) =>  {
                let newPath ;
                // ios
                if ( Platform.OS == 'ios' ) newPath = file.path.replace('file://','').replace('file:///','file://');
                // android
                else newPath = 'file://' + file.path ;

               url.push({
                   path: newPath ,
                   id: index 
               });
           });
          
           setNewPictures(url);
           
           setModalVisible(true);
         

        }) 
        .catch(e => { });
       
    }

    // 새로운 사진 추가
    async function requestUploadImage(images) {

        const token = await fetch('auth');
        const auth = token.auth;
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
        axios.post(`${server.url}/api/contract/${state ==2 ?'4':'6'}/${data.id}`,body,{
            headers: {'content-type': 'multipart/form-data' , Auth: auth }
        })
        .then(res => {
            if ( res.data.statusCode == 200 )
            {
                setLoadRefresh(!loadRefresh);
                setRefresh(false);
                setModalVisible(false);
            }
        })
        .catch(e=>{
            Alert.alert('다시 시도해주세요.')
            setRefresh(false);
            // console.log(e);
        })

    }

    // 서버로부터 이미지 불러오기
    function requestImage() {

        fetch('auth')
        .then(res => {
            const auth = res.auth ;
            axios({
                method: 'GET' ,
                url: `${server.url}/api/contract/${states[props.route.params.data.state] ==2 ?'4':'6'}/${props.route.params.data.id}` ,
                headers : { Auth: auth }
            })
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
        })
        .catch(e => {

        })
    }


    // 검수완료
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
    //
    async function requestExamFinServer(){
        const token = await fetch('auth') ;
        const auth = token.auth ;
        axios({
            method: 'put' ,
            url: `${server.url}/api/contract/4` ,
            headers: { Auth: auth } ,
            data: { id : data.id } 
        })
        .then( res => {
            // console.log('검수완료 : ' , res ) ;
            // 성공
            if ( res.data.statusCode == 200)
                setState(3);
        })
        .catch( e => { 

        });
    }

    //시공완료

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
    async function requestConstructFinServer(){
        const token = await fetch('auth') ;
        const auth = token.auth ;
        axios({
            method: 'put' ,
            url: `${server.url}/api/contract/6` ,
            headers: { Auth: auth } ,
            data: { id : data.id } 
        })
        .then( res => {
            // 성공
            if ( res.data.statusCode == 200)
                setState(5);
        })
        .catch( e => { 

        });
    }
    

    const RenderItem = ({item}) =>  {
        return(
            <CButton onPress={ () =>  { setIndex(item.id) ; setVisible(true) }}>
                <FastImage source={{ uri : item.url }} style={{ width: '100%' , height: '100%' }}/>
            </CButton>
        )
    }

    return(
        <Provider>
        {/* 사진 상세보기 */}
        <Portal>
        <Modal visible={visible} onDismiss={() => { setVisible(false) }} contentContainerStyle={{ width: '100%', height: '100%' , backgroundColor: 'black' }}>
            {/* <IconButton icon='close' style={{   }} color='white' onPress={ () => { setVisible(false) }} /> */}
            <ImageViewer imageUrls={pictures} enableSwipeDown={true} onCancel={ () => {setVisible(false)} } index={index} 
                enablePreload={true}
                renderHeader={() =><IconButton icon='close' style={{   }} color='white' onPress={ () => { setVisible(false) }} /> }
            />
            {/* <SwiperView>
            <Swiper 
                horizontal={true}
                index={index}
                loop={false}
                // prevButton={<IconButton icon='chevron-left' color={'gray'}/>}
                // nextButton={<IconButton icon='chevron-right' color={'gray'}/>}
            >
                    {
                        pictures != null &&
                        pictures.map(picture => {
                            return(
                                <SwiperView key={picture.id}>
                                    <FastImage source={{ uri: picture.path }} style={{ width: '100%' , height: '100%' }} />
                                </SwiperView>
                            )
                        })
                    } 
            </Swiper>
            </SwiperView> */}
        </Modal>
        <Modal visible={modalVisible} onDismiss={() => { setModalVisible(false); setRefresh(false); }} contentContainerStyle={{ width: '100%', height: '100%' , backgroundColor: 'transparent' }}>
            {
                !refresh &&
                <IconButton icon='close' style={{ alignSelf: 'flex-end'}} color='white' onPress={ () => { setModalVisible(false);  setRefresh(false); }} />
            }
            <SwiperView style={{ width: '90%' , height: 300 , alignSelf: 'center' }}>
            {
                refresh ? 
                <LottieView source={require('../Register/2.json')} autoPlay={true} loop={true} /> :

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
                                <SwiperView style={{ width: '90%' , height: 300 , alignSelf: 'center' }} key={picture.id}>
                                    <FastImage source={{ uri: picture.path }} style={{ width: '100%' , height: '100%' }} />
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
            >
                전송하기
            </Button>
        </Modal>
        </Portal>

        <>
            <Appbar.Header style={{ backgroundColor: colors.main , height: 50 }}>
            <Appbar.BackAction color='white' onPress={() => { props.navigation.goBack() }} />
            <Appbar.Content title={`${data?.userResponseDto?.nickname} 고객님`} titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 24}} />
            <Appbar.Content style={{  position: 'absolute' , right: 0 }} title={'시공내역'} titleStyle={{  fontSize: 15 , right: 2 , color: collapsed ? 'white' : 'gray' }} onPress={ () =>  { setCollapsed(!collapsed) }} />
            {/* <View>
                <Appbar.Action icon="chat" onPress={() => { props.navigation.navigate('ChatDetail',{ name : data?.userResponseDto?.nickname , id : props.route.params.data.id , imageUrl : props.route.params.imageUrl }) }} color='white' style={{ backgroundColor: 'transparent' , margin: 0}} size={25}/>
                <Badge size={10} style={{ position: 'absolute' , right: 0 , top: 0 }}/>
            </View> */}
            </Appbar.Header>  
            <ProgressBar style={styles.progress} progress={state/5} color='red'  
                theme = {{ animation : { scale : 5 }  }}
            />
            <Collapsible collapsed={collapsed} style={{ borderWidth: 1 , borderColor: 'lightgray' }}>
            {
                                        item.tinting != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.tinting} right={ props => <Text style={styles.itemText}>{item.tintingPrice}{'만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.ppf != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.ppf} right={props => <Text style={styles.itemText}>{item.ppfPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.blackbox != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.blackbox} right={props => <Text style={styles.itemText}>{item.blackboxPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.battery != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.battery} right={props => <Text style={styles.itemText}>{item.batteryPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.afterblow != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.afterblow} right={props => <Text style={styles.itemText}>{item.afterblowPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.soundproof != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.soundproof} right={props => <Text style={styles.itemText}>{item.soundproofPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.wrapping != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.wrapping} right={props => <Text style={styles.itemText}>{item.wrappingPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.glasscoating != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.glasscoating} right={props => <Text style={styles.itemText}>{item.glasscoatingPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.undercoating != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='언더코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.undercoating} right={props => <Text style={styles.itemText}>{item.undercoatingPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    <Divider style={{ margin: 10 }} />
                                    <List.Item titleStyle={styles.listStyle} title ='최종가격: ' right={props => <Text style={styles.itemText}>{item.totalPrice}{' 만원'}</Text>}/>
            </Collapsible>
            <Title style={styles.title}>시공 진행상황</Title>
            
            <SwiperView>
            <Swiper horizontal={true} index={state-1}
                loop={false}
                showsButtons={true}
                showsHorizontalScrollIndicator={true}
                showsPagination={false}
                prevButton={<IconButton icon='chevron-left' color={'gray'}/>}
                nextButton={<IconButton icon='chevron-right' color={'gray'}/>}
                // overScrollMode='auto'
                // renderPagination = { (index,total) => <Title style={{ alignSelf: 'center'}}>{ index+1}/{total}</Title>}

            >
            {
                progress.map(item => {
                    return (
                        
                        
                            <SwiperView>
                                <Title style={{ marginLeft: 10 , paddingLeft: 10 , color : state == item.value ? 'red' : state > item.value ? 'black' : 'gray' }}>
                                {item.value}{'단계: '}{item.title}
                                </Title>
                                <Title style={{ marginLeft: 10 , paddingLeft: 10 , color : 'gray' , marginBottom : 20 , fontSize: 17 }}>
                                    {
                                        item.value == state ? 
                                        (state == 1 ? TEXT.first : state == 2 ? TEXT.second : state == 3 ? TEXT.third : state == 4? TEXT.fourth : TEXT.fifth ) 
                                        : 
                                        (item.value < state && 
                                            '완료'
                                        )
                                    }
                                </Title>    
                                {
                                    item.value == 1 && state == 1 && (
                                        <>
                                        <Title style={{ marginLeft: 10 , padding: 10 , color : 'gray' , marginBottom : 10 , fontWeight: 'bold' }}>
                                            주소: {props.route.params.data.shipmentLocation}
                                        </Title>
                                        <LottieView source={require('./1.json')} autoPlay={true} loop={true}/>
                                        </>
                                    ) 
                                }
                                {
                                    item.value == 3 && state == item.value && (
                                        <>
                                        <LottieView source={require('./1.json')} autoPlay={true} loop={true}/>
                                        </>
                                    )
                                }
                                {
                                    (item.value ==2 || item.value == 4) && item.value == state && (
                                    <>
                                    <Row>
                                    <Button style={{ alignSelf: 'flex-end' , padding: 3 , margin: 5 ,  borderRadius: 10  }}
                                        onPress={ () => { openNew() } }
                                        mode='contained'
                                        color={colors.main}
                                        icon='image'
                                    >
                                        {'추가하기'}
                                    </Button>
                                    <Button style={{ alignSelf: 'flex-end' , padding: 3 , margin: 5 , borderRadius: 10  }}
                                        onPress={ () => { state == 2 ? requestExamFin() : requestConstructFin() } }
                                        mode='contained'
                                        color={colors.main}
                                        icon='check'
                                    >
                                        {state == 2 ? '검수완료' : '시공완료' }
                                    </Button>
                                    </Row>
                                    <FlatList
                                        style={{ width: '80%', alignSelf: 'center' , marginLeft: 20 , marginBottom: 40 }}
                                        nestedScrollEnabled={true}
                                        data={pictures}
                                        renderItem={RenderItem}
                                        numColumns={3}
                                        keyExtractor={item => {item.id}}
                                        refreshControl={refresh}
                                    />
                                    </>
                                )
                                }
                            </SwiperView>
                    )
                })
            }
            </Swiper>
            </SwiperView>
            <View style={{ position: 'absolute' , bottom: 20 , right: 20 }}>
            <FAB   icon='chat' small={false} style={{  padding: 5 , borderRadius: 50 , backgroundColor: colors.main  }} 
                onPress={() => { props.navigation.navigate('ChatDetail',{ name : data?.userResponseDto?.nickname , id : props.route.params.data.id , imageUrl : props.route.params.imageUrl }) }}
            />
            {
                newMsg > 0 &&
                <Badge style={{ position: 'absolute'  }}>{newMsg}</Badge>
            }
            </View>
        </>
        </Provider>
    );
}