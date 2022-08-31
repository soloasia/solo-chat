import moment from "moment"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { baseColor } from "../config/colors"
import i18n from "i18n-js";

export const data = [
    // {
    //     name: 'Profile',
    //     icon: 'person',
    //     color: "#8F9AA8",
    //     to:'AuthOption'
    // },
    {
        name: i18n.t("qr_code"),
        icon: 'qr-code-outline',
        color: "#1772F7",
        to:'QRcode'
    },
    // {
    //     name: 'Save Message',
    //     icon: 'bookmarks-outline',
    //     color: "#85CDD1",
    //     to:''
    // }
]

export const seconddata = [
    {
        name: i18n.t("notification"),
        icon: 'notifications-outline',
        color: "#E88A96",
        to:''
    },
    // {
    //     name: i18n.t("appearance"),
    //     icon: 'color-palette-outline',
    //     color: "#1772F7",
    //     to:'Appearance'
    // },
    {
        name: i18n.t("language"),
        icon: 'globe-outline',
        color: baseColor, //"#8F9AA8",
        to:'Language'
    },
    {
        name: i18n.t("privacy"),
        icon: 'shield-checkmark-outline',
        color: "#F0D671",
        to:''
    }
]

export const options = [
   {
        name: 'Video',
        icon: 'videocam-outline',
   },
   {
        name: 'Camera',
        icon: 'ios-camera-outline',
    },
    {
        name: 'File',
        icon: 'attach-outline',
    }

]

export const actionChatProfile = [
    {
        title: 'Create group chat',
        icon: 'account-group',
        type: MaterialCommunityIcons,
        to:''
    },
    {
        title: 'Media, files & links',
        icon: 'photo-size-select-actual',
        type: MaterialIcons,
        to: 'Mediafile'
    },
    {
        title: 'Notification',
        icon: 'notifications',
        type: Ionicons,
        to: 'ProfileNoti'
    },
]
export const actionGroupChatProfile = [
    {
        title: 'Members',
        icon: 'account-group',
        type: MaterialCommunityIcons,
        to:'Members'
    },
    {
        title: 'Media, files & links',
        icon: 'photo-size-select-actual',
        type: MaterialIcons,
        to: 'Mediafile'
    },
    {
        title: 'Notification',
        icon: 'notifications',
        type: Ionicons,
        to: 'ProfileNoti'
    },
    {
        title: 'Leave Group',
        icon: 'log-out-outline',
        type: Ionicons,
        to: ''
    },
    {
        title: 'Delete Group',
        icon: 'close',
        type: Ionicons,
        to: ''
    },
]

 // chatData.map((item:any,index:any)=>{
                //     let keys = Object.keys(item)[index]
                //     if(moment(result.data.created_at).format('YYYY-MM-DD') == keys){
                //         let mergeArray:any = [...item[keys],result.data];
                //         setChatData([{[keys]:mergeArray}])
        
                //     }
                // })