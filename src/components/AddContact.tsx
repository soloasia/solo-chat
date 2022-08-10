//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { baseColor, boxColor, chatText, inputColor, textDesColor } from '../config/colors';
import { main_padding } from '../config/settings';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import { style } from '../styles';

// create a component
const AddContactScreen = () => {
    const [username, setUsername] = useState("");

    const rightIcon = () =>{
		return(
			<TouchableOpacity style={style.containerCenter}  onPress={()=>console.log("Hello")}>
				<Text style={{fontSize : 16,fontWeight : 'bold',color : username != "" ? baseColor : "gray"}}>Add</Text>
			</TouchableOpacity>
		)
	}
    return (
        <BaseComponent {...baseComponentData} title={'Add Contact'} is_main={false} rightIcon={rightIcon}>
            <View style={{margin : main_padding}}>
            <TextInput 
                style={{...styles.input,marginTop : main_padding}}
                placeholder='Username'
                value={username}
                onChangeText={(text)=> setUsername(text)}
            />
            <Text style={{fontSize : 12, color:'gray' ,marginLeft :4,marginTop : 10}}>You can add contact by their username. It's case sensitive.</Text>
            </View>
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#2c3e50',
    },
    input: {
        backgroundColor: inputColor, 
        height: 45,width: '100%', 
        borderRadius: 25, 
        paddingHorizontal: main_padding, 
        color: textDesColor, 
        fontFamily: 'lato', 
        fontSize: 13
    },
});

//make this component available to the app
export default AddContactScreen;
