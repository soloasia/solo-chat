import React, { useState, useContext,createRef, useEffect } from 'react'
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { HStack, VStack } from 'native-base';
import { textDesColor, startBtn, whiteSmoke, bgChat, borderColor, offlineColor, textColor } from '../../config/colors';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import Lottie from 'lottie-react-native';
import style, { deviceWidth } from '../../styles';
import { isWhitespaceOrEmpty, main_padding } from '../../config/settings';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../utils/ThemeManager';
import themeStyle from '../../styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomLoading from '../../customs_items/CustomLoading';
import { GET, POST } from '../../functions/BaseFuntion';
import { AlertBox, TextItem } from '../../customs_items/Components';
import AsynceStorage from '@react-native-async-storage/async-storage'
import { loadUser } from '../../actions/User';
import { LanguageContext } from '../../utils/LangaugeManager';
import messaging from '@react-native-firebase/messaging';

const LoginScreen = (props: any) => {
    const usernameRef = createRef<TextInput>();
    const passwordRef = createRef<TextInput>();
    const navigate: any = useNavigation();
    const { theme }: any = useContext(ThemeContext);
    const { tr }: any = useContext(LanguageContext);
    // const mobile_token = useSelector((state: any) => state.mobile_token);
    const [inputBorder, setborderColor] = useState<any>(borderColor);
    const [isOpen, setIsOpen] = React.useState(false);
    const dispatch: any = useDispatch();
    const insets = useSafeAreaInsets();
    const [state, setState] = useState<any>({
        username: '',
        password: '',
        isSecure: true,
        isValidateForm: false,
        loading: false,
        mobile_token:null
    });
    useEffect(() => {
        requestMobileToken();
    }, []);
    const requestMobileToken = async () => {
        const token = await messaging().getToken();
        handleChange('mobile_token', token);
    };
    const handleChange = (stateName: string, value: any) => {
        state[`${stateName}`] = value;
        setState({ ...state });
    };
    const onEnter = (ref: React.RefObject<TextInput>) => {
        if (ref.current !== null) {
            ref.current.focus()
        }
    }
    const onLogin = () => {
        if (isWhitespaceOrEmpty(state.username) || isWhitespaceOrEmpty(state.password)) {
            handleChange('isValidateForm', true)
            setborderColor(offlineColor)
        } else {
            handleChange('loading', true)
            const formdata = new FormData();
            formdata.append("username", state.username);
            formdata.append("password", state.password);
            formdata.append("mobile_token", state.mobile_token);
            POST('user/login', formdata)
                .then(async (result: any) => {
                    if (result.access_token) {
                        const formdata = new FormData();
                        formdata.append("token", result.access_token);
                        await AsynceStorage.setItem('@token', result.access_token);
                        dispatch({ type: 'LOAD_USER_TOKEN', value: result.access_token });
                        GET('me/detail')
                            .then((res) => {
                                if (res.status) {
                                    dispatch(loadUser(res.data))
                                }
                        })
                        navigate.reset({
                            index: 0,
                            routes: [{ name: "Main" }]
                        })
                        handleChange('loading', false);
                    } else {
                        handleChange('loading', false);
                        setIsOpen(true)
                    }
                })
           
        }
    }
    const onConfirm = () => {
        setIsOpen(false);
        navigate.navigate('Signup');
    }
    return (
        <BaseComponent {...baseComponentData} title={''}>
            <View style={[style.flexContainerCenterWhite,{backgroundColor : themeStyle[theme].backgroundColor}]}>
                <VStack justifyContent='space-between' alignItems='center'>
                    <View style={{flex: 2.5, width: deviceWidth*.9, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 300, height: 150}}>
                            <Lottie
                                source={require('../../assets/login.json')}
                                autoPlay loop
                            />
                        </View>
                    </View>
                    <TouchableWithoutFeedback accessible={false}>
                        <View style={{ flex: 3.5, width: deviceWidth * .9, paddingVertical: main_padding }}>
                            <VStack>
                                <TextInput
                                    ref={usernameRef}
                                    style={[style.p, styles.input, { backgroundColor: themeStyle[theme].primary, borderColor: inputBorder, color: themeStyle[theme].textColor }]}
                                    placeholder={tr("username")}
                                    value={state.username}
                                    placeholderTextColor={'#ADB9C6'}
                                    returnKeyType='done'
                                    onSubmitEditing={() => onEnter(passwordRef)}
                                    onChangeText={(text) => {
                                        handleChange('username', text)
                                    }}
                                />
                                {state.isValidateForm ? <Text style={[style.p, { fontSize: 13, color: 'red', paddingTop: 10, textAlign: 'left' }]}>* Please fill your username</Text> : <View />}
                            </VStack>
                            <View style={{ marginTop: 20 }}>
                                <TextInput
                                    ref={passwordRef}
                                    style={[style.p, styles.input, { backgroundColor: themeStyle[theme].primary, borderColor: inputBorder, color: themeStyle[theme].textColor }]}
                                    placeholder={tr("password")}
                                    value={state.password}
                                    secureTextEntry={state.isSecure}
                                    placeholderTextColor={'#ADB9C6'}
                                    returnKeyType='go'
                                    onSubmitEditing={onLogin}
                                    onChangeText={(text) => {
                                        handleChange('password', text)
                                    }}
                                />
                                <TouchableOpacity onPress={() => handleChange('isSecure', !state.isSecure)} style={{ position: 'absolute', bottom: 7, right: 10, borderWidth: 0.5, borderRadius: 20, width: 70, height: 30, justifyContent: 'center', alignItems: 'center', borderColor: startBtn }}>
                                    <Text style={{ fontFamily: 'lato', fontSize: 13, color: startBtn }}>{state.isSecure ?  tr("view") +"*" :  tr("hide") +"*"}</Text>
                                </TouchableOpacity>
                            </View>
                            {state.isValidateForm ? <Text style={[style.p, { fontSize: 13, color: 'red', paddingTop: 10, textAlign: 'left' }]}>* Please fill your password</Text> : <View />}
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{width: deviceWidth*.9,justifyContent: 'center',paddingBottom:Platform.OS ==='ios'? insets.bottom:20}}>
                        <TouchableOpacity onPress={onLogin} style={{height: 45,backgroundColor: startBtn, width: deviceWidth*.9, borderRadius: 25, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={[style.p,{color:whiteSmoke}]}>{tr("log_in")}</Text>
                        </TouchableOpacity>
                        <HStack marginTop='3' alignItems='center' justifyContent='center'>
                            <TextItem style={[style.p,{fontSize:12}]}>{tr("dont_have_acc")} </TextItem>
                            <TouchableOpacity onPress={()=>navigate.navigate('Signup')}>
                                <Text style={[style.p,{color:startBtn}]}> {tr("sign_up_here")}</Text>
                            </TouchableOpacity>
                        </HStack>
                    </View>
                </VStack>
            </View>
            <CustomLoading
                visible={state.loading}
            />
            <AlertBox
                title={'Something went wrong!'}
                des={"Your username and password is wrong"}
                btn_cancle={"No"}
                btn_name={'Register'}
                onCloseAlert={() => setIsOpen(false)}
                onConfirm={onConfirm}
                isOpen={isOpen}
            />
        </BaseComponent>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 15,
        alignItems: 'center',
        minHeight: 45,
        borderWidth: 0.5,
        borderRadius: 25
    },
    icon: {
        paddingHorizontal: 5,
    },
})
