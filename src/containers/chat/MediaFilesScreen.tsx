//import liraries
import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Linking } from 'react-native';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import { main_padding } from '../../config/settings';
import { FlatListHorizontal, makeid } from '../../customs_items/Components';
import { deviceWidth } from '../../styles/index';
import { textDesColor, whiteColor, baseColor, whiteSmoke, textColor, placeholderDarkTextColor, borderDivider, textSecondColor, primaryDark } from '../../config/colors';
import MediaWidget from '../../components/MediaWidget';
import FileWidget from '../../components/FileWidget';
import reactotron from 'reactotron-react-native';
import { GET } from '../../functions/BaseFuntion';
import _ from 'lodash';
import Video from 'react-native-video';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { HStack } from 'native-base';
import { ThemeContext } from '../../utils/ThemeManager';
import moment from 'moment';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const listheadertext = ['Media', 'File', 'Link']
let lastDoc: any = 1;

const MediaFilesScreen = (props: any) => {
    const { userChat } = props.route.params
    const [headerIdx, setHeaderIdx] = useState(0)
    const [documents, setDocuments] = useState<any>([])
    const navigate: any = useNavigation();
    const { theme }: any = useContext(ThemeContext);

    const [selectedHeader, setSeletedHeader] = useState('media')
    useEffect(() => {
        requestDocumentAPI(selectedHeader)
    }, []);



    const onSetHeaderItem = ({ item, index }: any) => {
        requestDocumentAPI(item.toLowerCase())
        setHeaderIdx(index)
    }

    const requestDocumentAPI = (selectedHeader: any) => {
        GET(`chatroom/document/detail/${userChat.id}?type=${selectedHeader}&page=${lastDoc}`)
            .then(async (result: any) => {
                if (result.status) {
                    setDocuments(result.data.data)
                }
            })
            .catch(e => {
            });
    }


    const onFullVideo = (url: any) => {
        navigate.navigate('VideoFull', { videos: url });
    }

    const _onOpenFile = (mess: any) => {
        const headers = {
            'Accept': 'application/pdf',
            'Content-Type': 'application/pdf',
            'Authorization': `Bearer [token]`
        }
        const localFile = `${RNFS.DocumentDirectoryPath}/${mess.message + '.' + mess.type}`;

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

    const openLinkChat = (mess:any) =>{
        let checkUrlLink = mess.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        checkUrlLink != null ? Linking.openURL(checkUrlLink[0]) : null;
    }

    const _renderMedia = ({ item, index }: any) => {
        return (
            <TouchableOpacity onPress={()=> item.type !='mp4' ? navigate.navigate('DisplayFullImg', { imgDisplay: item.file_url }) : onFullVideo(item.file_url)}  style={{ backgroundColor: '#E9E9E99D', height: 140, width: deviceWidth / 3.4, margin: 3, borderRadius: 5, borderColor: borderDivider, borderWidth: 0.5 }}>
                {item.type == 'mp4' ?
                    <View>
                        <Video
                            source={{ uri: item.file_url }}
                            style={{ height: '100%', width: '100%', borderRadius: 5 }}
                            ignoreSilentSwitch={"ignore"}
                            resizeMode='cover'
                            playInBackground={false}
                            playWhenInactive={false}
                            paused={true}
                        // muted={isShowControl}
                        />

                        <View style={{ position: 'absolute', bottom: '35%', right: '32%', backgroundColor: placeholderDarkTextColor, borderRadius: 50, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name='play' size={20} color={whiteColor} style={{ marginLeft: 5 }} />
                        </View>

                    </View>
                : <Image source={{ uri: item.file_url }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />}
            </TouchableOpacity>
        )
    }

    const _renderFileandLink = ({ item, index }: any) => {
        if(item.type =='mp3') return null;
        return (
            <TouchableOpacity onPress={() => item.type == 'url' ? openLinkChat(item) : _onOpenFile(item)} style={{ backgroundColor: theme == 'dark' ? primaryDark : '#F0F0F2', padding: main_padding, paddingBottom: 5, marginTop: 7, borderRadius: 10 }}>
                <HStack alignItems='center'>
                    {item.type == 'url' ? 
                        <Feather name='link' size={25} color={textSecondColor}/>
                    :
                    <FontAwesome
                        name={
                            item.type == 'pdf' ? "file-pdf-o" : item.type == 'xls' || item.type == 'xlsx' ? 'file-excel-o'
                                : item.type == 'ppt' || item.type == 'pptx' || item.type == 'csv' ? 'file-powerpoint-o'
                                    : item.type == 'doc' || item.type == 'docx' ? 'file-word-o' : item.type == 'zip' ? 'file-zip-o' : 'file-text-o'
                        } size={25} color={textSecondColor} />
                    }
                    <Text style={{ fontSize: 13, fontFamily: 'Montserrat-Regular', marginLeft: main_padding - 5, textDecorationLine: item.type =='url' ? 'underline' : 'none', color: item.type == 'url' ? baseColor : theme == 'dark' ? '#D1D1D1' : textColor }}>{item.message + '.' + item.type}</Text>
                </HStack>
                <Text style={{ fontFamily: 'Montserrat-Regular', textAlign: 'right', color: textSecondColor, fontSize: 10, marginTop: 5 }}>{moment(item.created_at).format('MMMM DD, YYYY  HH:mm')}</Text>
            </TouchableOpacity>
        )
    }

    const _renderItem = ({ item, index }: any) => {
        return (
            <View style={{ width: deviceWidth / 3.5, marginLeft: index == 0 ? 5 : 10 }}>
                <TouchableOpacity
                    onPress={() => onSetHeaderItem({ item, index })}
                    style={{
                        backgroundColor: index == headerIdx ? baseColor : whiteColor,
                        borderRadius: 20,
                        alignItems: 'center', padding: 5
                    }}
                >
                    <Text style={{ fontSize: 14, fontFamily: 'lato', fontWeight: index == headerIdx ? 'bold' : 'normal', color: index == headerIdx ? whiteSmoke : textColor }}>{item.toUpperCase()}{index != 0 ? 'S' : ""}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const _mediaContainer = () => {
        return (
            <FlatList
                key='media'
                listKey={makeid()}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                data={documents}
                renderItem={_renderMedia}
                numColumns={3}
                keyExtractor={(_, index) => index.toString()}
            />
        )
    }

    return (
        <BaseComponent {...baseComponentData} title='Media, files & links'>
            <View style={{ flex: 1, paddingHorizontal: main_padding, marginTop: main_padding - 5 }}>
                <View style={{ marginBottom: main_padding }}>
                    <FlatListHorizontal
                        listKey={makeid()}
                        renderItem={_renderItem}
                        data={listheadertext}
                    />
                </View>

                <View style={{ paddingTop: main_padding - 5, flex: 1 }}>
                    {headerIdx == 0 ?
                        _mediaContainer()
                        :
                        <FlatList
                            key='file'
                            listKey={makeid()}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            data={documents}
                            renderItem={_renderFileandLink}
                            keyExtractor={(_, index) => index.toString()}
                        />}
                </View>
            </View>
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});

//make this component available to the app
export default MediaFilesScreen;
