import {  StyleSheet, Text, Image, View, Modal, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeContext } from '../../utils/ThemeManager';
import { large_padding, main_padding } from '../../config/settings';
import { FlatListVertical, Footer, TextItem, UserAvatar } from '../../customs_items/Components';
import themeStyle from '../../styles/theme';
import { baseColor, borderDivider, inputColor, textDesColor, whiteColor } from '../../config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Box, Divider, HStack, VStack } from 'native-base';
import { GET, POST } from '../../functions/BaseFuntion';
import style from '../../styles';
import _ from 'lodash'
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { loadContact } from '../../actions/Contact';
import reactotron from 'reactotron-react-native';
import { LanguageContext } from '../../utils/LangaugeManager';
const AddContactScreen = (props:any) => {
    const { onOpen,onClose,onScanQr } = props;
    const navigate: any = useNavigation();
    const insets = useSafeAreaInsets();
	const dispatch:any = useDispatch();
    const [currentIndex, setIndex] = useState<any>([])
	const {theme} : any = useContext(ThemeContext);
    const {tr} : any = useContext(LanguageContext);
    const [state, setState] = useState<any>({
        username: '',
        loading: false,
        userData:[],
    });
    useEffect(()=>{
        handleChange("username",'');
        handleChange("userData",[]);
        setIndex([]);
    },[onOpen])

    const handleChange = (stateName: string, value: any) => {
        state[`${stateName}`] = value;
        setState({ ...state });
    };
    const onSearchUsername = (text:any) =>{
        if(text != ''){
            handleChange("loading",true)
            GET(`search/username?value=${text}`)
            .then(async (result: any) => {
                if(result.status){
                    handleChange("userData",result.data)
                    handleChange("loading",false)
                }
            })
            .catch(e => {
                handleChange("loading",false)
            });
        }else{
            handleChange("userData",[])
        }
    }
    const onAddFriend = (item:any) =>{
        const formdata = new FormData();
        formdata.append("contact_user_id", item.id);
        POST('contact/add', formdata)
        .then(async (result: any) => {
            if (result.status) {
                setIndex((currentIndex:any) => [...currentIndex, {id:item.id}])
                GET(`me/contact?page=1`)
                .then(async (result: any) => {
                    if(result.status){
                        dispatch(loadContact(result.data.data))
                    }
                })
                .catch(e => {
                });
            } else {
            }
        })
    }
    const _renderContactView = ({item,index}:any) =>{
        let statusAdd = _.filter(currentIndex, { id: item.id })[0]
		return(
			<TouchableOpacity style={{padding:5,justifyContent:'center',marginBottom:10,borderRadius:10}}>
				<HStack alignItems="center">
					<UserAvatar>
						<FastImage source={item.profile_photo?{uri:item.profile_photo}:require('../../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%',borderRadius:50}}/>
					</UserAvatar>
					<VStack space={1} flex={1} paddingLeft={2}>
						<Text style={{...style.p,color : themeStyle[theme].textColor}}>{item.first_name} {item.last_name}</Text>
						<HStack alignItems={'center'}>
							<Text style={[style.p,{fontSize:12,color:textDesColor}]}>{item.username}</Text>
						</HStack>
				        <Divider marginTop={2} color={borderDivider}  _light={{ bg: borderDivider}} _dark={{bg:whiteColor}}/>
					</VStack>
                    <TouchableOpacity onPress={()=>onAddFriend(item)} style={{position:'absolute',top:10,bottom:0,right:0}}>
                        {statusAdd && statusAdd.id ==item.id?
							<Text style={[style.p,{fontSize:12,color:baseColor}]}>Friends</Text>
                            :
                            <Ionicons name={"person-add-outline"} size={20} color={baseColor}/>
                        }
                    </TouchableOpacity>
				</HStack>
			</TouchableOpacity>
		)
	}
    return (
        <Modal
            presentationStyle="formSheet"
            transparent={false}
            visible ={onOpen}
            animationType="slide"
            hardwareAccelerated ={true}
            onRequestClose={onClose}
            >
            <View style = {{flex : 1, backgroundColor : themeStyle[theme].backgroundColor}}>
                <View style={{margin : main_padding , marginTop : large_padding}}>
                    <View style={{flexDirection : 'row',justifyContent: 'space-between'}}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={{color: baseColor ,fontWeight :'500',fontSize :16}}>{tr("cancel")}</Text>
                        </TouchableOpacity>
                        <TextItem style={{fontWeight :'700',fontSize :16}}>{tr("add_contact")}</TextItem>
                        <Box
                            style={{
                                width: 20
                            }}
                        />
                    </View>
                    <View style = {{flexDirection : "row",justifyContent : 'center' ,alignItems: "center",marginHorizontal : main_padding,marginTop : main_padding }}>
                        <TextInput 
                            value={state.username}
                            style={[styles.input,{marginTop : main_padding,backgroundColor : themeStyle[theme].primary,color : themeStyle[theme].textColor}]}
                            placeholder={tr("enter_username")}
                            placeholderTextColor={'#ADB9C6'}
                            returnKeyType='search'
                            onSubmitEditing={onSearchUsername}
                            onChangeText={(text) => {
                                handleChange('username', text)
                                onSearchUsername(text)
                            }}
                        />
                        <TouchableOpacity onPress={onScanQr}>
                            <Ionicons name={'scan'} size={25} style={{color:baseColor,marginTop: main_padding,marginLeft : main_padding}}/>
                        </TouchableOpacity>
                    </View>
                    {_.isEmpty(state.userData)?<Text style={{fontSize : 12, color:'gray' ,marginLeft :4,marginTop : 10}}>{tr("add_contact_hint")}</Text>:<></>}
                    <FlatListVertical
                        style={{paddingTop:20}}
                        renderItem={_renderContactView}
                        data={state.userData}
                        ListFooterComponent={
                            <>
                                <Footer />
                            </>
                        }
                    />
                </View>
            </View>
        </Modal>
    )
}
export default AddContactScreen;
const styles = StyleSheet.create({
    input: {
        backgroundColor: inputColor, 
        height: 45,width: '100%', 
        borderRadius: 25, 
        paddingHorizontal: main_padding, 
        color: textDesColor, 
        fontFamily: 'lato', 
        fontSize: 13
    },
})