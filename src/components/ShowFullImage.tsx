//import liraries
import { useNavigation } from '@react-navigation/native';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import { deviceWidth, deviceHeight } from '../styles/index';
import { main_padding } from '../config/settings';
import FastImage from 'react-native-fast-image';

// create a component
const FullImageDisplay = (props: any) => {
    const navigate: any = useNavigation();
    const { imgDisplay } = props.route.params;
    return (
        <BaseComponent {...baseComponentData} title=''>
            <View style={styles.container}>
               <FastImage source={{uri: imgDisplay}} resizeMode='contain' style={{width: deviceWidth, height: deviceWidth}} />
            </View>
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: main_padding*2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

//make this component available to the app
export default FullImageDisplay;
