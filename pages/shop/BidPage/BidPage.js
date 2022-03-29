import React from 'react' ;
import styled from 'styled-components';
import { 
    Appbar , Title , Divider , List,
    Button ,  IconButton , Chip ,
    Provider , Modal , Portal,  Text, Badge , Menu, ActivityIndicator
} 
from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../../color/colors';
import { Alert , Image } from 'react-native';
import { RefreshControl } from 'react-native';
import { FlatList } from 'react-native';
import Collapsible from 'react-native-collapsible';
import CustomBar from '../../../components/CustomBar';
import commonStyles from '../../../components/commonStyles';
// storage
import API from '../../../server/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetch from '../../../storage/fetch' ; 
import store from '../../../storage/store';
import _ from 'lodash';
import { Dimensions } from 'react-native';
import AppContext from '../../../storage/AppContext';
import { useIsFocused } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// pages
import BidRegister_current from './BidRegister_current';
import BidRegister_history from './BidRegister_history';
// analytics
import analytics from '@react-native-firebase/analytics'

const Tab = createMaterialTopTabNavigator();

export default function ( props ) {
    // 로드 threshold 
    const loadThresh = 10 ;
    
    const [fullData,setFullData] = React.useState([]);
    const [data,setData] = React.useState([]);
    const [shopName,setShopName] = React.useState('');
    const [region,setRegion] = React.useState('');
    const [modalVisible,setModalVisible] = React.useState(false);
    const [regions,setRegions] = React.useState(defaultRegions) ;
    const [refresh,setRefresh] = React.useState(false);
    // 전체 , 신차 , 케어
    const [filter,setFilter] = React.useState('전체');
    const MyContext = React.useContext(AppContext);
    const isFocused = useIsFocused();
    

    const RenderItem= ({ item }) => {
        let tmp = JSON.parse(item.details);
        // 신차
        if( item.kind == 'NewCarPackage' && ( filter == '신차' || filter == '전체' ) )
            return <Item item={tmp} navigation={props.navigation} key={item.id} id = {item.id} shopName={shopName}/>
        // 케어 
        else if( item.kind == 'Care' && filter == '케어' || filter == '전체' ){
            return <CareItem item={tmp} navigation={props.navigation} key={item.id} id={item.id} imageUrls={item.responseDtos}/>
        }
    }

    function BidBefore() {
        // 신차패키지 , 케어 필터

        const handleFilter = (item) => {
            setFilter( item  ,
                // MyContext.setBidRef(!MyContext.bidRef)    
            );
        }

        return (
            <Provider>
            {/* // 입찰 전 */}
                <View style={{ ...commonStyles.view }}>
                {/* <Divider style={{  height: 8 , backgroundColor: 'rgb(230,230,230)' }} /> */}
                <Row style={{ ...commonStyles.titleRow , height: 40 }}>
                    <Button labelStyle={{ fontWeight: 'bold' , fontFamily: 'Jua-Regular'}} style={{ flex: 1  }} color={ filter == '전체' ? 'black' : 'lightgray' } onPress={ () => { handleFilter('전체') } }>
                        전체
                    </Button>
                    <Button labelStyle={{ fontWeight: 'bold' , fontFamily: 'Jua-Regular'}} style={{ flex: 1   }} color={ filter == '신차' ? 'black' : 'lightgray' } onPress={ () => { handleFilter('신차') } }>
                        신차패키지
                    </Button>
                    <Button labelStyle={{ fontWeight: 'bold' , fontFamily: 'Jua-Regular'}} style={{ flex: 1}} color={ filter == '케어' ? 'black' : 'lightgray' } onPress={ () => { handleFilter('케어') } }>
                        케어
                    </Button>
                </Row>
                {
                    data.length == 0 ? (
                        <ScrollView 
                            refreshControl={<RefreshControl 
                                refreshing={refresh}
                                onRefresh={ () => { requestOrders() } }
                            />}
                            contentContainerStyle={{ height: Dimensions.get('screen').height*0.5 , justifyContent: 'center' , alignItems: 'center'  }}
                        >   
                            <Title style={{ fontSize: 15 , fontFamily: 'NotoSansKR-Medium' }}>{'아직 입찰요청이 없어요.'}</Title>
                        </ScrollView>
                    ) :
                    (
                        <>
                        <View style={{ flex: 1 }}>
                        <FlatList
                            onRefresh={() => { requestOrders() }}
                            refreshing={refresh}
                            nestedScrollEnabled={true}
                            renderItem={RenderItem}
                            data={data}
                            numColumns={1}
                            keyExtractor={item => item.id }
                            onEndReachedThreshold={0.05}
                            onEndReached={() => { loadPartialData() }}
                        />
                        </View>  
                        </>              
                    )
                } 
                </View>    
            </Provider>
        )
    }
    const loadPartialData = () => {
        // 새로운 데이터 X
        if ( fullData.length == 0 ) return;
        // 10개씩 로드 
        if ( fullData.length > loadThresh ) {
            let tmp =  _.concat(data,_.slice(fullData,0,loadThresh) ) 
            setData ( tmp );
            setFullData( _.drop(fullData,loadThresh) ) ;
        }
        // 10개미만 모두 로드
        else {
            setData( _.concat(data,fullData) )
            setFullData([]);
        }

    }
    
    
    React.useEffect(() => {


    // 서버
    if ( isFocused ) {

            // Google Analytics
            analytics().logScreenView({
                screen_class: 'Bidding' ,
                screen_name: 'BidBefore'
            })

            if( !region?.length && !shopName?.length ) {
            
            // 업체이름 가져오기
            API.get('/api/company')  
            .then( res => {
                // console.log(res.data.data);
                setShopName( res?.data.data.name );
                setRegion( res?.data.data.region ,
                    requestOrders(res.data.data.region)
                ),
                setLoading(false);
            })
            .catch( e => {  })
            }

            else {
                requestOrders()
            }

            
          
    }
        
        
    },[MyContext.bidRef , isFocused ]);

    const requestOrders = ( val ) => {

        tmp = val ? val.split(',') : region.split(',');

        API.get(`/api/orders?regions=${tmp}`)
        .then( res => {
            let rawData = res.data.data;
            // 새로운 데이터 X
            if ( rawData.length == 0 ) setData([]);
            // 10개씩 로드 
            else if ( rawData.length > loadThresh ) {
                let tmp =  _.slice(rawData,0,loadThresh) ;
                setData ( tmp );
                setFullData( _.drop(rawData,loadThresh) ) ;
            }
            // 10개미만 모두 로드
            else {
                setData( rawData );
                setFullData([]);
            }
        })
        .catch( e => {
            if ( e.response != null && e.response.hasOwnProperty('status') && e.response.status == 403 ) {
                Alert.alert('새로운 기기','다른 기기에서 로그인하여 로그아웃 되었습니다.');
                AsyncStorage.clear();
                MyContext.LOGOUT();
            }
            else { 
                Alert.alert('다시 시도해주세요.');
                setModalVisible(false);
                setRefresh(false);
            }
        })
    }

    
    const [appbarExtended,setAppbarExtended] = React.useState(true);

    return (
    <Provider>
        <Appbar.Header style={{ backgroundColor: colors.main , elevation: 0  , height: 70 }}>
            {
                !appbarExtended &&
                <>
                    <Image source={require('../../../resource/carIcon.png')} style={{ width: 35 , height: 35 , padding: 5 , margin: 10 }} />
                    <Text style={{ marginLeft: 10 , fontSize: 30 , fontWeight: 'bold' , color: colors.title , fontFamily: 'Jua-Regular' }}>{region}</Text>
                </>
            }
            <Appbar.Action onPress={() => {setAppbarExtended(!appbarExtended)}} icon={appbarExtended ? 'chevron-up' : 'chevron-down'} color={colors.title} style={{ position: 'absolute' , right: 0 , padding: 5}} />
            {/* <Appbar.Content title={shopName} titleStyle={{ fontWeight: 'bold' , fontSize: 22 , color: 'lightgray' , alignSelf: 'center' , margin: 5 }} /> */}
        </Appbar.Header>   
        {
            appbarExtended && <CustomBar.C title={region} />
        }
        <View style={{ backgroundColor: 'white' , flex: 1 }}>
        <Tab.Navigator  
            sceneContainerStyle={{ backgroundColor: 'white' }} screenOptions={(props)=>(  { tabBarStyle: { height: 45 } , tabBarActiveTintColor: 'black' , tabBarInactiveTintColor: '#d18b60' , tabBarIndicatorStyle: { backgroundColor: 'transparent' , borderWidth: 2 , borderColor: 'transparent' } , tabBarLabelStyle: { fontFamily: 'NotoSansKR-Medium' , fontWeight: props.navigation.isFocused() ? 'bold' : 'normal' , fontSize: props.navigation.isFocused() ? 17 : 14 }   })}    initialRouteName={BidBefore}>
            <Tab.Screen name="BidBefore" component={BidBefore} options={{ title: '입찰 전' }} />
            <Tab.Screen name="BidRegister_current" component={BidRegister_current} options={{ title: '입찰 중'  }}/>
            <Tab.Screen name="BidRegister_history" component={BidRegister_history} options={{ title: '입찰결과' }}/>
        </Tab.Navigator>
        </View>
    </Provider>
    );
}

