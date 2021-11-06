import React from 'react';
import styled from 'styled-components';
import { Title  , ProgressBar, Avatar , Appbar , List , Badge , Button , IconButton , Modal , Portal , Provider}  
from 'react-native-paper';
import { FlatList , ScrollView } from 'react-native';
import colors from '../../../color/colors';
import { Image } from 'react-native';
import _, { set } from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import { request , PERMISSIONS } from 'react-native-permissions';
import Swiper  from 'react-native-swiper';


const Container = styled.SafeAreaView``;
const View = styled.View``;
const Row = styled.View`
    flex-direction: row ;
    align-items: center;
`;
const CButton = styled.TouchableOpacity`
    width: 30%;
    height: 100px;
`;
const SwiperView = styled.View`
    width: 100%;
    height: 500px;
`;

const styles = {
    title : {
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30 ,
        padding: 20
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
    const[state,setState] = React.useState(2);
    const[pictures,setPictures] = React.useState(null);
    const[refresh,setRefresh] = React.useState(false);
    const[visible,setVisible] = React.useState(false);

    openNew = async () => {

        request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        await MultipleImagePicker.openPicker({
            mediaType: 'image',
            // selectedAssets: pictures,
            doneTitle: "완료",
            selectedColor: "#162741",
        })
        .then(res => {
           url = [] ;
           res.map(file =>  {
            //    newPath = file.path.replace('file://','').replace('file:///','file://');
               url.push(file.path);
           });
           if ( pictures != null ) {
           files = pictures ;
           url.map(file=>{
               files.push(file);
           })
           setPictures(files);
           setRefresh(true);
           setRefresh(false);
           }
           else {
               setPictures(url);
           }

        }) 
        .catch(e => { });
       
    }

    const RenderItem = ({item}) =>  {
        return(
            <CButton onPress={ () =>  { setVisible(true) }}>
                <Image source={{ uri : item }} style={{ width: '100%' , height: '100%' }}/>
            </CButton>
        )
    }

    return(
        <Provider>
        {/* 사진 상세보기 */}
        <Portal>
        <Modal visible={visible} onDismiss={() => { setVisible(false) }} contentContainerStyle={{ width: '100%', height: 600 , backgroundColor: 'lightgray' }}>
            <IconButton icon='close' style={{ alignSelf: 'flex-end'}} onPress={ () => { setVisible(false) }} />
            <SwiperView>
            <Swiper 
                horizontal={true}
                prevButton={<IconButton icon='chevron-left' color={'gray'}/>}
                nextButton={<IconButton icon='chevron-right' color={'gray'}/>}
            >
                    {
                        pictures != null &&
                        pictures.map(picture => {
                            return(
                                <SwiperView>
                                    <Image source={{ uri: picture }} style={{ width: '100%' , height: '100%' }} />
                                </SwiperView>
                            )
                        })
                    } 
            </Swiper>
            </SwiperView>
        </Modal>
        </Portal>

        <ScrollView>
            <Appbar.Header style={{ backgroundColor: colors.main }}>
            <Appbar.BackAction onPress={() => { props.navigation.goBack() }} />
            <Appbar.Content title={`${props.route.params.name} 고객님`} titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 24}} />
            <View>
                <Appbar.Action icon="chat" onPress={() => { props.navigation.navigate('ChatDetail',{ name : props.route.params.name }) }} color='white' style={{ backgroundColor: 'transparent' , margin: 0}} size={30}/>
                <Badge size={10} style={{ position: 'absolute' , right: 0 , top: 0 }}/>
            </View>
            </Appbar.Header>  
            <ProgressBar style={styles.progress} progress={state/4} color='red'  
                theme = {{ animation : { scale : 5 }  }}
            />
            <Title style={styles.title}>시공 진행상황</Title>
            <Title style={{ marginLeft: 20 , color : 'gray' , marginBottom : 10}}>
                {
                    state == 1 ? TEXT.first : state == 2 ? TEXT.second : state == 3 ? TEXT.third : TEXT.fourth 
                }
            </Title>
            <SwiperView>
            <Swiper horizontal={true} index={state-1}
                loop={false}
                showsButtons={true}
                showsHorizontalScrollIndicator={true}
                showsPagination={false}
                prevButton={<IconButton icon='chevron-left' color={'gray'}/>}
                nextButton={<IconButton icon='chevron-right' color={'gray'}/>}
                overScrollMode='auto'
                // renderPagination = { (index,total) => <Title style={{ alignSelf: 'center'}}>{ index+1}/{total}</Title>}

            >
            {
                progress.map(item => {
                    return (
                        
                        
                            <SwiperView>
                                <Title style={{ padding: 10 , color : state == item.value ? 'red' : state > item.value ? 'black' : 'gray' }}>
                                {item.value}{'단계: '}{item.title}
                                </Title>
                                {
                                item.value > 1 && item.value <= state && (
                                    <>
                                    <Button style={{ alignSelf: 'flex-end' , padding: 5 , margin: 5 }}
                                        onPress={ () => { openNew() } }
                                        mode='contained'
                                        color={colors.main}
                                        icon='image'
                                    >
                                        {'추가하기'}
                                    </Button>
                                    <FlatList
                                        style={{ width: '80%', alignSelf: 'center' , marginLeft: 20 }}
                                        nestedScrollEnabled={true}
                                        data={pictures}
                                        renderItem={RenderItem}
                                        numColumns={3}
                                        keyExtractor={item => {_.random()}}
                                        refreshControl={refresh}
                                    />
                                    </>
                                )
                                }
                            </SwiperView>
                       
                       

                        // <List.Accordion
                        //     title={item.title}
                        //     titleStyle={{...styles.text , color : state == item.value ? 'red' : state > item.value ? 'black' : 'gray' }}
                        //     left={props => <List.Icon {...props} icon='circle-small'/>}
                        //     right={props => item.value > 1 && item.value <= state && <List.Icon {...props} icon='chevron-down'/>    
                        //     }
                        // >
                        // {
                        // item.value > 1 && item.value <= state && (
                        //     <View>
                        //     <Button style={{ alignSelf: 'flex-end' , padding: 5 , margin: 5 }}
                        //         onPress={ () => { openNew() } }
                        //         mode='contained'
                        //         color={colors.main}
                        //         icon='image'
                        //     >
                        //         {'추가하기'}
                        //     </Button>
                        //     <FlatList 
                        //         nestedScrollEnabled={true}
                        //         data={pictures}
                        //         renderItem={RenderItem}
                        //         numColumns={3}
                        //         keyExtractor={item => {_.random()}}
                        //         refreshControl={refresh}
                        //     />
                        //     </View>
                        // )
                        // }
                        // </List.Accordion>
                    )
                })
            }
            </Swiper>
            </SwiperView>
        </ScrollView>
        </Provider>
    );
}