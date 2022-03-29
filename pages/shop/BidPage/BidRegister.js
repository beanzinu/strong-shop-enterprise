import React from 'react' ;
import styled from 'styled-components';
import { Title , IconButton , Button , TextInput, Avatar , Chip , List , Provider , Modal , Portal, Divider, Appbar , Badge } from 'react-native-paper';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../../color/colors';
import { Alert, Platform } from 'react-native';
import _, { after }  from 'lodash';
import fetch from '../../../storage/fetch';
import store from '../../../storage/store';
import API from '../../../server/API';
import server from '../../../server/server';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppContext from '../../../storage/AppContext';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Collapsible from 'react-native-collapsible';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import SwiperView from 'react-native-swiper-view';


const Container = styled.SafeAreaView``;
const View = styled.View``;
const MenuView = styled.View`
    width: 100%;
    /* height: 300px; */
    border: 2px rgb(240,240,240);  
    margin: 10px;
    padding: 5px; 
`;
const Text = styled.Text``;
const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;
const ButtonRow = styled.View`
    align-items: center;
    flex-direction: row;
    width: 100%;
    padding-top: 15px;
    padding-bottom: 15px;
    /* border-bottom-width: 1px; */
    /* border-color: lightgray; */
`;

// const TextInput = styled.TextInput`
//     width: 90% ;
//     height: 50px;
//     margin: 10px;
//     padding: 10px;
//     border: 1px lightgray;
//     border-radius: 10px;
// `;
const RowButton = styled.TouchableOpacity`
    width: 100%;
    height: 50px;
    align-items: center;
    flex-direction: row;
`;


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
        fontSize: 20 ,
        fontWeight: 'bold'
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
        margin : 7 ,
    } ,
    chipTextStyle : {
    } , 
    textInput : { 
        backgroundColor: 'white' , 
        marginTop: 30 ,
    }
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
    if(option === 'tinting') return res_Tinting[item];
    else if(option === 'ppf') return res_Ppf[item];
    else if(option === 'blackbox') return res_Blackbox[item];
    else if(option === 'battery') return res_Battery[item];
    else if(option === 'afterblow') return res_Afterblox[item];
    else if(option === 'soundproof') return res_Soundproof[item];
    else if(option === 'wrapping') return res_Wrapping[item];
    else if(option === 'region') return res_Region[item];
    else if(option === 'bottomcoating') return res_Bottomcoating[item];
}

