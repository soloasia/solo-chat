//import liraries
import { Divider, HStack, Icon, useDisclose, VStack } from 'native-base';
import React, { Component, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, Modal, TextInput, Share, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Alert, ImageBackground } from 'react-native';
import { large_padding, main_padding } from '../../config/settings';
import style, { deviceWidth, deviceHeight } from '../../styles/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors, { borderDivider, boxColor, greyDark, textSecondColor, whiteColor } from '../../config/colors';
import { useNavigation } from '@react-navigation/native';
import { FlatListHorizontal, UserAvatar, FlatListVertical, TextItem, AlertBox } from '../../customs_items/Components';
import LinearGradient from 'react-native-linear-gradient';
import { actionChatProfile, actionGroupChatProfile } from '../../temp_data/Setting';
import { baseColor, whiteSmoke, bgChat, textDesColor, textColor, labelColor, backgroundDark, borderColor } from '../../config/colors';
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated';
import SearchBox from '../../customs_items/SearchBox';
import CreateGroup from './CreateGroup';
import { ThemeContext } from '../../utils/ThemeManager';
import themeStyle from '../../styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import FastImage from 'react-native-fast-image';
import reactotron from 'reactotron-react-native';
import SelectImagePicker from '../../customs_items/SelectImagePicker';
import CustomLoading from '../../customs_items/CustomLoading';
import { loadData } from '../../functions/LoadData';
import { GET, POST } from '../../functions/BaseFuntion';
import { loadListChat } from '../../actions/ListChat';
import _ from 'lodash';
import { LanguageContext } from '../../utils/LangaugeManager';


