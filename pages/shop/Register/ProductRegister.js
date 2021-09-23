import React from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import { Button , Avatar , Card , IconButton , Menu , Provider } from 'react-native-paper';
import colors from '../../../color/colors';
import { FlatList } from 'react-native';
import { random } from 'lodash';
import BottomSheet from '@gorhom/bottom-sheet';

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
    } 
} ;


export default function( props ){
    const[value,setValue] = React.useState(1);
    const[data,setData] = React.useState([]);

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
                            onPress={ () => { }} 
                        />
                    </Row>
                    <SubText>가격 :  {item.price}만원~ </SubText>                         
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
         <BottomSheet index={1}>
             <View>

             </View>
         </BottomSheet>
        </View>
    )
}