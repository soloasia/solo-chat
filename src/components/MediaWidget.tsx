//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { deviceWidth } from '../styles';

// create a component
const MediaWidget = (props:any) => {
    const renderContents = ({item,index}: any) => {
        return(
            <TouchableOpacity style={{backgroundColor: '#E9E9E99D',height: 130, width: deviceWidth/3.3, margin: 3}}>
                {/* <Text>{item}</Text> */}
            </TouchableOpacity>
        )
    }
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            data={[1,2,3,4,5,6,7,8,8,8,8,8,88,8,8,8,8,8,8,8,8,1,1,1,1]}
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
