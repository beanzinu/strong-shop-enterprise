import React from 'react';
import { Appbar , Text , IconButton , Title, ActivityIndicator , Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Collapsible from 'react-native-collapsible';
import styled from 'styled-components';
import * as Progress from 'react-native-progress';
import { Dimensions , FlatList , SectionList } from 'react-native';
import colors from '../../../color/colors';
import FastImage from 'react-native-fast-image';

const RButton = styled.TouchableOpacity`
    width: 100%;
    height: 50px;
    flex-direction: row;
    align-items: center;
`;
const View = styled.View`
    flex: 1 ;
`;
const Row = styled.View`
    flex-direction: row ;
    align-items: center;
`;

const titles = [ {
    title : '시공 전' ,
    description: '시공 전 차량상태를 확인하세요.'
    } , 
    {
    title : '시공 진행' ,
    description : '시공진행 상황을 올려보세요.'
    } ,
    {
    title : '출고 대기' ,
    description : '고객님이 출고를 위해 방문할 예정이에요.'
    }
]

export default function CarePage( props ){
    const [loading,setLoading] = React.useState(true);
    const [collapsed,setCollapsed] = React.useState(true);
    const [state,setState] = React.useState(1);
    const [list1,setList1] = React.useState(false);
    const [list2,setList2] = React.useState(false);

    React.useEffect(() => {
        setState( 3 ,
            setList1(state == 1 ? false : true ),
            setList2( state == 2 ? false : true ),
            setLoading(false),
        );
        
    },[ state ]);


    return(
        <>
        <Appbar.Header style={{ backgroundColor: 'white' , height: 50 , elevation: 0  }}>
        <Appbar.BackAction  color='black' onPress={() => { props.navigation.goBack() }} />
        <Appbar.Content style={{ alignItems: 'center' }} title={`케어테스트 고객님`} titleStyle={{ fontSize: 20 , fontWeight: 'bold' }} />
        {/* <Appbar.Content style={{  position: 'absolute' , right: 0 }} title={'시공내역'} titleStyle={{  fontSize: 15 , right: 2 , color: collapsed ? 'black' : 'gray' }} onPress={ () =>  { setCollapsed(!collapsed) }} /> */}
        {/* <Appbar.Action icon="chat" onPress={() => { props.navigation.navigate('ChatDetail',{ name : data?.userResponseDto?.nickname , id : props.route.params.data.id , imageUrl : props.route.params.imageUrl }) }} style={{ backgroundColor: 'transparent' , margin: 0}} size={30}/> */}
        {/* <Badge size={18} style={{ position: 'absolute' , right: 4 , top: 4 }}>{newMsg}</Badge> */}
        </Appbar.Header>
        {
            loading ? 
            <ActivityIndicator color={colors.main} size='large' style={{ marginTop: 50 }} /> 
            :
            <KeyboardAwareScrollView nestedScrollEnabled={true}>
            <Title style={styles.title}>{titles[state-1].title}</Title>
            <Title style={{ marginLeft: 10 , paddingLeft: 10 , color : 'gray' , marginBottom : 20 , fontSize: 17 }}>    
                {titles[state-1].description}             
            </Title> 
            <Progress.Bar progress={state/3} width={ Dimensions.get('screen').width *0.9 } 
                    height={12}
                    color={colors.main}
                    unfilledColor='lightgray'
                    borderRadius={30}
                    style={{ alignSelf: 'center', borderWidth: 0 , margin: 10 }}
                >
            </Progress.Bar>
            <Row style={{ width: Dimensions.get('screen').width *0.95 }}>
                <View style={{ flex: 1 , alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 12 , color: state >=1 ? colors.main : 'lightgray' }}>시공 전</Text>
                </View>
                <View style={{ flex: 1 , alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12 , color: state >=2 ? colors.main : 'lightgray'  }}>시공 진행</Text>
                </View>
                <View style={{ flex: 1 , alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12 , color: state >=3 ? colors.main : 'lightgray'   }}>출고대기</Text>
                </View>
            </Row>
            {/* 시공내역 */}
            <RButton  onPress={() => { setCollapsed(!collapsed) }}>
                    <Text style={{ marginLeft: 10 , paddingLeft: 10 , fontSize: 17, color: collapsed? 'black' : 'lightgray' }}>시공내역</Text>
                    <IconButton style={{ right: 0 , position: 'absolute' }} icon='chevron-down' color={ collapsed? 'black' : 'lightgray' } />
            </RButton>
            <Collapsible collapsed={collapsed} style={{ borderWidth: 1 , borderColor: 'lightgray'  }}>
                {/* <BidList.C item={item} />    */}
            </Collapsible>

            { 
                state >= 1 &&
                <> 
                <ItemButton onPress={() => { setList1(!list1) }}>
                    <IconButton icon='play' color={ state == 1 ? 'black' : 'lightgray' } />
                    <Title style={{ fontSize: 17 , fontWeight: 'bold' , color: state == 1 ? 'black' : 'lightgray' }}>
                        시공 전
                    </Title>
                    <IconButton icon='chevron-down' color={ state == 1 ? 'black' : 'lightgray'} />

                </ItemButton>
                <Collapsible collapsed={list1}>
                {
                        state == 1 &&
                        <Row style={{ justifyContent: 'flex-end' , alignItems: 'center' }}>
                        <Button style={{ padding: 3 , margin: 5 ,  borderRadius: 10  }}
                            onPress={ () => { } }
                            mode='contained'
                            color={colors.main}
                            labelStyle={{ color: 'white'}}
                            icon='check'
                        >
                            {'시공완료'}
                        </Button>
                        <Button style={{ padding: 3 , margin: 5 , borderRadius: 10  }}
                            onPress={ () => {  } }
                            mode='contained'
                            color={colors.main}
                            labelStyle={{ color: 'white'}}
                            icon='image'
                        >
                            {'추가하기'}
                        </Button>
                        </Row>
                }
                <FlatList 
                    style={{ width: '100%' , alignSelf: 'center' }}
                    scrollEnabled={false}
                    data={test}
                    renderItem={BeforeItem} 
                    numColumns={3}
                    keyExtractor={ item => item.id }
                />
                </Collapsible>
                </>
            }
            {
                state >= 2 &&
                <>
                <ItemButton onPress={() => { setList2(!list2) }}>
                    <IconButton icon='play' color={state == 2 ? 'black' : 'lightgray'}/>
                    <Title style={{ fontSize: 17 , fontWeight: 'bold' , color : state == 2 ? 'black' : 'lightgray' }}>
                        시공 진행
                    </Title>
                    <IconButton icon='chevron-down' color={ state == 2 ? 'black' : 'lightgray' } />
                </ItemButton>
                <Collapsible collapsed={list2}>
                {
                        state == 2 &&
                        <Row style={{ justifyContent: 'flex-end' , alignItems: 'center' }}>
                        <Button style={{ padding: 3 , margin: 5 ,  borderRadius: 10  }}
                            onPress={ () => { } }
                            mode='contained'
                            color={colors.main}
                            labelStyle={{ color: 'white'}}
                            icon='check'
                        >
                            {'시공완료'}
                        </Button>
                        <Button style={{ padding: 3 , margin: 5 , borderRadius: 10  }}
                            onPress={ () => {  } }
                            mode='contained'
                            color={colors.main}
                            labelStyle={{ color: 'white'}}
                            icon='image'
                        >
                            {'추가하기'}
                        </Button>
                        </Row>
                }
                <FlatList 
                    style={{ width: '100%' , alignSelf: 'center' }}
                    scrollEnabled={false}
                    data={test}
                    renderItem={BeforeItem} 
                    numColumns={3}
                    keyExtractor={ item => item.id }
                />
                </Collapsible>
                </>
            }

            </KeyboardAwareScrollView>
        }
        </>
    );
}
const test =[{ id : 1 },{ id : 2 },{ id : 3 },{ id : 4 },{ id : 5 }, { id : 6 } ]
function BeforeItem({ item }){
    return (
        <ImageView>
        <FastImage source={require('../../../resource/Loading.jpeg')} style={{ width: '100%' , height: '100%' }} />
        </ImageView>
    );
}
const ItemButton = styled.TouchableOpacity`
    margin-left: 5px;
    /* padding-left: 10px; */
    margin-bottom: 5px;
    flex-direction: row;
    align-items: center;
`;

const ImageView = styled.View`
    width: 33%;
    height: 100px;
    margin: 1px;
`;

const styles = {
    title : {
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 28 ,
        paddingLeft: 20 ,
        paddingTop: 15 
    } ,
    progress : {
      height: 5
    },
    icon : {
        backgroundColor: 'transparent'

    } ,
    text : {
        fontSize: 17 ,
        fontWeight: 'bold'
    }
}