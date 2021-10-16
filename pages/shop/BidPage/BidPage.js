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
import {
    BottomSheetModal,
    BottomSheetModalProvider,
  } from '@gorhom/bottom-sheet';
// Pages
import BidRegister from './BidRegister';

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
        glass : false ,
        seat : false ,
        etc : '가성비로 맞추고 싶어요!' ,
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
    } ,
    
];

const styles = {
    containerStyle : {
        backgroundColor: 'white',
        flex : 1 , 
        padding : 20 ,
    }  ,
    chipStyle : {
        backgroundColor: 'rgb(200,200,200)',
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
        fontWeight: 'bold',
        fontSize: 17 , 
    }

}

function Item ( {i , item , navigation , ModalPress } ) {
    const [expanded,setExpanded] = React.useState(false) ;
    return( 
                    <List.Section key={i} >
                          <List.Accordion
                            title={item.carName}
                            style={{ borderWidth: 1 , borderColor : 'lightgray' }}
                            titleStyle= {{ fontWeight : 'bold' , fontFamily: 'DoHyeon-Regular' , fontSize: 20 , color :  expanded ? 'red' : 'black'   }}
                            expanded={expanded}
                            onPress={()=>{setExpanded(!expanded)}}
                            description='자세한 정보를 확인하세요.'
                            left={props => <List.Icon {...props} icon="car-hatchback" color='red' />}
                           >
                            <View>
                            { item.tinting && 
                                <>
                                    <List.Item titleStyle={styles.listStyle} title ='틴팅'  />
                                    <Row>
                                        { item.detailTinting.solarguard && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>솔라가드</Chip>}
                                        { item.detailTinting.rayno && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>레이노</Chip>}
                                        { item.detailTinting.llumar && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>루마</Chip>}
                                        { item.detailTinting.rainbow && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>레인보우</Chip>}
                                    </Row>
                                </> }
                            {item.blackbox && 
                                <>
                                    <List.Item titleStyle={styles.listStyle}  title ='블랙박스' />
                                    <Row>
                                        { item.detailTinting.solarguard && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>솔라가드</Chip>}
                                        { item.detailTinting.rayno && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>레이노</Chip>}
                                        { item.detailTinting.llumar && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>루마</Chip>}
                                        { item.detailTinting.rainbow && <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>레인보우</Chip>}
                                    </Row>
                                </>}
                            {item.ppf && <><List.Item titleStyle={styles.listStyle}  title ='PPF'  /></>}
                            {item.glass && <><List.Item titleStyle={styles.listStyle}  title ='유리막코팅'  /></>} 
                            {item.seat && <><List.Item titleStyle={styles.listStyle}  title ='가죽코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} color={colors.main}/>} /></>}
                            <Divider/>
                            <List.Item 
                                right={(props) => 
                                <Button icon='account-cash' mode='outlined' color={colors.main}
                                mode='contained' 
                                onPress={ () => { navigation.navigate('BidRegister',{ data : item }) } }
                                style={{ height : '100%' , borderColor: 'white', padding: 10 }} labelStyle={{ fontSize: 15 }} >
                                    입찰하기
                                </Button>}
                                titleStyle={{ fontWeight: 'bold' }}
                                title='요청사항:' description={item.etc} />
                            </View>
                          </List.Accordion>
                    </List.Section>
    )
}


export default function ( props ) {

    const snapPoints = React.useMemo(() => ['25%','75%'], []);

    const bottomSheetModalRef = React.useRef(null);
    const handlePresentModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);
    const handleDismissModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);  

    React.useEffect(() => {
        // bottomSheetModalRef.current?.present();
    },[]);

    return (
    <BottomSheetModalProvider>
    <KeyboardAwareScrollView>    
        <Appbar.Header style={{ backgroundColor: colors.main }}>
            <Appbar.Content title="최강샵" titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 30}} />
            <Appbar.Action icon="bell-outline" onPress={() => {}} />
            <Appbar.Action icon="cog-outline" onPress={() => {}} />
        </Appbar.Header>   
        <Row style={{ marginTop: 20 , marginBottom: 20 }}>
            <Title style={styles.title}>현재</Title>
            <Title style={{...styles.title , color: 'red' , fontSize: 35 }}>{data.length}</Title>
            <Title style={styles.title}>건의 입찰요청이 있습니다.</Title>
        </Row>

        <Divider/>
        {
            data.map( (item,i) => {
                    return (
                    <Item item={item} i={i} navigation={props.navigation} ModalPress={handlePresentModalPress} />
                    )
                }
            )
        }
        
         <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            index = {1}
        >
            <ScrollView>
                <IconButton icon='close' style={{ alignSelf : 'flex-end' }} color='red' onPress={handleDismissModalPress}/>
                <Title style={{ padding: 10 , fontWeight: 'bold' }}>💰  입찰은 어떻게 진행되나요?</Title>
            </ScrollView>
        </BottomSheetModal>

    </KeyboardAwareScrollView>  
    </BottomSheetModalProvider>
    );
}