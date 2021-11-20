import React from 'react' ;
import styled from 'styled-components';
import { Avatar , Button, Title , Appbar , Icon , TextInput , Text , IconButton , ActivityIndicator} from 'react-native-paper';
import {  GiftedChat , SystemMessage , MessageContainer, Message } from 'react-native-gifted-chat';
import { Send , Bubble } from 'react-native-gifted-chat';
import colors from '../../../color/colors';
import database from '@react-native-firebase/database';
import _, { forEach } from 'lodash';

const db = database().ref('chat');

const RenderAvatar = () => { return ( <Avatar.Icon size={30} icon='cash' color='white' />) }
const RenderSend = (props) =>  { 
    return ( 
    <Send {...props} >
        <Avatar.Icon icon='send' style={{ backgroundColor: 'transparent' , alignSelf: 'center' }} color={colors.main} size={40}/>
    </Send> )
}


export default function( props ) {
    const [messages, setMessages] = React.useState([]);
    
    async function getData ( ){

        // 마지막 채팅의 _id 를 기억했다가 거기부터 로드하는 방식?
        // 로드가 다 되면 db off 하는 방법
        return new Promise((resolve,reject) => {
            db
            .once('value', snapshot => {
                records = Object.values(snapshot.val());
                records = _.sortBy(records,'createdAt') ;
                records.map((record)=>{
                    msg = [{
                        text : record.text ,
                        user : record.user ,
                        _id : record._id ,
                        createdAt : record.createdAt,
                        sent: true
                    } ] ;
                    setMessages(previousMessages => GiftedChat.append(previousMessages,msg) ); 
                });
            });
            resolve();
        });
    } ;
 

    // 화면 처음 실행 시
    React.useEffect( async () => {

        // Realtime DB에 연결
        database().goOnline();

        // 이전 연결을 끊음.
        db.off()
        // 이전 메시지들을 로드
        await getData()
        .catch(e=>{ console.log(e) })



        

      setMessages([
        {
            _id : 1 ,
            text : '축하드립니다. \'올댓오토모빌\'이 최종입찰되셨습니다.' , 
            // Any additional custom parameters are passed through
            // image: 'https://facebook.github.io/react/img/logo_og.png',
            sent : true ,
            system : true ,
            // received: true,
            // Mark the message as pending with a clock loader
        },
        {
            _id : 2 ,
            text : '고객님에게 신차패키지 절차에 대해 알려주세요!.' ,
            system: true ,
            reportUser: true ,
            sent: true ,
            
        }
        ]
      )

    }, []) ;

    // 시스템 메시지 수정
    onRenderSystemMessage = (props) => ( <SystemMessage {...props} 
        containerStyle={{backgroundColor: 'transparent' }} 
        textStyle={{ color: colors.main , fontWeight:"500", fontSize: 17, textAlign:'center'}} /> );

    const CustomChat = () => { 
        return ( 
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                isTyping={true}
                renderSystemMessage={this.onRenderSystemMessage}
                renderUsernameOnMessage={true}
                renderSend = {RenderSend}
                // 메시지 상태 표시
                renderTicks = {(messages) => 
                    ( messages.sent == null  ? <ActivityIndicator size={13} style={{ padding : 7}}/> : messages.sent ? <></> : <IconButton icon='close' color='red' size={15} /> )}
                textInputStyle = {{ alignSelf: 'center' }}
                onPressActionButton= { () => { 
                    t = [{ user: { _id:1 , name : '고객' } , text : '안녕하세요' , sent: true , createdAt : Date() }];
                    onSend(t);
                }}
                alwaysShowSend={true}
                // showUserAvatar={true}
                renderMessage={ props=> <Message {...props} /> }
                renderBubble={props=><Bubble {...props} wrapperStyle={{ right: { backgroundColor: colors.main , borderBottomEndRadius: 20 , padding: 5 } , left : { backgroundColor: 'white'} }} 
                textStyle={{ right:{ padding: 3 }}} /> }
                placeholder='메시지를 입력하세요.'
                user={{
                    _id: 2 ,
                    name: '올댓오토모빌' ,
                }}
            />
    )}
  
    const onSend = React.useCallback( (msg = []) => {
        // 인터넷 끊겼을 때 (테스트)
        // database().goOffline();


        //서버로 제대로 전달이 되었다면 보내는 방향으로
        let flag = false ;
        const newReference = db.push();
        
        // 화면에 표시
        setMessages(previousMessages => GiftedChat.append(previousMessages, msg)) 

        
        setTimeout(() =>  {
            if ( !flag ) { // 메시지 전송 실패 ( 인터넷 없음 등의 이유로 )

                newReference.remove();

                setMessages(previousMessages => (
                 previousMessages = previousMessages.splice(1,previousMessages.length-1) 
                 ) );
                msg[0] = { ...msg[0] , sent : false } ;
                setMessages(previousMessages => (
                    GiftedChat.append(previousMessages,msg)
                ));

            }
        },5000) ;

        // Realtime DB로 전송 시도
        newReference.set({
            text : msg[0].text ,
            user : msg[0].user ,
            _id : msg[0]._id ,
            createdAt : msg[0].createdAt.toString() ,
        })
        .then( res  => { 
            // 메시지 전송 성공 시
            setMessages(previousMessages => (
                previousMessages = previousMessages.splice(1,previousMessages.length-1) 
                ) );
               msg[0] = { ...msg[0] , sent : true } ;
               setMessages(previousMessages => (
                   GiftedChat.append(previousMessages,msg)
               ));

            flag = true ; // 메시지 보냄
        })
        .catch( e => { 
            alert('error');
            msg[0] = { ...msg[0] , sent : false }
            setMessages(previousMessages => GiftedChat.append(previousMessages, msg)) 
         })
       

        // 바로 메시지를 표시
        // setMessages(previousMessages => GiftedChat.append(previousMessages, msg)) ;
      
    }, [])
  
    return (
        <>
            <Appbar.Header style={{ backgroundColor: colors.main}}>
                <Appbar.BackAction onPress={() => { props.navigation.goBack() }} />   
                <Appbar.Content title={ `${props.route.params.name} 고객` } /> 
            </Appbar.Header>
            <CustomChat/>
        </>
    )
}