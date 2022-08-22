import moment from 'moment';
import { Divider, HStack, useDisclose } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, FlatList, RefreshControl, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
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

const ChatListScreen = (props: any) => {
    const sheetRefGallery = React.useRef<any>(null);
    const navigate: any = useNavigation();
    const appearanceTheme = useSelector((state: any) => state.appearance);
    const textsize = useSelector((state: any) => state.textSizeChange);
    const { chatItem } = props.route.params;
    const ref = useRef<FlatList>(null);
    const { isOpen, onOpen, onClose } = useDisclose();
    const userInfo = useSelector((state: any) => state.user);
    const [data, setData] = useState<any>([]);
    const [state, setState] = useState<any>({
        message: '',
        loadSendMess: false,
        image: null,
		index: null
    });

    useEffect(() => {
		getPhotos();
	}, []);
    
    const handleChange = (stateName: string, value: any) => {
        state[`${stateName}`] = value;
        setState({ ...state });
    };
    // function get all gallery from device
    const getPhotos = () => {
		CameraRoll.getPhotos({
			first: 1000,
			assetType: 'All',
			include: ['filename', 'fileSize','imageSize','playableDuration']
		}).then((res) => {
			setData(res.edges);
		})
		.catch((error) => {
			console.log(error);
		});
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
    )
	const onSendImage = () =>{
		handleChange('image','')
		handleChange('index',null)
		sheetRefGallery.current.snapTo(2)
	}
    const renderHeader = () => (
        <View style={styles.header}>
			<TouchableOpacity onPress={() => sheetRefGallery.current.snapTo(2)} style={styles.panelHeader}>
				<Text style={[style.p,{color:whiteColor}]}>CANCEL</Text>
			</TouchableOpacity>
			<View style={styles.panelHeader}>
				<View style={styles.panelHandle} />
			</View>
			<TouchableOpacity onPress={onSendImage} style={styles.panelHeader}>
				{state.image?<Text style={[style.p,{color:whiteColor}]}>DONE</Text>:<></>}
			</TouchableOpacity>
        </View>
    )
    const onShefGallery = () =>{
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
					? isFilterUserProfileNull ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> : <Image source={filterUser.profile_photo} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
					: isGroupPhotoNull ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> : <Image source={data.profile_photo} resizeMode='cover' style={{ width: '100%', height: '100%' }} />

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
                        <FlatList
                            style={{paddingHorizontal: main_padding}}
                            ref={ref}
                            listKey={makeid()}
                            renderItem={Item}
                            data={message}
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
        backgroundColor:baseColor,
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
        backgroundColor:whiteSmoke,
        marginBottom: 10,
      },
});

export default ChatListScreen;