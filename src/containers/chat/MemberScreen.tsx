//import liraries
import _ from 'lodash';
import { Divider, HStack, VStack } from 'native-base';
import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { borderDivider, chatText, textDesColor, whiteColor } from '../../config/colors';
import { large_padding, main_padding } from '../../config/settings';
import { FlatListVertical, Footer, TextItem, UserAvatar } from '../../customs_items/Components';
import SearchBox from '../../customs_items/SearchBox';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import themeStyle from '../../styles/theme';
import { ThemeContext } from '../../utils/ThemeManager';
import Lottie from 'lottie-react-native';
import { useSelector } from 'react-redux';
import style, { deviceHeight, deviceWidth } from '../../styles';

// create a component
const MemberScreen = (props: any) => {
    const { userChat } = props.route.params;
    const {theme} : any = useContext(ThemeContext);
    const [showModal, setshowModal] = useState(false);
    const mycontact = useSelector((state: any) => state.mycontact);
    const _renderMemberView = ({ item, index }: any) => {
        return(
            <TouchableOpacity style={{padding:main_padding,justifyContent:'center',backgroundColor: themeStyle[theme].backgroundColor,borderBottomWidth:1,borderBottomColor:borderDivider}}>
                <HStack justifyContent={'space-between'}>
                    <HStack space={3} alignItems="center">
                        <UserAvatar>
                        <FastImage source={item.user.profile_photo?{uri:item.user.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%',borderRadius:50}}/>
                            {/* {
                                item.user.profile_photo == null ? <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> :	<FastImage source={item.user.profile_photo} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                            } */}
                        </UserAvatar>
                        <VStack space={1}>
                            <TextItem style={{ fontSize: 16 }}>{item.user.first_name + " "+ item.user.last_name}</TextItem>
                            {/* <Text style={{ textAlign: 'center', fontSize: 14, color: textSecondColor,fontFamily: 'Montserrat-Regular' }}>{item.text}</Text> */}
                        </VStack>
                    </HStack>
                    <VStack space={2} alignItems={'center'} justifyContent={'center'}>
                        <TextItem style={{textAlign:'center',fontSize:14,color: chatText}}>Now</TextItem>
                        {/* {item.status ==1?
                            <View style={{width:25,height:25,borderRadius:30,backgroundColor:bageColor,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{textAlign:'center',fontSize:14,color:whiteColor}}>2</Text>
                            </View>
                            :
                            <></>
                        } */}
                    </VStack>
                </HStack>
            </TouchableOpacity>
         ) 
    }


    const _renderContactView = ({item,index}:any) =>{
		return(
			item.contact_user ? 
				<TouchableOpacity onPress={()=>{}} style={{padding:7,justifyContent:'center',marginBottom:10,borderRadius:10}}>
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



    return (
        <BaseComponent {...baseComponentData} title={"Members"}>
            <TouchableOpacity style = {{flexDirection : "row",padding : main_padding}} onPress ={() => setshowModal(true)}> 
                <Ionicons style={{paddingRight : main_padding / 2}}  name="person-add" color={themeStyle[theme].textColor} size= {18} />
                <TextItem >Add member</TextItem>
            </TouchableOpacity>
            <FlatListVertical
                renderItem={_renderMemberView}
                data={userChat.chatroom_users}
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
                                {/* <TouchableOpacity onPress={createGroup ?() => setCreateGroup(!createGroup) : ()=> setShowModal(false)}><Text style={{color: baseColor ,fontWeight :'500',fontSize :16}}>Cancel</Text></TouchableOpacity>
                                {createGroup ? <TextItem style={{fontWeight :'600',fontSize :16}}>Create new group</TextItem> : <TextItem style={{fontWeight :'600',fontSize :16}}>New Message</TextItem>} */}
                                <View></View>
                            </View>
                        </View>
                        <SearchBox></SearchBox>
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
