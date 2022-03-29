import React from 'react';
import { List, Divider, Text, IconButton , Badge  } from "react-native-paper";
import { View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import styled from 'styled-components';
import colors from '../../../color/colors';
import commonStyles from '../../../components/commonStyles';

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
        alignSelf: 'center' ,
        color: colors.main
    } ,
    itemText: {
        fontSize: 17 ,
        alignSelf: 'center' , 
        marginLeft: 5
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
function countNcpItems( item ){
    let count = 0 ;
    let flag = false; 
    let firstItem = "";
    
    if ( item.hasOwnProperty("tinting")) { if ( !flag ) { flag = true; firstItem = "틴팅" } count += 1 } ;
    if ( item.hasOwnProperty("ppf")) { if ( !flag ) { flag = true;  firstItem = "PPF" } count += 1 } ;
    if ( item.hasOwnProperty("blackbox")) { if ( !flag ) { flag = true; firstItem = "블랙박스" } count += 1 } ;
    if ( item.hasOwnProperty("battery")) { if ( !flag ) { flag = true; firstItem = "보조배터리" } count += 1 } ;
    if ( item.hasOwnProperty("afterblow")) { if ( !flag ) { flag = true; firstItem = "애프터블로우" } count += 1 } ;
    if ( item.hasOwnProperty("soundproof")) { if ( !flag ) { flag = true; firstItem = "방음" } count += 1 } ;
    if ( item.hasOwnProperty("wrapping")) { if ( !flag ) { flag = true; firstItem = "랩핑" } count += 1 } ;
    if ( item.hasOwnProperty("glasscoating")) { if ( !flag ) { flag = true; firstItem = "유리막코팅" } count += 1 } ;
    if ( item.hasOwnProperty("bottomcoating")) { if ( !flag ) { flag = true; firstItem = "하부코팅" } count += 1 } ;
    return firstItem + " 등 " + count + "건";
}

function countCareItems( item ){
    let count = 0 ;
    let flag = false; 
    let firstItem = "";
    
    if ( item.carwash ) { if ( !flag ) { flag = true; firstItem = "세차" } count += 1 } ;
    if ( item.inside ) { if ( !flag ) { flag = true; firstItem = "내부" } count += 1 } ;
    if ( item.outside ) { if ( !flag ) { flag = true; firstItem = "외부" } count += 1 } ;
    if ( item.scratch ) { if ( !flag ) { flag = true; firstItem = "스크레치" } count += 1 } ;
    if ( item.etc ) { if ( !flag ) { flag = true; firstItem = "기타" } count += 1 } ;
    
    return firstItem + " 등 " + count + "건";
}

function Care_A({ item }){
    const [collapsed,setCollapsed] = React.useState(true);
    return(
        <>
        {/* <Item onPress={ () => { setCollapsed(!collapsed) }}>
            <Text style={{fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 , marginLeft: 20  }}>{item.carName}</Text>
            <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 20 , backgroundColor: colors.care , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>케어</Badge>
            <IconButton icon={ collapsed? 'chevron-down' : 'chevron-up' } style={{ right: 5 , position: 'absolute' }}/>
        </Item>
        <Collapsible collapsed={collapsed} duration={100}> */}
            <View style={commonStyles.view}>
                <>
                    <Item style={commonStyles.titleRow} onPress={ () => { setCollapsed(!collapsed) }}>
                        <Text style={{fontWeight : 'bold' , fontFamily: 'NotoSansKR-Medium' , fontSize: 15 }}>{item.carName} (케어)</Text>
                        {/* <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 20 , backgroundColor: colors.main , color: 'white' , paddingLeft: 10 , paddingRight: 10  }}>신차</Badge> */}
                        <Row style={{ right: 0 , position: 'absolute'}}>
                            <Text style={{ color: colors.main , fontSize: 10 }}>입찰내용</Text>
                            <IconButton size={20} color={colors.main} icon={ collapsed? 'chevron-down' : 'chevron-up' } />  
                        </Row>
                    </Item>
                    <Divider style={{ alignSelf: 'center' , width: '90%' , borderColor: 'rgb(231,207,192)' , borderWidth: 0.5 }} />
                    {
                        collapsed &&
                        <Text style={{ alignSelf: 'center' , fontWeight: 'bold' , marginTop: 20}}>{countCareItems(item)}</Text>
                    }
                </> 
            <Collapsible collapsed={collapsed} duration={100}>
                <View style={{ backgroundColor: 'white' , margin: 10 , borderWidth: 1 , borderColor: colors.main , borderRadius: 5 }}>
            {
                item.carwash != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='세차' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle} titleStyle={styles.listStyle}
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.carwash}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.carwashPrice}{' 만원'}</Text>}  
                        />                        
                    </>
                )
            }
            {
                item.inside != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='내부' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.inside}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.insidePrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            {
                item.outside != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='외부' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.outside}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.outsidePrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            {
                item.scratch != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='스크레치' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.scratch}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.scratchPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            {
                item.etc != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='기타' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.etc}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.etcPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            <Divider style={{ margin: 5, borderWidth: 1 , borderColor: 'lightgray' }} />
            <List.Item style={styles.itemStyle}  titleStyle={{...styles.listStyle, fontWeight: 'bold'}} right={props => <Text style={{...styles.itemText, fontWeight: 'bold' }}>{'최종가격:  '}{item.totalPrice}{' 만원'}</Text>}/>
            </View>

        </Collapsible>
        </View>
        </>
    )
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
        {/* <Item onPress={ () => { setCollapsed(!collapsed) }}>
            <Text style={{fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 , marginLeft: 20  }}>{item.carName}</Text>
            <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 20 , backgroundColor: colors.main , color: 'white' , paddingLeft: 10 , paddingRight: 10  }}>신차</Badge>
            <IconButton icon={ collapsed? 'chevron-down' : 'chevron-up' } style={{ right: 5 , position: 'absolute' }}/>
        </Item>
        <Collapsible collapsed={collapsed} duration={100}> */}
        
            <View style={commonStyles.view}>
                <>
                    <Item style={commonStyles.titleRow} onPress={ () => { setCollapsed(!collapsed) }}>
                        <Text style={{fontWeight : 'bold' , fontFamily: 'NotoSansKR-Medium' , fontSize: 15 }}>{item.carName} (신차)</Text>
                        {/* <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 20 , backgroundColor: colors.main , color: 'white' , paddingLeft: 10 , paddingRight: 10  }}>신차</Badge> */}
                        <Row style={{ right: 0 , position: 'absolute'}}>
                            <Text style={{ color: colors.main , fontSize: 10 }}>입찰내용</Text>
                            <IconButton size={20} color={colors.main} icon={ collapsed? 'chevron-down' : 'chevron-up' } />  
                        </Row>
                    </Item>
                    <Divider style={{ alignSelf: 'center' , width: '90%' , borderColor: 'rgb(231,207,192)' , borderWidth: 0.5 }} />
                    {
                        collapsed &&
                        <Text style={{ alignSelf: 'center' , fontWeight: 'bold' , marginTop: 20}}>{countNcpItems(item)}</Text>
                    }
                </> 
            <Collapsible collapsed={collapsed} duration={100}>
                <View style={{ backgroundColor: 'white' , margin: 10 , borderWidth: 1 , borderColor: colors.main , borderRadius: 5 }}>
            {
                item.tinting != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item  style={styles.itemStyle} titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.tinting}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.tintingPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            {
                item.ppf != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.ppf}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.ppfPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            {
                item.blackbox != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle}
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.blackbox}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.blackboxPrice}{' 만원'}</Text>}  
                        />
                    </>
                )
            }
            {
                item.battery != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                        title ={" -  -  -  -  -  -  -  "} 
                        left={props =>  <Text style={styles.itemText}>{item.battery}</Text>} 
                        right={props => <Text style={styles.itemText}>{item.batteryPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            {
                item.afterblow != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.afterblow}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.afterblowPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            {
                item.soundproof != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.soundproof}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.soundproofPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            {
                item.wrapping != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.wrapping}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.wrappingPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            {
                item.glasscoating != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.glasscoating}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.glasscoatingPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            {
                item.bottomcoating != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='하부코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.bottomcoating}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.bottomcoatingPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
            }
            <Divider style={{ margin: 5, borderWidth: 0.5 , borderColor: colors.main }} />
            <List.Item style={styles.itemStyle}  titleStyle={{...styles.listStyle, fontWeight: 'bold'}} right={props => <Text style={{...styles.itemText, fontWeight: 'bold' }}>{'최종가격:  '}{item.totalPrice}{' 만원'}</Text>}/>
            </View>
            </Collapsible>
            </View>

        {/* </Collapsible> */}
        </>
    )
}
function Care_B( { item,row } ){
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
        {/* <Item onPress={ () => { setCollapsed(!collapsed) }}>
            <Text style={{fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 , marginLeft: 20  }}>{item.carName}</Text>
            <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 20 , backgroundColor: colors.care , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>케어</Badge>
            <Row style={{ right: 5 , position: 'absolute' }}> 
                <Text style={{color: row.biddingStatus=='SUCCESS' ? 'blue' : 'red' }}>{row.biddingStatus =='SUCCESS' ? '낙찰' : '실패' }</Text> 
                <IconButton icon={ collapsed? 'chevron-down' : 'chevron-up' } />
            </Row>
        </Item>
        <Collapsible collapsed={collapsed} duration={100}>
        <View style={styles.view}> */}
        <View style={commonStyles.view}>
                <>
                    <Item style={commonStyles.titleRow} onPress={ () => { setCollapsed(!collapsed) }}>
                        <Text style={{fontWeight : 'bold' , fontFamily: 'NotoSansKR-Medium' , fontSize: 15 }}>{item.carName} (케어)</Text>
                        {/* <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 20 , backgroundColor: colors.main , color: 'white' , paddingLeft: 10 , paddingRight: 10  }}>신차</Badge> */}
                        <Row style={{ right: 0 , position: 'absolute'}}>
                            <Text style={{ color: row.biddingStatus == 'SUCCESS' ? 'blue' : 'red' , fontSize: 10 }}>{row.biddingStatus =='SUCCESS' ? '낙찰' : '실패' }</Text>
                            <IconButton size={20} color={colors.main} icon={ collapsed? 'chevron-down' : 'chevron-up' } />  
                        </Row>
                    </Item>
                    <Divider style={{ alignSelf: 'center' , width: '90%' , borderColor: 'rgb(231,207,192)' , borderWidth: 0.5 }} />
                    {
                        collapsed &&
                        <Text style={{ alignSelf: 'center' , fontWeight: 'bold' , marginTop: 20}}>{countCareItems(item)}</Text>
                    }
                </> 
            <Collapsible collapsed={collapsed} duration={100}>
                <View style={{ backgroundColor: 'white' , margin: 10 , borderWidth: 1 , borderColor: colors.main , borderRadius: 5 }}>
                {
                item.carwash != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='세차' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle} titleStyle={styles.listStyle}
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.carwash}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.carwashPrice}{' 만원'}</Text>}  
                        />                        
                    </>
                )
                }
                {
                    item.inside != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='내부' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.inside}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.insidePrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.outside != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='외부' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.outside}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.outsidePrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.scratch != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='스크레치' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.scratch}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.scratchPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.etc != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='기타' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.etc}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.etcPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
            <Divider style={{ margin: 5, borderWidth: 1 , borderColor: 'lightgray' }} />
            <List.Item style={styles.itemStyle}  titleStyle={{...styles.listStyle, fontWeight: 'bold'}} right={props => <Text style={{...styles.itemText, fontWeight: 'bold' }}>{'최종가격:  '}{item.totalPrice}{' 만원'}</Text>}/>
            </View>
            </Collapsible>
            </View>   
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
        {/* <Item onPress={ () => { setCollapsed(!collapsed) }}>
            <Text style={{fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 , marginLeft: 20  }}>{item.carName}</Text>
            <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 20 , backgroundColor: colors.main , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>신차</Badge>
            <Row style={{ right: 5 , position: 'absolute' }}> 
                <Text style={{color: row.biddingStatus=='SUCCESS' ? 'blue' : 'red' }}>{row.biddingStatus =='SUCCESS' ? '낙찰' : '실패' }</Text> 
                <IconButton icon={ collapsed? 'chevron-down' : 'chevron-up' } />
            </Row>
        </Item>
        <Collapsible collapsed={collapsed} duration={100}>
            <View style={styles.view}> */}
            <View style={commonStyles.view}>
                <>
                    <Item style={commonStyles.titleRow} onPress={ () => { setCollapsed(!collapsed) }}>
                        <Text style={{fontWeight : 'bold' , fontFamily: 'NotoSansKR-Medium' , fontSize: 15 }}>{item.carName} (케어)</Text>
                        {/* <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 20 , backgroundColor: colors.main , color: 'white' , paddingLeft: 10 , paddingRight: 10  }}>신차</Badge> */}
                        <Row style={{ right: 0 , position: 'absolute'}}>
                            <Text style={{ color: row.biddingStatus == 'SUCCESS' ? 'blue' : 'red' , fontSize: 10 }}>{row.biddingStatus =='SUCCESS' ? '낙찰' : '실패' }</Text>
                            <IconButton size={20} color={colors.main} icon={ collapsed? 'chevron-down' : 'chevron-up' } />  
                        </Row>
                    </Item>
                    <Divider style={{ alignSelf: 'center' , width: '90%' , borderColor: 'rgb(231,207,192)' , borderWidth: 0.5 }} />
                    {
                        collapsed &&
                        <Text style={{ alignSelf: 'center' , fontWeight: 'bold' , marginTop: 20}}>{countNcpItems(item)}</Text>
                    }
                </> 
            <Collapsible collapsed={collapsed} duration={100}>
                <View style={{ backgroundColor: 'white' , margin: 10 , borderWidth: 1 , borderColor: colors.main , borderRadius: 5 }}>
                {
                item.tinting != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item  style={styles.itemStyle} titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.tinting}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.tintingPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
                }
                {
                    item.ppf != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.ppf}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.ppfPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.blackbox != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle}
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.blackbox}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.blackboxPrice}{' 만원'}</Text>}  
                            />
                        </>
                    )
                }
                {
                    item.battery != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.battery}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.batteryPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.afterblow != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.afterblow}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.afterblowPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.soundproof != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.soundproof}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.soundproofPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.wrapping != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.wrapping}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.wrappingPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.glasscoating != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.glasscoating}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.glasscoatingPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.bottomcoating != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='하부코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.bottomcoating}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.bottomcoatingPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
            <Divider style={{ margin: 5, borderWidth: 1 , borderColor: 'lightgray' }} />
            <List.Item style={styles.itemStyle}  titleStyle={{...styles.listStyle, fontWeight: 'bold'}} right={props => <Text style={{...styles.itemText, fontWeight: 'bold' }}>{'최종가격:  '}{item.totalPrice}{' 만원'}</Text>}/>
            </View>
            </Collapsible>
            </View>   
        </>
    )
}
// 시공진행상황 페이지
function Care_C({item}){
    return(
        <View style={{ ...commonStyles.view ,backgroundColor: 'white' }}>
            {
                item.carwash != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='세차' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item style={styles.itemStyle} titleStyle={styles.listStyle}
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.carwash}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.carwashPrice}{' 만원'}</Text>}  
                        />                        
                    </>
                )
                }
                {
                    item.inside != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='내부' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.inside}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.insidePrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.outside != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='외부' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.outside}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.outsidePrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.scratch != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='스크레치' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.scratch}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.scratchPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.etc != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='기타' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.etc}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.etcPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
            <Divider style={{ margin: 5, borderWidth: 1 , borderColor: 'lightgray' }} />
            <List.Item style={styles.itemStyle}  titleStyle={{...styles.listStyle, fontWeight: 'bold'}} right={props => <Text style={{...styles.itemText, fontWeight: 'bold' }}>{'최종가격:  '}{item.totalPrice}{' 만원'}</Text>}/>
            </View>
    )
}
// 시공진행상황 페이지
function C({item}){
    return(
        <View style={{ ...commonStyles.view ,backgroundColor: 'white' }}>
            {
                item.tinting != null && (
                    <>
                        <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                        <List.Item  style={styles.itemStyle} titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.tinting}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.tintingPrice}{' 만원'}</Text>} 
                        />
                    </>
                )
                }
                {
                    item.ppf != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.ppf}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.ppfPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.blackbox != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle}
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.blackbox}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.blackboxPrice}{' 만원'}</Text>}  
                            />
                        </>
                    )
                }
                {
                    item.battery != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                            title ={" -  -  -  -  -  -  -  "} 
                            left={props =>  <Text style={styles.itemText}>{item.battery}</Text>} 
                            right={props => <Text style={styles.itemText}>{item.batteryPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.afterblow != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.afterblow}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.afterblowPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.soundproof != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.soundproof}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.soundproofPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.wrapping != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.wrapping}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.wrappingPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.glasscoating != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.glasscoating}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.glasscoatingPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
                {
                    item.bottomcoating != null && (
                        <>
                            <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='하부코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <List.Item style={styles.itemStyle}  titleStyle={styles.listStyle} 
                                title ={" -  -  -  -  -  -  -  "} 
                                left={props =>  <Text style={styles.itemText}>{item.bottomcoating}</Text>} 
                                right={props => <Text style={styles.itemText}>{item.bottomcoatingPrice}{' 만원'}</Text>} 
                            />
                        </>
                    )
                }
            <Divider style={{ margin: 5, borderWidth: 1 , borderColor: 'lightgray' }} />
            <List.Item style={styles.itemStyle}  titleStyle={{...styles.listStyle, fontWeight: 'bold'}} right={props => <Text style={{...styles.itemText, fontWeight: 'bold' }}>{'최종가격:  '}{item.totalPrice}{' 만원'}</Text>}/>
            </View>
    )
}

export default {A,B,C,Care_A,Care_C,Care_B};