import React from 'react' ;
import { Animated, PanResponder } from "react-native";
import styled from 'styled-components';
import colors from '../../../color/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Title , Divider , Button } from 'react-native-paper';

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
    const [option,setOption] = React.useState('');


    React.useEffect(() => { 
        
        alert( props.route?.params.option) ;
        setOption( props.route?.params.option ) ;

        if ( props.route?.params.data != null) {
          setName( props.route.params.data.name );
          setDescription( props.route.params.data.description );
        }

    },[]);

    const addItem = async () =>  {


        data = {  name : name , description : description } ;

        // 서버
        // 1. 틴팅~기타 옵션과 함께 데이터들을 포함시켜 전송
        // 1-1) 성공 시 ProductRegister에서 data 리로드
        // 1-2) 실패 시 화면에 표시 후 다시시도 추천 


        // await fetch('Product')
        // .then( res =>  {
        //     // option => 틴팅 ~ 기타
        //     tmp = res[option] ;
        //     // 새로운 옵션항목 저장
        //     if ( tmp == null ) {
        //         addData = { } ;
        //         addData[option] = [{ name: name , description : description}];

        //         store('Product',addData)
        //         .then(() => props.navigation.goBack())
        //         .catch(() => {    })

        //     }
        //     // 기존항목에 추가
        //     else {
        //         data = { name : name , description : description } ;
        //         tmp.push(data);
        //         newData = { ...res  } ;
        //         newData[option] = tmp ;

        //         store('Product', newData) 
        //         .then(() => props.navigation.goBack())
        //         .catch(() => { })
        //     }
        // }) 
        // .catch (  async () => {
        //     addData = { } ;
        //     addData[option] = [{ name: name , description : description}];
        //     // 캐시된 데이터가 하나도 없을때
        //     await store('Product',addData)
        //     .then(() => { props.navigation.goBack() })
        //     .catch(() => {  })


        // })

        props.route.params.reload();

    }

    return(
    <KeyboardAwareScrollView style={{ backgroundColor: 'white'}}>
        <Title style={styles.title}>{props.route.params.itemOption == 'add'? '항목 추가' : '항목 수정'}</Title>
        <Divider style={styles.divider} />
            <Label>제품명</Label>
            <TextInput
                value={name}
                placeholder='제품명'
                onChangeText={value=>{setName(value)}}
            />
        <Divider style={styles.divider} />
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
        >{props.route.params.itemOption == 'add'? '등록하기' : '수정하기'}</Button>
    </KeyboardAwareScrollView>
    );
}