function countCareItems( item ){
    let count = 0 ;
    let flag = false; 
    let firstItem = "";
    
    if ( item.carWash ) { if ( !flag ) { flag = true; firstItem = "세차" } count += 1 } ;
    if ( item.inside ) { if ( !flag ) { flag = true; firstItem = "내부" } count += 1 } ;
    if ( item.outside ) { if ( !flag ) { flag = true; firstItem = "외부" } count += 1 } ;
    if ( item.scratch ) { if ( !flag ) { flag = true; firstItem = "스크레치" } count += 1 } ;
    if ( item.etc ) { if ( !flag ) { flag = true; firstItem = "기타" } count += 1 } ;
    
    return firstItem + " 등 " + count + "건";
}

// 케어
function CareItem( { navigation , item , id , imageUrls }) {
    const [expanded,setExpanded] = React.useState(true) ;
    return(
        <>
        {
            expanded &&
            <View style={{ ...commonStyles.view , borderWidth: 0.5 , backgroundColor: 'white' }}>
            <RowItem onPress={ () => { setExpanded(!expanded) }}>
                <Text style={{fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 25 , marginLeft: 20  }}>{item.carName}</Text>
                <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 20 , backgroundColor: colors.care , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>케어</Badge>
                {
                    item.role == "DEALER" && <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 10 , backgroundColor: 'black' , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>딜러</Badge>
                }
                <Row style={{ right: 5 , position: 'absolute' }}>
                <Text>{translate('region',item.region)}</Text>
                <IconButton icon={ expanded ? 'chevron-down' : 'chevron-up' } />
                </Row>
            </RowItem>  
            <Divider style={{ alignSelf: 'center' , width: '90%' , borderColor: 'rgb(231,207,192)' , borderWidth: 0.5 }} />
            {
                expanded &&
                <Text style={{ alignSelf: 'center' , fontWeight: 'bold' , margin: 20 }}>{countCareItems(item.options)}</Text>
            }
            </View>
        }
        
        <Collapsible collapsed={expanded} duration={100}>
                <View style={{ ...commonStyles.view , backgroundColor: 'white' }}>
                    {
                        !expanded &&
                        <>
                        <ButtonRow style={commonStyles.titleRow} onPress={ () => { setExpanded(!expanded) }}>
                            <Text style={{fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 }}>{item.carName}(케어)</Text>
                            <IconButton icon={ expanded ? 'chevron-down' : 'chevron-up' } style={{ position: 'absolute' , right: 5 }} />
                        </ButtonRow>
                        <Divider style={{ alignSelf: 'center' , width: '90%' , borderColor: 'rgb(231,207,192)' , borderWidth: 0.5 }} />
                        </>
                    }
                    { item.options.carWash && 
                        <>
                            <List.Item titleStyle={styles.listStyle} title ='세차' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <ScrollView horizontal={true}>
                            {
                                _.map(item.options.detailCarWash,(value,key) => { 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('carWash',key) }</Chip>  
                                })
                            }
                            </ScrollView>
                    </> }
                    { item.options.inside && 
                        <>
                            <List.Item titleStyle={styles.listStyle} title ='내부' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <ScrollView horizontal={true}>
                            {
                                _.map(item.options.detailInside,(value,key) => { 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('inside',key) }</Chip>  
                                })
                            }
                            </ScrollView>
                    </> }
                    { item.options.outside && 
                        <>
                            <List.Item titleStyle={styles.listStyle} title ='외부' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <ScrollView horizontal={true}>
                            {
                                _.map(item.options.detailOutside,(value,key) => { 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('outside',key) }</Chip>  
                                })
                            }
                            </ScrollView>
                    </> }
                    { item.options.scratch && 
                        <>
                            <List.Item titleStyle={styles.listStyle} title ='스크레치' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <ScrollView horizontal={true}>
                            {
                                _.map(item.options.detailScratch,(value,key) => { 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('scratch',key) }</Chip>  
                                })
                            }
                            </ScrollView>
                    </> }
                    { item.options.etc && 
                        <>
                            <List.Item titleStyle={styles.listStyle} title ='기타' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <ScrollView horizontal={true}>
                                <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{item.options.detailEtc}</Chip>  
                            </ScrollView>
                    </> }
                    
                    <List.Item titleStyle={styles.listStyle}  title ='요청사항:' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                    <List.Item 
                        style={{ ...commonStyles.view , backgroundColor: 'white' , borderRadius: 5 }}
                        titleStyle={{   }} 
                        // descriptionStyle={{fontWeight: 'bold' , fontSize: 17 }}
                        title={item.require} 
                        // description={item.require} 
                    />
                    <Button 
                            icon='account-cash' 
                            mode='outlined' 
                            color={colors.main}
                            mode='contained' 
                            onPress={ () => { navigation.navigate('CareRegister',{ data : item , id : id , imageUrls: imageUrls  }) } }
                            style={{ margin: 3 , marginTop: 20 }} labelStyle={{  fontSize: 17 , color: 'white'  }} >
                        작성하기
                    </Button>
                </View>
                </Collapsible>
        </>
    );
}

