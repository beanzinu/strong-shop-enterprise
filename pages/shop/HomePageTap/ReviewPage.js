import styled from "styled-components";
import colors from "../../../color/colors";
import React from "react";
// import { FlatList } from "react-native-gesture-handler";
import { FlatList } from "react-native";
import { Card , Avatar , Divider , Button, ActivityIndicator, Provider , Modal , Portal , IconButton} from "react-native-paper";
import { Alert } from "react-native";
import moment from "moment";
import axios from "axios";
import _ from "lodash";
import { KeyboardAwareScrollView  } from "react-native-keyboard-aware-scroll-view";
import server from "../../../server/server";
import fetch from "../../../storage/fetch";
import AppContext from "../../../storage/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Row = styled.View`
    flex-direction: row;
    height: 50px ;
    align-items: center;
`;
const Text = styled.Text``;
const View = styled.View``;

const TextInput = styled.TextInput`
    border: 1px ${colors.main};
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
    } , 
    reviewText : {
        padding: 10  ,
        borderWidth: 1 , 
        borderColor: 'lightgray' ,
        borderTopRightRadius: 10 ,
        borderBottomLeftRadius: 10 ,
        borderBottomRightRadius: 10 ,
        backgroundColor: 'rgb(200,200,200)' 
    }

}

// const DATA = [
//     {
//         id : 1 ,
//         avatar : 'https://picsum.photos/0' ,
//         userName : '진우' ,
//         uri : 'https://picsum.photos/100' ,
//         text : '친절하십니다.' ,
//         reply : ''
//     } ,
//     {
//         id : 2 ,
//         avatar : 'https://picsum.photos/200' ,
//         userName : '지훈' ,
//         uri : 'https://picsum.photos/300' ,
//         text : '친절하십니다.' ,
//         reply : '감\n감\n감\n감\n감\n감\n'
//     } ,
//     {
//         id : 3 ,
//         avatar : 'https://picsum.photos/0' ,
//         userName : '진우' ,
//         uri : 'https://picsum.photos/100' ,
//         text : '친절하십니다.' ,
//         reply : ''
//     } ,
//     {
//         id : 4 ,
//         avatar : 'https://picsum.photos/200' ,
//         userName : '지훈' ,
//         uri : 'https://picsum.photos/300' ,
//         text : '친절하십니다.' ,
//         reply : ''
//     } ,
// ]


// 사장님 답변 컴포넌트
function Reply({item,index}) {
    const [reply,setReply]  = React.useState('');
    const [editable,setEditable] = React.useState(false) ;
    const [inputHeight,setInputHeight] = React.useState(100);
    const MyContext = React.useContext(AppContext) ;
    
    //
    React.useEffect( () => {
        setReply(item.reply);
        if( item.reply == null ) {
            setEditable(true)
            
        }
    },[]);
    // 
    const handleReply = () =>  {
        Alert.alert('답글을 다시겠습니까?','',[
            {
                text: '확인',
                onPress : () => {
                    requestReply();
                }
            },
            {
                text: '취소'
            }
        ])
    }

    //
    const requestReply = async () =>  {

        const token = await fetch('auth') ;
        const auth = token.auth;

        // request 
        // id 필요
        axios({
            url: `${server.url}/api/review/reply`,
            method: 'put' ,
            data : { id: item.id , reply: reply  } ,
            headers: { Auth: auth }
        })
        .then( res => {
            // 성공
            MyContext.setReviewRefresh(!MyContext.reviewRefresh)
        })
        .catch( e =>  {
            // console.log(e);
        })
    }


    return(
        <>
        {
            item.reply != null ? (
                <View style={styles.reviewText}>
                    <Text style={{ fontSize: 17 }}>{reply}</Text>
                </View>
            ) : (
                <>
                <View style={{ flex: 1 }}>
                <TextInput placeholder='리뷰에 대한 답변을 작성해주세요.'
                value={reply}
                onChangeText = { value => setReply(value) }
                multiline={true}
                editable={editable}
                style={{ height: inputHeight }}
                onContentSizeChange={e=>{
                    if ( e.nativeEvent.contentSize.height > inputHeight ) setInputHeight(inputHeight+50);
                }}
                onPressIn = {() => { 
                    this.flatList.scrollToIndex({ index: index+0.5 });
                } }
                />
                </View>
                {
                item.reply == null && (
                    <View style={{ alignItems: 'flex-end' ,width: '100%' }}>
                        <Button icon='pencil' color={colors.main} 
                                onPress={ () => { handleReply() }}> 
                            답글달기
                        </Button>
                    </View>
                    
                )
                }
                </>
            )
        }
        </>
    )
}



