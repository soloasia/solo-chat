//import liraries
import _, { result } from 'lodash';
import { Divider, HStack, VStack } from 'native-base';
import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { baseColor, borderDivider, chatText, textDesColor, textSecondColor, whiteColor } from '../../config/colors';
import { large_padding, main_padding } from '../../config/settings';
import { AlertBox, FlatListVertical, Footer, TextItem, UserAvatar } from '../../customs_items/Components';
import SearchBox from '../../customs_items/SearchBox';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import themeStyle from '../../styles/theme';
import { ThemeContext } from '../../utils/ThemeManager';
import Lottie from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import style, { deviceHeight, deviceWidth } from '../../styles';
import { GET, POST } from '../../functions/BaseFuntion';
import { loadContact } from '../../actions/Contact';
import reactotron from 'reactotron-react-native';
import { useNavigation } from '@react-navigation/native';

let lastDoc: any = 1;

// create a component
const MemberScreen = (props: any) => {
    const navigate:any = useNavigation();

    const { userChat } = props.route.params;
    const [member, setMember] = useState([]);
    const {theme} : any = useContext(ThemeContext);
    const [showModal, setshowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [successMsg,setSuccessMsg] = useState("");
    const [value, setValue] = useState('');
    const dispatch:any = useDispatch();
    const mycontact = useSelector((state: any) => state.mycontact);
    const user = useSelector((state: any) => state.user);
    useEffect(()=>{
        fetchMemberDetail(userChat.id)
    },[])
    function onSelectOnMember (item:any){
        if(user.id === item.user_id ) return false;
        else {
            GET(`chatroom/request-id?user_id=${item.user_id}`)
			.then(async (result: any) => {
				if(result.status){
					navigate.navigate('ChatList', { chatItem: result.data });
				}
			})
			.catch(e => {
		});
        }
    }
    const _renderMemberView = ({ item, index }: any) => {
        return(
            <TouchableOpacity onPress={()=>onSelectOnMember(item)} style={{padding:main_padding,justifyContent:'center',backgroundColor: themeStyle[theme].backgroundColor,borderBottomWidth:1,borderBottomColor:borderDivider}}>
                <HStack justifyContent={'space-between'}>
                    <HStack space={3} alignItems="center">
                        <UserAvatar>
                        <FastImage source={item.user.profile_photo?{uri:item.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%',borderRadius:50}}/>
                            {/* {
                                item.user.profile_photo == null ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> :	<FastImage source={item.user.profile_photo} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                            } */}
                        </UserAvatar>
                        <VStack space={1}>
                            <TextItem style={{ fontSize: 16 }}>{item.user.first_name ?? "" + " "+ item.user.last_name ?? ""}</TextItem>
                            <Text style={{ textAlign: 'center', fontSize: 12, color: textSecondColor,fontFamily: 'Montserrat-Regular' }}>{item.user.username}</Text>
                        </VStack>
                    </HStack>
                    <VStack space={2} alignItems={'center'} justifyContent={'center'}>
                        {
                            item.is_admin == 1 ? <Text style={{textAlign:'center',fontSize:14,color: baseColor,fontWeight : "600"}}>Admin</Text> : <Text></Text>
                        }
                    </VStack>
                </HStack>
            </TouchableOpacity>
         ) 
    }

    const _renderContactView = ({item,index}:any) => {
		return(
			item.contact_user ? 
				<TouchableOpacity onPress={()=>{_handleAddToGroupChat(item.contact_user_id)}} style={{padding:7,justifyContent:'center',marginBottom:10,borderRadius:10}}>
					<HStack alignItems="center" space={4}>
						<UserAvatar>
							<FastImage source={item.contact_user.profile_photo?{uri:item.contact_user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%',borderRadius:50}}/>
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

    const _handleAddToGroupChat = (contact_uid : string) => {
        const formdata = new FormData();
        formdata.append("group_id", userChat.id);
        formdata.append("group_user_ids[]", [contact_uid]);   
        POST('group/add-users', formdata)
            .then(async (result: any) => {
                console.log("add user result",result);
                if (result.status) {
                    fetchMemberDetail(userChat.id);
                    setshowModal(false);
                    setIsOpen(true);
                    setSuccessMsg(result.message);
                } else {
                    setshowModal(false);
                    setIsOpen(true);
                    setSuccessMsg(result.message);
                }
            })
            .catch((e:any) => {
                // handleChange('loading', false);
            });
    }

    const fetchMemberDetail = (id : string) => {
        GET('chatroom/detail/'+ id)
        .then((result) => {
            console.log("result",result.data.chatroom_users.length);
            setMember(result.data.chatroom_users);
        })
        .catch(() => {
        });
    }

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

   
    return (
        <BaseComponent {...baseComponentData} title={"Members"}>
            <TouchableOpacity style = {{flexDirection : "row",padding : main_padding}} onPress ={() => setshowModal(true)}> 
                <Ionicons style={{paddingRight : main_padding / 2}}  name="person-add" color={baseColor} size= {18} />
                <Text style={{color:baseColor,fontSize: 16}}>Add member</Text>
            </TouchableOpacity>
            <FlatListVertical
                renderItem={_renderMemberView}
                data={member}
                ListFooterComponent={
                    <>
                        <Footer />
                    </>
                }
            />

            <Modal
				presentationStyle="formSheet"
				visible={showModal}
				animationType="slide"
				transparent={true}
                onDismiss={() => console.log('on dismiss')}>
					<View style={{flex : 1, backgroundColor : themeStyle[theme].backgroundColor}}>
                        <View style={{margin : main_padding, marginTop : large_padding,}}>
                            <View style={{flexDirection : 'row',justifyContent: 'space-between', alignItems:'center'}}>
                                <TouchableOpacity onPress={() => setshowModal(false)}><TextItem>Cancel</TextItem></TouchableOpacity>
                                <TextItem>Contacts</TextItem>
                                <View style = {{paddingHorizontal: main_padding}}></View>
                            </View>
                        </View>
                        <SearchBox
                            onChangeText={(text:any)=> onChangeText(text)}
                            onClear = {(text:any)=> onChangeText('')}
                            value = {value}
                        />
                        {_.isEmpty(mycontact)?
                            <View style={{width: deviceWidth, height: deviceHeight*0.6, }}>
                                <Lottie
                                    source={require('../../assets/no-data.json')} 
                                    autoPlay loop 
                                /> 
                            </View>
                            :
                            <FlatListVertical
                                style={{padding:main_padding}}
                                renderItem={_renderContactView}
                                data={mycontact}
                                refreshControl={
                                    <></>
                                    // <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
                                }
                                ListFooterComponent={
                                    <>
                                        {/* {isMoreLoading && lastDoc !== 0 && renderFooter()} */}
                                        <Footer />
                                    </>
                                }
                                // onTouchMove={_onScroll}
                                // onEndReached={() => {
                                //     if (!isMoreLoading) {
                                //         getMore();
                                //     }
                                // }}
                            />
                        }
						
					</View>
            </Modal>

            <AlertBox
                title={'Success'}
                des={successMsg}
                // btn_cancle={<></>}
                btn_name={'Close'}
                // onCloseAlert={() => setIsOpen(false)}
                onConfirm={() => setIsOpen(false)}
                isOpen={isOpen}
            />
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default MemberScreen;
