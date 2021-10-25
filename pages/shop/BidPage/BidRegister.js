import React from 'react' ;
import styled from 'styled-components';
import { Title , IconButton , Button , TextInput, Avatar , Chip } from 'react-native-paper';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../../color/colors';
import { Alert } from 'react-native';
import Collapsible from 'react-native-collapsible';

const Container = styled.SafeAreaView``;
const Text = styled.Text``;
const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;
// const TextInput = styled.TextInput`
//     width: 90% ;
//     height: 50px;
//     margin: 10px;
//     padding: 10px;
//     border: 1px lightgray;
//     border-radius: 10px;
// `;


const styles= {
    title : {
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30 ,
        margin: 10 ,
        marginTop: 20 ,
        marginBottom: 20 , 
        color: colors.main,
    } ,
    label : {
        margin: 10 ,
        fontFamily : 'DoHyeon-Regular' , 
        paddingTop: 10 ,
        fontSize: 25
    } ,
    theme : { 
        colors : {
            underlineColor : colors.main ,
            primary : colors.main ,
            background: 'white' ,
        }
    } ,
    chipStyle : {
        backgroundColor: 'rgb(220,220,220)',
        margin : 3
    } ,
    chipTextStyle : {
    } , 
}

export default function( props ) {
    const [data,setData] = React.useState({}) ;
    const [collapsed,setCollapsed] = React.useState(true);

    React.useEffect(() => {
    
        // BidPage 에서 data를 받아옴
        setData( props.route.params.data ) ;

        setTimeout( () => {
            setCollapsed(false);
        },500);


    },[]);

    checkRegister = () => {
        // 모든 TextInput들이 입력되었을 때 입찰여부를 물어봄.
        // true

        Alert.alert('입찰하시겠습니까?','',[
            {
                text: '확인',
                onPress: () => { props.navigation.goBack() }
            },
            {
                text: '취소'
            }
        ])
        //false
        // alert('입찰정보를 모두 입력해주세요.')
    }

    return(                  
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
            <Row style={{ borderBottomWidth: 1 , borderBottomColor: 'gray' }}>
                <Avatar.Icon icon='car-arrow-left' color='red' style={{ backgroundColor: 'transparent'}} />
                <Title style={{ ...styles.title  }}>{data.carName}</Title>
                <IconButton icon={ collapsed ? 'chevron-down' : 'chevron-up'} 
                    onPress={ () => { setCollapsed(!collapsed) }}
                />
            </Row>
            <Collapsible 
                collapsed={collapsed}
                collapsedHeight={0}
                duration={2000}
            >
            {
                data.tinting && (
                    <>
                    <Title style={styles.label}>틴팅</Title>
                    <Row>
                        { data.detailTinting.solarguard && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>솔라가드</Chip>}
                        { data.detailTinting.rayno && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>레이노</Chip>}
                        { data.detailTinting.llumar && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>루마</Chip>}
                        { data.detailTinting.rainbow && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>레인보우</Chip>}
                    </Row>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.price.focus() }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.price = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                    />
                    </>
                )
            }
            {
                data.blackbox && (
                    <>
                    <Title style={styles.label}>블랙박스</Title>
                    <TextInput placeholder='제품명' 
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                    />
                    <TextInput placeholder='가격' 
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                    />
                    </>
                )
            }
            {
                data.ppf && (
                    <>
                    <Title style={styles.label}>PPF</Title>
                    <TextInput placeholder='제품명' 
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                    />
                    <TextInput placeholder='가격' 
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                    />
                    </>
                )
            }
            {
                data.glass && (
                    <>
                    <Title style={styles.label}>유리막코팅</Title>
                    <TextInput placeholder='제품명' 
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                    />
                    <TextInput placeholder='가격' 
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                    />
                    </>
                )
            }
            {
                data.seat && (
                    <>
                    <Title style={styles.label}>가죽코팅</Title>
                    <TextInput placeholder='제품명' 
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                    />
                    <TextInput placeholder='가격' 
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                    />
                    </>
                )
            }
            </Collapsible>
            
            <Title style={styles.label}>최종가격 :</Title>
            <Button color = { colors.main } 
                style={{ margin : 3 , marginTop: 20 , marginBottom: 20 }}
                labelStyle = {{ fontSize: 17 }}
                onPress={ () => { checkRegister() }}
                mode='contained' >
                    입찰하기
            </Button>
        </KeyboardAwareScrollView>
    );
}