import React from 'react' ;
import styled from 'styled-components';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
  } from '@gorhom/bottom-sheet';
import { Title , Button , Text, TextInput , Provider , Modal , Portal , RadioButton , IconButton, Appbar, Divider } from 'react-native-paper';
import colors from '../../color/colors';
import axios from 'axios';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputScrollView from 'react-native-input-scroll-view';
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';
import { login } from '@react-native-seoul/kakao-login';
// import auth from '@react-native-firebase/auth'
import IMP from 'iamport-react-native';
import Postcode from '@actbase/react-daum-postcode';
import { NaverLogin } from '@react-native-seoul/naver-login';
import messaging from '@react-native-firebase/messaging';
import _ from 'lodash'
//
import server from '../../server/server';
import store from '../../storage/store';
import fetch from '../../storage/fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
// analytics
import analytics from '@react-native-firebase/analytics'
import API from '../../server/API';
import CustomBar from '../../components/CustomBar';


const View = styled.View`
    flex: 1;
`;
const CustomView = styled.View``;
const styles = {
    title : {
        padding: 10 ,
        fontSize: 30 ,
        fontFamily: 'DoHyeon-Regular' ,
    } ,
    mainTitle : {
        color: 'white',
        padding: 10 ,
        fontSize: 35 ,
        fontFamily: 'DoHyeon-Regular' ,
        textAlign: 'center'
    } ,
    description : {
        fontSize: 17 , 
        margin: 5 ,
        padding: 5 , 
        marginTop: 10 
    } ,
    button : {
        flex: 1 , 
        borderWidth: 1 ,
        margin: 5 ,
        borderColor: 'white'
    } ,
    loginButton : {
        width: '65%' ,
        borderWidth: 2 ,
        margin: 20 ,
        padding: 7,
        borderColor: colors.main ,
        borderRadius: 15 ,
        backgroundColor: 'white'
    } ,
    guideButton: { 
        alignSelf: 'flex-start', 
        padding: 10 ,
        borderWidth: 1 , 
        borderColor: 'black' , 
        margin: 5
    } ,
    textInput : {
        backgroundColor: 'white' , width: '95%' , alignSelf: 'center'
    }

}


  

