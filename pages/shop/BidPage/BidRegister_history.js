import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { ActivityIndicator, Divider, List , Text, Title } from 'react-native-paper';
import axios from 'axios';
import { RefreshControl, View  } from 'react-native';
// API
import API from '../../../server/API';
import server from '../../../server/server';
import fetch from '../../../storage/fetch';
import colors from '../../../color/colors';
import { Dimensions } from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
// components
import BidList from './BidList';



export default function() {
    const [data,setData] = React.useState(null);
    const [loading,setLoading] = React.useState(true);
    const [refreshing,setRefreshing] = React.useState(false);
    const isFocused = useIsFocused();

    function parseData( value ) {

        
        value.map( item => {
            item['details'] = JSON.parse( item['details'] ) ;
            item['createdTime'] = moment(item['createdTime']).format('YYYY-MM-DD');
        })
        value = _.sortBy(value, function(o){ return o.createdTime } ) ;
        setData( _.reverse(value));        
    }


    function getBiddingHistory() {

        API.get('/api/biddinghistory')
        .then(res => {
            if ( res.data.statusCode == 200 ) {
                if ( res.data.data == null || res.data.data.length == 0 )  {
                    setLoading(false);
                    return;
                }
                else parseData(res.data.data) ;
            }
            setLoading(false);
        })
        .catch(e => {
            setLoading(false);
        })
    }

    React.useEffect(() => {

        if ( isFocused) {
           getBiddingHistory()
        }

    },[ isFocused ]);

    return(
        <KeyboardAwareScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getBiddingHistory}/>}>
            {
                loading ? <ActivityIndicator style={{ marginTop: 20 }} size='large' color='black' /> : 
                data == null ? 
                (
                    <View style={{ height: Dimensions.get('screen').height*0.6 , justifyContent: 'center' , alignItems: 'center'  }}>
                            {/* <Avatar.Icon icon='account-arrow-left' style={{ backgroundColor: 'transparent'}} color='black'/> */}
                            <Text>현재 입찰내역이 없어요.</Text>
                    </View>
                )
                :
                (
                    data.map( ( row,index) => {
                        const item = row.details ;
                        let prevDate ;
                        if (index == 0 ) prevDate = moment(data[index].createdAt).add(1,'days') ;
                        else if ( index != 0 ) prevDate = data[index-1].createdTime ;

                        return(
                            <List.Section>
                                {
                                    moment(row.createdTime).isBefore(prevDate) && 
                                    <>
                                    <Divider style={{ borderBottomWidth: 10 , borderColor: 'rgb(244,244,244)'  }} />
                                    <Title style={{ padding: 5 , fontSize: 13 , marginLeft: 12 , color: 'gray'  }}>{ row.createdTime }</Title>
                                    </>
                                }
                                <BidList.B row={row} item={item} />
                            </List.Section>
                            
                            
                        )
                    })
                )
            }
            {/* <Divider style={{ borderBottomWidth: 10 , borderColor: 'rgb(244,244,244)'  }} /> */}
        </KeyboardAwareScrollView>
    );
}