import React from 'react'; 
import { Avatar, Card , Divider, Text , IconButton } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { Alert, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../../color/colors';
import styled from 'styled-components';
import AppContext from '../../../storage/AppContext';
import IMP from 'iamport-react-native';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import fetch from '../../../storage/fetch';
import server from '../../../server/server';
const View = styled.View``;

const ImageView = styled.View`
    width: 100%;
    height: 350px;
    background-color: white;
`;
const Row = styled.View`
    flex-direction: row;
`;

const styles= {
    Card : {
        // borderBottomWidth: 1 ,
        // borderColor: 'lightgray'
    } ,
    Image : {
        flex: 1
    } ,
    title : {
        fontSize: 15 , 
        fontWeight: 'bold' ,
        fontFamily: 'NotoSansKR-Medium'
    } ,
    text : {
        marginTop: 5 ,
        marginLeft: 15 ,
        // fontWeight: 'bold' ,
    },
    label: {
        marginTop: 5 ,
        fontWeight: 'bold',
        marginLeft: 15 ,
        marginRight: 15 ,
        fontFamily: 'NotoSansKR-Medium'
    }

}


export default function( props ) { 
    const MyContext = React.useContext(AppContext);

    const handleDeleteMsg = () => {
        Alert.alert('삭제하시겠습니까?','',[
            {
                text: '취소'
            } ,
            {
                text: '확인' ,
                onPress: () =>  { requestDelete() }
            }
        ])
    }

    const requestDelete = () => {
        fetch('auth')
        .then(res => {
            const auth = res.auth ;
            axios({
                url: `${server.url}/api/gallery/${props.route.params.id}`,
                method: 'delete' ,
                headers: { Auth: auth}
            })
            .then( res => {
                if ( res.data.statusCode == 200) {
                    MyContext.setRefresh(!MyContext.refresh);
                    props.navigation.goBack();
                }

            })
            .catch(e => { })
        })
        .catch( e => { })
    }
    
    return(
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
            <Card style={ styles.Card } >
                <Card.Title 
                    titleStyle={ styles.title }
                    title= {props.route.params.name} 
                    left = { ()=>  <Avatar.Image source={{ uri: props?.route?.params?.imageUrl }} size={30} style={{ backgroundColor: colors.main }}/>  }
                    right= { () => <IconButton onPress={() => { handleDeleteMsg() }} icon='delete' size={20}  style={{ marginRight: 10 , backgroundColor: 'transparent' }} color='red'/> }
                />
            </Card>
            <ImageView>
                <Swiper 
                    loop={false}
                    buttonWrapperStyle={{ margin: 30 }}
                    dotStyle={{ bottom: -50  }}
                    activeDotStyle={{ bottom: -50 }}
                >  
                    {
                        props.route.params.uri.map( picture =>  {
                            return(
                                <ImageView key={picture.imageUrl}>
                                    <FastImage resizeMode='contain' source={{ uri: picture.imageUrl }} style={ styles.Image }/>
                                </ImageView>
                            )
                        })
                    }
                </Swiper>
            </ImageView>

            {/* <Divider style={{ marginTop: 5 }} /> */}
            <Row style={{ marginTop: 40 }}>
            <Text style={styles.label} >{props.route.params.name}  <Text>{props.route.params.content}</Text></Text>
            </Row>

        </KeyboardAwareScrollView>
    );
}