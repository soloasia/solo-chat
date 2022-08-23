import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, Image, View, TouchableOpacity, Modal, TextInput, ActivityIndicator, RefreshControl, Keyboard } from 'react-native';
import {  CloseIcon, Divider, HStack, theme, VStack } from 'native-base'
import { baseColor, borderDivider, boxColor, inputColor, offlineColor, onlineColor, textDesColor, whiteColor } from '../config/colors';
import BaseComponent, { baseComponentData } from '../functions/BaseComponent';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBox from '../customs_items/SearchBox';
import { FlatListVertical, Footer, TextItem, UserAvatar } from '../customs_items/Components';
import { UserData } from '../temp_data/Contact';
import { large_padding, main_padding } from '../config/settings';
import style, { deviceHeight, deviceWidth } from '../styles';
import themeStyle from '../styles/theme';
import { ThemeContext } from '../utils/ThemeManager';
import { useDispatch, useSelector } from 'react-redux';
import { GET } from '../functions/BaseFuntion';
import CustomLoading from '../customs_items/CustomLoading';
import { loadContact } from '../actions/Contact';
import _ from 'lodash'
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import AddContactScreen from '../containers/contact/AddContactScreen';
import FastImage from 'react-native-fast-image';
import reactotron from 'reactotron-react-native';

let lastDoc: any = 1;
const ContactScreen = () => {
	const [state, setState] = useState<any>({searchText: ''});
	const [showModal,setShowModal] = useState(false);
	const [loading,setLoading] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [value, setValue] = useState('');
	
    const navigation:any = useNavigation();
	const dispatch:any = useDispatch();
	const {theme} : any = useContext(ThemeContext);
	const mycontact = useSelector((state: any) => state.mycontact);

	const handleChange = (stateName: string, value: any) => {
		state[`${stateName}`] = value;
		setState({...state});
	};
	function getData() {
		GET(`me/contact?page=${lastDoc}`)
		.then(async (result: any) => {
			if(result.status){
				dispatch(loadContact(result.data.data))
				setLoading(false)
			}
		})
		.catch(e => {
			setLoading(false)
		});
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
	const _onScroll = () => {
        if (!hasScrolled)
            setHasScrolled(true)
    };
	const getMore = async () => {
        if (!hasScrolled) return null;
        if (lastDoc > 0) {
			setIsMoreLoading(true)
			setTimeout(async () => {
				GET(`me/contact?page=${lastDoc + 1}`)
				.then(async (result: any) => {
					let _data: any = mycontact;
					if (result.status && result.data.data.length !== 0) {
						_data.push(...result.data.data)
					}
					dispatch(loadContact(_data))
					lastDoc = Math.ceil(_data.length / 20);
					if (result.data.data !== undefined) {
						if (result.data.total <= mycontact.length) {
							lastDoc = 0;
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
	const onRefresh = () => {
        setIsRefresh(true)
        lastDoc = 1;
        getData();
        setTimeout(() => {
            setIsRefresh(false)
        }, 200);
    };
	const rightIcon = () => {
		return(
			<TouchableOpacity onPress={() => setShowModal(true)} style={style.containerCenter}>
				<Ionicons name="person-add-outline" size={23} color={baseColor}/>
			</TouchableOpacity>
		)
	}
	const onClose = () =>{
		setShowModal(false)
	}
	const onScanQr = () =>{
		setShowModal(false)
        navigation.navigate('ScanQr')
	}
	const onChangeText = (text:any) =>{
		setValue(text)
		if(text != ''){
			GET(`search/contact?value=${text}`)
			.then(async (result: any) => {
				if(result.status){
					dispatch(loadContact(result.data))
				}
			})
			.catch(e => {
			});
		}else{
			getData()
		}
	}

	const _handleLiveChat = ({item,index}:any) => {
		GET(`chatroom/request-id?user_id=${item.contact_user.id}`)
			.then(async (result: any) => {
				if(result.status){
					navigation.navigate('ChatList', { chatItem: result.data });
				}
			})
			.catch(e => {
		});
	}

	const _renderContactView = ({item,index}:any) =>{
		return(
			item.contact_user ? 
				<TouchableOpacity onPress={()=>_handleLiveChat({item,index})} style={{padding:7,justifyContent:'center',marginBottom:10,borderRadius:10}}>
					<HStack alignItems="center" space={4}>
						<UserAvatar>
							<FastImage source={item.contact_user.profile_photo?{uri:item.contact_user.profile_photo}:require('../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%',borderRadius:50}}/>
						</UserAvatar>
						<VStack space={1} flex={1}>
							<Text style={{...style.p,color : themeStyle[theme].textColor}}>{item.contact_user.first_name} {item.contact_user.last_name}</Text>
							<HStack alignItems={'center'}>
								<Text style={[style.p,{fontSize:12,color:textDesColor}]}>{item.contact_user.username}</Text>
							</HStack>
							<Divider marginTop={2} color={borderDivider} _light={{ bg: borderDivider}} _dark={{bg:whiteColor}}/>
						</VStack>
					</HStack>
				</TouchableOpacity>
			:null
		)
	}
	
	return (
		<BaseComponent {...baseComponentData} title={'Contacts'} is_main={true} rightIcon={rightIcon}>
			<SearchBox
				onChangeText={(text:any)=> onChangeText(text)}
				onClear = {(text:any)=> onChangeText('')}
				value = {value}
			/>
			{_.isEmpty(mycontact)?
				<View style={{width: deviceWidth, height: deviceHeight*0.6, }}>
					<Lottie
						source={require('../assets/no-data.json')} 
						autoPlay loop 
					/> 
				</View>
				:
				<FlatListVertical
					style={{padding:main_padding}}
					renderItem={_renderContactView}
					data={mycontact}
					refreshControl={
						<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
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
			<AddContactScreen
				onOpen={showModal}
				onClose={onClose}
				onScanQr={onScanQr}
			/>
			<CustomLoading
                visible={loading}
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
	input: {
        backgroundColor: inputColor, 
        height: 45,width: '100%', 
        borderRadius: 25, 
        paddingHorizontal: main_padding, 
        color: textDesColor, 
        fontFamily: 'lato', 
        fontSize: 13
    },
	centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
      },
      textBold: {
        fontWeight: '500',
        color: '#000'
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
      },
      buttonTouchable: {
        padding: 16
    }
});

export default ContactScreen;