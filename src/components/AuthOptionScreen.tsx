import { HStack, useToast, VStack } from 'native-base';
import React, { useState, useEffect, useContext } from 'react'
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import style from '../styles';
import { deviceWidth, deviceHeight } from '../styles/index';
import { textDesColor, boxColor, inputColor, iconColor, labelColor, startBtn, whiteSmoke } from '../config/colors';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import LoginComponent from '../containers/auth/LoginScreen';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../utils/ThemeManager';
import themeStyle from '../styles/theme';
import { TextItem } from '../customs_items/Components';
import { LanguageContext } from '../utils/LangaugeManager';

const AuthOptionScreen = (props: any) => {
    const navigate:any = useNavigation();
    const {theme} : any = useContext(ThemeContext);
    const {tr} : any = useContext(LanguageContext);
    return (
        <View style={{...style.flexContainerCenterWhite,backgroundColor : themeStyle[theme].backgroundColor}}>
            <VStack>
                <View style={{width: deviceWidth, height: deviceHeight*0.4, }}>
                    <Lottie
                        source={require('./../assets/chats.json')} 
                        autoPlay loop 
                    /> 
                </View>
                <View style={{padding: 15, height: deviceHeight*0.3}}>
                    <TextItem style={[style.pBold,{textAlign: 'center'}]}>{tr("welcome_to_chat_app")} !</TextItem>
                    <TextItem style={[style.p,{color: labelColor, marginTop: 5, textAlign: 'center', lineHeight: 25}]}>{tr("chat_app_desc")}</TextItem>
                </View>
                <VStack alignItems='center' justifyContent='center'>
                    <TouchableOpacity onPress={()=>navigate.navigate('Login')} style={{height: 45,backgroundColor: startBtn, width: deviceWidth*.9, borderRadius: 25, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={[style.p,{color:whiteSmoke}]}>{tr("get_started")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigate.navigate('Signup')} style={{marginTop: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <TextItem style={style.p}>{tr("dont_have_acc")} {tr("sign_up_here")}</TextItem>
                    </TouchableOpacity>
                    
                </VStack>
            </VStack>
        </View>
    )
}

export default AuthOptionScreen;

const styles = StyleSheet.create({
    
})
