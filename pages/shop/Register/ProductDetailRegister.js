import React from 'react' ;
import { Alert, Animated, PanResponder } from "react-native";
import styled from 'styled-components';
import colors from '../../../color/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Title , Divider , Button } from 'react-native-paper';
import axios from 'axios';
import server from '../../../server/server';
import fetch from '../../../storage/fetch';
import AppContext from '../../../storage/AppContext';

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
        color: 'black' ,
        marginTop: 10
    } ,
    divider : {
        borderWidth: 1 , 
        borderColor: 'lightgray' , 
        margin: 10 
    }
}

function headerOptions(option) {
    if ( option == 'tinting') return '틴팅' ;
    else if ( option == 'ppf') return 'PPF' ;
    else if ( option == 'blackbox') return '블랙박스' ;
    else if ( option == 'battery') return '보조배터리' ;
    else if ( option == 'afterblow') return '애프터블로우' ;
    else if ( option == 'deafening') return '방음' ;
    else if ( option == 'wrapping') return '랩핑' ;
    else if ( option == 'glasscoating') return '유리막코팅' ;
    else if ( option == 'undercoating') return '언더코팅' ;
    else if ( option =='etc') return '기타' ;
}

export default function( props ) {
    const [name,setName] = React.useState('');
    const [description,setDescription] = React.useState('');
    const [option,setOption] = React.useState('');
    const [id,setId] = React.useState(0);
    const [requestOption,setRequestOption] = React.useState(1) ;
    const MyContext = React.useContext(AppContext) ;


    React.useEffect(() => { 
        
        
        
        setOption( props.route?.params.option ) ;
        
        if ( props.route.params.itemOption == 'fix' )  {
            setRequestOption(2) ;
            setId( props.route.params.data.id ) ;
        }
        

        if ( props.route?.params.data != null) {
          setName( props.route.params.data.name );
          setDescription( props.route.params.data.additionalInfo );
        }

    },[]);


    const addItem = async () =>  {

        if ( name.length == 0 ) {
            Alert.alert('등록 불가','제품명을 입력해주세요.'); 
            return;
        }

        data = {  name : name , additionalInfo : description , id : id } ;

        try {
           const token =  await fetch('auth') ;
           const auth = token.auth ;

           axios({
                url: `${server.url}/api/product/${option}` ,
                method: requestOption == 1  ? 'post' : 'put' ,
                data: data ,
                headers : { Auth : auth }
            })
            .then( res => {
                    MyContext.setProductRefresh(!MyContext.productRefresh);
                    props.navigation.goBack();
            })
            .catch( e =>  {
                //
            })
        }
        catch { 
            console.log('취급상품 등록에러');
        }

        


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

        // props.route.params.reload();

    }

    return(
    <KeyboardAwareScrollView style={{ backgroundColor: 'white'}}>
        <Title style={styles.title}><Title style={{ ...styles.title , color: 'gray' }}>[{headerOptions(option)}]</Title> {props.route.params.itemOption == 'add'? '항목 추가' : '항목 수정'}</Title>
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
            style={{ height: 50 , justifyContent: 'center' , margin: 5 }}
            labelStyle={{ color: 'white'}}
        >{props.route.params.itemOption == 'add'? '등록하기' : '수정하기'}</Button>
    </KeyboardAwareScrollView>
    );
}