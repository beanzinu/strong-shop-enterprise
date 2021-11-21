import _, { add } from 'lodash';
import React from 'react';
import { List , Title } from 'react-native-paper';
import fetch from '../../../storage/fetch';
import store from '../../../storage/store';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function( props ) {
    const [rawData,setRawData] = React.useState([]);
    const [data,setData] = React.useState([]);
    // const [prevDate,setPrevDate] = React.useState('2000-01-01');
    React.useEffect(() => {

        fetch('noti')
        .then(res => {
            setRawData(res.data);
            setData(_.reverse(res.data));
        })
        .catch(e => {

        })
    },[]);

   


    function RenderItem({ notification , index , prevDate }) {
        const [read,setRead] = React.useState(notification.read)

        const handleRead = (index) => {
            let tmp = rawData ;
            tmp[index] = { ...tmp[index] , read : true } ;
            // 시간으로 정렬
            tmp = _.sortBy(tmp, function(o) { return o.createdAt  } ) ;
            setRead(true);
            store('noti',{ data : tmp });
        }

        return(
                <>
                {
                    moment(notification.createdAt).isBefore(prevDate) &&
                    <Title style={{ padding: 5 , fontSize: 15 }}>{notification.createdAt}</Title>
                }
                    <List.Item 
                            style={{ borderWidth: 1 , borderColor: 'lightgray' , backgroundColor: read? 'rgb(240,240,240)' : 'white'  }}
                            title={notification.title}   
                            onPress={ () => {handleRead(index)} }
                            description={notification.body}
                            titleStyle={{  fontWeight: 'bold' }} 
                            descriptionStyle={{ paddingTop: 3 , fontWeight: 'bold' }} 
                    />    
                </>
        )
    }


    return(
        <KeyboardAwareScrollView>
            {/* <List.Section> */}
                {
                    data.map( (notification,index) =>{
                        if (index == 0 ) prevDate = moment(data[index].createdAt).add(1,'days') ;
                        if ( index != 0 ) prevDate = data[index-1].createdAt ;
                        return(
                            <>
                            <RenderItem notification ={ notification } index={ index } prevDate={prevDate} key={notification}/>
                            </>
                        );
                    })
                }
            {/* </List.Section> */}
        </KeyboardAwareScrollView>
    );
}