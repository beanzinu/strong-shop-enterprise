import React from 'react';
import { DataTable , Title , Card , Button } from 'react-native-paper';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Collapsible from 'react-native-collapsible';

const styles = {
    title : {
        fontWeight: 'bold' ,
        color : 'rgb(89,13,229)' ,
    } ,
    button : {
        alignSelf: 'flex-end' , 
        padding : 5 ,
        height: 45 ,
    }
} ;

const Row = styled.View`
    flex-direction: row;
`;
const Text = styled.Text`
    padding: 5px ;
    font-weight: bold;
`;
const SubText = styled.Text`
    padding : 5px ; 
    border : 1px lightgray;
`;

const data = {
    name : '솔라가드 NR SMOKE 5' ,
    cost : 150000 ,
    description : ' 가시광선 투과율 : 3% / 자외선 차단율 : 99% / 총 태양에너지 차단율 : 64% ' 
}
  
const tmp = [
    {
       name : '솔라가드 NR SMOKE 5' ,
       price : 150000 ,
       description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% 가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
    } ,
    {
       name : '솔라가드 NR SMOKE 7' ,
       price : 320000 ,
       description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
    } ,
    {
       name : '솔라가드 NR SMOKE 5' ,
       price : 150000 ,
       description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% 가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
    } ,
    {
       name : '솔라가드 NR SMOKE 7' ,
       price : 320000 ,
       description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
    } ,
    {
       name : '솔라가드 NR SMOKE 5' ,
       price : 150000 ,
       description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% 가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
    } ,
    {
       name : '솔라가드 NR SMOKE 7' ,
       price : 320000 ,
       description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
    } ,
    {
       name : '솔라가드 NR SMOKE 5' ,
       price : 150000 ,
       description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% 가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
    } ,
    {
       name : '솔라가드 NR SMOKE 7' ,
       price : 320000 ,
       description : '가시광선 투과율 : 3% / 자외선 차단율 : 99% ...'
    } ,
] ;

export default function() {
    const [test,setTest] = React.useState(false);
    const [value,setValue] = React.useState(1);

    const [tinting,setTinting] = React.useState([]);
    loadList = ( value ) =>  {
      
         // 로드 후 
         setTinting(tmp) ;

    }
    React.useEffect( () =>  {
        setTinting(tmp) ;
    })

    return(
        <KeyboardAwareScrollView>
        
         <ScrollView horizontal={true} style={{ height: 50 }}>
         <Button icon='car-cog' style={ styles.button }
                onPress={ () => { loadList() , setValue(1) }}
                mode= { value == 1 && 'contained' }
         >
         틴팅
         </Button>
         <Button icon='car-cog' style={ styles.button }
                 onPress={ () => { setValue(2) }}
                 mode= { value == 2 && 'contained' }
         >
         블랙박스      
         </Button>
         <Button icon='car-cog' style={ styles.button }
                onPress={ () => { setValue(3) }}
                mode= { value == 3 && 'contained' }
         >
         PPF       
         </Button>
         <Button icon='car-cog' style={ styles.button }
                 onPress={ () => { setValue(4) }}
                 mode= { value == 4 && 'contained' }
         >
         유리막코팅      
         </Button>
         </ScrollView>
         <Button icon='hammer' style={ styles.button } color='gray'
                 onPress={ () => {  }}
         >
         수정하기
         </Button>
         {/* 틴팅 */}
         {
             value == 1 && (
                 <>
                <Card.Title title = '틴팅' titleStyle={ styles.title }></Card.Title>
                { tinting.length != 0 &&
                tinting.map( data => {
                    return (
                    <Card>
                    <Card.Content>
                        <Row>
                            <Text>{data.name}</Text>
                            <Button icon={ test ? 'chevron-up' : 'chevron-down'  } 
                                style={{ alignSelf: 'flex-end'}} 
                                onPress={ () => setTest(!test) } 
                            />
                        </Row>
                        <SubText  >{data.description}</SubText>
                        <Text>가격 :  {data.price}만원~ </Text>                         
                    </Card.Content>
                    </Card>
                    )
                } )
                }
                    
                </>
             )
         }
       
        </KeyboardAwareScrollView>    
    );
}