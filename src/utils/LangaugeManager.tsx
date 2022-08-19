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
    },
    zh : {
        language: "语",
        settings : "设置",
        edit: "Edit",
        dark_mode : "Dark Mode",
        qr_code : "QR Code",
        notification : "Notification",
        appearance : "Appearance",
        privacy : "Privacy",
    },
    ar : {
        language: "لغة",
        settings : "إعدادات",
        edit: "Edit",
        dark_mode : "Dark Mode",
        notification : "Notification",
        appearance : "Appearance",
        privacy : "Privacy",
    },
    th : {
        language: "ภาษา",
        settings : "การตั้งค่า",
        edit: "Edit",
        dark_mode : "Dark Mode",
        notification : "Notification",
        appearance : "Appearance",
        privacy : "Privacy",
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
            // i18n.locale = value ?? "en";
            setLanguage(value??"en");
        } catch(e) {

        }
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
        console.log(langCode);
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
        <LanguageContext.Provider value={{language,userChangeLanguage}}>
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
