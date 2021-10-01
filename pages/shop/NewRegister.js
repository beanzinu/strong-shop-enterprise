import React from 'react' ;
import styled from 'styled-components';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
  } from '@gorhom/bottom-sheet';
import { Title , Appbar , Button , Text, TextInput } from 'react-native-paper';
import colors from '../../color/colors';
import axios from 'axios';
import { ScrollView } from 'react-native';
import { Image } from 'react-native';
import { Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const View = styled.View`
    flex : 1 ;
`;
const Row = styled.View`
    flex-direction: row;
    height: 130px ;
    margin-top: 10px;
`;
const TextView = styled.View`
    flex: 2 ;
`;

const styles = {
    title : {
        padding: 10 ,
        fontSize: 30 ,
        fontFamily: 'DoHyeon-Regular' ,
    } ,
    description : {
        fontSize: 17 , 
        margin: 10
    }

}

export default function() {
    const snapPoints = React.useMemo(() => ['75%'], []);
    const [businessNumber,setBusinessNumber] = React.useState('');
    const [openDate,setOpenDate] = React.useState('');
    const [bossName,setBossName] = React.useState('');
    const [bottomPage,setBottomPage] = React.useState(1);

    const bottomSheetModalRef = React.useRef(null);
    const handlePresentModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);
    const handleDismissModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);  

    const verify = () => {

        // Test ( 사업자 인증 성공 후 )
        Alert.alert('인증완료');
        setBottomPage(2);
        

        // 사업자등록 인증
        // axios({
        //     method: 'post' ,
        //     url :  'https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=Te7HPGFjEojhi4%2B4sRjikWXlBCD1Bg%2FAVQzCa9A4gUihNPh%2FRxaFkxk2IJ670MBNRDarlpFsPX67kda7XMXaLA%3D%3D' ,
        //     data : {
        //         businesses : [
        //             {
        //                 b_no : businessNumber ,
        //                 start_dt : openDate ,
        //                 p_nm : bossName ,
        //                 p_nm2 : '' ,
        //                 b_nm : '' ,
        //                 corp_no : '' ,
        //                 b_sector : '' ,
        //                 b_type : '' ,
        //             }
        //         ]
        //     }
        // })
        // .then( res =>   { 

        //     if(res.data.data[0].valid === '01')  {
        //         Alert.alert('인증완료');
        //     }
        //     else Alert.alert('유효하지 않은 번호입니다.','다시 한번 확인해주세요.');
        // }) 
        // .catch(e => Alert.alert('필수사항을 입력해주세요.') ) ;

    } ;

    return(
    <BottomSheetModalProvider >
        <View>
            <Appbar.Header style={{ backgroundColor: colors.main }}>
            <Appbar.Content title='최강샵 ？' titleStyle={{  fontFamily : 'DoHyeon-Regular' , fontSize: 30 }} />
            </Appbar.Header> 
            <ScrollView style={{ flex: 1   }}>
                <Row>
                    <Image style={{ flex: 1 , margin: 10 }} source={{uri : 'https://picsum.photos/200'}} />
                    <TextView>
                        <Title style={styles.title}>간편가입</Title>
                        <Text style={styles.description}>{'사업자등록번호와\n소셜 로그인을 통해 등록해보세요.'}</Text>
                    </TextView>
                </Row>

                <Row>
                    <Image style={{ flex: 1 , margin: 10 }} source={{uri : 'https://picsum.photos/100'}} />
                    <TextView>
                        <Title style={styles.title}>페이지관리</Title>
                        <Text style={styles.description}>{'샵 페이지를 간편하게\n커스터마이징 해보세요.'}</Text>
                        <Text style={{ color: 'gray', marginLeft: 10}}>*입찰때 고객들에게 제공됩니다.</Text>
                    </TextView>
                </Row>
                <Row>
                    <Image style={{ flex: 1 , margin: 10 }} source={{uri : 'https://picsum.photos/300'}} />
                    <TextView>
                        <Title style={styles.title}>입찰관리</Title>
                        <Text style={styles.description}>{'고객이 원하는 시공품목을\n확인하고 바로 입찰해보세요.'}</Text>
                    </TextView>
                </Row>
                <Row>
                    <Image style={{ flex: 1 , margin: 10 }} source={{uri : 'https://picsum.photos/400'}} />
                    <TextView>
                        <Title style={styles.title}>시공관리</Title>
                        <Text style={styles.description}>{'시공상황을 고객과\n간편하게 공유하고 소통해요.'}</Text>
                    </TextView>
                </Row>

                <Row>
                    <Image style={{ flex: 1 , margin: 10 }} source={{uri : 'https://picsum.photos/500'}} />
                    <TextView>
                        <Title style={styles.title}>고객관리</Title>
                        <Text style={styles.description}>{'시공 후 고객들의 리뷰를\n확인하고 바로 답장해요.'}</Text>
                    </TextView>
                </Row>

                
                

            </ScrollView>
            <Button mode='contained' color={colors.main} style={{ height: 50}} onPress={handlePresentModalPress}>등록하기</Button>



            {/* BottomSheet 모달  */}
            <BottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                // enablePanDownToClose={false}
            >
            <KeyboardAwareScrollView>
                {
                    bottomPage == 1 && (
                    <>
                    <Title style={styles.title}>나만의 샵을 등록해요. (1/2)</Title>
                    
                    <Text style={styles.description}>사업자등록번호</Text>
                    <TextInput theme={{  colors: { primary : colors.main }  }}
                        value={businessNumber}
                        onChangeText={value=>{setBusinessNumber(value)}}
                        keyboardType='number-pad'
                        placeholder='10자리를 입력하세요 (-없이) '
                    />
                    
                    <Text style={styles.description}>개업일자</Text>
                    <TextInput theme={{ colors: { primary : colors.main }  }}
                        value={openDate}
                        onChangeText={value=>{setOpenDate(value)}}
                        keyboardType='number-pad'
                        placeholder='YYYYMMDD (예) 2021년 9월 27일 -> 20210927'
                    />
                    <Text style={styles.description}>대표자성명</Text>
                    <TextInput theme={{ colors: { primary : colors.main , background: 'white' }  }}
                        value={bossName}
                        onChangeText={value=>{setBossName(value)}}
                        placeholder='홍길동'
                    />

                    <Button style={{ marginTop: 10 , height: 50 , justifyContent: 'center' }} 
                        onPress={() => {verify()}}
                        mode={businessNumber.length&&openDate.length&&bossName.length ? 'contained' : 'outlined'}  
                        color={colors.main}>
                        다음
                    </Button>
                    </>
                    )
                }
                {
                    bottomPage == 2 && (
                        <>
                            <Title style={styles.title}>간편하게 인증해보세요. (2/2)</Title>
                            <Button icon='chat' color='black' mode='outlined' 
                                style={{height: 50 , justifyContent: 'center' , margin: 15 }}
                            >
                                카카오로 로그인
                            </Button>
                            <Button icon='chat' color='black' mode='outlined' 
                                style={{height: 50 , justifyContent: 'center' , margin: 15 }}
                            >
                                네이버로 로그인
                            </Button>
                            <Button icon='google' color='black' mode='outlined' 
                                style={{height: 50 , justifyContent: 'center' , margin: 15 }}
                            >
                                구글로 로그인
                            </Button>
                        </>
                    )
                }
                
                </KeyboardAwareScrollView>
            </BottomSheetModal>
        </View>
    </BottomSheetModalProvider>
    );
}