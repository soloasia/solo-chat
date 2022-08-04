import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View,Image } from 'react-native';
import { HStack,VStack } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { boxColor, chatText, whiteColor, whiteSmoke } from '../config/colors';
import { main_padding } from '../config/settings';
import { FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import SearchBox from '../customs_items/SearchBox';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import { ChatData } from '../temp_data/Contact';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
    const navigate:any = useNavigation();
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

	const _renderChatView = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>onSelectChat(item)} style={{padding:main_padding,justifyContent:'center',backgroundColor:item.status ==1? boxColor:whiteColor,borderBottomWidth:1,borderBottomColor:whiteSmoke}}>
				<HStack   justifyContent={'space-between'}>
					<HStack space={3} alignItems="center">
						<UserAvatar>
							<Image source={item.icon} resizeMode='cover' style={{width:'100%',height:'100%'}}/>
						</UserAvatar>
						<VStack space={1}>
							<TextItem style={{fontSize:16}}>{item.name}</TextItem>
							<TextItem style={{textAlign:'center',fontSize:14,color:chatText}}>{item.text}</TextItem>
						</VStack>
					</HStack>
					<TextItem style={{textAlign:'center',fontSize:14,color:chatText}}>Now</TextItem>
				</HStack>
			</TouchableOpacity>
		)
	}
	
	return (
		<BaseComponent {...baseComponentData} title={'Chats'} is_main={true}>
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
		</BaseComponent>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
});

export default ChatScreen;