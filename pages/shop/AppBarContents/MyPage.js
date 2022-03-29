import React from "react";
import styled from "styled-components";
import { Title , Appbar, Avatar , Switch , TextInput, Divider , IconButton } from "react-native-paper";
import {check, checkNotifications, openSettings, PERMISSIONS, request, requestNotifications, RESULTS} from 'react-native-permissions';
import colors from "../../../color/colors";
import WebView from "react-native-webview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Alert, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppContext from "../../../storage/AppContext";
import axios from "axios";
import API from "../../../server/API";
import fetch from "../../../storage/fetch";
import store from "../../../storage/store";
import server from "../../../server/server";
import { Image , Text } from "react-native";
import { Platform } from "react-native";
import FastImage from "react-native-fast-image";
import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";
const View = styled.View``;
const Row = styled.View`
    align-items: center;
    flex-direction: row;
    width: 100%;
    height: 50px;
    /* border:1px lightgray; */
`;
const ButtonRow = styled.TouchableOpacity`
    align-items: center;
    flex-direction: row;
    width: 100%;
    height: 50px;
    /* border:1px lightgray; */
`;

const styles={
    title: {
        alignSelf: 'center' ,
        // fontFamily : 'DoHyeon-Regular',
        fontSize: 15 ,
        padding: 10 ,
    } ,
    image : {
        alignSelf: 'center' ,
        margin: 10 ,
        backgroundColor: colors.main
    }
}


