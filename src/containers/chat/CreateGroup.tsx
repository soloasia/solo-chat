//import liraries
import { useNavigation } from '@react-navigation/native';
import { HStack, Icon, Input, VStack } from 'native-base';
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import reactotron from 'reactotron-react-native';
import colors, { boxColor, iconColor, whiteColor } from '../../config/colors';
import { main_padding } from '../../config/settings';
import { textDesColor, textColor, labelColor, baseColor, borderColor, whiteSmoke } from '../../config/colors';
import { FlatListHorizontal, FlatListVertical, Footer, TextItem, UserAvatar } from '../../customs_items/Components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { deviceWidth } from '../../styles/index';
import { ChatData } from '../../temp_data/Contact';
import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// create a component
const CreateGroup = (props: any) => {
    const navigate: any = useNavigation();
    const { userChat } = props.route.params;
    const [selectUser, setSelectUser] = useState([userChat])

    const _removeObj = ({ item, index }: any) => {
        if(item.uniqueId != userChat.uniqueId){
            const filterDupplicate = selectUser.filter(element => element.uniqueId != item.uniqueId);
            
            setSelectUser(filterDupplicate)
        }

    }
    const _renderSelectedUserItem = ({ item, index }: any) => {
        return (
            <VStack alignItems='center' style={{ marginLeft: 10, justifyContent: 'center', }}>
                <UserAvatar style={{ width: 70, height: 70, borderWidth: 2, borderColor: baseColor }}>
                    <Image source={item.icon} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                </UserAvatar>
                <TouchableOpacity 
                    onPress={() => _removeObj({ item, index })} 
                    style={{ 
                        position: 'absolute', top: 13, right: 5, width: 20, height: 20, 
                        borderRadius: 10, backgroundColor: iconColor, alignItems: 'center', 
                        justifyContent: 'center', borderColor: whiteSmoke, borderWidth: 1 
                    }}
                >
                    <Icon name='close' as={AntDesign} size='sm' color={whiteSmoke} />
                </TouchableOpacity>
                <Text style={{ marginTop: 5, fontFamily: 'lato', fontSize: 13 }}>{item.name}</Text>
            </VStack>
        )
    }

    const _handleAddPeople = ({ item, index }: any) => {
        const filterDupplicate = selectUser.filter(element => element.uniqueId === item.uniqueId);
        if (_.isEmpty(filterDupplicate)) {
            setSelectUser([...selectUser, item])
        }
    }

    const _renderUsers = ({ item, index }: any) => {
        var filterIsadded = selectUser.filter(element => element.uniqueId === item.uniqueId);
        return (
            <TouchableOpacity onPress={() => _handleAddPeople({ item, index })} style={{ paddingVertical: main_padding - 5, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: boxColor }}>
                <HStack justifyContent={'space-between'}>
                    <HStack space={3} alignItems="center">
                        <UserAvatar style={{ width: 50, height: 50, }}>
                            <Image source={item.icon} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                        </UserAvatar>
                        <VStack space={1}>
                            <TextItem style={{ fontSize: 15, fontFamily: 'lato' }}>{item.name}</TextItem>
                        </VStack>
                    </HStack>
                    <VStack space={2} alignItems={'center'} justifyContent={'center'}>
                        <Icon name={_.isEmpty(filterIsadded) ? 'radio-button-off' : 'radio-button-on'} as={MaterialIcons} size='md' color={iconColor} />
                    </VStack>
                </HStack>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <HStack alignItems='center' justifyContent='space-between'>
                <HStack alignItems='center'>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigate.goBack()}
                        style={{ padding: main_padding - 5 }}>
                        <Ionicons name='chevron-back' size={25} color={colors.textColor} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'lato', color: textColor, fontSize: 15, fontWeight: '700' }}>Create new group</Text>
                </HStack>
                <TouchableOpacity style={{ paddingRight: main_padding }} disabled={selectUser.length > 1 ? false : true}>
                    <Text style={{ fontSize: 14, fontFamily: 'lato', color: selectUser.length > 1? textColor : textDesColor, fontWeight: '700' }}>Create</Text>
                </TouchableOpacity>
            </HStack>
            <View style={{ flex: 1, padding: main_padding }}>
                <TextInput
                    style={{ fontSize: 14, fontFamily: 'lato', borderRadius: 7 }}
                    placeholder='Group name'
                    placeholderTextColor={textDesColor}
                />

                <View style={{ height: deviceWidth * 0.3, justifyContent: 'center', }}>
                    <FlatListHorizontal
                        data={selectUser}
                        renderItem={_renderSelectedUserItem}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'lato', fontSize: 15, marginBottom: 10, fontWeight: '700' }}>Add people</Text>
                    <FlatListVertical
                        renderItem={_renderUsers}
                        data={ChatData}
                        ListFooterComponent={
                            <>
                                <Footer />
                            </>
                        }
                    />
                </View>
            </View>
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
export default CreateGroup;
