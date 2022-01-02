import axios from "axios";
import fetch from '../storage/fetch';  
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API = axios.create({
            baseURL: 'http://15.164.101.207:8080' , // 서버 baseURL
            timeout: 20000
})


// 요청 직전에 가로챔. ( 전역 )
// jwt 있을 시 넣어서 요청 
API.interceptors.request.use( 
    async function (config) {
        const res = await fetch('auth')
        if ( res !== null )
            config.headers['Auth'] =  res.auth ;

        return config;
    },
    function ( error ) {
       // 요청 직전에 에러
       console.log(error);
        return Promise.reject(error);
    }
);


// 응답 인티셉터 (응답 직전에 호출)
// API.interceptors.response.use(
//     function (response) {
//         // https stauts === 200 일 때 - axios 함수에서 .then()으로 연결됨
//         return response;
//     },
    
//     function (e) {
//         console.log('error',e);
//         // https stauts !== 200 일 때 - axios 함수에서 .catch()으로 연결됨
//         return e ;
//     },
// );

export default API ;

