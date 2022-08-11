import { HStack, useToast } from 'native-base';
import React, { useState } from 'react'
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo';
import { textColor, chatText, secondColor, bgChat, baseColor } from '../../config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { main_padding } from '../../config/settings';
import { useSelector } from 'react-redux';

const ChatRecord = (props: any) => {
    const { onOpen, onSend, message, onChangeMessage, loading } = props;
    const textsize = useSelector((state: any) => state.textSizeChange);

    const [height, setHeight] = useState(40)
    return (
        <View style={styles.input}>
            <TouchableOpacity style={[styles.icon, { marginRight: 10,backgroundColor:bgChat,width:35,height:35,borderRadius:30,justifyContent:'center',alignItems:'center' }]} onPress={() => onOpen()}>
                <Entypo name={"attachment"} size={18}  />
            </TouchableOpacity>
            <TextInput
                value={message}
                placeholderTextColor={chatText}
                selectionColor = {textColor} 
                multiline={true}
                numberOfLines={50}
                scrollEnabled
                placeholder={"Type a message..."}
                onChangeText={(_text) =>  onChangeMessage(_text) }
                style={{ flex: message? 5:2.5, height: 40 ,color:textColor,backgroundColor:bgChat,padding:main_padding,borderRadius:20,textAlignVertical: "top",paddingTop:12,paddingBottom:10, fontSize: textsize}}
            /> 
            <HStack style={{ flex: 1, justifyContent: "flex-end" }}>
                {message?
                    <TouchableOpacity onPress={() => onOpen()}>
                        <MaterialCommunityIcons name={"send-circle"}  size={35} style={{alignSelf:'center',color:baseColor}}/>
                    </TouchableOpacity>
                    :
                    <>
                        <TouchableOpacity style={[styles.icon, { marginRight: 10}]} onPress={() => onOpen()}>
                            <Ionicons name={"ios-mic-outline"}  size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onSend}  style={[styles.icon]}>
                            <Ionicons name="ios-camera-outline"  size={25} />
                        </TouchableOpacity>
                    </>
                }
            </HStack>
        </View >
    )
}

export default ChatRecord;

const styles = StyleSheet.create({
    input: {
        // position: 'absolute',
        backgroundColor: '#ffff',
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 100,
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
