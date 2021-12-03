import React from 'react' ;
import styled from 'styled-components';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
  } from '@gorhom/bottom-sheet';
import { Title , Button , Text, TextInput , Provider , Modal , Portal  } from 'react-native-paper';
import colors from '../../color/colors';
import axios from 'axios';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputScrollView from 'react-native-input-scroll-view';
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';
import { login } from '@react-native-seoul/kakao-login';
import auth from '@react-native-firebase/auth'
import IMP from 'iamport-react-native';
import Postcode from '@actbase/react-daum-postcode';
import { NaverLogin } from '@react-native-seoul/naver-login';
import messaging from '@react-native-firebase/messaging';
//
import server from '../../server/server';
import store from '../../storage/store';
import fetch from '../../storage/fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

const View = styled.View`
    flex : 1 ;
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
        margin: 5 ,
        padding: 5
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
    const snapPoints = React.useMemo(() => ['90%'], []);
    const [loginMethod,setLoginMethod] = React.useState('kakao');
    const [name,setName] = React.useState('');
    const [businessNumber,setBusinessNumber] = React.useState('');
    // const [businessNumber,setBusinessNumber] = React.useState('1234512345');
    const [openDate,setOpenDate] = React.useState('');
    const [bossName,setBossName] = React.useState('');

    const [bottomPage,setBottomPage] = React.useState(1);
    const [dtoData,setDtoData] = React.useState(null);

    const [address,setAddress] = React.useState('');
    // const [address,setAddress] = React.useState('서울시 강남구 삼성로 11');
    // const [detailAddress,setDetailAddress] = React.useState('');
    const [detailAddress,setDetailAddress] = React.useState('');
    const [visible,setVisible] = React.useState(false);

    const [enabled,setEnabled] = React.useState(true);


    let latitude = null ;
    let longitude = null ;

    const bottomSheetModalRef = React.useRef(null);
    const handlePresentModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);
    const handleDismissModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);  


    const iosKeys = {
        kConsumerKey: "s8f8vTXD3RmumyHONbsG",
        kConsumerSecret: "ZrD2iZk_ep",
        kServiceAppName: "최강샵",
        kServiceAppUrlScheme: "strongshop" // only for iOS
    };
      
      const androidKeys = {
        kConsumerKey: "QfXNXVO8RnqfbPS9x0LR",
        kConsumerSecret: "6ZGEYZabM9",
        kServiceAppName: "테스트앱(안드로이드)"
    };
      
      const initials = Platform.OS === "ios" ? iosKeys : androidKeys;


    // API Request
   // 도로명 주소 -> 좌표로 변환
   function getCoord(address){
    return new Promise(resolve=>{
        axios({
            method: 'GET' ,
            url : `https://api.vworld.kr/req/address?service=address&request=getCoord&key=98C4A0B1-90CD-30F6-B7D0-9F5A0DC9F18B&address=${address}&type=ROAD` ,
        })
        .then(async (res) => {
            const point = res.data.response.result.point ;
            latitude = point.y ;
            longitude = point.x ;
            resolve();
        }
        )
        .catch(e => {
            //
        } ) ;
    }) ;

    }

    // 카카오 AccessToken => 서버 
    async function requestAccessToken(accessToken,method) {

        let FCM_Token ;

        await messaging().getToken().then( res =>{
            FCM_Token = res ;
        })

        axios({
            method : 'GET' ,
            url : `${server.url}/api/login/company/${method}` ,
            headers : {
                Authorization : accessToken ,
                FCM : FCM_Token
            } ,
        })
        .then( async (res) =>  {
            // 캐시삭제
            // await AsyncStorage.clear().catch(e => { });

            // console.log(res);
            // 회원가입 필요
            if ( res.data.statusCode == 201 ) {
                // 추가정보를 사용자로부터 받음.
                handlePresentModalPress();       
                setDtoData(res.data.data);         
            }
            // 이미 가입된 회원 => jwt token을 발급받음.
            else if ( res.data.statusCode == 200 ) {
                const auth = res.headers.auth;
                // jwt token cache
                await store('auth',{ auth : auth });
                // cache 성공 시 -> 메인화면
                await fetch('auth')
                .then( res => {
                    if ( res != null ) getMain(true);
                })
                .catch ( e => { 
                    //
                })

            }

        })
        .catch( e =>  {
            // 서버 통신에러
            console.log(e);
        })
    }

    async function requestSignIn() {

        if ( !(name.length && address.length && detailAddress.length) ) {
            Alert.alert('모두입력','모든 정보를 입력해주세요.');
            return ;
        } 
        
            

        setEnabled(false);

        let FCM_Token ;

        await messaging().getToken().then( res =>{
            FCM_Token = res ;
        })

        // 서버에게 dtoData 전달
        axios({
            method: 'POST',
            url : `${server.url}/api/login/company/${loginMethod}` ,
            data : {
                ...dtoData ,
                businessNumber: businessNumber ,
                bossName: bossName ,
                name: name ,
                fcmToken: FCM_Token 
            }
        })
        .then(async(res) =>{
            // 가입성공
            if ( res.data.statusCode == 200 ) {
                const auth = res.headers.auth;
                // jwt token cache
                try {
                    await store('auth',{auth : auth});
                    // 업체정보 post
                    await requestPost(auth)
                    .then ( () => {
                        getMain(true);
                        setEnabled(false);
                    })
                }
                // cache 성공 시 -> 메인화면
                catch {
                    // cache 저장 에러
                    console.log('cache 에러');
                }
            }   

        })
        .catch(e => {
            //
            setEnabled(false);
            Alert.alert('회원가입 실패','다시 시도해주세요.');
        })
    }
    function requestPost(auth) {
        return new Promise(async(resolve)=>{

            // 주소 변환 
            await getCoord(address) ;

            axios({
                method: 'POST',
                url: `${server.url}/api/companyinfo`,
                data : { address: address , detailAddress: detailAddress , latitude: latitude, longitude: longitude } ,
                headers: { Auth: auth }
            })
            .then( async(res) => {
                await store('Info',res.data.data) ;
                resolve();
            })
            .catch( e => {
                // alert('POST 에러');
            })
        })
    }


    const handleKakaoLogin = async() =>  {
        setLoginMethod('kakao');
        // 카카오 인증요청
        const token = await login().catch(e=>{console.log(e) });
        // 카카오 인증취소 / 인증실패 
        if ( token == null ) return;
        const accessToken = 'Bearer ' + token.accessToken ;        
        try {
            // token 서버에게 전달 
            requestAccessToken(accessToken,'kakao');
        }
        catch {
            Alert.alert('다시 요청해주세요.');
        }

    }
    const handleNaverLogin = props => {
        setLoginMethod('naver');
        return new Promise((resolve, reject) => {
            NaverLogin.login(props, (err, token) => {
              const accessToken = 'Bearer ' + token.accessToken ;   
              requestAccessToken(accessToken,'naver');
              if (err) {
                reject(err);
                return;
              }
              resolve(token);
            });
          });
      };
    

    // 휴대폰인증
    function phoneAuth(response) {
       if ( response.success ) {
           // 최종 회원가입요청
           requestSignIn();
       }
       else {
           // 인증 취소 / 대표자명과 맞지않을때
           handleDismissModalPress();
       }
    }

    // 사업자등록번호 인증
    const verify = () => {

        // 입력양식 체크
        // if ( !/[0-9]{10}/.test(businessNumber) && !/[0-9]{8}/.test(openDate) ) {
        //     Alert.alert('입력양식을 확인해주세요.');
        //     return;
        // }
    
        // Test ( 사업자 인증 성공 후 )
        setBottomPage(3);

        // 서버에게 dtoData 전달
        // axios({
        //     method: 'POST',
        //     url : `${server.url}/api/login/company/kakao` ,
        //     data : {
        //         ...dtoData ,
        //         businessNumber: businessNumber ,
        //         bossName: bossName ,
        //         name: '허지훈게이'
        //     }
        // })
        // .then(async(res) =>{
        //     // 가입성공
        //     if ( res.data.statusCode == 200 ) {
        //         const auth = res.headers.auth;
        //         // jwt token cache
        //         try {
        //             await store('auth',{ auth : auth } );
        //             getMain(true);
        //         }
        //         // cache 성공 시 -> 메인화면
        //         catch {
        //             // cache 저장 에러
        //             console.log('cache 에러');
        //         }
        //     }   

        // })
        // .catch(e => {
        //     //
            
        // })

        

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
        <Provider>
        <BottomSheetModalProvider>
             
        <View style={{ backgroundColor: colors.main , flex: 1 , justifyContent: 'center' , alignItems: 'center' }}>
            {/* <ImageBackground source={{ uri: 'https://picsum.photos/1' }} resizeMode='cover' style={{ justifyContent:'center' , alignItems: 'center' , flex: 1   }}> */}
                <Title style={styles.mainTitle}>최강샵</Title>
                <Text style={{ color: 'white'}}>나만의 샵을 관리해요.</Text>
                <Button style={styles.loginButton} color='white' icon='chat' onPress={handleKakaoLogin}>
                    카카오로 시작하기
                </Button>
                <Button style={styles.loginButton} color='white' icon='alpha-n-box' onPress={() => handleNaverLogin(initials) }>
                    네이버로 시작하기
                </Button>
                {/* <Button style={styles.loginButton} color='white' icon='alpha-n-box' onPress={() => handlePresentModalPress()}>
                   테스트
                </Button> */}
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
                    <Title style={styles.title}>나만의 샵을 등록해요. (1/3)</Title>
                    
                    <Text style={styles.description}>사업자등록번호</Text>
                    <TextInput theme={{  colors: { primary : colors.main , disabled: 'white'  }   }}
                        value={businessNumber}
                        mode='flat'
                        onChangeText={value=>{setBusinessNumber(value)}}
                        onEndEditing={() => { }}
                        keyboardType='number-pad'
                        placeholder='10자리를 입력하세요 (-없이) '
                    />
                    
                    <Text style={styles.description}>개업일자</Text>
                    <TextInput theme={{ colors: { primary : colors.main , disabled: 'white'  }   }}
                        value={openDate}
                        mode='flat'
                        onChangeText={value=>{setOpenDate(value)}}
                        keyboardType='number-pad'
                        placeholder='YYYYMMDD (예) 2021년 9월 27일 -> 20210927'
                    />
                    <Text style={styles.description}>대표자성명</Text>
                    <TextInput theme={{ colors: { primary : colors.main , disabled: 'white'  }  }}
                        // value={bossName}
                        mode='flat'
                        // onFocus={() => { this.scrollView.scrollToPosition(0,this.scrollView.state.keyboardSpace+10)  }}
                        onChangeText={value=>{setBossName(value)}}
                        placeholder='홍길동'
                    />
                    <Button style={{ marginTop: 30 , height: 50 , justifyContent: 'center'  }} 
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
                        <Title style={styles.title}> {bossName}님으로 인증할게요.(2/3)</Title>
                        <View style={{ width: '100%' , height: 700 }}>
                        
                        <IMP.Certification
                        userCode={'imp01457748'}  // 가맹점 식별코드
                        // tierCode={'AAA'}      // 티어 코드: agency 기능 사용자에 한함
                        data = {{
                            merchant_uid: `mid_${new Date().getTime()}`,
                            company: 'imaport',
                            carrier: '',
                            name: '',
                            phone: '',
                            min_age: '',
                        }
                        }
                        loading={<ActivityIndicator />} // 로딩 컴포넌트
                        callback={phoneAuth}   // 본인인증 종료 후 콜백
                      />  
                      </View>
                      </>
                    )
                }
                {
                    bottomPage == 3 && (
                        <>

                        <Portal>
                        <Modal 
                            visible={visible} 
                            onDismiss={ () => {setVisible(false)}}
                            contentContainerStyle= {{ alignItems : 'center' , justifyContent: 'center'   }}
                            >
                            <KeyboardAwareScrollView>
                                <Postcode
                                style={{ width : 300 , height: 500   }}
                                jsOptions={{ animated: true }}
                                onSelected={data => {setAddress(data.roadAddress) , setVisible(false)  } }
                                />
                            </KeyboardAwareScrollView>
                        </Modal>
                        </Portal>

                        <Title style={styles.title}> 업체에 대해 알려주세요.(3/3)</Title>
                        <View style = {{ width: '100%' , height: 700 }}>
                            <Text style={styles.description}>업체명</Text>
                            <TextInput theme={{ colors: { primary : colors.main , disabled: 'white'  }  }}
                            // value={bossName}
                            mode='flat'
                            onChangeText={value=>{setName(value)}}
                            placeholder='최강샵'
                            />
                            <Text style={styles.description}>주소</Text>
                            <TextInput  left={<TextInput.Icon icon='home' size={24}/>}
                            placeholder='주소를 선택하세요'
                            theme={{ colors: { primary: colors.main , background: 'white' }}}
                            editable={false}
                            right= {<TextInput.Icon name='magnify' onPress={ () => { setVisible(true) } }/>}
                            value={address}
                            onChangeText={ value=> setAddress(value)}
                            />
                            <TextInput  
                                placeholder='상세주소'
                                theme={{ colors: { primary: colors.main , background: 'white' }}}
                                // value={detailAddress}
                                onChangeText={ value=> setDetailAddress(value) }
                            />
                                <Button style={{ marginTop: 10 , height: 50 , justifyContent: 'center'  }} 
                                onPress={() => { requestSignIn() }}
                                mode='contained'
                                disabled={!enabled}
                                color={  name.length && address.length && detailAddress.length  ? colors.main : 'lightgray' }
                                // disabled={ name.length && address.length && detailAddress.length ? false : true }
                                // color={colors.main}
                                >
                                가입하기
                                </Button>
                            </View>
                            
                
                        </>
                    )
                }
                
                </KeyboardAwareScrollView>
            </BottomSheetModal> 
        </View>
        </BottomSheetModalProvider>
        </Provider>
    );
}