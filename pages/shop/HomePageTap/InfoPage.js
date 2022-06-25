import React from 'react';
import NaverMapView , { Marker } from 'react-native-nmap';
import { Image } from 'react-native';
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button , Title , ActivityIndicator, Avatar, IconButton } from 'react-native-paper';
import colors from '../../../color/colors';
import { Linking } from 'react-native';
import _ from 'lodash';
// storage
import API from '../../../server/API';
import fetch from '../../../storage/fetch';
import store from '../../../storage/store';
import axios from 'axios';
import AppContext from '../../../storage/AppContext';
import commonStyles from '../../../components/commonStyles';

const View = styled.View``;
const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;
const ButtonRow = styled.TouchableOpacity`
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
        color : 'black' ,
        padding: 10 ,
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30
    } ,
    button : {
        alignSelf: 'flex-end' , 
        padding : 5 
    } ,
    row : {
        backgroundColor: 'white' , width: '95%' , borderWidth: 1 , borderRadius: 5, borderColor: colors.main , alignSelf: 'center' , height: 45
    } , 
    view : {
        borderWidth: 1 , borderColor: colors.main , backgroundColor: colors.submain , paddingBottom: 30 , marginLeft: 10 , marginRight: 10 , borderRadius: 5
    }
}

export default function( props ) {
    const [coord,setCoord] = React.useState(0);
    const [data,setData] = React.useState(null);
    const [refreshing,setRefreshing] = React.useState(false);
    const MyContext = React.useContext(AppContext) ;


    function setMap(res) {
        if( res?.latitude != null && res?.longitude != null ){
            setCoord({ latitude: Number(res.latitude) , longitude: Number(res.longitude)}) 
            }
        else 
            setCoord({ latitude: 37.53 , longitude : 127 })
    }

    function fetchInfo () {
        // 저장된 Info정보 확인 
        fetch('Info')
        .then( async(res) => {
            // 캐시 성공
            if (res != null) {
                setData(res);
                setMap(res);
            }
            else {
                API.get('/api/companyinfo')
                .then( async(res) => {
                    // 2. Info 정보를 setData()
                    try {
                        if ( res.data.statusCode == 200 ) {
                            // PUT
                            await store('Info',res.data.data) ;
                            setData( res.data.data );
                            setMap( res.data.data ) ;
                        }
                    }
                    catch(e) {
                        //
                    }
                })
                .catch( e => { 
                    let data = {
                        introduction : "업체 소개를 해주세요." ,
                        contact: "" ,
                        blogUrl : "" ,
                        siteUrl : "" ,
                        snsUrl : "" ,
                        address : "" ,
                        detailAddress : "" ,
                        latitude: "" ,
                        longitude: ""
                    } ;
                    API.post('/api/companyinfo',data)
                    .then( res => { })
                    .catch( e =>  { })

                } )
            }
        })
        .catch( (e) => {  });
    }

    React.useEffect(() =>  {

        // 1. 캐시 / 서버조회 => data => POST/PUT
        // 다시 Focus 되었을 때 변경사항이 있는지 확인
        fetchInfo(); 
  
    },[MyContext.infoRefresh]);

    // 처음 한번 좌표 호출
    React.useEffect(() =>  {
        fetch('Info')
        .then( (response) => {
            axios({
                method: 'GET' ,
                url : `https://api.vworld.kr/req/address?service=address&request=getCoord&key=98C4A0B1-90CD-30F6-B7D0-9F5A0DC9F18B&address=${response?.address}&type=ROAD` ,
            })
            .then(async (res) => {
                const point = res.data.response.result.point ;
                latitude = point.y ;
                longitude = point.x ;
                await store('Info',{ latitude : latitude , longitude: longitude });
            }
            )
            .catch(e => {
                setCoord({ latitude: 37.53 , longitude : 127 })
                //
            } ) ;
        })

    },[]);

    return(
        <>
        {
            coord == 0 ? ( <ActivityIndicator size='large' color={'black'} style={{ marginTop: 20 }}/> ) : (
            <KeyboardAwareScrollView 
                ref={ ref => { this.flatList = ref }}
                style={{ backgroundColor: 'white' }}

            >
            <View style={commonStyles.view}>
                <Row style={commonStyles.titleRow}>
                    <Title style= {{ fontSize: 23 , fontFamily: 'Jua-Regular'  }}> 업체 소개 </Title>
                    <ButtonRow 
                        style={{ right: 0 , position: 'absolute' }}
                        onPress={ () => { props.navigation.navigate('InfoRegister',{ data : data  }) }}
                    >
                        <Image resizeMode='contain' source={require('../../../resource/info_icon.png')}  style={{ width: 15, height: 15, alignSelf: 'center', marginBottom: 2 }} />
                        <Button 
                            labelStyle={{ fontSize: 15 , fontFamily: 'Jua-Regular' }}
                            color={colors.main}
                        >
                            정보수정
                        </Button>
                    </ButtonRow>
                </Row>
            <Text style={{ alignSelf: 'center' , margin: 5 , fontFamily: 'NotoSansKR-Medium' }}>{data?.introduction == null ? '업체 소개를 해주세요.' : data?.introduction }</Text>
            
            <Row style={{ marginTop: 20 , ...styles.row }}>
                <Avatar.Icon icon='phone' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={colors.main} size={30} />
                <Button color={'black'} >{data?.contact}</Button>
            </Row>
            <Row style={{ marginTop: 30 , ...styles.row  }}>
                <Avatar.Icon icon='link' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={colors.main} size={30} />
                <Button style={{ borderWidth: data?.blogUrl != null ? 1 : 0  , backgroundColor: data?.blogUrl != null && 'rgb(247,247,247)' }} uppercase={false} color={'black'} onPress={()=> { data?.blogUrl != null &&  Linking.openURL('http://'+data.blogUrl)}}>{data?.blogUrl}</Button>
            </Row>
            <Row style={{ marginTop: 30 , ...styles.row  }}>
                <Avatar.Icon icon='web' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={colors.main} size={30} />
                <Button style={{ borderBottomWidth: data?.siteUrl != null ? 1 : 0  ,backgroundColor: data?.siteUrl != null &&'rgb(247,247,247)' }}  uppercase={false} color={'black'} onPress={()=> { data?.siteUrl != null && Linking.openURL('http://'+data.siteUrl) }}>{data?.siteUrl}</Button>
            </Row>
            <Row style={{ marginTop: 30 , ...styles.row }}>
                <Avatar.Icon icon='instagram' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={colors.main} size={30} />
                <Button style={{ borderBottomWidth: data?.snsUrl != null ? 1 : 0  , backgroundColor: data?.snsUrl != null &&'rgb(247,247,247)' }}  uppercase={false} color={'black'} onPress={()=> { data?.snsUrl != null && Linking.openURL('http://instagram.com/'+data.snsUrl) }}>{ data?.snsUrl != null && '@'}{data?.snsUrl}</Button>
            </Row>
            <Row style={{ justifyContent: 'center' , marginTop: 10 }}>
                <Image resizeMode='contain' source={require('../../../resource/map_icon.png')}  style={{ width: 25  , height: 25, alignSelf: 'center' , margin: 5 }} />
                <Title style= {{ fontSize: 23 , fontFamily: 'Jua-Regular' }}> 위치 </Title>
            </Row>
            <Row style={{ marginTop: 10 , ...styles.row , marginBottom: 20 }}>
                <Text style={{ fontSize: 12 , fontFamily: 'NotoSansKR-Medium'  }}>{data?.address == null ? '위치를 등록해주세요.' : data.address}{' '}{data?.detailAddress == null ? '' :  data?.detailAddress }</Text>
            </Row>
            <NaverMapView style={{width: '80%', height: 300 , alignSelf : 'center' , borderWidth: 2 , borderColor: 'lightgray' , marginBottom: 20 }}
            center={{...coord, zoom: 13 }}
            showsMyLocationButton={false}
            >
            <Marker coordinate={coord} />
            </NaverMapView>
            {/* <View style={{ height: 100 , backgroundColor: 'lightgray' , alignItems: 'center' }}>
                <Text>hi</Text>
            </View> */}
            </View>
            </KeyboardAwareScrollView>
            )
        }
        </>
    );
}