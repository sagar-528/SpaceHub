import { StyleSheet, Text, View } from 'react-native'
import React,{useState} from 'react'
import { Loader } from '../../components/Loader'
import WebView from 'react-native-webview';
import { API_URL } from "@env";

const Support = () => {

    const [loading, setLoading] = useState(false)

    const url = API_URL + '/staticPages/privacyPolicy';

  return (
    <>
      <Loader visible={loading} />
      <WebView
        source={{uri: url}}
        style={{flex: 1}}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </>
  )
}

export default Support

const styles = StyleSheet.create({})