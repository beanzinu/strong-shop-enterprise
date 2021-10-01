import React from "react";
import styled from "styled-components";
import { Title , Appbar, Avatar , Switch } from "react-native-paper";
import colors from "../../color/colors";

const Row = styled.View`
    align-items: center;
    flex-direction: row;
    width: 100%;
    height: 70px;
    border:1px lightgray;
`;

const styles={
    title: {
        alignSelf: 'center' ,
        fontFamily : 'DoHyeon-Regular',
        fontSize: 25 ,
        padding: 10 ,
    } ,
    image : {
        alignSelf: 'center' ,
        margin: 20 ,
        backgroundColor: 'transparent'
    }
}

export default function( props ) {
    return(
        <>
        <Appbar.Header style={{ backgroundColor: colors.main }}>
        <Appbar.BackAction onPress={()=>{ props.navigation.goBack() }}/>        
        </Appbar.Header>  
            <Avatar.Image style={styles.image} source={{ uri : 'https://picsum.photos/0'}} size={60}/>
            <Title style={styles.title}>최강샵</Title>
            <Row>
                <Title style={styles.title}>광고 수신 동의</Title>
                <Switch style={{ position: 'absolute' , right: 10 }}/>
            </Row>
            <Row>
                <Title style={styles.title}>광고 수신 동의</Title>
                <Switch style={{ position: 'absolute' , right: 10 }}/>
            </Row>
            <Row>
                <Title style={styles.title}>광고 수신 동의</Title>
                <Switch style={{ position: 'absolute' , right: 10 }}/>
            </Row>
        </>
    );
}