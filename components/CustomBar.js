import React from 'react';
import styled from 'styled-components';
import { Appbar , Divider, Title } from 'react-native-paper';
import { Image } from 'react-native';
import colors from '../color/colors';

const CustomView = styled.View``;

const styles = {
    title : {
        padding: 10 ,
        fontSize: 25 ,
        fontFamily: 'Jua-Regular' ,
    } ,
    mainTitle : {
        fontSize: 30 ,
        fontFamily: 'Jua-Regular' ,
        textAlign: 'center' ,
        color: 'white'
    } ,
}



function Default( { subtitle } ){
    return(
        <>
        <Appbar.Header style={{ backgroundColor: colors.main, borderTopWidth: 1 , borderColor: 'rgb(203,115,62)' , width: '90%' , alignSelf: 'center' , elevation: 0 }}>

        </Appbar.Header>
                <CustomView style={{ 
                    alignItems: 'center' , 
                    height: 40 , 
                    backgroundColor: colors.main,
                    borderColor: 'rgb(240,206,184)' ,
                    borderBottomStartRadius: 1000 ,
                    borderBottomEndRadius: 1000 ,
                    borderBottomLeftRadius: 1000 ,
                    borderBottomRightRadius: 1000 ,
                    top: - 20 ,

                }}>
                        <CustomView style={{ flex: 1 }}>
                            <Title style={{ ...styles.mainTitle }}>
                                {'카# (업체용)'}
                            </Title>
                            <Title style={{ ...styles.mainTitle , color: 'rgb(103,53,25)' ,fontSize: 23 , fontWeight: 'bold' }}>{subtitle}</Title>
                        </CustomView>
                </CustomView>    
                <CustomView style={{ justifyContent: 'flex-end' , alignItems: 'center', height: 60 , width: '100%' , zIndex: -2 , borderRadius: 1000 , top: -10 }}>
                    <CustomView style={{ width: 900 , height: 900, borderRadius: 1000 , backgroundColor: colors.main  , zIndex: -1 , alignSelf: 'center' , borderColor: 'rgb(239,206,183)' , borderWidth: 12 }}  />
                </CustomView>
        </>
    )
};

function A({ subtitle }){
    return(
        <>
        {/* <Appbar.Header style={{ backgroundColor: colors.main , borderTopWidth: 1 , borderColor: 'rgb(203,115,62)' , width: '90%' , alignSelf: 'center' , elevation: 0 }}>
        </Appbar.Header> */}
                <CustomView style={{ 
                    alignItems: 'center' , 
                    height: 50 , 
                    backgroundColor: colors.main,
                    borderColor: 'rgb(240,206,184)' ,
                    borderBottomStartRadius: 1000 ,
                    borderBottomEndRadius: 1000 ,
                    borderBottomLeftRadius: 1000 ,
                    borderBottomRightRadius: 1000 ,

                }}>
                        <CustomView style={{ flex: 1 }}>
                            <Title style={{ ...styles.mainTitle }}>
                                {'카# (업체용)'}
                            </Title>
                            <Title style={{ ...styles.mainTitle , color: 'rgb(103,53,25)' ,fontSize: 27 , fontWeight: 'bold' }}>{subtitle}</Title>
                        </CustomView>
                </CustomView>    
                <CustomView style={{ justifyContent: 'flex-end' , alignItems: 'center', height: 70 , width: '100%' , zIndex: -2 , borderRadius: 1000 , top: -10 }}>
                    <CustomView style={{ width: 900 , height: 900, borderRadius: 1000 , backgroundColor: colors.main  , zIndex: -1 , alignSelf: 'center' , borderColor: 'rgb(239,206,183)' , borderWidth: 12 }}  />
                </CustomView>
        </>
    );
}
function B({ title }){
    return(
            <>
                <CustomView style={{ 
                    alignItems: 'center' , 
                    height: 50 , 
                    backgroundColor: colors.main,
                    borderColor: 'rgb(240,206,184)' ,
                    borderBottomStartRadius: 1000 ,
                    borderBottomEndRadius: 1000 ,
                    borderBottomLeftRadius: 1000 ,
                    borderBottomRightRadius: 1000 ,
                    top: - 20 ,
                }}>
                        <CustomView style={{ flex: 1 }}>
                            <Image source={require('../resource/logo.png')} style={{ width: 60 , height: 60 , top: - 20 , alignSelf: 'center'  }} />
                            <Title style={{ ...styles.mainTitle , color: colors.title }}>
                                {title}
                            </Title>
                            {/* <Title style={{ ...styles.mainTitle , color: 'rgb(103,53,25)' ,fontSize: 23 , fontWeight: 'bold' }}>{subtitle}</Title> */}
                        </CustomView>
                </CustomView>    
                <CustomView style={{ justifyContent: 'flex-end' , alignItems: 'center', height: 60 , width: '100%' , zIndex: -2 , borderRadius: 1000 , top: -10 }}>
                    <CustomView style={{ width: 900 , height: 900, borderRadius: 1000 , backgroundColor: colors.main  , zIndex: -1 , alignSelf: 'center' , borderColor: 'rgb(239,206,183)' , borderWidth: 12 }}  />
                </CustomView>
            </>
);
}
function C({ title }){
    return(
            <>
                <CustomView style={{ 
                    alignItems: 'center' , 
                    height: 50 , 
                    backgroundColor: colors.main,
                    borderColor: 'rgb(240,206,184)' ,
                    borderBottomStartRadius: 1000 ,
                    borderBottomEndRadius: 1000 ,
                    borderBottomLeftRadius: 1000 ,
                    borderBottomRightRadius: 1000 ,
                    top: - 20 ,
                }}>
                        <CustomView style={{ flex: 1 }}>
                            <Image source={require('../resource/carIcon.png')} style={{ width: 50 , height: 55 , top: - 20 , alignSelf: 'center'  }} />
                            <Title style={{ ...styles.mainTitle , color: colors.title }}>
                                {title}
                            </Title>
                            {/* <Title style={{ ...styles.mainTitle , color: 'rgb(103,53,25)' ,fontSize: 23 , fontWeight: 'bold' }}>{subtitle}</Title> */}
                        </CustomView>
                </CustomView>    
                <CustomView style={{ justifyContent: 'flex-end' , alignItems: 'center', height: 60 , width: '100%' , zIndex: -2 , borderRadius: 1000 , top: -10 }}>
                    <CustomView style={{ width: 900 , height: 900, borderRadius: 1000 , backgroundColor: colors.main  , zIndex: -1 , alignSelf: 'center' , borderColor: 'rgb(239,206,183)' , borderWidth: 12 }}  />
                </CustomView>
            </>
);
}
export default { Default , A , B , C }