// create a component
const ChatProfileScreen = (props: any) => {
    const { theme }: any = useContext(ThemeContext);
    const {tr} : any = useContext(LanguageContext);
    const { isOpen, onOpen, onClose } = useDisclose();
    const navigate: any = useNavigation();
    const { chatItem, contactItem } = props.route.params;
    const [isNotification, setNotification] = useState(false);
    const [isVisible, setIsvisible] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const ref = useRef<TransitioningView>(null);
    const dispatch: any = useDispatch();
    const userInfo = useSelector((state: any) => state.user);
    const [state, setState] = useState<any>({
        searchText: '',
        isProfileClick: false,
        isEdit: false,
        groupName: chatItem.name,
        profileGroup: '',
        loading: false,
        isAdmin: false,
        messageTitle: '',
        messageDesc: '',
        buttonText: '',
        isDeleteFunc: false,
        username: '',
        profileImg: ''
    });
    

    const transition = (
		<Transition.Together>
		  <Transition.In type='scale' durationMs={600} />
		  <Transition.Out type='scale' durationMs={600} />
		</Transition.Together>
	)

    useEffect(() => {
        if (!_.isEmpty(chatItem.chatroom_users && contactItem)) {
            const filterGroupAdmin = chatItem.chatroom_users.filter((element: any) => element.user_id == userInfo.id && element.is_admin == 1);
            !_.isEmpty(filterGroupAdmin) ? handleChange('isAdmin', true) : console.log('just member')

            const filterUser = chatItem.chatroom_users.find((element: any) => element.user_id != userInfo.id);
            handleChange('username', filterUser.user.username)
            handleChange('profileImg', chatItem.type == 'individual' ? filterUser.user.profile_photo : chatItem.profile_photo)
        }
        // if(_.isEmpty(contactItem)){
        //     reactotron.log('===', chatItem.chatroom_users)
        //     reactotron.log(mycontact)
        //     // const filterUserContact = mycontact.filter((element: any) => element.contact_user.id == userInfo.id && element.is_admin == 1);

        // } 
        // chatItem.
    }, []);

    const selectedRoute = ({ item, index }: any) => {
        if (item.title == 'notification') {
            console.log("notification");
        } else if (item.title == "leave_group") {
            handleChange('messageTitle', 'Leave Group')
            handleChange('buttonText', 'Leave')
            handleChange('messageDesc', 'Are you sure you want to leave group ?')
            handleChange('isDeleteFunc', false)
            setShowLogout(true);
        } else if (item.title == "delete_group") {
            handleChange('messageTitle', 'Delete Group')
            handleChange('buttonText', 'Delete')
            handleChange('messageDesc', 'Are you sure, you want to delete this group ?')
            handleChange('isDeleteFunc', true)
            setShowLogout(true);
        } else {
            chatItem.type === "individual" && index == 0 ? setIsvisible(true) : navigate.navigate(item.to, { userChat: chatItem });
        }
    }

    const handleChange = (stateName: string, value: any) => {
        state[`${stateName}`] = value;
        setState({ ...state });
    };

    const _updateGroup = () => {
        const formdata = new FormData();
        formdata.append("group_id", chatItem.id);
        formdata.append("name", state.groupName);
        formdata.append("profile_photo", state.profileGroup != '' ? state.profileGroup : chatItem.profile_photo != null ? chatItem.profile_photo : '');
        if (state.profileGroup == '' && state.groupName == getName(chatItem)) {
            handleChange('isEdit', false)
        } else {
            handleChange('loading', true)
            POST('group/update', formdata).then(async (result: any) => {
                if (result.status) {
                    handleChange('loading', false)

                    navigate.navigate('ChatList', { chatItem: result.data[0] });
                    handleChange('isEdit', false)

                    loadData(dispatch);

                    // onClose()
                } else {
                    Alert.alert('Something went wrong!\n', 'Please try again later')
                    handleChange('loading', false)

                }
            })
        }
        // handleChange('groupName', chatItem.name)
    }

    const _handleEdit = () => {
        if(state.isEdit )
            _updateGroup() 
        else {
            handleChange('isEdit', true) 
            handleChange('isProfileClick', false);
        }
    }

    const _renderItem = ({ item, index }: any) => {
        if (!state.isAdmin && item.title == "delete_group") return false;
        return (
            <TouchableOpacity onPress={() => selectedRoute({ item, index })} style={{ padding: 7, justifyContent: 'center', marginTop: 7 }}>
                <HStack alignItems='center' justifyContent='space-between'>
                    <HStack>
                        <View style={{
                            width: 35, height: 35, borderRadius: 30,
                            backgroundColor: item.title == "delete_group" || item.title == "leave_group" ? '#A30A0AC9' : baseColor, alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon name={item.icon} as={item.type} size={18} color={whiteSmoke} />
                        </View>
                        <View style={{ marginHorizontal: main_padding - 5, borderBottomColor: labelColor, paddingVertical: 10 }}>
                           <TextItem style={{ fontSize: 15, }}>{tr(item.title)}</TextItem>
                        </View>
                    </HStack>
                    {item.title == 'notification' ?
                        <Switch
                            value={isNotification}
                            trackColor={{ true: baseColor }}
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                            onValueChange={() => {
                                if (ref.current) {
                                    ref.current.animateNextTransition();
                                }
                                setNotification(!isNotification)
                            }}
                        />
                        : <View />}
                </HStack>
                <Divider marginTop={2} marginLeft={main_padding * 3} color={borderDivider} _light={{ bg: borderDivider }} _dark={{ bg: whiteColor }} />
            </TouchableOpacity>

        )
    }

    const rightIcon = () => {
        return (
            chatItem.type === "individual" || chatItem.contact_user ? <View />
                : <TouchableOpacity onPress={_handleEdit} style={style.containerCenter}>
                    <Text style={{ color: baseColor, fontSize: 16, fontWeight: '800', fontFamily: 'Montserrat-Regular' }}>{state.isEdit ? tr("done") : tr("edit")}</Text>
                </TouchableOpacity>
        )
    }

    const getName = (item: any): string => {
        var name = ""
        const isIndividual: boolean = item.type === "individual";
        if (isIndividual) {
            const found = item.chatroom_users.find((element: any) => element.user_id != userInfo.id);
            name = found.user.first_name + " " + found.user.last_name;
        } else {
            name = item.name;
        }

        return name;
    }


    const getDisplayProfile = (data: any) => {
        const isIndividual: boolean = data.type === "individual";
        const filterUser = data.chatroom_users.find((element: any) => element.user_id != userInfo.id);
        const isFilterUserProfileNull =  !_.isEmpty(filterUser) ? filterUser.user.profile_photo == null : null;
        const isGroupPhotoNull = data.profile_photo == null;

        return (
            <>
                {isIndividual ?
                    isFilterUserProfileNull ?
                        <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 50 }} />
                        : <Image source={{uri: filterUser.user.profile_photo}} resizeMode='cover' style={{ width: '100%', height: '100%',borderRadius: 50 }} />
                    : isGroupPhotoNull ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                        : <FastImage source={data.profile_photo ? { uri: data.profile_photo } : require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 50 }} />

                }
            </>
        )
    }

    const onChange = (data: any) => {
        handleChange('profileGroup', 'data:image/png;base64,' + data.data);
    }
    const _handleLeaveGroup = () => {
        setShowLogout(false);
        const formdata = new FormData();
        formdata.append("group_id", chatItem.id);
        if (state.isDeleteFunc) {
            POST('group/delete', formdata).then(async (result: any) => {
                if (result.status) {
                    setShowLogout(false);
                    GET(`me/chatrooms?page=1`)
                        .then(async (result) => {
                            if (result.status) {
                                dispatch(loadListChat(result.data.data))
                            }
                        })
                        .catch(e => {
                        });
                    navigate.reset({
                        index: 0,
                        routes: [{ name: 'Main' }]
                    })
                }
            })
        } else {
            POST('group/leave', formdata).then(async (result: any) => {
                if (result.status) {
                    setShowLogout(false);
                    GET(`me/chatrooms?page=1`)
                        .then(async (result) => {
                            if (result.status) {
                                dispatch(loadListChat(result.data.data))
                            }
                        })
                        .catch(e => {
                        });
                    navigate.reset({
                        index: 0,
                        routes: [{ name: 'Main' }]
                    })
                }
            })
        }
    }

    const displayFullProfile = () => {
        state.profileImg ? handleChange('isProfileClick', !state.isProfileClick) : null;
        
    }

    return (
        <BaseComponent {...baseComponentData} rightIcon={rightIcon}>
            <KeyboardAvoidingView style={{ flex: 1 }} >
                <TouchableWithoutFeedback accessible={false}>
                    <VStack flex={1}>
                        {state.isProfileClick ? 
                            <TouchableOpacity onPress={displayFullProfile} style={{marginBottom: main_padding}}>
                                <ImageBackground source={{uri: state.profileImg}} style={{width: deviceWidth, paddingHorizontal: main_padding, alignItems: 'flex-start',justifyContent: 'flex-end', height: deviceWidth/1.5, }}>
                                {chatItem.type === "individual"?
                                    <View style={{ paddingVertical: main_padding }}>
                                        <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Montserrat-Regular', color: whiteColor, }}>{getName(chatItem).toUpperCase()}</Text>
                                        <Text style={{ fontSize: 13, paddingTop: main_padding - 10, color: whiteColor, fontFamily: 'Montserrat-Regular' }}>{state.username}</Text>
                                    </View>
                                    : <View style={{ paddingVertical: main_padding }}>
                                        <TextInput
                                            autoFocus={state.isEdit}
                                            style={{ fontSize: 16, fontWeight: '600', borderBottomColor:  whiteColor, borderBottomWidth: state.isEdit ? 0.5 : 0, color: whiteColor, fontFamily: 'Montserrat-Regular' }}
                                            value={state.isEdit ? state.groupName : getName(chatItem)}
                                            editable={state.isEdit}
                                            onChangeText={(text) => handleChange('groupName', text)}
                                            keyboardType='default'
                                        />
                                        {/* <TextItem style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>{getName(chatItem)}</TextItem> */}
                                        <Text style={{ fontSize: 13, paddingTop: main_padding - 10, color: whiteColor, fontFamily: 'Montserrat-Regular' }}>{chatItem.chatroom_users.length + " members"}</Text>
                                    </View>
                                }
                                </ImageBackground>
                            </TouchableOpacity>
                            :
                            <View style={{ width: deviceWidth, paddingHorizontal: main_padding, alignItems: 'center',}}>
                                <TouchableOpacity onPress={() => !state.isEdit ? displayFullProfile() :onOpen()} style={{ alignSelf: 'center', width: 110 }}>
                                    <LinearGradient
                                        colors={['#F3AE2D', '#F0DF48', '#4B38F7D2', '#3276F5F3', '#0099FF']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ marginTop: 15, width: 105, borderRadius: 100, height: 105 }}
                                    >
                                        <View style={{ margin: 1.5, backgroundColor: whiteColor, justifyContent: 'center', borderRadius: 100, width: 102, height: 102, }}>
                                            {state.profileGroup != '' ?
                                                <Image source={{ uri: state.profileGroup }} resizeMode='cover' style={{ borderRadius: 100, width: 102, height: 102, overflow: 'hidden' }} />
                                                : chatItem.contact_user ?
                                                    <Image source={chatItem.contact_user.profile_photo ? { uri: chatItem.contact_user.profile_photo } : require('./../../assets/profile.png')} resizeMode='cover' style={{ borderRadius: 100, width: 102, height: 102, overflow: 'hidden' }} />
                                                : getDisplayProfile(chatItem)}
                                        </View>
                                    </LinearGradient>
                                    {state.isEdit ?
                                        <View style={{ position: 'absolute', bottom: 10, right: 0, backgroundColor: '#EBE9E9E8', borderRadius: 20, padding: 5, borderColor: baseColor, borderWidth: 1, zIndex: 1000 }}>
                                            <Icon name='camera-outline' as={Ionicons} size='sm' />
                                        </View>
                                    : null}
                                </TouchableOpacity>
                                {chatItem.type === "individual"?
                                    <View style={{ paddingVertical: main_padding }}>
                                        <TextItem style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>{getName(chatItem).toUpperCase()}</TextItem>
                                        <TextItem style={{ fontSize: 12, paddingTop: main_padding - 10, color: '#BBBBBBE0', textAlign: 'center' }}>{state.username}</TextItem>
                                    </View>
                                    : <View style={{ paddingVertical: main_padding }}>
                                        <TextInput
                                            autoFocus={state.isEdit}
                                            style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', padding: 7, borderBottomColor: state.isEdit ? textDesColor : whiteColor, borderBottomWidth: state.isEdit ? 0.5 : 0, color:themeStyle[theme].textColor }}
                                            value={state.isEdit ? state.groupName : getName(chatItem)}
                                            editable={state.isEdit}
                                            onChangeText={(text) => handleChange('groupName', text)}
                                            keyboardType='default'
                                        />
                                        {/* <TextItem style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>{getName(chatItem)}</TextItem> */}
                                        <TextItem style={{ fontSize: 12, paddingTop: main_padding - 10, textAlign: 'center', color: greyDark }}>{chatItem.chatroom_users.length + " " + tr("members")}</TextItem>
                                    </View>
                                }
                            </View>
                        }
                        <View style={{ width: deviceWidth, paddingHorizontal: main_padding, }}>
                            <TextItem style={{ fontSize: 15, color: colors.textColor, fontWeight: '600' }}>{tr("more_actions")}</TextItem>
                            <View style={{ paddingVertical: main_padding - 5, marginTop: 10, borderRadius: 10 }}>
                                <FlatListVertical
                                    scrollEnabled={false}
                                    renderItem={_renderItem}
                                    data={chatItem.type === "individual" || chatItem.contact_user ? actionChatProfile : actionGroupChatProfile}
                                />

                            </View>
                        </View>
                    </VStack>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <SelectImagePicker
                visible={isOpen}
                onChange={(data: any) => onChange(data)}
                onClose={() => onClose()}
            />

            <CustomLoading
                visible={state.loading}
            />

            <Modal
                transparent
                presentationStyle="formSheet"
                visible={isVisible}
                animationType="slide"
                onDismiss={() => console.log('on dismiss')}>
                <View style={{ flex: 1, backgroundColor: themeStyle[theme].backgroundColor }}>
                    <View style={{ margin: main_padding, marginTop: large_padding }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => setIsvisible(false)}><Text style={{ color: baseColor, fontWeight: '500', fontSize: 16, fontFamily: 'Montserrat-Regular' }}>Cancel</Text></TouchableOpacity>
                            <Text style={{ fontWeight: '600', fontSize: 16, fontFamily: 'Montserrat-Regular', color: theme == 'dark' ? whiteSmoke : textDesColor }}>Create new group</Text>
                            <View />
                            <View />
                        </View>
                    </View>
                    <CreateGroup isUserProfile={ contactItem ? true : false} userChat={contactItem} />
                </View>
            </Modal>

            <AlertBox
                title={state.messageTitle}
                des={state.messageDesc}
                btn_cancle={'Close'}
                btn_name={state.buttonText}
                onCloseAlert={() => setShowLogout(false)}
                onConfirm={_handleLeaveGroup}
                isOpen={showLogout}
            />
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
    },
});

//make this component available to the app
export default ChatProfileScreen;
