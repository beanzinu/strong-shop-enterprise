import React from 'react' ;
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { 
    Appbar , Title , Divider , List,
    Button ,  IconButton , Chip ,
    Provider , Modal , Portal, Avatar, ActivityIndicator 
} 
from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../../color/colors';
import { Alert } from 'react-native';
import { SafeAreaView , RefreshControl } from 'react-native';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import server from '../../../server/server' ;
import fetch from '../../../storage/fetch' ;
import _ from 'lodash';
import store from '../../../storage/store';
import { Dimensions } from 'react-native';
import AppContext from '../../../storage/AppContext';
import { useIsFocused } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

// pages
import BidRegister_current from './BidRegister_current';
import BidRegister_history from './BidRegister_history';

const View = styled.SafeAreaView``;
const BidBeforeView = styled.TouchableOpacity``;
const Row = styled.View`
    align-items: center;
    flex-direction: row;
`;


// const data = [
//     {
//         carName: '제네시스 G80' ,
//         tinting: true ,
//         detailTinting : {
//             select : true , // 틴팅 시공 선택
//             solarguard : true ,
//             rayno : false ,
//             llumar : false ,
//             rainbow : true ,
//         } ,
//         blackbox : true ,
//         ppf : true ,
//         glass : true ,
//         seat : true ,
//         //  요청사항 30자 정도로 제한 
//         etc : '가성비로 맞추고 싶어요!가성비로 맞추고 싶어요!가성비로 맞추고 싶어요!' ,
//     } ,
//     {
//         carName: '기아 레이' ,
//         tinting: true ,
//         detailTinting : {
//             select : true , // 틴팅 시공 선택
//             solarguard : true ,
//             rayno : false ,
//             llumar : false ,
//             rainbow : true ,
//         } ,
//         blackbox : true ,
//         ppf : true ,
//         glass : true ,
//         seat : false ,
//         etc : '100만원 안쪽으로 부탁드려요.' ,
//     } ,
//     {
//         carName: '쌍용 티볼리' ,
//         tinting: true ,
//         detailTinting : {
//             select : true , // 틴팅 시공 선택
//             solarguard : true ,
//             rayno : false ,
//             llumar : false ,
//             rainbow : true ,
//         } ,
//         blackbox : false ,
//         ppf : true ,
//         glass : true ,
//         seat : false ,
//         etc : '',
//     }
// ];
const myData = [
    {
        carName: '기아 레이' ,
        tinting: true ,
        detailTinting : {
            select : true , // 틴팅 시공 선택
            solarguard : true ,
            rayno : false ,
            llumar : false ,
            rainbow : true ,
        } ,
        blackbox : true ,
        ppf : true ,
        glass : true ,
        seat : false ,
        etc : '100만원 안쪽으로 부탁드려요.' ,
    }
] ;
const myResult = [
    {
        carName: '쌍용 티볼리' ,
        tinting: true ,
        detailTinting : {
            select : true , // 틴팅 시공 선택
            solarguard : true ,
            rayno : false ,
            llumar : false ,
            rainbow : true ,
        } ,
        blackbox : false ,
        ppf : true ,
        glass : true ,
        seat : false ,
        etc : '',
    }
]

