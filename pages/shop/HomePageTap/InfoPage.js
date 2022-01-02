import React from 'react';
import NaverMapView , { Marker } from 'react-native-nmap';
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button , Title , ActivityIndicator, Avatar } from 'react-native-paper';
import colors from '../../../color/colors';
import { Linking } from 'react-native';
import _ from 'lodash';
// storage
import API from '../../../server/API';
import fetch from '../../../storage/fetch';
import store from '../../../storage/store';
import AppContext from '../../../storage/AppContext';

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
        color : 'black' ,
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
                .catch( e => { } )
            }
        })
        .catch( (e) => {  });
    }

    React.useEffect(() =>  {

        // 1. 캐시 / 서버조회 => data => POST/PUT
        // 다시 Focus 되었을 때 변경사항이 있는지 확인
        fetchInfo(); 
  
    },[MyContext.infoRefresh]);

    return(
        <>
        {
            coord == 0 ? ( <ActivityIndicator size='large' color={'black'} style={{ marginTop: 20 }}/> ) : (
            <KeyboardAwareScrollView 
                ref={ ref => { this.flatList = ref }}
                style={{ backgroundColor: 'white' }}

            >
            <Button icon='hammer' style={ styles.button }
                onPress={ () => { props.navigation.navigate('InfoRegister',{ data : data  }) }}
                color={colors.main}
            >
                수정하기
            </Button>
            <Title style= { styles.title }> 업체 소개 </Title>
            <Text>{data?.introduction == null ? '업체 소개를 해주세요.' : data?.introduction }</Text>
            <Row>
                <Avatar.Icon icon='phone' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={'black'} size={30} />
                <Button color={'black'} >{data?.contact}</Button>
            </Row>
            <Row style={{ marginTop: 5 }}>
                <Avatar.Icon icon='link' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={'black'} size={30} />
                <Button style={{ borderWidth: data?.blogUrl != null ? 1 : 0  , backgroundColor: data?.blogUrl != null && 'rgb(247,247,247)' }} uppercase={false} color={'black'} onPress={()=> { data?.blogUrl != null &&  Linking.openURL('http://'+data.blogUrl)}}>{data?.blogUrl}</Button>
            </Row>
            <Row style={{ marginTop: 5 }}>
                <Avatar.Icon icon='web' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={'black'} size={30} />
                <Button style={{ borderBottomWidth: data?.siteUrl != null ? 1 : 0  ,backgroundColor: data?.siteUrl != null &&'rgb(247,247,247)' }}  uppercase={false} color={'black'} onPress={()=> { data?.siteUrl != null && Linking.openURL('http://'+data.siteUrl) }}>{data?.siteUrl}</Button>
            </Row>
            <Row style={{ marginTop: 5 }}>
                <Avatar.Icon icon='instagram' style={{ backgroundColor: 'transparent' , marginLeft: 10 }} color={'black'} size={30} />
                <Button style={{ borderBottomWidth: data?.snsUrl != null ? 1 : 0  , backgroundColor: data?.snsUrl != null &&'rgb(247,247,247)' }}  uppercase={false} color={'black'} onPress={()=> { data?.snsUrl != null && Linking.openURL('http://instagram.com/'+data.snsUrl) }}>{ data?.snsUrl != null && '@'}{data?.snsUrl}</Button>
            </Row>
            <Title style= { styles.title }> 위치 </Title>
            <Text style={{ marginBottom: 20 }}>{data?.address == null ? '위치를 등록해주세요.' : data.address}{'\n'}{data?.detailAddress == null ? '' :  data?.detailAddress }</Text>
            <NaverMapView style={{width: '80%', height: 300 , alignSelf : 'center' , borderWidth: 2 , borderColor: 'lightgray' , marginBottom: 20 }}
            center={{...coord, zoom: 13 }}
            showsMyLocationButton={false}
            >
            <Marker coordinate={coord} />
            </NaverMapView>
            </KeyboardAwareScrollView>
            )
        }
        </>
    );
}