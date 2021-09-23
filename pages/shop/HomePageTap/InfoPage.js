import React from 'react';
import NaverMapView , { Marker } from 'react-native-nmap';
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button , Title , ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import colors from '../../../color/colors';
// storage
import fetch from '../../../storage/fetch';
import store from '../../../storage/store';

const Text = styled.Text`
    margin-left: 10px;
    font-size: 15px ;
    padding: 20px ;
`;

const styles = {
    title : {
        fontWeight: 'bold' ,
        color : colors.main ,
        marginLeft : 10 ,
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30
    } ,
    button : {
        alignSelf: 'flex-end' , 
        padding : 5 
    }
}

const data = {
    company_id : 2 ,
    longitude : '' ,
    latitude : '' ,
    introduction : '업체에 대해 간단한 소개를 해주세요.'
}

export default function( props ) {
    const [coord,setCoord] = React.useState(0);
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


      

    },[]);

    handleScroll = function( event ) {
        props.setScroll(event.nativeEvent.contentOffset.y);
    } ;
    

    return(
        <>
        {
            coord == 0 ? ( <ActivityIndicator size='large' color={colors.main} style={{ marginTop: 20 }}/> ) : (
            <KeyboardAwareScrollView onScrollEndDrag={ this.handleScroll }>
            <Button icon='hammer' style={ styles.button }
                onPress={ () => { props.navigation.navigate('InfoRegister',{ data : data }) }}
                color={colors.main}
            >
                수정하기
            </Button>
            <Title style= { styles.title }> 업체 소개 </Title>
            <Text>{data.introduction}</Text>
            <Title style= { styles.title }> 위치 </Title>
            <Text>{props.data.location}</Text>
            <NaverMapView style={{width: '80%', height: 400 , alignSelf : 'center' }}
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