import React from 'react' ;
import styled from 'styled-components';
import { Title , Divider , Button , TextInput, Avatar } from 'react-native-paper';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../../color/colors';

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
        color: colors.main
    } ,
    label : {
        margin: 10 ,
        fontFamily : 'DoHyeon-Regular' , 
        paddingTop: 10 
    } ,
    theme : { 
        colors : {
            underlineColor : colors.main ,
            primary : colors.main ,
            background: 'white' ,
        }
    }
}

export default function( props ) {
    const [data,setData] = React.useState({}) ;

    React.useEffect(() => {
    
        // BidPage 에서 data를 받아옴
        setData( props.route.params.data ) ;

    },[]);

    return(                  
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
            <Row>
                <Avatar.Icon icon='car-arrow-left' color='red' style={{ backgroundColor: 'transparent'}} />
                <Title style={{ ...styles.title  }}>{data.carName}</Title>
            </Row>
            {
                data.tint && (
                    <>
                    <Title style={styles.label}>틴팅</Title>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
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
            
            <Button color = { colors.main } 
                style={{ marginTop : 10 , height: 50 }}
                mode='contained' >
                    입찰하기
            </Button>
        </KeyboardAwareScrollView>
    );
}