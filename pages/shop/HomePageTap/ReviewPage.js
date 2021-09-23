import React from 'react' ;
import styled from 'styled-components';
import { Avatar, Card, List , Button , Divider , FAB  } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Alert, FlatList } from 'react-native';
import { random } from 'lodash';
import colors from '../../../color/colors';
import { Dimensions } from 'react-native';
const Row = styled.View`
    flex-direction: row;
    height: 50px ;

    align-items: center;

`;
const Text = styled.Text``;

const TextInput = styled.TextInput`
    border: 1px ${colors.main};
    background-color: whitesmoke;
    border-radius: 10px;
    margin-top: 10px;
    padding: 10px;
    height: 100px; 
`;

const styles = {
    userName : {
        fontWeight : 'bold' ,
        fontSize: 20 ,
        padding: 10 ,
    } ,
    image : {
        margin : 10, 
        height: 300 
    } ,
    text : {
        fontSize: 15 ,
    },
    fab : {
        position: 'absolute' ,
        margin: 16 ,
        right: 0 ,
        bottom: 0 ,
        backgroundColor : colors.main
    }

}

const DATA = [
    {
        id : 1 ,
        avatar : 'https://picsum.photos/0' ,
        userName : '진우' ,
        uri : 'https://picsum.photos/100' ,
        text : '친절하십니다.' ,
        reply : ''
    } ,
    {
        id : 2 ,
        avatar : 'https://picsum.photos/200' ,
        userName : '지훈' ,
        uri : 'https://picsum.photos/300' ,
        text : '친절하십니다.' ,
        reply : '감사합니다 고객님...'
    } ,
    {
        id : 3 ,
        avatar : 'https://picsum.photos/0' ,
        userName : '진우' ,
        uri : 'https://picsum.photos/100' ,
        text : '친절하십니다.' ,
        reply : ''
    } ,
    {
        id : 4 ,
        avatar : 'https://picsum.photos/200' ,
        userName : '지훈' ,
        uri : 'https://picsum.photos/300' ,
        text : '친절하십니다.' ,
        reply : ''
    } ,
]

handleScroll = function( event ) {
    props.setScroll(event.nativeEvent.contentOffset.y);
} ;

// 사장님 답변 컴포넌트
function Reply({item}) {
    const [reply,setReply]  = React.useState('');
    const [editable,setEditable] = React.useState(false) ;
    
    React.useEffect( () => {
        setReply( item.reply) ;
        if( reply.length == 0 ) setEditable(true)
    },[]);

    return(
        <TextInput placeholder='리뷰에 대한 답변을 작성해주세요.'
                value={reply}
                onChangeText = { value => setReply(value) }
                multiline={true}
                editable={editable}
                onPressIn = {() => { 
                    this.flatList.scrollToIndex({index: item.id-0.5 });
                    // this.flatList.scrollToOffset({offset :  })
                } }
            />
    )
}

const RenderItem =  ({item}) => {
    return(
        <Card style= {{ margin: 20 }}>
        <Card.Content>
            <Row>
                <Avatar.Image source={{ uri : item.avatar }} size={30} />
                <Text style={styles.userName}>{item.userName}</Text>
            </Row>
        </Card.Content>
        <Card.Cover source={{ uri : item.uri }} style={styles.image}/>
        <Card.Content>
            <Text style={styles.text}>{item.text}</Text>
            <Divider style={{ borderColor: 'gray' , borderWidth: 1 , marginTop: 10 }}/>
            <Row>
                <Avatar.Icon size={24} icon='account' />
                <Text style={styles.userName}>사장님</Text>
            </Row>
            <Reply item = {item} />
        </Card.Content>
        <Card.Actions>
            {
                item.reply.length == 0 && (
                    <Button icon='pencil' color={colors.main} onPress={ () => { Alert.alert('답글 다시겠습니까?') }}> 
                        답글달기
                    </Button>
                )
            }
        </Card.Actions>
        </Card>
    )
}

export default function( props ) {
    const [scroll,setScroll] = React.useState(0);
    return(
        <>
            <FlatList
             onScrollEndDrag={this.handleScroll}
             ref={ref => (this.flatList = ref)}
             refreshControl={true}
             data={ DATA } 
             renderItem = {RenderItem}
             horizontal={false}
             keyExtractor={(item) => item.id}
             onEndReached={() => {
                 DATA.push(
                    {
                        id : random(1,1000) ,
                        avatar : 'https://picsum.photos/200' ,
                        userName : '스크롤 끝났을때 추가' ,
                        uri : 'https://picsum.photos/300' ,
                        text : '친절하십니다.' ,
                        reply : ''
                    } 
                 ) ;
              }
            }
            />
        </>
    );
}