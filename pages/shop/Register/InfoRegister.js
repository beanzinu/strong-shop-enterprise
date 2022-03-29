import React from 'react' ;
import styled from 'styled-components';
import { Title , TextInput , Button , Avatar , Provider , Portal , Modal, Appbar} from 'react-native-paper';
import colors from '../../../color/colors';
import { Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Postcode from '@actbase/react-daum-postcode';
import analytics from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app'

// Async
import API from '../../../server/API';
import store from '../../../storage/store';
import axios from 'axios';
import fetch from '../../../storage/fetch';
import server from '../../../server/server';
import AppContext from '../../../storage/AppContext';

const Input = styled.TextInput`
    border: 2px ${colors.main};
    height : 200px;
    font-size : 15px;
    padding: 10px;
    margin: 10px;
    border-radius: 10px;
`;

const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;
const View = styled.View``;

const styles = {
    title : {
        fontWeight : 'bold' ,
        padding: 10 ,
        // marginTop: 10 ,
        color : colors.main , 
        fontFamily : 'Jua-Regular' ,
        fontSize: 27
    } ,
    textInput : {
        fontSize: 15 , backgroundColor: 'white'
    } ,

}

export default function( props ) {
    const [info,setInfo] = React.useState(null);
    const [contact,setContact] = React.useState(null);
    const [blogUrl,setBlogUrl] = React.useState(null);
    const [siteUrl,setSiteUrl] = React.useState(null);
    const [snsUrl,setSnsUrl] = React.useState(null);
    const [address,setAddress] = React.useState(null);
    const [detailAddress,setDetailAddress] = React.useState(null);
    const [inputHeight,setInputHeight] = React.useState(200);
    let latitude = null ;
    let longitude = null ;
    const [visible,setVisible] = React.useState(false) ;
    const MyContext = React.useContext(AppContext) ;

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
                resolve();
            }
            )
            .catch(e => {
                latitude = 37.5 ;
                longitude = 126.9 ;

                reject(e);
            } ) ;
        }) ;
    
    }

    const addInfo = async () => {

        // 사전체크
        if ( info?.length > 2000 ) {
            Alert.alert('글자수 제한','2000자 미만으로 해주세요.');
            return;
        }

        if ( address != null ) await getCoord(address).catch( e => { }) ;

        let data = {
            introduction : info ,
            contact: contact ,
            blogUrl : blogUrl ,
            siteUrl : siteUrl ,
            snsUrl : snsUrl ,
            address : address ,
            detailAddress : detailAddress ,
            latitude: latitude ,
            longitude: longitude
        } ;

        try {   
            API.post('/api/companyinfo',data)
            .then ( async (res)=>  {
                // 저장성공시
                await store('Info',data) ;
                MyContext.setInfoRefresh(!MyContext.infoRefresh) ;
                props.navigation.goBack();
            })
            .catch( e =>  {
                //
                // console.log(e);
                Alert.alert('다시 시도해주세요.');
            })

        }
        catch {
            //
            Alert.alert('다시 시도해주세요.');
        }

        

    }

    // 기존 정보를 수정
    React.useEffect( () => { 
            // PUT
            setInfo(props.route.params?.data?.introduction) ;
            setBlogUrl(props.route.params?.data?.blogUrl) ;
            setSiteUrl(props.route.params?.data?.siteUrl) ;
            setSnsUrl(props.route.params?.data?.snsUrl) ;
            setAddress(props.route.params?.data?.address);
            setDetailAddress(props.route.params?.data?.detailAddress);
    },[]);

    return(
        <Provider>
        <KeyboardAwareScrollView ref={ ref => this.flatList = ref} style={{ backgroundColor: 'white' }}>
            <Portal>
                <Modal 
                    visible={visible} 
                    onDismiss={ () => {setVisible(false)}}
                    style= {{ flex:1 , alignItems : 'center' , justifyContent: 'center'  }}
                    >
                    <KeyboardAwareScrollView>
                        <Postcode
                        style={{ width : 300 , height: 500 , marginTop: 50 }}
                        jsOptions={{ animated: true }}
                        onSelected={data => {setAddress(data.roadAddress) , setVisible(false)  } }
                        />
                    </KeyboardAwareScrollView>
                </Modal>
            </Portal>
            <Appbar.Header style={{ backgroundColor: colors.main , elevation : 0 }}>
                <Appbar.BackAction color='white' size={20} onPress={() => { props.navigation.goBack() }}/>
                {/* <Appbar.Content title='업체 소개'  style={{ flex:1 }} titleStyle={{ color: 'white' }} /> */}
                <View style={{ right: 0 , position: 'absolute' }}>
                    <Button color='white' labelStyle={{ fontSize: 17 }}  onPress={addInfo} >수정하기</Button>
                </View>
            </Appbar.Header>
            <Row style={{ alignItems: 'center' , marginTop: 20 }}> 
                <Title style={ styles.title }> 업체 소개를 해주세요.</Title>
                <Title style={{ color: info?.length > 2000 ? 'red' : 'lightgray' , fontSize: 15 }}>( { info == null ? '0' : info?.length}/2000 )</Title>
                {/* <Button color='red' 
                style={{ position: 'absolute' , right: 0  }}
                onPress={ () => { Alert.alert('모두 지우시겠습니까?','',[
                    {
                        text : '확인' ,
                        onPress : () => setInfo('')
                    } , 
                    {
                        text : '취소'
                    }
                ])  } } 
                >
                    모두 지우기
                </Button> */}
            </Row>
            <Input
                multiline={true}
                value= {info}
                onChangeText = { value => setInfo(value) }
                style={{ height: inputHeight }}
                onContentSizeChange={e=>{
                    if ( e.nativeEvent.contentSize.height > inputHeight ) setInputHeight(inputHeight+50);
                }}
                placeholder='업체 소개를 해주세요.'
            />
            <TextInput  left={<TextInput.Icon icon='phone' size={24}/>}
                style={{...styles.textInput , marginTop: 10 }}
                placeholder='업체 전화번호'
                theme={{ colors: { primary: colors.main , background: 'white' }}}
                keyboardType='number-pad'
                value={contact}
                onChangeText={ value=> setContact(value)  }
            />
            <TextInput  left={<TextInput.Icon icon='link' size={24}/>}
                style={styles.textInput}
                placeholder='블로그/카페 주소 (ex) blog.naver.com/strongshop'
                theme={{ colors: { primary: colors.main , background: 'white' }}}
                // keyboardType='email-address'
                value={blogUrl}
                onChangeText={ value=> setBlogUrl(value) }
            />
            <TextInput  left={<TextInput.Icon icon='web' size={24}/>}
                style={styles.textInput}
                placeholder='자체사이트 주소 (ex) www.strongshop.com'
                theme={{ colors: { primary: colors.main , background: 'white' }}}
                // keyboardType='email-address'
                value={siteUrl}
                onChangeText={ value=> setSiteUrl(value) }
            />
            <TextInput  left={<TextInput.Icon icon='instagram' size={24}/>}
                style={styles.textInput}
                placeholder='인스타그램 주소 ( 인스타아이디만 입력 )'
                theme={{ colors: { primary: colors.main , background: 'white' }}}
                // keyboardType='email-address'
                value={snsUrl}
                onChangeText={ value=> setSnsUrl(value) }
            />
            <Title style={styles.title}>주소</Title>
            <TextInput  left={<TextInput.Icon icon='home' size={24}/>}
                style={{ ...styles.textInput }}
                placeholder='주소를 선택하세요'
                theme={{ colors: { primary: colors.main , background: 'white' }}}
                editable={false}
                right= {<TextInput.Icon name='magnify' onPress={ () => { setVisible(true) } }/>}
                on
                // onPressIn={() => { setVisible(true) }}
                value={address}
                onChangeText={ value=> setAddress(value)}
            />
            <TextInput  
                placeholder='상세주소'
                style={{ ...styles.textInput, marginBottom: 40 }}
                theme={{ colors: { primary: colors.main , background: 'white' }}}
                value={detailAddress}
                onChangeText={ value=> setDetailAddress(value) }
                // onEndEditing={() => this?.flatList?.scrollToPosition(0) }
            />

            {/* <Button onPress={ () => { addInfo() }} mode='outlined'
                color = { colors.main }
                mode={ 'contained' }
                style={{ margin: 10 }}
            >
                수정하기
            </Button> */}
        </KeyboardAwareScrollView> 
        </Provider>
    );
}