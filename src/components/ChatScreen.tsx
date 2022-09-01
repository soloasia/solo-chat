import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, Modal, TextInput, Animated, RefreshControl, ActivityIndicator } from 'react-native';
import { Divider, HStack, VStack } from 'native-base';
import colors, { bageColor, baseColor, borderDivider, boxColor, chatText, inputColor, offlineColor, onlineColor, textDesColor, whiteColor, whiteSmoke } from '../config/colors';
import { large_padding, main_padding } from '../config/settings';
import { FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import SearchBox from '../customs_items/SearchBox';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import { ChatData, UserData } from '../temp_data/Contact';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import style, { deviceHeight, deviceWidth } from '../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CreateGroup from '../containers/chat/CreateGroup';
import { ThemeContext } from '../utils/ThemeManager';
import themeStyle from '../styles/theme';
import Feather from 'react-native-vector-icons/Feather';
import { textSecondColor } from '../config/colors';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import Lottie from 'lottie-react-native';
import { LanguageContext } from '../utils/LangaugeManager';
import { GET } from '../functions/BaseFuntion';
import moment from 'moment';
import { loadListChat } from '../actions/ListChat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Pusher from 'pusher-js/react-native';
import reactotron from 'reactotron-react-native';

// import { Pusher, PusherMember,PusherChannel, PusherEvent,} from '@pusher/pusher-websocket-react-native';
var config = require('../config/pusher.json');
let lastDoc: any = 1;
let perPage: any = 10;
// const pusher:any = Pusher.getInstance();

const ChatScreen = () => {
    const navigate:any = useNavigation();
	const [showModal,setShowModal] = useState(false);
	const [createGroup,setCreateGroup] = useState(false);
	const {theme} : any = useContext(ThemeContext);
	const [hasScrolled, setHasScrolled] = useState(false);
	const {tr} : any = useContext(LanguageContext);
	const [isRefresh, setIsRefresh] = useState(false);
	const [isMoreLoading, setIsMoreLoading] = useState(false);
	const dispatch:any = useDispatch();
	const [loading,setLoading] = useState(false);
	const mycontact = useSelector((state: any) => state.mycontact);
	const myChatList = useSelector((state: any) => state.myChatList);
	const userInfo = useSelector((state: any) => state.user);
	const route = useRoute();

	useEffect(() => {
		reactotron.log(route.name)
		var pusher = new Pusher(config.key, config);
		var orderChannel = pusher.subscribe(`App.User.${userInfo.id}`);
		orderChannel.bind(`new-message`, (data:any) => {
			getData();
		})
		// async function configPsher() {
		// 	await pusher.init({
		// 		apiKey: config.key,
		// 		cluster:config.cluster
		// 	})  
		// 	await pusher.subscribe(
		// 		{
		// 			channelName: `App.User.${userInfo.id}`,
		// 			onEvent: (event:any) => {
		// 				getData();
		// 			},
		// 			onConnectionStateChange:(currentState:string, previousState:string)=>{
		// 				console.log(`Connection: ${currentState}`);
		// 			}
		// 		}
		// 	);
		// 	await pusher.connect();
		// }
		// configPsher();
		return () => {
			  pusher.unsubscribe(`App.User.${userInfo.id}`);
		  }
	}, [route.name =='Chat']);
 	const [state, setState] = useState<any>({
		searchText: ''
	});
	
	const handleChange = (stateName: string, value: any) => {
		state[`${stateName}`] = value;
		setState({ ...state });
	};
	const onChangeText = (text: any) => {
		handleChange('searchText', text)
	}
	const onConfirmSearch = () => {
	}

	const onSelectChat = (item: any) => {
		GET(`chatroom/detail/${item.id}?per_page=${perPage}`)
			.then(async (result: any) => {
				if(result.status){
					navigate.navigate('ChatList', { chatItem: result.data,last_message:item.last_chatroom_messages });
				}
			})
			.catch(e => {
		});

	}

	const rightIcon = () => {
		return (
			<TouchableOpacity style={style.containerCenter} onPress={() => setShowModal(true)}>
				<Feather name="edit" size={20} color={baseColor} />
			</TouchableOpacity>
		)
	}
	const onClose = () =>{
		setShowModal(false)
	}
	
	const getName = (item : any) : string => {
		var name = ""
		const isIndividual : boolean = item.type === "individual";
		if(isIndividual) {
			const found = item.chatroom_users.find((element : any) => element.user_id != userInfo.id);
			name = found.user.first_name + " " + found.user.last_name;
		} else {
			name = item.name;
		}

	   return name;
	}

	const getDisplayProfile = (data : any) => {
		const isIndividual : boolean = data.type === "individual";
		const filterUser = data.chatroom_users.find((element : any) => element.user_id != userInfo.id);
		
		const isFilterUserProfileNull = !_.isEmpty(filterUser) ? filterUser.user.profile_photo == null : null
		const isGroupPhotoNull = data.profile_photo == null;
		return (
			<>
				{isIndividual  ? isFilterUserProfileNull ? 
					<Image source={require('../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:50  }} /> 
				: <FastImage source={{uri: filterUser.user.profile_photo}} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius:50 }} />
				: isGroupPhotoNull ? <Image source={require('../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> 
				: 
				<FastImage source={data.profile_photo?{uri:data.profile_photo}:require('../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%',borderRadius:50}}/>

				}
			</>
		)
	}

	function _fillterLastMessage (item:any) {
		let filterIsAdmin = _.filter(item.chatroom_users, { is_admin: 1 });
		return(
			_.isEmpty(item.last_chatroom_messages)?
				item.type === 'group'?
					<Text style={[style.p,{fontSize:12,paddingTop:5,color:textDesColor}]}>Created by {filterIsAdmin[0].user.first_name} {filterIsAdmin[0].user.last_name}</Text>
				:
				<></>
			: item.last_chatroom_messages.type == 'png'?
				<HStack alignItems={'center'}>
					<FastImage style={{width:35,height: 35,borderRadius:5,marginTop:10}} source={{uri: item.last_chatroom_messages.file_url}} />
					<Text style={[style.p,{paddingTop:5,color:textDesColor,paddingLeft:10,fontSize: 12}]}>Photo</Text>
				</HStack>
				:
				item.last_chatroom_messages.type == 'mp4'?
					<HStack alignItems={'center'} paddingTop={1}>
						<Ionicons name='videocam-outline' size={22} color={textDesColor} />
						<Text style={[style.p,{color:textDesColor,paddingLeft:10, fontSize: 12}]}>Video</Text>
					</HStack>
				: item.last_chatroom_messages.type == 'text'?
					<Text style={[style.p,{fontSize:12,paddingTop:5,color:textDesColor}]}>{item.last_chatroom_messages.message}</Text>
				: item.last_chatroom_messages.type == 'mp3'?
					<Text style={[style.p,{color:textDesColor,paddingTop:10, fontSize: 12}]}>Voice message</Text>
				:
					<HStack alignItems={'center'} paddingTop={1}>
						<FontAwesome
                            name={
                                item.last_chatroom_messages.type == 'pdf' ? "file-pdf-o" : item.last_chatroom_messages.type == 'xls' || item.last_chatroom_messages.type == 'xlsx' ? 'file-excel-o'
                                    : item.last_chatroom_messages.type == 'ppt' || item.last_chatroom_messages.type == 'pptx' || item.last_chatroom_messages.type == 'csv' ? 'file-powerpoint-o'
                                        : item.last_chatroom_messages.type == 'doc' || item.last_chatroom_messages.type == 'docx' ? 'file-word-o' : item.last_chatroom_messages.type == 'zip' ? 'file-zip-o' : 'link'
                            } size={18} color={textSecondColor } />
                        
						{/* <FontAwesome name='file-text' size={18} color={textDesColor} /> */}
						<Text style={[style.p,{color:textDesColor,paddingLeft:10,fontSize: 12}]}>{item.last_chatroom_messages.message}.{item.last_chatroom_messages.type}</Text>
					</HStack>
			
		)
	}
	
	const _renderChatView = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>onSelectChat(item)} style={{padding:main_padding,justifyContent:'center',borderBottomWidth:1,borderBottomColor:borderDivider}}>
				<HStack justifyContent={'space-between'}>
					<HStack space={3} alignItems="center">
						<UserAvatar>
							{getDisplayProfile(item)}
						</UserAvatar>
						<View style={{width : deviceWidth * 0.65}}>
							<View style={{flexDirection: "row",justifyContent : 'space-between',alignItems : 'center'}}>
								<TextItem style={{ fontSize: 14 }}>{getName(item)}</TextItem>
							</View>
							{_fillterLastMessage(item)}
						</View>
					</HStack>
					<VStack space={2} alignItems={'center'} justifyContent={'center'}>
						<Text style={{textAlign:'center',fontSize:11,color:textSecondColor, fontFamily:'Montserrat-Regular'}}>
							{!_.isEmpty(item.last_chatroom_messages)?
								moment().format('YYYY-MM-DD') == moment(item.last_chatroom_messages.created_at).format('YYYY-MM-DD')?
									moment(item.last_chatroom_messages.created_at).format('LT')
									:
									moment(item.last_chatroom_messages.created_at).format('DD-MMM')
								:
								moment().format('YYYY-MM-DD') == moment(item.created_at).format('YYYY-MM-DD')?
									moment(item.created_at).format('LT')
									:
									moment(item.created_at).format('DD-MMM')
							}
						</Text>
						{item.total_unread_messages > 0 ?
							<View style={{width:25,height:25,borderRadius:30,backgroundColor:bageColor,alignItems:'center',justifyContent:'center'}}>
								<Text style={{textAlign:'center',fontSize:14,color:whiteColor}}>{item.total_unread_messages}</Text>
							</View>
							:
							<></>
						}
					</VStack>
				</HStack>
			</TouchableOpacity>
		)
	}

	const _handleLiveChat = ({item,index}:any) => {
		GET(`chatroom/request-id?user_id=${item.contact_user.id}`)
			.then(async (result: any) => {
				if(result.status){
					onClose()
					navigate.navigate('ChatList', { chatItem: result.data,last_message:item.last_chatroom_messages });
				}
			})
			.catch(e => {
		});
	}

	const _renderContactView = ({ item, index }: any) => {
		return (
			<TouchableOpacity onPress={()=> _handleLiveChat({item,index})} style={{ padding: 7, justifyContent: 'center', marginBottom: 10, borderRadius: 10 }}>
				<HStack alignItems="center" space={4}>
					<UserAvatar>
						<FastImage source={item.contact_user.profile_photo ? { uri: item.contact_user.profile_photo } : require('../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 50 }} />
					</UserAvatar>
					<VStack space={1} flex={1}>
						<Text style={{ ...style.p, color: themeStyle[theme].textColor }}>{item.contact_user.first_name} {item.contact_user.last_name}</Text>
						<HStack alignItems={'center'}>
							<Text style={[style.p, { fontSize: 12, color: textDesColor }]}>{item.contact_user.username}</Text>
						</HStack>
						<Divider marginTop={2} color={borderDivider} _light={{ bg: borderDivider }} _dark={{ bg: whiteColor }} />
					</VStack>
				</HStack>
			</TouchableOpacity>
		)
	}

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

	const onRefresh = () => {
        setIsRefresh(true)
        lastDoc = 1;
        getData();
        setTimeout(() => {
            setIsRefresh(false)
        }, 200);
    };

	const _onScroll = () => {
        if (!hasScrolled)
            setHasScrolled(true)
    };

	function getData() {
		GET(`me/chatrooms?page=${lastDoc}`)
		.then(async (result: any) => {
			if(result.status){
				dispatch(loadListChat(result.data.data))
				setLoading(false)
			}
		})
		.catch(e => {
			setLoading(false)
		});
	}

	const getMore = async () => {
        if (!hasScrolled) return null;
        if (lastDoc > 0) {
			setIsMoreLoading(true)
			setTimeout(async () => {
				GET(`me/chatrooms?page=${lastDoc + 1}`)
				.then(async (result) => {
					console.log("result",result);
					if(result.status) {
						lastDoc += 1;
						let _data : any = myChatList;
						if (result.status && result.data.data.length !== 0) {
							_data.push(...result.data.data)
						}
						dispatch(loadListChat(_data));
						lastDoc = Math.ceil(_data.length / 20);
						if (result.data.data !== undefined) {
							if (result.data.total <= myChatList.length) {
								lastDoc = 0;
							}
						}
					}
					setIsMoreLoading(false)
				})
				.catch(e => {
					setIsMoreLoading(false)
				});
			}, 200);
        }
    };

	return (
		<BaseComponent {...baseComponentData} title={tr('chats')} is_main={true} rightIcon={rightIcon}>
			<SearchBox
				onChangeText={(text: any) => onChangeText(text)}
				onSearch={onConfirmSearch}
			/>
			{_.isEmpty(myChatList)?
				<View style={{width: deviceWidth, height: deviceHeight*0.6, }}>
					<Lottie
						source={require('../assets/no-data.json')} 
						autoPlay loop 
					/> 
				</View>
				:	
				<FlatListVertical
					renderItem={_renderChatView}
					data={myChatList}
					refreshControl={
						<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} colors={[themeStyle[theme].textColor]}  tintColor={themeStyle[theme].textColor} />
					}
					ListFooterComponent={
						<>
							{isMoreLoading && lastDoc !== 0 && renderFooter()}
							<Footer />
						</>
					}
					onTouchMove={_onScroll}
					onEndReached={() => {
						if (!isMoreLoading) {
							getMore();
						}
					}}
				/>
			}
			<Modal
				presentationStyle="formSheet"
				visible={showModal}
				animationType="slide"
				transparent={false}
			>
				<View style={{ flex: 1, backgroundColor: themeStyle[theme].backgroundColor }}>
					<View style={{ margin: main_padding, marginTop: large_padding, }}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<TouchableOpacity onPress={createGroup ? () => setCreateGroup(!createGroup) : () => setShowModal(false)}><Text style={{ color: baseColor, fontWeight: '500', fontSize: 16 }}>Cancel</Text></TouchableOpacity>
							{createGroup ? <TextItem style={{ fontWeight: '600', fontSize: 16 }}>Create new group</TextItem> : <TextItem style={{ fontWeight: '600', fontSize: 16 }}>New Message</TextItem>}
							<View></View>
						</View>
					</View>
					
					{createGroup ?
						<>
							<CreateGroup isUserProfile={false} userChat={ChatData[0]} onClose={onClose}/>
						</>
						:
						<>
							<SearchBox
								onChangeText={(text: any) => onChangeText(text)}
								onSearch={onConfirmSearch}
							/>
							<TouchableOpacity onPress={() => setCreateGroup(true)} style={{ marginVertical: main_padding, flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', marginHorizontal: main_padding }}>
								<View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
									<Ionicons name='people-outline' size={25} color={themeStyle[theme].textColor} />
									<TextItem style={{ fontWeight: '500', marginLeft: 8 }}>Create new group </TextItem>
								</View>
								<Ionicons name='chevron-forward' size={20} color={themeStyle[theme].textColor} />
							</TouchableOpacity>
							<FlatListVertical
								style={{ padding: main_padding }}
								renderItem={_renderContactView}
								data={mycontact}
								ListFooterComponent={
									<>
										<Footer />
									</>
								}
							/>
						</>
					}
				</View>
			</Modal>
		</BaseComponent>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	input: {
		backgroundColor: inputColor,
		height: 45, width: '100%',
		borderRadius: 25,
		paddingHorizontal: main_padding,
		color: textDesColor,
		fontFamily: 'lato',
		fontSize: 13
	},
});

export default ChatScreen;