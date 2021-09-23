import React from 'react' ;
import styled from 'styled-components';
import { Title , TextInput , Button , Avatar } from 'react-native-paper';
import colors from '../../../color/colors';
import { Alert } from 'react-native';

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

    React.useEffect( () => { 
        setInfo(props.route.params.data.introduction) ;
    },[]);

    return(
        <> 
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
            <Button onPress={ () => { alert('서버에게 제출') }} mode='outlined'
                color = { colors.main }
                mode={ info.length > 0 ? 'contained' : 'outlined' }
                style={{ margin: 10 }}
            >
                수정하기
            </Button>
        </>
    );
}