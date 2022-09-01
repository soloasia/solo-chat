//import liraries
import { HStack, Icon, VStack } from 'native-base';
import React, { Component, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { deviceWidth } from '../styles/index';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { main_padding } from '../config/settings';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import { baseColor, primaryDark, textColor, textSecondColor } from '../config/colors';
import { ThemeContext } from '../utils/ThemeManager';
import moment from 'moment';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// create a component
const FileWidget = (props:any) => {
    const { theme }: any = useContext(ThemeContext);
    const {fileData} = props

    const _onOpenFile = (mess:any) => {
        const headers = {
            'Accept': 'application/pdf',
            'Content-Type': 'application/pdf',
            'Authorization': `Bearer [token]`
          }
        const localFile = `${RNFS.DocumentDirectoryPath}/${mess.message+'.'+mess.type}`;

        const options = {
            fromUrl: mess.file_url,
            toFile: localFile,
            headers: headers
        };
        RNFS.downloadFile(options)
        .promise.then(() => FileViewer.open(localFile, { showOpenWithDialog: true }))
        .then(() => {
            console.log('success')
        })
        .catch((error) => {
            console.log('error')
        });
    }

    const renderContents = ({item,index}: any) => {
        if(item.type=='mp3') return null;
        return(
            <TouchableOpacity onPress={()=>_onOpenFile(item)} style={{backgroundColor: theme == 'dark' ? primaryDark : '#F0F0F2' ,padding: main_padding, paddingBottom: 5,  marginTop: 7,borderRadius: 10}}>
                <HStack alignItems='center'>
                    <FontAwesome 
                        name={
                            item.type == 'pdf'?  "file-pdf-o" : item.type == 'xls' || item.type == 'xlsx'? 'file-excel-o'
                            : item.type == 'ppt' || item.type == 'pptx' || item.type == 'csv'? 'file-powerpoint-o'
                            : item.type == 'doc' || item.type == 'docx'? 'file-word-o' : item.type == 'zip'? 'file-zip-o' : 'file-text-o'
                        } size={25} color={textSecondColor} />
                    <Text style={{fontSize: 13, fontFamily: 'Montserrat-Regular', marginLeft: main_padding-5, color: theme == 'dark' ? '#D1D1D1' : textColor}}>{item.message+'.'+item.type}</Text>
                </HStack>
                <Text style={{fontFamily: 'Montserrat-Regular', textAlign: 'right', color: textSecondColor, fontSize: 10, marginTop: 5}}>{moment(item.created_at).format('MMMM DD, YYYY  HH:mm')}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            data={fileData}
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
