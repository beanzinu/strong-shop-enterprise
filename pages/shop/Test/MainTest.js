import React from 'react' ;
import messaging from '@react-native-firebase/messaging';
import { Button } from 'react-native-paper';
import styled from 'styled-components';
const Container = styled.SafeAreaView``;

export default function() {

    async function request() {
        const auth = await messaging().requestPermission();

        if (auth) {
            console.log('Permission Status:', auth);
        }

        // Register background handler
        messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });
    }


    return(
        <Container>
            <Button onPress={request}>테스트</Button>
        </Container>
    );
}