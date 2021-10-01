import React from 'react' ;
import styled from 'styled-components';
import { Title , TextInput , Button , Avatar } from 'react-native-paper';
import colors from '../../../color/colors';
import { Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

    const addInfo = async () => {
        data = {
            info : info ,
            blogUrl : blogUrl ,
            siteUrl : siteUrl ,
            snsUrl : snsUrl
        } ;
        // 서버에게 전달

        // 캐시 
        try {
            store('Info',data) ;
            props.route.params.data = data;
            props.navigation.goBack();
        }
        catch {
            console.log("Info 저장 에러");
        }

        

    }


    React.useEffect( () => { 
        setInfo(props.route.params.data.info) ;
        setBlogUrl(props.route.params.data.blogUrl) ;
        setSiteUrl(props.route.params.data.siteUrl) ;
        setSnsUrl(props.route.params.data.snsUrl) ;
    },[]);

    return(
        <KeyboardAwareScrollView>
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

            <Button onPress={ () => { addInfo() }} mode='outlined'
                color = { colors.main }
                mode={ 'contained' }
                style={{ margin: 10 }}
            >
                수정하기
            </Button>
        </KeyboardAwareScrollView> 
    );
}