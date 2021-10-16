import React from 'react' ;
import { Button } from 'react-native-paper';
import styled from 'styled-components';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const Container = styled.SafeAreaView``;

export default function() {

    async function request() {
        
    }

    const [permissions, setPermissions] = React.useState({});

    React.useEffect(() => {
      PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    });

    const onRemoteNotification = (notification) => {
        const isClicked = notification.getData().userInteraction === 1;
    
        if (isClicked) {
          // Navigate user to another screen
            alert('ok');
        } else {
          // Do something else with push notification
        }
      };

    return(
        <Container>
            <Button onPress={request}>테스트</Button>
        </Container>
    );
}