function countNcpItems( item ){
    let count = 0 ;
    let flag = false; 
    let firstItem = "";
    
    if ( item.tinting ) { if ( !flag ) { flag = true; firstItem = "틴팅" } count += 1 } ;
    if ( item.ppf ) { if ( !flag ) { flag = true;  firstItem = "PPF" } count += 1 } ;
    if ( item.blackbox) { if ( !flag ) { flag = true; firstItem = "블랙박스" } count += 1 } ;
    if ( item.battery ) { if ( !flag ) { flag = true; firstItem = "보조배터리" } count += 1 } ;
    if ( item.afterblow ) { if ( !flag ) { flag = true; firstItem = "애프터블로우" } count += 1 } ;
    if ( item.soundproof ) { if ( !flag ) { flag = true; firstItem = "방음" } count += 1 } ;
    if ( item.wrapping ) { if ( !flag ) { flag = true; firstItem = "랩핑" } count += 1 } ;
    if ( item.glasscoating ) { if ( !flag ) { flag = true; firstItem = "유리막코팅" } count += 1 } ;
    if ( item.bottomcoating ) { if ( !flag ) { flag = true; firstItem = "하부코팅" } count += 1 } ;
    return firstItem + " 등 " + count + "건";
}
// 신차패키지
// 각각의 입찰요청항목
function Item ( { item , navigation , id , shopName } ) {
    const [expanded,setExpanded] = React.useState(true) ;
    return( 
                <>
                {
                    expanded &&
                    <View style={{ ...commonStyles.view , borderWidth: 0.5 , backgroundColor: 'white' }}>
                    <RowItem style={{ ...commonStyles.titleRow , backgroundColor: 'white' , borderRadius: 10 }} onPress={ () => { setExpanded(!expanded) }}>
                        <Text style={{fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 25 , marginLeft: 20  }}>{item.carName}</Text>
                        <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 20 , backgroundColor: colors.main , color: 'white' , paddingLeft: 10 , paddingRight: 10  }}>신차</Badge>
                        {
                            item.role == "DEALER" && <Badge size={ 25 } style={{ alignSelf: 'center' , marginLeft: 10 , backgroundColor: 'black' , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>딜러</Badge>
                        }
                        <Row style={{ right: 5 , position: 'absolute' }}>
                        <Text>{translate('region',item.region)}</Text>
                        <IconButton icon={ expanded ? 'chevron-down' : 'chevron-up' } />
                        </Row>
                    </RowItem>
                    <Divider style={{ alignSelf: 'center' , width: '90%' , borderColor: 'rgb(231,207,192)' , borderWidth: 0.5 }} />
                    {
                        expanded &&
                        <Text style={{ alignSelf: 'center' , fontWeight: 'bold' , margin: 20 }}>{countNcpItems(item.options)}</Text>
                    }
                    </View>
                }
                <Collapsible collapsed={expanded} duration={100}>
                <View style={{ ...commonStyles.view , backgroundColor: 'white' }}>
                    {
                        !expanded &&
                        <>
                        <ButtonRow style={commonStyles.titleRow} onPress={ () => { setExpanded(!expanded) }}>
                            <Text style={{fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 }}>{item.carName}(신차)</Text>
                            <IconButton icon={ expanded ? 'chevron-down' : 'chevron-up' } style={{ position: 'absolute' , right: 5 }} />
                        </ButtonRow>
                        <Divider style={{ alignSelf: 'center' , width: '90%' , borderColor: 'rgb(231,207,192)' , borderWidth: 0.5 }} />
                        </>
                    }
                    { item.options.tinting && 
                        <>
                            <List.Item titleStyle={styles.listStyle} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <ScrollView horizontal={true}>
                                {
                                    _.map(item.options.detailTinting,(value,key) => { 
                                        if (key == 'ETC' && value != null && value.length != 0  ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                        if(value) return <Chip key={key+'a'} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('tinting',key) }</Chip>  
                                    })
                                }
                            </ScrollView>
                        </> }
                    {item.options.ppf && 
                        <>
                            <List.Item titleStyle={styles.listStyle}  title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <ScrollView horizontal={true}>
                                {
                                    _.map(item.options.detailPpf,(value,key) => { 
                                        if (key == 'ETC' && value != null && value.length != 0 ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                        if(value) return <Chip key={key+'a'} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('ppf',key) }</Chip>  
                                    })
                                }
                            </ScrollView>
                        </>
                    }
                    {item.options.blackbox && 
                        <>
                            <List.Item titleStyle={styles.listStyle}  title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                            <ScrollView horizontal={true}>
                                {
                                    _.map(item.options.detailBlackbox,(value,key) => { 
                                        if (key == 'ETC' && value != null && value.length != 0 ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                        if(value) return <Chip key={key+'a'}  style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('blackbox',key) }</Chip>  
                                    })
                                }
                            </ScrollView>
                        </>
                    }
                    {item.options.battery && 
                        <>
                            <List.Item titleStyle={styles.listStyle}  title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                            <ScrollView horizontal={true}>
                                {
                                    _.map(item.options.detailBattery,(value,key) => { 
                                        if (key == 'ETC' && value != null && value.length != 0 ) return <Chip  key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                        if(value) return <Chip key={key+'a'}  style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('battery',key) }</Chip>  
                                    })
                                }
                            </ScrollView>
                        </>
                    }
                    {item.options.afterblow && 
                        <>
                            <List.Item titleStyle={styles.listStyle}  title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                            <ScrollView horizontal={true}>
                                {
                                    _.map(item.options.detailAfterblow,(value,key) => { 
                                        if (key == 'ETC' && value != null && value.length != 0 ) return <Chip  key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                        if(value) return <Chip key={key+'a'}  style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('afterblow',key) }</Chip>  
                                    })
                                }
                            </ScrollView>
                        </>
                    }
                    {item.options.soundproof && 
                        <>
                            <List.Item titleStyle={styles.listStyle}  title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                            <ScrollView horizontal={true}>
                                {
                                    _.map(item.options.detailSoundproof,(value,key) => { 
                                        if (key == 'ETC' && value != null && value.length != 0 ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                        if(value) return <Chip key={key+'a'}  style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('soundproof',key) }</Chip>  
                                    })
                                }
                            </ScrollView>
                        </>
                    }
                    {item.options.wrapping && 
                        <>
                            <List.Item titleStyle={styles.listStyle}  title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                            <ScrollView horizontal={true}>
                                {
                                    _.map(item.options.detailWrapping,(value,key) => { 
                                        if (key == 'DESIGN' && value != null && value.length != 0 ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                        if(value) return <Chip key={key+'a'} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('wrapping',key) }</Chip>  
                                    })
                                }
                            </ScrollView>
                        </>
                    }
                    {item.options.glasscoating && <><List.Item titleStyle={styles.listStyle}  title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} /></>} 
                    {item.options.bottomcoating && 
                        <>
                            <List.Item titleStyle={styles.listStyle}  title ='하부코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                            <ScrollView horizontal={true}>
                                {
                                    _.map(item.options.detailBottomcoating,(value,key) => { 
                                        if (key == 'ETC' && value != null && value.length != 0 ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                        if(value) return <Chip key={key+'a'} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('bottomcoating',key) }</Chip>  
                                    })
                                }
                            </ScrollView>
                        </>
                    }
                    <List.Item titleStyle={styles.listStyle}  title ='요청사항:' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                    <List.Item 
                        style={{ ...commonStyles.view , backgroundColor: 'white' , borderRadius: 5 }}
                        titleStyle={{   }} 
                        // descriptionStyle={{fontWeight: 'bold' , fontSize: 17 }}
                        title={item.require} 
                        // description={item.require} 
                    />
                    <Button 
                            icon='account-cash' 
                            mode='outlined' 
                            color={colors.main}
                            mode='contained' 
                            onPress={ () => { navigation.navigate('BidRegister',{ data : item , id : id , name: shopName }) } }
                            style={{ margin: 3 , marginTop: 20 }} labelStyle={{  fontSize: 17 , color: 'white'  }} >
                        작성하기
                    </Button>
                </View>
                </Collapsible>
                </>
    )
}

