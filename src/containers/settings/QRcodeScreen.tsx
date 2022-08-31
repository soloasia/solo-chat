import React, { useContext } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Image, VStack } from 'native-base';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import style, { deviceWidth, deviceHeight } from '../../styles/index';
import { whiteColor, whiteSmoke, bgChat, textDesColor, textSecondColor } from '../../config/colors';
import { main_padding } from '../../config/settings';
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../utils/ThemeManager';
import themeStyle from '../../styles/theme';
import { LanguageContext } from '../../utils/LangaugeManager';

const QRcodeScreen = () => {
    const userInfo = useSelector((state: any) => state.user);
    const { theme }: any = useContext(ThemeContext);
    const {tr} :any = useContext(LanguageContext);
 
    return (
        <BaseComponent {...baseComponentData} title={tr("qr_code")}>
            <View style={styles.container}>
                <VStack justifyContent='space-between'>
                    <View style={{ width: deviceWidth, height: deviceHeight / 1.2, alignItems: 'center', justifyContent: 'center', }}>
                        <View style={{
                            width: deviceWidth * .8, height: deviceHeight * .45, backgroundColor: theme =='dark' ? '#232B36E1' : whiteSmoke,
                            borderRadius: 25, justifyContent: 'center', alignItems: 'center',
                            shadowColor: theme =='dark' ? "#FFFFFF" : '#000',
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.18,
                            shadowRadius: 1.00,

                            elevation: 1,
                        }}>
                            <View style={{ padding: main_padding, borderRadius: 10, backgroundColor: bgChat, marginTop: main_padding }}>
                                <QRCode
                                    value={userInfo.id.toString()}
                                    size={180}
                                    logoBackgroundColor='transparent'
                                />
                            </View>

                            <View style={{ marginTop: main_padding + 10 }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 14,textAlign: 'center', color: textSecondColor, paddingBottom: 10 }}>{tr("username")}</Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, fontWeight: '700', color: themeStyle[theme].textColor }}>{userInfo.username.toUpperCase()}</Text>
                            </View>
                        </View>
                        <LinearGradient
                            colors={['#F3AE2D', '#F0DF48', '#4B38F7D2', '#3276F5F3', '#0099FF']}
                            start={{ x: 0, y: 0 }}

                            end={{ x: 1, y: 1 }}
                            style={{ marginTop: 15, width: 105, borderRadius: 100, height: 105, position: 'absolute', top: '14%', left: '38%' }}
                        >
                            <View style={{ margin: 1.5, backgroundColor: whiteColor, justifyContent: 'center', borderRadius: 100, width: 102, height: 102, }}>
                                <Image source={userInfo.profile_photo?{uri:userInfo.profile_photo}:
                                    require('./../../assets/profile.png')} 
                                    resizeMode='cover' style={{ borderRadius: 100, width: 102, height: 102, overflow: 'hidden' }} 
                                />
                            </View>
                        </LinearGradient>
                    </View>
                </VStack>
            </View>
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default QRcodeScreen;
