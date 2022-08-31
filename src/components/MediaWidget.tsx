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
    // const _onOpenFile = (mess:any) => {
    //     const headers = {
    //         'Accept': 'application/pdf',
    //         'Content-Type': 'application/pdf',
    //         'Authorization': `Bearer [token]`
    //       }
    //     const localFile = `${RNFS.DocumentDirectoryPath}/${mess.message+'.'+mess.type}`;

    //     const options = {
    //         fromUrl: mess.file_url,
    //         toFile: localFile,
    //         headers: headers
    //     };
    //     RNFS.downloadFile(options)
    //     .promise.then(() => FileViewer.open(localFile, { showOpenWithDialog: true }))
    //     .then(() => {
    //         console.log('success')
    //     })
    //     .catch((error) => {
    //         console.log('error')
    //     });
    // }

    // const renderContents = ({item,index}: any) => {
    //     if(item.type=='mp3') return null;
    //     return(
    //         <TouchableOpacity onPress={()=>_onOpenFile(item)} style={{backgroundColor: theme == 'dark' ? primaryDark : '#F0F0F2' ,padding: main_padding, paddingBottom: 5,  marginTop: 7,borderRadius: 10}}>
                
    //         </TouchableOpacity>
    //     )
    // }

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
