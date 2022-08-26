import moment from 'moment';
import { Box, HStack, useDisclose, VStack } from 'native-base';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, FlatList, RefreshControl, ImageBackground, KeyboardAvoidingView, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { baseColor, boxColor, chatText, placeholderDarkTextColor, textColor, textSecondColor, whiteColor, whiteSmoke } from '../../config/colors';
import { FlatListVertical, Footer, makeid, TextItem, UserAvatar } from '../../customs_items/Components';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
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
import base64File, { convertHMS, POST } from '../../functions/BaseFuntion';
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

let PAGE_SIZE: any = 500;
let transDate: any = null;
let audioRecorderPlayer:any = null;
const ChatListScreen = (props: any) => {
    const sheetRefGallery = React.useRef<any>(null);
    const ref = useRef<FlatList>(null);
    const insets = useSafeAreaInsets()
    const navigate: any = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const appearanceTheme = useSelector((state: any) => state.appearance);
	const {theme} : any = useContext(ThemeContext);
    const textsize = useSelector((state: any) => state.textSizeChange);
    const { chatItem, contactItem } = props.route.params;
    const { isOpen, onOpen, onClose } = useDisclose();
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [ isLocalLoading, setLocalLoading] = useState<any>(null);
    const [chatData, setChatData] = useState<any>(_.isEmpty(chatItem.chatroom_messages)?chatItem.chatroom_messages:chatItem.chatroom_messages.data);
    const userInfo = useSelector((state: any) => state.user);
    const [data, setData] = useState<any>([]);
    const [playVoice, setPlayVoice] = useState(false);
    const [voiceId, setVoiceId] = useState(null);
    const [voiceDuration, setVoiceDuration] = useState(0);
    const [loadingVoice, setLoadingVoice] = useState(false);
    const [isSending, setIsSending] = useState(false);
    let countTransDate: any = 0;
    const [state, setState] = useState<any>({
        message: '',
        loadSendMess: false,
        image: null,
		index: null,
        isEnd :false,
        endCursor :false,
        type:null,
        file:null,
        localVideo:null,
        singleFile:'',
        voice:''
    });
    useEffect(()=>{
        if(Platform.OS === 'android') hasAndroidPermission();
    },[])
    async function hasAndroidPermission() {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
          return true;
        }
      
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
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
			include: ['filename', 'fileSize','imageSize','playableDuration']
		}).then((res) => {
			setData(res.edges);
		})
		.catch((error) => {
			console.log(error);
		});
	};

    // function getPhotosFromDevice(refresh = false) {
    //     if ((state.isEnd && !refresh)) return;
    //     const params:any = { first: PAGE_SIZE,include: ['filename', 'fileSize','imageSize','playableDuration'] };
    //     if (state.endCursor && !refresh) {
    //       params.after = state.endCursor;
    //       params.first = parseInt(state.endCursor) + PAGE_SIZE;
    //     }
    //     CameraRoll.getPhotos(params).then(
    //       resp => {
    //         handleChange('endCursor',resp.page_info.end_cursor);
    //         handleChange('isEnd',!resp.page_info.has_next_page);
    //         const imgs = resp?.edges?.map(e => e.node) || []
    //         const currentImgs = (data || [])
    //         setData(!refresh ? currentImgs.concat(imgs.filter(img => !currentImgs.find((cImg:any) => cImg.image.uri === img.image.uri))) : (resp?.edges?.map(e => e.node) || []) );
    //       },
    //     );
    // }

    const renderFooter: any = () => {
        if (!isMoreLoading) return true;
        return (
            <ActivityIndicator
                size={25}
                color={baseColor}
                style={{ marginVertical: 15 }}
            />
        )
    };
	const _onScroll = () => {
        if (!hasScrolled)
            setHasScrolled(true)
    };

    async function onSelectImage (item:any,type:any,index:any) {
		handleChange('index',index)
		handleChange('image',item)
		handleChange('type',type)
        base64File(item).then((res:any)=>{
            handleChange('file',res)
        })
	}
	function millisToMinutesAndSeconds(millis:any) {
		var seconds:any = (millis / 60).toFixed(2);
		return seconds;
	}
	const _renderView = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>onSelectImage(item.node.image.uri,item.node.type,index)} style={{width: '33%',height: 150}}>
				<Image style={{width: '100%',height: 150,}} source={{uri: item.node.image.uri}}/>
				{item.node.type == 'video'?
					<View style={{position:'absolute',bottom:5,right:5,backgroundColor:placeholderDarkTextColor,padding:5,borderRadius:20}}>
						<Text style={[style.p,{color:whiteColor,fontSize:12}]}>{millisToMinutesAndSeconds(item.node.image.playableDuration)}</Text>
					</View>
					:
					<></>
				}
				{state.index == index?
					<View style={{position:'absolute',backgroundColor: 'white',opacity: 0.7,top:0,bottom:0,width:"100%",height:150,justifyContent:'center',alignItems:'center'}}>
						<View style={{backgroundColor:baseColor,width:30,height:30,borderRadius:30,alignItems:'center',justifyContent:'center'}}>
							<Text style={[style.p,{color:whiteColor}]}>1</Text>
						</View>
					</View>
					:
					<></>
				}
			</TouchableOpacity>
		)
	}
    async function _onTapOptionMenu (type:any){
        sheetRefGallery.current.snapTo(2)
        if(type == 'Video'){
            ImagePicker.openPicker(
            {
                mediaType: 'video',
                includeBase64: true
            }).then(async images =>{
                let localUrl =  Platform.OS === 'ios'?images.sourceURL: images.path
                handleChange('localVideo',localUrl)
                base64File(images.path).then((res:any)=>{
		            handleChange('type','video')
                    handleChange('file',res)
                    onSend()
                })
                }
            )
        }
        else if(type == 'Camera'){
            ImagePicker.openCamera({
                cropping: false,
            }).then(response => {
                base64File(response.path).then((res:any)=>{
                    handleChange('type','image')
                    handleChange('file',res)
                    onSend()
                })
            });
        }
        else{
            //Opening Document Picker for selection of one file
            try {
                const res:any = await DocumentPicker.pick({
                type: [DocumentPicker.types.plainText,DocumentPicker.types.pdf,DocumentPicker.types.zip,DocumentPicker.types.csv,
                DocumentPicker.types.doc,DocumentPicker.types.docx,DocumentPicker.types.ppt,DocumentPicker.types.pptx,DocumentPicker.types.xls,DocumentPicker.types.xlsx],
                });
                handleChange('singleFile',res[0])
		        handleChange('message',res[0].name.split('.')[0])
		        handleChange('type',res[0].name.split('.')[1])
                base64File(res[0].uri).then((res:any)=>{
                    handleChange('file',res)
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
        <View style={{height:'100%',width:'100%',backgroundColor:'white'}}>
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
            <View style={{height: insets.bottom > 0 ? (insets.bottom + 60):70,backgroundColor:whiteSmoke,width:deviceWidth,paddingTop:10}}>
                <HStack alignItems={'center'}>
                    {options.map((item:any)=>
                        <VStack paddingLeft={8} alignItems={'center'}>
                            <TouchableOpacity onPress={()=>_onTapOptionMenu(item.name)} style={{width:40,height:40,borderRadius:40,backgroundColor:whiteColor,justifyContent:'center',alignItems:'center', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,

                                elevation: 2,}}>
                                <Ionicons name={item.icon}  size={20} color={textSecondColor}/>
                            </TouchableOpacity>
                            <Text style={[style.p,{fontSize:12,textAlign:'center',paddingTop:5}]}>{item.name}</Text> 
                        </VStack>
                    )}
                </HStack>
            </View>
        </View>
    )
	const onSendImage = () =>{
		handleChange('image','')
		handleChange('index',null)
        onSend()
		sheetRefGallery.current.snapTo(2)
	}
    const onShefGallery = () =>{
		getPhotos();
        sheetRefGallery.current.snapTo(0)
        Keyboard.dismiss();
    }
    const onChange = (data:any) =>{
        let localUrl =  Platform.OS === 'ios'?data.sourceURL: data.path
        handleChange('localVideo',localUrl)
        base64File(data.path).then((res:any)=>{
            handleChange('type','video')
            handleChange('file',res)
            onSend()
        })
    }
    const onChangeVoice = (data:any,duration:any) =>{
        handleChange('message',duration)
        handleChange('type','mp3')
        handleChange('file',data)
        onSend()
    }
    const renderHeader = () => (
        <View style={styles.header}>
			<TouchableOpacity onPress={() => sheetRefGallery.current.snapTo(2)} style={styles.panelHeader}>
				<Text style={[style.p,{color:baseColor, fontSize:13}]}>CANCEL</Text>
			</TouchableOpacity>
			<View style={styles.panelHeader}>
				<View style={styles.panelHandle} />
			</View>
			<TouchableOpacity onPress={onSendImage} style={styles.panelHeader}>
				{state.image?<Text style={[style.p,{color:baseColor, fontSize: 14, fontWeight: '700'}]}>DONE</Text>:<Box style={{width:50}}/>}
			</TouchableOpacity>
        </View>
    )
    // end function get all gallery from device

    function _onTabHeader (chatItem:any,contactItem:any){
        navigate.navigate('ProfileChat', { chatItem: chatItem, contactItem: contactItem })
    }
    const rightIcon = () => {
        return (
            <TouchableOpacity onPress={() => _onTabHeader(chatItem,contactItem)} style={style.containerCenter}>
                <UserAvatar style={{ width: 40, height: 40 }}>
                    {chatItem.contact_user ? 
                    <Image source={chatItem.contact_user.profile_photo ? {uri: chatItem.contact_user.profile_photo} : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 100 }} />
                    :getDisplayProfile(chatItem)}
                </UserAvatar>
            </TouchableOpacity>
        )
    }
    const onChangeMessage = useCallback(
        (text: any) => {
            handleChange('message', text);
		    handleChange('type','text')
        },
        [state.message],
    );
    const _handleOpen = () => {
        onOpen()
    }
    const onSend = () => {
        const formdata = new FormData();
        let body:any = {
            message:state.message,
            type :state.type,
            file_url : state.type === 'text'?'':state.file,
            created_by: userInfo.id,
            created_at : moment().format('YYYY-MM-DD hh:mm:ss'),
            localVideo:state.localVideo?state.localVideo:null,
            user:{
                first_name:userInfo.first_name,
                profile_photo:userInfo.profile_photo,
            }
        }
        setChatData((chatData:any) => [...chatData,body]);
        setLocalLoading(chatData.length)
        formdata.append("message", state.message);
        formdata.append("type", state.type);
        formdata.append("file",state.type === 'text'?'':state.file);
        formdata.append("chatroom_id", chatItem.id);
        handleChange('message', '');
        handleChange('singleFile', '');
        POST('chatroom_message/create', formdata)
        .then(async (result: any) => {
            if(result.status){
                setLocalLoading(null)
            }
        })
    }
    const onPlayVoice = async (mess:any) => {
        setVoiceId(mess.id);
        setLoadingVoice(true);
        setTimeout(async () => {
            if (voiceId === mess.id) {
                setIsSending(false);
                if (playVoice) {
                    setPlayVoice(false);
                    audioRecorderPlayer.pausePlayer();

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
                setIsSending(false);
                audioRecorderPlayer.addPlayBackListener((e:any) => {
                    let _duration = Number(mess.message) - e.currentPosition;
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

    const messageImage = (mess:any,index:any) =>{
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start"}]}>    
                {chatItem.type =='group'?
                    <Text style={{color:textSecondColor,fontFamily: 'Montserrat-Regular',fontSize:12}}>{mess.user.first_name}</Text>
                    :
                    <></>
                }  
                <HStack>
                    {chatItem.type =='group'?
                        mess.created_by == userInfo.id?
                            <></>
                            :
                            <View style={{width:40,height:40,marginTop: 10,borderRadius:40,marginRight:5}}>
                                <Image source={!_.isEmpty(mess.user.profile_photo)?{uri:mess.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:40 }} />
                            </View> 
                            
                        :
                        <></>
                    }
                    <TouchableOpacity onPress={()=> navigate.navigate('DisplayFullImg', { imgDisplay: mess.file_url })} style={{alignItems:'flex-end',width:'50%',justifyContent:'flex-end',backgroundColor:whiteSmoke,borderRadius:20,padding:2}}>
                        <FastImage style={{width:'100%',height: deviceWidth/1.4,borderRadius:20}} source={{uri: mess.file_url}} resizeMode='cover' />
                    </TouchableOpacity> 
                    <View style={{position:'absolute',bottom:10,backgroundColor:placeholderDarkTextColor,borderRadius:20,padding:7,right: mess.created_by == userInfo.id?'15%':'33%'}}>
                        <Text style={{ fontSize: 10, color:whiteColor, fontFamily: 'Montserrat-Regular'}}>{moment(mess.created_at).format('HH:mm A')}</Text>
                    </View>
                    {isLocalLoading == index?
                        <View style={{width:55,height:55,backgroundColor:placeholderDarkTextColor,position:'absolute',left:'20%',top:'40%',borderRadius:50,justifyContent:'center'}}>
                            <ActivityIndicator
                                color={whiteColor}
                            />
                        </View>
                        :
                        <></>
                    }
                    {chatItem.type =='group'?
                        mess.created_by == userInfo.id?
                            <View style={{width:40,height:40,marginTop: 10,borderRadius:40,marginLeft:5}}>
                                <Image source={!_.isEmpty(mess.user.profile_photo)?{uri:mess.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:40 }} />
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
    const messageVideo = (mess:any,index:any) =>{
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start"}]}>   
                {chatItem.type =='group'?
                    <Text style={{color:textSecondColor,fontFamily: 'Montserrat-Regular',fontSize:12}}>{mess.user.first_name}</Text>
                    :
                    <></>
                }   
                <HStack>
                    {chatItem.type =='group'?
                        mess.created_by == userInfo.id?
                            <></>
                            :
                            <View style={{width:40,height:40,marginTop: 10,borderRadius:40,marginRight:5}}>
                                <Image source={!_.isEmpty(mess.user.profile_photo)?{uri:mess.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:40 }} />
                            </View> 
                            
                        :
                        <></>
                    }
                    <View style={{alignItems:'flex-end',width:'50%',justifyContent:'flex-end',backgroundColor:whiteSmoke,borderRadius:20,padding:2}}>
                        <View style={{width:'100%',height: deviceWidth/1.4,borderRadius:20}}>
                            {state.localVideo && isLocalLoading == index?
                                <Video
                                    source={{uri:state.localVideo}}
                                    style={{height: deviceWidth/1.4,width:'100%',borderRadius:20}}
                                    ignoreSilentSwitch={"ignore"}
                                    resizeMode='cover'
                                    paused={true}
                                />
                                :
                                <Video
                                    source={{uri:mess.file_url}}
                                    style={{height: deviceWidth/1.4,width:'100%',borderRadius:20}}
                                    ignoreSilentSwitch={"ignore"}
                                    resizeMode='cover'
                                    paused={true}
                                    controls={true}
                                />

                            }
                            
                        </View>
                            
                    </View> 
                    <View style={{position:'absolute',bottom:10,right: mess.created_by == userInfo.id?'15%':'33%',backgroundColor:placeholderDarkTextColor,borderRadius:20,padding:7}}>
                        <Text style={{ fontSize: 10, color:whiteColor, fontFamily: 'Montserrat-Regular' }}>{moment(mess.created_at).format('HH:mm A')}</Text>
                    </View>
                    {isLocalLoading == index?
                        <View style={{width:55,height:55,backgroundColor:placeholderDarkTextColor,position:'absolute',left:'20%',top:'40%',borderRadius:50,justifyContent:'center'}}>
                            <ActivityIndicator
                                color={whiteColor}
                            />
                        </View>
                        :
                        <></>
                    }
                    {chatItem.type =='group'?
                        mess.created_by == userInfo.id?
                            <View style={{width:40,height:40,marginTop: 10,borderRadius:40,marginLeft:5}}>
                                <Image source={!_.isEmpty(mess.user.profile_photo)?{uri:mess.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:40 }} />
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
    const messageFile = (mess: any,index:any) => {
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start" }]}>     
                {chatItem.type =='group'?
                    <Text style={{color:textSecondColor,fontFamily: 'Montserrat-Regular',fontSize:12}}>{mess.user.first_name}</Text>
                    :
                    <></>
                }     
                <HStack>
                    {chatItem.type =='group'?
                        mess.created_by == userInfo.id?
                            <></>
                            :
                            <View style={{width:40,height:40,marginTop: 10,borderRadius:40,marginRight:5}}>
                                <Image source={!_.isEmpty(mess.user.profile_photo)?{uri:mess.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:40 }} />
                            </View> 
                            
                        :
                        <></>
                    }
				<View style={[styles.chatBack,
				{
					backgroundColor: mess.created_by == userInfo.id? _.isEmpty(appearanceTheme)? baseColor : appearanceTheme.textColor:'#DBDBDBE3' ,
					borderBottomRightRadius: mess.created_by == userInfo.id? 0 : 20,
					borderBottomLeftRadius: mess.created_by == userInfo.id? 20 : 0,
					marginVertical: 1,
				}
				]}>
                    <HStack alignItems={'center'} paddingTop={2}>
                        <FontAwesome name='file-text' size={25} color={mess.created_by == userInfo.id ? whiteColor:textColor } />
						<Text style={[style.p,{color:mess.created_by == userInfo.id ? whiteColor:textColor ,paddingLeft:10}]}>{mess.message}.{mess.type}</Text>
                    </HStack>
					<Text style={{ fontSize: 10, color: mess.created_by == userInfo.id ?  whiteColor:textColor, alignSelf: 'flex-end', paddingLeft:100, fontFamily: 'Montserrat-Regular' }}>{moment(mess.created_at).format('HH:mm A')}</Text>
				</View>
                {chatItem.type =='group'?
                    mess.created_by == userInfo.id?
                        <View style={{width:40,height:40,marginTop: 10,borderRadius:40,marginLeft:5}}>
                            <Image source={!_.isEmpty(mess.user.profile_photo)?{uri:mess.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:40 }} />
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

    const messageVoice = (mess:any,index:any) => {
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start" }]}> 
                {chatItem.type =='group'?
                    <Text style={{color:textSecondColor,fontFamily: 'Montserrat-Regular',fontSize:12}}>{mess.user.first_name}</Text>
                    :
                    <></>
                }   
                <HStack>
                    {chatItem.type =='group'?
                        mess.created_by == userInfo.id?
                            <></>
                            :
                            <View style={{width:40,height:40,marginTop: 10,borderRadius:40,marginRight:5}}>
                                <Image source={!_.isEmpty(mess.user.profile_photo)?{uri:mess.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:40 }} />
                            </View> 
                            
                        :
                        <></>
                    }
                    <View style={[styles.chatBack,
                    {
                        backgroundColor: mess.created_by == userInfo.id? _.isEmpty(appearanceTheme)? baseColor : appearanceTheme.textColor:'#DBDBDBE3' ,
                        borderBottomRightRadius: mess.created_by == userInfo.id? 0 : 20,
                        borderBottomLeftRadius: mess.created_by == userInfo.id? 20 : 0,
                        marginVertical: 1,
                    }
                    ]}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => !loadingVoice && onPlayVoice(mess)} style={[styles.voiceItem,{backgroundColor:mess.created_by == userInfo.id? baseColor: '#DBDBDBE3',transform: [{ scaleX: 1 }] }]}>
                            {
                                (!loadingVoice || mess.id !== voiceId) ? <Entypo name={(voiceId === mess.id && playVoice) ? "controller-paus" : "controller-play"} size={20} color={"#aaa"} /> :
                                    <ActivityIndicator size={"small"} color={"#aaa"} />
                            }
                            {((voiceId === mess.id && playVoice) || (voiceId === mess.id && voiceDuration !== mess.message)) && <LottieView style={{ height: 30 }} source={require('../../assets/voice_graph.json')} autoPlay loop />}
                            {(voiceId === mess.id) ? <Text style={{color: '#aaa'}} >{mess.message}</Text> : <Text style={{color: '#aaa'}}>{mess.message}</Text>}
                        </TouchableOpacity>
                        <Text style={{ fontSize: 10, color: mess.created_by == userInfo.id ?  whiteColor:textColor, alignSelf: 'flex-end', paddingLeft:100, fontFamily: 'Montserrat-Regular' }}>{moment(mess.created_at).format('HH:mm A')}</Text>
                    </View>
                    {chatItem.type =='group'?
                        mess.created_by == userInfo.id?
                            <View style={{width:40,height:40,marginTop: 10,borderRadius:40,marginLeft:5}}>
                                <Image source={!_.isEmpty(mess.user.profile_photo)?{uri:mess.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:40 }} />
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


    const messageText = (mess: any,index:any) => {
        return (
            <View style={[styles.chatBody, { alignItems: mess.created_by == userInfo.id ? "flex-end" : "flex-start"}]}>   
                {chatItem.type =='group'?
                    <Text style={{color:textSecondColor,fontFamily: 'Montserrat-Regular',fontSize:12}}>{mess.user.first_name}</Text>
                    :
                    <></>
                }
                <HStack>
                    {chatItem.type =='group'?
                        mess.created_by == userInfo.id?
                            <></>
                            :
                            <View style={{width:40,height:40,marginTop: 10,borderRadius:40,marginRight:5}}>
                                <Image source={!_.isEmpty(mess.user.profile_photo)?{uri:mess.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:40 }} />
                            </View> 
                            
                        :
                        <></>
                    }
                    <View style={[styles.chatBack,
                    {
                        backgroundColor: mess.created_by == userInfo.id? _.isEmpty(appearanceTheme)? baseColor : appearanceTheme.textColor:'#DBDBDBE3' ,
                        borderBottomRightRadius: mess.created_by == userInfo.id? 0 : 20,
                        borderBottomLeftRadius: mess.created_by == userInfo.id? 20 : 0,
                        marginVertical: 1,
                    }
                    ]}>
                        <Text selectable={true} selectionColor={'blue'}  style={{ color: mess.created_by == userInfo.id ? whiteColor:textColor  , fontSize: textsize, fontFamily: 'Montserrat-Regular' }}>{mess.message}</Text>
                        <Text style={{ fontSize: 10, color: mess.created_by == userInfo.id ?  whiteColor:textColor, alignSelf: 'flex-end', paddingLeft:100, fontFamily: 'Montserrat-Regular' }}>{moment(mess.created_at).format('HH:mm A')}</Text>
                    </View>
                    {chatItem.type =='group'?
                        mess.created_by == userInfo.id?
                            <View style={{width:40,height:40,marginTop: 10,borderRadius:40,marginLeft:5}}>
                                <Image source={!_.isEmpty(mess.user.profile_photo)?{uri:mess.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:40 }} />
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
    const Item = ({ item, index }: any) => {
        if(transDate){
            if(transDate== moment(item.created_at).format('MMMM DD, YYYY')) {
                countTransDate+=1;
            }
            else{
                transDate = moment(item.created_at).format('MMMM DD, YYYY');
                countTransDate=1;
            }
        }else{
            transDate = moment(item.created_at).format('MMMM DD, YYYY');
            countTransDate = 1 ;
        }
        return(
            <>
                { countTransDate == 1?
                    <Text style={[style.p,{ fontSize: 13, paddingTop: 10, paddingBottom: 10, color: chatText,textAlign:'center' }]}>{moment(transDate).format('MMMM DD, YYYY')}</Text>
                    :
                    <></>
                }
                {item.type == 'text'?messageText(item,index) : item.type =='image'?messageImage(item,index) :item.type =='video'?messageVideo(item,index): item.type =='mp3'?messageVoice(item,index): messageFile(item,index)}
            </>
        )
    }
    const getName = (item : any) : string => {
		var name = ""
		const isIndividual : boolean = item.type === "individual";
		if(isIndividual) {
			const found = item.chatroom_users.find((element : any) => element.user_id != userInfo.id);
			name = found.user.first_name + " " + found.user.last_name;
		} else if (chatItem.contact_user) {
            name = chatItem.contact_user.first_name + ' ' + chatItem.contact_user.last_name
        } else {
			name = item.name;
		}
	   return name;
	}
	const getDisplayProfile = (data : any) => {
		const isIndividual : boolean = data.type === "individual";
		const filterUser = data.chatroom_users.find((element : any) => element.user_id != userInfo.id);
		const isFilterUserProfileNull = !_.isEmpty(filterUser) ? filterUser.user.profile_photo == null : null;
		const isGroupPhotoNull = data.profile_photo == null;
		return (
			<>
				{
					isIndividual 
					? isFilterUserProfileNull ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> : <Image source={{uri:filterUser.user.profile_photo}} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:50 }} />
					: isGroupPhotoNull ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> :  <FastImage source={data.profile_photo?{uri:data.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%',borderRadius:50}}/>

				}
			</>
		)
	}
    return (
        <>
            <View style={{paddingTop: 40, flex: 1, backgroundColor : themeStyle[theme].backgroundColor}}>
                <ChatHeader title={getName(chatItem)} rightIcon={rightIcon} />
                <ImageBackground source={{ uri: appearanceTheme.themurl }} resizeMode="cover" style={{ width: deviceWidth, height: deviceHeight }}>
                    <KeyboardAvoidingView style={{ ...styles.chatContent, height: deviceHeight * .8, }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
                            {_.isEmpty(chatData)?
                                <View style={{flex:1,justifyContent:'center',alignItems:'center',}}>
                                    <View style={{backgroundColor: theme =='dark' ? '#232B36E1' : whiteColor,
                                        alignItems:'center', shadowColor: theme =='dark' ? '#fff' :"#000", 
                                        padding: main_padding,borderRadius: 15,
                                        marginBottom: main_padding,
                                        shadowOffset: {
                                            width: 0,
                                            height: 1,
                                        },
                                        shadowOpacity: 0.18,
                                        shadowRadius: 1.00,
                                        elevation: 1, }}
                                    >
                                            <Lottie
                                                source={require('../../assets/say_hello.json')}
                                                style={{width: 200, height: 150}}
                                                autoPlay loop
                                            />
                                        <Text style={{fontSize: 12, textAlign: 'center', lineHeight: 20, fontFamily: 'Montserrat-Regular', color: '#B9B9B9'}}>No messages here yet...{'\n'}Say Hello to start conversations</Text>
                                    </View>
                                </View>
                                :
                                <FlatList
                                    style={{paddingHorizontal: main_padding}}
                                    ref={ref}
                                    listKey={makeid()}
                                    renderItem={Item}
                                    data={chatData}
                                    showsVerticalScrollIndicator={false}
                                    ListFooterComponent={
                                        <>
                                            <View style={{
                                                height: insets.bottom > 0 ? (insets.bottom + 20):70
                                            }} />
                                        </>
                                    }
                                
                                scrollEventThrottle={16}
                                onEndReachedThreshold={0.5}
                                keyExtractor={(_, index) => index.toString()}
                            >
                            </FlatList>
                        }
                    </TouchableWithoutFeedback>
                    <View style={{ width: deviceWidth, height: deviceHeight * .2 }}>
                        <ChatRecord
                            message={state.message}
                            loading={state.loadSendMess}
                            onChangeMessage={(_txt: any) => onChangeMessage(_txt)}
				            onChange={(data:any) => onChange(data)}
                            onChangeVoice={(data:any,duration:any) => onChangeVoice(data,duration)}
                            onOpen={_handleOpen}
                            onSend={onSend}
                            onOpenGallery ={onShefGallery}
                            singleFile={state.singleFile}
                            onClearFile={() => handleChange('singleFile','')}
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
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    chatContent: {
        transform: [{ scaleY: 1 }],
        flex: 1,
        justifyContent: 'flex-end',
        // marginBottom: 10,
        // paddingHorizontal: main_padding
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
        flex:1
      },
      header: {
        backgroundColor:whiteSmoke,
        shadowColor: '#000000',
        padding:15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
      },
      panelHeader: {
        alignItems: 'center',
        justifyContent:'center'
      },
      panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor:baseColor,
        marginBottom: 10,
      },
      voiceItem: {
        transform: [{ scaleY: -1 }],
        paddingHorizontal: 10,
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 30,
        width: deviceWidth / 2,
        backgroundColor: "#fff",
        paddingLeft: 10,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 40
    },
});

export default ChatListScreen;