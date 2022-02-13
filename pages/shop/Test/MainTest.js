import React from 'react' ;
import { Button , Text, Title , DataTable } from 'react-native-paper';
import styled from 'styled-components';
import { Client } from '@notionhq/client';
import IMP from 'iamport-react-native';
import moment from 'moment';
import { TextInput } from 'react-native-paper';
import colors from '../../../color/colors';

const Container = styled.SafeAreaView``;
const View = styled.View``;
const Row = styled.View`
  flex-direction: row;
`;

const databaseId = '8df0afff2699474db94d85e44d78a1a5'

export default function() {
  const [title,setTitle] = React.useState('');
  const [content,setContent] = React.useState('');
  const [results,setResults] = React.useState([]);

  const notion = new Client({
    auth: 'secret_YacHKb7HLk2rAR7VbH4j99ip1aTJb3MeXCATN23jBOI'
  })
  
  React.useEffect(() => {

    notion.databases.query({
      database_id: databaseId ,
      filter: {
        property: 'User' ,
        type: 'title' ,
        "title": { equals : 'wlsdn1372@naver.com' }
      }
    })
    .then( res => {
      setResults(res.results);

    })
   

    

  },[]);

  async function addItem(text) {
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
            "date" : { start: moment().format('YYYY-MM-DD kk:mm:ss') }
          },
          "State": {
            "type": "select" ,
            "select" : {
              name: '문의중' ,
            }
          }
        },
        children: [{
          object: 'block' ,
          type: 'paragraph' ,
          paragraph : {
            "text": [{ "type": "text", "text": { "content": content } }]
          }
        }]
      })
      

      console.log("Success! Entry added.")
    } catch (error) {
      console.error(error.body)
    }
  }
  
    return(
        <Container>    
            <Button color={colors.main} icon='pencil' style={{ width: 100 , alignSelf: 'flex-end'  }}>문의하기</Button>
            <DataTable>
            <DataTable.Header  style={{ padding: 5  }}>
              <DataTable.Title>제목</DataTable.Title>
              <DataTable.Title>상태</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row>
            {
              results.map( item => {
                return(
                  <>
                  <DataTable.Cell onPress={() => {  }}>{item.properties.Title.title[0].plain_text}</DataTable.Cell>
                  {
                    item.properties.State.select.name == "답변완료" ? 
                    <DataTable.Cell onPress={() => { }}>답변완료</DataTable.Cell>
                    :
                    <DataTable.Cell >문의중</DataTable.Cell>
                    
                  }
                  </>
                // <Row>
                //   <Text style={{ fontSize: 20 , padding: 10 }}>{item.properties.Title.title[0].plain_text}</Text>
                // </Row>
                );
              })
            }
            </DataTable.Row>
            </DataTable>
            
        </Container>


    );
}

const tmpData = {
        pg: 'uplus',
        pay_method: 'card',
        name: '아임포트 결제데이터 분석',
        merchant_uid: `mid_${new Date().getTime()}`,
        amount: '1',
        // buyer_name: '공진우',
        buyer_tel: '01040761373',
        // buyer_email: 'example@naver.com',
        // buyer_addr: '서울시 강남구 신사동 661-16',
        // buyer_postcode: '06018',
        app_scheme: 'example',
        // [Deprecated v1.0.3]: m_redirect_url
      };
      function callback(response) {
          console.log(response);
        // navigation.replace('PaymentResult', response);
      }