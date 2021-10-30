import React from 'react';
import MainPage from './pages/shop/MainPage' ;
import Register from './pages/shop/Register';
import NewRegister from './pages/shop/NewRegister';



//test
// import messaging from '@react-native-firebase/messaging';
// import TestMain from './pages/shop/Test/MainTest';


function App (props) {
  const [mainVisible,setMainVisible] = React.useState(false);
  return (
      // mainVisible ? <MainPage /> : <NewRegister getMain={setMainVisible} />
    // <NewRegister />
    <MainPage />
  );
};

export default App;
