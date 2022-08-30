//import liraries
import { useNavigation } from '@react-navigation/native';
import { HStack, Icon, Input, VStack } from 'native-base';
import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import reactotron from 'reactotron-react-native';
import colors, { borderDivider, boxColor, iconColor, whiteColor } from '../../config/colors';
import { main_padding } from '../../config/settings';
import { textDesColor, textColor, labelColor, baseColor, borderColor, whiteSmoke } from '../../config/colors';
import { FlatListHorizontal, FlatListVertical, Footer, TextItem, UserAvatar } from '../../customs_items/Components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { deviceWidth } from '../../styles/index';
import { ChatData } from '../../temp_data/Contact';
import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../../utils/ThemeManager';
import SearchBox from '../../customs_items/SearchBox';
import { GET, POST, postCreateGroup } from '../../functions/BaseFuntion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadData } from '../../functions/LoadData';
import { loadContact } from '../../actions/Contact';

let lastDoc: any = 1;

// create a component
const CreateGroup = (props: any) => {
    const navigate: any = useNavigation();
    const { theme }: any = useContext(ThemeContext);
    const dispatch:any = useDispatch();
    const userInfo = useSelector((state: any) => state.user);


    const { userChat, isUserProfile, onClose } = props
    const [selectUser, setSelectUser] = useState(isUserProfile ? [userChat] : [])
    const mycontact = useSelector((state: any) => state.mycontact);
    const [userIds, setUserIds] = useState<any>(isUserProfile ? [userChat.contact_user_id] : [])
    const [state, setState] = useState<any>({
        searchText: '',
        groupName: ''
    });

    function getData() {
		GET(`me/contact?page=${lastDoc}`)
		.then(async (result: any) => {
			if(result.status){
				dispatch(loadContact(result.data.data))
				// setLoading(false)
			}
		})
		.catch(e => {
			// setLoading(false)
		});
	}

    const handleChange = (stateName: string, value: any) => {
        state[`${stateName}`] = value;
        setState({ ...state });
    };


    const _removeObj = ({ item, index }: any) => {
        const filterDupplicate = selectUser.filter((element:any) => element.contact_user_id != item.contact_user_id);
        setSelectUser(filterDupplicate)
        _.remove(userIds, function (c) {
            return (c === item.contact_user_id); //remove object
        });

        setUserIds(userIds)
    }
    const _renderSelectedUserItem = ({ item, index }: any) => {
        return (
            <VStack alignItems='center' style={{ marginLeft: 10, justifyContent: 'center', }}>
                <UserAvatar style={{ width: 65, height: 65, borderWidth: 2, borderColor: baseColor }}>
                    <Image source={item.contact_user && item.contact_user.profile_photo!=null ? { uri: item.contact_user.profile_photo } : require('./../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 100 }} />
                </UserAvatar>
                <TouchableOpacity
                    onPress={() => _removeObj({ item, index })}
                    style={{
                        position: 'absolute', top: 0, right: 0, width: 20, height: 20,
                        borderRadius: 10, backgroundColor: iconColor, alignItems: 'center',
                        justifyContent: 'center', borderColor: whiteSmoke, borderWidth: 1
                    }}
                >
                    <Icon name='close' as={AntDesign} size='sm' color={whiteSmoke} />
                </TouchableOpacity>
                <TextItem style={{ marginTop: 5, fontFamily: 'lato', fontSize: 13, width: 70, textAlign: 'center' }}>{item.contact_user ? item.contact_user.first_name + ' ' + item.contact_user.last_name : ''}</TextItem>
            </VStack>
        )
    }

    const _handleAddPeople = ({ item, index }: any) => {
        const filterDupplicate = selectUser.filter((element:any) => element.contact_user_id === item.contact_user_id);
        if (_.isEmpty(filterDupplicate)) {
            setSelectUser([...selectUser, item])
            setUserIds((userIds: any) => [...userIds, item.contact_user_id])
        }
    }
    const _renderUsers = ({ item, index }: any) => {
        var filterIsadded = selectUser.filter((element:any) => element.contact_user_id === item.contact_user_id);
        return (
            <TouchableOpacity onPress={() => _handleAddPeople({ item, index })} style={{ paddingVertical: main_padding - 5, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: borderDivider }}>
                <HStack justifyContent={'space-between'}>
                    <HStack space={3} alignItems="center">
                        <UserAvatar style={{ width: 50, height: 50, }}>
                            <Image source={item.contact_user && item.contact_user.profile_photo!=null ? { uri: item.contact_user.profile_photo } : require('./../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%', borderRadius: 100 }} />
                        </UserAvatar>
                        <VStack space={1}>
                            <TextItem style={{ fontSize: 15, fontFamily: 'lato' }}>{item.contact_user.first_name + ' ' + item.contact_user.last_name}</TextItem>
                        </VStack>
                    </HStack>
                    <VStack space={2} alignItems={'center'} justifyContent={'center'}>
                        <Icon name={_.isEmpty(filterIsadded) ? 'radio-button-off' : 'radio-button-on'} as={MaterialIcons} size='md' color={iconColor} />
                    </VStack>
                </HStack>
            </TouchableOpacity>
        )
    }

    const createGroupUser = async () => {
        let token = await AsyncStorage.getItem('@token');
        const requestBody:any = {
            name: state.groupName,
            group_user_ids: userIds
        }
        
        // const formdata = new FormData();
        // formdata.append("name", state.groupName);
        // formdata.append('group_user_ids[]', [userIds]);
        // reactotron.log(formdata)
        if (state.groupName != '') {
            await postCreateGroup('group/create', requestBody).then(async (result: any) => {
                if (result.status) {
                    navigate.navigate('ChatList', { chatItem: result.data });
		            loadData(dispatch);
                    onClose()
                } else {
                    Alert.alert('Something went wrong!\n', 'Please try again later')
                }
            })
        }else {
            Alert.alert('Sorry!\n', 'Group name field is required.')
        }
    }

    const onChangeText = (text: any) => {
        handleChange('searchText', text)
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


    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: main_padding }}>
                <TextInput
                    style={{ fontSize: 14, fontFamily: 'Montserrat-Regular', borderRadius: 7, color: theme == 'dark' ? whiteSmoke : textDesColor }}
                    placeholder='Group name...'
                    value={state.groupName}
                    onChangeText={(text) => handleChange('groupName', text)}
                    placeholderTextColor={theme == 'dark' ? whiteSmoke : textDesColor}
                />
            </View>
            <SearchBox
                onChangeText={(text:any)=> onChangeText(text)}
                onClear = {(text:any)=> onChangeText('')}
                value = {state.searchText}
            />

            <View style={{ flex: 1, paddingHorizontal: main_padding }}>
                {!isUserProfile && _.isEmpty(selectUser) ?
                    <View />
                    :
                    <View style={{ justifyContent: 'center', paddingBottom: 10 }}>
                        <FlatListHorizontal
                            data={selectUser}
                            renderItem={_renderSelectedUserItem}
                        />
                    </View>
                }
                <View style={{ flex: 1 }}>
                    <TextItem style={{ fontFamily: 'lato', fontSize: 15, marginBottom: 10, fontWeight: '700' }}>Add people</TextItem>
                    <FlatListVertical
                        renderItem={_renderUsers}
                        data={mycontact}
                        ListFooterComponent={
                            <>
                                <Footer />
                            </>
                        }
                    />
                </View>
            </View>
            <View style={{ width: deviceWidth, height: 80, padding: main_padding }}>
                <TouchableOpacity disabled={selectUser.length < 2 ? true : false} onPress={createGroupUser} style={{ height: 45, backgroundColor: selectUser.length < 2 ? '#478ECC3F' : baseColor, borderRadius: 7, alignItems: 'center', justifyContent: 'center', }}>
                    <Text style={{ fontFamily: 'lato', fontSize: 16, fontWeight: '700', color: whiteSmoke }}>CREATE GROUP</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default CreateGroup;
