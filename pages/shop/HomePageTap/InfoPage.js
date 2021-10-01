import React from 'react';
import NaverMapView , { Marker } from 'react-native-nmap';
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button , Title , ActivityIndicator, Avatar } from 'react-native-paper';
import axios from 'axios';
import colors from '../../../color/colors';
import { Linking } from 'react-native';
import { RefreshControl } from 'react-native';
// storage
import fetch from '../../../storage/fetch';
import store from '../../../storage/store';

const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;

const Text = styled.Text`
    margin-left: 10px;
    font-size: 17px ;
    padding: 10px ;
`;

const styles = {
    title : {
        fontWeight: 'bold' ,
        color : colors.main ,
        padding: 10 ,
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30
    } ,
    button : {
        alignSelf: 'flex-end' , 
        padding : 5 
    }
}

let DATA = {
    company_id : 2 ,
    longitude : '' ,
    latitude : '' ,
    introduction : '업체에 대해 간단한 소개를 해주세요.' ,
    blogUrl : 'http://www.naver.com/blog/strongshop' ,
    siteUrl : 'http://www.naver.com' ,
    snsUrl : 'http://instgram.com'
}

export default function( props ) {
    const [coord,setCoord] = React.useState(0);
    const [data,setData] = React.useState(DATA);
    const [refreshing,setRefreshing] = React.useState(false);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    React.useEffect( async () =>  {

        // 저장된 캐시가 있을 때
        await fetch('map')
        .then( res =>  {
            setCoord({latitude: Number(res.y) , longitude : Number(res.x) });
        })
        .catch ( e =>  { 
            axios({
                method: 'GET' ,
                url : 'https://api.vworld.kr/req/address?service=address&request=getCoord&key=98C4A0B1-90CD-30F6-B7D0-9F5A0DC9F18B&address=서울시 관악구 복은 10길 19&type=ROAD' ,
                data : {
                    loginToken : 'AABCADSAD'
                }
            })
            .then(res => {
                const point = res.data.response.result.point ;
                setCoord({latitude: Number(point.y) , longitude : Number(point.x) });
                // 캐시 저장
                
                store('map',point);
    
            }
            )
    
            .catch(e => console.log(e) ) ;
        });

        await fetch('Info')
        .then( res => {
            setData(res)
        })
        .catch(e => {

        });

        // Info 캐시정보
        const unsubscribe = props.navigation.addListener('focus',async () => {
            
                wait(2000).then(async ()=>{
                await fetch('Info')
                .then(res=>{
        
                    const newData = {
                        ...data ,
                        info : res.info ,
                        blogUrl : res.blogUrl ,
                        siteUrl : res.siteUrl,
                        snsUrl : res.snsUrl
                    }
                    // 데이터의 변화가 있을 시
                    if ( JSON.stringify(data) != JSON.stringify(newData) ) {
                        setRefreshing(true);
                        setData({
                            ...data,
                            info : res.info ,
                            blogUrl : res.blogUrl ,
                            siteUrl : res.siteUrl,
                            snsUrl : res.snsUrl
                        });
                        wait(1000).then(()=>setRefreshing(false));
                    }
                })
                .catch(e=>{
                    console.log('Info 캐시 불러오기 에러')
                })
                });
          });
          
          return unsubscribe;
        
      

    },[props.navigation]);

    handleScroll = function( event ) {
        props.setScroll(event.nativeEvent.contentOffset.y);
    } ;
    

    return(
        <>
        {
            coord == 0 ? ( <ActivityIndicator size='large' color={colors.main} style={{ marginTop: 20 }}/> ) : (
            <KeyboardAwareScrollView 
                onScrollEndDrag={ this.handleScroll } refreshControl
                refreshControl={<RefreshControl refreshing={refreshing} />}
            >
            <Button icon='hammer' style={ styles.button }
                onPress={ () => { props.navigation.navigate('InfoRegister',{ data : data  }) }}
                color={colors.main}
            >
                수정하기
            </Button>
            <Title style= { styles.title }> 업체 소개 </Title>
            <Text>{data.info}</Text>
            <Row>
                <Avatar.Icon icon='link' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={colors.main} size={30} />
                <Button uppercase={false} color={colors.main} onPress={()=> { Linking.openURL(data.blogUrl)}}>{data.blogUrl}</Button>
            </Row>
            <Row>
                <Avatar.Icon icon='web' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={colors.main} size={30} />
                <Button uppercase={false} color={colors.main} onPress={()=> { Linking.openURL(data.siteUrl) }}>{data.siteUrl}</Button>
            </Row>
            <Row>
                <Avatar.Icon icon='instagram' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={colors.main} size={30} />
                <Button uppercase={false} color={colors.main} onPress={()=> { Linking.openURL(data.snsUrl) }}>{data.snsUrl}</Button>
            </Row>
            <Title style= { styles.title }> 위치 </Title>
            <Text style={{ marginBottom: 10 }}>주소: {props.data.location}</Text>
            <NaverMapView style={{width: '80%', height: 300 , alignSelf : 'center' }}
            showsMyLocationButton={true}
            center={{...coord, zoom: 13 }}
            showsMyLocationButton={false}
            >
            <Marker coordinate={coord} onClick={() => console.warn('onClick! p0')}/>
            </NaverMapView>
            </KeyboardAwareScrollView>
            )
        }
        </>
    );
}