import React from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import { Button , Avatar , Card , IconButton , Menu , Provider , Drawer } from 'react-native-paper';
import colors from '../../../color/colors';
import { Alert, FlatList } from 'react-native';
import { random } from 'lodash';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
  } from '@gorhom/bottom-sheet';

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
                                setCurrentData({ name : item.name , description: item.description});
                            }} 
                        />
                    </Row>
                </Card.Content>
                </Card>
        )
    }
    
    React.useEffect(() => {
        setData( props.route.params.data );
    },[]);

    const add = () =>  {
        props.navigation.navigate('ProductDetailRegister');
    }

    return(
        <BottomSheetModalProvider>
        <View>
        <ScrollView horizontal={true} style={{ height : 70}} showsHorizontalScrollIndicator={false}>
            <Button icon='car-cog' style={ styles.button }
                    color={ colors.main }
                    onPress={ () => {  setValue(1) }}
                    mode= { value == 1 && 'contained' }
            >
            틴팅
            </Button>
            <Button icon='car-cog' style={ styles.button }
                    color={ colors.main }
                    onPress={ () => { setValue(2) }}
                    mode= { value == 2 && 'contained' }
            >
            블랙박스      
            </Button>
            <Button icon='car-cog' style={ styles.button }
                    color={ colors.main }
                    onPress={ () => { setValue(3) }}
                    mode= { value == 3 && 'contained' }
            >
            PPF       
            </Button>
            <Button icon='car-cog' style={ styles.button }
                    color={ colors.main }
                    onPress={ () => { setValue(4) }}
                    mode= { value == 4 && 'contained' }
            >
            유리막코팅      
            </Button>
         </ScrollView>      
         <AddButton onPress={add}>
             <Text style={{ color: 'white' }}>추가하기</Text>
         </AddButton>  
         <FlatList
            data={data}
            renderItem={RenderItem}
            keyExtractor={(item) => {random()%1000} }
         />
         
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
                            props.navigation.navigate('ProductDetailRegister',{ data : currentData})
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