//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as RNLocalize from "react-native-localize";
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const en = {
    language: "Language"
};
const zh = {
    language: "语"
};
const ar = {
    language: "لغة"
};
const th = {
    language: "ภาษา"
};

// create a component
const LanguageManager = ({children} : any) => {
    const getLanguage = async () => {
        i18n.translations = {en, zh, ar, th};
        try {
            const value = await AsyncStorage.getItem("language")
            if(value != null) {
                i18n.locale = value ?? "en";
            }
        } catch(e) {
            // error reading value
        }
    }
    useEffect(() => {
        i18n.fallbacks = true;
        getLanguage();
    }, []);

    return (
        <>
            {children}
        </>
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
