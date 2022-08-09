import { useNavigation } from '@react-navigation/native';
import { Divider, HStack, } from 'native-base';
import React, { useRef, useState } from 'react';
import { Text, StyleSheet, useColorScheme, View, Image, TouchableOpacity,Switch } from 'react-native';
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import reactotron from 'reactotron-react-native';
import { baseColor, boxColor, chatText, discountColor, textColor, textSecondColor, whiteColor } from '../config/colors';
import { main_padding } from '../config/settings';
import { FlatListScroll, FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import style from '../styles';
import { data, seconddata } from '../temp_data/Setting';

const SettingScreen = () => {
    const navigate:any = useNavigation();
	const ref = useRef<TransitioningView>(null);
	const [isDarkMode, setDarkMode] = useState(false);
	const [isNotificationOn, setisNotificationOn] = useState(false);
	
    const colorScheme = useColorScheme();

	const transition = (
		<Transition.Together>
		  <Transition.In type="fade" durationMs={600} />
		  <Transition.Out type="fade" durationMs={600} />
		</Transition.Together>
	)
	  
	const _renderItem = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>navigate.navigate(item.to)} style={{padding:8,justifyContent:'center',marginBottom:10,borderRadius:10}}>
				<HStack justifyContent={'space-between'}>
					<HStack alignItems={'center'} space={3}>
						<View style={{width:35,height:35,backgroundColor:item.color,borderRadius:25,alignItems:'center',justifyContent:'center'}}>
							<Ionicons name={item.icon} size={20} style={{color:whiteColor}}/>
						</View>
						<TextItem>{item.name}</TextItem>
					</HStack>
					
					<HStack alignItems={'center'}>
						{item.name == "Notifications" && <Switch 
							value={isNotificationOn} 
							trackColor= {{true : baseColor}}
							style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }]}}
							onValueChange={() => {
								setisNotificationOn(!isNotificationOn)
							}}></Switch>}
						<Ionicons name='chevron-forward-outline' size={20} style={{color: textSecondColor}}/>
					</HStack>			
				</HStack>
			</TouchableOpacity>
		)
	}

	const rightIcon = () =>{
		return(
			<TouchableOpacity style={style.containerCenter}  onPress={()=>navigate.navigate('EditProfile')}>
				<FontAwesome name="edit" size={25} color={baseColor}/>
			</TouchableOpacity>
		)
	}
	
    return (
		<BaseComponent {...baseComponentData} title={'Setting'} is_main={true} rightIcon={rightIcon}>
			 <Transitioning.View style={{ flex: 1 }} {...{ ref, transition }}>
				{
				isDarkMode && <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'black' }} />
				}
				<FlatListScroll style={{padding: main_padding,}}>
					<View style={{justifyContent: 'center',alignItems:'center',paddingBottom:20}}>
						<UserAvatar style={{width:120,height:120}}>
							<Image source={require('../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%'}}/>
						</UserAvatar>
						<TextItem style={{fontSize:18,paddingTop: 10}}>Big Boss</TextItem>
						<TextItem style={{paddingTop: 5,color:chatText}}>@bigboss</TextItem>
					</View>
					<TouchableOpacity style={{padding:8,justifyContent:'center',marginBottom:10,borderRadius:10,marginTop:main_padding}}>
						<HStack justifyContent={'space-between'}>
							<HStack alignItems={'center'} space={3}>
								{isDarkMode?
									<Ionicons name={'sunny-outline'} size={25} style={{color:whiteColor}}/>
									:
									<Ionicons name={'moon-outline'} size={25} style={{color:textColor}}/>
								}
								<TextItem>Dark Mode</TextItem>
							</HStack>
							<Switch 
								value={isDarkMode} 
								trackColor= {{true : baseColor}}
								style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
								onValueChange={() => {
									if (ref.current) {
										ref.current.animateNextTransition();
									}
									setDarkMode(!isDarkMode)
								}} 
							/>
						</HStack>
					</TouchableOpacity>
					<Divider marginTop={2} color={boxColor} _light={{ bg: boxColor}} _dark={{bg:whiteColor}}/>
					<FlatListVertical
						style={{paddingTop:main_padding}}
						data={data}
						renderItem={_renderItem}
					/>
					<Divider marginTop={2} color={boxColor} _light={{ bg: boxColor}} _dark={{bg:whiteColor}}/>
					<FlatListVertical
						style={{paddingTop:main_padding}}
						data={seconddata}
						renderItem={_renderItem}
					/>
					<TouchableOpacity style={{width:'100%',height:45,backgroundColor:boxColor,marginTop:main_padding,borderRadius:10,justifyContent:'center'}}>
						<TextItem style={{color:discountColor,textAlign:'center',fontSize:18,fontFamily:'Lato-Regular'}}>Log Out</TextItem>
					</TouchableOpacity>
					<Footer />
				</FlatListScroll>
			</Transitioning.View>
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