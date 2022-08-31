//import liraries
import React, { createContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

let translation  = {
    en : {
        language: "Language",
        settings : "Settings",
        edit: "Edit",
        dark_mode : "Dark Mode",
        qr_code : "QR Code",
        notification : "Notification",
        appearance : "Appearance",
        privacy : "Privacy",
        chats : "Chats",
        contacts : "Contacts",
        search : "Search",
        username : "Username",
        password : "Password",
        cancel : "Cancel",
        add_contact : "Add Contact",
        add_member : "Add member",
        new_message : "New Message",
        enter_username : "Enter Username",
        add_contact_hint : "You can add contact by their username. It's case sensitive.",
        create_new_group : "Create new group",
        add_people : "Add people",
        group_name : "Group name...",
        personal_info : "Personal Information",
        members : "Members",
        more_actions : "More Actions",
        set_new_photo : "Set a new photo",
        change_password : "Change password",
        leave_group : "Leave Group",
        back : "Back",
        close : "Close",
        media_files_links : "Media, files & links",
        delete_group : "Delete Group",
        create_group_chat : "Create group chat",
        done : "Done",
        create_group : "Create group",
        save : "Save",
        view : "View",
        current_password : "Current Password",
        new_password : "New Password",
        confirm_password : "Confirm Password",
        hide : "Hide",
        log_out : "Log Out",
        no_message : "No messages here yet...",
        say_hello : "Say Hello to start conversations",
        type_message_hint : "Type a message...",
    },
    "zh-cn" : {
        language: "语",
        settings : "设置",
        edit: "编辑",
        dark_mode : "黑暗模式",
        qr_code : "二维码",
        notification : "通知",
        appearance : "外貌",
        privacy : "隐私",
        chats : "聊天",
        contacts : "联系人",
        search : "搜索",
        username : "用户名",
        password : "密码",
        cancel : "取消",
        add_contact : "增加联系人",
        add_member : "添加成员",
        new_message : "新消息",
        enter_username : "输入用户名",
        add_contact_hint : "您可以通过他们的用户名添加联系人。它区分大小写。",
        create_new_group : "创建新组",
        add_people : "增加人数",
        group_name : "团队名字...",
        personal_info : "个人信息",
        members : "成员",
        more_actions : "更多操作",
        set_new_photo : "设置一张新照片",
        change_password : "更改密码",
        leave_group : "离开组",
        back : "后退",
        close : "关",
        media_files_links : "媒体、文件和链接",
        delete_group : "删除组",
        create_group_chat : "创建群聊",
        done : "完毕",
        create_group : "创建组",
        save : "节省",
        view : "看法",
        current_password : "当前密码",
        new_password : "新密码",
        confirm_password : "确认密码",
        hide : "隐藏",
        log_out : "登出",
        log_out_question : "您确定要退出吗？",
        no: "不",
        yes : "是的",
        no_message : "这里还没有消息...",
        say_hello : "打个招呼开始对话",
        type_message_hint : "键入消息...",
        
    },
    ar : {
        language: "لغة",
        settings : "إعدادات",
        edit: "Edit",
        dark_mode : "Dark Mode",
        notification : "Notification",
        appearance : "Appearance",
        privacy : "Privacy",
        chats : "Chats",
        qr_code : "QR Code",
        contacts : "Contacts",
        search : "Search",
        username : "Username",
        password : "Password",
        cancel : "Cancel",
        add_contact : "Add Contact",
        add_member : "Add member",
        new_message : "New Message",
        enter_username : "Enter Username",
        add_contact_hint : "You can add contact by their username. It's case sensitive.",
        create_new_group : "Create new group",
        add_people : "Add people",
        group_name : "Group name...",
        personal_info : "Personal Information",
        members : "Members",
        more_actions : "More Actions",
        set_new_photo : "Set a new photo",
        change_password : "Change password",
        leave_group : "Leave Group",
        back : "Back",
        close : "Close",
        media_files_links : "Media, files & links",
        delete_group : "Delete Group",
        create_group_chat : "Create group chat",
        done : "Done",
        create_group : "Create group",
        save : "Save",
        view : "View",
        current_password : "Current Password",
        new_password : "New Password",
        confirm_password : "Confirm Password",
        hide : "Hide",
        log_out : "Log Out",
        log_out_question : "Are you sure you want to log out?",
        no: "No",
        yes : "Yes",
        no_message : "No messages here yet...",
        say_hello : "Say Hello to start conversations",
        type_message_hint : "Type a message...",
    },
    th : {
        language: "ภาษา",
        settings : "การตั้งค่า",
        edit: "Edit",
        dark_mode : "Dark Mode",
        notification : "Notification",
        appearance : "Appearance",
        privacy : "Privacy",
        chats : "Chats",
        qr_code : "QR Code",
        contacts : "Contacts",
        search : "Search",
        username : "Username",
        password : "Password",
        cancel : "Cancel",
        add_contact : "Add Contact",
        add_member : "Add member",
        new_message : "New Message",
        enter_username : "Enter Username",
        add_contact_hint : "You can add contact by their username. It's case sensitive.",
        create_new_group : "Create new group",
        add_people : "Add people",
        group_name : "Group name...",
        personal_info : "Personal Information",
        members : "Members",
        more_actions : "More Actions",
        set_new_photo : "Set a new photo",
        change_password : "Change password",
        leave_group : "Leave Group",
        back : "Back",
        close : "Close",
        media_files_links : "Media, files & links",
        delete_group : "Delete Group",
        create_group_chat : "Create group chat",
        done : "Done",
        create_group : "Create group",
        save : "Save",
        view : "View",
        current_password : "Current Password",
        new_password : "New Password",
        confirm_password : "Confirm Password",
        hide : "Hide",
        log_out : "Log Out",
        log_out_question : "Are you sure you want to log out?",
        no: "No",
        yes : "Yes",
        no_message : "No messages here yet...",
        say_hello : "Say Hello to start conversations",
        type_message_hint : "Type a message...",
    }
}

export const LanguageContext = createContext({});

// create a component
const LanguageManager = ({children} : any) => {
    const [language, setLanguage] = useState(i18n.locale);
    const getLanguage = async (data : {}) => {
        i18n.translations = data;
        try {
            const value = await AsyncStorage.getItem("language");
            i18n.locale = value ?? "en";
            setLanguage(value??"en");
        } catch(e) {

        }
    }

    const tr = (data : string) : string =>  {
        return i18n.t(data);
    }

    // const addLanguageJson = async () => {
    //     await firestore().collection("translations").doc("json").set(translation);
    // }

    const storeLanguage = async (value : string) => {
        try {
            await AsyncStorage.setItem("language", value);
        
        } catch (e) {
            // saving error
            
        }
    }

    const userChangeLanguage = async (langCode : string) => {

        setLanguage(langCode.toLowerCase());
        i18n.locale = langCode;
        await storeLanguage(langCode.toLowerCase());
    }

    useEffect(() => {
        i18n.fallbacks = true;
        const subscriber = firestore()
        .collection('translations')
        .doc('json')
        .onSnapshot(documentSnapshot => {
            var map = documentSnapshot.data();
            if(map != null || map != undefined) {
               getLanguage(map);
            }
        });
       
        // addLanguageJson();
        return () => subscriber();
    }, []);

    return (
        <LanguageContext.Provider value={{language,tr,userChangeLanguage}}>
            {children}
        </LanguageContext.Provider>
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
export default LanguageManager;
