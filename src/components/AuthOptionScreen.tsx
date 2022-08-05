import { HStack, useToast, VStack } from 'native-base';
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import style from '../styles';
import { deviceWidth, deviceHeight } from '../styles/index';
import { textDesColor, boxColor, inputColor, iconColor, labelColor, startBtn, whiteSmoke } from '../config/colors';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import LoginComponent from '../containers/auth/LoginScreen';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const AuthOptionScreen = (props: any) => {
    const navigate:any = useNavigation();

    // useEffect(() => {

    // }, []);
  
    return (
        <View style={{...style.flexContainerCenterWhite}}>
            <VStack>
                <View style={{width: deviceWidth, height: deviceHeight*0.4, }}>
                    <Lottie
                        source={require('./../assets/chat.json')} 
                        autoPlay loop 
                    /> 
                </View>
                <View style={{padding: 15, height: deviceHeight*0.3}}>
                    <Text style={{fontSize: 16, fontFamily: 'Lato-Bold', color: labelColor, textAlign: 'center'}}>Welcome to Chat APP!</Text>
                    <Text style={{fontSize: 14, fontFamily: 'Lato', color: labelColor, marginTop: 5, textAlign: 'center', lineHeight: 25}}>Chat app provided secure and fast messaging, join our team and enjoy online communication.</Text>
                </View>
                <VStack alignItems='center' justifyContent='center'>
                    <TouchableOpacity onPress={()=>navigate.navigate('Signup')} style={{height: 45,backgroundColor: startBtn, width: deviceWidth*.9, borderRadius: 25, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: whiteSmoke, fontFamily:'Lato', fontSize: 16}}>Get Started</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigate.navigate('Login')} style={{marginTop: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: textDesColor, fontFamily:'Lato', fontSize: 13}}>Already have an account?</Text>
                    </TouchableOpacity>
                    
                </VStack>
            </VStack>
        </View>
    )
}

export default AuthOptionScreen;

const styles = StyleSheet.create({
    
})
