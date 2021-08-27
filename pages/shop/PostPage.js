import React from 'react'; 
import { Avatar, Card , Text } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { Image } from 'react-native';
import styled from 'styled-components';


const ImageView = styled.View`
    width: 100%;
    height: 300px;
`;

const styles= {
    Card : {
    } ,
    Image : {
        flex: 1
    } ,
    title : {
        fontSize: 15 , 
        fontWeight: 'bold'
    } ,
    text : {
        margin: 10 ,
    }
}


export default function( props ) { 
    return(
        <>
            <Card style={ styles.Card }>
                <Card.Title 
                    titleStyle={ styles.title }
                    title= {props.route.params.data.shopName} 
                    left = { (props)=>  <Avatar.Icon {...props} icon='account' size={24}/>  }
                />
            </Card>
            <ImageView>
                <Swiper 
                    loop={false}
                >  
                    <ImageView>
                        <Image source={{ uri: props.route.params.uri }} style={ styles.Image }/>
                    </ImageView>
                    <ImageView>
                        <Image source={{ uri: props.route.params.uri }} style={ styles.Image }/>
                    </ImageView>
                </Swiper>
            </ImageView>

            <Text style={styles.text} >{props.route.params.data.paragraph}</Text>

        </>
    );
}