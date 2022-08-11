import moment from "moment"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const data = [
    // {
    //     name: 'Profile',
    //     icon: 'person',
    //     color: "#8F9AA8",
    //     to:'AuthOption'
    // },
    {
        name: 'QR Code',
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
        name: 'Notifications',
        icon: 'notifications-outline',
        color: "#E88A96",
        to:''
    },
    {
        name: 'Appearance',
        icon: 'color-palette-outline',
        color: "#1772F7",
        to:'Appearance'
    },
    {
        name: 'Language',
        icon: 'ios-language-outline',
        color: "#8F9AA8",
        to:''
    },
    {
        name: 'Privacy',
        icon: 'shield-checkmark-outline',
        color: "#F0D671",
        to:''
    }
]

export const message = [
    {
        date:moment().format('ddd DD MMM YYYY'),
        data:[
            {
                text: 'It is not our differences that divide us. It is our inability to recognize, accept',
                isAdmin: false
            },
            {
                text: 'Appearance',
                isAdmin: true
            },
            {
                text: 'Language',
                isAdmin: false
            },
            {
                text: 'Privacy',
                isAdmin: true
            }
        ]
    },
    {
        date:moment().add(1,'day').format('ddd DD MMM YYYY'),
        data:[
            {
                text: 'Notifications',
                isAdmin: false
            },
            {
                text: 'It is not our differences that divide us. It is our inability to recognize, accept',
                isAdmin: true
            },
            {
                text: 'Language',
                isAdmin: false
            },
            {
                text: 'Privacy',
                isAdmin: true
            }
        ]
    },
    {
        date:moment().add(2,'day').format('ddd DD MMM YYYY'),
        data:[
            {
                text: 'Notifications',
                isAdmin: false
            },
            {
                text: 'It is not our differences that divide us. It is our inability to recognize, accept',
                isAdmin: true
            },
            {
                text: 'Language',
                isAdmin: false
            },
            {
                text: 'Privacy',
                isAdmin: true
            }
        ]
    }
]

export const actionChatProfile = [
    {
        title: 'Create group chat',
        icon: 'account-group',
        type: MaterialCommunityIcons,
        to:'CreateGroup'
    },
    {
        title: 'Media, files & links',
        icon: 'photo-size-select-actual',
        type: MaterialIcons,
        to: 'Mediafile'
    },
    {
        title: 'Notification & Sounds',
        icon: 'notifications',
        type: Ionicons,
        to: ''
    },
    {
        title: 'Share contact',
        icon: 'ios-share-social-outline',
        type: Ionicons,
        to: ''
    },
]