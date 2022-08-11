import React, { useState } from 'react';
import { Text, StyleSheet, Image, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import {  Divider, HStack, VStack } from 'native-base'
import { baseColor, boxColor, inputColor, offlineColor, onlineColor, textDesColor, whiteColor } from '../config/colors';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBox from '../customs_items/SearchBox';
import reactotron from 'reactotron-react-native';
import { FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import { UserData } from '../temp_data/Contact';
import { main_padding } from '../config/settings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import style from '../styles';
import { useNavigation } from '@react-navigation/native';

const ContactScreen = () => {
	const [state, setState] = useState<any>({
		searchText: ''
	});
	const [username, setUsername] = useState("");

	const [showModal,setShowModal] = useState(false);

	const navigate:any = useNavigation();
	const handleChange = (stateName: string, value: any) => {
		state[`${stateName}`] = value;
		setState({...state});
	};
	const rightIcon = () =>{
		return(
			<TouchableOpacity onPress={() => setShowModal(true)} style={style.containerCenter}>
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
			<Modal
                presentationStyle="formSheet"
                visible ={showModal}
				animationType="slide"
                onDismiss={() => console.log('on dismiss')}>
				<View style={{margin : main_padding}}>
				 	<View style={{flexDirection : 'row',justifyContent: 'space-between'}}>
					 	<TouchableOpacity onPress={()=> setShowModal(false)}><Text>Cancel</Text></TouchableOpacity>
						<Text style={{fontWeight :'700'}} >Add Contact</Text>
					 	<TouchableOpacity onPress={()=> console.log("add")}><Text style={{fontSize : 16,fontWeight : 'bold',color : username != "" ? baseColor : "grey"}}>Add</Text></TouchableOpacity>
					</View>

					<View style = {{flexDirection : "row",justifyContent : 'center' ,alignItems: "center",marginHorizontal : main_padding,marginTop : main_padding }}>
                    <TextInput 
                        style={{...styles.input,marginTop : main_padding}}
                        placeholder='Username'
                        value={username}
                        onChangeText={(text)=> setUsername(text)}
                    />
                    <TouchableOpacity onPress={() => console.log("scann qr")}><Ionicons name={'scan'} size={25} style={{color:baseColor,marginTop: main_padding,marginLeft : main_padding}}/></TouchableOpacity>
                </View>
                <Text style={{fontSize : 12, color:'gray' ,marginLeft :4,marginTop : 10}}>You can add contact by their username. It's case sensitive.</Text>
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
        height: 45,width: '100%', 
        borderRadius: 25, 
        paddingHorizontal: main_padding, 
        color: textDesColor, 
        fontFamily: 'lato', 
        fontSize: 13
    },
});

export default ContactScreen;