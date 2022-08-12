import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View,Image, Modal, TextInput, Animated } from 'react-native';
import { Divider, HStack,VStack } from 'native-base';
import colors, { bageColor, baseColor, boxColor, chatText, inputColor, offlineColor, onlineColor, textDesColor, whiteColor } from '../config/colors';
import { large_padding, main_padding } from '../config/settings';
import { FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import SearchBox from '../customs_items/SearchBox';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import { ChatData, UserData } from '../temp_data/Contact';
import { useNavigation } from '@react-navigation/native';
import style from '../styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CreateGroup from '../containers/chat/CreateGroup';


const ChatScreen = () => {
    const navigate:any = useNavigation();
	const [showModal,setShowModal] = useState(false);
	const [createGroup,setCreateGroup] = useState(false);
 	const [state, setState] = useState<any>({
		searchText: ''
	});
	const handleChange = (stateName: string, value: any) => {
		state[`${stateName}`] = value;
		setState({...state});
	};
  	const onChangeText = (text:any) =>{
		handleChange('searchText',text)
	}
	const onConfirmSearch = () =>{
	}

	const onSelectChat = (item:any) =>{
        navigate.navigate('ChatList',{chatItem:item});
	}
	const rightIcon = () =>{
		return(
			<TouchableOpacity style={style.containerCenter} onPress={()=>setShowModal(true)}>
				<FontAwesome name="edit" size={25} color={baseColor}/>
			</TouchableOpacity>
		)
	}
	const _renderChatView = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>onSelectChat(item)} style={{padding:main_padding,justifyContent:'center',backgroundColor:whiteColor,borderBottomWidth:1,borderBottomColor:boxColor}}>
				<HStack justifyContent={'space-between'}>
					<HStack space={3} alignItems="center">
						<UserAvatar>
							<Image source={item.icon} resizeMode='cover' style={{width:'100%',height:'100%'}}/>
						</UserAvatar>
						<VStack space={1}>
							<TextItem style={{fontSize:16}}>{item.name}</TextItem>
							<TextItem style={{textAlign:'center',fontSize:14,color:chatText}}>{item.text}</TextItem>
						</VStack>
					</HStack>
					<VStack space={2} alignItems={'center'} justifyContent={'center'}>
						<TextItem style={{textAlign:'center',fontSize:14,color:chatText}}>Now</TextItem>
						{item.status ==1?
							<View style={{width:25,height:25,borderRadius:30,backgroundColor:bageColor,alignItems:'center',justifyContent:'center'}}>
								<TextItem style={{textAlign:'center',fontSize:14,color:whiteColor}}>2</TextItem>
							</View>
							:
							<></>
						}	
					</VStack>
				</HStack>
			</TouchableOpacity>
		)
	}

	const _renderContactView = ({item,index}:any) =>{
		return(
			<TouchableOpacity style={{padding:7,justifyContent:'center',marginBottom:10,borderRadius:10}}>
				<HStack  alignItems="center" space={4}>
					<UserAvatar>
						<Image source={item.icon} resizeMode='cover' style={{width:'100%',height:'100%'}}/>
					</UserAvatar>
					<VStack space={1} flex={1}>
						<TextItem style={{fontSize:16}}>{item.name}</TextItem>
						<HStack alignItems={'center'}>
							<View style={{width:12,height:12,borderRadius:10,backgroundColor:item.status =='online'? onlineColor:offlineColor}}/>
							<TextItem style={{textAlign:'center',fontSize:13,color:item.status =='online'? onlineColor:offlineColor,paddingLeft: 5,}}>{item.status}</TextItem>
						</HStack>
						<Divider marginTop={2} color={boxColor} _light={{ bg: boxColor}} _dark={{bg:whiteColor}}/>
					</VStack>
				</HStack>
			</TouchableOpacity>
		)
	}

	return (
		<BaseComponent {...baseComponentData} title={'Chats'} is_main={true} rightIcon={rightIcon}>
			<SearchBox
				onChangeText={(text:any)=> onChangeText(text)}
				onSearch={onConfirmSearch}
			/>
			<FlatListVertical
				renderItem={_renderChatView}
				data={ChatData}
				ListFooterComponent={
					<>
						<Footer />
					</>
				}
			/>

			<Modal
                presentationStyle="formSheet"
                visible ={showModal}
				animationType="slide"
                onDismiss={() => console.log('on dismiss')}>
					<View style={{margin : main_padding, marginTop : large_padding}}>
							<View style={{flexDirection : 'row',justifyContent: 'space-between', alignItems:'center'}}>
								<TouchableOpacity onPress={createGroup ?() => setCreateGroup(!createGroup) : ()=> setShowModal(false)}><Text style={{color: baseColor ,fontWeight :'500',fontSize :16}}>Cancel</Text></TouchableOpacity>
								{createGroup ? <Text style={{fontWeight :'600',fontSize :16}}>Create new group</Text> : <Text style={{fontWeight :'600',fontSize :16}}>New Message</Text>}
								{createGroup ? <TouchableOpacity><Text style={{color: baseColor}}>Create</Text></TouchableOpacity> : <View></View>}
							</View>
						</View>
						<SearchBox
							onChangeText={(text:any)=> onChangeText(text)}
							onSearch={onConfirmSearch}
						/>
						{
							createGroup 
							?  
								<>
									<View style={{paddingHorizontal: main_padding ,marginBottom : main_padding}}>
										<TextInput
											style={{ fontSize: 14, fontFamily: 'lato', borderRadius: 7 }}
											placeholder='Group name...'
											placeholderTextColor={textDesColor}
										/>
									</View>
									<CreateGroup isUserProfile={true} userChat={ChatData[0]} />
								</>
							: 
							<>
								<TouchableOpacity onPress={()=> setCreateGroup(true)} style= {{marginVertical : main_padding,flexDirection : "row",alignItems:'center',justifyContent: 'space-between',marginHorizontal : main_padding}}>
									<View style={{flexDirection : "row",justifyContent:'center',alignItems :'center'}}>
										<Ionicons name='people-outline' size={25} color={colors.textColor} />
										<Text style={{fontWeight :'500',marginLeft : 8}}>Create new group </Text>
									</View>
									<Ionicons name='chevron-forward' size={20} color={'lgray'} />
								</TouchableOpacity>
								<FlatListVertical
									style={{padding:main_padding}}
									renderItem={_renderContactView}
									data={UserData}
									ListFooterComponent={
										<>
											<Footer />
										</>
									}
								/>
							</>
						}

				{/* {createGroup 
				? 
                	<CreateGroup isUserProfile={true} userChat={ChatData[0]} /> 
				: <>
					
					</>
				} */}
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
        height: 45,width: '100%', 
        borderRadius: 25, 
        paddingHorizontal: main_padding, 
        color: textDesColor, 
        fontFamily: 'lato', 
        fontSize: 13
    },
});

export default ChatScreen;