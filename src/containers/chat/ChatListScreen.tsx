import moment from 'moment';
import { Actionsheet, Box, HStack, useDisclose, VStack, theme } from 'native-base';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, FlatList, RefreshControl, ImageBackground, KeyboardAvoidingView, Platform, PermissionsAndroid, ActivityIndicator, Alert, Clipboard, Linking, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { baseColor, boxColor, chatText, placeholderDarkTextColor, textColor, textSecondColor, whiteColor, whiteSmoke, textDesColor, borderDivider, offlineColor } from '../../config/colors';
import { AlertBox, FlatListVertical, Footer, makeid, TextItem, UserAvatar } from '../../customs_items/Components';
import style, { deviceWidth } from '../../styles';
import ChatRecord from './ChatRecord';
import _ from 'lodash'
import { deviceHeight } from '../../styles/index';
import { useNavigation } from '@react-navigation/native';
import { main_padding } from '../../config/settings';
import BottomSheet from 'reanimated-bottom-sheet';
import CameraRoll from '@react-native-community/cameraroll';
import FastImage from 'react-native-fast-image';
import Lottie from 'lottie-react-native';
import ChatHeader from '../../components/ChatHeader';
import base64File, { convertHMS, GET, POST, hasAndroidPermission, validURL } from '../../functions/BaseFuntion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video from 'react-native-video'
import { options } from '../../temp_data/Setting';
import Ionicons from 'react-native-vector-icons/Ionicons';
import themeStyle from '../../styles/theme';
import { ThemeContext } from '../../utils/ThemeManager';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import reactotron from 'reactotron-react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import LottieView from 'lottie-react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNFS, { stat } from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { LanguageContext } from '../../utils/LangaugeManager';
import translate from 'translate-google-api';
import { WebView } from 'react-native-webview';
// import Pusher from 'pusher-js/react-native';
import { loadData } from '../../functions/LoadData';
import { Pusher, PusherChannel } from '@pusher/pusher-websocket-react-native';
import Toast from 'react-native-simple-toast';

var config = require('../../config/pusher.json');
const pusher: any = Pusher.getInstance();

let lastDoc: any = 1;
let PAGE_SIZE: any = 500;
let perPage: any = 30;
let transDate: any = null;
let audioRecorderPlayer: any = null;