export default function( props ) {
    const myContext = React.useContext(AppContext);
    const [notiPermission,setNotiPermission] = React.useState(false);
    const [picture,setPicture] = React.useState(null);

    React.useEffect(() => {
         checkNotifications()
         .then( res => {
             if (res.status == 'granted' ) setNotiPermission(true);
         })
    },[]);

    React.useEffect(() => {


        fetch('Info')
        .then( async(res) => {
            if (res?.backgroundImageUrl != null) {
                setPicture( res.backgroundImageUrl);
            }
            else {
                // 1. 서버에게 요청하여 Info 정보 받아옴.
                API.get('/api/companyinfo')
                .then(res=> {
                    // 2. Info 정보를 setData()
                    try {
                        if ( res.data.statusCode == 200 ) {
                            store('Info',{ 'backgroundImageUrl' : res.data.data.backgroundImageUrl })
                            setPicture( res.data.data.backgroundImageUrl);
                        }
                    }
                    catch(e) {
                        //
                    }
                })
                .catch( e => { 
                    // console.log(e.response);
                 })


            }
        })

        

    },[]);

    const requestDeleteUser = async () => {
        
        const token = await fetch('auth') ;
        const auth = token.auth


        // 회원 탈퇴
        axios({
            method: 'delete' ,
            url: `${server.url}/api/company`,
            headers: { Auth: auth }
        })
        .then( async(res) => {
            await AsyncStorage.clear();
            myContext.LOGOUT()
        })
        .catch( e => {
            if ( e.response.hasOwnProperty('status') && e?.response?.status == 406 ) {
                Alert.alert('탈퇴불가','진행중인 계약이 있습니다.');
            }
            else { 
                Alert.alert('다시 시도해주세요.');
            }
        })
    }

    const handleDeleteUser = async () =>  {
        Alert.alert('임시','회원탈퇴',[
            {
                text: '회원탈퇴' ,
                style: 'destructive' ,
                onPress: () => { requestDeleteUser() }
            },
            {
                text: '취소'
            }
        ])
    }

    

    // 로그아웃    
    const handleLogout = () => {
        Alert.alert('로그아웃하시겠습니까?','',[
            {
                text: '로그아웃' ,
                style: 'destructive' ,
                onPress: async() => { 
                    // 가지고있는 모든 캐시정보 clear
                    fetch('auth')
                    .then( res => {
                        const auth = res.auth ;
                        axios({
                            method: 'put',
                            url: `${server.url}/api/logout/company` ,
                            headers: { Auth: auth }

                        })
                        .then( async(res) => {
                            await AsyncStorage.clear();
                            myContext.LOGOUT() 
                        })
                        .catch( e => {
                            Alert.alert('다시 시도해주세요.');
                        })
                    })// fetch
                }// OnPress
            },
            {
                text: '취소'
            }
        ])
    }
    const handleEditPhoneNum = () => {
        Alert.alert('수정하시겠습니까?','',[
            {
                text: '수정',
                onPress: () => {
                    // 서버
                }
            } ,
            {
                text: '취소'
            }
        ])
    }

    // 썸네일 등록
    function requestThumbnail(){
        MultipleImagePicker.openPicker({
            mediaType: 'image' ,
            maxSelectedAssets: 1 ,
            maximumMessageTitle: '업체 썸네일' ,
            maximumMessage: '한장만 등록해주세요.' ,
            doneTitle: "완료",
            selectedColor: "#162741",
            tapHereToChange: '여기를 눌러 변경' ,
            cancelTitle: '취소' ,
            singleSelectedMode: true ,
            // 임시
            usedCameraButton: false
        })
        .then(async (res) => {
            // 서버에 등록 후 캐시
            const token = await fetch('auth');
            const auth = token.auth;
                // 폼데이터 생성
                var body = new FormData();
                 // 현재 사용자가 불러온 이미지 리스트들 => 각각 폼데이터에 넣어준다.
                let response = res;
                var url ;
                // ios
                if ( Platform.OS == 'ios' ) url = response.path.replace('file://','').replace('file:///','file://');
                // android
                else {
                    if( response.path.startsWith('content://'))
                        url = response.path;
                    else 
                        url = 'file://' + response.path ;
                }


                var photo = {
                    uri: url ,
                    type: 'multipart/form-data',
                    name: `0.jpg` ,
                    
                }
                body.append('file',photo);

                const axiosInstance = axios.create({
                    headers: {
                        'content-type': 'multipart/form-data' ,
                        Auth : auth
                    } ,
                    timeout: 20000
                }) ;

                axiosInstance.post(`${server.url}/api/companyinfo/bgi`,body)
                .then( async(res) => {
                    if ( res.data.statusCode == 200 ) {
                               // 사진 등록
                               const res_url = res.data.data.url ;
                               try{
                                   await store('Info',{ 'backgroundImageUrl' : res_url })
                                   setPicture( res_url ) ;
                               }
                               catch{
                                   Alert.alert('다시 시도해주세요.');
                               }
                    }
                })
                .catch( e => {
                    // console.log(e);
                })


     
        })
        .catch( e => {

        })
    }

    return(
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}> 
        {/* <Appbar.Header style={{ backgroundColor: colors.main }}>
        <Appbar.BackAction onPress={()=>{ props.navigation.goBack() }}/>        
        </Appbar.Header>   */}
            <ButtonRow onPress={requestThumbnail} style= {{ height: 100 }}>
            {
                    picture == null ? 
                    (
                        <Image source={require('../../../resource/Loading.jpeg')} style={{ width: 60 , height: 60 , borderRadius: 10 , marginLeft: 10 }}/>
                    ):
                    (
                        <FastImage source = {{ uri : picture }} style={{ width: 60 , height: 60 , borderRadius: 10 , marginLeft: 10 }}  resizeMode='cover' />
                    )
            }
            <View style={{ flex: 1 }}>
                <Title style={{ ...styles.title , fontWeight: 'bold' , marginLeft: 20 , padding: 0 , alignSelf: 'flex-start' }}>{props.route.params.name}</Title>
                <Text style={{ marginLeft: 20 , color: 'lightgray' , fontSize: 12 }}>여기를 눌러 편집하세요.</Text>
            </View>
            </ButtonRow>
            {/* <Row style={{ alignItems: 'center'}}>
                <Title style={styles.title}>휴대전화번호</Title>
                <Title style={{...styles.title , backgroundColor: 'lightgray' }}>01012341234</Title>
            </Row> */}
            {/* <Row>
                <Title style={styles.title}>전화번호</Title>
                <TextInput style={{ flex: 1  }} 
                    placeholder='전화번호를 입력해주세요.'
                    mode='flat'
                    theme={{ colors: { primary: colors.main , background: 'transparent' }}}
                    keyboardType='number-pad'
                    right={<TextInput.Icon icon='pencil-outline' onPress={ handleEditPhoneNum}/> }
                />
            </Row> */}
            <Row>
                <Title style={styles.title}>푸시알람 동의여부</Title>
                <Switch color={colors.main} value={notiPermission} style={{ position: 'absolute' , right: 10 }} 
                    onValueChange={ () => { if ( !notiPermission ) requestNotifications(['alert','badge']).then( res => { openSettings() }) }}
                />
            </Row>

            <ButtonRow style={{ height: 70 }} onPress={ () => { props.navigation.navigate('Receipt') }}>
                <Title style={styles.title}>과거 시공내역</Title>
                <Avatar.Icon size={40} icon='chevron-right' style={{ backgroundColor: 'transparent' , position: 'absolute' , right: 0 }} color='black' />
            </ButtonRow>

            <Divider style={{ borderWidth: 5 , borderColor: 'rgb(240,240,240)' , marginTop: 40}} />
            <Title style={{ ...styles.title , color: 'gray'  }}>고객센터</Title>
            {/* <Row>
                <Avatar.Icon size={40} icon='bullhorn' style={{ backgroundColor: 'transparent'}} color='black'/>
                <Title style={styles.title}>공지사항</Title>
            </Row> */}
            <ButtonRow style={{ height: 60 , borderTopWidth: 0.5 , borderBottomWidth: 0.5 , borderColor: 'rgb(230,230,230)' }} onPress={() => { props.navigation.navigate('CS') }}>
                <Avatar.Icon size={40} icon='chat-plus' style={{ backgroundColor: 'transparent'}} color='black'/>
                <Title style={styles.title}>고객문의</Title>
            </ButtonRow>
            {/* <Row>
                <Avatar.Icon size={40} icon='account-question' style={{ backgroundColor: 'transparent'}} color='black'/>
                <Title style={styles.title}>FAQ</Title>
            </Row> */}
            <Title style={{ color: 'gray' , alignSelf: 'flex-end' , padding: 5 , fontSize: 15 , margin : 10 }} onPress={handleLogout}>로그아웃</Title>
            <Title style={{ color: 'red' , alignSelf: 'flex-end' , padding: 5 , fontSize: 15 , margin : 10 }} onPress={handleDeleteUser}>회원탈퇴</Title>
            </KeyboardAwareScrollView>
    );
}