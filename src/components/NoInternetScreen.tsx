import React from 'react';
import { StyleSheet, View,Image,Text, TouchableOpacity } from 'react-native';
import { baseColor, textColor, whiteColor, whiteSmoke } from '../config/colors';
import { deviceWidth } from '../styles';
import FastImage from 'react-native-fast-image';
import { main_padding } from '../config/settings';
import { loadData } from '../functions/LoadData';
import { useDispatch } from 'react-redux';

const NoInternetScreen = () => {
  const dispatch: any = useDispatch();

  const _onRetryNetwork = () => {
    console.log('=====data===== retry')
    loadData(dispatch)
  }

  return (
    <View style={styles.safeAreaContainer}>
      <View style={styles.iconContainer}>
        <FastImage source={require('../assets/lost-wifi-connection.png')} style={{width:deviceWidth - 40,height:deviceWidth - 100}} resizeMode={FastImage.resizeMode.contain}/>
        <Text style={{ color: baseColor,fontFamily: 'Montserrat-Regular',fontSize:18  }}>No Internet Connection</Text>
        <Text style={{ color: textColor,fontFamily: 'Montserrat-Regular',textAlign:'center',paddingTop:5 }}>Please check your network connectivity and try again.</Text>
      </View>
      <TouchableOpacity 
        onPress={_onRetryNetwork}
        style={{
          padding: main_padding, backgroundColor: baseColor, height: 50, marginTop: main_padding,
          width: deviceWidth*.7, justifyContent: 'center', borderRadius: 10,
          alignItems: 'center'}}>
        <Text style={{fontFamily: 'Montserrat-Regular',fontSize:18, color: whiteSmoke }}>RE-TRY</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(NoInternetScreen);

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  check: {
    textAlign: 'center',
    color: textColor,
    marginTop: 20
  }
});