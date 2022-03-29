import React from 'react' ;
import { Button , Text, Title , DataTable , TextInput } from 'react-native-paper';
import styled from 'styled-components';
import { Client } from '@notionhq/client';
import IMP from 'iamport-react-native';
import API from '../../../server/API';
import moment from 'moment';
import colors from '../../../color/colors';
import { Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: white;
`;
const View = styled.View``;
const Row = styled.View`
  flex-direction: row;
`;

const databaseId = '8df0afff2699474db94d85e44d78a1a5'

function CS_Write( props ){
    const [title,setTitle] = React.useState('');
    const [content,setContent] = React.useState('');

    const notion = new Client({
        auth: 'secret_YacHKb7HLk2rAR7VbH4j99ip1aTJb3MeXCATN23jBOI'
      })    

    const handleButton = () => {
        Alert.alert('문의하기','등록하시겠습니까?',[
        {
            text: '취소'
        }  
        ,{
            text: '확인',
            onPress: () => { addItem() }
        } 
        ]) 
    }

    async function addItem() {
        if ( title.length == 0 || content.length == 0 ) {
            alert("내용을 입력해주세요.");
            return;
        }
        try {
    
          const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
              "Title": {
                "type": "title",
                // "id" : "1" ,
                "title": [{ "type": "text", "text": { "content": title } }]
              },
              "Content": {
                "type": "select" ,
                "select" : {
                  name: 'company' ,
                }
              },
              "date": {
                "type" : 'date',
                "date" : {  start: moment().format('YYYY-MM-DD') }
              },
              "State": {
                "type": "select" ,
                "select" : {
                  name: '문의중' ,
                }
              },
              "User": {
                "type": "email" ,
                "email": props.route.params.email
              },
            },
            children: [{
              object: 'block' ,
              type: 'paragraph' ,
              paragraph : {
                "text": [{ "type": "text", "text": { "content": content } }]
              }
            }]
          })
          
    
            Alert.alert('작성 완료');
            props.navigation.goBack();

        } catch (error) {
            // console.log(error);
            Alert.alert('다시 시도해주세요.');
        }
      }
    return(
        <Container>
            <Title style={{ padding: 10 }}>제목</Title>
            <TextInput 
                onChangeText={ value => { setTitle(value) }}
                style={{ backgroundColor: 'white' }}
                placeholder='제목을 입력하세요.'
                theme={{ colors: { primary: 'black' }}}
            />
            <Title style={{ padding: 10 }}>내용</Title>
            <TextInput 
                onChangeText={ value => { setContent(value) }}
                multiline={true}
                style={{ backgroundColor: 'white' }}
                placeholder='내용을 입력하세요.'
                theme={{ colors: { primary: 'black' }}}
            />
            <Button onPress={handleButton} style={{ margin: 10 }} mode='contained' color={colors.main}>등록하기</Button>
        </Container>
    )
}

function CS( props ) {
  const [results,setResults] = React.useState([]);
  const [email,setEmail] = React.useState('');
  const isFocused = useIsFocused();
  const notion = new Client({
    auth: 'secret_YacHKb7HLk2rAR7VbH4j99ip1aTJb3MeXCATN23jBOI'
  })
  
  React.useEffect(() => {

    if( isFocused ) {
        
        API.get('/api/company')
        .then( res => {
          setEmail(res.data.data.email);
          notion.databases.query({
          database_id: databaseId ,
          filter: {
              property: 'User' ,
              type: 'title' ,
              "title": { equals : res.data.data.email }
          }
          })
          .then( res => {
            setResults(res.results);
  
          })
          .catch( e =>  {
  
          })
        })
        .catch( e =>  {
          //
        })

    }
  },[isFocused]);
  
    return(
        <Container>    
            <Button onPress={() =>  { props.navigation.navigate('CS_Write',{ email : email })}} color={colors.main} icon='pencil' style={{ width: 100 , alignSelf: 'flex-end' , padding: 5  }}>문의하기</Button>
            <DataTable>
            <DataTable.Header  style={{ padding: 5  }}>
              <DataTable.Title>제목</DataTable.Title>
              <DataTable.Title>상태</DataTable.Title>
            </DataTable.Header>
            {
              results.map( item => {
                return(
                <DataTable.Row>
                  <DataTable.Cell key={item} onPress={() => { props.navigation.navigate('CS_Detail',{ id: item.id , title : item.properties.Title.title[0].plain_text , state : item.properties.State.select.name })  }}>{item.properties.Title.title[0].plain_text}<Text style={{ color: 'gray'}}>{' [+]'}</Text></DataTable.Cell>
                  {
                    item.properties.State.select.name == "답변완료" ? 
                    <DataTable.Cell onPress={() => { }}><Text style={{ color: 'blue' , fontWeight: 'bold' }}>답변완료</Text></DataTable.Cell>
                    :
                    <DataTable.Cell><Text style={{ color: 'red' , fontWeight: 'bold' }}>문의중</Text></DataTable.Cell>
                    
                  }
                </DataTable.Row>
                // <Row>
                //   <Text style={{ fontSize: 20 , padding: 10 }}>{item.properties.Title.title[0].plain_text}</Text>
                // </Row>
                );
              })
            }
            </DataTable>
            
        </Container>


    );
}

export { CS , CS_Write } ;


