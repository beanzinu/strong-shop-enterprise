import React from 'react' ;
import styled from 'styled-components';
import Postcode from '@actbase/react-daum-postcode';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
// import auth from '@react-native-firebase/auth' 
// components
import { 
    Title , Divider , TextInput ,
    Modal , Portal , Provider ,
    Button ,
} 
from 'react-native-paper';
import { Alert } from 'react-native';
const View = styled.SafeAreaView``;

const styles = {
    TextInput : {
        marginTop: 20 , 
        width : '90%' ,
    } ,
    Title :  {
        fontWeight: 'bold' , 
        marginLeft: 10 , 
        fontSize: 25 ,
        marginBottom : 10
    }
}

export default function() {
    const [shopName,setShopName] = React.useState('');
    const [serialNum,setSerialNum] = React.useState('');
    const [represent,setRepresent] = React.useState('');
    const [date,setDate] = React.useState('');
    // const [serialNum,setSerialNum] = React.useState('1654300769');
    // const [represent,setRepresent] = React.useState('주윤혜');
    // const [date,setDate] = React.useState('20210331');
    const [verify,setVerify] = React.useState(false);

    const [showVerify,setShowVerify] = React.useState(false) ;
    const [verifyCode,setVerifyCode] = React.useState('');
    const [confirm,setConfirm] = React.useState('') ;

    const [phoneNum,setPhoneNum] = React.useState('');
    const [address,setAddress] = React.useState('');
    const [detailAddress,setDetailAddress] = React.useState('');
    // modal
    const [visible,setVisible] = React.useState(false) ;

    const showModal = () => setVisible(true) ;
    const hideModal = () => setVisible(false) ;
    
    const test = () =>  {
        if (verify) return;

        axios({
            method: 'post' ,
            url :  'https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=Te7HPGFjEojhi4%2B4sRjikWXlBCD1Bg%2FAVQzCa9A4gUihNPh%2FRxaFkxk2IJ670MBNRDarlpFsPX67kda7XMXaLA%3D%3D' ,
            data : {
                businesses : [
                    {
                        b_no : serialNum ,
                        start_dt : date ,
                        p_nm : represent ,
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
                setVerify(true) 
                Alert.alert('인증완료');
            }
            else Alert.alert('유효하지 않은 번호입니다.','다시 한번 확인해주세요.');
        }) 
        .catch(e => Alert.alert('필수사항을 입력해주세요.') ) ;
    }

    //test
 // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {

    try {
       const confirmation = await auth().signInWithPhoneNumber(phoneNumber) ;
       if ( confirmation != null ) {
           setConfirm(confirmation) ;
           setShowVerify(true);
       }
    }
    catch (e) {
        console.log(e) ;
    }




  }

  async function confirmCode(code) {
    try {
      await confirm.confirm(code);
      alert('yes');
    } catch (error) {
      console.log('Invalid code.');
    }
  }

    return(
        <Provider>
        <View>
        <KeyboardAwareScrollView>
            <Portal>
                <Modal 
                    visible={visible} 
                    onDismiss={hideModal}
                    style= {{ alignItems : 'center' , justifyContent: 'center'  }}
                >
                    <Postcode
                    style={{ width : 300 , height: 500 }}
                    jsOptions={{ animated: true }}
                    onSelected={data => {setAddress(data.roadAddress) , hideModal() } }
                    />
                </Modal>
            </Portal>

            <Title style={styles.Title}>
                {'안녕하세요,\n회원님의 샵을 등록하기위해\n몇가지 정보를 입력해 주세요.'}
            </Title>
            <Divider/>
            <View style={{ alignItems: 'center' }}>
                <TextInput 
                    style={styles.TextInput}
                    value={shopName} 
                    onChangeText= { value => {setShopName(value)} } 
                    label='업체명'
                    mode='outlined'
                    placeholder='최강샵'
                />
                <TextInput 
                    style={styles.TextInput}
                    value={serialNum} 
                    onChangeText= { value => {setSerialNum(value)} } 
                    keyboardType='number-pad'
                    label='사업자등록번호'
                    mode='outlined'
                    placeholder='10자리를 입력하세요.( - 없이 입력 )'
                />
                <TextInput 
                    style={styles.TextInput}
                    value={date} 
                    onChangeText= { value => {setDate(value)} } 
                    keyboardType='number-pad'
                    label='개업일자'
                    mode='outlined'
                    placeholder='YYYYMMDD형식으로 입력하세요.'
                />
                <TextInput 
                    style={styles.TextInput}
                    value={represent} 
                    onChangeText= { value => {setRepresent(value)} } 
                    label='대표자성명'
                    mode='outlined'
                    placeholder='홍길동'
                />
                {/* <TextInput 
                    style={styles.TextInput}
                    value={represent} 
                    onChangeText= { value => {setRepresent(value)} } 
                    label='대표자성명'
                    mode='outlined'
                    placeholder='홍길동'
                />
                <TextInput 
                    style={styles.TextInput}
                    value={date} 
                    onChangeText= { value => {setDate(value)} } 
                    keyboardType='numeric'
                    label='개업일자'
                    mode='outlined'
                    placeholder='YYYYMMDD형식으로 입력하세요.'
                /> */}
                 <Button 
                    style={{ marginTop : 20 }}
                    icon='check-outline'
                    mode='outlined'
                    onPress={ () => { test() }}
                    color={ verify? 'green' : '' }
                    >
                인증받기
                </Button>
                <TextInput
                    style={styles.TextInput}
                    label='전화번호'
                    mode='outlined'
                    value ={phoneNum} 
                    onChangeText = { value => setPhoneNum(value) }
                    keyboardType='number-pad'
                    onFocus={() => { }}
                    onEndEditing={ () => { signInWithPhoneNumber(phoneNum) }}
                />
                {
                    showVerify && (
                        <TextInput
                        style={styles.TextInput}
                        label='인증번호'
                        mode='outlined'
                        value ={verifyCode} 
                        onChangeText = { value => setVerifyCode(value) }
                        keyboardType='number-pad'
                        onFocus={() => { }}
                        onEndEditing={ () => { confirmCode(verifyCode) }}
                        />
                    )
                }
              
                <TextInput
                    style={styles.TextInput}
                    label='주소를 검색하세요.'
                    mode='outlined'
                    value ={address}
                    editable={false}
                    right= {<TextInput.Icon name='magnify' onPress={ () => showModal() }/>}
                    onFocus={() => { }}
                />
                <TextInput 
                    style={styles.TextInput}
                    value={detailAddress} 
                    onChangeText= { value => { setDetailAddress(value) } } 
                    label='상세주소'
                    mode='outlined'
                    placeholder='상세주소를 입력하세요.'
                />
           </View>
            <Button 
            style={{ marginTop : 20 }}
            icon='plus-box'
            mode='outlined'
            onPress={ () => { alert('등록완료') }}
            >
            등록하기
            </Button>
        </KeyboardAwareScrollView>
        </View>
        </Provider>
    );
}