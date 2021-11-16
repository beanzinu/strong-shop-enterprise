import React from 'react' ;
import styled from 'styled-components';
import { Title , IconButton , Button , TextInput, Avatar , Chip , List } from 'react-native-paper';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../../color/colors';
import { Alert } from 'react-native';
import Collapsible from 'react-native-collapsible';
import _, { after } from 'lodash';
import fetch from '../../../storage/fetch';
import server from '../../../server/server';

const Container = styled.SafeAreaView``;
const Text = styled.Text``;
const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;
// const TextInput = styled.TextInput`
//     width: 90% ;
//     height: 50px;
//     margin: 10px;
//     padding: 10px;
//     border: 1px lightgray;
//     border-radius: 10px;
// `;


const styles= {
    title : {
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30 ,
        margin: 10 ,
        marginTop: 20 ,
        marginBottom: 20 , 
        color: colors.main,
    } ,
    label : {
        margin: 10 ,
        fontFamily : 'DoHyeon-Regular' , 
        paddingTop: 10 ,
        fontSize: 25
    } ,
    theme : { 
        colors : {
            underlineColor : colors.main ,
            primary : colors.main ,
            background: 'white' ,
        }
    } ,
    chipStyle : {
        backgroundColor: 'rgb(220,220,220)',
        margin : 3
    } ,
    chipTextStyle : {
    } , 
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

export default function( props ) {
    const [data,setData] = React.useState({}) ;
    const [id,setId] = React.useState('');
    const [tinting,setTinting] = React.useState('');
    const [tintingPrice,setTintingPrice] = React.useState('');
    const [ppf,setPpf] = React.useState('');
    const [ppfPrice,setPpfPrice] = React.useState(0);
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
    const [undercoating,setUndercoating] = React.useState('');
    const [undercoatingPrice,setUndercoatingPrice] = React.useState('');
    
    const getSum = () => {
        return Number(tintingPrice) + Number(ppfPrice) + Number(blackboxPrice) + Number(batteryPrice) + Number(afterblowPrice) + Number(soundproofPrice) + Number(wrappingPrice) + Number(glasscoatingPrice) + Number(undercoatingPrice) ;
    }


    React.useEffect(() => {
    
        // BidPage 에서 data를 받아옴
        setData( props.route.params.data ) ;
        setId ( props.route.params.id) ;


    },[]);
    
    checkInput = () => {
        flag = true ;
        if ( (data.options['tinting']) ) if ( !tinting.length ) flag = false;
        if ( (data.options['ppf']) ) if ( !ppf.length ) flag = false;
        if ( (data.options['blackbox'] ) ) if ( !blackbox.length )  flag = false;
        if ( (data.options['battery'] ) ) if ( !battery.length ) flag = false;
        if ( (data.options['afterblow'] ) ) if ( !afterblow.length ) flag = false;
        if ( (data.options['soundproof'] ) ) if ( !soundproof.length )  flag = false;
        if ( (data.options['wrapping'] ) ) if ( !wrapping.length )  flag = false;
        if ( (data.options['glasscoating'] ) ) if ( !glasscoating.length )  flag = false;
        if ( (data.options['undercoating'] ) ) if ( !undercoating.length )  flag = false;
        return flag ;
    }

    checkRegister = () => {
        // 모든 TextInput들이 입력되었을 때 입찰여부를 물어봄.
        flag = checkInput();
        // true
        if ( flag )
        Alert.alert('입찰하시겠습니까?','',[
            {
                text: '확인',
                onPress: () => { requestBidding() }
            },
            {
                text: '취소'
            }
        ])
        //false
        else
            Alert.alert('입찰정보를 모두 입력해주세요.');
    }

    async function requestBidding() {
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
        if ( data.options['undercoating']  ) {
            data1['undercoating'] = undercoating , data1['undercoatingPrice'] = undercoatingPrice;
        }

        data1['totalPrice'] = getSum().toString() ;
        data1['carName'] = data.carName ;
        
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
                props.navigation.goBack();
            }
            else {
                Alert.alert('다시 시도해주세요.')
            }
        })
        .catch ( e =>  {

        })

        
    }


    return(                  
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
            <Row style={{ borderBottomWidth: 1 , borderBottomColor: 'gray' }}>
                <Avatar.Icon icon='car-arrow-left' color='red' style={{ backgroundColor: 'transparent'}} />
                <Title style={{ ...styles.title  }}>{data.carName}</Title>
            </Row>
            {
                data?.options?.tinting && (
                    <>
                    <Title style={styles.label}>틴팅</Title>
                    <Row>
                        {
                             _.map(data.options.detailTinting,(value,key) => { 
                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('tinting',key) }</Chip>  
                            })
                        }
                    </Row>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.tintingPrice.focus() }}
                        value={tinting}
                        onChangeText={value=>{ setTinting(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.tintingPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                        value={tintingPrice}
                        onChangeText={value=>{ setTintingPrice(value) }}
                    />
                    </>
                )
            }
            {
                data?.options?.ppf && (
                    <>
                    <Title style={styles.label}>PPF</Title>
                    <Row>
                        {
                             _.map(data.options.detailPpf,(value,key) => { 
                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('ppf',key) }</Chip>  
                            })
                        }
                    </Row>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.ppfPrice.focus() }}
                        value={ppf}
                        onChangeText={value=>{ setPpf(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.ppfPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                        value={ppfPrice}
                        onChangeText={value=>{ setPpfPrice(value) }}
                    />
                    </>
                )
            }
            {
                data?.options?.blackbox && (
                    <>
                    <Title style={styles.label}>블랙박스</Title>
                    <Row>
                        {
                             _.map(data.options.detailBlackbox,(value,key) => { 
                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('blackbox',key) }</Chip>  
                            })
                        }
                    </Row>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.blackboxPrice.focus() }}
                        value={blackbox}
                        onChangeText={value=>{ setBlackbox(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.blackboxPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                        value={blackboxPrice}
                        onChangeText={value=>{ setBlackboxPrice(value) }}
                    />
                    </>
                )
            }
            {
                data?.options?.battery && (
                    <>
                    <Title style={styles.label}>보조배터리</Title>
                    <Row>
                        {
                             _.map(data.options.detailBattery,(value,key) => { 
                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('battery',key) }</Chip>  
                            })
                        }
                    </Row>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.batteryPrice.focus() }}
                        value={battery}
                        onChangeText={value=>{ setBattery(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.batteryPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                        value={batteryPrice}
                        onChangeText={value=>{ setBatteryPrice(value) }}
                    />
                    </>
                )
            }
            {
                data?.options?.afterblow && (
                    <>
                    <Title style={styles.label}>애프터블로우</Title>
                    <Row>
                        {
                             _.map(data.options.detailAfterblow,(value,key) => { 
                                    if (key == 'ETC' && value != null && value.length != 0  ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('afterblow',key) }</Chip>  
                            })
                        }
                    </Row>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.afterblowPrice.focus() }}
                        value={afterblow}
                        onChangeText={value=>{ setAfterblow(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.afterblowPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                        value={afterblowPrice}
                        onChangeText={value=>{ setAfterblowPrice(value) }}
                    />
                    </>
                )
            }
            {
                data?.options?.soundproof && (
                    <>
                    <Title style={styles.label}>방음</Title>
                    <Row>
                        {
                             _.map(data.options.detailSoundproof,(value,key) => { 
                                    if (key == 'ETC' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('soundproof',key) }</Chip>  
                            })
                        }
                    </Row>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.soundproofPrice.focus() }}
                        value={soundproof}
                        onChangeText={value=>{ setSoundproof(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.soundproofPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                        value={soundproofPrice}
                        onChangeText={value=>{ setSoundproofPrice(value) }}
                    />
                    </>
                )
            }
            {
                data?.options?.wrapping && (
                    <>
                    <Title style={styles.label}>랩핑</Title>
                    <Row>
                        {
                             _.map(data.options.detailWrapping,(value,key) => { 
                                    if (key == 'DESIGN' && value != null && value.length != 0 ) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{value}</Chip> 
                                    if(value) return <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>{translate('soundproof',key) }</Chip>  
                            })
                        }
                    </Row>
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.wrappingPrice.focus() }}
                        value={wrapping}
                        onChangeText={value=>{ setWrapping(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.wrappingPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                        value={wrappingPrice}
                        onChangeText={value=>{ setWrappingPrice(value) }}
                    />
                    </>
                )
            }
            {
                data?.options?.glasscoating && (
                    <>
                    <Title style={styles.label}>유리막코팅</Title>
                    
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.glasscoatingPrice.focus() }}
                        value={glasscoating}
                        onChangeText={value=>{ setGlasscoating(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.glasscoatingPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                        value={glasscoatingPrice}
                        onChangeText={value=>{ setGlasscoatingPrice(value) }}
                    />
                    </>
                )
            }
            {
                data?.options?.undercoating && (
                    <>
                    <Title style={styles.label}>언더코팅</Title>
                    
                    <TextInput placeholder='제품명' theme={styles.theme}
                        style={{ backgroundColor: 'white' , marginTop: 10 }}
                        onSubmitEditing={ () => { this.undercoatingPrice.focus() }}
                        value={undercoating}
                        onChangeText={value=>{ setUndercoating(value) }}
                    />
                    <TextInput placeholder='가격' 
                        ref= { (input) =>{this.undercoatingPrice = input }}
                        keyboardType='number-pad'
                        theme={styles.theme}
                        style={{ backgroundColor: 'white' }}
                        right={<TextInput.Affix text='만원'/>}
                        value={undercoatingPrice}
                        onChangeText={value=>{ setUndercoatingPrice(value) }}
                    />
                    </>
                )
            }
            <List.Section style={{ marginTop: 10 }} >
                <List.Accordion title='요청사항확인' theme={{ colors: { primary: colors.main }}} >
                        <Text style={{ borderWidth:1 , padding: 10 , borderColor: 'lightgray' }}>{data.require}</Text>
                </List.Accordion>
            </List.Section>
           
            <List.Item title='지역' right={props => <Title>{translate('region',data.region)}</Title>}></List.Item>
            <List.Item title='최종가격' right={props => <Title>{getSum()}만원</Title>}></List.Item>
            <Button color = { colors.main } 
                style={{ margin : 3 , marginTop: 20 , marginBottom: 20 }}
                labelStyle = {{ fontSize: 17 }}
                onPress={ () => { checkRegister() }}
                mode='contained' >
                    입찰하기
            </Button>
        </KeyboardAwareScrollView>
    );
}