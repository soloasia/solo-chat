import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import style, { deviceHeight, deviceWidth } from '../styles';

const CustomLoading = (props:any) => {
  return props.visible?(
        <View style={[styles.container]}>
            <View style={{width:130,height:130,backgroundColor:'#eee',borderRadius:10}}>
                <LottieView  source={require('../assets/loading.json')} autoPlay />
            </View>
        </View> 
  ):null
}
export default React.memo(CustomLoading)
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        width:deviceWidth,
        height:deviceHeight
    }
})