import React from 'react' ;
import styled from 'styled-components';
import { Title , Divider , Button } from 'react-native-paper';
import colors from '../../../color/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// async
import fetch from '../../../storage/fetch';
import store from '../../../storage/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Label = styled.Text`
    margin-left: 10px;
    font-size: 17px;
    font-weight: bold;
`;
const TextInput = styled.TextInput`
    width: 90%;
    height: 50px;
    margin: 10px;
    border:1px lightgray;
    padding: 10px;
`;
const styles = {
    title : {
        fontSize: 30 ,
        fontWeight: 'bold' ,
        padding : 10 ,
        color: colors.main
    } ,
    divider : {
        borderWidth: 1 , 
        borderColor: 'lightgray' , 
        margin: 10 
    }
}
export default function( props ) {
    const [name,setName] = React.useState('');
    const [description,setDescription] = React.useState('');

    React.useEffect(() => { 

        if ( props.route.params != null) {
            setName( props.route.params.data.name );
            setDescription( props.route.params.data.description );
        }

    },[]);

    const addItem = async () =>  {


        data = {  name : name , description : description } ;

        await fetch('Product')
        .then( res =>  {
            tmp = res.tinting ;
            tmp.push(data);
            store('Product',{ tinting: tmp});
         
        }) 
        .catch (  async () => {
            data = { '최강샵' : { tinting: [{  name : name , description : description }] } } ;
            await store('Product',data);
        })

        // await store('Product',data) ;
    }

    return(
    <KeyboardAwareScrollView style={{ backgroundColor: 'white'}}>
        <Title style={styles.title}> 항목 추가 </Title>
        <Divider style={styles.divider} />
            <Label>제품명</Label>
            <TextInput
                value={name}
                placeholder='제품명'
                onChangeText={value=>{setName(value)}}
            />
        <Divider style={styles.divider} />
        {/* <Label>가격</Label>
            <TextInput/>
        <Divider style={styles.divider} /> */}
        <Label>설명</Label>
            <TextInput multiline={true} style={{height: 200 }} 
                value={description}
                placeholder='간단한 설명을 추가해주세요.'
                onChangeText={value=>{setDescription(value)}}
            />
        <Divider style={styles.divider} />

        <Button icon='plus' mode='contained' color={colors.main} 
            onPress={ () =>  { addItem() } }
            style={{ height: 50 , justifyContent: 'center' }}
        >등록하기</Button>
    </KeyboardAwareScrollView>
    );
}