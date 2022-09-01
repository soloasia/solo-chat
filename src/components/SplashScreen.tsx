import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, Image, View } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deviceHeight, deviceWidth } from '../styles';
import Lottie from 'lottie-react-native';
import { ThemeContext } from '../utils/ThemeManager';
import themeStyle from '../styles/theme';

const SplashScreen = (props:any) => {
    const navigate: any = useNavigation();
    const insets = useSafeAreaInsets();
    const {theme} : any = useContext(ThemeContext);

    return (
        <LinearGradient start={{x:0, y: 0}} end={{x: 1, y: 1}} colors={[themeStyle[theme].backgroundColor,themeStyle[theme].backgroundColor, themeStyle[theme].backgroundColor, themeStyle[theme].backgroundColor]} style={{flex:1,width:deviceWidth,justifyContent:'center',alignItems:'center'}}>
            <View style={{width: deviceWidth, height: deviceHeight*0.4, }}>
                <Lottie
                    source={require('../assets/chats.json')} 
                    autoPlay loop 
                /> 
            </View>
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