import React from 'react' ;
import styled from 'styled-components';
import { Avatar , Button, Title , Appbar , Icon } from 'react-native-paper';
import {  GiftedChat } from 'react-native-gifted-chat';
import { Send , InputToolbar } from 'react-native-gifted-chat';
const styles = {


};
const View = styled.SafeAreaView``;
const CustomButton = styled.TouchableOpacity``;
const TextInput = styled.TextInput``;

const RenderAvatar = () => { return ( <Avatar.Icon size={30} icon='cash' color='white' />) }
const RenderSend = (props) =>  { 
    return ( 
    <Send {...props} label='전송'>
    </Send> )
}


export default function( props ) {
    const [messages, setMessages] = React.useState([]);
    
 

    // 화면 처음 실행 시
    React.useEffect(() => {
      setMessages([
        {
            text : '축하드립니다. \'올댓오토모빌\'이 최종입찰되셨습니다.' , 
            createdAt : new Date() ,    
            user: { 
                _id: 1,
                name: '최강샵 알리미',
                avatar: 'https://placeimg.com/140/140/any',
                system : true ,
            },
            // Any additional custom parameters are passed through
            // image: 'https://facebook.github.io/react/img/logo_og.png',

            received: true,
            // Mark the message as pending with a clock loader

        }
        
        
        
      ])
      setTimeout(() =>  {
        onSend( {
            _id : 1 ,
            text : '고객님에게 신차패키지 절차에 대해 알려주세요!.' ,
            createdAt : new Date() , 
            user: { 
                _id: 1,
                name: '최강샵 알리미',
                avatar: 'https://placeimg.com/140/140/any',
                system : true ,
            },
            
        })
      },2000) ;

    }, []) ;


    const CustomChat = () => { return ( 
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            isTyping={true}

            renderUsernameOnMessage={true}
            renderSend = {RenderSend}
            // textInputProps= {{  autoFocus : true  }}
            textInputStyle = {{ alignSelf: 'center' }}
            onPressActionButton= { () => {}}

            alwaysShowSend={true}
            showUserAvatar={true}
            placeholder='메시지를 입력하세요.'
            user={{
            _id: 2 ,
            name: '올댓오토모빌' ,
            
            } 
            
            }
        />
    )}
  
    const onSend = React.useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])
  
    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { props.navigation.goBack() }} />   
                <Appbar.Content title={ `${props.route.params.name} 고객` } /> 
            </Appbar.Header>
            <CustomChat/>
        </>
    )
}