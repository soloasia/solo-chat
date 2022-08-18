import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, Image, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deviceWidth } from '../styles';

const SplashScreen = (props:any) => {
    const navigate: any = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient start={{x:0, y: 0}} end={{x: 1, y: 1}} colors={['#163e58','#085467', '#055769', '#006472']} style={{flex:1,width:deviceWidth,justifyContent:'center',alignItems:'center'}}>
        </LinearGradient>
    )
}
export default React.memo(SplashScreen)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20
      },
      textSmall: {
        fontSize: 20,
        color: '#ffeb3b'
      }
})