import { HStack, Icon, useToast, VStack } from 'native-base';
import React, { useState, useEffect, useContext } from 'react'
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { inputColor, textDesColor, startBtn, whiteSmoke, bgChat } from '../../config/colors';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import Lottie from 'lottie-react-native';
import style, { deviceWidth } from '../../styles';
import { main_padding } from '../../config/settings';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import { ThemeContext } from '../../utils/ThemeManager';
import themeStyle from '../../styles/theme';

const LoginScreen = (props: any) => {
    const navigate:any = useNavigation();
    const [token, setToken] = useState('')
    const {theme} : any = useContext(ThemeContext);

    useEffect(() => {
        getToken()
    }, []);

    const getToken = async () => {
        const token = await messaging().getToken();
        setToken(token);
    }

    const [state, setState] = useState<any>({
		username: '',
		password:'',
        isSecure: true

	});

    const handleLogin = () => {
        let bodyRequest = {
            "username": state.username,
            "password": state.password,
            "mobile_token": token
        }
    }


    return (
        <BaseComponent {...baseComponentData} title={'Log In'}>
            <View style={[style.flexContainerCenterWhite,{backgroundColor : themeStyle[theme].backgroundColor}]}>
                <VStack justifyContent='space-between' alignItems='center'>
                    <View style={{flex: 2.5, width: deviceWidth*.9, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 150, height: 150}}>
                            <Lottie
                                source={{uri:'https://assets2.lottiefiles.com/private_files/lf30_z588h1j0.json'}} 
                                autoPlay loop 
                            /> 
                        </View>  
                    </View>
                    <View style={{flex: 3.5, width: deviceWidth*.9, paddingVertical: main_padding}}>
                        <TextInput 
                            style={{height: 45, borderRadius: 25, paddingHorizontal: main_padding, color: textDesColor, fontFamily: 'lato', fontSize: 13,backgroundColor: themeStyle[theme].primary}}
                            placeholder='Username'
                            value={state.username}
                            onChangeText={(text)=>setState({
                                username: text,
                                password: state.password,
                                isSecure: state.isSecure
                            })}
                            placeholderTextColor={textDesColor}
                        />
                        <View style={{ marginTop: 15}}>
                            <TextInput 
                                style={{height: 45, borderRadius: 25, paddingHorizontal: main_padding, color: textDesColor, fontFamily: 'lato', fontSize: 13,backgroundColor: themeStyle[theme].primary}}
                                placeholder='Password'
                                value={state.password}
                                onChangeText={(text)=>setState({
                                    password: text,
                                    isSecure: state.isSecure,
                                    username: state.username,
                                })}
                                placeholderTextColor={textDesColor}
                                secureTextEntry={state.isSecure}
                            />
                            <TouchableOpacity onPress={()=> setState({isSecure:!state.isSecure,username: state.usernamedfafa,password: state.password,})} style={{position: 'absolute', bottom: 15, right: 15}}>
                                <Icon name={state.isSecure ? 'eye-off-outline' :'eye-outline'} as={Ionicons} size='sm' />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{marginTop: 10, padding: 7, width: deviceWidth*.4}}>
                            <Text style={{fontFamily: 'lato', fontSize: 13, color: startBtn}}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View> 
                    <View style={{flex: 1, width: deviceWidth*.9,justifyContent: 'center'}}>
                        <TouchableOpacity onPress={()=>handleLogin()} style={{height: 45,backgroundColor: startBtn, width: deviceWidth*.9, borderRadius: 25, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: whiteSmoke, fontFamily:'Lato', fontSize: 16}}>Log In</Text>
                        </TouchableOpacity>
                        <HStack marginTop='2' alignItems='center' justifyContent='center'>
                            <Text style={{color: textDesColor, fontFamily:'Lato', fontSize: 13}}>Don't have an account? </Text>
                            <TouchableOpacity onPress={()=>navigate.navigate('Signup')}>
                                <Text style={{color: startBtn, fontFamily:'Lato-bold', fontSize: 13}}> Sign up </Text>
                            </TouchableOpacity>
                        </HStack>
                    </View> 
                </VStack>
            </View>
        </BaseComponent>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#ffff',
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 45,
        color: "#aaa",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
    },
    icon: {
        paddingHorizontal: 5,
    },
})
