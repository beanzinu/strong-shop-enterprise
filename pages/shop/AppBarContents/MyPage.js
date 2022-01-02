import React from "react";
import styled from "styled-components";
import { Title , Appbar, Avatar , Switch , TextInput, Divider } from "react-native-paper";
import {check, checkNotifications, PERMISSIONS, request, requestNotifications, RESULTS} from 'react-native-permissions';
import colors from "../../../color/colors";
import WebView from "react-native-webview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Alert, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppContext from "../../../storage/AppContext";
import axios from "axios";
import fetch from "../../../storage/fetch";
import server from "../../../server/server";
const Row = styled.View`
    align-items: center;
    flex-direction: row;
    width: 100%;
    height: 50px;
    border:1px lightgray;
`;
const ButtonRow = styled.TouchableOpacity`
    align-items: center;
    flex-direction: row;
    width: 100%;
    height: 50px;
    border:1px lightgray;
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

    React.useEffect(() => {
         checkNotifications()
         .then( res => {
             if (res.status == 'granted' ) setNotiPermission(true);
         })
    })

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

    return(
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}> 
        {/* <Appbar.Header style={{ backgroundColor: colors.main }}>
        <Appbar.BackAction onPress={()=>{ props.navigation.goBack() }}/>        
        </Appbar.Header>   */}
            {
                props.route?.params?.picture == null ? (
                    <Avatar.Icon size={50} style={styles.image} icon='account-outline'/>
                ):
                <Avatar.Image style={styles.image} source={{ uri : props.route.params.picture }} size={60}/>
            }
            <Title style={{ ...styles.title , fontFamily: 'DoHyeon-Regular' }}>{props.route.params.name}</Title>
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
                <Title style={styles.title}>푸시알람 동의</Title>
                <Switch color={colors.main} value={notiPermission} style={{ position: 'absolute' , right: 10 }} 
                    onValueChange={ () => { if ( !notiPermission ) requestNotifications(['alert','badge']).then( res => { alert(res.status) }) }}
                />
            </Row>

            <ButtonRow style={{ height: 70 }} onPress={ () => { props.navigation.navigate('Receipt') }}>
                <Title style={styles.title}>과거 시공내역</Title>
                <Avatar.Icon size={40} icon='chevron-right' style={{ backgroundColor: 'transparent' , position: 'absolute' , right: 0 }} color='black' />
            </ButtonRow>


            <Title style={{ ...styles.title , color: 'gray' , marginTop: 40 }}>고객센터</Title>
            {/* <Row>
                <Avatar.Icon size={40} icon='bullhorn' style={{ backgroundColor: 'transparent'}} color='black'/>
                <Title style={styles.title}>공지사항</Title>
            </Row> */}
            <ButtonRow style={{ height: 60 }} onPress={() => { props.navigation.navigate('CS') }}>
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