export default function( props ) {
    const [DATA,setDATA]  = React.useState([]) ;
    const [loading,setLoading] = React.useState(true) ;
    const [refresh,setRefresh] = React.useState(false);

    const MyContext = React.useContext(AppContext) ;


    const RenderItem =  ({index,item}) => {
        if (item.content == null) return <View style={{ height: 300 }}></View>
        return(
            <Card style= {{ margin: 20 }}>
            <Card.Content>
                <Row>
                    <Avatar.Image source={{ uri : item.userThumbnailImage.includes('https')? item.userThumbnailImage : item.userThumbnailImage.replace('http','https') }} size={30} />
                    <Text style={styles.userName}>{item.userNickName}</Text>
                    {/* <Text>{item.createdTime}</Text> */}
                    <Text>{moment(item.createdTime).format('YYYY-MM-DD')}</Text>
                </Row>
            </Card.Content>
            <Card.Cover  resizeMethod='auto' resizeMode='contain' source={{ uri : item.imageUrls[0].imageUrl }} style={styles.image}/>
            <Card.Content>
                <Text style={styles.text}>{item.content}</Text>
                <Divider style={{ borderColor: 'gray' , borderWidth: 1 , marginTop: 10 }}/>
                <Row>
                    <Avatar.Icon size={24} icon='account' style={{ backgroundColor: colors.main }} />
                    <Text style={styles.userName}>사장님</Text>
                </Row>
                <Reply item = {item} index={index}/>
            </Card.Content>
            </Card>
        )
    }
  
    function requestReviews() {
        // request Review
        fetch('auth')
        .then(res => {
            const auth = res.auth ;
            
            axios({
                url: `${server.url}/api/review`,
                method: 'get',
                headers: { Auth: auth } 
            })
            .then( res =>  {
                const tmp = _.reverse(res.data.data);
                setDATA(tmp);

                setLoading(false);
                setRefresh(false);
            })
            .catch( e => {
                //
                if ( e.response.hasOwnProperty('status') && e?.response?.status == 403 ) {
                    Alert.alert('새로운 기기','다른 기기에서 로그인하여 로그아웃 되었습니다.');
                    setRefresh(false);
                    AsyncStorage.clear();

                    MyContext.LOGOUT();
                }
                else Alert.alert('다시 시도해주세요.');
            })

        }) ;

    }

    handleRefresh = () =>  {
        setRefresh(true);
        requestReviews()
    }

    React.useEffect( () =>  { 
        
        requestReviews()
        

    },[MyContext.reviewRefresh]) ;


    return(
        <>
            {
                loading ? 
                (
                    <ActivityIndicator size='large' style={{ marginTop: 20 }} color={colors.main} />
                ) : 
                (
                    DATA.length == 0 ? 
                    (
                        <View
                            style={{ flex: 1 , alignItems: 'center' , justifyContent: 'center' , backgroundColor: 'white' }}
                        >
                            <Text>현재 리뷰가 없어요.</Text>
                        </View>
                    ):
                    (
                    <>
                    <FlatList
                        refreshing={refresh}
                        onRefresh={handleRefresh}
                        ref = { ref => this.flatList = ref }
                        data = { DATA }
                        renderItem = { RenderItem }
                        horizontal= {false}
                        keyExtractor= { (item) => item.id }
                        onScrollToIndexFailed={() => {
                            DATA.push({
                                id : 'new'
                            });
                            // setTimeout(() => {
                            //     this.flatList.scrollToEnd();
                            // },1000) ;
                        }}
                    />
                    </>
                    )
                )
            }
        </>
    );
}