const View = styled.SafeAreaView``;
const BidBeforeView = styled.TouchableOpacity``;
const Row = styled.View`
    align-items: center;
    flex-direction: row;
`;
const ButtonRow = styled.TouchableOpacity`
    align-items: center;
    flex-direction: row;
`;
const RowItem = styled.TouchableOpacity`
    height: 70px;
    align-items: center;
    flex-direction: row;
`;
const AlignButton = styled.TouchableOpacity`
    border: 1px lightgray;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    align-items: center;
`;

const styles = {
    containerStyle : {
        backgroundColor: 'white',
        flex : 1 , 
        padding : 20 ,
    }  ,
    chipStyle : {
        // backgroundColor: 'rgb(230,230,230)',
        backgroundColor: colors.submain ,
        color: 'black' ,
        borderColor: colors.main,
        borderWidth: 0.5 ,
        borderRadius: 10 ,
        margin : 3 ,
        marginLeft: 10 ,
    } ,
    scrollChipStyle : {
        margin: 5 , padding: 3 , borderWidth: 1 ,borderColor: 'lightgray' , borderRadius : 20  , backgroundColor: 'white' , justifyContent: 'center' , alignItems: 'center'
    } ,
    chipTextStyle : {
        // fontWeight: 'bold' ,
    } , 
    title : {
        fontWeight: 'bold' , 
        fontSize: 25 , 
        padding: 5 ,
        fontFamily : 'DoHyeon-Regular' , 
    } ,
    listStyle : {
        // fontWeight: 'bold',
        fontSize: 17 , 
    } ,
    listAccordionStyle : {
        backgroundColor: 'white' ,
        borderTopWidth: 1 ,
        borderTopColor: 'lightgray'        
    } ,
    button: {
        flex: 1 ,
        padding: 3 ,
        margin: 3
    }

}
// 지역선택
const REGION =[
    {
        value: '서울',
        key: 'seoul',
    },{
        value: '인천',
        key: 'incheon',
    },{
        value: '대전',
        key: 'daejeon',
    },{
        value: '대구',
        key: 'daegu',
    },{
        value: '부산',
        key: 'busan',
    },{
        value: '광주',
        key: 'gwangju',
    },{
        value: '제주',
        key: 'jeju',
    },
];

