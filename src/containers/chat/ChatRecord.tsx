import { HStack, useToast } from 'native-base';
import React, { useContext, useState } from 'react'
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo';
import { textColor, chatText, secondColor, bgChat, baseColor, offlineColor } from '../../config/colors';
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

let audioRecorderPlayer:any = null;
const dirs = RNFetchBlob.fs.dirs;
const path = Platform.select({
    ios: `${makeid()}.m4a`,
    android: `${dirs.CacheDir}/${makeid()}.mp3`,
});

const ChatRecord = (props: any) => {
    const { onOpen, onSend, message, onChangeMessage, loading } = props;
    const textsize = useSelector((state: any) => state.textSizeChange);
    const {theme} : any = useContext(ThemeContext);
    const [isRecord, setIsRecord] = useState(false);
    const [duration, setDuration] = useState<any>("00:00");
    const [totalDuration, setTotalDuration] = useState(0);
    const onStartRecord = async () => {
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
            onSendVoice(result);
        } else {
            RNFetchBlob.fs.unlink(result);
        }
    }
    const onSendVoice = async (result: any) => {
        const data = await RNFetchBlob.fs.readFile(result, 'base64');
        var formData = new FormData();
        let _data: any = {
            uri: result,
            name: result.replace(/^.*[\\\/]/, ''),
            data: data,
            type: Platform.OS == "ios" ? "audio/m4a" : "audio/mp3",
        }
    }
    return (
        <View style={[styles.input,{backgroundColor : themeStyle[theme].backgroundColor}]}>
            {isRecord?
                <></>
                :
                <TouchableOpacity style={[styles.icon, { marginRight: 10,backgroundColor: themeStyle[theme].primary,width:35,height:35,borderRadius:30,justifyContent:'center',alignItems:'center' }]} onPress={() => onOpen()}>
                    <Entypo name={"attachment"} size={18} color={themeStyle[theme].textColor} />
                </TouchableOpacity>
            }
            {
                !isRecord ?  
                <TextInput
                    value={message}
                    placeholderTextColor={chatText}
                    selectionColor = {textColor} 
                    multiline={true}
                    numberOfLines={50}
                    scrollEnabled
                    placeholder={"Type a message..."}
                    onChangeText={(_text) =>  onChangeMessage(_text) }
                    style={{ flex: message? 5:2.5, height: 40 ,color:textColor,backgroundColor: themeStyle[theme].primary,padding:main_padding,borderRadius:20,textAlignVertical: "top",paddingTop:12,paddingBottom:10, fontSize: textsize}}
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
                    <TouchableOpacity onPress={() => onOpen()}>
                        <MaterialCommunityIcons name={"send-circle"}  size={35} style={{alignSelf:'center',color:baseColor}}/>
                    </TouchableOpacity>
                    :
                    <>
                        {isRecord?
                        <></>
                            :
                            <TouchableOpacity style={[styles.icon, { marginRight: 10}]} onPress={() => onStartRecord()} >
                                <Ionicons name={"ios-mic-outline"}  size={25} color={themeStyle[theme].textColor}/>
                            </TouchableOpacity>
                        }
                       
                        {isRecord ?
                            <MaterialCommunityIcons name={"send-circle"}  size={35} style={{alignSelf:'center',color:baseColor}}/>
                            :
                            <TouchableOpacity onPress={onSend}  style={[styles.icon]}>
                                <Ionicons name="ios-camera-outline"  size={25} color={themeStyle[theme].textColor}/>
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
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 90,
        color: "#aaa",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
    },
    icon: {
        paddingHorizontal: 5,
    },

})
