//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import reactotron from 'reactotron-react-native';
import { deviceWidth } from '../styles';
import { borderDivider } from '../config/colors';

// create a component
const MediaWidget = (props:any) => {
    const { mediaData } = props
    reactotron.log(mediaData)

    const renderContents = ({item,index}: any) => {
        return(
            <TouchableOpacity style={{backgroundColor: '#E9E9E99D',height: 140, width: deviceWidth/3.2, margin: 3, borderRadius: 5, borderColor: borderDivider, borderWidth: 0.5}}>
               <Image source={{uri: item.file_url}} style={{width: '100%', height: '100%', borderRadius: 5}} />
            </TouchableOpacity>
        )
    }
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            data={mediaData}
            renderItem={renderContents}
            numColumns={3}
            keyExtractor={(_, index) => index.toString()}
        />
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
});

//make this component available to the app
export default MediaWidget;
