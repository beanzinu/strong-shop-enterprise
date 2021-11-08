import React from 'react' ;
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { 
    Appbar , Title , Divider , List,
    Button ,  IconButton , Chip
} 
from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../../color/colors';
import { SafeAreaView } from 'react-native';

const View = styled.SafeAreaView``;
const Row = styled.View`
    align-items: center;
    flex-direction: row;
`;


const data = [
    {
        carName: '제네시스 G80' ,
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
        seat : true ,
        //  요청사항 30자 정도로 제한 
        etc : '가성비로 맞추고 싶어요!가성비로 맞추고 싶어요!가성비로 맞추고 싶어요!' ,
    } ,
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
    } ,
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
];
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
        margin : 3
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

function Item ( {i , item , navigation , ModalPress } ) {
    const [expanded,setExpanded] = React.useState(false) ;

    React.useEffect(() =>  {
        // 서버
        // 1. 서버로부터 나의 지역에 있는 입찰내역들을 불러온다.
    },[]);

    return( 
                    <List.Section key={i}>
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
                                { item.tinting && 
                                    <>
                                        <List.Item titleStyle={styles.listStyle} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                        <Row>
                                            { item.detailTinting.solarguard && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>솔라가드</Chip>}
                                            { item.detailTinting.rayno && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>레이노</Chip>}
                                            { item.detailTinting.llumar && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>루마</Chip>}
                                            { item.detailTinting.rainbow && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>레인보우</Chip>}
                                        </Row>
                                    </> }
                                {item.blackbox && 
                                    <>
                                        <List.Item titleStyle={styles.listStyle}  title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10}/>} />
                                        <Row>
                                            { item.detailTinting.solarguard && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>솔라가드</Chip>}
                                            { item.detailTinting.rayno && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>레이노</Chip>}
                                            { item.detailTinting.llumar && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>루마</Chip>}
                                            { item.detailTinting.rainbow && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>레인보우</Chip>}
                                        </Row>
                                    </>}
                                {item.ppf && <><List.Item titleStyle={styles.listStyle}  title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} /></>}
                                {item.glass && <><List.Item titleStyle={styles.listStyle}  title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} /></>} 
                                {item.seat && <><List.Item titleStyle={styles.listStyle}  title ='가죽코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} /></>}
                                <Divider/>
                                <List.Item 
                                    // style={{ borderWidth: 1 ,borderColor: 'lightgray'}}
                                    titleStyle={{  fontWeight: 'bold' }} 
                                    descriptionStyle={{ paddingTop: 3 , fontWeight: 'bold' }}
                                    title='요청사항:' description={item.etc} />
                                <Button 
                                        icon='account-cash' 
                                        mode='outlined' 
                                        color={colors.main}
                                        mode='contained' 
                                        onPress={ () => { navigation.navigate('BidRegister',{ data : item }) } }
                                        style={{ margin: 3 , marginTop: 20 }} labelStyle={{  fontSize: 17 }} >
                                    입찰하기
                                </Button>
                            </View>
                          </List.Accordion>
                    </List.Section>
    )
}


export default function ( props ) {
    const [menu,setMenu] = React.useState(1);

    React.useEffect(() => {
        // 서버
        //  1. 서버로부터 현재 나의 지역에 대한 입찰을 가져온다.
        // *1-1) 내가 이미 입찰한 건들?
        
    },[]);

    return (
    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}> 
        <SafeAreaView>
        <Appbar.Header style={{ backgroundColor: 'transparent' , elevation: 0 }}>
            <Appbar.Content title="최강샵" titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 30 , color: 'gray'  }} />
            <Appbar.Action icon="bell-outline" color='gray' onPress={() => {}} />
            <Appbar.Action icon="cog-outline" color='gray' onPress={() => {}} />
        </Appbar.Header>   

        <Row>
            <Button style={styles.button} mode={ menu == 1 ? 'contained' : 'outlined' } color={colors.main} onPress={()=>{ setMenu(1) }}>입찰 전</Button>
            <Button style={styles.button} mode={ menu == 2 ? 'contained' : 'outlined' } color={colors.main} onPress={()=>{ setMenu(2) }}>입찰 중</Button>
            <Button style={styles.button} mode={ menu == 3 ? 'contained' : 'outlined' } color={colors.main} onPress={()=>{ setMenu(3) }}>입찰 결과</Button>
        </Row>
        {/* 입찰 전 */}
        {
            menu == 1 && 
            data.map( (item,i) => {
                    return (
                    <Item item={item} i={i} navigation={props.navigation}/>
                    )
                }
            )
        }
        {/* 입찰 중 */}
        {
            menu == 2 && 
            myData.map( (item,i) => {
                    return (
                    <Item item={item} i={i} navigation={props.navigation}/>
                    )
                }
            )
        }
        {/* 입찰 후 */}
        {
            menu == 3 && 
            myResult.map( (item,i) => {
                    return (
                    <Item item={item} i={i} navigation={props.navigation}/>
                    )
                }
            )
        }

        </SafeAreaView>
    </KeyboardAwareScrollView>  
    );
}