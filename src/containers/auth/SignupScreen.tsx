import { HStack, Icon, ScrollView, useDisclose, useToast, VStack } from 'native-base';
import React, { useState, useEffect, useContext } from 'react'
import { ActivityIndicator, Image, NativeModules, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { inputColor, textDesColor, startBtn, whiteSmoke, whiteColor, bgChat, borderColor, baseColor, offlineColor } from '../../config/colors';
import { isWhitespaceOrEmpty, main_padding } from '../../config/settings';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import style from '../../styles';
import { deviceWidth } from '../../styles/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectImagePicker from '../../customs_items/SelectImagePicker';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import PhoneInput from "react-native-phone-number-input";
import { ThemeContext } from '../../utils/ThemeManager';
import themeStyle from '../../styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import { GET, POST } from '../../functions/BaseFuntion';
import AsynceStorage from '@react-native-async-storage/async-storage'
import { loadUser } from '../../actions/User';
import { AlertBox } from '../../customs_items/Components';
import CustomLoading from '../../customs_items/CustomLoading';
import { LanguageContext } from '../../utils/LangaugeManager';

const SignupScreen = (props: any) => {
    const firstNameRef = React.createRef<TextInput>();
    const lastNameRef = React.createRef<TextInput>();
    const passwordRef = React.createRef<TextInput>();
    const usernameRef = React.createRef<TextInput>();
    const phoneInputRef = React.createRef<PhoneInput>();
    const navigate:any = useNavigation();
    const { isOpen, onOpen, onClose } = useDisclose();
    const [inputBorder, setborderColor] = useState<any>(borderColor);
    const [formattedValue, setFormattedValue] = useState("");
    const mobile_token = useSelector((state: any) => state.mobile_token);
    const dispatch:any = useDispatch();
    const [isPopup, setIsOpen] = React.useState(false);
    const {theme} : any = useContext(ThemeContext);
    const {tr} : any = useContext(LanguageContext);

    const [state, setState] = useState<any>({
		firstname: '',
        lastname: '',
		password:'',
        phonenumber: '',
        username: '',
        profileAvatar:'',
        isSecure: true,
        validateFirstname:false,
        validateLastname:false,
        validatePassword:false,
        validateUsername:false,
        phoneNumberError:false,
        loading:false
	});
    const handleChange = (stateName: string, value: any) => {
		state[`${stateName}`] = value;
		setState({...state});
	};
    const onEnter = (ref: React.RefObject<TextInput>) => {
        if (ref.current !== null) {
            ref.current.focus()
        }
    }
    const handleSelectProfile = () => {
       onOpen()
    }
    const onSignup =  () => {
        if(isWhitespaceOrEmpty(state.firstname)){
            handleChange('validateFirstname',true)
        }else if(isWhitespaceOrEmpty(state.lastname)){
            handleChange('validateLastname',true)
        }else if(isWhitespaceOrEmpty(state.username)){
            handleChange('validateUsername',true)
        }else if(isWhitespaceOrEmpty(state.phonenumber)){
            handleChange('phoneNumberError',true)
        }else if(isWhitespaceOrEmpty(state.password)){
            handleChange('validatePassword',true)
        }else{
            handleChange('loading',true)
            const formdata = new FormData();
            formdata.append("first_name",state.firstname);
            formdata.append("last_name",state.lastname);
            formdata.append("username",state.username);
            formdata.append("phone",formattedValue);
            formdata.append("password",state.password);
            formdata.append("profile_photo",state.profileAvatar);
            formdata.append("mobile_token",mobile_token);
            POST('user/register', formdata)
            .then(async (result: any) => {
              if (result.access_token) {
                const formdata = new FormData();
                formdata.append("token",result.access_token);
                await AsynceStorage.setItem('@token', result.access_token);
                dispatch({ type: 'LOAD_USER_TOKEN', value: result.access_token });
                GET('me/detail')
                .then((res) => {
                    if(res.status){
                        dispatch(loadUser(res.data))
                    }
                })
                navigate.reset({
                    index: 0,
                    routes: [{ name: 'Main' }]
                })
                handleChange('loading', false);
              }else{
                handleChange('loading', false);
                setIsOpen(true)
              }
            })
            .catch(e => {
              handleChange('loading', false);
            });
        }
        // navigate.navigate('Main')
    }
    const onChange = (data:any) =>{
        handleChange('profileAvatar', data.data);
    }
    function getSystemLocale() {
        if(Platform.OS === 'ios'){
            const locale = NativeModules.SettingsManager.settings.AppleLocale ||  NativeModules.SettingsManager.settings.AppleLanguages[0];
            return locale;
        }else{
            const locale = NativeModules.I18nManager.localeIdentifier
            return locale;
        }
    }
    const onConfirm = () =>{
        setIsOpen(false);
        navigate.navigate('Login');
    }

    return (
        <BaseComponent {...baseComponentData} title={''}>
            <ScrollView>
                <View style={{flex:1,backgroundColor: themeStyle[theme].backgroundColor}}>
                    <TouchableOpacity onPress={()=>handleSelectProfile()} style={{alignSelf: 'center',marginTop:50}}>
                        <LinearGradient
                            colors={['#F3AE2D', '#F0DF48', '#4B38F7D2', '#3276F5F3', '#0099FF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{width: 120, borderRadius: 100, height: 120}}
                        >
                            <View style={{margin: 2, backgroundColor: whiteColor,justifyContent: 'center',borderRadius: 100}}>
                                {state.profileAvatar != '' ?
                                    <Image source={{uri: 'data:image/png;base64,'+state.profileAvatar}} resizeMode='cover' style={{borderRadius: 100, width: 116, height:116, overflow: 'hidden'}} />
                                : <Image source={require('./../../assets/profile.png')} resizeMode='cover' style={{borderRadius: 100, width: 116, height:116, overflow: 'hidden'}} />}
                            </View>
                        </LinearGradient>
                        <View style={{position: 'absolute', bottom: 5, right:7, backgroundColor: whiteColor, borderRadius: 20, padding: 5}}>
                            <Icon name='camera-outline' as={Ionicons} size='sm' />
                        </View>
                    </TouchableOpacity>
                    <View style={{alignItems: 'center', justifyContent: 'center',marginTop: main_padding}}>
                        <Text style={style.pBold}>Avatar</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',width:'100%', padding: main_padding, marginTop: main_padding * 2}}>
                        <View style={{width:deviceWidth/2 - 20}}>
                            <TextInput 
                                ref={firstNameRef}
                                style={[styles.input,style.p,{width: '100%',backgroundColor: themeStyle[theme].primary,borderColor:state.validateFirstname?offlineColor:inputBorder}]}
                                placeholder='Firstname'
                                value={state.firstname}
                                returnKeyType='next'
                                onSubmitEditing={() => onEnter(lastNameRef)}
                                onChangeText={(text)=>{
                                    handleChange('firstname',text);
                                    handleChange('validateFirstname',false);
                                }}
                                placeholderTextColor={'#ADB9C6'}
                            />
                            {state.validateFirstname?<Text style={[style.p,{fontSize:12,color:'red',paddingTop:10,textAlign:'left'}]}>* Please fill your firstname</Text>:''}
                        </View>
                        <View style={{width:deviceWidth/2 - 20}}>
                            <TextInput 
                                ref={lastNameRef}
                                style={[styles.input,style.p,{width: '100%',backgroundColor: themeStyle[theme].primary,borderColor:inputBorder}]}
                                placeholder='Lastname'
                                value={state.lastname}
                                returnKeyType='next'
                                onSubmitEditing={() => onEnter(usernameRef)}
                                onChangeText={(text)=>{
                                    handleChange('lastname',text);
                                    handleChange('validateLastname',false);

                                }}
                                placeholderTextColor={'#ADB9C6'}
                            />
                            {state.validateLastname?<Text style={[style.p,{fontSize:12,color:'red',paddingTop:10,textAlign:'left'}]}>* Please fill your lastname</Text>:''}
                        </View>
                    </View>
                    <VStack px={main_padding} marginTop={2}>
                        <TextInput 
                            ref={usernameRef}
                            style={[styles.input,style.p,{backgroundColor: themeStyle[theme].primary,borderColor:inputBorder}]}
                            placeholder='Username'
                            autoCapitalize='none'
                            value={state.username}
                            returnKeyType='next'
                            onChangeText={(text)=>{
                                handleChange('username',text);
                                handleChange('validateUsername',false);
                            }}
                            placeholderTextColor={'#ADB9C6'}
                        />
                        {state.validateUsername?<Text style={[style.p,{fontSize:12,color:'red',paddingTop:10,textAlign:'left'}]}>* Please fill your username</Text>:''}
                        <PhoneInput
                            ref={phoneInputRef}
                            defaultValue={state.phonenumber}
                            defaultCode={getSystemLocale().split('_') == undefined?'EN':getSystemLocale().split('_')[1]}
                            layout='second'
                            onChangeText={(text) => {
                                handleChange('phonenumber', text);
                                handleChange('phoneNumberError',false)
                            }}
                            onChangeFormattedText={(text) => {
                                setFormattedValue(text);
                            }}
                            placeholder="XX XXX XXXX"
                            textContainerStyle={{backgroundColor:themeStyle[theme].primary,borderRadius:25}}
                            containerStyle={{width:'100%',height:45,borderColor:state.phoneNumberError?offlineColor:borderColor,borderWidth:0.4,borderRadius:25,marginTop:20,backgroundColor:themeStyle[theme].primary}}
                            textInputStyle={[style.p,{height:45}]}
                        />
                        {state.phoneNumberError?<Text style={[style.p,{fontSize:13,color:'red',paddingTop:10,textAlign:'left'}]}>* Please fill your phone number</Text>:''}
                        <View style={{ marginTop: 20}}>
                            <TextInput 
                                ref={passwordRef}
                                style={[styles.input,style.p,{backgroundColor: themeStyle[theme].primary,borderColor:inputBorder}]}
                                placeholder='Password'
                                value={state.password}
                                returnKeyType='go'
                                onSubmitEditing={onSignup}
                                onChangeText={(text)=>{
                                    handleChange('password',text);
                                    handleChange('validatePassword',false);
                                }}
                                placeholderTextColor={'#ADB9C6'}
                                secureTextEntry={state.isSecure}
                            />
                            {state.validatePassword?<Text style={[style.p,{fontSize:12,color:'red',paddingTop:10,textAlign:'left'}]}>* Please fill your password</Text>:''}
                            <TouchableOpacity onPress={()=>handleChange('isSecure',!state.isSecure)} style={{position: 'absolute', bottom: 7, right: 10,borderWidth:0.5,borderRadius:20,width:70,height:30,justifyContent:'center',alignItems:'center',borderColor:startBtn}}>
                                <Text style={{fontFamily: 'lato', fontSize: 13, color: startBtn}}>{state.isSecure? tr("view") +"*" :  tr("hide") +"*"}</Text>
                            </TouchableOpacity>
                        </View>
                    </VStack>
                    <View style={{width: deviceWidth*.9,justifyContent: 'center',alignItems:'center',marginTop:20,alignSelf:'center'}}>
                        <TouchableOpacity onPress={onSignup} style={{height: 45,backgroundColor: startBtn, width: deviceWidth*.9, borderRadius: 25, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={[style.p,{color:whiteColor}]}>Sign Up</Text>
                        </TouchableOpacity>
                        <HStack marginTop='3' alignItems='center' justifyContent='center'>
                            <Text style={[style.p,{color: textDesColor,fontSize:12}]}>Already have an account? </Text>
                            <TouchableOpacity onPress={()=>navigate.navigate('Login')}>
                                <Text style={[style.p,{color: startBtn}]}> Log In </Text>
                            </TouchableOpacity>
                        </HStack>
                    </View> 
                </View>
                <SelectImagePicker 
                    visible={isOpen}
                    onChange={(data:any)=>onChange(data)}
                    onClose={() => onClose()}
                />
            </ScrollView>
            <CustomLoading
                visible={state.loading}
            />
            <AlertBox
                title={'Something went wrong!'}
                des={"Your username already exits!"}
                btn_cancle={"No"}
                btn_name={'Login'}
                onCloseAlert={()=>setIsOpen(false)}
                onConfirm={onConfirm}
                isOpen={isPopup}
            />
        </BaseComponent>
    )
}

export default SignupScreen;

const styles = StyleSheet.create({
    input: {
        backgroundColor: bgChat, 
        height: 45,
        width: '100%', 
        borderRadius: 25, 
        paddingHorizontal: main_padding, 
        borderWidth:0.5,
    },
    icon: {
        paddingHorizontal: 5,
    },
})
