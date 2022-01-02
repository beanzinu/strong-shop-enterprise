import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { Divider, List , Text, Title } from 'react-native-paper';
import axios from 'axios';
import { View  } from 'react-native';
import server from '../../../server/server';
import fetch from '../../../storage/fetch';
import colors from '../../../color/colors';
import { Dimensions } from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
// components
import BidList from '../BidPage/BidList';


const styles = {
    listAccordionStyle : {
        backgroundColor: 'white' ,
        borderTopWidth: 1 ,
        borderTopColor: 'lightgray'        
    } ,
    listStyle1 : {
        fontSize: 17 , 
        fontWeight: 'bold'
    } ,
    listStyle : {
        // fontWeight: 'bold',
        fontSize: 17 , 

    } ,
    itemText: {
        fontSize: 17 ,
        fontWeight: 'bold' ,
    } ,
    labelStyle : {
        borderWidth: 1 , 
        borderColor: 'lightgray' 
    }
}

export default function() {
    const [data,setData] = React.useState(null);
    const isFocused = useIsFocused();

    function parseData( value ) {

        
        value.map( item => {
            item['details'] = JSON.parse( item['details'] ) ;
            item['createdTime'] = moment(item['createdTime']).format('YYYY-MM-DD');
        })
        value = _.filter(value,function(o) { return o.biddingStatus == 'SUCCESS' } )
        value = _.sortBy(value, function(o){ return o.createdTime } ) ;
        setData( _.reverse(value));        
    }



    React.useEffect(() => {

        if ( isFocused) {
            fetch('auth')
            .then( res => {
                const auth = res.auth ;
                // 내가 입찰한 정보
                axios({
                    method: 'get' ,
                    url: `${server.url}/api/biddinghistory`,
                    headers : { Auth : auth } 
                })
                .then(res => {
                    if ( res.data.statusCode == 200 ) {
                        if ( res.data.data == null || res.data.data.length == 0 ) return;
                        else parseData(res.data.data) ;
                    }
                })
                .catch(e => {
                    //
                })
            }) ;    
        }

    },[ isFocused ]);

    return(
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
            {
                data == null ? 
                (
                    <View style={{ height: Dimensions.get('screen').height*0.8 , justifyContent: 'center' , alignItems: 'center'  }}>
                            {/* <Avatar.Icon icon='account-arrow-left' style={{ backgroundColor: 'transparent'}} color='black'/> */}
                            <Text>과거 시공내역이 없어요.</Text>
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
                                <BidList.A item={item} />
                            </List.Section>
                        )
                    })
                )
            }
        </KeyboardAwareScrollView>
    );
}