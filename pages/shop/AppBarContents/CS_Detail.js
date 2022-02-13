import React from 'react';
import WebView from 'react-native-webview';
import { Client } from '@notionhq/client';
import { Text, Title , Badge , Divider, Avatar } from 'react-native-paper';
import { View } from 'react-native';
import styled from 'styled-components';
import colors from '../../../color/colors';
const Row = styled.View`
    flex-direction: row;
    align-items: center;
`;
export default function( props ){
    const [results,setResults] = React.useState([]);

    const blockId = props.route.params.id ;
    const notion = new Client({
        auth: 'secret_YacHKb7HLk2rAR7VbH4j99ip1aTJb3MeXCATN23jBOI'
    });

    React.useEffect(() => {
        notion.blocks.children.list({
            block_id: blockId,
            page_size: 50,
        })
        .then( res => {
            let tmp = [];
            res.results.map( item => {
                if ( item.hasOwnProperty('paragraph') && item.paragraph.text[0]?.plain_text != null )
                    tmp.push( item.paragraph.text[0]?.plain_text );
                else if( item.type == "divider" )
                    tmp.push( "divider" );
            })
            setResults(tmp) ;
        })

    },[]);

    return(
        <View style={{ flex: 1 , backgroundColor: 'white' }}>
            <Row style={{ padding: 10   }} >
                {
                    props.route.params.state == "답변완료" ? 
                    <Badge style={{ alignSelf: 'center' , marginLeft: 5 }}>답변완료</Badge>
                    :
                    <Badge style={{ alignSelf: 'center' , marginLeft: 5 }}>문의중</Badge>
                }
                <Title style={{ marginLeft: 10 }}>{props.route.params.title}</Title>
            </Row>
            <View style={{ borderTopWidth: 1 , padding: 10 , borderColor: 'gray' }}>
            {
                results.length != 0 &&
                results.map(item => {
                    if ( item == "divider") 
                    return (
                    <>
                    <Row style={{ padding: 5 , marginBottom: 5 , marginTop: 20 }}>
                        <Avatar.Icon icon='account' style={{ backgroundColor: colors.main , marginRight: 10 }} size={25} />
                        <Text style={{ fontSize: 17 , fontWeight: 'bold' }}>관리자</Text>
                    </Row>
                    <View style={{ borderTopWidth: 3 , marginBottom: 20 , borderColor: 'black' }}/>
                    </>
                    )
                    return <Text style={{ padding: 3 }}>{item}</Text>
                })
            }
            </View>
        </View>
    )
}