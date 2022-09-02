import { HStack, useToast } from 'native-base';
import React, { useContext, useState } from 'react'
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo';
import { textColor, chatText, secondColor, bgChat, baseColor, offlineColor, borderDivider } from '../../config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import AudioRecorderPlayer, { AudioEncoderAndroidType, AudioSet, AudioSourceAndroidType, AVEncoderAudioQualityIOSType, AVEncodingOption } from 'react-native-audio-recorder-player';
import { main_padding } from '../../config/settings';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../utils/ThemeManager';
import themeStyle from '../../styles/theme';
import { makeid } from '../../customs_items/Components';
import style from '../../styles';
import LottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import reactotron from 'reactotron-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import base64File from '../../functions/BaseFuntion';
import { LanguageContext } from '../../utils/LangaugeManager';
import RNFS from 'react-native-fs'

let audioRecorderPlayer:any = null;
const dirs = RNFetchBlob.fs.dirs;
const path = Platform.select({
    ios: `${makeid()}.m4a`,
    android: `${dirs.CacheDir}/${makeid()}.mp3`,
});

const ChatRecord = (props: any) => {
    const { onOpen, onSend, message, onChangeMessage,onOpenGallery,onChange,singleFile,onClearFile,onChangeVoice,msgRef } = props;
    const textsize = useSelector((state: any) => state.textSizeChange);
    const {theme} : any = useContext(ThemeContext);
    const {tr} : any = useContext(LanguageContext);
    const [isRecord, setIsRecord] = useState(false);
    const [duration, setDuration] = useState<any>("00:00");
    const [totalDuration, setTotalDuration] = useState(0);
    // const [singleFile, setSingleFile] = useState<any>('');

    const onCamera = () => {
        // onClose()
        ImagePicker.openCamera({
            cropping: false,
            mediaType:'video'
        }).then(response => {
            onChange(response);
        });
    }
    const onStartRecord = async () => {
        setDuration("00:00")
        setTotalDuration(0)
        audioRecorderPlayer = new AudioRecorderPlayer()
        const result = await audioRecorderPlayer.startRecorder(path,audioSet);
        audioRecorderPlayer.addRecordBackListener((e:any) => {
            let _du: any = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
            setTotalDuration(e.currentPosition);
            _du = _du.split(':')
            setDuration(_du[0] + ":" + _du[1])
            return;
        });
        setIsRecord(true);
    }
    const audioSet: AudioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const onStopRecord = async (isStop = true) => {
        setIsRecord(false);
        const result = await audioRecorderPlayer.stopRecorder();
        await audioRecorderPlayer.removeRecordBackListener();
        if (!isStop) {
            // onSendVoice(result);
        } else {
            RNFetchBlob.fs.unlink(result);
        }
    }
    const onSendVoice = async () => {
        setIsRecord(false);
        const result = await audioRecorderPlayer.stopRecorder();
        await audioRecorderPlayer.removeRecordBackListener();
        if(Platform.OS === 'android'){
            await RNFS.readFile(result, 'base64').then(res => {
                onChangeVoice(res,duration)
                RNFetchBlob.fs.unlink(result);
            })
            .catch(err => {
                console.log(err.message, err.code);
            });
        }else{
            base64File(result).then((res:any)=>{
                onChangeVoice(res,duration)
                RNFetchBlob.fs.unlink(result);
            })
        }
        // if (!isStop) {
        //     onSendVoice(result);
        // } else {
        //     RNFetchBlob.fs.unlink(result);
        // }

        // base64File(result).then((res:any)=>{
        //     onChangeVoice(res)
        // })
    }
    const getExtention = (filename:any) => {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };
    return (
        <View style={[styles.input,{backgroundColor : themeStyle[theme].backgroundColor}]}>
            {isRecord || message || singleFile?
                <></>
                :
                <TouchableOpacity style={[styles.icon, { marginRight: 10,backgroundColor: themeStyle[theme].primary,width:35,height:35,borderRadius:30,justifyContent:'center',alignItems:'center' }]} onPress={onOpenGallery}>
                    <Entypo name={"attachment"} size={17} color={themeStyle[theme].textColor} />
                </TouchableOpacity>
            }
            {
                singleFile?
                <HStack style={{ height: 40, alignItems: 'center',flex:6,backgroundColor:'#ADB9C6',borderRadius:20,paddingLeft:20,justifyContent:'space-between'}}>
                    <HStack>
                        <FontAwesome name={
                            getExtention(singleFile.name)![0] == 'pdf'? 
                                "file-pdf-o"
                                : getExtention(singleFile.name)![0] == 'xls' || getExtention(singleFile.name)![0] == 'xlsx'?
                                    'file-excel-o'
                                    :
                                        getExtention(singleFile.name)![0] == 'ppt' || getExtention(singleFile.name)![0] == 'pptx' || getExtention(singleFile.name)![0] == 'csv'?
                                        'file-powerpoint-o'
                                        :
                                        getExtention(singleFile.name)![0] == 'doc' || getExtention(singleFile.name)![0] == 'docx'?
                                            'file-word-o'
                                            :
                                                getExtention(singleFile.name)![0] == 'zip'?
                                                    'file-zip-o'
                                                    :
                                                        'file-text-o'
                            } size={18} color={themeStyle[theme].textColor} />
                        <Text style={[style.p,{paddingLeft:10}]}>{singleFile.name}</Text>
                    </HStack>
                    <TouchableOpacity style={[styles.icon, { marginRight: 10}]} onPress={onClearFile} >
                        <Ionicons name={"close-circle-outline"}  size={25} color={offlineColor}/>
                    </TouchableOpacity>
                </HStack> 
                :
                !isRecord ?  
                <TextInput
                    value={message}
                    ref={msgRef}
                    placeholderTextColor={chatText}
                    selectionColor = {themeStyle[theme].textColor} 
                    multiline={true}
                    numberOfLines={50}
                    scrollEnabled
                    placeholder={tr("type_message_hint")}
                    onChangeText={(_text) =>  onChangeMessage(_text) }
                    style={{flex: message? 5:3, height: 40 ,color:themeStyle[theme].textColor,backgroundColor: themeStyle[theme].primary,padding:main_padding,borderRadius:20,textAlignVertical: "top",paddingTop:12,paddingBottom:10, fontSize: textsize,fontFamily:'Montserrat-Regular'}}
                />
                :
                <HStack style={{ height: 40, alignItems: 'center',flex:6,backgroundColor:'#ADB9C6',justifyContent:'space-between',borderRadius:20,paddingLeft:20}}>
                    <Text style={[style.p]}>{duration}</Text>
                    <LottieView style={{ height: 60}} source={require('../../assets/voice_graph.json')} autoPlay loop />
                    <TouchableOpacity style={[styles.icon, { marginRight: 10}]} onPress={() => onStopRecord(false)} >
                        <Ionicons name={"close-circle-outline"}  size={25} color={offlineColor}/>
                    </TouchableOpacity>
                </HStack>
            } 
            <HStack style={{ flex: 1, justifyContent: "flex-end",alignItems:'center' }}>
                {message?
                    <TouchableOpacity onPress={onSend}>
                        <MaterialCommunityIcons name={"send-circle"}  size={35} style={{alignSelf:'center'}}  color={themeStyle[theme].textColor}/>
                    </TouchableOpacity>
                    :
                    <>
                        {isRecord || singleFile?
                        <></>
                            :
                            <TouchableOpacity style={[styles.icon,{paddingRight:10}]} onPress={() => onStartRecord()}>
                                <Ionicons name={"ios-mic-outline"}  size={25} color={themeStyle[theme].textColor}/>
                            </TouchableOpacity>
                        }
                       
                        {isRecord || singleFile?
                            <TouchableOpacity onPress={isRecord?onSendVoice:onSend}>
                                <MaterialCommunityIcons name={"send-circle"}  size={35} style={{alignSelf:'center'}} color={themeStyle[theme].textColor}/>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity   style={[styles.icon]} onPress={onCamera}>
                                <Entypo name="video-camera"  size={20} color={themeStyle[theme].textColor}/>
                            </TouchableOpacity>

                        }
                        
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
		// borderTopWidth:1,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // height: 90,
        // color: "#aaa",
        borderColor:borderDivider,
    },
    icon: {
        paddingHorizontal: 5,
    },

})
