import React from 'react';
import { StyleSheet, View,Image,Text } from 'react-native';
import { baseColor, textColor } from '../config/colors';
import { deviceWidth } from '../styles';

const NoInternetScreen = () => {
  return (
    <View style={styles.safeAreaContainer}>
      <View style={styles.iconContainer}>
        <Image source={require('../assets/lost-wifi-connection.webp')} style={{width:deviceWidth - 40,height:deviceWidth - 100}}/>
        <Text style={{ color: baseColor,fontFamily: 'Montserrat-Regular',fontSize:18  }}>No Internet Connection</Text>
        <Text style={{ color: textColor,fontFamily: 'Montserrat-Regular',textAlign:'center',paddingTop:5 }}>Please check your network connectivity and try again.</Text>
      </View>
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