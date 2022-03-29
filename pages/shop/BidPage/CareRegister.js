import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Appbar , Title , Badge, IconButton , TextInput , 
    Chip , List , Button , ActivityIndicator ,
    Provider , Modal , Portal
} 
from 'react-native-paper';
import { FlatList , Image , ScrollView  , Text } from 'react-native';
import Swiper from 'react-native-swiper';
import styled from 'styled-components';
import colors from '../../../color/colors';
import Collapsible from 'react-native-collapsible';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Alert } from 'react-native';
import AppContext from '../../../storage/AppContext';
import LottieView from 'lottie-react-native';
import SwiperView from 'react-native-swiper-view';
import ImageViewer from 'react-native-image-zoom-viewer';
// API
import API from '../../../server/API';

const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;
const View = styled.View``;
const Viewer = styled.TouchableOpacity``;
// const SwiperView = styled.View`
//     width: 100%;
//     height: 350px;
// `;
const ImageView = styled.View`
    width: 100%;
    height: 400px;
    justify-content: center;
`;
const RowButton = styled.TouchableOpacity`
    width: 100%;
    height: 50px;
    align-items: center;
    flex-direction: row;
`;
const MenuView = styled.View`
    width: 100%;
    /* height: 300px; */
    border: 2px rgb(240,240,240);  
    margin: 10px;
    padding: 5px; 
`;
const sample = {"carId": 0, "carName": "SONATA", "options": {"carWash": true , "detailCarWash" : {"detailCarWash": true, "handCarWash": true, "steamCarWash": true}, "etc": "블랙박스", "inside": true , "detailInside" : {"insideCleaning": true, "insideSoundProof": true}, "outside": true , "detailOutside" : {"Wrapping": true, "dent": true, "painting": true}, "scratch": true , "detailScratch" : {"glassCoating": true, "polishing": true}}, "region": "대전", "require": {"formdata": [[FormData], [FormData]], "text": ["아ㅏ누아랓", "오징어"]}}

const test = [{ id: 1 },{ id: 2 },{ id: 3 },{ id: 4 },{ id: 5 }]

function translate( key , value ) {
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
    if( key == 'carWash' ) return carWash[value];
    else if( key == 'inside' ) return inside[value];
    else if( key == 'outside' ) return outside[value];
    else if( key == 'scratch' ) return scratch[value];
    
}



