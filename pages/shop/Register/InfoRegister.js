import React from 'react' ;
import styled from 'styled-components';
import { Title , TextInput , Button , Avatar , Provider , Portal , Modal} from 'react-native-paper';
import colors from '../../../color/colors';
import { Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Postcode from '@actbase/react-daum-postcode';
// Async
import store from '../../../storage/store';

const Input = styled.TextInput`
    border: 3px ${colors.main};
    height : 200px;
    font-size : 15px;
    padding: 10px;
    margin: 10px;
`;

const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;

const styles = {
    title : {
        fontWeight : 'bold' ,
        padding: 10 ,
        color : colors.main , 
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30
    } ,
    textInput : {
        borderWidth: 1 ,
        borderColor: colors.main ,
        color : colors.main ,
    }
}

export default function( props ) {
    const [info,setInfo] = React.useState('');
    const [blogUrl,setBlogUrl] = React.useState('');
    const [siteUrl,setSiteUrl] = React.useState('');
    const [snsUrl,setSnsUrl] = React.useState('');
    const [address,setAddress] = React.useState('');
    const [detailAddress,setDetailAddress] = React.useState('');

    const [visible,setVisible] = React.useState(false) ;

    const addInfo = async () => {
        data = {
            info : info ,
            blogUrl : blogUrl ,
            siteUrl : siteUrl ,
            snsUrl : snsUrl ,
            address : address ,
            detailAddress : detailAddress ,
        } ;
        // 서버에게 전달

        // 캐시 
        try {
            store('Info',data) ;
            props.navigation.goBack();
        }
        catch {
            console.log("Info 저장 에러");
        }

        

    }

    // 기존 정보를 수정
    React.useEffect( () => { 
        setInfo(props.route.params?.data?.info) ;
        setBlogUrl(props.route.params?.data?.blogUrl) ;
        setSiteUrl(props.route.params?.data?.siteUrl) ;
        setSnsUrl(props.route.params?.data?.snsUrl) ;
        setAddress(props.route.params?.data?.address);
        setDetailAddress(props.route.params?.data?.detailAddress);
    },[]);

    return(
        <Provider>
        <KeyboardAwareScrollView>
            <Portal>
                <Modal 
                    visible={visible} 
                    onDismiss={ () => {setVisible(false)}}
                    style= {{ alignItems : 'center' , justifyContent: 'center'  }}
                >
                    <Postcode
                    style={{ width : 300 , height: 500 }}
                    jsOptions={{ animated: true }}
                    onSelected={data => {setAddress(data.roadAddress) , setVisible(false) } }
                    />
                </Modal>
            </Portal>
            <Row>
                <Title style={ styles.title }> 업체 소개를 해주세요.</Title>
                <Button color='red' 
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
                </Button>
            </Row>
            <Input
                multiline={true}
                value= {info}
                onChangeText = { value => setInfo(value) }
                placeholder='업체 소개를 해주세요.'
            />
            <TextInput  left={<TextInput.Icon icon='link' size={24}/>}
                placeholder='(선택)블로그/카페 주소를 입력하세요.'
                theme={{ colors: { primary: colors.main , background: 'white' }}}
                keyboardType='email-address'
                value={blogUrl}
                onChangeText={ value=> setBlogUrl(value) }
            />
            <TextInput  left={<TextInput.Icon icon='web' size={24}/>}
                placeholder='(선택)자체사이트 주소를 입력하세요.'
                theme={{ colors: { primary: colors.main , background: 'white' }}}
                keyboardType='email-address'
                value={siteUrl}
                onChangeText={ value=> setSiteUrl(value) }
            />
            <TextInput  left={<TextInput.Icon icon='instagram' size={24}/>}
                placeholder='(선택)SNS 주소를 입력하세요.'
                theme={{ colors: { primary: colors.main , background: 'white' }}}
                keyboardType='email-address'
                value={snsUrl}
                onChangeText={ value=> setSnsUrl(value) }
            />
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
                value={detailAddress}
                onChangeText={ value=> setDetailAddress(value) }
            />

            <Button onPress={ () => { addInfo() }} mode='outlined'
                color = { colors.main }
                mode={ 'contained' }
                style={{ margin: 10 }}
            >
                수정하기
            </Button>
        </KeyboardAwareScrollView> 
        </Provider>
    );
}