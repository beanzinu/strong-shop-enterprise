import React from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import { Button , Avatar , Card , IconButton , Menu , Provider , Drawer } from 'react-native-paper';
import colors from '../../../color/colors';
import { Alert, FlatList, RefreshControl } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
  } from '@gorhom/bottom-sheet';
import fetch from '../../../storage/fetch';

const Row = styled.View`
    flex-direction: row;
`;
const View = styled.SafeAreaView`
`;

const AddButton = styled.TouchableOpacity`
    width: 100px;
    height: 50px;
    border:1px ${colors.main};
    border-radius: 10px;
    margin: 10px;
    background-color: ${colors.main};

    align-self: flex-end;
    align-items: center;
    justify-content: center;
`;
const Text = styled.Text`
    padding: 5px ;
    font-weight: bold;
    font-size: 17px;
`;
const SubText = styled.Text`
    padding : 5px ; 
`;


const styles = {
    button : {
        alignSelf: 'flex-start' , 
        height: 45 ,
        borderWidth : 1 ,
        borderColor : 'lightgray' ,
        margin : 5 , 
        flex : 1
    }  , 
    modalButton : {
        height: 50 ,
        width: '100%',
    }
} ;


const options = [
    { name : '틴팅'} ,
    { name : 'PPF'} ,
    { name : '블랙박스'} ,
    { name : '보조배터리'} ,
    { name : '애프터블로우'} ,
    { name : '방음'} ,
    { name : '랩핑'} ,
    { name : '유리막코팅'} ,
    { name : '언더코팅'} ,
    { name : '기타'} ,
];

export default function( props ){
    const[value,setValue] = React.useState(1);
    const[data,setData] = React.useState([]);
    const[currentData,setCurrentData] = React.useState({});

    const snapPoints = React.useMemo(() => ['25%'], []);

    const bottomSheetModalRef = React.useRef(null);
    const handlePresentModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);
    const handleDismissModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);  

    // FlatList Item
    const RenderItem= ({item}) =>  {
        return(
                <Card>
                <Card.Content>
                    <Row style= {{ alignItems: 'center' }}>
                        <Text>{item.name}</Text>
                        <IconButton icon='dots-horizontal' 
                            color='black'
                            size={24}
                            style={{ position: 'absolute' , right: 0}}
                            onPress={() => {
                                handlePresentModalPress();
                                // 현재 누른 항목의 데이터를 넘기기 위함.
                                setCurrentData({ name : item.name , description: item.description});
                            }} 
                        />
                    </Row>
                </Card.Content>
                </Card>
        )
    }
    
    React.useEffect(() => {
        // 'Product' 데이터를 모두 가져옴.
        setData( props.route.params.data );
    },[]);

    const reload = React.useCallback( () =>  {
        
        setTimeout( async ()=>{
            await fetch('Product')
            .then(res => {
                setData(res);
            })
            .catch(() => { alert('추가하기 실패') })
        },2000);
        
        
    },[]);

    const add = (data) =>  {
        let option = 'tinting' ;
        if ( value == 1 ) option='tinting' ;
        else if ( value == 2 ) option='ppf' ;
        else if ( value == 3 ) option='blackbox' ;
        else if ( value == 4 ) option='battery' ;
        else if ( value == 5 ) option='afterblow' ;
        else if ( value == 6 ) option='defeaning' ;
        else if ( value == 7 ) option='wrapping' ;
        else if ( value == 8 ) option='glasscoating' ;
        else if ( value == 9 ) option='undercoating' ;
        else if ( value == 10 ) option='etc' ;
        
        props.navigation.navigate('ProductDetailRegister',{ data : currentData , option : option , reload : reload });
    }

   

    return(
        <BottomSheetModalProvider>
        <View>
            <ScrollView horizontal={true} style={{ height : 70}} showsHorizontalScrollIndicator={false}>
                {
                    options.map((item,i)=>{
                        return(
                            <Button key={i} style={styles.button} color={colors.main} onPress={ () => { setValue(i+1) }} mode = { value == i+1 && 'contained'}>
                                {item.name}
                            </Button>
                        )
                    })
                }
            </ScrollView>    
            
            <AddButton onPress={add}>
                <Text style={{ color: 'white' }}>추가하기</Text>
            </AddButton>  

            {/* 1. 틴팅 ~ 10. 기타 */}
            { value ==1 && 
                <FlatList
                    data={data?.tinting}
                    renderItem={RenderItem}
                    keyExtractor={(item) => {item.name}}
                />
            }
            { value ==2 && 
                <FlatList
                    data={data?.ppf}
                    renderItem={RenderItem}
                    keyExtractor={(item) => {item.name} }
                />
            }
            { value ==3 && 
                <FlatList
                    data={data?.blackbox}
                    renderItem={RenderItem}
                    keyExtractor={(item) => {item.name} }
                />
            }
            { value ==4 && 
                <FlatList
                    data={data?.battery}
                    renderItem={RenderItem}
                    keyExtractor={(item) => {item.name} }
                />
            }
            { value ==5 && 
                <FlatList
                    data={data?.afterblow}
                    renderItem={RenderItem}
                    keyExtractor={(item) => {item.name} }
                />
            }
            { value ==6 && 
                <FlatList
                    data={data?.defeaning}
                    renderItem={RenderItem}
                    keyExtractor={(item) => {item.name} }
                />
            }
            { value ==7 && 
                <FlatList
                    data={data?.wrapping}
                    renderItem={RenderItem}
                    keyExtractor={(item) => {item.name} }
                />
            }
            { value ==8 && 
                <FlatList
                    data={data?.glasscoating}
                    renderItem={RenderItem}
                    keyExtractor={(item) => {item.name} }
                />
            }
            { value ==9 && 
                <FlatList
                    data={data?.undercoating}
                    renderItem={RenderItem}
                    keyExtractor={(item) => {item.name} }
                />
            }
            { value ==10 && 
                <FlatList
                    data={data?.etc}
                    renderItem={RenderItem}
                    keyExtractor={(item) => {item.name} }
                />
            }
            
            
            <BottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: 'rgb(240,240,240)'}}
            >
                <View>
                        <Button style={styles.modalButton} color='black'
                            labelStyle={{ fontSize: 20 }}
                            contentStyle={{ justifyContent: 'flex-start' , paddingTop: 10}}
                            onPress={ () => { 
                                add()
                                handleDismissModalPress()
                            }}
                        >
                            🔧    수정
                        </Button>
                        <Button style={styles.modalButton} color='black'
                            labelStyle={{ fontSize: 20 }}
                            contentStyle={{ justifyContent: 'flex-start' , paddingTop: 10 }}
                            onPress={() => { Alert.alert('삭제하시겠습니까?','',
                            [
                                {
                                    text : '확인' ,
                                    onPress : () =>  {
                                        handleDismissModalPress()
                                    }
                                } ,
                                {
                                    text : '취소' ,
                                    onPress : () =>  {
                                        handleDismissModalPress()
                                    }
                                }
                            ]
                            ) }}
                        >
                            ❌    삭제
                        </Button>                
                </View>
            </BottomSheetModal>

        </View>
        </BottomSheetModalProvider>
    )
}