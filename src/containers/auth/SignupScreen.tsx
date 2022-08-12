import { HStack, Icon, useDisclose, useToast, VStack } from 'native-base';
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { inputColor, textDesColor, startBtn, whiteSmoke, whiteColor, bgChat } from '../../config/colors';
import { main_padding } from '../../config/settings';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import style from '../../styles';
import { deviceWidth } from '../../styles/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectImagePicker from '../../customs_items/SelectImagePicker';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import reactotron from 'reactotron-react-native';

const SignupScreen = (props: any) => {
    const navigate:any = useNavigation();

    const { isOpen, onOpen, onClose } = useDisclose();
    const [isVisible, setVisible] = useState(false)
    const [token, setToken] = useState('')
    const [profileAvatar, setProfile] = useState('')
    const [state, setState] = useState<any>({
		firstname: '',
        lastname: '',
		password:'',
        phonenumber: '',
        username: '',
        isSecure: true,
	});

    useEffect(() => {
        getToken()
    }, []);

    const getToken = async () => {
        const token = await messaging().getToken();
        setToken(token);
    }
    const handleSelectProfile = () => {
       onOpen()
    }

    const handleSignup = async () => {
        let requestBody = {
            "first_name": state.firstname,
            "last_name": state.lastname,
            "username": state.username,
            "phone": state.phonenumber,
            "mobile_token": token,
            "password": state.password,
            "profile_photo": 'data:image/png;base64,'+profileAvatar
        }
        navigate.navigate('Main')
    }
    const onChange = (data:any) =>{
        setProfile(data.data)
    }

    return (
        <BaseComponent {...baseComponentData} title={'Sign Up'}>
            <View style={{...style.flexContainerCenterWhite, justifyContent: 'flex-start'}}>
                <View style={{flex: 3, justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=>handleSelectProfile()} style={{alignSelf: 'center'}}>
                        <LinearGradient
                            colors={['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#3654FF', '#002FFF']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={{marginTop: 15, width: 120, borderRadius: 100, height: 120}}
                        >
                            <View style={{ flex: 1,margin: 1, backgroundColor: whiteColor,justifyContent: 'center',borderRadius: 100}}>
                                {profileAvatar != '' ?
                                    <Image source={{uri: 'data:image/png;base64,'+profileAvatar}} resizeMode='cover' style={{borderRadius: 100, width: 118, height:118, overflow: 'hidden'}} />
                                : <Image source={require('./../../assets/profile.png')} resizeMode='cover' style={{borderRadius: 100, width: 118, height:118, overflow: 'hidden'}} />}
                            </View>
                        </LinearGradient>
                        <View style={{position: 'absolute', bottom: 5, right:7, backgroundColor: whiteColor, borderRadius: 20, padding: 5}}>
                            <Icon name='camera-outline' as={Ionicons} size='sm' />
                        </View>
                    </TouchableOpacity>
                    <View style={{alignItems: 'center', justifyContent: 'center',marginTop: main_padding}}>
                        <Text style={{textAlign: 'center', fontFamily: 'lato', color: textDesColor, fontSize: 18, marginLeft: main_padding}}>Avatar</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: deviceWidth, padding: main_padding, marginTop: main_padding}}>
                        <TextInput 
                            style={{...styles.input, width: '47%'}}
                            placeholder='Firtname'
                            value={state.firstname}
                            onChangeText={(text)=>setState({
                                firstname: text,
                                lastname: state.lastname,
                                password: state.password,
                                isSecure: state.isSecure,
                                phonenumber: state.phonenumber,
                                username: state.username
                            })}
                            placeholderTextColor={textDesColor}
                        />
                        <TextInput 
                            style={{...styles.input, width: '47%'}}
                            placeholder='Lastname'
                            value={state.lastname}
                            onChangeText={(text)=>setState({
                                lastname: text,
                                firstname: state.firstname,
                                password: state.password,
                                isSecure: state.isSecure,
                                phonenumber: state.phonenumber,
                                username: state.username
                            })}
                            placeholderTextColor={textDesColor}
                        />
                    </View>
                    <VStack px={main_padding}>
                        <TextInput 
                            style={{...styles.input}}
                            placeholder='Username'
                            value={state.username}
                            onChangeText={(text)=>setState({
                                username: text,
                                lastname: state.lastname,
                                password: state.password,
                                isSecure: state.isSecure,
                                phonenumber: state.phonenumber,
                                firstname: state.firstname
                            })}
                            placeholderTextColor={textDesColor}
                        />
                        <TextInput 
                            style={{...styles.input,marginTop: 15}}
                            placeholder='Phone number'
                            value={state.phonenumber}
                            onChangeText={(text)=>setState({
                                phonenumber: text,
                                firstname: state.firstname,
                                lastname: state.lastname,
                                password: state.password,
                                isSecure: state.isSecure,
                                username: state.username

                            })}
                            keyboardType='decimal-pad'
                            placeholderTextColor={textDesColor}
                        />
                        <View style={{ marginTop: 15}}>
                            <TextInput 
                                style={{...styles.input}}
                                placeholder='Password'
                                value={state.password}
                                onChangeText={(text)=>setState({
                                    password: text,
                                    firstname: state.firstname,
                                    lastname: state.lastname,
                                    isSecure: state.isSecure,
                                    username: state.username,
                                    phonenumber: state.phonenumber,

                                })}
                                placeholderTextColor={textDesColor}
                                secureTextEntry={state.isSecure}
                            />
                            <TouchableOpacity 
                                onPress={()=> setState({
                                    isSecure:!state.isSecure,
                                    username: state.username,
                                    password: state.password,
                                    firstname: state.firstname,
                                    lastname: state.lastname,
                                    phonenumber: state.phonenumber
                                })} 
                                style={{position: 'absolute', bottom: 12, right: 15}}
                            >
                                <Icon name={state.isSecure ? 'eye-off-outline' :'eye-outline'} as={Ionicons} size='sm' />
                            </TouchableOpacity>
                        </View>
                    </VStack>
                </View>
                <View style={{flex: 1, width: deviceWidth*.9,justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=>handleSignup()} style={{height: 45,backgroundColor: startBtn, width: deviceWidth*.9, borderRadius: 25, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: whiteSmoke, fontFamily:'Lato', fontSize: 16}}>Sign Up</Text>
                    </TouchableOpacity>
                    <HStack marginTop='3' alignItems='center' justifyContent='center'>
                        <Text style={{color: textDesColor, fontFamily:'Lato', fontSize: 13}}>Already have an account? </Text>
                        <TouchableOpacity onPress={()=>navigate.navigate('Login')}>
                            <Text style={{color: startBtn, fontFamily:'Lato-bold', fontSize: 13}}> Log In </Text>
                        </TouchableOpacity>
                    </HStack>
                </View> 
            </View>
            <SelectImagePicker 
                visible={isOpen}
                onChange={(data:any)=>onChange(data)}
                onClose={() => onClose()}
            />
        </BaseComponent>
    )
}

export default SignupScreen;

const styles = StyleSheet.create({
    input: {
        backgroundColor: bgChat, 
        height: 45,width: '100%', 
        borderRadius: 25, 
        paddingHorizontal: main_padding, 
        color: textDesColor, 
        fontFamily: 'lato', 
        fontSize: 13
    },
    icon: {
        paddingHorizontal: 5,
    },
})
