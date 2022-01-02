import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { Divider, List , Text, Title , Avatar, ActivityIndicator } from 'react-native-paper';
import styled from 'styled-components';
import axios from 'axios';
import server from '../../../server/server';
import fetch from '../../../storage/fetch';
import colors from '../../../color/colors';
import { Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import BidList from './BidList';
// server
import API from '../../../server/API';

const View = styled.View``;




export default function() {
    const [data,setData] =  React.useState(null);
    const [loading,setLoading] = React.useState(true);
    const isFocused = useIsFocused();

    function parseData( value ) {
       
            value.map( item => {
                item['detail'] = JSON.parse( item['detail'] ) ;
            })
            setData(value);        
    }




    React.useEffect(() => {
    
        if ( isFocused ) {
            API.get('/api/bidding')
            .then( res => {
                setLoading(false);

                if ( res.data.data == null || res.data.data.length == 0 )  {
                    setData(null);
                    return;
                }
                else parseData(res.data.data) ;

            })
            .catch( e => {
                setLoading(false);
            })
        }   

    },[isFocused]);

    return(
        <KeyboardAwareScrollView>
            {
                loading ? <ActivityIndicator style={{ marginTop: 30 }} color='black' size='large'/> :
                data == null ? 
                (
                    <View style={{ height: Dimensions.get('screen').height*0.8 , justifyContent: 'center' , alignItems: 'center'  }}>
                            {/* <Avatar.Icon icon='account-arrow-left' style={{ backgroundColor: 'transparent'}} color='black'/> */}
                            <Text>현재 입찰중인 건이 없어요.</Text>
                    </View>
                )
                :
                (
                    data.map( items => {
                        const item = items.detail ;
                        return(
                            <List.Section>
                                <BidList.A item={item} />
                            </List.Section>
                            
                        )
                    })
                )
            }
        </KeyboardAwareScrollView>
    );
}