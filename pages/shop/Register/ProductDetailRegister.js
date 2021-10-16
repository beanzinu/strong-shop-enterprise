import React from 'react' ;
import { Animated, PanResponder } from "react-native";
import styled from 'styled-components';

const View = styled.View`
    flex: 1;
`;

export default function() {
    const pan = React.useRef(new Animated.ValueXY()).current;

    const panResponder = new React.useRef(
        PanResponder.create({
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: () => {
            pan.setOffset({
              y: pan.y._value
            });
          },
          onPanResponderMove: Animated.event(
            [
              null,
              {  dy: pan.y }
            ],{ useNativeDriver: false }
          ),
          onPanResponderRelease: (e,gestureState) => {
            console.log(pan.y._value);
            pan.setOffset({
                y: 200
            });
          }
        })
      ).current;
    const Npan = React.useRef(new Animated.ValueXY()).current;

    const NpanResponder = new React.useRef(
        PanResponder.create({
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: () => {
            Npan.setOffset({
              x: Npan.x._value,
              y: Npan.y._value
            });
          },
          onPanResponderMove: Animated.event(
            [
              null,
              { dx: Npan.x , dy: Npan.y }
            ],{ useNativeDriver: false }
          ),
          onPanResponderRelease: () => {
            pan.flattenOffset();
          }
        })
      ).current;
   

    return(
        <View>
            <Animated.View   {...panResponder.panHandlers} style={{  transform: [{ translateY: pan.y }] , width: '100%'  , height: 100 , backgroundColor: 'red' }} />
            <Animated.View   {...NpanResponder.panHandlers} style={{  transform: [{ translateY: Npan.y }] , width: '100%'  , height: 100 , backgroundColor: 'blue' }} />
            
        </View>
    )
}








// const Label = styled.Text`
//     margin-left: 10px;
//     font-size: 17px;
//     font-weight: bold;
// `;
// const TextInput = styled.TextInput`
//     width: 90%;
//     height: 50px;
//     margin: 10px;
//     border:1px lightgray;
//     padding: 10px;
// `;
// const styles = {
//     title : {
//         fontSize: 30 ,
//         fontWeight: 'bold' ,
//         padding : 10 ,
//         color: colors.main
//     } ,
//     divider : {
//         borderWidth: 1 , 
//         borderColor: 'lightgray' , 
//         margin: 10 
//     }
// }
// export default function( props ) {
//     const [name,setName] = React.useState('');
//     const [description,setDescription] = React.useState('');
//     const [option,setOption] = React.useState('');


//     React.useEffect(() => { 

//         alert( props.route.params.option) ;
//         setOption( props.route.params.option ) ;

        

//         if ( props.route.params.data != null) {
//             setName( props.route.params.data.name );
//             setDescription( props.route.params.data.description );
//         }

//     },[]);

//     const addItem = async () =>  {


//         data = {  name : name , description : description } ;

//         await fetch('Product')
//         .then( res =>  {
//             tmp = res[option] ;
//             // 새로운 옵션항목 저장
//             if ( tmp == null ) {
//                 addData = { } ;
//                 addData[option] = [{ name: name , description : description}];

//                 store('Product',addData)
//                 .then(() => props.navigation.goBack())
//                 .catch(() => {    })

//             }
//             // 기존항목에 추가
//             else {
//                 data = { name : name , description : description } ;
//                 tmp.push(data);
//                 newData = { ...res  } ;
//                 newData[option] = tmp ;

//                 store('Product', newData) 
//                 .then(() => props.navigation.goBack())
//                 .catch(() => { })
//             }
//         }) 
//         .catch (  async () => {
//             addData = { } ;
//             addData[option] = [[{ name: name , description : description}] ];
//             // 캐시된 데이터가 하나도 없을때
//             await store('Product',addData)
//             .then(() => { props.navigation.goBack() })
//             .catch(() => {  })


//         })

//         props.route.params.reload();

//     }

//     return(
//     <KeyboardAwareScrollView style={{ backgroundColor: 'white'}}>
//         <Title style={styles.title}> 항목 추가 </Title>
//         <Divider style={styles.divider} />
//             <Label>제품명</Label>
//             <TextInput
//                 value={name}
//                 placeholder='제품명'
//                 onChangeText={value=>{setName(value)}}
//             />
//         <Divider style={styles.divider} />
//         <Label>설명</Label>
//             <TextInput multiline={true} style={{height: 200 }} 
//                 value={description}
//                 placeholder='간단한 설명을 추가해주세요.'
//                 onChangeText={value=>{setDescription(value)}}
//             />
//         <Divider style={styles.divider} />

//         <Button icon='plus' mode='contained' color={colors.main} 
//             onPress={ () =>  { addItem() } }
//             style={{ height: 50 , justifyContent: 'center' }}
//         >등록하기</Button>
//     </KeyboardAwareScrollView>
//     );
// }