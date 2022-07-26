//import liraries
import { useNavigation } from '@react-navigation/native';
import React, { Component, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { borderDivider, whiteColor } from '../config/colors';
import { TextItem } from '../customs_items/Components';
import { loadData } from '../functions/LoadData';
import style, { deviceWidth } from '../styles';
import themeStyle from '../styles/theme';
import { ThemeContext } from '../utils/ThemeManager';
import { main_padding } from '../config/settings';

// create a component
const ChatHeader = (props: any) => {
    const { title, rightIcon,onPress} = props
    const {theme} : any = useContext(ThemeContext);
    const navigate:any = useNavigation();
    const dispatch: any = useDispatch();

    const handleBack = () => {
        navigate.reset({
            index: 0,
            routes: [{ name: 'Main' }]
        })
    }
    return (
        <View style={[styles.header, { flex:1,flexDirection: 'row',alignItems:'center',backgroundColor: themeStyle[theme].backgroundColor,justifyContent: 'space-between'}]}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleBack} style={[style.buttonHeader, {width: '20%', alignItems: 'flex-start'}]}>
                <Ionicons name='chevron-back' size={28} color={themeStyle[theme].textColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress} style={{flexDirection: 'row',alignItems: 'center', width: '80%', justifyContent: 'space-between'}}>
                <TextItem style={[style.pBold, styles.title, { fontSize: 16,color: themeStyle[theme].textColor,textAlign: 'center', paddingRight: main_padding*2}]} numberOfLines={1}>{title}</TextItem>
                {rightIcon() }
            </TouchableOpacity>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    header: {
        minHeight: 60,
        width: deviceWidth,
        paddingHorizontal: 15,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontFamily: 'Montserrat-Bold'
    },
    badge: {
        position: 'absolute',
        zIndex: 1,
        elevation: 1,
        right: 10,
        top: 5
    },
    headerLogo: {
        height: 30,
        width: 80
    }
});

//make this component available to the app
export default ChatHeader;
