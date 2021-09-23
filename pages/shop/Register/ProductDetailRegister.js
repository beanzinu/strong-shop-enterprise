import React from 'react' ;
import styled from 'styled-components';
import { Title , Divider , Button } from 'react-native-paper';
import colors from '../../../color/colors';
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
    return(
    <>
        <Title style={styles.title}> 항목 추가 </Title>
        <Divider style={styles.divider} />
            <Label>제품명</Label>
            <TextInput/>
        <Divider style={styles.divider} />
        <Label>가격</Label>
            <TextInput/>
        <Divider style={styles.divider} />
        <Label>설명</Label>
            <TextInput/>
        <Divider style={styles.divider} />

        <Button icon='plus' mode='contained' color={colors.main} 
            onPress={ () =>  { } }
            style={{ height: 50 , justifyContent: 'center' }}
        >추가하기</Button>
    </>
    );
}