export default function BidRegister( props ) {
    const [requesting,setRequesting] = React.useState(false);
    const [data,setData] = React.useState({}) ;
    const [id,setId] = React.useState('');
    const [tinting,setTinting] = React.useState('');
    const [tintingPrice,setTintingPrice] = React.useState('');
    const [ppf,setPpf] = React.useState('');
    const [ppfPrice,setPpfPrice] = React.useState('');
    const [blackbox,setBlackbox] = React.useState('');
    const [blackboxPrice,setBlackboxPrice] = React.useState('');
    const [battery,setBattery] = React.useState('');
    const [batteryPrice,setBatteryPrice] = React.useState('');
    const [afterblow,setAfterblow] = React.useState('');
    const [afterblowPrice,setAfterblowPrice] = React.useState('');
    const [soundproof,setSoundproof] = React.useState('');
    const [soundproofPrice,setSoundproofPrice] = React.useState('');
    const [wrapping,setWrapping] = React.useState('');
    const [wrappingPrice,setWrappingPrice] = React.useState('');
    const [glasscoating,setGlasscoating] = React.useState('');
    const [glasscoatingPrice,setGlasscoatingPrice] = React.useState('');
    const [bottomcoating,setBottomcoating] = React.useState('');
    const [bottomcoatingPrice,setBottomcoatingPrice] = React.useState('');
    const MyContext = React.useContext(AppContext);

    const [picture,setPicture] = React.useState(null);
    const [tabList,setTabList] = React.useState([]);
    
    React.useEffect(() => {
    
        // BidPage 에서 data를 받아옴
        setData( props.route.params.data ,
            ) ;
        getTabList( props.route.params.data ) ;

        setId ( props.route.params.id) ;

        fetch('Info')
        .then( async(res) => {
            if (res?.backgroundImageUrl != null) {
                setPicture( res.backgroundImageUrl);
            }
            else {
                // 1. 서버에게 요청하여 Info 정보 받아옴.
                API.get('/api/companyinfo')
                .then(res=> {
                    // 2. Info 정보를 setData()
                    try {
                        if ( res.data.statusCode == 200 ) {
                            store('Info',{ 'backgroundImageUrl' : res.data.data.backgroundImageUrl })
                            setPicture( res.data.data.backgroundImageUrl);
                        }
                    }
                    catch(e) {
                        //
                    }
                })
                .catch( e => { 
                    // console.log(e.response);
                 })
            }
        })

    },[]);

    const getSum = () => {
        return Number(tintingPrice) + Number(ppfPrice) + Number(blackboxPrice) + Number(batteryPrice) + Number(afterblowPrice) + Number(soundproofPrice) + Number(wrappingPrice) + Number(glasscoatingPrice) + Number(bottomcoatingPrice) ;
    }

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
        // if( current == "틴팅" && ( !tinting.length || !tintingPrice.length ) ) return;
        // else if( current == "PPF" && ( !ppf.length || !ppfPrice.length ) ) return;
        // else if( current == "블랙박스" && ( !blackbox.length || !blackboxPrice.length ) ) return;
        // else if( current == "애프터블로우" && ( !afterblow.length || !afterblowPrice.length ) ) return;
        // else if( current == "방음" && ( !soundproof.length || !soundproofPrice.length ) ) return;
        // else if( current == "랩핑" && ( !wrapping.length || !wrappingPrice.length ) ) return;
        // else if( current == "유리막코팅" && ( !glasscoating.length || !glasscoatingPrice.length ) ) return;
        // else if( current == "하부코팅" && ( !bottomcoating.length || !bottomcoatingPrice.length ) ) return;

        const nextInput = swipeList[next]?.name 

        if( nextInput == "틴팅"  ) this.tinting.focus();
        else if( nextInput == "PPF"  ) this.ppf.focus();
        else if( nextInput == "블랙박스"  ) this.blackbox.focus();
        else if( nextInput == "보조배터리"  ) this.battery.focus();
        else if( nextInput == "애프터블로우"  ) this.afterblow.focus();
        else if( nextInput == "방음"  ) this.soundproof.focus();
        else if( nextInput == "랩핑"  ) this.wrapping.focus();
        else if( nextInput == "유리막코팅"  ) this.glasscoating.focus();
        else if( nextInput == "하부코팅" ) this.bottomcoating.focus();
        
    }
    
    function Tinting({ data }){ 
        return(
            <MenuView>
            <Row>
                <IconButton icon='clipboard-outline' />
                <Title style={styles.label}>틴팅</Title>
            </Row>
            <ScrollView horizontal={true}>
                {
                    _.map(data?.options?.detailTinting,(value,key) => { 
                        if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                        if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('tinting',key) }</Chip>  
                    })
                }
            </ScrollView>
            <TextInput 
                placeholder='제품명' 
                theme={styles.theme}
                style={styles.textInput}
                onSubmitEditing={ () => { this.tintingPrice.focus() }}
                // value={tinting}
                onChangeText={value=>{ setTinting(value) }}
            />
            <TextInput placeholder='가격' 
                ref= { (input) =>{this.tintingPrice = input }}
                keyboardType='number-pad'
                theme={styles.theme}
                style={styles.textInput}
                right={<TextInput.Affix text='만원'/>}
                // onSubmitEditing={() => autoSwipe('틴팅')}
                onBlur={() => autoSwipe('틴팅') }
                // value={tintingPrice}
                onChangeText={value=>{ setTintingPrice(value) }}
            />
            </MenuView>

        )
    }
    function Ppf({ data }){
        return(
                    <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>PPF</Title>
                    </Row>
                    <ScrollView horizontal={true}>
                        {
                             _.map(data?.options?.detailPpf,(value,key) => { 
                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('ppf',key) }</Chip>  
                            })
                        }
                    </ScrollView>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        ref={ (input) =>{this.ppf = input } }
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.ppfPrice.focus() }}
                        // value={ppf}
                        onChangeText={value=>{ setPpf(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.ppfPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => autoSwipe('PPF') }
                        // value={ppfPrice}
                        onChangeText={value=>{ setPpfPrice(value) }}
                    />
                </MenuView>
        )
    }
    function Blackbox({ data }){
        return(
            <MenuView>
            <Row>
                <IconButton icon='clipboard-outline' />
                <Title style={styles.label}>블랙박스</Title>
            </Row>
            <ScrollView horizontal={true}>
                {
                        _.map(data?.options?.detailBlackbox,(value,key) => { 
                            if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                            if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('blackbox',key) }</Chip>  
                    })
                }
            </ScrollView>
            <TextInput placeholder='제품명' theme={styles.theme}
                ref= { (input) =>{this.blackbox = input }}
                style={styles.textInput}
                onSubmitEditing={ () => { this.blackboxPrice.focus() }}
                // value={blackbox}
                onChangeText={value=>{ setBlackbox(value) }}
            />
            <TextInput placeholder='가격' 
                ref= { (input) =>{this.blackboxPrice = input }}
                keyboardType='number-pad'
                theme={styles.theme}
                style={styles.textInput}
                right={<TextInput.Affix text='만원'/>}
                onBlur={() => autoSwipe('블랙박스') }
                // value={blackboxPrice}
                onChangeText={value=>{ setBlackboxPrice(value) }}
            />
        </MenuView>
        );
    }
    function Battery({ data }){
        return(
                    <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>보조배터리</Title>
                    </Row>
                    <ScrollView horizontal={true}>
                        {
                             _.map(data?.options?.detailBattery,(value,key) => { 
                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('battery',key) }</Chip>  
                            })
                        }
                    </ScrollView>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        ref= { (input) =>{this.battery = input }}
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.batteryPrice.focus() }}
                        // value={battery}
                        onChangeText={value=>{ setBattery(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.batteryPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => autoSwipe('보조배터리') }
                        // value={batteryPrice}
                        onChangeText={value=>{ setBatteryPrice(value) }}
                    />
                </MenuView>
        );
    }
    function Afterblow({ data }){
        return(
                    <MenuView>  
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>애프터블로우</Title>
                    </Row>
                    <ScrollView horizontal={true}>
                        {
                            _.map(data?.options?.detailAfterblow,(value,key) => { 
                                if (key == 'ETC' && value != null && value.length != 0  ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('afterblow',key) }</Chip>  
                            })
                        }
                    </ScrollView>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        ref= { (input) =>{this.afterblow = input }}
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.afterblowPrice.focus() }}
                        // value={afterblow}
                        onChangeText={value=>{ setAfterblow(value) }}
                        />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.afterblowPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => autoSwipe('애프터블로우') }
                        // value={afterblowPrice}
                        onChangeText={value=>{ setAfterblowPrice(value) }}
                        />
                </MenuView>
        )
    }
    function Soundproof({ data }){
        return(
                    <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>방음</Title>
                    </Row>
                    <ScrollView horizontal={true}>
                        {
                            _.map(data?.options?.detailSoundproof,(value,key) => { 
                                if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('soundproof',key) }</Chip>  
                            })
                        }
                    </ScrollView>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        ref= { (input) =>{this.soundproof = input }}
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.soundproofPrice.focus() }}
                        // value={soundproof}
                        onChangeText={value=>{ setSoundproof(value) }}
                        />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.soundproofPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => autoSwipe('방음') }
                        // value={soundproofPrice}
                        onChangeText={value=>{ setSoundproofPrice(value) }}
                        />
                </MenuView>
        );
    }
    function Wrapping({ data }){
        return(
                    <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>랩핑</Title>
                    </Row>
                    <ScrollView horizontal={true}>
                        {
                            _.map(data?.options?.detailWrapping,(value,key) => { 
                                if (key == 'DESIGN' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('soundproof',key) }</Chip>  
                            })
                        }
                    </ScrollView>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        ref= { (input) =>{this.wrapping = input }}
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.wrappingPrice.focus() }}
                        // value={wrapping}
                        onChangeText={value=>{ setWrapping(value) }}
                        />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.wrappingPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => autoSwipe('랩핑') }
                        // value={wrappingPrice}
                        onChangeText={value=>{ setWrappingPrice(value) }}
                        />
                    </MenuView>
        )
    }
    function Glasscoating({ data }){
        return( 
                    <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>유리막코팅</Title>
                    </Row>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        ref= { (input) =>{this.glasscoating = input }}
                        style={styles.textInput}
                        onSubmitEditing={ () => { this.glasscoatingPrice.focus() }}
                        // value={glasscoating}
                        onChangeText={value=>{ setGlasscoating(value) }}
                        />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.glasscoatingPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={styles.textInput}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => autoSwipe('유리막코팅') }
                        // value={glasscoatingPrice}
                        onChangeText={value=>{ setGlasscoatingPrice(value) }}
                        />
                </MenuView>
        );
    }
    function Bottomcoating({ data }){
        return(
                    <MenuView>
                    <Row>
                        <IconButton icon='clipboard-outline' />
                        <Title style={styles.label}>하부코팅</Title>
                    </Row>
                    <ScrollView horizontal={true}>
                        {
                             _.map(data?.options?.detailBottomcoating,(value,key) => { 
                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('bottomcoating',key) }</Chip>  
                            })
                        }
                    </ScrollView>

                    <TextInput placeholder='제품명' theme={styles.theme}
                        ref= { (input) =>{this.bottomcoating = input }}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.bottomcoatingPrice.focus() }}
                        // value={bottomcoating}
                        onChangeText={value=>{ setBottomcoating(value) }}
                        />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.bottomcoatingPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                        onBlur={() => autoSwipe('하부코팅') }
                        // value={bottomcoatingPrice}
                        onChangeText={value=>{ setBottomcoatingPrice(value) }}
                        />
                </MenuView>
        );
    }
    function BidItem() {
        return(
            <>
            {
                data?.options?.tinting && <Tinting />
            }
            {
                data?.options?.ppf && <Ppf />
            }
            {
                data?.options?.blackbox && <Blackbox />
            }
            {
                data?.options?.battery && <Battery />
            }
            {
                data?.options?.afterblow && <Afterblow />
            }
            {
                data?.options?.soundproof && <Soundproof />
            }
            {
                data?.options?.wrapping && <Wrapping />
            }
            {
                data?.options?.glasscoating && <Glasscoating />
            }
            {
                data?.options?.bottomcoating && <Bottomcoating />
            }
        </>
        )
    }

    function getTabList( list ) {
        let result = []
        if( list.options.tinting ) {
            result.push( { name: '틴팅' , component: <Tinting data={list} /> } )
        }
        if( list.options.ppf ) {
            result.push( { name: 'PPF' , component: <Ppf data={list}/> })
        }
        if( list.options.blackbox ) {
            result.push( { name: '블랙박스' , component: <Blackbox data={list} /> 
            })
        }
        if( list.options.battery ) {
            result.push( { name: '보조배터리' , component: <Battery data={list} /> 
            })
        }
        if( list.options.afterblow ) {
            result.push( { name: '애프터블로우' , component: <Afterblow data={list} /> 
            })
        }
        if( list.options.soundproof ) {
            result.push( { name: '방음' , component: <Soundproof data={list} /> 
            })
        }
        if( list.options.wrapping ) {
            result.push( { name: '랩핑' , component: <Wrapping data={list} /> 
            })
        }
        if( list.options.glasscoating ) {
            result.push( { name: '유리막코팅' , component: <Glasscoating data={list} /> 
            })
        }
        if( list.options.bottomcoating ) {
            result.push( { name: '하부코팅' , component: <Bottomcoating data={list} /> 
            })
        }
        
        setTabList(result);
        swipeList = result;
    }
    
    checkInput = () => {
        flag = true ;
        if ( (data.options['tinting']) ) if ( !tinting.length || !tintingPrice.length ) flag = false;
        if ( (data.options['ppf']) ) if ( !ppf.length || !ppfPrice.length ) flag = false;
        if ( (data.options['blackbox'] ) ) if ( !blackbox.length || !blackbox.length )  flag = false;
        if ( (data.options['battery'] ) ) if ( !battery.length || !batteryPrice.length ) flag = false;
        if ( (data.options['afterblow'] ) ) if ( !afterblow.length || !afterblowPrice.length ) flag = false;
        if ( (data.options['soundproof'] ) ) if ( !soundproof.length || !soundproofPrice.length )  flag = false;
        if ( (data.options['wrapping'] ) ) if ( !wrapping.length || !wrappingPrice.length )  flag = false;
        if ( (data.options['glasscoating'] ) ) if ( !glasscoating.length || !glasscoatingPrice.length )  flag = false;
        if ( (data.options['bottomcoating'] ) ) if ( !bottomcoating.length || !bottomcoatingPrice.length )  flag = false;
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
        if ( data.options['tinting']  ) {
            data1['tinting'] = tinting , data1['tintingPrice'] = tintingPrice ;
        }
        if ( data.options['ppf']  ) {
            data1['ppf'] = ppf , data1['ppfPrice'] = ppfPrice ;
        }
        if ( data.options['blackbox']  ) {
            data1['blackbox'] = blackbox , data1['blackboxPrice'] = blackboxPrice ;
        }
        if ( data.options['battery']  ) {
            data1['battery'] = battery, data1['batteryPrice'] = batteryPrice ;
        }
        if ( data.options['afterblow']  ) {
            data1['afterblow'] = afterblow , data1['afterblowPrice'] = afterblowPrice;
        }
        if ( data.options['soundproof']  ) {
            data1['soundproof'] = soundproof , data1['soundproofPrice'] = soundproofPrice;
        }
        if ( data.options['wrapping']  ) {
            data1['wrapping'] = wrapping , data1['wrappingPrice'] = wrappingPrice;
        }
        if ( data.options['glasscoating']  ) {
            data1['glasscoating'] = glasscoating , data1['glasscoatingPrice'] = glasscoatingPrice;
        }
        if ( data.options['bottomcoating']  ) {
            data1['bottomcoating'] = bottomcoating , data1['bottomcoatingPrice'] = bottomcoatingPrice;
        }

        data1['totalPrice'] = getSum().toString() ;
        data1['carName'] = data.carName ;
        // 신차
        data1['kind'] = "NewCarPackage";
        
        const token = await fetch('auth');
        const auth = token.auth ;
        

        axios({
            method: 'post' ,
            url: `${server.url}/api/bidding`,
            data: {
                detail: JSON.stringify(data1) ,
                order_id: id 
            } ,
            headers: { Auth : auth }
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

    // 정규식 표현 
    function addComma(value){ 
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    // 콤마 제거
    function removeComma(value){
        return value.replaceAll(',','');
    }

    return(       
        data ? (        
        <Provider>
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
        <Appbar.Header style={{ backgroundColor: 'white' , elevation: 0 }}>
            <Appbar.BackAction onPress={() => { props.navigation.goBack() }}/>
            <Row>
                {/* <Avatar.Icon icon='car-arrow-left' color={colors.main} style={{ backgroundColor: 'transparent'}} /> */}
                <Title style={{ fontWeight: 'bold' , marginLeft: 20 , fontSize: 22 }}>{data.carName}</Title>
            </Row>
            <Badge size={ 28 } style={{ alignSelf: 'center' , marginLeft: 10 , backgroundColor: colors.main , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>신차</Badge>
            {
                data?.role == "DEALER" && <Badge size={ 28 } style={{ alignSelf: 'center' , marginLeft: 10 , backgroundColor: 'black' , color: 'white' , paddingLeft: 10 , paddingRight: 10 }}>딜러</Badge>
            }        
            </Appbar.Header>

        <Portal>
            <Modal visible={requesting} style={{ alignItems: 'center' , justifyContent: 'center' , backgroundColor: 'transparent' }} >
                <LottieView style={{ width: 200, height: 100 }} source={require('../Register/2.json')} autoPlay={true} loop={true}/>
            </Modal>
        </Portal>

            {/* <ButtonRow>
            {
                    picture == null ? 
                    (
                        <Image source={require('../../../resource/Loading.jpeg')} style={{ width: 40 , height: 40 , borderRadius: 10 , marginLeft: 10 }}/>
                    ):
                    (
                        <FastImage source = {{ uri : picture }} style={{ width: 40 , height: 40 , borderRadius: 10 , marginLeft: 10 }}  resizeMode='cover' />
                    )
            }
            <Title style={{ marginLeft: 20 , fontSize: 17 , fontWeight: 'bold' }}>{props.route.params.name}</Title>
            </ButtonRow> */}
            
            {/* <Divider style={{ height: 5 , backgroundColor: 'rgb(230,230,230)' }} /> */}

            <SwiperView 
            tabList={tabList} 
            tabBarStyles = {{ backgroundColor: colors.main , color: colors.main }}
            tabBarLineStyles={{ backgroundColor: 'transparent'  }} 
            tabHeaderStyles={{ backgroundColor: 'transparent' }}  
            tabButtonStyles={{ backgroundColor: 'transparent' }}
            tabButtonTextActiveStyles={{ color: colors.main }}
            tabButtonTextStyles={{ color: 'lightgray' }}
            />



            <List.Section style={{ marginTop: 10 }} >
                <List.Accordion title='요청사항확인' titleStyle={{ fontWeight: 'bold' }} style={{ backgroundColor: 'white' }} theme={{ colors: { primary: 'black' }}}>
                        <Text style={{ borderWidth:2 , padding: 10 , paddingTop: 20 , paddingBottom: 20 , borderColor: 'lightgray',fontSize: 17 }}>{data.require? data.require : '없음' }</Text>
                </List.Accordion>
            </List.Section>
           
            <List.Item title='지역' right={props => <Title>{translate('region',data.region)}</Title>}></List.Item>
            <List.Item title='최종가격' right={props => <Title>{getSum()} 만원</Title>}></List.Item>
            <Button color = { colors.main } 
                style={{ margin : 10 , marginTop: 20 , marginBottom: 20 }}
                labelStyle = {{ fontSize: 17 , color: 'white' }}
                onPress={ () => { checkRegister() }}
                mode='contained' 
                disabled={requesting}
            >
                    { requesting ? '입찰 중...' : '입찰하기'}
            </Button>
        </KeyboardAwareScrollView>
        </Provider>  
        )
        :
        <ActivityIndicator color={colors.main} style={{ marginTop: 20 }} /> 
    );
}