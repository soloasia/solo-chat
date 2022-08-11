//import liraries
import { HStack, Icon, VStack } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { deviceWidth } from '../styles/index';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { main_padding } from '../config/settings';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import { baseColor } from '../config/colors';

// create a component
const FileWidget = () => {

    const renderContents = ({item,index}: any) => {
        return(
            <TouchableOpacity style={{backgroundColor: '#E9E9E99D',padding: main_padding,  marginTop: 7,borderRadius: 10}}>
                <HStack alignItems='center'>
                    <Icon name='file-pdf-o' as={FontAwsome} size={35} color={baseColor} />
                    <Text style={{fontSize: 14, fontFamily: 'lato', marginLeft: main_padding-5}}>attactedfiletesting{item}.pdf</Text>
                </HStack>
            </TouchableOpacity>
        )
    }
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            data={[1,2,3,4,5,6,7,8,8,8,8,8,]}
            renderItem={renderContents}
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
export default FileWidget;
