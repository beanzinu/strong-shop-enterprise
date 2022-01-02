import React from 'react';
import { List, Divider, Text, IconButton  } from "react-native-paper";
import { View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import styled from 'styled-components';
const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;
const Item = styled.TouchableOpacity`
    height: 70px;
    align-items: center;
    flex-direction: row;
`;
const styles = {
    listAccordionStyle : {
        backgroundColor: 'white' ,
        // borderWidth: 1 ,
        // borderColor: 'gray'        
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
        alignSelf: 'center'
    } ,
    labelStyle : {
        // borderBottomWidth: 1 , 
        borderColor: 'lightgray' ,
        alignItems: 'center'
    },
    itemStyle: {
        alignItems: 'center'
    } ,
    view : {
        margin: 5, borderWidth: 3, borderColor: 'lightgray', borderRadius: 10
    }
}

// 입찰 중 
function A({ item }){
    const [collapsed,setCollapsed] = React.useState(true);
    return(
        <>
        {/* <List.Accordion 
            style={styles.listAccordionStyle} 
            title={item.carName} 
            titleStyle= {{ fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 }}
            theme={{ colors: { primary: 'red' }}}
            onPress={ () => { setCollapsed(!collapsed) }}
        >
        </List.Accordion> */}
        <Item onPress={ () => { setCollapsed(!collapsed) }}>
            <Text style={{fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 , marginLeft: 20  }}>{item.carName}</Text>
            <IconButton icon={ collapsed? 'chevron-down' : 'chevron-up' } style={{ right: 5 , position: 'absolute' }}/>
        </Item>
        <Collapsible collapsed={collapsed} duration={100}>
        
            <View style={styles.view}>
            {
                item.tinting != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle} titleStyle={styles.listStyle} title ={item.tinting} right={props => <Text style={styles.itemText}>{item.tintingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.ppf != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.ppf} right={props => <Text style={styles.itemText}>{item.ppfPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.blackbox != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.blackbox} right={props => <Text style={styles.itemText}>{item.blackboxPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.battery != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.battery} right={props => <Text style={styles.itemText}>{item.batteryPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.afterblow != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.afterblow} right={props => <Text style={styles.itemText}>{item.afterblowPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.soundproof != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.soundproof} right={props => <Text style={styles.itemText}>{item.soundproofPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.wrapping != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.wrapping} right={props => <Text style={styles.itemText}>{item.wrappingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.glasscoating != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.glasscoating} right={props => <Text style={styles.itemText}>{item.glasscoatingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.undercoating != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='언더코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.undercoating} right={props => <Text style={styles.itemText}>{item.undercoatingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            <Divider style={{ margin: 5, borderWidth: 1 , borderColor: 'lightgray' }} />
            <List.Item style={styles.itemStyle}  titleStyle={{...styles.listStyle, fontWeight: 'bold'}} title ='최종가격: ' right={props => <Text style={{...styles.itemText, fontWeight: 'bold' }}>{item.totalPrice}{' 만원'}</Text>}/>
            </View>

        </Collapsible>
        </>
    )
}

// 입찰결과 
// 낙찰/실패 여부 포함
function B( {item,row} ){
    const [collapsed,setCollapsed] = React.useState(true);
    return(
        // <List.Accordion style={styles.listAccordionStyle} 
        //     title={item.carName} 
        //     right={ props => (
        //         <Row style={{ height: 20 }}>
        //             <Text style={{ color: row.biddingStatus=='SUCCESS' ? 'blue' : 'red' }}>{row.biddingStatus =='SUCCESS' ? '낙찰' : '실패' }</Text> 
        //             <IconButton icon='chevron-down'/>
        //         </Row>
        //     ) }
        //     titleStyle= {{ fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 24 }}
        //     theme={{ colors: { primary: 'red' }}}
        // >   
        <>
        <Item onPress={ () => { setCollapsed(!collapsed) }}>
            <Text style={{fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 , marginLeft: 20  }}>{item.carName}</Text>
            <Row style={{ right: 5 , position: 'absolute' }}> 
                <Text style={{color: row.biddingStatus=='SUCCESS' ? 'blue' : 'red' }}>{row.biddingStatus =='SUCCESS' ? '낙찰' : '실패' }</Text> 
                <IconButton icon={ collapsed? 'chevron-down' : 'chevron-up' } />
            </Row>
        </Item>
        <Collapsible collapsed={collapsed} duration={100}>
            <View style={styles.view}>
            {
                item.tinting != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle} titleStyle={styles.listStyle} title ={item.tinting} right={props => <Text style={styles.itemText}>{item.tintingPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.ppf != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.ppf} right={props => <Text style={styles.itemText}>{item.ppfPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.blackbox != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.blackbox} right={props => <Text style={styles.itemText}>{item.blackboxPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.battery != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.battery} right={props => <Text style={styles.itemText}>{item.batteryPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.afterblow != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.afterblow} right={props => <Text style={styles.itemText}>{item.afterblowPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.soundproof != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.soundproof} right={props => <Text style={styles.itemText}>{item.soundproofPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.wrapping != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.wrapping} right={props => <Text style={styles.itemText}>{item.wrappingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.glasscoating != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.glasscoating} right={props => <Text style={styles.itemText}>{item.glasscoatingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.undercoating != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='언더코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.undercoating} right={props => <Text style={styles.itemText}>{item.undercoatingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            <Divider style={{ margin: 5, borderWidth: 1 , borderColor: 'lightgray' }} />
            <List.Item style={styles.itemStyle}  titleStyle={{...styles.listStyle, fontWeight: 'bold'}} title ='최종가격: ' right={props => <Text style={{...styles.itemText, fontWeight: 'bold' }}>{item.totalPrice}{' 만원'}</Text>}/>
            </View>
        </Collapsible>    
        </>
    )
}
// 시공진행상황 페이지
function C({item}){
    return(
        <View style={styles.view}>
            {
                item.tinting != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle} titleStyle={styles.listStyle} title ={item.tinting} right={props => <Text style={styles.itemText}>{item.tintingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.ppf != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.ppf} right={props => <Text style={styles.itemText}>{item.ppfPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.blackbox != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.blackbox} right={props => <Text style={styles.itemText}>{item.blackboxPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.battery != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.battery} right={props => <Text style={styles.itemText}>{item.batteryPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.afterblow != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.afterblow} right={props => <Text style={styles.itemText}>{item.afterblowPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.soundproof != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.soundproof} right={props => <Text style={styles.itemText}>{item.soundproofPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.wrapping != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.wrapping} right={props => <Text style={styles.itemText}>{item.wrappingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.glasscoating != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.glasscoating} right={props => <Text style={styles.itemText}>{item.glasscoatingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            {
                item.undercoating != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='언더코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} title ={item.undercoating} right={props => <Text style={styles.itemText}>{item.undercoatingPrice}{' 만원'}</Text>} />
                    </>
                )
            }
            <Divider style={{ margin: 5, borderWidth: 1 , borderColor: 'lightgray' }} />
            <List.Item style={styles.itemStyle}  titleStyle={{...styles.listStyle, fontWeight: 'bold'}} title ='최종가격: ' right={props => <Text style={{...styles.itemText, fontWeight: 'bold' }}>{item.totalPrice}{' 만원'}</Text>}/>
            </View>
    )
}

export default {A,B,C};