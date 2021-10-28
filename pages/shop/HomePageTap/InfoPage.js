import React from 'react';
import NaverMapView , { Marker } from 'react-native-nmap';
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button , Title , ActivityIndicator, Avatar } from 'react-native-paper';
import axios from 'axios';
import colors from '../../../color/colors';
import { Linking } from 'react-native';
import { RefreshControl } from 'react-native';
import _ from 'lodash';
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

export default function( props ) {
    const [coord,setCoord] = React.useState(0);
    const [data,setData] = React.useState({});
    const [refreshing,setRefreshing] = React.useState(false);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    // API Request
    // 도로명 주소 -> 좌표로 변환
    function getCoord(address){
        axios({
            method: 'GET' ,
            url : `https://api.vworld.kr/req/address?service=address&request=getCoord&key=98C4A0B1-90CD-30F6-B7D0-9F5A0DC9F18B&address=${address}&type=ROAD` ,
        })
        .then(res => {
            const point = res.data.response.result.point ;
            setCoord({latitude: Number(point.y) , longitude : Number(point.x) });
            // 캐시 저장
            store('map',point);

        }
        )
        .catch(e => console.log(e) ) ;
    }

    React.useEffect( async () =>  {

        // 저장된 좌표정보가 있을 때
        await fetch('map')
        .then( res =>  {
            setCoord({latitude: Number(res.y) , longitude : Number(res.x) });
        })
        .catch (async(e) =>  { 
            // 1. 서버에게 요청하여 Info 정보 받아옴.
            // 2. Info 정보의 address를 좌표로 설정  ( setCoord() , getCoord() )
            // 3. 캐시에 저장 ( store('map',point) )
            getCoord('서울 광진구 뚝섬로33길 6');
        });

        let tmp ; // 다시 Focus 되었을 때 변경사항이 있는지 확인

        // 저장된 Info정보 확인 
        await fetch('Info')
        .then( (res) => {
            setData(res);
            tmp = res ;
        })
        .catch(e => {
            // 1. 서버에게 요청하여 Info 정보 받아옴.
            // 2. Info 정보를 setData()

        });

        // InfoPage가 다시 Focus 되었을 때
        // 1. Info 정보가 바뀌었는지 확인한다. 
        const unsubscribe = props.navigation.addListener('focus',async () => {
            
                wait(2000).then(async ()=>{
                    await fetch('Info')
                    .then(res=>{
                        
                        // 주소의 변화가 있을 때
                        if ( tmp.address != res.address ) getCoord(res.address);

                        // 데이터의 변화가 있을 시
                        if ( !_.isEqual( tmp,res ) ) {
                            setRefreshing(true);
                            setData({
                                ...data,
                                info : res.info ,
                                blogUrl : res.blogUrl ,
                                siteUrl : res.siteUrl,
                                snsUrl : res.snsUrl ,
                                address : res.address ,
                                detailAddress : res.detailAddress
                            });
                            wait(1000).then(()=>setRefreshing(false));
                        }
                    })
                    .catch(e=>{
                        //
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
                style={{ backgroundColor: 'white' }}
                refreshControl={<RefreshControl refreshing={refreshing} />}
            >
            <Button icon='hammer' style={ styles.button }
                onPress={ () => { props.navigation.navigate('InfoRegister',{ data : data  }) }}
                color={colors.main}
            >
                수정하기
            </Button>
            <Title style= { styles.title }> 업체 소개 </Title>
            <Text>{data?.info}</Text>
            <Row>
                <Avatar.Icon icon='link' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={colors.main} size={30} />
                <Button uppercase={false} color={colors.main} onPress={()=> { Linking.openURL(data.blogUrl)}}>{data?.blogUrl}</Button>
            </Row>
            <Row>
                <Avatar.Icon icon='web' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={colors.main} size={30} />
                <Button uppercase={false} color={colors.main} onPress={()=> { Linking.openURL(data.siteUrl) }}>{data?.siteUrl}</Button>
            </Row>
            <Row>
                <Avatar.Icon icon='instagram' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={colors.main} size={30} />
                <Button uppercase={false} color={colors.main} onPress={()=> { Linking.openURL(data.snsUrl) }}>{data?.snsUrl}</Button>
            </Row>
            <Title style= { styles.title }> 위치 </Title>
            <Text style={{ marginBottom: 20 }}>{data?.address+'\n'+data?.detailAddress}</Text>
            <NaverMapView style={{width: '80%', height: 300 , alignSelf : 'center' , borderWidth: 2 , borderColor: 'lightgray' , marginBottom: 20 }}
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