import { useNavigation, useTheme } from '@react-navigation/native';
import { Divider, HStack } from 'native-base';
import React, { useContext, useRef, useState } from 'react';
import { Text, StyleSheet, useColorScheme, View, Image, TouchableOpacity,Switch, Clipboard, Button } from 'react-native';
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { baseColor, borderDivider, boxColor, chatText, discountColor, offlineColor, textColor, textSecondColor, whiteColor, whiteSmoke } from '../config/colors';
import { main_padding } from '../config/settings';
import { AlertBox, FlatListScroll, FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import style from '../styles';
import themeStyle from '../styles/theme';
import { data, seconddata } from '../temp_data/Setting';
import { ThemeContext } from '../utils/ThemeManager';
import AsynceStorage from '@react-native-async-storage/async-storage'
import CustomLoading from '../customs_items/CustomLoading';

const SettingScreen = () => {
    const navigate:any = useNavigation();
    const userInfo = useSelector((state: any) => state.user);
	const ref = useRef<TransitioningView>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [loading,serLoading] = useState(false)

	// const [isDarkMode, setDarkMode] = useState(false);
	const {theme, toggleTheme} : any  = useContext(ThemeContext);
	const [isNotificationOn, setisNotificationOn] = useState(false);
	const transition = (
		<Transition.Together>
		  <Transition.In type="fade" durationMs={600} />
		  <Transition.Out type="fade" durationMs={600} />
		</Transition.Together>
	)
	const _renderItem = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>item.name == "Notifications" ? null : navigate.navigate(item.to) } style={{padding:8,justifyContent:'center',marginBottom:10,borderRadius:10}}>
				<HStack justifyContent={'space-between'}>
					<HStack alignItems={'center'} space={3}>
						<View style={{width:35,height:35,backgroundColor:item.color,borderRadius:25,alignItems:'center',justifyContent:'center'}}>
							<Ionicons name={item.icon} size={20} style={{color:whiteColor}}/>
						</View>
						<TextItem style={{color: themeStyle[theme].textColor}}>{item.name}</TextItem>
					</HStack>			
					<HStack alignItems={'center'}>
						{item.name == "Notifications" && <Switch 
							value={isNotificationOn} 
							trackColor= {{true : baseColor}}
							style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }]}}
							onValueChange={() => { 
								setisNotificationOn(!isNotificationOn)
							}}></Switch>}
						{item.name != "Notifications" && <Ionicons name='chevron-forward-outline' size={20} style={{color: textSecondColor}}/>}
					</HStack>			
				</HStack>
			</TouchableOpacity>
		)
	}

	const rightIcon = () =>{
		return(
			<TouchableOpacity style={style.containerCenter}  onPress={()=>navigate.navigate('EditProfile')}>
				<Text style={{color: baseColor, fontFamily:'Lato', fontSize: 16,fontWeight : "bold"}}>Edit</Text>
			</TouchableOpacity>
		)
	}
	
	const handleLogout = () => {
		setIsOpen(false)
        serLoading(true)
        setTimeout( async () => {
            await AsynceStorage.setItem('@token', '');
            navigate.reset({
                index: 0,
                routes: [{ name: 'Login' }]
            })
            serLoading(false)
        }, 2000);
	}

    return (
		<BaseComponent {...baseComponentData} title={'Settings'} is_main={true} rightIcon={rightIcon}>
			 <Transitioning.View style={{ flex: 1 }} {...{ ref, transition }}>
				{/* {
				isDarkMode && <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'themeStyle[theme].backgroundColor'}} />
				} */}
				<View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: themeStyle[theme].backgroundColor}} />
				<FlatListScroll style={{padding: main_padding,}}>
					<View style={{justifyContent: 'center',alignItems:'center',paddingBottom:20}}>
						<UserAvatar style={{width:120,height:120}}>
							{userInfo.profile_photo!=null ? 
								<Image source={{uri: userInfo.profile_photo}} resizeMode='cover' style={{width:'100%',height:'100%', borderRadius: 100}}/>
							:<Image source={require('../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%'}}/>}
							
						</UserAvatar>
						<TextItem style={{fontSize:18,paddingTop: 10}}>{userInfo.first_name +' ' + userInfo.last_name}</TextItem>
						<TouchableOpacity onPress={() => Clipboard.setString(userInfo.username)}><Text style={{paddingTop: 5,color:chatText, fontFamily: 'Montserrat-Regular', fontSize: 15}}>{userInfo.username}</Text></TouchableOpacity>
					</View>
					<TouchableOpacity style={{padding:8,justifyContent:'center',marginBottom:10,borderRadius:10,marginTop:main_padding}}>
						<HStack justifyContent={'space-between'}>
							<HStack alignItems={'center'} space={3}>
								{theme === "light"?
									<Ionicons name={'sunny-outline'} size={25} style={{color: "black"}}/>
									:
									<Ionicons name={'moon-outline'} size={25} style={{color: "white"}}/>
								}
								<TextItem >Dark Mode</TextItem>
							</HStack>
							<Switch 
								value={theme == "dark"} 
								trackColor= {{true : baseColor}}
								style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
								onValueChange={() => {
									if (ref.current) {
										ref.current.animateNextTransition();
									}
									// setDarkMode(!isDarkMode);
									toggleTheme();
								}} 
							/>
						</HStack>
					</TouchableOpacity>
					<Divider marginTop={2} color={borderDivider} _light={{ bg: borderDivider}} _dark={{bg:whiteColor}}/>
					<FlatListVertical
						style={{paddingTop:main_padding}}
						data={data}
						renderItem={_renderItem}
					/>
					<Divider marginTop={2} color={borderDivider} _light={{ bg: borderDivider}} _dark={{bg:whiteColor}}/>
					<FlatListVertical
						style={{paddingTop:main_padding}}
						data={seconddata}
						renderItem={_renderItem}
					/>
					<TouchableOpacity onPress={()=>setIsOpen(true)} style={{width:'100%',height:45,backgroundColor: themeStyle[theme].primary,marginTop:main_padding,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
						<Text style={[style.pBold,{color:offlineColor}]}>Log Out</Text>
					</TouchableOpacity>
					<Footer />
				</FlatListScroll>
			</Transitioning.View>
			<CustomLoading
                visible={loading}
            />
			<AlertBox
                title={'Log Out!'}
                des={"Are you sure you want to log out?"}
                btn_cancle={"No"}
                btn_name={'Yes'}
                onCloseAlert={() => setIsOpen(false)}
                onConfirm={handleLogout}
                isOpen={isOpen}
            />
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