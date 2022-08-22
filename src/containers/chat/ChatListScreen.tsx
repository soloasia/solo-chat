import moment from 'moment';
import { Divider, HStack, useDisclose } from 'native-base';
import React, { useCallback, useRef, useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, FlatList, RefreshControl, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import reactotron from 'reactotron-react-native';
import { baseColor, boxColor, chatText, textColor, whiteColor } from '../../config/colors';
import { makeid, TextItem, UserAvatar } from '../../customs_items/Components';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import style, { deviceWidth } from '../../styles';
import { message } from '../../temp_data/Setting';
import ChatRecord from './ChatRecord';
import { deviceHeight } from '../../styles/index';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { main_padding } from '../../config/settings';

const ChatListScreen = (props: any) => {
    const navigate: any = useNavigation();

    const appearanceTheme = useSelector((state: any) => state.appearance);
    const textsize = useSelector((state: any) => state.textSizeChange);
    const { chatItem } = props.route.params;
    const ref = useRef<FlatList>(null);
    const { isOpen, onOpen, onClose } = useDisclose();
    const userInfo = useSelector((state: any) => state.user);
    const [state, setState] = useState<any>({
        message: '',
        loadSendMess: false,

    });
    const handleChange = (stateName: string, value: any) => {
        state[`${stateName}`] = value;
        setState({ ...state });
    };
    const rightIcon = () => {
        return (
            <TouchableOpacity onPress={() => navigate.navigate('ProfileChat', { chatItem: chatItem })} style={style.containerCenter}>
                <UserAvatar style={{ width: 40, height: 40 }}>
                    {getDisplayProfile(chatItem)}
                    {/* <Image source={chatItem.contact_user.profile_photo ? {uri: chatItem.contact_user.profile_photo} : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 100 }} /> */}
                </UserAvatar>
            </TouchableOpacity>
        )
    }
    const onChangeMessage = useCallback(
        (text: any) => {
            handleChange('message', text)
        },
        [state.message],
    );
    const _handleOpen = () => {
        onOpen()
    }
    const onSend = () => {

    }
    const messageText = (mess: any, index: any) => {
        return (
            <View style={[styles.chatBody, { alignItems: !mess.isAdmin ? "flex-end" : "flex-start" }]}>           
				<View style={[styles.chatBack,
				{
					backgroundColor: mess.isAdmin ? '#DBDBDBE3' : _.isEmpty(appearanceTheme)? baseColor : appearanceTheme.textColor,
					borderBottomRightRadius: mess.isAdmin ? 20 : 0,
					borderBottomLeftRadius: mess.isAdmin ? 0 : 20,
					marginVertical: 1
				}
				]}>
					<Text selectable={true} selectionColor={'blue'}  style={{ color: mess.isAdmin ? textColor : whiteColor, fontSize: textsize, fontFamily: 'Montserrat-Regular' }}>{mess.text}</Text>
					<Text style={{ fontSize: 10, color: mess.isAdmin ?  textColor: whiteColor, alignSelf: 'flex-end', paddingLeft:100, fontFamily: 'Montserrat-Regular' }}>{moment().format('HH:mm A')}</Text>
				</View>
            </View>
        )
    };

    const Item = ({ item, index }: any) => (
        <>
            <Text style={{ textAlign: 'center', fontSize: 13, paddingTop: 10, paddingBottom: 10, color: chatText }}>{item.date}</Text>
            {item.data.map((mess: any, index: any) => messageText(mess, index))}
        </>
    );

    const getName = (item : any) : string => {
		var name = ""
		const isIndividual : boolean = item.type === "individual";
		if(isIndividual) {
			const found = item.chatroom_users.find((element : any) => element.user_id != userInfo.id);
			name = found.user.first_name + " " + found.user.last_name;
		} else {
			name = item.name;
		}

	   return name;
	}

	const getDisplayProfile = (data : any) => {
		const isIndividual : boolean = data.type === "individual";
		const filterUser = data.chatroom_users.find((element : any) => element.user_id != userInfo.id);
		const isFilterUserProfileNull = filterUser.user.profile_photo == null;
		const isGroupPhotoNull = data.profile_photo == null;
		return (
			<>
				{
					isIndividual 
					? isFilterUserProfileNull ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> : <Image source={filterUser.profile_photo} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
					: isGroupPhotoNull ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> : <Image source={data.profile_photo} resizeMode='cover' style={{ width: '100%', height: '100%' }} />

				}
			</>
		)
	}



    return (
        <BaseComponent {...baseComponentData} title={getName(chatItem)} is_main={false} rightIcon={rightIcon}>
            <ImageBackground source={{ uri: appearanceTheme.themurl }} resizeMode="cover" style={{ width: deviceWidth, height: deviceHeight }}>
                <KeyboardAvoidingView style={{ ...styles.chatContent, height: deviceHeight * .8, }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <TouchableWithoutFeedback accessible={false} >
                        <FlatList
                            style={{paddingHorizontal: main_padding}}
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
                    <View style={{ width: deviceWidth, height: deviceHeight * .2 }}>
                        <ChatRecord
                            message={state.message}
                            loading={state.loadSendMess}
                            onChangeMessage={(_txt: any) => onChangeMessage(_txt)}
                            onOpen={_handleOpen}
                            onSend={onSend}
                        />
                    </View>
                </KeyboardAvoidingView>

            </ImageBackground>

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
        // paddingHorizontal: main_padding
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