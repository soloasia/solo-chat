import moment from 'moment';
import { Divider, HStack, useDisclose } from 'native-base';
import React, { useCallback, useRef, useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, FlatList, RefreshControl, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import reactotron from 'reactotron-react-native';
import { baseColor, boxColor, chatText, textColor, whiteColor } from '../../config/colors';
import { makeid, UserAvatar } from '../../customs_items/Components';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import style, { deviceWidth } from '../../styles';
import { message } from '../../temp_data/Setting';
import ChatRecord from './ChatRecord';
import { deviceHeight } from '../../styles/index';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';

const ChatListScreen = (props:any) => {
    const navigate:any = useNavigation();

    const appearanceTheme = useSelector((state: any) => state.appearance);
    const textsize = useSelector((state: any) => state.textSizeChange);


    const {chatItem} = props.route.params;
    const ref = useRef<FlatList>(null);
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
			<TouchableOpacity onPress={()=>navigate.navigate('ProfileChat', {chatItem: chatItem})} style={style.containerCenter}>
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
	const messageText = (mess: any, index: any) => {
        return (
            <View style={[styles.chatBody, { alignItems: !mess.isAdmin ? "flex-end" : "flex-start" }]}>
               
				<View style={[styles.chatBack,
				{
					backgroundColor: mess.isAdmin ? '#ECF1FD' : _.isEmpty(appearanceTheme)? baseColor : appearanceTheme.textColor,
					borderBottomRightRadius: mess.isAdmin ? 20 : 0,
					borderBottomLeftRadius: mess.isAdmin ? 0 : 20,
					marginVertical: 1
				}
				]}>
					<Text selectable={true} selectionColor={'blue'}  style={{ color: mess.isAdmin ? textColor : whiteColor, fontSize: textsize }}>{mess.text}</Text>
					<Text style={{ fontSize: 10, color: mess.isAdmin ?  textColor:whiteColor, alignSelf: 'flex-end',paddingLeft:100 }}>{moment().format('HH:mm A')}</Text>
				</View>
            </View>
        )
    };

	const Item = ({ item, index }: any) => (
        <>
            <Text style={{ textAlign: 'center', fontSize: 13,paddingTop:10,paddingBottom:10,color:chatText}}>{item.date}</Text>
            {item.data.map((mess: any, index: any) => messageText(mess, index))}
        </>
    );



    return (
		<BaseComponent {...baseComponentData} title={chatItem.name} is_main={false} rightIcon={rightIcon}>
            <ImageBackground source={{uri: appearanceTheme.themurl}} resizeMode="cover" style={{width: deviceWidth, height:deviceHeight*.79}}>
                <KeyboardAvoidingView style={styles.chatContent} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <FlatList
                                ref={ref}
                                listKey={makeid()}
                                renderItem={Item}
                                data={message}
                                showsVerticalScrollIndicator={false}
                                ListFooterComponent={
                                    <View style={{ height: 20 }}>
                                    </View>
                                }
                                // refreshControl={
                                //     <RefreshControl
                                //         refreshing={refreshing}
                                //         onRefresh={_handleRefresh}
                                //         tintColor="black" />
                                // }
                                // onContentSizeChange={() => {
                                //     if (!refreshing) {

                                //         ref.current != null ? ref.current.scrollToEnd({ animated: true }) : {}
                                //     }
                                // }}
                                // onLayout={() => {
                                //     if (!refreshing) {

                                //         ref.current != null ? ref.current.scrollToEnd({ animated: true }) : {}
                                //     }
                                // }}
                                scrollEventThrottle={16}
                                onEndReachedThreshold={0.5}
                                keyExtractor={(_, index) => index.toString()}
                            >
                            </FlatList>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
                    {/* <View style={{position: 'absolute',top:'80%', width: deviceWidth}}>
                       
                    </View> */}
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
        // marginBottom: 10,
        padding: 15
    },
    chatBody: {
        transform: [{ scaleY: 1 }],
        marginTop: 10,

    },
    chatBack: {
        maxWidth: deviceWidth / 1.3,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
});

export default ChatListScreen;