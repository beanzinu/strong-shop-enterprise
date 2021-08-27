import React from 'react' ;
import styled from 'styled-components';
import { Avatar, Card, List , Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const Row = styled.View`
    flex-direction: row;
    height: 50px ;

    align-items: center;

`;
const Text = styled.Text``;

const styles = {
    userName : {
        fontWeight : 'bold' ,
        fontSize: 20 ,
        padding: 10
    } ,
    image : {
        margin : 10, 
        height: 150 
    } ,
    text : {
        fontSize: 15 
    }

}

const DATA = [
    {
        avatar : 'https://picsum.photos/0' ,
        userName : '진우' ,
        uri : 'https://picsum.photos/100' ,
        text : '친절하십니다.'
    } ,
    {
        avatar : 'https://picsum.photos/200' ,
        userName : '지훈' ,
        uri : 'https://picsum.photos/300' ,
        text : '친절하십니다.'
    } ,
]

export default function() {
    return(
        <KeyboardAwareScrollView>
            {
                DATA.map( item =>  {
                    return (
                        <Card>
                            <Card.Content>
                                <Row>
                                    <Avatar.Image source={{ uri : item.avatar }} size={30} />
                                    <Text style={styles.userName}>{item.userName}</Text>
                                </Row>
                            </Card.Content>
                            <Card.Cover source={{ uri : item.uri }} style={styles.image}/>
                            <Card.Content>
                                <Text style={styles.text}>{item.text}</Text>
                            </Card.Content>
                            <Card.Actions>
                                <Button icon='pencil' onPress={ () => { }}> 답글달기</Button>
                            </Card.Actions>
                        </Card>
                    )
                })
            }
        </KeyboardAwareScrollView>
    );
}