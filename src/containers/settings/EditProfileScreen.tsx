//import liraries
import React, { Component, useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Animated, Modal, Alert, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { baseColor, boxColor, chatText, startBtn, textDesColor, textSecondColor, whiteSmoke, textColor } from '../../config/colors';
import { large_padding, main_padding } from '../../config/settings';
import { AlertBox, TextItem, UserAvatar } from '../../customs_items/Components';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import style, { deviceWidth } from '../../styles';
import ImagePicker from 'react-native-image-crop-picker';
import themeStyle from '../../styles/theme';
import { Icon, theme, useDisclose, VStack } from 'native-base';
import { ThemeContext } from '../../utils/ThemeManager';
import { useDispatch, useSelector } from 'react-redux';
import SelectImagePicker from '../../customs_items/SelectImagePicker';
import reactotron from 'reactotron-react-native';
import { GET, POST } from '../../functions/BaseFuntion';
import { useNavigation } from '@react-navigation/native';
import { loadUser } from '../../actions/User';
import CustomLoading from '../../customs_items/CustomLoading';
import LottieView from 'lottie-react-native';
import { deviceHeight, activeOpacity } from '../../styles/index';
import { message } from '../../temp_data/Setting';

// create a component
const EditProfileScreen = () => {
    const navigate: any = useNavigation();

    const { theme }: any = useContext(ThemeContext);
    const { isOpen, onOpen, onClose } = useDisclose();
    const dispatch: any = useDispatch();

    const userInfo = useSelector((state: any) => state.user);
    const mobile_token = useSelector((state: any) => state.mobile_token);

    const [state, setState] = useState<any>({
        firstname: userInfo.first_name,
        lastname: userInfo.last_name,
        password: '',
        phonenumber: userInfo.phone,
        username: userInfo.username,
        profileImg: userInfo.profile_photo,
        isSecure: true,
        loading: false,
        isVisible: false,
        newPassword: '',
        confirmPassword: '',
        isAlertShow: false
    });
    const handleChange = (stateName: string, value: any) => {
        state[`${stateName}`] = value;
        setState({ ...state });
    };

    const handleShowProfileImg = () => {
        navigate.navigate('DisplayFullImg', { imgDisplay: state.profileImg })
    }

    const onChange = (data: any) => {
        handleChange('profileImg', 'data:image/png;base64,' + data.data)
    }

    const handleSave = () => {

        handleChange('loading', true)
        const formdata = new FormData();
        formdata.append("username", state.username);
        formdata.append("first_name", state.firstname);
        formdata.append("last_name", state.lastname);
        formdata.append("phone", state.phonenumber);
        formdata.append("profile_photo", state.profileImg);
        POST('me/update', formdata)
            .then(async (result: any) => {
                if (result.status) {
                    dispatch(loadUser(result.data))
                    navigate.goBack()
                    // navigate.navigate('Main')
                    handleChange('loading', false);
                } else {
                    handleChange('loading', false);
                }
            })
            .catch(e => {
                handleChange('loading', false);
            });
    }

    const handleChangePassword = () => {
        const formdata = new FormData();
        formdata.append("current_password", state.password);
        formdata.append("password", state.newPassword);
        formdata.append("password_confirmation", state.confirmPassword)
        if(state.password !='' && state.newPassword !='' && state.confirmPassword!=''){
            POST('me/change-password', formdata).then(async (result: any) => {
                if (result.status) {
                    dispatch(loadUser(result.data))
                    navigate.goBack()
                    // navigate.navigate('Main')
                } else {
                    Alert.alert(result.message)
                }
            }).catch(e => {
                handleChange('loading', false);
            });
        }else {
            Alert.alert('Please enter all the fields to change your password')
        }
    }

    reactotron.log(theme)
    return (
        <BaseComponent {...baseComponentData} title={'Personal Infomation'} is_main={false}>
            <View style={{}}>
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={handleShowProfileImg}>
                            <UserAvatar style={{ width: 120, height: 120, margin: main_padding }}>
                                {state.profileImg != null ?
                                    <Image source={{ uri: state.profileImg }} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 100 }} />
                                    : <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} />}
                            </UserAvatar>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onOpen()}><Text style={{ fontSize: 12, color: baseColor, fontFamily: 'Montserrat-Regular' }}>Set a new photo</Text></TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: deviceWidth, padding: main_padding, marginTop: main_padding }}>
                            <TextInput
                                style={{ ...styles.input, width: '47%', backgroundColor: themeStyle[theme].primary, color: themeStyle[theme].textColor, fontFamily: 'Montserrat-Regular' }}
                                placeholder='Firstname'
                                value={state.firstname}
                                onChangeText={(text) => handleChange('firstname', text)}
                                placeholderTextColor={textDesColor}
                            />
                            <TextInput
                                style={{ ...styles.input, width: '47%', backgroundColor: themeStyle[theme].primary, color: themeStyle[theme].textColor, fontFamily: 'Montserrat-Regular' }}
                                placeholder='Lastname'
                                value={state.lastname}
                                onChangeText={(text) => handleChange('lastname', text)}
                                placeholderTextColor={textDesColor}
                            />
                        </View>
                    </View>
                    <View style={{ ...styles.usernameContainer, marginHorizontal: main_padding, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 14, color: textDesColor }}>Username</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                style={{ color: chatText, marginHorizontal: main_padding, fontFamily: 'Montserrat-Regular' }}
                                placeholder='Username'
                                value={state.username}
                                onChangeText={(text) => handleChange('username', text)}
                            />
                        </View>
                    </View>
                    <View style={{ ...styles.usernameContainer, marginHorizontal: main_padding, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: main_padding + 10 }}>
                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 14, color: textDesColor }}>Password</Text>
                        <TouchableOpacity onPress={() => handleChange('isVisible', true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: textSecondColor }}>Change password</Text>

                            <Ionicons name='chevron-forward-outline' size={20} style={{ color: textSecondColor }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={handleSave} style={{ height: 45, backgroundColor: startBtn, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginHorizontal: main_padding, marginTop: 50 }}>
                    <Text style={{ color: whiteSmoke, fontFamily: 'Montserrat-Regular', fontSize: 16 }}>Save</Text>
                </TouchableOpacity>
            </View>
            <SelectImagePicker
                visible={isOpen}
                onChange={(data: any) => onChange(data)}
                onClose={() => onClose()}
            />

            <Modal
                style={{ backgroundColor: themeStyle[theme].primary, height: deviceHeight }}
                presentationStyle="formSheet"
                visible={state.isVisible}
                animationType='slide'
                onDismiss={() => console.log('on dismiss')}>
                <CustomLoading visible={true} />

                <View style={{ flex: 1, backgroundColor: themeStyle[theme].backgroundColor }}>
                    <View style={{ margin: main_padding, marginTop: large_padding, }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => handleChange('isVisible', false)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name='ios-chevron-back' as={Ionicons} size='lg' color={textSecondColor} />
                                <Text style={{ color: baseColor, fontSize: 13, fontFamily: 'Montserrat-Regular' }}>Back</Text>

                            </TouchableOpacity>
                            <Text style={{ fontWeight: '600', fontSize: 16, fontFamily: 'Montserrat-Regular', color: themeStyle[theme].textColor }}>Change password</Text>
                            <TouchableOpacity onPress={handleChangePassword}>
                                <Text style={{ fontWeight: '600', fontSize: 15, fontFamily: 'Montserrat-Regular', color: baseColor }}>DONE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <VStack>
                        <View style={{ width: deviceWidth, alignItems: 'center' }}>
                            <LottieView
                                style={{ width: deviceWidth * .5, height: deviceWidth * .5 }}
                                source={{ uri: 'https://assets2.lottiefiles.com/packages/lf20_ff305byc.json' }}
                                loop
                            />
                        </View>
                        <View style={{ marginTop: 20, paddingHorizontal: main_padding }}>
                            <TextInput
                                autoFocus={true}
                                style={[style.p, styles.input, { backgroundColor: themeStyle[theme].primary, fontSize: 14, color: themeStyle[theme].textColor }]}
                                placeholder='Current password'
                                value={state.password}
                                secureTextEntry={state.isSecure}
                                placeholderTextColor={'#ADB9C6'}
                                returnKeyType='go'
                                onChangeText={(text) => {
                                    handleChange('password', text)
                                }}
                            />
                            <TouchableOpacity onPress={() => handleChange('isSecure', !state.isSecure)} style={{ position: 'absolute', bottom: 7, right: 25, borderWidth: 0.5, borderRadius: 20, width: 70, height: 30, justifyContent: 'center', alignItems: 'center', borderColor: startBtn }}>
                                <Text style={{ fontFamily: 'lato', fontSize: 13, color: startBtn }}>{state.isSecure ? "View*" : "Hide*"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 10, paddingHorizontal: main_padding }}>
                            <TextInput
                                style={[style.p, styles.input, { backgroundColor: themeStyle[theme].primary, fontSize: 14, color: themeStyle[theme].textColor }]}
                                placeholder='New password'
                                value={state.newPassword}
                                secureTextEntry={true}
                                placeholderTextColor={'#ADB9C6'}
                                returnKeyType='go'
                                onChangeText={(text) => {
                                    handleChange('newPassword', text)
                                }}
                            />

                        </View>
                        <View style={{ marginTop: 10, paddingHorizontal: main_padding }}>
                            <TextInput
                                style={[style.p, styles.input, { backgroundColor: themeStyle[theme].primary, fontSize: 14, color: themeStyle[theme].textColor }]}
                                placeholder='Confirm password'
                                value={state.confirmPassword}
                                secureTextEntry={true}
                                placeholderTextColor={'#ADB9C6'}
                                returnKeyType='go'
                                onChangeText={(text) => {
                                    handleChange('confirmPassword', text)
                                }}
                            />

                        </View>
                    </VStack>
                </View>

            </Modal>
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    usernameContainer: {
        marginTop: 8,
        height: 45,
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 50,
        borderColor: 'lightgray'
    },
    input: {
        marginTop: 8,
        height: 45,
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 50,
        backgroundColor: boxColor,
        borderColor: 'lightgray'
    },
    // container: {
    //     // flex: 1,
    //     // justifyContent: 'center',
    //     // alignItems: 'center',
    //     // backgroundColor: '#2c3e50',
    // },
});

//make this component available to the app
export default EditProfileScreen;
