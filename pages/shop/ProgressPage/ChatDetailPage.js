import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components';
import { Avatar , Button, Title , Appbar , IconButton , ActivityIndicator , Text } from 'react-native-paper';
import {  GiftedChat , Message, Time  } from 'react-native-gifted-chat';
import { Send , Bubble } from 'react-native-gifted-chat';
import colors from '../../../color/colors';
import database from '@react-native-firebase/database';
import moment from 'moment';
import _, { forEach } from 'lodash';
import axios from 'axios';
import server from '../../../server/server';
import fetch from '../../../storage/fetch';
import store from '../../../storage/store';
import { Alert } from 'react-native';



export default function( props ) {
const [messages, setMessages] = useState([]);
const [name,setName] = useState('업체');
const [disabled,setDisabled] = useState(false) ;
const db = database().ref(`chat${ props.route.params.id }`);


  const RenderSend = (props) =>  { 
    return ( 
    <Send {...props} disabled={disabled} >
        <Avatar.Icon icon='send' style={{ backgroundColor: 'transparent' , alignSelf: 'center' }} color={colors.main} size={40}/>
    </Send> )
  }



  const RenderAvatar = () => { return ( <Avatar.Image source={{ uri: props.route.params.imageUrl }} size={30} icon='cash' color='white' />) }

    async function getData ( ){

        // 마지막 채팅의 _id 를 기억했다가 거기부터 로드하는 방식?
        // 로드가 다 되면 db off 하는 방법
        return new Promise(async (resolve,reject) => {

            let end = 0 ;
            await db
            .orderByChild('createdAt')
            .once('value', snapshot => {


                if ( snapshot.toJSON() != null ) {
                    tmp =  snapshot.toJSON() ;
                    Data = Object.values( snapshot.toJSON() ) ;
        
                    Object.keys( tmp )
                    .map( (item,index) => {
                        // 상대방의 메시지를 읽지 않았을때
                        // if ( Data[index].user._id == 2 && Data[index].received == false )
                        if ( Data[index].user._id == 2  )
                            database().ref(`chat${ props.route.params.id }/${item}`).update({ received : true })
                            .then( () => {  
        
                            })
                            .catch( e => { }) 
                    }) ;
                
                }


                end = snapshot.numChildren() ;
                if ( !snapshot.exists()  ) {
                    // alert('hi');
                    reject();
                }
                else {
                    
                    records = Object.values(snapshot?.val());
                    
                    // setMessages(records);
                    
                    
                    records = _.sortBy(records, function(dateObj) {
                        return dateObj.createdAt
                    });
                    
                    records.map((record)=>{
                        msg = [{
                            _id : record._id ,
                            text : record.text ,
                            user : record.user ,
                            createdAt : record.createdAt,
                            sent: true
                        }] ;
                        setMessages( previousMessages => GiftedChat.append(previousMessages,msg) ) ;
                    });
                    
                }

            });    
            
            resolve(end);




        });
    } ;
 

    // 화면 처음 실행 시
    useEffect( () => {

        fetch('Info')
        .then( res => {
            setName( res.company_name ) ;
        })
        .catch( e => {})

        // Realtime DB에 연결
        database().goOnline();
        // 이전 연결을 끊음.
        db.off()
        // 이전 메시지들을 로드
        getData()
        .then(res => {
            let end = res ;
            let start = 0 ;

            // 메시지 핸들러
            db.on('child_added', snapshot =>  {
                record =  snapshot.toJSON() ;

                start = start + 1 ; 
                let saveChatData = {} ;
                saveChatData[props.route.params.id] = start ;
                store('chat',saveChatData) ;

                // NEW
                if ( start > end && record.user._id != 1 ) {
                        // mark "received"
                        database().ref(`chat${ props.route.params.id }/${snapshot.key}`).update({ received : true })
                        .then( () => {  
                            msg = [{
                                _id : record._id ,
                                text : record.text ,
                                user : record.user ,
                                createdAt : record.createdAt,
                                sent: true
                            }] ;
                            setMessages( previousMessages => GiftedChat.append(previousMessages,msg) ) ;
                        })
                        .catch( e => { }) 

                        
                }
            })


            setMessages( previousMessages => GiftedChat.prepend(previousMessages,{
                _id : 400 ,
                text : '고객님에게 메시지를 보내보세요.' , 
                sent : true ,
                system : true ,
            }))
           

        })
        .catch(e=>{ 


            let start = 0 ;
            art = start + 1 ;
            let saveChatData = {} ;
            saveChatData[props.route.params.id] = start ;
            store('chat',saveChatData) ;

            // 메시지 핸들러
            db.on('child_added', snapshot =>  {
                record =  snapshot.toJSON() ;

                start = start + 1 ;
                let saveChatData = {} ;
                saveChatData[props.route.params.id] = start ;
                store('chat',saveChatData) ;
                // NEW
                if ( record.user._id != 1  ) {
                    database().ref(`chat${ props.route.params.id }/${snapshot.key}`).update({ received : true })
                    .then( () => {  
                        msg = [{
                            _id : record._id ,
                            text : record.text ,
                            user : record.user ,
                            createdAt : record.createdAt,
                            sent: true
                        }] ;
                        setMessages( previousMessages => GiftedChat.append(previousMessages,msg) ) ;
                    })
                    .catch( e => { }) 
                }
            })

            setMessages( previousMessages => GiftedChat.append(previousMessages,{
                _id : 400 ,
                text : '고객님에게 메시지를 보내보세요.' , 
                sent : true ,
                system : true ,
            }))
         })

    }, []) ;

       const onSend = React.useCallback( (msg = []) => {
                setDisabled(true);
                // 인터넷 끊겼을 때 (테스트)
                // database().goOffline();
                msg[0].createdAt = moment( msg[0].createdAt).format('YYYY-MM-DD kk:mm:ss') ;
                msg[0]['received'] = false ;
        
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
                    })
                    .then( res => {
                        newReference.set({
                            text : msg[0].text ,
                            user : msg[0].user ,
                            _id : msg[0]._id ,
                            received : false ,
                            sent : true ,
                            createdAt : moment( msg[0].createdAt ).format('YYYY-MM-DD kk:mm:ss') ,
                        })
                        .then( res  => { 
                            //메시지 전송 성공 시
                                setMessages(previousMessages => (
                                previousMessages.filter( message => message._id !== msg[0]._id ) ) ) ;

                               msg[0] = { ...msg[0] , sent : true } ;
                               setMessages(previousMessages =>  GiftedChat.append(previousMessages,msg));
                               setDisabled(false);
                        })
                        .catch( e => { 
                            // Server Request 성공 -> Realtime DB 실패
                            newReference.remove();
                            msg[0] = { ...msg[0] , sent : false }
                            setMessages(previousMessages => GiftedChat.append(previousMessages, msg)) 
                            setDisabled(false);
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
                        setDisabled(false);
                    })
        
                })
                .catch(
                    e => { 
                        Alert.alert('다시 시도해주세요.');
                        setDisabled(false);
                    }
                )
        
                
              
            }, [])


  return (
    <>
     <Appbar.Header style={{ backgroundColor: colors.main}}>
        <Appbar.BackAction color='white' onPress={() => { db.off() ; props.navigation.goBack() }} />   
        <Appbar.Content title={ `${props.route.params.name} 고객` } /> 
    </Appbar.Header>
    <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        renderSystemMessage={this.onRenderSystemMessage}
        renderAvatar={RenderAvatar}
        renderSend = {RenderSend}
        renderBubble={props=><Bubble {...props} wrapperStyle={{ right: { backgroundColor: colors.main , borderBottomEndRadius: 20 , padding: 5 } , left : { backgroundColor: 'white'} }} 
        // 메시지 상태 표시
        render
        renderTicks = {(messages) => 
            ( messages.sent == null  ? <ActivityIndicator color='white' size={13} style={{ padding : 7}}/> : messages.sent ? <></> : <IconButton icon='close' color='red' size={15} /> )}
        textInputStyle = {{ alignSelf: 'center' , margin: 5 }}
        alwaysShowSend={true}
        textStyle={{ right:{ padding: 3 }}} /> }
        placeholder='메시지를 입력하세요.'
        user={{
            _id: 1 ,
            name: name ,
        }}
    />
    </>
  )
}

