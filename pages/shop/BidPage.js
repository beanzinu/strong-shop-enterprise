import React from 'react' ;
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { 
    Appbar , Title , Divider , 
    Card, List, Checkbox ,
    Button , Avatar, Paragraph,
    Provider , Portal , Modal ,
    DataTable , TextInput , Dialog ,
} 
from 'react-native-paper';
import { indexOf } from 'lodash';

const View = styled.SafeAreaView``;

const data = [
    {
        carName: '제네시스 G80' ,
        tint : true ,
        blackbox : true ,
        ppf : true ,
        glass : false ,
        seat : false ,
        etc : '가성비로 맞추고 싶어요!' ,
    } ,
    {
        carName: '기아 레이' ,
        tint : false ,
        blackbox : true ,
        ppf : true ,
        glass : true ,
        seat : false ,
        etc : '100만원 안쪽으로 부탁드려요.' ,
    } ,
    {
        carName: '쌍용 티볼리' ,
        tint : true ,
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

}


export default function () {
    const [modalData,setModalData]  = React.useState(data[0]);
    const [visible, setVisible] = React.useState(false);
    const [itemVisible,setItemVisible] = React.useState(false) ;

    const[price1,setPrice1] = React.useState(0) ;
    const[price2,setPrice2] = React.useState(0) ;
    const[price3,setPrice3] = React.useState(0) ;
    const[price4,setPrice4] = React.useState(0) ;
    const[price5,setPrice5] = React.useState(0) ;

    const showModal = (item) =>  {
        setModalData(item); 
        setVisible(true);
    }
    const hideModal = () => setVisible(false);

    const [dialog,setDialog] = React.useState(false);
    const showDialog = () => setDialog(true) ;
    const hideDialog = () => {setDialog(false) , hideModal()  }

    return (
    <Provider>
    <KeyboardAwareScrollView>
    <Portal>
        <Modal visible={visible} 
            onDismiss={hideModal} 
            contentContainerStyle={styles.containerStyle}
            dismissable={false}
        >
            <KeyboardAwareScrollView>
            <Button onPress={ hideModal } style={{ width : '30%' , alignSelf: 'flex-end'}}> 취소하기 </Button>
            <Title style={{ alignSelf : 'center' }}>- 고객 시공의뢰견적서 -</Title>
            <Divider/>
            <DataTable>
            {
                modalData.tint && (
                <>
                <DataTable.Title>틴팅</DataTable.Title>
                <DataTable.Header>
                    <DataTable.Title style={{ flex: 2 }}>제품명</DataTable.Title>
                    <DataTable.Title style={{ flex: 1 }}>가격</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                    <TextInput style={{ flex: 2 , paddingRight: 5 }} mode='outlined' placeholder='제품명을 입력하세요.'/>
                    <TextInput style={{ flex: 1  }} mode='outlined' right={<TextInput.Affix text='만원' />} 
                        value={price1} onChangeText={ value => setPrice1(value) }
                    />
                </DataTable.Row>
                </>
                )
            }
            {
                modalData.blackbox && (
                <>
                <DataTable.Title style={{ marginTop : 5 }}>블랙박스</DataTable.Title>
                <DataTable.Header>
                    <DataTable.Title style={{ flex: 2 }}>제품명</DataTable.Title>
                    <DataTable.Title style={{ flex: 1 }}>가격</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                    <TextInput style={{ flex: 2 , paddingRight: 5 }} mode='outlined' placeholder='제품명을 입력하세요.'/>
                    <TextInput style={{ flex: 1  }} mode='outlined' right={<TextInput.Affix text='만원' />} 
                        value={price2} onChangeText={ value => setPrice2(value) }
                    />
                </DataTable.Row> 
                </>
                )   
            }      
            {
                modalData.glass && (
                <>
                <DataTable.Title style={{ marginTop : 5 }}>유리막코팅</DataTable.Title>
                <DataTable.Header>
                    <DataTable.Title style={{ flex: 2 }}>제품명</DataTable.Title>
                    <DataTable.Title style={{ flex: 1 }}>가격</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                    <TextInput style={{ flex: 2 , paddingRight: 5 }} mode='outlined' placeholder='제품명을 입력하세요.'/>
                    <TextInput style={{ flex: 1  }} mode='outlined' right={<TextInput.Affix text='만원' />} 
                        value={price3} onChangeText={ value => setPrice3(value) }
                    />
                </DataTable.Row> 
                </>
                )   
            }      
            {
                modalData.seat && (
                <>
                <DataTable.Title style={{ marginTop : 5 }}>가죽코팅</DataTable.Title>
                <DataTable.Header>
                    <DataTable.Title style={{ flex: 2 }}>제품명</DataTable.Title>
                    <DataTable.Title style={{ flex: 1 }}>가격</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                    <TextInput style={{ flex: 2 , paddingRight: 5 }} mode='outlined' placeholder='제품명을 입력하세요.'/>
                    <TextInput style={{ flex: 1  }} mode='outlined' right={<TextInput.Affix text='만원' />} 
                        value={price4} onChangeText={ value => setPrice4(value) }
                    />
                </DataTable.Row> 
                </>
                )   
            }      
            {
                modalData.ppf && (
                <>
                <DataTable.Title style={{ marginTop : 5 }}>PPF</DataTable.Title>
                <DataTable.Header>
                    <DataTable.Title style={{ flex: 2 }}>제품명</DataTable.Title>
                    <DataTable.Title style={{ flex: 1 }}>가격</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                    <TextInput style={{ flex: 2 , paddingRight: 5 }} mode='outlined' placeholder='제품명을 입력하세요.'/>
                    <TextInput style={{ flex: 1  }} mode='outlined' right={<TextInput.Affix text='만원' />} 
                        value={price5} onChangeText={ value => setPrice5(value) }
                    />
                </DataTable.Row> 
                </>
                )   
            }      
            </DataTable>
            <Divider style={{ marginTop : 30 }}/>
            <TextInput mode='outlined' label='비고' placeholder='최선을 다하겠습니다.' multiline={true}/>
            <Title style={{ fontSize: 30 , marginTop: 20 , alignSelf: 'center' }}>
                {`최종가격:${parseInt(price1)+parseInt(price2)+parseInt(price3)+parseInt(price4)+parseInt(price5) }만원`}
            </Title>
            <Divider/>
            <Button icon='cash' mode='contained' onPress={ () => {showDialog()} } >최종입찰하기</Button>
            <Portal>
                <Dialog visible={dialog} onDismiss={hideDialog}>
                <Dialog.Title>최종입찰</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>입찰하시겠습니까?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialog(false)}>취소</Button>
                    <Button onPress={hideDialog}>입찰</Button>
                </Dialog.Actions>
                </Dialog>
            </Portal>
            </KeyboardAwareScrollView>
        </Modal>
    </Portal>
    
    <Appbar.Header>
        <Appbar.Content title="최강샵" titleStyle={{ alignSelf: 'center'}} />
        <Appbar.Action icon="bell-outline" onPress={() => {}} />
        <Appbar.Action icon="cog-outline" onPress={() => {}} />
    </Appbar.Header>   
    <Title style={{ fontWeight: 'bold' , fontSize: 25 , padding: 10 }}>
        {` 현재 ${data.length}건의\n 입찰요청이 있습니다.`}
    </Title>
    <Divider/>
    {
        data.map( (item,i) => {
                return (
                    // <Card key={i} mode='elevated' style={{  borderTopWidth : 1 , borderTopColor: 'black' }}>
                    //     <Card.Title 
                    //         title= {item.carName} 
                    //         right={(props) => <Button icon='account-cash' onPress={ () => showModal(item) }>입찰하기</Button>}
                    //         left={(props) => <Button icon='chevron-down' onPress={ () => { setItemVisible(!itemVisible) } } /> }
                    //         style={{ borderBottomWidth: 1 , fontWeight: 'bold' }}
                    //     />
                    //     { itemVisible ? (<></>) : (
                    //     <> 
                    //      { item.tint && <Checkbox.Item label="틴팅" status="checked" /> }
                    //      {item.blackbox && <Checkbox.Item label="블랙박스" status="checked" />}
                    //      {item.ppf && <Checkbox.Item label="PPF" status="checked" />}
                    //      {item.glass && <Checkbox.Item label="유리막코팅" status="checked" />} 
                    //      {item.seat && <Checkbox.Item label="가죽코팅" status="checked" />}
                    //      <Paragraph style={{ padding : 10 }}>요청사항 : {item.etc}</Paragraph>
                    //     </>
                    //     )
                    //     }
                    // </Card>
                    <List.Section key={i} >
                          <List.Accordion
                            title={item.carName}
                            style={{ borderWidth: 1 , borderColor : 'lightgray' }}
                            titleStyle= {{ fontWeight : 'bold' }}
                            description='자세한 정보를 확인하세요.'
                            left={props => <List.Icon {...props} icon="car-hatchback" color='red' />}>
                            <List.Subheader style={{ color:'black' , fontWeight: 'bold' }}>요청옵션</List.Subheader>
                            { item.tint && <List.Item title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline'/>} /> }
                            {item.blackbox && <List.Item title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline'/>} />}
                            {item.ppf && <List.Item title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline'/>} />}
                            {item.glass && <List.Item title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline'/>} />} 
                            {item.seat && <List.Item title ='가죽코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline'/>} />}
                            <Divider/>
                            <List.Item 
                                right={(props) => <Button icon='account-cash' mode='outlined' onPress={ () => showModal(item) } style={{ height: 40 }} >입찰하기</Button>}
                                title='요청사항:' description={item.etc} left={props => <List.Icon {...props} icon='clipboard-check-outline'/>}  />
                          </List.Accordion>
                    </List.Section>
                    
                ) ; 
            }
        )
    }
    </KeyboardAwareScrollView>  
    </Provider>
    );
}