const styles = {
    containerStyle : {
        backgroundColor: 'white',
        flex : 1 , 
        padding : 20 ,
    }  ,
    chipStyle : {
        backgroundColor: 'rgb(220,220,220)',
        margin : 3 ,
    } ,
    chipTextStyle : {
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

function translate(option,item){
    const res_Tinting = {
        LUMA: '루마',
        SOLAR: '솔라가드',
        RAINBOW: '레인보우',
        RAYNO: '레이노',
        ANY: '상관없음',
    }
    const res_Ppf ={
    }
    const res_Blackbox = {
        FINETECH: '파인테크',
        INAVI: '아이나비',
        ANY: '상관없음',
    }
    const res_Battery = {
        ANY: '상관없음',
    }
    const res_Afterblox = {
        ANY: '상관없음',
    }
    const res_Soundproof = {
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
    if(option === 'tinting') return res_Tinting[item];
    else if(option === 'ppf') return res_Ppf[item];
    else if(option === 'blackbox') return res_Blackbox[item];
    else if(option === 'battery') return res_Battery[item];
    else if(option === 'afterblow') return res_Afterblox[item];
    else if(option === 'soundproof') return res_Soundproof[item];
    else if(option === 'wrapping') return res_Wrapping[item];
    else if(option === 'region') return res_Region[item];
}



// 각각의 입찰요청항목
function Item ( { item , navigation , id } ) {
    const [expanded,setExpanded] = React.useState(false) ;
    return( 
                    <List.Section key={id}>
                          <List.Accordion
                            title={item.carName}
                            style={styles.listAccordionStyle}
                            titleStyle= {{ fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 , color :  expanded ? 'red' : 'black'   }}
                            expanded={expanded}
                            onPress={()=>{setExpanded(!expanded)}}
                            description='자세한 정보를 확인하세요.'
                            
                            // left={props => <List.Icon {...props} icon="car-hatchback" color={'black'}  />}
                           >
                            <View style={{ backgroundColor: 'rgb(250,250,250)' , margin: 10 , borderWidth: 1 , borderRadius: 10 , borderColor: 'lightgray' }}>
                                { item.options.tinting && 
                                    <>
                                        <List.Item titleStyle={styles.listStyle} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                        <Row>
                                            {
                                                _.map(item.options.detailTinting,(value,key) => { 
                                                    if (key == 'ETC' && value != null && value.length != 0  ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                                    if(value) return <Chip key={key+'a'} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('tinting',key) }</Chip>  
                                                })
                                            }
                                        </Row>
                                    </> }
                                {item.options.ppf && 
                                    <>
                                        <List.Item titleStyle={styles.listStyle}  title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                        <Row>
                                            {
                                                _.map(item.options.detailPpf,(value,key) => { 
                                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                                    if(value) return <Chip key={key+'a'} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('ppf',key) }</Chip>  
                                                })
                                            }
                                        </Row>
                                    </>
                                }
                                {item.options.blackbox && 
                                    <>
                                        <List.Item titleStyle={styles.listStyle}  title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                                        <Row>
                                            {
                                                _.map(item.options.detailBlackbox,(value,key) => { 
                                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                                    if(value) return <Chip key={key+'a'}  style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('blackbox',key) }</Chip>  
                                                })
                                            }
                                        </Row>
                                    </>
                                }
                                {item.options.battery && 
                                    <>
                                        <List.Item titleStyle={styles.listStyle}  title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                                        <Row>
                                            {
                                                _.map(item.options.detailBattery,(value,key) => { 
                                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip  key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                                    if(value) return <Chip key={key+'a'}  style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('battery',key) }</Chip>  
                                                })
                                            }
                                        </Row>
                                    </>
                                }
                                {item.options.afterblow && 
                                    <>
                                        <List.Item titleStyle={styles.listStyle}  title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                                        <Row>
                                            {
                                                _.map(item.options.detailAfterblow,(value,key) => { 
                                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip  key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                                    if(value) return <Chip key={key+'a'}  style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('afterblow',key) }</Chip>  
                                                })
                                            }
                                        </Row>
                                    </>
                                }
                                {item.options.soundproof && 
                                    <>
                                        <List.Item titleStyle={styles.listStyle}  title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                                        <Row>
                                            {
                                                _.map(item.options.detailSoundProof,(value,key) => { 
                                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                                    if(value) return <Chip key={key+'a'}  style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('soundproof',key) }</Chip>  
                                                })
                                            }
                                        </Row>
                                    </>
                                }
                                {item.options.wrapping && 
                                    <>
                                        <List.Item titleStyle={styles.listStyle}  title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                                        <Row>
                                            {
                                                _.map(item.options.detailWrapping,(value,key) => { 
                                                    if (key == 'DESIGN' && value != null && value.length != 0 ) return <Chip key={key} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                                    if(value) return <Chip key={key+'a'} style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('wrapping',key) }</Chip>  
                                                })
                                            }
                                        </Row>
                                    </>
                                }
                                {item.options.glasscoating && <><List.Item titleStyle={styles.listStyle}  title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} /></>} 
                                {item.options.undercoating && <><List.Item titleStyle={styles.listStyle}  title ='언더코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} /></>}
                                <Divider style={{ marginTop: 5 }} />
                                <List.Item 
                                    // style={{ borderWidth: 1 ,borderColor: 'lightgray'}}
                                    titleStyle={{  fontWeight: 'bold' }} 
                                    descriptionStyle={{ paddingTop: 3 , fontWeight: 'bold' }}
                                    title='요청사항:' description={item.require} />
                                <Button 
                                        icon='account-cash' 
                                        mode='outlined' 
                                        color={colors.main}
                                        mode='contained' 
                                        onPress={ () => { navigation.navigate('BidRegister',{ data : item , id : id }) } }
                                        style={{ margin: 3 , marginTop: 20 }} labelStyle={{  fontSize: 17 }} >
                                    입찰하기
                                </Button>
                            </View>
                          </List.Accordion>
                    </List.Section>
    )
}

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

