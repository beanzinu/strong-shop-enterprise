import React from 'react';
import styled from 'styled-components';
import { Title  , ProgressBar, Avatar , Appbar , List } from 'react-native-paper';
import { FlatList } from 'react-native';
import colors from '../../../color/colors';
import { Image } from 'react-native';
import _ from 'lodash';

const Container = styled.SafeAreaView``;
const Row = styled.View`
    flex-direction: row ;
    align-items: center;
`;
const CButton = styled.TouchableOpacity`
    width: 30%;
    height: 100px;
`;

const styles = {
    title : {
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30 ,
        padding: 20
    } ,
    progress : {
      height: 10
    },
    icon : {
        backgroundColor: 'transparent'

    } ,
    text : {
        fontSize: 17 ,
        fontWeight: 'bold'
    }
}

// 산차 검수 데이터
DATA = [
    {
    uri : 'https://picsum.photos/0'
    } ,
    {
    uri : 'https://picsum.photos/0'
    } ,
    {
    uri : 'https://picsum.photos/0'
    } ,
]

const TEXT = {
    first : '고객님에게 차량 탁송지를 알려주세요.' ,
    second : '신차검수 현황을 올려보세요.' ,
    third : '시공진행 상황을 올려보세요.' ,
    fourth : '시공완료 소식을 알려보세요.'
}

// 진행 상황 
const progress = [
    {
        title : '차량 탁송지 지정' ,
        value : 1 ,
    } ,
    {
        title : '신차검수' ,
        value : 2 ,
    } ,
    {
        title : '시공진행' ,
        value : 3 ,
    } ,
    {
        title : '시공완료/출고' ,
        value : 4 ,
    } ,
]


export default function( props ) {
    const[state,setState] = React.useState(3);
  
    const RenderItem = ({item}) =>  {
        return(
            <CButton onPress={ () =>  { }}>
                <Image source={{ uri : item.uri}} style={{ width: '100%' , height: '100%' }} />
            </CButton>
        )
    }

    return(
        <>
             <Appbar.Header style={{ backgroundColor: colors.main }}>
            <Appbar.BackAction onPress={() => { props.navigation.goBack() }} />
            <Appbar.Content title={`${props.route.params.name} 고객님`} titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 30}} />
            <Appbar.Action icon="chat" onPress={() => {}} />
            </Appbar.Header>  
            <ProgressBar style={styles.progress} progress={state/4} color='red' 
                theme = {{ animation : { scale : 10 } }}
            />
            <Title style={styles.title}>시공 진행상황</Title>
            <Title style={{ marginLeft: 20 , color : 'gray' , marginBottom : 10}}>
                {
                    state == 1 ? TEXT.first : state == 2 ? TEXT.second : state == 3 ? TEXT.third : TEXT.fourth 
                }
            </Title>
           
            {
                progress.map(item => {
                    return (
                        <List.Accordion
                            title={item.title}
                            titleStyle={{...styles.text , color : state == item.value ? 'red' : state > item.value ? 'black' : 'gray' }}
                            left={props => <List.Icon {...props} icon='circle-small'/>}
                            right={props => item.value > 1 && item.value <= state && <List.Icon {...props} icon='chevron-down'/>    
                            }
                        >
                        {
                        item.value > 1 && item.value <= state && (
                            <FlatList 
                                data={DATA}
                                renderItem={RenderItem}
                                numColumns={3}
                                keyExtractor={item => {_.random()}}
                            />
                        )
                        }
                        </List.Accordion>
                    )
                })
            }
        </>
    );
}