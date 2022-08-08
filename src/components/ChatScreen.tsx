import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View,Image } from 'react-native';
import { HStack,VStack } from 'native-base';
import { bageColor, baseColor, boxColor, chatText, whiteColor } from '../config/colors';
import { main_padding } from '../config/settings';
import { FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import SearchBox from '../customs_items/SearchBox';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import { ChatData } from '../temp_data/Contact';
import { useNavigation } from '@react-navigation/native';
import style from '../styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import reactotron from 'reactotron-react-native';

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
	const rightIcon = () =>{
		return(
			<TouchableOpacity style={style.containerCenter}>
				<FontAwesome name="edit" size={25} color={baseColor}/>
			</TouchableOpacity>
		)
	}
	const _renderChatView = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>onSelectChat(item)} style={{padding:main_padding,justifyContent:'center',backgroundColor:whiteColor,borderBottomWidth:1,borderBottomColor:boxColor}}>
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