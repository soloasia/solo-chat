import React, { useState } from 'react';
import { Text, StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import {  Divider, HStack, VStack } from 'native-base'
import { baseColor, boxColor, offlineColor, onlineColor, whiteColor } from '../config/colors';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBox from '../customs_items/SearchBox';
import reactotron from 'reactotron-react-native';
import { FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import { UserData } from '../temp_data/Contact';
import { main_padding } from '../config/settings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import style from '../styles';
const ContactScreen = () => {
    const insets = useSafeAreaInsets()
	const [state, setState] = useState<any>({
		searchText: ''
	});
	const handleChange = (stateName: string, value: any) => {
		state[`${stateName}`] = value;
		setState({...state});
	};
	const rightIcon = () =>{
		return(
			<TouchableOpacity style={style.containerCenter}>
				<Ionicons name="person-add-outline" size={25} color={baseColor}/>
			</TouchableOpacity>
		)
	}
	const onChangeText = (text:any) =>{
		handleChange('searchText',text)
	}
	const onConfirmSearch = () =>{
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
		<BaseComponent {...baseComponentData} title={'Contacts'} is_main={true} rightIcon={rightIcon}>
			<SearchBox
				onChangeText={(text:any)=> onChangeText(text)}
				onSearch={onConfirmSearch}
			/>
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

export default ContactScreen;