export default function CareRegister( props ){
    const [loading,setLoading] = React.useState(true);
    const [data,setData] = React.useState(null);
    const [images,setImages] = React.useState(null);
    const [visible,setVisible] = React.useState(false);
    const [index,setIndex] = React.useState(0);

    const [collapsed,setCollapsed] = React.useState(true);
    const [requesting,setRequesting] = React.useState(false);
    // const [index,setIndex] = React.useState(0);
    // const [option,setOption] = React.useState('세차');
    // const [optionList,setOptionList] = React.useState([]);
    const viewRef = React.useRef(null);
    const MyContext = React.useContext(AppContext);

    const [tabList,setTabList] = React.useState([]);
    const [carWash,setCarWash] = React.useState('');
    const [carWashPrice,setCarWashPrice] = React.useState('');
    const [inside,setInside] = React.useState('');
    const [insidePrice,setInsidePrice] = React.useState('');
    const [outside,setOutside] = React.useState('');
    const [outsidePrice,setOutsidePrice] = React.useState('');
    const [scratch,setScratch] = React.useState('');
    const [scratchPrice,setScratchPrice] = React.useState('');
    const [etc,setEtc] = React.useState('');
    const [etcPrice,setEtcPrice] = React.useState('');


    const getSum = () => {
        return Number(carWashPrice)+Number(insidePrice)+Number(outsidePrice)+Number(scratchPrice)+Number(etcPrice) ;
    }

    checkInput = () => {
        flag = true ;
        if ( (data.options['carWash']) ) if ( !carWash.length || !carWashPrice.length ) flag = false;
        if ( (data.options['inside']) ) if ( !inside.length || !insidePrice.length ) flag = false;
        if ( (data.options['outside'] ) ) if ( !outside.length || !outsidePrice.length )  flag = false;
        if ( (data.options['scratch'] ) ) if ( !scratch.length || !scratchPrice.length ) flag = false;
        if ( (data.options['etc'] ) ) if ( !etc.length || !etcPrice.length ) flag = false;
        return flag ;
    }

    checkRegister = () => {
        // 모든 TextInput들이 입력되었을 때 입찰여부를 물어봄.
        flag = checkInput();
        // true
        if ( flag )
        Alert.alert('입찰하시겠습니까?','',[
            {
                text: '취소'
            } ,
            {
                text: '확인',
                onPress: () => { requestBidding() }
            }
        ])
        //false
        else
            Alert.alert('입찰정보를 모두 입력해주세요.');
    }

    async function requestBidding() {

        setRequesting(true);

        let data1 = {} ;
        if ( data.options['carWash']  ) {
            data1['carwash'] = carWash , data1['carwashPrice'] = carWashPrice ;
        }
        if ( data.options['inside']  ) {
            data1['inside'] = inside , data1['insidePrice'] = insidePrice ;
        }
        if ( data.options['outside']  ) {
            data1['outside'] = outside , data1['outsidePrice'] = outsidePrice ;
        }
        if ( data.options['scratch']  ) {
            data1['scratch'] = scratch, data1['scratchPrice'] = scratchPrice ;
        }
        if ( data.options.etc ) {
            data1['etc'] = etc , data1['etcPrice'] = etcPrice;
        }
        

        data1['totalPrice'] = getSum().toString() ;
        data1['carName'] = data.carName ;
        // 케어
        data1['kind'] = "Care"
        
        API.post('/api/bidding',{
            detail: JSON.stringify(data1) ,
            order_id: props.route.params.id
        })
        .then( res => {

            if ( res.data.statusCode == 201) {
                Alert.alert('입찰완료');
                MyContext.setBidRef(!MyContext.bidRef);
                props.navigation.goBack();
            }

        })
        .catch ( e =>  {

            if ( e.response.status == 403 ) {
                Alert.alert('입찰오류','이미 낙찰되었거나 취소된 입찰입니다.');
                MyContext.setBidRef(!MyContext.bidRef);
                setRequesting(false);
                props.navigation.goBack();
            }
            else{
                Alert.alert('다시 시도해주세요.');
                setRequesting(false);
            }
        })
        
    }

    // React.useEffect(() =>  {
    //     setTimeout(() => {
    //         viewRef.current?.scrollToEnd()
    //     },500);
    // },[ collapsed ]);

    React.useEffect(() => {
        getTabList( props.route.params.data);

        let tmp = props.route.params.imageUrls ;
        for( i in tmp ){
            tmp[i].url = tmp[i].imageUrl
        }
        setImages( tmp ) ;
        setData( props.route.params.data,
            setLoading(false)
        );

    },[]);

    let swipeList = [];

    const autoSwipe = ( current ) => {

        if( Platform.OS == 'android' ) return;

        var next = 0;
        for ( i in swipeList ){
            if( swipeList[i].name == current ) {
                next = Number(i)+1 ;
                break;
            }
        }

        // 마지막 Swiper
        if( next == swipeList.length ) return;

        const nextInput = swipeList[next]?.name 

        // if( nextInput == "세차"  ) this.tinting.focus();
        if( nextInput == "내부"  ) this.inside.focus();
        else if( nextInput == "외부"  ) this.outside.focus();
        else if( nextInput == "스크레치"  ) this.scartch.focus();
        else if( nextInput == "기타"  ) this.etc.focus();
        
    }

    function CarWash({data}){
        return(
            <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>세차</Title>
                    </Row>
                    <ScrollView horizontal={true}>
                        {
                            _.map(data.options.detailCarWash,(value,key) => { 
                                if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('carWash',key) }</Chip>  
                            })
                        }
                    </ScrollView>
                    <TextInput 
                        placeholder='제품명' 
                        theme={styles.theme}
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.carWashPrice.focus() }}
                        // value={carWash}
                        onChangeText={value=>{ setCarWash(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.carWashPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => { autoSwipe("세차")}}
                        // value={carWashPrice}
                        onChangeText={value=>{ setCarWashPrice(value) }}
                    />
            </MenuView>
        );
    }
    function Inside({data}){
        return(
            <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>내부</Title>
                    </Row>
                    <ScrollView horizontal={true}>
                        {
                            _.map(data.options.detailInside,(value,key) => { 
                                if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('inside',key) }</Chip>  
                            })
                        }
                    </ScrollView>
                    <TextInput 
                        placeholder='제품명'
                        ref= { (input) =>{this.inside = input }} 
                        theme={styles.theme}
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.insidePrice.focus() }}
                        // value={inside}
                        onChangeText={value=>{ setInside(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.insidePrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => { autoSwipe("내부")}}
                        // value={insidePrice}
                        onChangeText={value=>{ setInsidePrice(value) }}
                    />
            </MenuView>
        );
    }
    function Outside({data}){
        return(
                <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>외부</Title>
                    </Row>
                    <ScrollView horizontal={true}>
                        {
                            _.map(data.options.detailOutside,(value,key) => { 
                                if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('outside',key) }</Chip>  
                            })
                        }
                    </ScrollView>
                    <TextInput 
                        placeholder='제품명'
                        ref= { (input) =>{this.outside = input }} 
                        theme={styles.theme}
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.outsidePrice.focus() }}
                        // value={outside}
                        onChangeText={value=>{ setOutside(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.outsidePrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => { autoSwipe("외부")}}
                        // value={outsidePrice}
                        onChangeText={value=>{ setOutsidePrice(value) }}
                    />
                </MenuView>
        );
    }
    function Scratch({data}){
        return(
            <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>스크레치</Title>
                    </Row>
                    <ScrollView horizontal={true}>
                        {
                            _.map(data.options.detailScratch,(value,key) => { 
                                if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('scratch',key) }</Chip>  
                            })
                        }
                    </ScrollView>
                    <TextInput 
                        placeholder='제품명'
                        ref= { (input) =>{this.scratch = input }} 
                        theme={styles.theme}
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.scratchPrice.focus() }}
                        // value={scratch}
                        onChangeText={value=>{ setScratch(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.scratchPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => { autoSwipe("스크레치")}}
                        // value={scratchPrice}
                        onChangeText={value=>{ setScratchPrice(value) }}
                    />
            </MenuView>
        );
    }
    function Etc({data}){
        return(
            <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>기타</Title>
                    </Row>
                    <ScrollView horizontal={true}> 
                        <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{data.options.detailEtc}</Chip>  
                    </ScrollView>
                    <TextInput 
                        placeholder='제품명'
                        ref= { (input) =>{this.etc = input }} 
                        theme={styles.theme}
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.etcPrice.focus() }}
                        // value={etc}
                        onChangeText={value=>{ setEtc(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.etcPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => { autoSwipe("기타")}}
                        // value={etcPrice}
                        onChangeText={value=>{ setEtcPrice(value) }}
                    />
            </MenuView>
        );
    }

    function getTabList( list ) {
        let result = []
        if( list.options.carWash ) {
            result.push( { name: '세차' , component: <CarWash data={list} /> } )
        }
        if( list.options.inside ) {
            result.push( { name: '내부' , component: <Inside data={list}/> })
        }
        if( list.options.outside ) {
            result.push( { name: '외부' , component: <Outside data={list} /> 
            })
        }
        if( list.options.scratch ) {
            result.push( { name: '스크레치' , component: <Scratch data={list} /> 
            })
        }
        if( list.options.etc ) {
            result.push( { name: '기타' , component: <Etc data={list} /> 
            })
        }
        
        setTabList(result);
        swipeList = result;
    }

    const RenderItem = ({ key , item }) => {
        return(
            <Viewer onPress={() => { setIndex( findIndex(item.id) ) , setVisible(true)}} key={key} style={{ width: '100%' , height: 300 , margin: 1 }}>
                <FastImage resizeMode='contain' source={{ uri: item.imageUrl }} style={{ width: '100%' , height: '100%'}} />
                <Text style={{ margin : 10 , fontSize: 15 }}>{ item.comment ? item.comment : "" } </Text>
            </Viewer>
        );
    }

    function findIndex( id ){
        for( i in images ){
            if( id == images[i].id ) return Number(i) ;
        }
    }



    return(
            loading ? <ActivityIndicator color={colors.main} style={{ marginTop: 20 }} /> :
        (
        <Provider>
        <KeyboardAwareScrollView 
            style={{ backgroundColor: 'white' }}
            ref={viewRef}
            nestedScrollEnabled={true} 
            showsVerticalScrollIndicator={false}
        >

        <Appbar.Header style={{ backgroundColor: 'white' , elevation: 0 }}>
            <Appbar.BackAction onPress={() => { props.navigation.goBack() }}/>
            <Row>
                <Title style={{ fontWeight: 'bold' , marginLeft: 20 , fontSize: 22 }}>{data.carName}</Title>
            </Row>
            <Badge size={ 28 } style={{ alignSelf: 'center' , marginLeft: 10 , backgroundColor: colors.care , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>케어</Badge>
            {
                data?.role == "DEALER" && <Badge size={ 28 } style={{ alignSelf: 'center' , marginLeft: 10 , backgroundColor: 'black' , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>딜러</Badge>
            }
        </Appbar.Header>

        <Portal>
            <Modal visible={requesting} style={{ alignItems: 'center' , justifyContent: 'center' , backgroundColor: 'transparent' }} >
                <LottieView style={{ width: 200, height: 100 }} source={require('../Register/2.json')} autoPlay={true} loop={true}/>
            </Modal>
        </Portal>

        <Portal>
            <Modal visible={visible} onDismiss={() => { setVisible(false) }} contentContainerStyle={{ width: '100%', height: '100%' , backgroundColor: 'black' , elevation: 3  }}>
            <ImageViewer 
                renderImage={ props =>
                <FastImage resizeMode={FastImage.resizeMode.contain}  source={{ uri : props.source.uri }} style={{ width: '100%' , height: '90%' }}/>
                } 
                imageUrls={images} enableSwipeDown={true} onCancel={ () => {setVisible(false)} } index={index} 
                enablePreload={true}
                renderHeader={() =><IconButton icon='close' style={{ alignSelf: 'flex-end'  }} color='white' onPress={ () => { setVisible(false) }} /> }
            />
            </Modal>
        </Portal>

        <ImageView style={{ marginTop: 20}}>
        {
            !images?.length ? (
                <>
                <IconButton size={45} icon='image' style={{ alignSelf: 'center' }}/> 
                {/* <Image resizeMode='contain' source={require('../../../resource/Loading.jpeg')} style={{ width: '100%' , height: '100%' }} /> */}
                <Title style={{ alignSelf: 'center'  }}>고객님이 올린 사진이 없어요.</Title>
                </>
            ) : 
            (
                <Swiper>
                    {
                        images.map( item => {
                            return <RenderItem key={item.id} item={item}/> 
                        })
                    }
                </Swiper>
            )
        }
        </ImageView>

        {/* <RowButton onPress={() => {setCollapsed(!collapsed)}} >
            <IconButton icon='pencil' color={collapsed ? 'black': 'lightgray'} />
            <Title style={{ ...styles.label , color: collapsed ? 'black' : 'lightgray' }}>견적 작성하기</Title>
            <IconButton icon={ collapsed ? 'chevron-down' : 'chevron-up' } color={collapsed ? 'black': 'lightgray'}  style={{ position: 'absolute' , right: 0  }}/>
        </RowButton> */}
        
        {/* <Collapsible collapsed={collapsed}> */}

        {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            { data.options.carWash && <Chip onPress={() => handleSwiper('세차')} style={ option == '세차' ?  styles.optionChipStyle : styles.unOptionChipStyle } textStyle={ option == '세차' ? styles.optionChipTextStyle : styles.unOptionChipTextStyle }>{'세차'}</Chip>}
            { data.options.inside && <Chip onPress={() =>handleSwiper('내부')} style={ option == '내부' ?  styles.optionChipStyle : styles.unOptionChipStyle } textStyle={ option == '내부' ? styles.optionChipTextStyle : styles.unOptionChipTextStyle }>{'내부'}</Chip>}
            { data.options.outside && <Chip onPress={() => handleSwiper('외부')} style={ option == '외부' ?  styles.optionChipStyle : styles.unOptionChipStyle } textStyle={ option == '외부' ? styles.optionChipTextStyle : styles.unOptionChipTextStyle }>{'외부'}</Chip>}
            { data.options.scratch && <Chip onPress={() => handleSwiper('스크레치')} style={ option == '스크레치' ?  styles.optionChipStyle : styles.unOptionChipStyle } textStyle={ option == '스크레치' ? styles.optionChipTextStyle : styles.unOptionChipTextStyle }>{'스크레치'}</Chip>}
            { data.options.etc && <Chip onPress={() => handleSwiper('기타')} style={ option == '기타' ?  styles.optionChipStyle : styles.unOptionChipStyle } textStyle={ option == '기타' ? styles.optionChipTextStyle : styles.unOptionChipTextStyle }>{'기타'}</Chip>}
        </ScrollView> */}

        <SwiperView 
            tabList={tabList} 
            tabBarStyles = {{ backgroundColor: colors.main , color: colors.main }}
            tabBarLineStyles={{ backgroundColor: 'transparent'  }} 
            tabHeaderStyles={{ backgroundColor: 'transparent' }}  
            tabButtonStyles={{ backgroundColor: 'transparent' }}
            tabButtonTextActiveStyles={{ color: colors.main }}
            tabButtonTextStyles={{ color: 'lightgray' }}
        />

        <List.Item style={{ marginTop: 30 }} title='지역' right={props => <Title>{data.region}</Title>}></List.Item>
        <List.Item title='최종가격' right={props => <Title>{getSum()} 만원</Title>}></List.Item>
        <Button color = { colors.main } 
            style={{ margin : 10 , marginTop: 20 , marginBottom: 50 }}
            labelStyle = {{ fontSize: 17 , color: 'white' }}
            onPress={ () => { checkRegister() }}
            mode='contained' 
            disabled={requesting}
        >
                { requesting ? '입찰 중...' : '입찰하기'}
        </Button>
        {/* </Collapsible> */}

        </KeyboardAwareScrollView>
        </Provider>
        )
    )
    
}

const styles= {
    title : {
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30 ,
        margin: 10 ,
        marginTop: 20 ,
        marginBottom: 20 , 
        color: 'black',
    } ,
    label : {
        // margin: 15 ,
        // fontFamily : 'DoHyeon-Regular' , 
        // paddingTop: 10 ,
        fontSize: 17 ,
        fontWeight: 'bold' ,
        marginLeft: 10
    } ,
    theme : { 
        colors : {
            underlineColor : 'black' ,
            primary : 'gray' ,
            background: 'white' ,
        }
    } ,
    chipStyle : {
        backgroundColor: 'rgb(220,220,220)',
        margin : 7
    } ,
    optionChipStyle : {
        backgroundColor: colors.main,
        margin : 10
    } ,
    unOptionChipStyle : {
        backgroundColor: 'white',
        margin : 10
    } ,
    optionChipTextStyle : {
        color: 'white' ,
        fontSize: 17
    } ,
    unOptionChipTextStyle : {
        color: 'rgb(220,220,220)' ,
        fontSize: 17
    } ,
    chipTextStyle : {
    } , 
    textInput : { 
        backgroundColor: 'white' , 
        margin: 5  ,
        marginTop: 20
    }
}