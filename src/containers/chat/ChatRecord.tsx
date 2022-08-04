import { HStack, useToast } from 'native-base';
import React, { useState } from 'react'
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo';
import { textColor, chatText, secondColor } from '../../config/colors';

const ChatRecord = (props: any) => {
    const { onOpen, onSend, message, onChangeMessage, loading } = props;
    return (
        <View style={styles.input}>
            {/* <TouchableOpacity style={[styles.icon, { marginRight: 10, }]} onPress={() => onOpen()}>
                <Entypo name={"attachment"} size={20}  />
            </TouchableOpacity>
            <TextInput
                value={message}
                placeholderTextColor={chatText}
                selectionColor = {textColor} 
                multiline
                placeholder={"Write a message..."}
                onChangeText={(_text) => onChangeMessage(_text)}
                style={[{ flex: 3, minHeight: 25,color:textColor}]}
            /> 
            <HStack style={{ flex: 1, justifyContent: "flex-end" }}>
                <TouchableOpacity style={[styles.icon, { marginRight: 10, }]} onPress={() => onOpen()}>
                    <MaterialIcons name={"keyboard-voice"}  size={25} />
                </TouchableOpacity>
               {loading ? 
                <View style={[styles.icon]}>
                     <ActivityIndicator size="small" color="black" />
                </View>
               : <TouchableOpacity onPress={onSend}  style={[styles.icon]}>
                    <MaterialIcons name="send"  size={20} />
                </TouchableOpacity>}
            </HStack> */}
        </View >
    )
}

export default ChatRecord;

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