export default function ( props ) {
    // 로드 threshold 
    const loadThresh = 10 ;
    
    const [fullData,setFullData] = React.useState([]);
    const [data,setData] = React.useState([]);
    const [shopName,setShopName] = React.useState('');
    const [menu,setMenu] = React.useState(1);
    const [modalVisible,setModalVisible] = React.useState(false);
    const [regions,setRegions] = React.useState(defaultRegions) ;
    const [refresh,setRefresh] = React.useState(false);
    const MyContext = React.useContext(AppContext);
    // const isFocused = useIsFocused();

    const RenderItem= ({ item }) => {
        let tmp = JSON.parse(item.details);
        // console.log(tmp);
        return (
            <Item item={tmp} navigation={props.navigation} key={item.id} id = {item.id}/>
        )
    }

    const checkRegions = () => {
        if ( regions.seoul || regions.incheon || regions.daejeon || regions.busan || regions.daegu || regions.gwangju || regions.jeju )
            return false 
        return true ;
    }

    function BidBefore() {
        return (
            <>
            {/* <Row>
                <Button style={styles.button} mode={ menu == 1 ? 'contained' : 'outlined' } color={colors.main} onPress={()=>{ setMenu(1) }}>입찰 전</Button>
                <Button style={styles.button} mode={ menu == 2 ? 'contained' : 'outlined' } color={colors.main} onPress={()=>{ setMenu(2) }}>입찰 중</Button>
                <Button style={styles.button} mode={ menu == 3 ? 'contained' : 'outlined' } color={colors.main} onPress={()=>{ setMenu(3) }}>입찰 결과</Button>
            </Row> */}
            {/* // 입찰 전 */}
                <Row>
                <ScrollView horizontal={true} contentContainerStyle={{ alignItems: 'center' , height: 70 }}>
                    <Button icon='plus' style={{  padding: 5, margin: 10 , borderRadius: 30 }} mode='contained' color={colors.main} onPress={() => { setModalVisible(true) }}>
                        지역
                    </Button>
                    {
                        regions.seoul && <Chip  style={{ padding: 3 , margin: 3 }}>서울</Chip>
                    }
                    {
                        regions.incheon && <Chip style={{ padding: 3 , margin: 3 }}>인천</Chip>
                    }
                    {
                        regions.daejeon && <Chip style={{ padding: 3 , margin: 3 }}>대전</Chip>
                    }
                    {
                        regions.daegu && <Chip style={{ padding: 3 , margin: 3 }}>대구</Chip>
                    }
                    {
                        regions.busan && <Chip style={{ padding: 3 , margin: 3 }}>부산</Chip>
                    }
                    {
                        regions.gwangju && <Chip style={{ padding: 3 , margin: 3 }}>광주</Chip>
                    }
                    {
                        regions.jeju && <Chip style={{ padding: 3 , margin: 3 }}>제주</Chip>
                    }
                </ScrollView>
                </Row>
                
                {
                    data.length == 0 ? (
                        <ScrollView 
                            refreshControl={<RefreshControl 
                                refreshing={refresh}
                                onRefresh={ () => { requestOrders() } }
                            />}
                        contentContainerStyle={{ height: Dimensions.get('screen').height*0.6 , justifyContent: 'center' , alignItems: 'center'  }}
                        >   
                            <BidBeforeView onPress={() => {  setModalVisible(true) }}>
                            <Title>
                                {
                                    checkRegions() ? '지역을 선택해 주세요.' : '아직 입찰요청이 없어요.'
                                }
                            </Title>
                            </BidBeforeView>
                        </ScrollView>
                    ) :
                    (
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
    
                        // data.map( (item,i) => {    
                        //     let tmp = JSON.parse(item.details) ;
                        //     return (
                        //     <Item item={tmp} i={i} navigation={props.navigation} id={item.id}/>
                        //     )
                        // }
    
                        // )                       
                    )
                }       

            </>
        )
    }

    const handleRegion = (region) => { 
            switch( region ) {
                case 'seoul' :
                    setRegions({ ...regions, 'seoul': !regions[region] })
                    break ;
                case 'incheon' :
                    setRegions({ ...regions, 'incheon': !regions[region] })
                    break ;
                case 'daejeon' :
                    setRegions({ ...regions, 'daejeon': !regions[region] })
                    break ;
                case 'daegu' :
                    setRegions({ ...regions, 'daegu': !regions[region] })
                    break ;
                case 'busan' :
                    setRegions({ ...regions, 'busan': !regions[region] })
                    break ;
                case 'gwangju' :
                    setRegions({ ...regions, 'gwangju': !regions[region] })
                    break ;
                case 'jeju' :
                    setRegions({ ...regions, 'jeju': !regions[region] })
                    break ;
                
            }
    }
    const cacheRegion = (region) => {
        let data  = regions ;
        region.map(item => {
            data[item] = true ;
        })
        setRegions(data);
    }

    // 서버
    // 특정 Order에 입찰요청
    async function requestOrders() {

        if ( checkRegions() ) {
            setModalVisible(false);
            return;
        }
        setRefresh(true);

       let tmp = [] ;
       for ( key in regions ) {
            if ( regions[key] ) tmp.push(key);
       }
       await store('orderRegion',{ region : tmp });

       const token = await fetch('auth') ;
       const auth = token.auth ;
       axios({
           method: 'GET' ,
           url: `${server.url}/api/orders?regions=${tmp}` ,
           headers: { Auth: auth  }
       })
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

            setModalVisible(false);
            setTimeout(()=>{
            
                setRefresh(false);
            },1000)
       })
       .catch( e => {
           //
        if ( e.response.hasOwnProperty('status') && e?.response?.status == 403 ) {
            Alert.alert('새로운 기기','다른 기기에서 로그인하여 로그아웃 되었습니다.');
            AsyncStorage.clear();
            MyContext.LOGOUT();
        }
        else { // 500
            Alert.alert('다시 시도해주세요.');
            setModalVisible(false);
            setRefresh(false);
        }
        
       })


    }

    const isFocused = useIsFocused();

    React.useEffect(() => {

        // 업체이름 가져오기
        fetch('Info')   
        .then( res => {
            setShopName( res?.company_name );
        })
    
    },[]);

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
    // 선택지역 캐시 있으면 requestOrders() 
    if ( isFocused ) {
   
        fetch('orderRegion')
        .then( (res) => {
            if (res?.region != null ) {
                    const res_region = res.region;
                    cacheRegion(res.region);

                    fetch('auth')
                    .then( res => {
                        const auth = res.auth ;
                        axios({
                            method: 'GET' ,
                            url: `${server.url}/api/orders?regions=${res_region}` ,
                            headers: { Auth: auth  }
                        })
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
                                //
                                if ( e.response.hasOwnProperty('status') && e.response.status == 403 ) {
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
                    })
                    .catch(e => { }) ;
                    
                }
                
        })
        .catch( e=> {

        })
    }
        
        
    },[MyContext.bidRef , isFocused]);


    return (
    <Provider>
        <Portal>
            <Modal visible={modalVisible} contentContainerStyle={{ backgroundColor: 'white' , width: '100%' , height: 500 , marginRight: 10 , bottom: 0 , position: 'absolute' }}>
                <View style={{ width: '100%' , height: 500  }}>
                    <IconButton icon='close' style={{ alignSelf: 'flex-end' , top: 0  }} onPress={() => { setModalVisible(false)}} />
                    {
                        REGION.map(region=>{
                            return(
                                <Button icon={ regions[region.key] && 'check-decagram' } key={region.key} style={{ flex: 1 , justifyContent: 'center' , margin: 3 }} mode='outlined' color={colors.main}
                                    onPress={ () => { handleRegion(region.key) } }
                                >
                                    {region.value}
                                </Button>
                            )
                        })
                    }
                    <Button onPress={requestOrders} icon='magnify' style={{ flex: 1 , justifyContent: 'center' , margin: 3 , marginTop: 50 }} color={colors.main} mode='contained'>검색하기</Button>
                </View>
            </Modal>
        </Portal>

            
        <Appbar.Header style={{ backgroundColor: 'transparent' , elevation: 0 }}>
                <Appbar.Content title={shopName} titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 30 , color: 'gray'  }} />
                {/* <Appbar.Action icon="bell-outline" color='gray' onPress={() => {}} /> */}
                {/* <Appbar.Action icon="cog-outline" color='gray' onPress={() => { props.navigation.navigate('MyPage')}} /> */}
        </Appbar.Header>   
        <Tab.Navigator sceneContainerStyle={{ backgroundColor: 'white' }} screenOptions={{ tabBarActiveTintColor: colors.main , tabBarIndicatorStyle: { backgroundColor: colors.main }  }}   initialRouteName={BidBefore}>
            <Tab.Screen name="BidBefore" component={BidBefore} options={{ title: '입찰 전' }} />
            <Tab.Screen name="BidRegister_current" component={BidRegister_current} options={{ title: '입찰 중'  }}/>
            <Tab.Screen name="BidRegister_history" component={BidRegister_history} options={{ title: '입찰결과' }}/>
        </Tab.Navigator>
    </Provider>
    );
}