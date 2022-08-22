import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, Modal, TextInput, Animated, RefreshControl } from 'react-native';
import { Divider, HStack, VStack } from 'native-base';
import colors, { bageColor, baseColor, borderDivider, boxColor, chatText, inputColor, offlineColor, onlineColor, textDesColor, whiteColor } from '../config/colors';
import { large_padding, main_padding } from '../config/settings';
import { FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import SearchBox from '../customs_items/SearchBox';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import { ChatData, UserData } from '../temp_data/Contact';
import { useNavigation } from '@react-navigation/native';
import style, { deviceHeight, deviceWidth } from '../styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CreateGroup from '../containers/chat/CreateGroup';
import { ThemeContext } from '../utils/ThemeManager';
import themeStyle from '../styles/theme';
import Feather from 'react-native-vector-icons/Feather';
import { textSecondColor } from '../config/colors';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import Lottie from 'lottie-react-native';
import { LanguageContext } from '../utils/LangaugeManager';


const ChatScreen = () => {
    const navigate:any = useNavigation();
	const [showModal,setShowModal] = useState(false);
	const [createGroup,setCreateGroup] = useState(false);
	const {theme} : any = useContext(ThemeContext);
	const {tr} : any = useContext(LanguageContext);
	const mycontact = useSelector((state: any) => state.mycontact);
	const myChatList = useSelector((state: any) => state.myChatList);
	const userInfo = useSelector((state: any) => state.user);

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
		navigate.navigate('ChatList', { chatItem: item });
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
		const isFilterUserProfileNull = filterUser.user.profile_photo == null;
		const isGroupPhotoNull = data.profile_photo == null;
		return (
			<>
				{
					isIndividual 
					? isFilterUserProfileNull ? <Image source={require('../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> : <FastImage source={filterUser.profile_photo} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
					: isGroupPhotoNull ? <Image source={require('../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> : <FastImage source={data.profile_photo?{uri:data.profile_photo}:require('../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%',borderRadius:50}}/>

				}
			</>
		)
	}

	
	const _renderChatView = ({item,index}:any) =>{
		return(
		   <>
		   	 {
				item.type == "individual" && _.isEmpty(item.last_chatroom_messages)
				?  <></>
				: 
					<TouchableOpacity onPress={()=>onSelectChat(item)} style={{padding:main_padding,justifyContent:'center',backgroundColor: themeStyle[theme].backgroundColor,borderBottomWidth:1,borderBottomColor:borderDivider}}>
					<HStack justifyContent={'space-between'}>
						<HStack space={3} alignItems="center">
							<UserAvatar>
								{getDisplayProfile(item)}
							</UserAvatar>
							<VStack space={1}>
								<TextItem style={{ fontSize: 16 }}>{getName(item)}</TextItem>
								<Text style={{ textAlign: 'center', fontSize: 14, color: textSecondColor,fontFamily: 'Montserrat-Regular' }}>{item.text}</Text>
							</VStack>
						</HStack>
						<VStack space={2} alignItems={'center'} justifyContent={'center'}>
							<TextItem style={{textAlign:'center',fontSize:11,color:textSecondColor}}>Now</TextItem>
							{item.status ==1?
								<View style={{width:25,height:25,borderRadius:30,backgroundColor:bageColor,alignItems:'center',justifyContent:'center'}}>
									<Text style={{textAlign:'center',fontSize:14,color:whiteColor}}>2</Text>
								</View>
								:
								<></>
							}
						</VStack>
					</HStack>
				</TouchableOpacity>
				}
		   </>
		)
	}

	const _renderContactView = ({ item, index }: any) => {
		return (
			<TouchableOpacity style={{ padding: 7, justifyContent: 'center', marginBottom: 10, borderRadius: 10 }}>
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
					ListFooterComponent={
						<>
							<Footer />
						</>
					}
				/>
			}
			<Modal
				presentationStyle="formSheet"
				visible={showModal}
				animationType="slide"
				transparent={true}
				onDismiss={() => console.log('on dismiss')}>
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