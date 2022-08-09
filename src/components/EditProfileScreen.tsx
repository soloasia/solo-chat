//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { baseColor, chatText, startBtn, textDesColor, textSecondColor, whiteSmoke } from '../config/colors';
import { main_padding } from '../config/settings';
import { TextItem, UserAvatar } from '../customs_items/Components';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import style, { deviceWidth } from '../styles';

// create a component
const EditProfileScreen = () => {
    const [isDarkMode, setDarkMode] = useState(false);
    const [state, setState] = useState<any>({
		firstname: 'Big',
        lastname: 'Boss',
		password:'',
        phonenumber: '',
        username: '',
        isSecure: true,
	});
    const rightIcon = () =>{
		return(
			<TouchableOpacity style={style.containerCenter}  onPress={()=>console.log("Hello")}>
				<Text style={{fontSize : 16,fontWeight : 'bold',color : baseColor}}>Save</Text>
			</TouchableOpacity>
		)
	}

    return (
        <BaseComponent {...baseComponentData} title={'Edit Profile'} is_main={false}>
            <View style={{}}>
                <View>
                    <View style={{justifyContent: 'center',alignItems:'center'}}>
                        <UserAvatar style={{width:120,height:120, margin: main_padding}}>
                            <Image source={require('../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%'}}/>
                        </UserAvatar>
                        <Text style={{fontSize : 12,color : baseColor}}>Update Profile Photo</Text>
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
                    <TouchableOpacity style = {{...styles.input, marginHorizontal : main_padding,justifyContent : 'space-between',flexDirection : 'row',alignItems :'center'}}>
                        <Text>Username</Text>
                        <View style={{flexDirection :'row',alignItems : 'center'}}>
                            <Text style={{color: chatText}}>@bigboss</Text>
                            <Ionicons name='chevron-forward-outline' size={20} style={{color: textSecondColor}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>console.log("Save")} style={{height: 45,backgroundColor: startBtn, borderRadius: 25, alignItems: 'center', justifyContent: 'center',marginHorizontal: main_padding,marginTop : 50}}>
                        <Text style={{color: whiteSmoke, fontFamily:'Lato', fontSize: 16}}>Save</Text>
                </TouchableOpacity>
                {/* <View>
                    <TouchableOpacity style = {{...styles.input, marginHorizontal : main_padding,justifyContent : 'center',alignItems :'center',}}>
                        <Text style={{color : "red"}}>Delete Account</Text>
                    </TouchableOpacity>
                </View> */}
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
        borderRadius : 8,
        borderColor: 'lightgray'
    },
    input: {
        marginTop: 8,
        height: 45,
        borderWidth: 0.5,
        padding: 10,
        borderRadius : 50,
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
