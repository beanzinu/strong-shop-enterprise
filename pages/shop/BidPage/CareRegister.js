import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Appbar , Title , Badge, IconButton , TextInput , Chip , List , Button , ActivityIndicator} from 'react-native-paper';
import { FlatList , Image , ScrollView  , Text } from 'react-native';
import Swiper from 'react-native-swiper';
import styled from 'styled-components';
import colors from '../../../color/colors';
import Collapsible from 'react-native-collapsible';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';

const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;
const View = styled.View``;
const SwiperView = styled.View`
    width: 100%;
    height: 350px;
`;
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
    border: 2px rgb(240,240,240);  
    margin: 10px;
    margin-left: 20px;
    margin-right: 20px;
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

const RenderItem = ({ key , item }) => {
    return(
        <View key={key} style={{ width: '100%' , height: 300 , margin: 1 }}>
            <FastImage resizeMode='stretch' source={{ uri: item.imageUrl }} style={{ width: '100%' , height: '100%'}} />
            <Text style={{ margin : 10 , fontSize: 15 }}>{ item.comment ? item.comment : "" } </Text>
        </View>
    );
}

export default function CareRegister( props ){
    const [loading,setLoading] = React.useState(true);
    const [data,setData] = React.useState(null);
    const [images,setImages] = React.useState(null);
    const [collapsed,setCollapsed] = React.useState(true);
    const [requesting,setRequesting] = React.useState(false);
    // const [index,setIndex] = React.useState(0);
    // const [option,setOption] = React.useState('세차');
    // const [optionList,setOptionList] = React.useState([]);
    const viewRef = React.useRef(null);

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

    React.useEffect(() =>  {
        setTimeout(() => {
            viewRef.current?.scrollToEnd()
        },500);
    },[ collapsed ]);

    React.useEffect(() => {
        setData( props.route.params.data,
            setImages( props.route.params.imageUrls ) ,
            setLoading(false)
        );

    },[]);
    


    return(
            loading ? <ActivityIndicator color={colors.main} style={{ marginTop: 20 }} /> :
        (
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
            <Badge size={ 28 } style={{ alignSelf: 'center' , marginLeft: 10 , backgroundColor: colors.care , color: 'white' }}>케어</Badge>
            <Badge size={ 28 } style={{ alignSelf: 'center' , marginLeft: 10 , backgroundColor: 'black' , color: 'white' }}>딜러</Badge>
        </Appbar.Header>

        <ImageView style={{ marginTop: 20}}>
        <Swiper>
            {
                images.map( item => {
                    return <RenderItem key={item.id} item={item}/> 
                })
            }
        </Swiper>
        </ImageView>

        <RowButton onPress={() => {setCollapsed(!collapsed)}} >
            <IconButton icon='pencil' color={collapsed ? 'black': 'lightgray'} />
            <Title style={{ ...styles.label , color: collapsed ? 'black' : 'lightgray' }}>견적 작성하기</Title>
            <IconButton icon={ collapsed ? 'chevron-down' : 'chevron-up' } color={collapsed ? 'black': 'lightgray'}  style={{ position: 'absolute' , right: 0  }}/>
        </RowButton>
        <Collapsible collapsed={collapsed}>

        {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            { data.options.carWash && <Chip onPress={() => handleSwiper('세차')} style={ option == '세차' ?  styles.optionChipStyle : styles.unOptionChipStyle } textStyle={ option == '세차' ? styles.optionChipTextStyle : styles.unOptionChipTextStyle }>{'세차'}</Chip>}
            { data.options.inside && <Chip onPress={() =>handleSwiper('내부')} style={ option == '내부' ?  styles.optionChipStyle : styles.unOptionChipStyle } textStyle={ option == '내부' ? styles.optionChipTextStyle : styles.unOptionChipTextStyle }>{'내부'}</Chip>}
            { data.options.outside && <Chip onPress={() => handleSwiper('외부')} style={ option == '외부' ?  styles.optionChipStyle : styles.unOptionChipStyle } textStyle={ option == '외부' ? styles.optionChipTextStyle : styles.unOptionChipTextStyle }>{'외부'}</Chip>}
            { data.options.scratch && <Chip onPress={() => handleSwiper('스크레치')} style={ option == '스크레치' ?  styles.optionChipStyle : styles.unOptionChipStyle } textStyle={ option == '스크레치' ? styles.optionChipTextStyle : styles.unOptionChipTextStyle }>{'스크레치'}</Chip>}
            { data.options.etc && <Chip onPress={() => handleSwiper('기타')} style={ option == '기타' ?  styles.optionChipStyle : styles.unOptionChipStyle } textStyle={ option == '기타' ? styles.optionChipTextStyle : styles.unOptionChipTextStyle }>{'기타'}</Chip>}
        </ScrollView> */}

        <SwiperView>
        <ScrollableTabView 
            tabBarTextStyle={{ fontSize: 15 }}
            tabBarActiveTextColor={colors.main} tabBarInactiveTextColor='rgb(220,220,220)' tabBarUnderlineStyle={{ backgroundColor: colors.main }}
        >
        {
            data?.options?.carWash && (
                    <SwiperView tabLabel='세차'>
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
                        // value={carWashPrice}
                        onChangeText={value=>{ setCarWashPrice(value) }}
                    />
                    </MenuView>
                    </SwiperView>
                )
            }
        {
            data?.options?.inside && (
                    <SwiperView tabLabel='내부'>
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
                        // value={insidePrice}
                        onChangeText={value=>{ setInsidePrice(value) }}
                    />
                    </MenuView>
                    </SwiperView>
                )
            }
        {
            data?.options?.outside && (
                    <SwiperView tabLabel='외부'>
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
                        // value={outsidePrice}
                        onChangeText={value=>{ setOutsidePrice(value) }}
                    />
                    </MenuView>
                    </SwiperView>
                )
            }
        {
            data?.options?.scratch && (
                    <SwiperView tabLabel='스크레치'>
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
                        // value={scratchPrice}
                        onChangeText={value=>{ setScratchPrice(value) }}
                    />
                    </MenuView>
                    </SwiperView>
                )
        }
        {
            data?.options?.etc && (
                    <SwiperView tabLabel='기타' >
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
                        // value={etcPrice}
                        onChangeText={value=>{ setEtcPrice(value) }}
                    />
                    </MenuView>
                    </SwiperView>
                )
            }
        
        </ScrollableTabView>
        </SwiperView>

        <List.Item style={{ marginTop: 30 }} title='지역' right={props => <Title>{data.region}</Title>}></List.Item>
        <List.Item title='최종가격' right={props => <Title>{getSum()} 만원</Title>}></List.Item>
        <Button color = { colors.main } 
            style={{ margin : 10 , marginTop: 20 , marginBottom: 50 }}
            labelStyle = {{ fontSize: 17 , color: 'white' }}
            onPress={ () => {  }}
            mode='contained' 
            disabled={requesting}
        >
                { requesting ? '입찰 중...' : '입찰하기'}
        </Button>
        </Collapsible>

        </KeyboardAwareScrollView>
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