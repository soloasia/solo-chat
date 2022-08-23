import moment from 'moment';
import { Box, Divider, HStack, useDisclose } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, FlatList, RefreshControl, ImageBackground, KeyboardAvoidingView, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import reactotron from 'reactotron-react-native';
import { baseColor, boxColor, chatText, placeholderDarkTextColor, textColor, whiteColor, whiteSmoke } from '../../config/colors';
import { FlatListVertical, Footer, makeid, TextItem, UserAvatar } from '../../customs_items/Components';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import style, { deviceWidth } from '../../styles';
import { message } from '../../temp_data/Setting';
import ChatRecord from './ChatRecord';
import { deviceHeight } from '../../styles/index';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { main_padding } from '../../config/settings';
import BottomSheet from 'reanimated-bottom-sheet';
import CameraRoll from '@react-native-community/cameraroll';
import FastImage from 'react-native-fast-image';
import Lottie from 'lottie-react-native';

let PAGE_SIZE: any = 500;
const ChatListScreen = (props: any) => {
    const sheetRefGallery = React.useRef<any>(null);
    const navigate: any = useNavigation();
    const appearanceTheme = useSelector((state: any) => state.appearance);
    const textsize = useSelector((state: any) => state.textSizeChange);
    const { chatItem } = props.route.params;
    const ref = useRef<FlatList>(null);
    const { isOpen, onOpen, onClose } = useDisclose();
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [chatData, setChatData] = useState<any>(chatItem.chatroom_messages.data);

    const userInfo = useSelector((state: any) => state.user);
    const [data, setData] = useState<any>([]);
    const [state, setState] = useState<any>({
        message: '',
        loadSendMess: false,
        image: null,
		index: null,
        isEnd :false,
        endCursor :false
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
			assetType: 'All',
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

	function onSelectImage (item:any,index:any){
		handleChange('index',index)
		handleChange('image',item)
	}
	function millisToMinutesAndSeconds(millis:any) {
		var seconds:any = (millis / 60).toFixed(2);
		return seconds;
	}
	const _renderView = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>onSelectImage(item.node.image.uri,index)} style={{width: '33%',height: 150}}>
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
                // onTouchMove={_onScroll}
            />
        </View>
    )
	const onSendImage = () =>{
		handleChange('image','')
		handleChange('index',null)
		sheetRefGallery.current.snapTo(2)
	}
    const renderHeader = () => (
        <View style={styles.header}>
			<TouchableOpacity onPress={() => sheetRefGallery.current.snapTo(2)} style={styles.panelHeader}>
				<Text style={[style.p,{color:baseColor}]}>CANCEL</Text>
			</TouchableOpacity>
			<View style={styles.panelHeader}>
				<View style={styles.panelHandle} />
			</View>
			<TouchableOpacity onPress={onSendImage} style={styles.panelHeader}>
				{state.image?<Text style={[style.p,{color:baseColor}]}>DONE</Text>:<Box style={{width:50}}/>}
			</TouchableOpacity>
        </View>
    )
    const onShefGallery = () =>{
		getPhotos();
        // getPhotosFromDevice();
        sheetRefGallery.current.snapTo(0)
    }
    // end function get all gallery from device

    
    
    const rightIcon = () => {
        return (
            <TouchableOpacity onPress={() => navigate.navigate('ProfileChat', { chatItem: chatItem })} style={style.containerCenter}>
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
            handleChange('message', text)
        },
        [state.message],
    );
    const _handleOpen = () => {
        onOpen()
    }
    const onSend = () => {

    }
   
    const messageText = (mess: any, index: any) => {
        return (
            <View style={[styles.chatBody, { alignItems: !mess.isAdmin ? "flex-end" : "flex-start" }]}>           
				<View style={[styles.chatBack,
				{
					backgroundColor: mess.isAdmin ? '#DBDBDBE3' : _.isEmpty(appearanceTheme)? baseColor : appearanceTheme.textColor,
					borderBottomRightRadius: mess.isAdmin ? 20 : 0,
					borderBottomLeftRadius: mess.isAdmin ? 0 : 20,
					marginVertical: 1
				}
				]}>
					<Text selectable={true} selectionColor={'blue'}  style={{ color: mess.isAdmin ? textColor : whiteColor, fontSize: textsize, fontFamily: 'Montserrat-Regular' }}>{mess.text}</Text>
					<Text style={{ fontSize: 10, color: mess.isAdmin ?  textColor: whiteColor, alignSelf: 'flex-end', paddingLeft:100, fontFamily: 'Montserrat-Regular' }}>{moment().format('HH:mm A')}</Text>
				</View>
            </View>
        )
    };

    const Item = ({ item, index }: any) => (
        <>
            <Text style={{ textAlign: 'center', fontSize: 13, paddingTop: 10, paddingBottom: 10, color: chatText }}>{item.date}</Text>
            {item.data.map((mess: any, index: any) => messageText(mess, index))}
        </>
    );

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
		const isFilterUserProfileNull = filterUser.user.profile_photo == null;
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
        <BaseComponent {...baseComponentData} title={getName(chatItem)} is_main={false} rightIcon={rightIcon}>
            <ImageBackground source={{ uri: appearanceTheme.themurl }} resizeMode="cover" style={{ width: deviceWidth, height: deviceHeight }}>
                <KeyboardAvoidingView style={{ ...styles.chatContent, height: deviceHeight * .8, }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <TouchableWithoutFeedback accessible={false} >
                        {_.isEmpty(chatData)?
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <View style={{width: 300, height: 150}}>
                                    <Lottie
                                        source={require('../../assets/login.json')}
                                        autoPlay loop
                                    />
                                </View>
                                <Text>No messages here yet...</Text>
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
                                    <View style={{ height: 20 }}>
                                    </View>
                                }
                                // refreshControl={
                                //     <RefreshControl
                                //         refreshing={refreshing}
                                //         onRefresh={_handleRefresh}
                                //         tintColor="black" />
                                // }
                                // onContentSizeChange={() => {
                                //     if (!refreshing) {

                                //         ref.current != null ? ref.current.scrollToEnd({ animated: true }) : {}
                                //     }
                                // }}
                                // onLayout={() => {
                                //     if (!refreshing) {

                                //         ref.current != null ? ref.current.scrollToEnd({ animated: true }) : {}
                                //     }
                                // }}
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
                            onOpen={_handleOpen}
                            onSend={onSend}
                            onOpenGallery ={onShefGallery}
                        />
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
           
        </BaseComponent>
        <BottomSheet
            ref={sheetRefGallery}
            snapPoints={['50%', '95%', 0]}
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
});

export default ChatListScreen;