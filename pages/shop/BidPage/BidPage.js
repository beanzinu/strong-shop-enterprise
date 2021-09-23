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
import colors from '../../../color/colors';

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

function Item ( {i , item , navigation } ) {
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
                            <List.Subheader style={{ color:'black' , fontWeight: 'bold' }}>요청옵션</List.Subheader>
                            { item.tint && <List.Item title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline'/>} /> }
                            {item.blackbox && <List.Item title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline'/>} />}
                            {item.ppf && <List.Item title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline'/>} />}
                            {item.glass && <List.Item title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline'/>} />} 
                            {item.seat && <List.Item title ='가죽코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline'/>} />}
                            <Divider/>
                            <List.Item 
                                right={(props) => 
                                <Button icon='account-cash' mode='outlined' color={colors.main}
                                mode='contained' 
                                onPress={ () => { navigation.navigate('BidRegister',{ data : item }) } } 
                                style={{ height : '100%' , padding: 10 , borderColor: 'white' }} labelStyle={{ fontSize: 15 }} >
                                    입찰하기
                                </Button>}
                                titleStyle={{ fontWeight: 'bold' }}
                                title='요청사항:' description={item.etc} left={props => <List.Icon {...props} icon='clipboard-check-outline'/>}  />
                          </List.Accordion>
                    </List.Section>
    )
}


export default function ( props ) {


    return (
    <Provider>
    <KeyboardAwareScrollView>    
        <Appbar.Header style={{ backgroundColor: colors.main }}>
            <Appbar.Content title="최강샵" titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 30}} />
            <Appbar.Action icon="bell-outline" onPress={() => {}} />
            <Appbar.Action icon="cog-outline" onPress={() => {}} />
        </Appbar.Header>   
        <Title style={{ fontWeight: 'bold' , fontSize: 35 , padding: 10 , fontFamily : 'DoHyeon-Regular' , marginTop: 10 }}>
            {` 현재 ${data.length}건의\n 입찰요청이 있습니다.`}
        </Title>
        <Divider/>
        {
            data.map( (item,i) => {
                    return (
                    <Item item={item} i={i} navigation={props.navigation} />
                    )
                }
            )
        }
    </KeyboardAwareScrollView>  
    </Provider>
    );
}