export default function NewRegister({getMain}) {
    const snapPoints = React.useMemo(() => ['95%'], []);
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
    // 주소 Modal
    const [visible,setVisible] = React.useState(false);
    // 입찰지역 Modal
    const [region1,setRegion1] = React.useState('서울');
    const [region2,setRegion2] = React.useState('수원');
    const [region1Visible,setRegion1Visible] = React.useState(false);
    const [region2Visible,setRegion2Visible] = React.useState(false);

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
        kConsumerKey: "s8f8vTXD3RmumyHONbsG",
        kConsumerSecret: "ZrD2iZk_ep",
        kServiceAppName: "최강샵"
    };
      
      const initials = Platform.OS === "ios" ? iosKeys : androidKeys;


    // API Request
   // 도로명 주소 -> 좌표로 변환
   function getCoord(address){
    return new Promise((resolve,reject)=>{
        axios({
            method: 'GET' ,
            url : `https://api.vworld.kr/req/address?service=address&request=getCoord&key=98C4A0B1-90CD-30F6-B7D0-9F5A0DC9F18B&address=${address}&type=ROAD` ,
        })
        .then(async (res) => {
            const point = res.data.response.result.point ;
            latitude = point.y ;
            longitude = point.x ;
            resolve('success');
        })
        .catch(e => {
            latitude = 37.5 ;
            longitude = 126.9 ;

            reject(e);
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
                fcmToken: FCM_Token ,
                region: `${region1},${region2}`
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
                        // setEnabled(false);
                    })
                    .catch( e => {
                        // alert('정보등록 실패');
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
            Alert.alert('회원가입 실패','다시 시도해주세요.');
            setEnabled(true);
        })
    }

    function requestPost(auth) {
        return new Promise(async(resolve)=>{

            // 주소 변환 
            await getCoord(address)
            .then( res => {
                // alert(res);
            })
            .catch( e =>  {
                // alert( e ) ;
            }) ;

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
              if( token == null ) return;
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

        // 사업자등록 인증
        axios({
            method: 'post' ,
            url :  'https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=Te7HPGFjEojhi4%2B4sRjikWXlBCD1Bg%2FAVQzCa9A4gUihNPh%2FRxaFkxk2IJ670MBNRDarlpFsPX67kda7XMXaLA%3D%3D' ,
            data : {
                businesses : [
                    {
                        b_no : businessNumber ,
                        start_dt : openDate ,
                        p_nm : bossName ,
                        p_nm2 : '' ,
                        b_nm : '' ,
                        corp_no : '' ,
                        b_sector : '' ,
                        b_type : '' ,
                    }
                ]
            }
        })
        .then( res =>   { 

            if(res.data.data[0].valid === '01')  {
                setBottomPage(3);
            }
            else Alert.alert('유효하지 않은 사업자등록증입니다.','다시 한번 확인해주세요.');
        }) 
        .catch(e => Alert.alert('필수사항을 입력해주세요.') ) ;

    } ;

    const test = () => {
        if( !businessNumber.length ) {
            alert('사업자등록번호 입력')
        }
        else {
            setBottomPage(3);
        }
    }


    const handleRegion = ( region ,index ) => {
        if( index == 1) {
            if( region == region2 ) {
                Alert.alert('중복선택','이미 선택한 지역입니다.')
                return;
            }
            setRegion1(region);
            setRegion1Visible(false);
        }
        else {
            if( region == region1 ) {
                Alert.alert('중복선택','이미 선택한 지역입니다.')
                return;
            }
            setRegion2(region);
            setRegion2Visible(false);
        }
    }

    async function handleTest(){

        let FCM_Token ;
        
        await messaging().getToken().then( res =>{
            FCM_Token = res ;
        })

        axios({
            method: 'POST' ,
            url : `${server.url}/api/login/test/company` ,
            headers: { FCM : FCM_Token }
        })
        .then( async (res) => {
            const auth = res.headers.auth;

            await store('auth',{ auth : auth });

            if( res.data.statusCode == 201 ){
                try {
                    // 업체정보 post
                    axios.post(`${server.url}/api/companyinfo`,{
                        introduction : "업체 소개를 해주세요." ,
                        contact: "" ,
                        blogUrl : "" ,
                        siteUrl : "" ,
                        snsUrl : "" ,
                        address: "부산 영도구 중리북로 5" , 
                        detailAddress: "101동" , 
                        latitude: 37.5, 
                        longitude: 126.9
                    }, { headers: { Auth: auth }  })
                    .then ( async (res) => {
                        await store('Info',res.data.data) ;
                        getMain(true);
                        // setEnabled(false);
                    })
                    .catch( e =>  {
                        console.log(e);
                    })
                }
                catch {
                    // cache 저장 에러
                    console.log('cache 에러');
                }
            }
            else if ( res.data.statusCode == 200 ) {
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
        .catch( e => {})

    }



    React.useEffect(() => {
        // Google Analytics
        analytics().logScreenView({
            screen_class: 'Login' ,
            screen_name: 'Login'
        })
        
    },[]);


    return(
        <Provider>
        <BottomSheetModalProvider>
             
        <View style={{ backgroundColor: colors.submain }}>
                <CustomBar.Default subtitle={'나만의 샵을 관리해요.'} />

                <CustomView style={{ justifyContent: 'flex-end' , alignItems: 'center' , flex: 1 , marginBottom: 50 }}>
                    <Button labelStyle={{ fontSize: 17 , fontFamily: 'NotoSansKR-Medium'}} style={styles.loginButton} color='black' icon='chat' onPress={handleKakaoLogin}>
                        카카오로 시작하기
                    </Button>
                    <Button labelStyle={{ fontSize: 17 , fontFamily: 'NotoSansKR-Medium'}}  style={styles.loginButton} color='black' icon='alpha-n-box' onPress={() => handleNaverLogin(initials) }>
                        네이버로 시작하기
                    </Button>
                    <Button labelStyle={{ fontSize: 17 , fontFamily: 'NotoSansKR-Medium'}}  style={styles.loginButton} color='black' icon='flask-empty' onPress={ handleTest }>
                    아임포트 테스트
                    </Button>
                    <Button labelStyle={{ fontSize: 17 , fontFamily: 'NotoSansKR-Medium'}}  style={styles.loginButton} color='black' icon='flask-empty' onPress={ () => { handlePresentModalPress() } }>
                        테스트
                    </Button>

                </CustomView>


            {/* </ImageBackground> */}

            {/* BottomSheet 모달  */}
            <BottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                handleStyle={{ backgroundColor: colors.main , borderColor: 'white' }}
                handleIndicatorStyle={{ backgroundColor: 'white' }}
                // enablePanDownToClose={false}
            >
            <KeyboardAwareScrollView>
                {
                    bottomPage == 1 && (
                    <>
                    {/* <Button style={styles.guideButton} color='black' icon='information-outline'>이용가이드</Button>                     */}
                    <CustomBar.A subtitle={'1.나만의 샵을 등록해요.'} />
                    
                    <CustomView style={{ borderWidth: 1 , borderColor: colors.main , backgroundColor: colors.submain , paddingBottom: 30 , marginLeft: 10 , paddingRight: 10 , borderRadius: 5 }}>
                    <Text style={styles.description}>사업자등록번호</Text>
                    <TextInput 
                        theme={{  colors: { primary : colors.main  }   }}
                        outlineColor={colors.main }
                        style={styles.textInput}
                        value={businessNumber}
                        mode='outlined'
                        onChangeText={value=>{setBusinessNumber(value)}}
                        onEndEditing={() => { }}
                        keyboardType='number-pad'
                        placeholder='10자리를 입력하세요 (-없이) '
                    />
                    
                    <Text style={styles.description}>개업일자</Text>
                    <TextInput 
                        theme={{  colors: { primary : colors.main  }   }}
                        outlineColor={colors.main}
                        style={styles.textInput}
                        value={openDate}
                        mode='outlined'
                        onChangeText={value=>{setOpenDate(value)}}
                        keyboardType='number-pad'
                        placeholder='YYYYMMDD (예) 2021년 9월 27일 -> 20210927'
                    />
                    <Text style={styles.description}>대표자성명</Text>
                    <TextInput 
                        theme={{  colors: { primary : colors.main  }   }}
                        outlineColor={colors.main}
                        style={styles.textInput}
                        // value={bossName}
                        mode='outlined'
                        // onFocus={() => { this.scrollView.scrollToPosition(0,this.scrollView.state.keyboardSpace+10)  }}
                        onChangeText={value=>{setBossName(value)}}
                        placeholder='홍길동'
                    />
                    </CustomView>
                    <Button 
                        style={{ margin: 10 , marginTop: 20 , height: 50 , justifyContent: 'center' , borderColor: colors.main , borderWidth: 2 , borderRadius: 10 , width: '50%', alignSelf: 'center'  }} 
                        onPress={() => {verify()}}
                        labelStyle={{ color: businessNumber.length&&openDate.length&&bossName.length ? 'white' : colors.main }}
                        mode={businessNumber.length&&openDate.length&&bossName.length ? 'contained' : 'outlined'}  
                        color={colors.main}>

                        다음
                    </Button>
                    <Button style={{ margin: 10 , marginTop: 10 , height: 50 , justifyContent: 'center'  }} 
                        onPress={() => { test() }}
                        mode = 'contained'
                        color={'lightgray'}>
                        테스트
                    </Button>

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
                                <IconButton style={{ alignSelf: 'flex-end'}} icon='close' color='white' onPress={() => { setVisible(false)}} />
                                <Postcode
                                style={{ width : 300 , height: 500   }}
                                jsOptions={{ animated: true }}
                                onSelected={data => {setAddress(data.roadAddress) , setVisible(false)  } }
                                />
                            </KeyboardAwareScrollView>
                        </Modal>
                        </Portal>

                        <Portal>
                            <Modal 
                                visible={region1Visible} 
                                onDismiss={ () => {setRegion1Visible(false)}}
                                contentContainerStyle= {{ alignItems : 'center' , justifyContent: 'center'   }}
                                >
                                <IconButton color='white' onPress={() => { setRegion1Visible(false) }} icon='close' style={{ alignSelf: 'flex-end' , margin: 10 }} />
                                <KeyboardAwareScrollView style={{ width: 300 , height: 400 , backgroundColor: 'white' }}>
                                        <RadioButton.Group onValueChange={newValue =>  handleRegion(newValue,1) } value={region1}>
                                        {
                                            _.sortBy(REGION).map( item => {
                                                return(
                                                    <RadioButton.Item key={item} label={item} value={item} color={colors.main} />
                                                )
                                            })
                                        }
                                        </RadioButton.Group>
                                </KeyboardAwareScrollView>
                            </Modal>
                        </Portal>

                        <Portal>
                            <Modal 
                                visible={region2Visible} 
                                onDismiss={ () => {setRegion2Visible(false)}}
                                contentContainerStyle= {{ alignItems : 'center' , justifyContent: 'center'   }}
                                >
                                <IconButton color='white' onPress={() => { setRegion2Visible(false) }} icon='close' style={{ alignSelf: 'flex-end' , margin: 10 }} />
                                <KeyboardAwareScrollView style={{ width: 300 , height: 400 , backgroundColor: 'white' }}>
                                        <RadioButton.Group onValueChange={newValue => handleRegion(newValue,2) } value={region2}>
                                        {
                                            _.sortBy(REGION).map( item => {
                                                return(
                                                    <RadioButton.Item key={item} label={item} value={item} color={colors.main} />
                                                )
                                            })
                                        }
                                        </RadioButton.Group>
                                </KeyboardAwareScrollView>
                            </Modal>
                        </Portal>

                        <CustomBar.A subtitle={'2.업체 정보를 알려주세요.'} />
                        <CustomView style={{ borderWidth: 1 , borderColor: colors.main , backgroundColor: colors.submain , paddingBottom: 30 , marginLeft: 10 , paddingRight: 10 , borderRadius: 5 , marginBottom: 20 }}>
                            <Text style={styles.description}>업체명</Text>
                            <TextInput 
                                theme={{  colors: { primary : colors.main  }   }}
                                outlineColor={colors.main}
                                style={styles.textInput}
                                // value={bossName}
                                mode='outlined'
                                onChangeText={value=>{setName(value)}}
                                placeholder='카#'
                            />
                            <Text style={styles.description}>주소</Text>
                            <TextInput  
                                left={<TextInput.Icon icon='home' color={colors.main} size={24}/>}
                                placeholder='주소를 선택하세요'
                                theme={{  colors: { primary : colors.main  }   }}
                                mode ='outlined'
                                outlineColor={colors.main}
                                style={styles.textInput}
                                editable={false}
                                onTouchEnd={() => { setVisible(true) }}
                                right= {<TextInput.Icon color={colors.main} name='magnify' onPress={ () => { setVisible(true) } }/>}
                                value={address}
                                onChangeText={ value=> setAddress(value)}
                            />
                            <TextInput  
                                placeholder='상세주소'
                                theme={{  colors: { primary : colors.main  }   }}
                                outlineColor={colors.main}
                                mode='outlined'
                                style={styles.textInput}    
                                // value={detailAddress}
                                onChangeText={ value=> setDetailAddress(value) }
                            />
                            <Text style={styles.description}>입찰지역</Text>
                            <Text style={{ marginLeft: 10 , padding: 3 , color: 'gray' }}>{'* 설정한 입찰지역은 이후 변경하실 수 없습니다.\n( 업체 주소이전의 경우 고객센터를 통해 변경가능 )'}</Text>
                            <Text style={styles.description}>입찰지역 1.</Text>
                            <Button
                                theme={{  colors: { primary : colors.main  }   }}
                                style={{ ...styles.textInput , height: 50 , borderColor: colors.main , justifyContent: 'center' }}
                                labelStyle={{ fontWeight: 'bold' , fontSize: 17 }}
                                onPress={() => { setRegion1Visible(true) }}
                                mode='outlined'
                                icon='chevron-down'
                                color={colors.main}
                            >
                                {region1}
                            </Button>
                            <Text style={styles.description}>입찰지역 2.</Text>
                            <Button
                                theme={{  colors: { primary : colors.main  }   }}
                                style={{ ...styles.textInput , height: 50 , borderColor: colors.main , justifyContent: 'center' }}
                                labelStyle={{ fontWeight: 'bold' , fontSize: 17 }}
                                onPress={() => { setRegion2Visible(true) }}
                                mode='outlined'
                                icon='chevron-down'
                                color={colors.main}
                            >
                                {region2}
                            </Button>
                        </CustomView>
                        <Button 
                            style={{ margin: 20 , marginTop: 10 , height: 50 , justifyContent: 'center' , borderColor: colors.main , borderWidth: 2 , borderRadius: 10 , width: '50%', alignSelf: 'center'  }} 
                            onPress={() => { requestSignIn() }}
                            disabled={!enabled}
                            mode='contained'
                            labelStyle={{ color: name.length && address.length && detailAddress.length  ? 'white' : colors.main }}
                            color={  name.length && address.length && detailAddress.length  ? colors.main : 'white' }
                            // disabled={ name.length && address.length && detailAddress.length ? false : true }
                            // color={colors.main}
                        >
                            가입하기
                        </Button>
                            
                
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



// 지역선택
const REGION =[
    '서울' , '인천' , '대전' , '대구' , '부산' , '광주' , '제주' , '수원' , '성남' , '의정부' , '안양' , '부천' , '광명' , '평택' , '동두천' , '안산' , '고양' , '과천' , '구리' , '남양주', '오산' , '시흥' , '군포' , '의왕', '하남' , '용인' , '파주'  , '이천' , '안성' , '김포' , '화성' , '광주(경기)' , '양주' , '포천' , '여주'
];