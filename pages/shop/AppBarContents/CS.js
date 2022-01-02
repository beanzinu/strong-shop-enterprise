
import React from "react";
import WebView from "react-native-webview";

export default function(){
    return(
        <WebView 
                source={{ uri: 'https://carshop.notion.site/c36dd48876214d25ae19155bfabb0c82?v=107112d00a2b47a18d5bb8f723041913' }}
                style={{ flex: 1 }}
        />
    )
}