const ChatListScreen = (props: any) => {
    const msgRef = useRef<any>(null);
    const mycontact = useSelector((state: any) => state.mycontact);
    const sheetRefGallery = React.useRef<any>(null);
    const scrollRef: any = useRef();
    const insets = useSafeAreaInsets()
    const navigate: any = useNavigation();
    const { language, tr }: any = useContext(LanguageContext);
    const appearanceTheme = useSelector((state: any) => state.appearance);
    const { theme }: any = useContext(ThemeContext);
    const textsize = useSelector((state: any) => state.textSizeChange);
    const { chatItem, contactItem } = props.route.params;
    const { onOpen } = useDisclose();
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [isLocalLoading, setLocalLoading] = useState<any>(null);
    const [chatData, setChatData] = useState<any>(_.isEmpty(chatItem.chatroom_messages) ? chatItem.chatroom_messages : chatItem.chatroom_messages.data);
    const userInfo = useSelector((state: any) => state.user);
    const [data, setData] = useState<any>([]);
    const [playVoice, setPlayVoice] = useState(false);
    const [voiceId, setVoiceId] = useState(null);
    const [voiceDuration, setVoiceDuration] = useState(0);
    const [loadingVoice, setLoadingVoice] = useState(false);
    const [isMute, setMute] = useState(false);
    const [itemMessageEdit, setItemMessageEdit] = useState<any>(null)
    const [isTranslate, setIsTranslate] = useState<any>([]);
    const [nonTranslate, setNonTranslate] = useState<any>([]);
    const dispatch: any = useDispatch();
    let countTransDate: any = 0;

    const [state, setState] = useState<any>({
        message: '',
        loadSendMess: false,
        image: null,
        index: null,
        isEnd: false,
        endCursor: false,
        type: null,
        file: null,
        localVideo: null,
        singleFile: '',
        voice: '',
        isShowActionMess: false,
        isEdit: false,
        showDailog: false,
        vdoIdPlaying: null,
        currentIndex: null
    });
    useEffect(() => (
        navigate.addListener('beforeRemove', (e:any) => {
            var last:any = Object.keys(chatData).pop();
            seenMessage(chatData[last]);
            loadData(dispatch);
            lastDoc = 1;
        })
    ), [navigate]);
    useEffect(() => {
        if (Platform.OS === 'android') hasAndroidPermission();
        connect();
        if (lastDoc == 1 && isTranslate.length == 0) scrollRef.current.scrollToEnd({y:0,animated: true})
    }, [chatData])
    const connect = async () => {
        try {
            await pusher.init({
                apiKey: config.key,
                cluster: config.cluster,
                onEvent
            });
            await pusher.connect();
            await pusher.subscribe({ channelName: `App.User.${userInfo.id}` });
        } catch (e) {
        }
    };
    const onEvent = (event: any) => {
        if (userInfo.id == JSON.parse(event.data).data.data.user_id) _.remove(chatData, function (n: any) { return n.id == 0; });
        if (chatItem.id == JSON.parse(event.data).data.data.chatroom_id) {
            setChatData([...chatData, JSON.parse(event.data).data.data]);
            scrollRef.current != null ? scrollRef.current.scrollToEnd({ animated: true }) : {}
        }
    };
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                sheetRefGallery.current.snapTo(2)
                scrollRef.current != null ? scrollRef.current.scrollToEnd({ animated: true }) : {}
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                sheetRefGallery.current.snapTo(2)
                scrollRef.current != null ? scrollRef.current.scrollToEnd({ animated: true }) : {}
            }
        );
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };

    }, []);

    function seenMessage(last_message: any) {
        if (last_message) {
            const formdata = new FormData();
            formdata.append("chatroom_id", chatItem.id);
            formdata.append("chatroom_message_id", last_message.id);
            POST('chatroom_message/seen', formdata)
        }
    }
    const handleChange = (stateName: string, value: any) => {
        state[`${stateName}`] = value;
        setState({ ...state });
    };
    // function get all gallery from device
    const getPhotos = () => {
        CameraRoll.getPhotos({
            first: PAGE_SIZE,
            assetType: 'Photos',
            include: ['filename', 'fileSize', 'imageSize', 'playableDuration']
        }).then((res) => {
            setData(res.edges);
        })
            .catch((error) => {
                console.log(error);
            });
    };
    const getMore = async () => {
        if (lastDoc > 0) {
            setIsMoreLoading(true)
            setTimeout(async () => {
                GET(`chatroom/detail/${chatItem.id}?page=${lastDoc + 1}&per_page=${perPage}`)
                    .then(async (result) => {
                        if (result.status) {
                            let _data: any = chatData;
                            if (result.status && result.data.chatroom_messages.data.length !== 0) {
                                setChatData([...result.data.chatroom_messages.data, ..._data])
                                _data.push(...result.data.chatroom_messages.data)
                            }
                            lastDoc = Math.ceil(_data.length / perPage);
                            if (result.data.chatroom_messages !== undefined) {
                                if (result.data.chatroom_messages.total <= chatData.length) {
                                    lastDoc = 0;
                                }
                            }
                        }
                        setIsMoreLoading(false)
                    })
                    .catch(e => {
                        setIsMoreLoading(false)
                    });

                setIsMoreLoading(false)
            }, 200);
        }
    }

    async function onSelectImage(item: any, type: any, index: any) {
        handleChange('index', index)
        handleChange('image', item)
        handleChange('type', 'png')
        base64File(item).then((res: any) => {
            handleChange('file', res)
        })
    }
    function millisToMinutesAndSeconds(millis: any) {
        var seconds: any = (millis / 60).toFixed(2);
        return seconds;
    }
    const _renderView = ({ item, index }: any) => {
        return (
            <TouchableOpacity onPress={() => onSelectImage(item.node.image.uri, item.node.type, index)} style={{ width: '33%', height: 150 }}>
                <Image style={{ width: '100%', height: 150, }} source={{ uri: item.node.image.uri }} />
                {item.node.type == 'video' ?
                    <View style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: placeholderDarkTextColor, padding: 5, borderRadius: 20 }}>
                        <Text style={[style.p, { color: whiteColor, fontSize: 12 }]}>{millisToMinutesAndSeconds(item.node.image.playableDuration)}</Text>
                    </View>
                    :
                    <></>
                }
                {state.index == index ?
                    <View style={{ position: 'absolute', backgroundColor: 'white', opacity: 0.7, top: 0, bottom: 0, width: "100%", height: 150, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: baseColor, width: 30, height: 30, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[style.p, { color: whiteColor }]}>1</Text>
                        </View>
                    </View>
                    :
                    <></>
                }
            </TouchableOpacity>
        )
    }
    async function _onTapOptionMenu(type: any) {
        sheetRefGallery.current.snapTo(2)
        if (type == 'Video') {
            ImagePicker.openPicker(
                {
                    mediaType: 'video',
                    includeBase64: true
                }).then(async images => {
                    let localUrl = Platform.OS === 'ios' ? images.sourceURL : images.path
                    handleChange('localVideo', localUrl)
                    base64File(images.path).then((res: any) => {
                        handleChange('type', 'mp4')
                        handleChange('file', res)
                        onSend()
                    })
                }
                )
        }
        else if (type == 'Record Video') {
            ImagePicker.openCamera({
                cropping: false,
                mediaType:'video'
            }).then(response => {
                let localUrl = Platform.OS === 'ios' ? response.sourceURL : response.path
                handleChange('localVideo', localUrl)
                base64File(response.path).then((res: any) => {
                    handleChange('type', 'mp4')
                    handleChange('file', res)
                    onSend()
                })
            });
        }
        else {
            //Opening Document Picker for selection of one file
            try {
                const res: any = await DocumentPicker.pick({
                    type: [DocumentPicker.types.plainText, DocumentPicker.types.pdf, DocumentPicker.types.zip, DocumentPicker.types.csv,
                    DocumentPicker.types.doc, DocumentPicker.types.docx, DocumentPicker.types.ppt, DocumentPicker.types.pptx, DocumentPicker.types.xls, DocumentPicker.types.xlsx],
                });
                handleChange('singleFile', res[0])
                handleChange('message', res[0].name.split('.')[0])
                handleChange('type', res[0].name.split('.')[1])
                base64File(res[0].uri).then((res: any) => {
                    handleChange('file', res)
                })
            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                    //If user canceled the document selection
                } else {
                    //For Unknown Error
                    throw err;
                }
            }
        }

    }

    const renderInner = () => (
        <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
            <FlatListVertical
                renderItem={_renderView}
                numColumns={3}
                data={data}
                ListFooterComponent={
                    <>
                        <Footer />
                    </>
                }
            />
            <View style={{ height: insets.bottom > 0 ? (insets.bottom + 60) : 70, backgroundColor: whiteSmoke, width: deviceWidth, paddingTop: 10 }}>
                <HStack alignItems={'center'}>
                    {options.map((item: any) =>
                        <VStack paddingLeft={8} alignItems={'center'}>
                            <TouchableOpacity onPress={() => _onTapOptionMenu(item.name)} style={{
                                width: 40, height: 40, borderRadius: 40, backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,

                                elevation: 2,
                            }}>
                                <Ionicons name={item.icon} size={20} color={textSecondColor} />
                            </TouchableOpacity>
                            <Text style={[style.p, { fontSize: 12, textAlign: 'center', paddingTop: 5 }]}>{item.name}</Text>
                        </VStack>
                    )}
                </HStack>
            </View>
        </View>
    )
    const onSendImage = () => {
        handleChange('image', '')
        handleChange('index', null)
        onSend()
        sheetRefGallery.current.snapTo(2);
    }
    const onShefGallery = () => {
        getPhotos();
        sheetRefGallery.current.snapTo(0);
        Keyboard.dismiss();
    }
    const onChange = (data: any) => {
        base64File(data.path).then((res: any) => {
            handleChange('type', 'png')
            handleChange('file', res)
            onSend()
        })
    }
    const onChangeVoice = (data: any, duration: any) => {
        handleChange('message', duration)
        handleChange('type', 'mp3')
        handleChange('file', data)
        onSend()
    }
    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => sheetRefGallery.current.snapTo(2)} style={styles.panelHeader}>
                <Text style={[style.p, { color: baseColor, fontSize: 13 }]}>{tr("cancel")}</Text>
            </TouchableOpacity>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
            <TouchableOpacity onPress={onSendImage} style={styles.panelHeader}>
                {state.image ? <Text style={[style.p, { color: baseColor, fontSize: 14, fontWeight: '700' }]}>{tr("done")}</Text> : <Box style={{ width: 50 }} />}
            </TouchableOpacity>
        </View>
    )
    // end function get all gallery from device
    function _onTabHeader({ chatItem, contactItem }: any) {
        if (!_.isEmpty(contactItem)) {
            navigate.navigate('ProfileChat', { chatItem: chatItem, contactItem: contactItem })
        } else {
            const filterUser = chatItem.chatroom_users.find((element: any) => element.user_id != userInfo.id);
            const userContact = filterUser ? mycontact.find((element: any) => element.contact_user.id == filterUser.user_id) : contactItem;
            navigate.navigate('ProfileChat', { chatItem: chatItem, contactItem: userContact })
        }
    }
    const rightIcon = () => {
        return (
            <View style={style.containerCenter}>
                <UserAvatar style={{ width: 40, height: 40 }}>
                    {chatItem.contact_user ?
                        <Image source={chatItem.contact_user.profile_photo ? { uri: chatItem.contact_user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 100 }} />
                        : getDisplayProfile(chatItem)}
                </UserAvatar>
            </View>
        )
    }
    const onChangeMessage = (text: any) =>{
        handleChange('message', text);
        handleChange('type', validURL(text) ? 'url' : 'text')
    }
    const _handleOpen = () => {
        onOpen()
    }
    const onSend = () => {
        const formdata = new FormData();
        formdata.append("message", state.message);
        formdata.append("type", state.type);
        formdata.append("file", state.type === 'text' ? '' : state.file);
        formdata.append("chatroom_id", chatItem.id);
        let body: any = {
            id: 0,
            message: state.message,
            type: state.type,
            file_url: state.type === 'text' ? '' : state.file,
            chatroom_id: chatItem.id,
            user_id: userInfo.id,
            created_by: userInfo.id,
            updated_by: userInfo.id,
            deleted_by: null,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            localVideo: state.localVideo ? state.localVideo : null,
            deleted_at: null,
            user: {
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                username: userInfo.username,
                profile_photo: userInfo.profile_photo,
            },
            chatroom_messages_status: []
        }
        setChatData([...chatData, body]);
        setLocalLoading(chatData.length)
        scrollRef.current != null ? scrollRef.current.scrollToEnd({ animated: true }) : {}
        handleChange('message', '');
        handleChange('singleFile', '');
        POST('chatroom_message/create', formdata)
        .then(async (result: any) => {
            if(result.status){
                seenMessage(result.data)
                setLocalLoading(null)
            }
        })
    }
    const onUpdateMsg = () => {
        if (state.message != itemMessageEdit.message) {
            const formdata = new FormData();
            formdata.append('message', state.message);
            formdata.append('type', itemMessageEdit.type);
            formdata.append('chatroom_message_id', itemMessageEdit.id)
            chatData[state.currentindex].message = state.message;
            handleChange('isEdit', false)
            setItemMessageEdit(null)
            handleChange('message', '')
            POST('chatroom_message/update', formdata).then(async (result: any) => {
                if (result.status) {
                    Keyboard.dismiss()
                    Toast.showWithGravity('Message updated!', Toast.SHORT, Toast.BOTTOM);
                } else {
                    Toast.showWithGravity('You cannot edit message text, try again', Toast.SHORT, Toast.BOTTOM);
                }
            })

        } else {
            handleChange('isEdit', false)
            Keyboard.dismiss()
            setItemMessageEdit(null)
            handleChange('message', '')
        }
    }
    const onPlayVoice = async (mess: any) => {
        setVoiceId(mess.id);
        setLoadingVoice(true);
        setTimeout(async () => {
            if (voiceId === mess.id) {
                if (playVoice) {
                    setPlayVoice(false);
                    audioRecorderPlayer.pausePlayer();
                    setVoiceId(null)
                    audioRecorderPlayer.removePlayBackListener();

                } else {
                    setPlayVoice(true);
                    audioRecorderPlayer.resumePlayer();
                }

            } else {
                setPlayVoice(true);
                if (audioRecorderPlayer) {
                    audioRecorderPlayer.stopPlayer();
                    audioRecorderPlayer.removePlayBackListener();
                }
                audioRecorderPlayer = new AudioRecorderPlayer()
                const msg = await audioRecorderPlayer.startPlayer(mess.file_url);
                audioRecorderPlayer.addPlayBackListener((e: any) => {
                    let _duration = Number(e.duration) - e.currentPosition;
                    setVoiceDuration(_duration);
                    if (_duration <= 0) {
                        setPlayVoice(false);
                        setVoiceId(null)
                        setVoiceDuration(mess.message);
                        audioRecorderPlayer.removePlayBackListener();
                    }
                });
            }
            setLoadingVoice(false);
        }, 250);
    };
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

    const actionOnMessage = (mess: any, index: any) => {
        setItemMessageEdit(mess)
        handleChange('currentindex', index)
        handleChange('isShowActionMess', true)
    }
    const _handleTranslateText = async (id: number, text: string) => {
        if (!isTranslate.includes(id)) {
            ///store translate chat index
            isTranslate.push(id);
            setIsTranslate(isTranslate);
            ///save original chat content
            nonTranslate.push({ key: id, value: text })
            setNonTranslate(nonTranslate);
            /// translate and set result to message
            const result = await translate(text, { to: language });
            const found = chatData.find((e: any) => e.id === id);
            found.message = result;
        } else {
            const indexTemp = isTranslate.indexOf(id, 0);
            if (indexTemp > -1) {
                isTranslate.splice(indexTemp, 1);
            }
            var prevData = nonTranslate.find((e: any) => e.key == id);
            const found = chatData.find((e: any) => e.id === id);
            found.message = prevData.value;
        }
        handleChange('currentindex', id)
        setChatData((chatData: any) => [...chatData]);
    }
    const onPlayVideo = (mess: any, index: any) => {
        handleChange('vdoIdPlaying', mess.id)
    }
    const onFullVideo = (url: any) => {
        navigate.navigate('VideoFull', { videos: url });
    }
    const onMuteVideo = () => {
        setMute(isMute => !isMute);
    }
    const renderFooter: any = () => {
        if (!isMoreLoading) return true;
        return (
            <ActivityIndicator
                size={25}
                color={themeStyle[theme].textColor}
                style={{ marginVertical: 15 }}
            />
        )
    };
    const messageImage = (mess: any, index: any) => {
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start" }]}>
                {chatItem.type == 'group' ?
                    <Text style={{ color: textSecondColor, fontFamily: 'Montserrat-Regular', fontSize: 12 }}>{mess.user.first_name}</Text>
                    :
                    <></>
                }
                <HStack>
                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <></>
                            :
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginRight: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>

                        :
                        <></>
                    }
                    <TouchableOpacity onLongPress={() => mess.created_by == userInfo.id ? actionOnMessage(mess, index) : null} onPress={() => navigate.navigate('DisplayFullImg', { imgDisplay: mess.file_url })} style={{ alignItems: 'flex-end', width: '50%', justifyContent: 'flex-end', backgroundColor: whiteSmoke, borderRadius: 20, padding: 2 }}>
                        <FastImage style={{ width: '100%', height: deviceWidth / 1.4, borderRadius: 20 }} source={{ uri: mess.file_url }} resizeMode='cover' />
                    </TouchableOpacity>
                    <View style={{ position: 'absolute', bottom: 10, backgroundColor: placeholderDarkTextColor, borderRadius: 20, padding: 7, right: mess.created_by == userInfo.id ? chatItem.type != 'group' ? 10 : '15%' : 10, }}>
                        <Text style={{ fontSize: 10, color: whiteColor, fontFamily: 'Montserrat-Regular' }}>{moment(mess.created_at).format('HH:mm A')}</Text>
                    </View>
                    {isLocalLoading == index ?
                        <View style={{ width: 55, height: 55, backgroundColor: placeholderDarkTextColor, position: 'absolute', left: '20%', top: '40%', borderRadius: 50, justifyContent: 'center' }}>
                            <ActivityIndicator
                                color={whiteColor}
                            />
                        </View>
                        :
                        <></>
                    }
                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginLeft: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>
                            :
                            <></>
                        :
                        <></>
                    }
                </HStack>
            </View>
        )
    }

    const _onEndVDO = () => {
        handleChange('vdoIdPlaying', null)
    }
    const messageVideo = (mess: any, index: any) => {
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start" }]}>
                {chatItem.type == 'group' ?
                    <Text style={{ color: textSecondColor, fontFamily: 'Montserrat-Regular', fontSize: 12 }}>{mess.user.first_name}</Text>
                    :
                    <></>
                }
                <HStack>
                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <></>
                            :
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginRight: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>

                        :
                        <></>
                    }
                    <TouchableOpacity onLongPress={() => mess.created_by == userInfo.id ? actionOnMessage(mess, index) : null} onPress={() => onFullVideo(mess.file_url)} style={{ alignItems: 'flex-end', width: '50%', justifyContent: 'flex-end', backgroundColor: whiteSmoke, borderRadius: 20, padding: 2 }}>
                        <View style={{ width: '100%', height: deviceWidth / 1.4, borderRadius: 20 }}>
                            {state.localVideo && isLocalLoading == index ?

                                <Video
                                    source={{ uri: state.localVideo }}
                                    style={{ height: deviceWidth / 1.4, width: '100%', borderRadius: 20 }}
                                    ignoreSilentSwitch={"ignore"}
                                    resizeMode='cover'
                                    paused={true}
                                    repeat={true}
                                />
                                :
                                <Video
                                    source={{ uri: mess.file_url }}
                                    style={{ height: deviceWidth / 1.4, width: '100%', borderRadius: 20 }}
                                    ignoreSilentSwitch={"ignore"}
                                    resizeMode='cover'
                                    playInBackground={false}
                                    playWhenInactive={false}
                                    paused={state.vdoIdPlaying == mess.id ? false : true}
                                    onEnd={_onEndVDO}
                                    // paused={isShowControl}
                                    // onEnd={() => setControll(true)} 
                                    muted={isMute}
                                    repeat={true}
                                />
                            }
                        </View>
                        {state.vdoIdPlaying == null || state.vdoIdPlaying != mess.id ?
                            <TouchableOpacity onPress={() => onPlayVideo(mess, index)} style={{ position: 'absolute', bottom: '45%', right: '38%', backgroundColor: placeholderDarkTextColor, borderRadius: 50, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name='play' size={20} color={whiteColor} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={onMuteVideo} style={{ position: 'absolute', bottom: '5%', left: '5%', backgroundColor: placeholderDarkTextColor, borderRadius: 50, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name={isMute ? "volume-mute" : 'volume-high'} size={20} color={whiteColor} />
                            </TouchableOpacity>
                        }

                    </TouchableOpacity>
                    <View style={{ position: 'absolute', bottom: 10, right: mess.created_by == userInfo.id ? chatItem.type != 'group' ? 10 : '15%' : 10, backgroundColor: placeholderDarkTextColor, borderRadius: 20, padding: 7 }}>
                        <Text style={{ fontSize: 10, color: whiteColor, fontFamily: 'Montserrat-Regular' }}>{moment(mess.created_at).format('HH:mm A')}</Text>
                    </View>
                    {isLocalLoading == index ?
                        <View style={{ width: 55, height: 55, backgroundColor: placeholderDarkTextColor, position: 'absolute', left: '20%', top: '40%', borderRadius: 50, justifyContent: 'center' }}>
                            <ActivityIndicator
                                color={whiteColor}
                            />
                        </View>
                        :
                        <></>
                    }
                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginLeft: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>
                            :
                            <></>
                        :
                        <></>
                    }
                </HStack>
            </View>
        )
    }
    const messageFile = (mess: any, index: any) => {
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start" }]}>
                {chatItem.type == 'group' ?
                    <Text style={{ color: textSecondColor, fontFamily: 'Montserrat-Regular', fontSize: 12 }}>{mess.user.first_name}</Text>
                    :
                    <></>
                }
                <HStack>
                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <></>
                            :
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginRight: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>

                        :
                        <></>
                    }
                    <TouchableOpacity onPress={() => _onOpenFile(mess)} onLongPress={() => actionOnMessage(mess, index)} style={[styles.chatBack,
                    {
                        backgroundColor: mess.created_by == userInfo.id ? _.isEmpty(appearanceTheme) ? baseColor : appearanceTheme.textColor : theme == 'dark' ? '#1A1A1A' : '#F0F0F2',
                        borderBottomRightRadius: mess.created_by == userInfo.id ? 0 : 20,
                        borderBottomLeftRadius: mess.created_by == userInfo.id ? 20 : 0,
                        marginVertical: 1
                    }
                    ]}>
                        <HStack alignItems={'center'} paddingTop={2} style={{ maxWidth: deviceWidth / 2, paddingRight: 2 }}>
                            <View style={{}}>
                                <FontAwesome
                                    name={
                                        mess.type == 'pdf' ? "file-pdf-o" : mess.type == 'xls' || mess.type == 'xlsx' ? 'file-excel-o'
                                            : mess.type == 'ppt' || mess.type == 'pptx' || mess.type == 'csv' ? 'file-powerpoint-o'
                                                : mess.type == 'doc' || mess.type == 'docx' ? 'file-word-o' : mess.type == 'zip' ? 'file-zip-o' : 'link'
                                    } size={20} color={mess.created_by == userInfo.id ? whiteColor : textSecondColor} />
                            </View>
                            <Text style={[style.p, { color: mess.created_by == userInfo.id ? whiteColor : theme == 'dark' ? '#D1D1D1' : baseColor, paddingLeft: 10, fontSize: 12, textDecorationLine: 'underline' }]}>{mess.message}.{mess.type}</Text>
                        </HStack>
                        <Text style={{ fontSize: 10, color: mess.created_by == userInfo.id ? whiteColor : theme == 'dark' ? '#D1D1D1' : textColor, alignSelf: 'flex-end', paddingLeft: 100, fontFamily: 'Montserrat-Regular', marginTop: 3 }}>{moment(mess.created_at).format('HH:mm A')}</Text>
                    </TouchableOpacity>
                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginLeft: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>
                            :
                            <></>
                        :
                        <></>
                    }
                </HStack>
            </View>
        )
    };
    const openLinkChat = (mess: any) => {
        let checkUrlLink = mess.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        checkUrlLink != null ? Linking.openURL(checkUrlLink[0]) : null;
    }

    const messageURL = (mess: any, index: any) => {
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start" }]}>
                {chatItem.type == 'group' ?
                    <Text style={{ color: textSecondColor, fontFamily: 'Montserrat-Regular', fontSize: 12 }}>{mess.user.first_name}</Text>
                    :
                    <></>
                }
                <HStack>
                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <></>
                            :
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginRight: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>

                        :
                        <></>
                    }
                    <TouchableOpacity onPress={() => openLinkChat(mess)} onLongPress={() => actionOnMessage(mess, index)} style={[styles.chatBack,
                    {
                        backgroundColor: mess.created_by == userInfo.id ? _.isEmpty(appearanceTheme) ? baseColor : appearanceTheme.textColor : theme == 'dark' ? '#1A1A1A' : '#F0F0F2',
                        borderBottomRightRadius: mess.created_by == userInfo.id ? 0 : 20,
                        borderBottomLeftRadius: mess.created_by == userInfo.id ? 20 : 0,
                        marginVertical: 1
                    }
                    ]}>
                        <View style={{ width: deviceWidth / 1.5, height: deviceWidth / 1.2, marginTop: 5 }}>
                            <Text style={{ color: mess.created_by == userInfo.id ? whiteColor : theme == 'dark' ? '#D1D1D1' : textColor, fontSize: textsize, fontFamily: 'Montserrat-Regular', paddingBottom: 5, textDecorationLine: 'underline' }}>{mess.message}</Text>
                            <WebView
                                style={{ borderRadius: 10 }}
                                source={{ uri: mess.message }}
                                scalesPageToFit={false}
                                scrollEnabled={false}
                            />
                        </View>
                        <Text style={{ fontSize: 10, color: mess.created_by == userInfo.id ? whiteColor : theme == 'dark' ? '#D1D1D1' : textColor, alignSelf: 'flex-end', paddingLeft: 100, fontFamily: 'Montserrat-Regular', marginTop: 3 }}>{moment(mess.created_at).format('HH:mm A')}</Text>
                    </TouchableOpacity>
                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginLeft: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>
                            :
                            <></>
                        :
                        <></>
                    }
                </HStack>
            </View>
        )
    };
    const messageVoice = (mess: any, index: any) => {
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start" }]}>
                {chatItem.type == 'group' ?
                    <Text style={{ color: textSecondColor, fontFamily: 'Montserrat-Regular', fontSize: 12 }}>{mess.user.first_name}</Text>
                    :
                    <></>
                }
                <HStack>
                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <></>
                            :
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginRight: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>

                        :
                        <></>
                    }
                    <TouchableOpacity onLongPress={() => actionOnMessage(mess, index)} disabled={mess.created_by == userInfo.id ? false : true}
                        style={[styles.chatBack,
                        {
                            backgroundColor: mess.created_by == userInfo.id ? _.isEmpty(appearanceTheme) ? baseColor : appearanceTheme.textColor : theme == 'dark' ? '#1A1A1A' : '#F0F0F2',
                            borderBottomRightRadius: mess.created_by == userInfo.id ? 0 : 20,
                            borderBottomLeftRadius: mess.created_by == userInfo.id ? 20 : 0,
                            paddingHorizontal: 10,
                            paddingVertical: 3,

                        }
                        ]}
                    >
                        <TouchableOpacity activeOpacity={0.9} onPress={() => !loadingVoice && onPlayVoice(mess)} style={[styles.voiceItem, { backgroundColor: mess.created_by == userInfo.id ? '#1F6BADDC' : theme == 'dark' ? '#252525DA' : '#E6E6E6DA', transform: [{ scaleX: 1 }] }]}>
                            {
                                (!loadingVoice || mess.id !== voiceId) ? <Entypo name={(voiceId === mess.id && playVoice) ? "controller-paus" : "controller-play"} size={20} color={"#aaa"} /> :
                                    <ActivityIndicator size={"small"} color={"#aaa"} />
                            }
                            {((voiceId === mess.id && playVoice) || (voiceId === mess.id && voiceDuration !== mess.message)) && <LottieView style={{ height: 30 }} source={require('../../assets/voice_graph.json')} autoPlay loop />}
                            {(voiceId === mess.id) ? <Text style={{ color: '#aaa' }} >{voiceDuration > 0 && playVoice ? convertHMS(Number(voiceDuration) / 1000) : mess.message}</Text> : <Text style={{ color: '#aaa' }}>{mess.message}</Text>}
                        </TouchableOpacity>
                        <Text style={{ fontSize: 10, color: mess.created_by == userInfo.id ? whiteColor : theme == 'dark' ? '#D1D1D1' : textColor, alignSelf: 'flex-end', paddingLeft: 100, fontFamily: 'Montserrat-Regular', marginTop: 3 }}>{moment(mess.created_at).format('HH:mm A')}</Text>
                    </TouchableOpacity>
                    {chatItem.type == 'group' && mess.created_by == userInfo.id ?
                        <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginLeft: 5 }}>
                            <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                        </View>
                        : <></>
                    }
                </HStack>
            </View>
        )
    }

    const messageText = (mess: any, index: any) => {
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start" }]}>
                {chatItem.type == 'group' ?
                    <Text style={{ color: textSecondColor, fontFamily: 'Montserrat-Regular', fontSize: 12 }}>{mess.user.first_name}</Text>
                    :
                    <></>
                }
                <HStack>
                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <></>
                            :
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginRight: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>

                        :
                        <></>
                    }
                    <TouchableOpacity onLongPress={() => actionOnMessage(mess, index)} disabled={mess.created_by == userInfo.id ? false : true} style={[styles.chatBack,
                    {
                        backgroundColor: mess.created_by == userInfo.id ? _.isEmpty(appearanceTheme) ? baseColor : appearanceTheme.textColor : theme == 'dark' ? themeStyle[theme].primary : '#F0F0F2',
                        borderBottomRightRadius: mess.created_by == userInfo.id ? 0 : 20,
                        borderBottomLeftRadius: mess.created_by == userInfo.id ? 20 : 0,
                        marginVertical: 1,
                    }
                    ]}>
                        <Text style={{ color: mess.created_by == userInfo.id ? whiteColor : theme == 'dark' ? '#D1D1D1' : textColor, fontSize: textsize, fontFamily: 'Montserrat-Regular' }}>{mess.message}</Text>
                        <Text style={{ fontSize: 10, color: mess.created_by == userInfo.id ? whiteColor : theme == 'dark' ? '#D1D1D1' : textColor, alignSelf: 'flex-end', paddingLeft: 100, fontFamily: 'Montserrat-Regular' }}>{moment(mess.created_at).format('HH:mm A')}</Text>
                        <TouchableOpacity onPress={() => _handleTranslateText(mess.id, mess.message)}>
                            {
                                !_.isEmpty(isTranslate) && isTranslate.includes(mess.id) ? 

                                    <Text style={{ color: mess.created_by == userInfo.id ? "white" : baseColor, fontSize: 11, fontFamily: 'Montserrat-Regular' }}>Show Orignal</Text>    
                                        : 
                                            <Text style={{ color: mess.created_by == userInfo.id ? "white" : baseColor, fontSize: 11, fontFamily: 'Montserrat-Regular' }}>Translate</Text>
                            }
                        </TouchableOpacity>
                    </TouchableOpacity>

                    {chatItem.type == 'group' ?
                        mess.created_by == userInfo.id ?
                            <View style={{ width: 40, height: 40, marginTop: 10, borderRadius: 40, marginLeft: 5 }}>
                                <Image source={!_.isEmpty(mess.user.profile_photo) ? { uri: mess.user.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            </View>
                            :
                            <></>
                        :
                        <></>
                    }

                </HStack>
            </View>
        )
    };
    const Item = (item: any, index: any) => {
        if (transDate) {
            if (transDate == moment(item.created_at).format('MMMM DD, YYYY')) {
                countTransDate += 1;
            }
            else {
                transDate = moment(item.created_at).format('MMMM DD, YYYY');
                countTransDate = 1;
            }
        } else {
            transDate = moment(item.created_at).format('MMMM DD, YYYY');
            countTransDate = 1;
        }
        return (
            <>
                { countTransDate == 1 ?
                    <Text style={[style.p, { fontSize: 13, paddingTop: 10, paddingBottom: 10, color: chatText, textAlign: 'center' }]}>{moment(transDate).format('MMMM DD, YYYY')}</Text>
                    :
                    <></>
                }
                {item.type == 'text' ? messageText(item, index) : item.type == 'png' ? messageImage(item, index) : item.type == 'mp4' ? messageVideo(item, index) : item.type == 'mp3' ? messageVoice(item, index) : item.type == 'url' ? messageURL(item, index) : messageFile(item, index)}
            </>
        )
    }
    const getName = (item: any): string => {
        var name = ""
        const isIndividual: boolean = item.type === "individual";
        if (isIndividual) {
            const found = item.chatroom_users.find((element: any) => element.user_id != userInfo.id);
            name = found.user.first_name + " " + found.user.last_name;
        } else if (chatItem.contact_user) {
            name = chatItem.contact_user.first_name + ' ' + chatItem.contact_user.last_name
        } else {
            name = item.name;
        }
        return name;
    }
    const getDisplayProfile = (data: any) => {
        const isIndividual: boolean = data.type === "individual";
        const filterUser = data.chatroom_users.find((element: any) => element.user_id != userInfo.id);
        const isFilterUserProfileNull = !_.isEmpty(filterUser) ? filterUser.user.profile_photo == null : null;
        const isGroupPhotoNull = data.profile_photo == null;
        return (
            <>
                {
                    isIndividual
                        ? isFilterUserProfileNull ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> : <Image source={{ uri: filterUser.user.profile_photo }} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 50 }} />
                        : isGroupPhotoNull ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> : <FastImage source={data.profile_photo ? { uri: data.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 50 }} />

                }
            </>
        )
    }
    const _onCloseAction = () => {
        handleChange('isShowActionMess', false)
    }
    const _editMessageAction = () => {
        handleChange('message', itemMessageEdit.message)
        handleChange('isShowActionMess', false)
        handleChange('isEdit', true)
        msgRef.current!.focus();
    }
    const _onCloseEdit = () => {
        handleChange('isEdit', false)
        setItemMessageEdit(null)
        handleChange('message', '')
        Keyboard.dismiss()
    }
    const _removeMessageAction = () => {
        handleChange('isShowActionMess', false)
        handleChange('showDailog', true)
    }
    const onCloseAlert = () => {
        handleChange('showDailog', false)
    }
    const onConfirmDeleteMsg = () => {
        const formdata = new FormData();
        formdata.append('chatroom_message_id', itemMessageEdit.id)
        _.remove(chatData, function (n: any) { return n.id == itemMessageEdit.id; })
        setChatData(chatData)
        handleChange('showDailog', false)
        setItemMessageEdit(null)
        POST('chatroom_message/delete', formdata).then(async (result: any) => {
            if (result.status) {
                Toast.showWithGravity('Message deleted!', Toast.SHORT, Toast.BOTTOM);
            } else {
                handleChange('showDailog', false)
                Toast.showWithGravity('You cannot delete message, try again later', Toast.SHORT, Toast.BOTTOM);
            }
        })
    }
    const _onCopy = () => {
        Clipboard.setString(itemMessageEdit.message);
        handleChange('isShowActionMess', false)
        Toast.showWithGravity('Message copied to clipboard.', Toast.SHORT, Toast.BOTTOM);
    }
    const modalMessageAction = (isShowActionMess: any) => {
        return (
            <Actionsheet isOpen={isShowActionMess} onClose={_onCloseAction}>
                <Actionsheet.Content backgroundColor={themeStyle[theme].backgroundColor}>
                    {itemMessageEdit && itemMessageEdit.type != 'text' ?
                        <VStack>
                            {itemMessageEdit.type == 'url' ?
                                <TouchableOpacity onPress={_onCopy} style={{ width: deviceWidth, padding: 10, }}>
                                    <View style={{ alignContent: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                                        <Ionicons name='copy-outline' size={20} color={textDesColor} style={{ alignSelf: 'flex-end', paddingRight: 6 }} />
                                        <Text style={{ textAlign: 'center', fontSize: 13, fontFamily: 'Montserrat-Regular', color: textDesColor, marginLeft: 10 }}>Copy message text</Text>
                                    </View>
                                </TouchableOpacity>
                                : <View />}
                            <TouchableOpacity onPress={_removeMessageAction} style={{ width: deviceWidth, padding: 10 }}>
                                <View style={{ alignContent: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                                    <Ionicons name='trash-outline' size={20} color='red' style={{ alignSelf: 'flex-end', paddingRight: 6 }} />
                                    <Text style={{ textAlign: 'center', color: '#AF0909', fontSize: 13, fontFamily: 'Montserrat-Regular', marginLeft: 10 }}>Remove message</Text>
                                </View>
                            </TouchableOpacity>
                        </VStack>
                        : <VStack>
                            <TouchableOpacity onPress={_onCopy} style={{ width: deviceWidth, padding: 10, }}>
                                <View style={{ alignContent: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                                    <Ionicons name='copy-outline' size={20} color={textDesColor} style={{ alignSelf: 'flex-end', paddingRight: 6 }} />
                                    <Text style={{ textAlign: 'center', fontSize: 13, fontFamily: 'Montserrat-Regular', color: textDesColor, marginLeft: 10 }}>Copy message text</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={_editMessageAction} style={{ width: deviceWidth, padding: 10, }}>
                                <View style={{ alignContent: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                                    <Ionicons name='create-outline' size={20} color={textDesColor} style={{ alignSelf: 'flex-end', paddingRight: 6 }} />
                                    <Text style={{ textAlign: 'center', fontSize: 13, fontFamily: 'Montserrat-Regular', color: textDesColor, marginLeft: 10 }}>Edit message text</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={_removeMessageAction} style={{ width: deviceWidth, padding: 10 }}>
                                <View style={{ alignContent: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                                    <Ionicons name='trash-outline' size={20} color='red' style={{ alignSelf: 'flex-end', paddingRight: 6 }} />
                                    <Text style={{ textAlign: 'center', color: '#AF0909', fontSize: 13, fontFamily: 'Montserrat-Regular', marginLeft: 10 }}>Remove message</Text>
                                </View>
                            </TouchableOpacity>
                        </VStack>}
                </Actionsheet.Content>
            </Actionsheet>
        )
    }
    const ifCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
        return contentOffset.y == 0;
    };

    return (
        <>
            <View style={{ paddingTop: 40, flex: 1, backgroundColor: themeStyle[theme].backgroundColor, }}>
                <ChatHeader title={getName(chatItem)} rightIcon={rightIcon} onPress={() => _onTabHeader({ chatItem, contactItem })} />
                <ImageBackground source={{ uri: appearanceTheme.themurl }} resizeMode="cover" style={{ width: deviceWidth, height: deviceHeight }}>
                    <KeyboardAvoidingView style={{ ...styles.chatContent, height: deviceHeight * .8, }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
                            {_.isEmpty(chatData) ?
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <View style={{
                                        backgroundColor: theme == 'dark' ? '#232B36E1' : whiteColor,
                                        alignItems: 'center', shadowColor: theme == 'dark' ? '#fff' : "#000",
                                        padding: main_padding, borderRadius: 15,
                                        marginBottom: main_padding,
                                        shadowOffset: {
                                            width: 0,
                                            height: 1,
                                        },
                                        shadowOpacity: 0.18,
                                        shadowRadius: 1.00,
                                        elevation: 1,
                                    }}
                                    >
                                        <Lottie
                                            source={require('../../assets/say_hello.json')}
                                            style={{ width: 200, height: 150 }}
                                            autoPlay loop
                                        />
                                        <Text style={{ fontSize: 12, textAlign: 'center', lineHeight: 20, fontFamily: 'Montserrat-Regular', color: '#B9B9B9' }}>{tr("no_message")}{'\n'}{tr("say_hello")}</Text>
                                    </View>
                                </View>
                                :
                                <>
                                    {renderFooter()}
                                    <ScrollView
                                        ref={scrollRef}
                                        scrollEventThrottle={400}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        onContentSizeChange={() => {
                                            if (lastDoc == 1 && isTranslate.length == 0) scrollRef.current.scrollToEnd({y:0,animated: true})
                                            }
                                        }
                                        onScroll={({ nativeEvent }) => {
                                            if (ifCloseToTop(nativeEvent)) {
                                                getMore();
                                            }
                                        }}
                                    >
                                        <View style={{ padding: main_padding }}>
                                            {chatData.map((item: any, index: any) => Item(item, index))}
                                        </View>
                                    </ScrollView>
                                </>

                            }
                        </TouchableWithoutFeedback>
                        {state.isEdit ?
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: themeStyle[theme].backgroundColor, alignItems: 'center', borderTopColor: borderDivider, borderTopWidth: 0.5 }}>
                                <View style={[styles.chatInput, { height: 70, paddingHorizontal: 10, backgroundColor: themeStyle[theme].backgroundColor, }]}>
                                    <AntDesign name='edit' color={baseColor} size={20} />
                                    <View style={{ height: 30, width: 2, backgroundColor: baseColor, borderRadius: 4, marginHorizontal: 10 }}></View>
                                    <View style={{ width: 300 }}>
                                        <Text style={{ fontWeight: 'bold', paddingBottom: 2, color: themeStyle[theme].textColor, fontFamily: 'Montserrat-Regular', }}>Edit Message</Text>
                                        <Text ellipsizeMode='tail' style={{ marginRight: 10, color: '#C5C5C5', fontFamily: 'Montserrat-Regular', }}>{itemMessageEdit.message}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={_onCloseEdit} style={{ paddingRight: 8 }}>
                                    <Ionicons name='close-outline' color={offlineColor} size={25} />
                                </TouchableOpacity>
                            </View>
                            : <></>}
                        <View style={{ width: deviceWidth, height: deviceHeight * .22, paddingTop: main_padding, borderTopColor: borderDivider, borderTopWidth: 0.4 }}>
                            <ChatRecord
                                message={state.message}
                                loading={state.loadSendMess}
                                msgRef={msgRef}
                                onChangeMessage={(_txt: any) => onChangeMessage(_txt)}
                                onChange={(data: any) => onChange(data)}
                                onChangeVoice={(data: any, duration: any) => onChangeVoice(data, duration)}
                                onOpen={_handleOpen}
                                onSend={state.isEdit ? onUpdateMsg : onSend}
                                onOpenGallery={onShefGallery}
                                singleFile={state.singleFile}
                                onClearFile={() => handleChange('singleFile', '')}
                            />
                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </View>
            <BottomSheet
                ref={sheetRefGallery}
                snapPoints={['90%', 0, 0]}
                overdragResistanceFactor={1}
                renderContent={renderInner}
                renderHeader={renderHeader}
                initialSnap={2}
                enabledInnerScrolling={true}
                enabledContentGestureInteraction={false}
            />
            {modalMessageAction(state.isShowActionMess)}
            <AlertBox
                title={'Attention!'}
                des={"Are you really want to delete your message?"}
                btn_cancle={"No"}
                btn_name={'Delete'}
                onConfirm={onConfirmDeleteMsg}
                onCloseAlert={onCloseAlert}
                isOpen={state.showDailog}
            />
        </>
    );
};

const styles = StyleSheet.create({
    chatInput: {

        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 4,
        paddingHorizontal: deviceWidth * 0.04,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    chatContent: {
        transform: [{ scaleY: 1 }],
        flex: 1,
        justifyContent: 'flex-end',
    },
    chatBody: {
        transform: [{ scaleY: 1 }],
        marginTop: 10,
    },
    chatBack: {
        maxWidth: deviceWidth / 1.3,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    panelContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    panel: {
        flex: 1
    },
    header: {
        backgroundColor: whiteSmoke,
        shadowColor: '#000000',
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    panelHeader: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: baseColor,
        marginBottom: 10,
    },
    voiceItem: {
        // transform: [{ scaleY: -1 }],
        paddingHorizontal: 10,
        marginTop: 10,
        borderRadius: 30,
        width: deviceWidth / 2,
        // backgroundColor: "#fff",
        paddingLeft: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 40
    },
});

export default ChatListScreen;