// 선택지역 
const defaultRegions = {
    seoul : false ,
    incheon: false ,
    daejeon: false ,
    daegu: false ,
    busan: false ,
    gwangju: false,
    jeju: false 
}

function translate(option,item){
    
    const res_Tinting = {
        LUMA: '루마',
        SOLAR: '솔라가드',
        RAINBOW: '레인보우',
        RAYNO: '레이노',
        ANY: '상관없음',
    }
    const res_Ppf ={
        BONNET: '본넷',
        SIDEMIRROR: '사이드미러',
        FRONTBUMPER: '앞 범퍼',
        FRONTBUMPERSIDE:'앞 범퍼사이드',
        BACKBUMPER: '뒷 범퍼',
        BACKBUMPERSIDE: '뒷 범퍼사이드',
        HEADLIGHT: '헤드라이트',
        TAILLAMP: '테일램프',
        BCFILTER: 'B/C 필터',
        DOOR: '도어',
        HOOD: '후드',
    }
    const res_Blackbox = {
        FINETECH: '파인테크',
        INAVI: '아이나비',
        MANDO: '만도',
        ANY: '상관없음',
    }
    const res_Battery = {
        V6: 'V6',
        V12: 'V12',
        ANY: '상관없음',
    }
    const res_Afterblox = {
        ANY: '상관없음',
    }
    const res_Soundproof = {
        UNDER: '하부방음',
        DOORSOUND: '도어방음',
        INSIDEFLOOR: '실내바닥방음',
        FENDER: '휀다방음',
        BONNETSOUND: '본넷방음',
        TRUNK: '트렁크방음',
        ANY: '상관없음',
    }
    const res_Wrapping = {
    }
    const res_Region = {
        seoul: '서울',
        daejeon: '대전',
        daegu: '대구',
        incheon: '인천',
        busan: '부산',
        gwangju: '광주',
        jeju: '제주',
    }
    const res_Bottomcoating = {
        UNDER: '언더코팅' ,
        POLYMER: '폴리머코팅' ,
    }
    // 케어
    const carWash = {
        detailingCarWash : '디테일링세차' ,
        handCarWash : '손세차' ,
        steamCarWash : '스팀세차'
    };
    const inside = {
        insideCleaning : '실내크리닝' ,
        insideSoundProof : '실내방음'
    };
    const outside = {
        Wrapping: '랩핑' ,
        dent: '덴트' ,
        painting: '도색'
    };
    const scratch = {
        glassCoating: '유리막코팅' ,
        polishing : '광택'
    };

    if(option === 'tinting') return res_Tinting[item];
    else if(option === 'ppf') return res_Ppf[item];
    else if(option === 'blackbox') return res_Blackbox[item];
    else if(option === 'battery') return res_Battery[item];
    else if(option === 'afterblow') return res_Afterblox[item];
    else if(option === 'soundproof') return res_Soundproof[item];
    else if(option === 'wrapping') return res_Wrapping[item];
    else if(option === 'region') return res_Region[item];
    else if(option === 'bottomcoating') return res_Bottomcoating[item];
    else if( option == 'carWash' ) return carWash[item];
    else if( option == 'inside' ) return inside[item];
    else if( option == 'outside' ) return outside[item];
    else if( option == 'scratch' ) return scratch[item];
}