import AsyncStorage from "@react-native-async-storage/async-storage"
import fetch from "./fetch";

export default async (key,value) => {
        let data ;
        try {
          await fetch(key)
          .then(res => {
            data = { ...res , ...value } ;
          })
          .catch(e => { // save error 
          })

          const jsonValue = JSON.stringify(data) ;
          await AsyncStorage.setItem(key, jsonValue)

        } catch (e) {
          // saving error
        }

} ;
