//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import reactotron from 'reactotron-react-native';
import { deviceWidth } from '../styles';
import { borderDivider, placeholderDarkTextColor, whiteColor } from '../config/colors';
import Video from 'react-native-video';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// create a component
const MediaWidget = (props:any) => {
    const { mediaData } = props
    const navigate: any = useNavigation();

    const onFullVideo = (url:any) =>{
        navigate.navigate('VideoFull',{videos:url});
    }

    const renderContents = ({item,index}: any) => {
        return(
            <TouchableOpacity style={{backgroundColor: '#E9E9E99D',height: 140, width: deviceWidth/3.4, margin: 3, borderRadius: 5, borderColor: borderDivider, borderWidth: 0.5}}>
               {item.type == 'mp4' ? 
                <TouchableOpacity onPress={()=>onFullVideo(item.file_url)}>
                    <Video
                        source={{uri:item.file_url}}
                        style={{height: '100%',width:'100%',borderRadius:5}}
                        ignoreSilentSwitch={"ignore"}
                        resizeMode='cover'
                        playInBackground={false}
                        playWhenInactive={false}  
                        paused={true}
                        // muted={isShowControl}
                    />
                     
                    <View style={{position:'absolute',bottom:'35%',right:'32%',backgroundColor:placeholderDarkTextColor,borderRadius:50,width:40,height:40,justifyContent:'center',alignItems:'center'}}>
                        <FontAwesome name='play' size={20} color={whiteColor} style={{marginLeft: 5}} />
                    </View>
                        
                </TouchableOpacity> 
               :<Image source={{uri: item.file_url}} style={{width: '100%', height: '100%', borderRadius: 5}} />}
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
