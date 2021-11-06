import React from "react";
import styled from "styled-components";
import { Title , Appbar, Avatar , Switch , TextInput, Divider } from "react-native-paper";
import colors from "../../color/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppContext from "../../storage/AppContext";

const Row = styled.View`
    align-items: center;
    flex-direction: row;
    width: 100%;
    height: 60px;
    border:1px lightgray;
`;

const styles={
    title: {
        alignSelf: 'center' ,
        fontFamily : 'DoHyeon-Regular',
        fontSize: 20 ,
        padding: 10 ,
    } ,
    image : {
        alignSelf: 'center' ,
        margin: 20 ,
        backgroundColor: 'transparent'
    }
}


export default function( props ) {
    const myContext = React.useContext(AppContext);

    const handleLogout = () => {
        Alert.alert('로그아웃하시겠습니까?','',[
            {
                text: '로그아웃' ,
                style: 'destructive' ,
                onPress: async() => { 
                    // 가지고있는 모든 캐시정보 clear
                    // await AsyncStorage.clear();
                    myContext.LOGOUT() 
                }
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
        <KeyboardAwareScrollView>
        <Appbar.Header style={{ backgroundColor: colors.main }}>
        <Appbar.BackAction onPress={()=>{ props.navigation.goBack() }}/>        
        </Appbar.Header>  
            <Avatar.Image style={styles.image} source={{ uri : 'https://picsum.photos/0'}} size={60}/>
            <Title style={styles.title}>최강샵</Title>
            <Row style={{ alignItems: 'center'}}>
                <Title style={styles.title}>휴대전화번호</Title>
                <Title style={{...styles.title , backgroundColor: 'lightgray' }}>01012341234</Title>
            </Row>
            <Row>
                <Title style={styles.title}>전화번호</Title>
                <TextInput style={{ flex: 1  }} 
                    placeholder='전화번호를 입력해주세요.'
                    mode='flat'
                    theme={{ colors: { primary: colors.main , background: 'transparent' }}}
                    keyboardType='number-pad'
                    right={<TextInput.Icon icon='pencil-outline' onPress={ handleEditPhoneNum}/> }
                />
            </Row>
            <Row>
                <Title style={styles.title}>광고 수신 동의</Title>
                <Switch style={{ position: 'absolute' , right: 10 }} />
            </Row>


            <Title style={{ ...styles.title , color: 'gray' , marginTop: 40 }}>고객센터</Title>
            <Row>
                <Avatar.Icon icon='bullhorn' style={{ backgroundColor: 'transparent'}} color={colors.main}/>
                <Title style={styles.title}>공지사항</Title>
            </Row>
            <Row>
                <Avatar.Icon icon='chat-plus' style={{ backgroundColor: 'transparent'}} color={colors.main}/>
                <Title style={styles.title}>고객문의</Title>
            </Row>
            <Row>
                <Avatar.Icon icon='account-question' style={{ backgroundColor: 'transparent'}} color={colors.main}/>
                <Title style={styles.title}>FAQ</Title>
            </Row>
            <Title style={{ color: 'gray' , alignSelf: 'flex-end' , padding: 5 , fontSize: 15 , margin : 10 }} onPress={handleLogout}>로그아웃</Title>
            </KeyboardAwareScrollView>
    );
}