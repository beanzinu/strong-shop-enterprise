import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { Divider, List , Text, Title } from 'react-native-paper';
import axios from 'axios';
import server from '../../../server/server';
import fetch from '../../../storage/fetch';
import colors from '../../../color/colors';

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
        fontWeight: 'bold'
    } ,
    labelStyle : {
        borderWidth: 1 , 
        borderColor: 'lightgray' 
    }
}



export default function() {
    const [data,setData] =  React.useState(null);


    function parseData( value ) {
       
            value.map( item => {
                item['detail'] = JSON.parse( item['detail'] ) ;
            })
            setData(value);        
    }



    React.useEffect(async() => {
    
        const token = await fetch('auth') ;
        const auth = token.auth ;
        
        // 내가 입찰한 정보
        axios({
            method: 'get' ,
            url: `${server.url}/api/bidding`,
            headers : { Auth : auth } 
        })
        .then(res => {
            parseData(res.data.data) ;
        })
        .catch(e => {
            //
        })

    
    },[]);

    return(
        <KeyboardAwareScrollView>
            {
                data != null && (
                    data.map( items => {
                        item = items.detail ;
                        return(
                            <List.Section>
                                <List.Accordion style={styles.listAccordionStyle} 
                                    title={item.carName} 
                                    titleStyle= {{ fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 }}
                                    theme={{ colors: { primary: 'red' }}}
                                >
                                    {
                                        item.tinting != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={item.tinting} right={props => <Text style={styles.itemText}>{item.tintingPrice}{' 만원'}</Text>} />
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