import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components';
import { Avatar , Button, Title , Appbar , Icon , TextInput , Text , IconButton , ActivityIndicator } from 'react-native-paper';
import {  GiftedChat , SystemMessage , MessageContainer, Message } from 'react-native-gifted-chat';
import { Send , Bubble } from 'react-native-gifted-chat';
import colors from '../../../color/colors';
import database from '@react-native-firebase/database';
import _, { forEach } from 'lodash';
import axios from 'axios';
import server from '../../../server/server';
import fetch from '../../../storage/fetch';

const RenderSend = (props) =>  { 
    return ( 
    <Send {...props} >
        <Avatar.Icon icon='send' style={{ backgroundColor: 'transparent' , alignSelf: 'center' }} color={colors.main} size={40}/>
    </Send> )
}

export default function( props ) {
  const [messages, setMessages] = useState([]);
  const db = database().ref(`chat${ props.route.params.id }`);


  const RenderAvatar = () => { return ( <Avatar.Image source={{ uri: props.route.params.imageUrl }} size={30} icon='cash' color='white' />) }

    async function getData ( ){

        // 마지막 채팅의 _id 를 기억했다가 거기부터 로드하는 방식?
        // 로드가 다 되면 db off 하는 방법
        return new Promise((resolve,reject) => {
            
            db
            .once('value', snapshot => {
                if ( !snapshot.exists()  ) {
                    // alert('hi');
                    reject();
                }
                else {
                    // alert('hi');
                    records = Object.values(snapshot?.val());
                    records = _.sortBy(records,'createdAt') ;
                    let initialMsg = [] ;
                    records.map((record)=>{
                        msg = {
                            text : record.text ,
                            user : record.user ,
                            _id : record._id ,
                            createdAt : record.createdAt,
                            sent: true
                        } ;
                        initialMsg.push(msg);
                    });

                    initialMsg =  _.reverse(initialMsg) ;
                    
                    setMessages(initialMsg); 
                    resolve();
                }

            });

            db.on('child_added',snapshot=>{
                console.log('User data: ', snapshot.val());
            })

        });
    } ;
 

    // 화면 처음 실행 시
    useEffect( () => {

        // Realtime DB에 연결
        database().goOnline();
        // 이전 연결을 끊음.
        db.off()
        // 이전 메시지들을 로드
        getData()
        .then(res => {

            setMessages( previousMessages => GiftedChat.prepend(previousMessages,{
                _id : 400 ,
                text : '고객님에게 메시지를 보내보세요.' , 
                // Any additional custom parameters are passed through
                // image: 'https://facebook.github.io/react/img/logo_og.png',
                sent : true ,
                system : true ,
                // received: true,
                // Mark the message as pending with a clock loader
            }))
           

        })
        .catch(e=>{ 
            setMessages( previousMessages => GiftedChat.append(previousMessages,{
                _id : 400 ,
                text : '고객님에게 메시지를 보내보세요.' , 
                // Any additional custom parameters are passed through
                // image: 'https://facebook.github.io/react/img/logo_og.png',
                sent : true ,
                system : true ,
                // received: true,
                // Mark the message as pending with a clock loader
            }))
         })

    }, []) ;

       const onSend = React.useCallback( (msg = []) => {
                // 인터넷 끊겼을 때 (테스트)
                // database().goOffline();
        
        
                //서버로 제대로 전달이 되었다면 보내는 방향으로
                const newReference = db.push();
                // 화면에 표시
                setMessages(previousMessages => GiftedChat.append(previousMessages, msg))
                
        
                fetch('auth')
                .then( res => {
                    const auth = res.auth;
                    axios({
                        url: `${server.url}/api/chat/${props.route.params.id}?content=${msg[0].text}` ,
                        method: 'put' ,
                        headers: { Auth: auth } ,
                        // data :  {
                        //     content: msg[0].text
                        // }
                    })
                    .then( res => {
                        newReference.set({
                            text : msg[0].text ,
                            user : msg[0].user ,
                            _id : msg[0]._id ,
                            createdAt : msg[0].createdAt.toString() ,
                        })
                        .then( res  => { 
                            //메시지 전송 성공 시
                            setMessages(previousMessages => (
                                previousMessages.filter( message => message._id !== msg[0]._id ) ) ) ;

                               msg[0] = { ...msg[0] , sent : true } ;
                               setMessages(previousMessages =>  GiftedChat.append(previousMessages,msg));
                        })
                        .catch( e => { 
                            // Server Request 성공 -> Realtime DB 실패
                            msg[0] = { ...msg[0] , sent : false }
                            setMessages(previousMessages => GiftedChat.append(previousMessages, msg)) 
                         })
                    })
                    .catch( e => {
                        // Server Request 실패
                        newReference.remove();
        
                        setMessages(previousMessages => (
                            previousMessages.filter( message => message._id !== msg[0]._id )  ) ) ;
                        msg[0] = { ...msg[0] , sent : false } ;
                        setMessages(previousMessages => (
                            GiftedChat.append(previousMessages,msg)
                        ));
        
                    })
        
                })
                .catch(
                    e => { }
                )
        
                
              
            }, [])


  return (
    <>
     <Appbar.Header style={{ backgroundColor: colors.main}}>
        <Appbar.BackAction color='white' onPress={() => { props.navigation.goBack() }} />   
        <Appbar.Content title={ `${props.route.params.name} 고객` } /> 
    </Appbar.Header>
    <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        // isTyping={true}
        renderSystemMessage={this.onRenderSystemMessage}
        renderAvatar={RenderAvatar}
        renderSend = {RenderSend}
        renderBubble={props=><Bubble key={props}  {...props} wrapperStyle={{ right: { backgroundColor: colors.main , borderBottomEndRadius: 20 , padding: 5 } , left : { backgroundColor: 'white'} }} 
        // renderMessage={ props=> <Message key={props} {...props} /> }
        // 메시지 상태 표시
        renderTicks = {(messages) => 
            ( messages.sent == null  ? <ActivityIndicator size={13} style={{ padding : 7}}/> : messages.sent ? <></> : <IconButton icon='close' color='red' size={15} /> )}
        onPressActionButton= { () => { 
            t = [{ user: { _id:1 , name : '고객' } , text : '안녕하세요' , sent: true , createdAt : Date() }];
            onSend(t);
        }}
        textInputStyle = {{ alignSelf: 'center' }}
        alwaysShowSend={true}
        textStyle={{ right:{ padding: 3 }}} /> }
        placeholder='메시지를 입력하세요.'
        user={{
            _id: 1 ,
            name: '올댓오토모빌' ,
        }}
    />
    </>
  )
}

