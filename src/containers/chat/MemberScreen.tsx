//import liraries
import _, { result } from 'lodash';
import { Divider, HStack, VStack } from 'native-base';
import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert, TouchableHighlight } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { baseColor, borderDivider, boxColor, chatText, textDesColor, whiteColor } from '../../config/colors';
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
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

let lastDoc: any = 1;

// create a component
const MemberScreen = (props: any) => {
    const navigate:any = useNavigation();

    const { userChat } = props.route.params;
    const [member, setMember] = useState<any>([]);
    const {theme} : any = useContext(ThemeContext);
    const [showModal, setshowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [successMsg,setSuccessMsg] = useState("");
    const [value, setValue] = useState('');
    const dispatch:any = useDispatch();
    const [admin,setAdmin] = useState<any>();
    const mycontact = useSelector((state: any) => state.mycontact);
    const user = useSelector((state: any) => state.user);
    useEffect(()=>{
        fetchMemberDetail(userChat.id)
    },[])
    function onSelectOnMember (item:any){
        if(user.id === item.data.user.id ) return false;
        else {
            GET(`chatroom/request-id?user_id=${item.data.user.id}`)
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
            <TouchableHighlight onPress={()=>onSelectOnMember(item)} underlayColor={boxColor} style={{padding:main_padding,justifyContent:'center',backgroundColor: themeStyle[theme].backgroundColor,borderBottomWidth:1,borderBottomColor:borderDivider}}>
                <HStack justifyContent={'space-between'}>
                    <HStack space={3} alignItems="center">
                        <UserAvatar>
                        <FastImage source={item.data.user.profile_photo?{uri:item.data.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%',borderRadius:50}}/>
                        </UserAvatar>
                        <VStack space={1}>
                            <TextItem style={{ fontSize: 16 }}>{item.data.user.first_name ?? "" + " "+ item.data.user.last_name ?? ""}</TextItem>
                        </VStack>
                    </HStack>
                    <VStack space={2} alignItems={'center'} justifyContent={'center'}>
                        {
                            item.data.is_admin == 1 ? <Text style={{textAlign:'center',fontSize:14,color: baseColor,fontWeight : "600"}}>Admin</Text> : <Text></Text>
                        }
                    </VStack>
                </HStack>
            </TouchableHighlight>
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
            var admin = result.data.chatroom_users.find((e:any)=> e.is_admin == 1);
            setAdmin(admin);
            setMember(Array(result.data.chatroom_users.length)
            .fill('')
            .map((_, i) => ({ key: `${i}`, data: result.data.chatroom_users[i]})));
        })
        .catch(() => {
        });
    }

    const removeUser = (userID : string) => {
        const formdata = new FormData();
        formdata.append("group_id", userChat.id);
        formdata.append("group_user_ids[]",[userID]);
        POST('group/remove-users', formdata).then(async (result: any) => {
            if(result.status){
                fetchMemberDetail(userChat.id);
            }
        }).catch(e => {
            // Alert.alert('Something went wrong! \n',"your password couldn't change, please try again later")
        });
    }

    function getData() {
		GET(`me/contact?page=${lastDoc}`)
		.then(async (result: any) => {
			if(result.status){
				dispatch(loadContact(result.data.data))
			}
		})
		.catch(e => {
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

   
    const closeRow = (rowMap : any, rowKey :any) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap :any, rowKey :any) => {
        closeRow(rowMap, rowKey);
        const newData = [...member];
        const prevIndex = member.findIndex((item:any) => item.key === rowKey);
       if(admin.user.id != member[prevIndex].data.user.id ) {
            removeUser(member[prevIndex].data.user.id);
            newData.splice(prevIndex, 1);      
            setMember(newData);
       }
    
    };

    const onRowDidOpen = (rowKey: any) => {
    };

    const renderHiddenItem = (data :any , rowMap:any) => (
        <View style={{...styles.rowBack,backgroundColor : themeStyle[theme].backgroundColor}}>
            {/* <Text>Left</Text> */}
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    useEffect(()=>{
        fetchMemberDetail(userChat.id)
    },[])

    return (
        <BaseComponent {...baseComponentData} title={"Members"}>
            <TouchableOpacity style = {{flexDirection : "row",padding : main_padding}} onPress ={() => setshowModal(true)}> 
                <Ionicons style={{paddingRight : main_padding / 2}}  name="person-add" color={baseColor} size= {18} />
                <Text style={{color:baseColor,fontSize: 16}}>Add member</Text>
            </TouchableOpacity>

            {/* <FlatListVertical
                renderItem={_renderMemberView}
                data={member}
                ListFooterComponent={
                    <>
                        <Footer />
                    </>
                }
            /> */}

            <SwipeListView
                data={member}
                renderItem={_renderMemberView}
                rightOpenValue={-150}
                renderHiddenItem={renderHiddenItem}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
            />
            <Modal
				presentationStyle="formSheet"
				visible={showModal}
				animationType="slide"
				transparent={false}
                >
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
                btn_name={'Close'}
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
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },

    
});


//make this component available to the app
export default MemberScreen;