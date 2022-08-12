//import liraries
import { HStack, Icon, VStack } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { main_padding } from '../../config/settings';
import style, { deviceWidth, deviceHeight } from '../../styles/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors, { whiteColor } from '../../config/colors';
import { useNavigation } from '@react-navigation/native';
import { FlatListHorizontal, UserAvatar, FlatListVertical } from '../../customs_items/Components';
import LinearGradient from 'react-native-linear-gradient';
import { actionChatProfile } from '../../temp_data/Setting';
import { baseColor, whiteSmoke, bgChat, textDesColor } from '../../config/colors';

// create a component
const ChatProfileScreen = (props:any) => {
    const navigate: any = useNavigation();
    const {chatItem} = props.route.params;


    const selectedRoute =({item, index}:any) => {
        navigate.navigate(item.to, {userChat: chatItem})
    }

    const _renderItem = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>selectedRoute({item, index})} style={{padding:7,justifyContent:'center', marginTop: 7}}>
				<HStack alignItems='center'>
                    <View style={{
                        width: 35, height: 35, borderRadius: 30, 
                        backgroundColor: baseColor, alignItems: 'center', 
                        justifyContent: 'center'
                    }}>
                        <Icon name={item.icon} as={item.type} size={18} color={whiteSmoke} />
                    </View>
                    <View style={{paddingHorizontal: main_padding-5, }}>
                        <Text style={{fontSize: 15, fontFamily: 'lato'}}>{item.title}</Text>
                    </View>
                </HStack>
			</TouchableOpacity>
		)
	}

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigate.goBack()}
                style={{ padding: main_padding - 5 }}>
                <Ionicons name='chevron-back' size={25} color={colors.textColor} />
            </TouchableOpacity>
            <VStack justifyContent='space-between' flex={1}>
                <View style={{ width: deviceWidth, flex: 1.5, paddingHorizontal: main_padding, alignItems: 'center', }}>
                    <LinearGradient
                        colors={['#17C8FF', '#329BFF', '#5A6BDBD2', '#4A62EBBE', '#002FFFB0']}
                        start={{ x: 0, y: 0 }}

                        end={{ x: 1, y: 0 }}
                        style={{ marginTop: 15, width: 105, borderRadius: 100, height: 105 }}
                    >
                        <View style={{ margin: 3, backgroundColor: whiteColor, justifyContent: 'center', borderRadius: 100, width: 99, height: 99, }}>
                            <Image source={require('./../../assets/profile.png')} resizeMode='cover' style={{ borderRadius: 100, width: 99, height: 99, overflow: 'hidden' }} />
                        </View>
                    </LinearGradient>
                    <View style={{ paddingVertical: main_padding }}>
                        <Text style={{ fontFamily: 'lato', fontSize: 14, fontWeight: '600' }}>{chatItem.name.toString().toUpperCase()}</Text>
                        <Text style={{ fontFamily: 'lato', fontSize: 13, paddingTop: main_padding - 10, color: '#797979E8' }}>Bio: smilling </Text>
                    </View>
                </View>
                <View style={{ flex: 4.5, width: deviceWidth, paddingHorizontal: main_padding, }}>
                    <Text style={{ fontFamily: 'lato', fontSize: 15, color: colors.textColor, fontWeight: '700' }}>More Actions</Text>
                    <View style={{ paddingVertical: main_padding-5, backgroundColor: bgChat, marginTop: 10, borderRadius: 10}}>
                        <FlatListVertical
                            scrollEnabled={false}
                            renderItem={_renderItem}
                            data={actionChatProfile}
                        />
                    </View>
                </View>
            </VStack>
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
