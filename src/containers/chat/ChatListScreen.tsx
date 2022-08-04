import { Divider, HStack, useDisclose } from 'native-base';
import React, { useCallback, useState } from 'react';
import { Text, StyleSheet, useColorScheme, View, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { backSecondColor, baseColor, boxColor, chatText, discountColor, whiteColor } from '../../config/colors';
import { main_padding } from '../../config/settings';
import { FlatListScroll, FlatListVertical, Footer, TextItem, UserAvatar } from '../../customs_items/Components';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import style from '../../styles';
import { data, seconddata } from '../../temp_data/Setting';
import ChatRecord from './ChatRecord';

const ChatListScreen = (props:any) => {
    const {chatItem} = props.route.params;
    const { isOpen, onOpen, onClose } = useDisclose();

	const [state, setState] = useState<any>({
		message: '',
		loadSendMess:false,

	});
	const handleChange = (stateName: string, value: any) => {
		state[`${stateName}`] = value;
		setState({...state});
	};
	

    const rightIcon = () =>{
		return(
			<TouchableOpacity style={style.containerCenter}>
				<UserAvatar style={{width:35,height:35}}>
                    <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%'}}/>
                </UserAvatar>
			</TouchableOpacity>
        )
    }
	const onChangeMessage = useCallback(
        (text:any) => {
			handleChange('message',text)
        },
        [state.message],
    );	
	const _handleOpen = () => {
        onOpen()
    }
	const onSend = () =>{

	}

    return (
		<BaseComponent {...baseComponentData} title={chatItem.name} is_main={false} rightIcon={rightIcon}>
			<ImageBackground source={require('../../assets/wallpaper.jpeg')} style={{flex:1}}>
				<View style={styles.chatContent}>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
						<></>
					</TouchableWithoutFeedback>
				</View>
			</ImageBackground>
			<ChatRecord
                message={state.message}
                loading={state.loadSendMess}
                onChangeMessage={(_txt: any) => onChangeMessage(_txt)}
                onOpen={_handleOpen}
                onSend={onSend}
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
  chatContent: {
	transform: [{ scaleY: 1 }],
	flex: 1,
	justifyContent: 'flex-end',
	},
});

export default ChatListScreen;