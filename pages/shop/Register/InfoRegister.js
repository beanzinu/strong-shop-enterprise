import React from 'react' ;
import { Title , TextInput , Button , Avatar } from 'react-native-paper';

const styles = {
    title : {
        fontWeight : 'bold' ,
        padding: 10 ,
    } ,
    textInput : {
        borderWidth: 1 ,
        borderColor: 'rgb(89,13,229)' ,
    }
}

export default function() {
    const [info,setInfo] = React.useState('');

    return(
        <> 
            <Title style={ styles.title }> 업체 소개를 해주세요.</Title>
            <TextInput 
                value= { info }
                style={ styles.textInput }
                onChangeText= { value => setInfo(value) }
                label = '업체 소개'
                left = {<TextInput.Icon name='border-color' size={ 20 } />}
                placeholder='업체에 대해 소개해주세요.'
                multiline={true}
            />
            <Button onPress={ () => { alert('서버에게 제출') }} mode='outlined'>
                수정하기
            </Button>
        </>
    );
}