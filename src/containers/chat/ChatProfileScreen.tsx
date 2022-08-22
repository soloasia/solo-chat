//import liraries
import { Divider, HStack, Icon, VStack } from 'native-base';
import React, { Component, useContext, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, Modal, TextInput, Share } from 'react-native';
import { large_padding, main_padding } from '../../config/settings';
import style, { deviceWidth, deviceHeight } from '../../styles/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors, { borderDivider, boxColor, textSecondColor, whiteColor } from '../../config/colors';
import { useNavigation } from '@react-navigation/native';
import { FlatListHorizontal, UserAvatar, FlatListVertical, TextItem } from '../../customs_items/Components';
import LinearGradient from 'react-native-linear-gradient';
import { actionChatProfile } from '../../temp_data/Setting';
import { baseColor, whiteSmoke, bgChat, textDesColor, textColor, labelColor, backgroundDark } from '../../config/colors';
import { TransitioningView } from 'react-native-reanimated';
import SearchBox from '../../customs_items/SearchBox';
import CreateGroup from './CreateGroup';
import { ThemeContext } from '../../utils/ThemeManager';
import themeStyle from '../../styles/theme';
import { useSelector } from 'react-redux';

// create a component
const ChatProfileScreen = (props: any) => {
	const {theme} : any = useContext(ThemeContext);

    const navigate: any = useNavigation();
    const { chatItem } = props.route.params;
    const [isNotification, setNotification] = useState(false)
    const [isVisible, setIsvisible] = useState(false)
    const ref = useRef<TransitioningView>(null);
    const [state, setState] = useState<any>({
		searchText: '',
        isProfileClick: false
	});

    
    const selectedRoute = ({ item, index }: any) => {
        index == 0 ?
            setIsvisible(true)
        :navigate.navigate(item.to, { userChat: chatItem })
    }
    const handleChange = (stateName: string, value: any) => {
		state[`${stateName}`] = value;
		setState({...state});
	};

   

    const _renderItem = ({ item, index }: any) => {
        return (
            <TouchableOpacity onPress={() => item.title == 'Notification' ? null :selectedRoute({ item, index })} style={{ padding: 7, justifyContent: 'center', marginTop: 7 }}>
                <HStack alignItems='center' justifyContent='space-between'>
                    <HStack>
                        <View style={{
                            width: 35, height: 35, borderRadius: 30,
                            backgroundColor: baseColor, alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon name={item.icon} as={item.type} size={18} color={whiteSmoke} />
                        </View>
                        <View style={{ marginHorizontal: main_padding - 5, borderBottomColor: labelColor, paddingVertical: 10 }}>
                            <TextItem style={{ fontSize: 15,}}>{item.title}</TextItem>
                        </View>
                    </HStack>
                    {item.title == 'Notification' ?
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

    return (
        <View style={{...styles.container, backgroundColor: themeStyle[theme].backgroundColor}}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigate.goBack()}
                style={{ padding: main_padding - 5 }}>
                <Ionicons name='chevron-back' size={25} color={themeStyle[theme].textColor} />
            </TouchableOpacity>
            <VStack justifyContent='space-between' flex={1}>
                <View style={{ width: deviceWidth, flex: 1.5, paddingHorizontal: main_padding, alignItems: 'center', }}>
                    <LinearGradient
                        colors={['#F3AE2D', '#F0DF48', '#4B38F7D2', '#3276F5F3', '#0099FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ marginTop: 15, width: 105, borderRadius: 100, height: 105 }}
                    >
                        <View style={{ margin: 1.5, backgroundColor: whiteColor, justifyContent: 'center', borderRadius: 100, width: 102, height: 102, }}>
                            <Image source={chatItem.contact_user.profile_photo ? {uri: chatItem.contact_user.profile_photo} : require('./../../assets/profile.png')} resizeMode='cover' style={{ borderRadius: 100, width: 102, height: 102, overflow: 'hidden' }} />
                        </View>
                    </LinearGradient>
                    <View style={{ paddingVertical: main_padding }}>
                        <TextItem style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>{(chatItem.contact_user.first_name+' '+chatItem.contact_user.last_name).toUpperCase()}</TextItem>
                        <TextItem style={{ fontSize: 12, paddingTop: main_padding - 10, color: '#BBBBBBE0',textAlign: 'center' }}>{chatItem.contact_user.username}</TextItem>
                    </View>
                </View>
                <View style={{ flex: 4.5, width: deviceWidth, paddingHorizontal: main_padding, }}>
                    <TextItem style={{ fontSize: 15, color: colors.textColor, fontWeight: '700' }}>More Actions</TextItem>
                    <View style={{ paddingVertical: main_padding - 5, marginTop: 10, borderRadius: 10 }}>
                        <FlatListVertical
                            scrollEnabled={false}
                            renderItem={_renderItem}
                            data={actionChatProfile}
                        />
                    </View>
                </View>
            </VStack>

            <Modal
                presentationStyle="formSheet"
                visible={isVisible}
                animationType="slide"
                onDismiss={() => console.log('on dismiss')}>
                <View style={{flex: 1, backgroundColor: themeStyle[theme].backgroundColor }}>
                    <View style={{ margin: main_padding, marginTop: large_padding }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => setIsvisible(false)}><Text style={{ color: baseColor, fontWeight: '500', fontSize: 16, fontFamily: 'lato' }}>Cancel</Text></TouchableOpacity>
                            <Text style={{ fontWeight: '600', fontSize: 16, fontFamily: 'Montserrat-Regular', color: theme == 'dark' ? whiteSmoke : textDesColor }}>Create new group</Text>
                            <View />
                            <View/>
                        </View>
                    </View>
                    <CreateGroup isUserProfile={true} userChat={chatItem} />
                </View>
            </Modal>
        </View>
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
