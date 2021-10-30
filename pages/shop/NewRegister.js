import React from 'react' ;
import styled from 'styled-components';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
  } from '@gorhom/bottom-sheet';
import { Title , Appbar , Button , Text, TextInput } from 'react-native-paper';
import colors from '../../color/colors';
import axios from 'axios';
import { ScrollView } from 'react-native';
import { Image } from 'react-native';
import { Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';
import { login } from '@react-native-seoul/kakao-login';
import auth from '@react-native-firebase/auth'
//
import server from '../../server/server';

const View = styled.View`
    flex : 1 ;
`;
const Row = styled.View`
    flex-direction: row;
    height: 130px ;
    margin-top: 10px;
`;
const TextView = styled.View`
    flex: 2 ;
`;

const styles = {
    title : {
        padding: 10 ,
        fontSize: 30 ,
        fontFamily: 'DoHyeon-Regular' ,
    } ,
    mainTitle : {
        color: 'white',
        padding: 10 ,
        fontSize: 30 ,
        fontFamily: 'DoHyeon-Regular' ,
    } ,
    description : {
        fontSize: 17 , 
        margin: 10
    } ,
    button : {
        flex: 1 , 
        borderWidth: 1 ,
        margin: 5 ,
        borderColor: 'white'
    } ,
    loginButton : {
        width: '70%' ,
        borderWidth: 1 ,
        margin: 20 ,
        padding: 5,
        borderColor: 'white'
    } ,
    guideButton: { 
        alignSelf: 'flex-start', 
        padding: 10 ,
        borderWidth: 1 , 
        borderColor: 'black' , 
        margin: 5
    }

}

export default function({getMain}) {
    const snapPoints = React.useMemo(() => ['75%'], []);
    const [businessNumber,setBusinessNumber] = React.useState('');
    const [openDate,setOpenDate] = React.useState('');
    const [bossName,setBossName] = React.useState('');
    const [bottomPage,setBottomPage] = React.useState(1);
    const [phoneNum,setPhoneNum] = React.useState('');
    const [confirm,setConfirm] = React.useState(null);
    const [code,setCode] = React.useState('');
    const [codeVisible,setCodeVisible] = React.useState(false);
    const [dtoData,setDtoData] = React.useState(null);

    const bottomSheetModalRef = React.useRef(null);
    const handlePresentModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);
    const handleDismissModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);  

    const handleKakaoLogin = async() =>  {
        // 카카오 인증요청
        const token = await login().catch(e=>{  });
        if ( token == null ) return;
        // token 서버에게 전달 
        const accessToken = 'Bearer ' + token.accessToken ;        
        axios({
            method : 'GET' ,
            url : `${server.url}/api/login/company/kakao` ,
            headers : {
                Authorization : accessToken
            } ,
        })
        .then( res =>  {
            // 회원가입 필요
            if ( res.data.statusCode == 200 ) {
                // 추가정보를 사용자로부터 받음.
                handlePresentModalPress();       
                setDtoData(res.data.data);         
            }
            // 이미 가입된 회원 => jwt token을 발급받음.


        })
        .catch( e =>  {
            // 서버 통신에러
        })

    }

    // 인증번호 전송 => Firebase
    const testAuth = async() => {

        // 010 => +8210
        number = phoneNum.replace('01','+821')
        confirmation = await auth().signInWithPhoneNumber(number).catch(e => console.log(e));
        if ( confirmation != null ) setCodeVisible(true);
        setConfirm(confirmation);
    }
    // 인증번호 확인 
    const verifyAuth = async() => {
        try {
            await confirm.confirm(code);
            // 인증완료 후
            // 추가정보를 포함해서 다시 서버호출
            axios({
                url: `${server.url}/api/login/company/kakao` ,
                method: 'POST' ,
                data : {
                    ...dtoData ,
                    businessNumber: businessNumber,
                    bossName: bossName,
                    
                }
                
            })
            .then(res => {
                console.log(res);
            })
            .catch(e => {
                // 
            })


        } catch (e) {
            // 인증번호 틀렸을 때
            Alert.alert('인증번호를 다시 확인해주세요.');
        }
    }


    const verify = () => {

        // 입력양식 체크
        // if ( !/[0-9]{10}/.test(businessNumber) && !/[0-9]{8}/.test(openDate) ) {
        //     Alert.alert('입력양식을 확인해주세요.');
        //     return;
        // }
    
        // Test ( 사업자 인증 성공 후 )
        setBottomPage(2);
        

        // 사업자등록 인증
        // axios({
        //     method: 'post' ,
        //     url :  'https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=Te7HPGFjEojhi4%2B4sRjikWXlBCD1Bg%2FAVQzCa9A4gUihNPh%2FRxaFkxk2IJ670MBNRDarlpFsPX67kda7XMXaLA%3D%3D' ,
        //     data : {
        //         businesses : [
        //             {
        //                 b_no : businessNumber ,
        //                 start_dt : openDate ,
        //                 p_nm : bossName ,
        //                 p_nm2 : '' ,
        //                 b_nm : '' ,
        //                 corp_no : '' ,
        //                 b_sector : '' ,
        //                 b_type : '' ,
        //             }
        //         ]
        //     }
        // })
        // .then( res =>   { 

        //     if(res.data.data[0].valid === '01')  {
        //         setBottomPage(2);
        //     }
        //     else Alert.alert('유효하지 않은 사업자등록증입니다.','다시 한번 확인해주세요.');
        // }) 
        // .catch(e => Alert.alert('필수사항을 입력해주세요.') ) ;

    } ;

    return(
        <BottomSheetModalProvider>
        <View style={{ backgroundColor: colors.main , flex: 1 , justifyContent: 'center' , alignItems: 'center' }}>
            {/* <ImageBackground source={{ uri: 'https://picsum.photos/1' }} resizeMode='cover' style={{ justifyContent:'center' , alignItems: 'center' , flex: 1   }}> */}
                <Title style={styles.mainTitle}>최강샵</Title>
                <Text style={{ color: 'white'}}>나만의 샵을 관리해요.</Text>
                <Button style={styles.loginButton} color='white' icon='chat' onPress={handleKakaoLogin}>
                    카카오로 시작하기
                </Button>
                <Button style={styles.loginButton} color='white' icon='alpha-n-box' onPress={testAuth}>
                    네이버로 시작하기
                </Button>
            {/* </ImageBackground> */}

            {/* BottomSheet 모달  */}
            <BottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                // enablePanDownToClose={false}
            >
            <KeyboardAwareScrollView>
                {
                    bottomPage == 1 && (
                    <>
                    {/* <Button style={styles.guideButton} color='black' icon='information-outline'>이용가이드</Button>                     */}
                    <Title style={styles.title}>나만의 샵을 등록해요. (1/2)</Title>
                    
                    <Text style={styles.description}>사업자등록번호</Text>
                    <TextInput theme={{  colors: { primary : colors.main }  }}
                        value={businessNumber}
                        onChangeText={value=>{setBusinessNumber(value)}}
                        keyboardType='number-pad'
                        placeholder='10자리를 입력하세요 (-없이) '
                    />
                    
                    <Text style={styles.description}>개업일자</Text>
                    <TextInput theme={{ colors: { primary : colors.main }  }}
                        value={openDate}
                        onChangeText={value=>{setOpenDate(value)}}
                        keyboardType='number-pad'
                        placeholder='YYYYMMDD (예) 2021년 9월 27일 -> 20210927'
                    />
                    <Text style={styles.description}>대표자성명</Text>
                    <TextInput theme={{ colors: { primary : colors.main , background: 'white' }  }}
                        value={bossName}
                        onChangeText={value=>{setBossName(value)}}
                        placeholder='홍길동'
                    />
                    <Button style={{ marginTop: 10 , height: 50 , justifyContent: 'center' }} 
                        onPress={() => {verify()}}
                        mode={businessNumber.length&&openDate.length&&bossName.length ? 'contained' : 'outlined'}  
                        color={colors.main}>
                        다음
                    </Button>
                    </>
                    )
                }
                {
                    bottomPage == 2 && (
                        <>
                        <Title style={styles.title}>휴대전화를 인증해주세요. (2/2)</Title>
                        <Text style={styles.description}>휴대전화번호</Text>
                        <TextInput theme={{ colors: { primary : colors.main , background: 'white' }  }}
                            style={{ flex: 2 }}
                            value={phoneNum}
                            onChangeText={value=>{setPhoneNum(value)}}
                            keyboardType='number-pad'
                            placeholder=' (-) 없이 입력'
                        />                  
                        <Button style={{ padding: 10 }} onPress={testAuth} mode='outlined' color={colors.main} >인증번호 전송</Button>
                        {
                            codeVisible && (
                                <>
                                <Text style={styles.description}>인증번호</Text>
                                <TextInput theme={{ colors: { primary : colors.main , background: 'white' }  }}
                                style={{ flex: 6 }}
                                value={code}
                                onChangeText={value=>{setCode(value)}}
                                keyboardType='number-pad'
                                placeholder=' (-) 없이 입력'
                                />
                                <Button style={{ padding: 10 }} onPress={verifyAuth} mode='outlined' color='red' >인증하기</Button>
                                </>
                            )
                        }
                        </>
                    )
                }
                
                </KeyboardAwareScrollView>
            </BottomSheetModal> 
        </View>
        </BottomSheetModalProvider>
    );
}