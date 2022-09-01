import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert, TouchableHighlight } from 'react-native';
import { baseColor, borderDivider, boxColor, chatText, textDesColor, whiteColor } from '../../config/colors';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import { useNavigation } from '@react-navigation/native';
import { deviceHeight } from '../../styles';
import Video from 'react-native-video';


const VideoFullScreen = (props: any) => {
    const navigate:any = useNavigation();
    const { videos } = props.route.params;
   
    return (
        <BaseComponent {...baseComponentData} title={""}>
            <Video
                source={{uri:videos}}
                style={{height:deviceHeight - 100  ,width:'100%'}}
                ignoreSilentSwitch={"ignore"}
                resizeMode='cover'
                playInBackground={false}
                playWhenInactive={false}  
                paused={false}
                controls={true}
            />
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    backTextWhite: {
        color: '#FFF',
        fontFamily: 'Montserrat-Regular'
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: baseColor,
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },

    
});


export default VideoFullScreen;