import _, { add } from 'lodash';
import React from 'react';
import { Badge, List , Title } from 'react-native-paper';
import fetch from '../../../storage/fetch';
import store from '../../../storage/store';
import moment from 'moment';
import AppContext from '../../../storage/AppContext';
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

            // 읽음으로 모두 표시
            res.data.map( (item) => { item['read'] = true } )
            store('noti',{ data : res.data });

        })
        .catch(e => {

        })

    },[]);

   


    function RenderItem({ notification , index , prevDate }) {
        const [read,setRead] = React.useState(notification.read)
        const MyContext = React.useContext(AppContext);

        const handleRead = (index) => {
            let tmp = rawData ;
            tmp[index] = { ...tmp[index] , read : true } ;
            // 시간으로 정렬
            tmp = _.sortBy(tmp, function(o) { return o.createdAt  } ) ;

            setRead(true);
            store('noti',{ data : tmp })
            .then( res => {
                MyContext.setHomeRef(!MyContext.homeRef);  
            });
            
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
                            // onPress={ () => {handleRead(index)} }
                            description={notification.body}
                            titleStyle={{  fontWeight: 'bold'  }} 
                            right={ () => !read && <Badge  color='red' size={10} style={{ top: 5  , right: 5 , position: 'absolute'}} />}
                            descriptionStyle={{ paddingTop: 3 , fontWeight: 'bold' }} 
                    />    
                </>
        )
    }


    return(
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
            {/* <List.Section> */}
                {
                    data.length != 0 &&
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