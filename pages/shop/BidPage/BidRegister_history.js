import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { Divider, List , Text, Title } from 'react-native-paper';
import axios from 'axios';
import server from '../../../server/server';
import fetch from '../../../storage/fetch';
import colors from '../../../color/colors';
import moment from 'moment';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';


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
        value = _.sortBy(value, function(o){ return o.createdTime } ) ;
        console.log(value);
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
                    parseData( res.data.data ) ;
                })
                .catch(e => {
                    //
                })
            }) ;    
        }

    },[ isFocused ]);

    return(
        <KeyboardAwareScrollView>
            {
                data != null && (
                    data.map( ( row,index) => {
                        const item = row.details ;
                        console.log(item);
                        console.log(item.tintingPrice);
                        let prevDate ;
                        if (index == 0 ) prevDate = moment(data[index].createdAt).add(1,'days') ;
                        else if ( index != 0 ) prevDate = data[index-1].createdTime ;

                        return(
                            <List.Section>
                                {
                                    moment(row.createdTime).isBefore(prevDate) && 
                                    <Title style={{ padding: 5 , fontSize: 15 }}>{ row.createdTime }</Title>
                                }
                                <List.Accordion style={styles.listAccordionStyle} 
                                    title={item.carName} 
                                    left={ props => (<Text style={{ padding: 5 , color: row.biddingStatus=='SUCCESS' ? 'blue' : 'red' }}>{row.biddingStatus =='SUCCESS' ? '낙찰' : '실패' }</Text> ) }
                                    titleStyle= {{ fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 }}
                                    theme={{ colors: { primary: 'red' }}}
                                >   
                                    {
                                        item.tinting != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.tinting} right={ props => <Text style={styles.itemText}>{item.tintingPrice}{'만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.ppf != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.ppf} right={props => <Text style={styles.itemText}>{item.ppfPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.blackbox != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.blackbox} right={props => <Text style={styles.itemText}>{item.blackboxPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.battery != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.battery} right={props => <Text style={styles.itemText}>{item.batteryPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.afterblow != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.afterblow} right={props => <Text style={styles.itemText}>{item.afterblowPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.soundproof != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.soundproof} right={props => <Text style={styles.itemText}>{item.soundproofPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.wrapping != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.wrapping} right={props => <Text style={styles.itemText}>{item.wrappingPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.glasscoating != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.glasscoating} right={props => <Text style={styles.itemText}>{item.glasscoatingPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        item.undercoating != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='언더코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.undercoating} right={props => <Text style={styles.itemText}>{item.undercoatingPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    <Divider style={{ margin: 10 }} />
                                    <List.Item titleStyle={styles.listStyle} title ='최종가격: ' right={props => <Text style={styles.itemText}>{item.totalPrice}{' 만원'}</Text>}/>
                                </List.Accordion>
                            </List.Section>
                            
                        )
                    })
                )
            }
        </KeyboardAwareScrollView>
    );
}