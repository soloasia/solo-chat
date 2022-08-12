//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Animated, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { baseColor, boxColor, chatText, startBtn, textDesColor, textSecondColor, whiteSmoke } from '../../config/colors';
import { main_padding } from '../../config/settings';
import { TextItem, UserAvatar } from '../../customs_items/Components';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import style, { deviceWidth } from '../../styles';
import ImagePicker from 'react-native-image-crop-picker';

// create a component
const EditProfileScreen = () => {
    const [isDarkMode, setDarkMode] = useState(false);
    const [state, setState] = useState<any>({
		firstname: 'Big',
        lastname: 'Boss',
		password:'',
        phonenumber: '',
        username: '@bigboss',
        isSecure: true,
	});

    const pickGallery = () => {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: false,
          includeBase64: true,
        }).then(res => {
        //   setImgData(res);
        });
    }
    

    return (
        <BaseComponent {...baseComponentData} title={'Edit Profile'} is_main={false}>
            <View style={{}}>
                <View>
                    <View style={{justifyContent: 'center',alignItems:'center'}}>
                        <UserAvatar style={{width:120,height:120, margin: main_padding}}>
                            <Image source={require('../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%'}}/>
                        </UserAvatar>
                        <TouchableOpacity onPress={() => pickGallery()}><Text style={{fontSize : 12,color : baseColor}}>Update Profile Photo</Text></TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: deviceWidth, padding: main_padding, marginTop: main_padding}}>
                            <TextInput 
                                style={{...styles.input, width: '47%'}}
                                placeholder='Firstname'
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
                    </View>
                    <View style = {{...styles.usernameContainer, marginHorizontal : main_padding,justifyContent : 'space-between',flexDirection : 'row',alignItems :'center'}}>
                        <Text>Username</Text>
                        <View style={{flexDirection :'row',alignItems : 'center'}}>
                            <TextInput 
                                style={{color: chatText,marginHorizontal : main_padding}} 
                                placeholder='Username'
                                value={state.username}
                                onChangeText={(text) =>setState({
                                    lastname: state.lastname,
                                    firstname: state.firstname,
                                    password: state.password,
                                    isSecure: state.isSecure,
                                    phonenumber: state.phonenumber,
                                    username: text
                                })}
                                />
                           
                            {/* <Ionicons name='chevron-forward-outline' size={20} style={{color: textSecondColor}}/> */}
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>console.log("Save")} style={{height: 45,backgroundColor: startBtn, borderRadius: 25, alignItems: 'center', justifyContent: 'center',marginHorizontal: main_padding,marginTop : 50}}>
                        <Text style={{color: whiteSmoke, fontFamily:'Lato', fontSize: 16}}>Save</Text>
                </TouchableOpacity>
            </View>
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    usernameContainer : {
        marginTop: 8,
        height: 45,
        borderWidth: 0.5,
        padding: 10,
        borderRadius : 50,
        borderColor: 'lightgray'
    },
    input: {
        marginTop: 8,
        height: 45,
        borderWidth: 0.5,
        padding: 10,
        borderRadius : 50,
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
