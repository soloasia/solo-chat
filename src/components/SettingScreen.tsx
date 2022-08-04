import { useNavigation } from '@react-navigation/native';
import { Divider, HStack } from 'native-base';
import React from 'react';
import { Text, StyleSheet, useColorScheme, View, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { backSecondColor, boxColor, chatText, discountColor, whiteColor } from '../config/colors';
import { main_padding } from '../config/settings';
import { FlatListScroll, FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import { data, seconddata } from '../temp_data/Setting';

const SettingScreen = () => {
    const navigate:any = useNavigation();

	const _renderItem = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>navigate.navigate(item.to)} style={{padding:8,justifyContent:'center',marginBottom:10,backgroundColor:backSecondColor,borderRadius:10}}>
				<HStack justifyContent={'space-between'}>
					<HStack alignItems={'center'} space={3}>
						<Ionicons name={item.icon} size={25} style={{color:item.color}}/>
						<TextItem>{item.name}</TextItem>
					</HStack>
					<Ionicons name='chevron-forward' size={25} style={{color: chatText}}/>
				</HStack>
			</TouchableOpacity>
		)
	}
    return (
		<BaseComponent {...baseComponentData} title={'Setting'} is_main={true}>
			<FlatListScroll style={{padding: main_padding,}}>
				<View style={{justifyContent: 'center',alignItems:'center',paddingBottom:10}}>
					<UserAvatar style={{width:120,height:120}}>
						<Image source={require('../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%'}}/>
					</UserAvatar>
					<TextItem style={{fontSize:18,paddingTop: 10}}>Big Boss</TextItem>
					<TextItem style={{paddingTop: 5,color:chatText}}>@bigboss</TextItem>
				</View>
				<FlatListVertical
					style={{paddingTop:main_padding}}
					data={data}
					renderItem={_renderItem}
				/>
				<FlatListVertical
					style={{paddingTop:main_padding}}
					data={seconddata}
					renderItem={_renderItem}
				/>
				<TouchableOpacity style={{width:'100%',height:45,backgroundColor:discountColor,marginTop:main_padding,borderRadius:10,justifyContent:'center'}}>
					<TextItem style={{color:whiteColor,textAlign:'center',fontSize:18,fontFamily:'Lato-Bold'}}>Logout</TextItem>
				</TouchableOpacity>
				<Footer />
			</FlatListScroll>
		</BaseComponent>
    );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
  },
});

export default SettingScreen;