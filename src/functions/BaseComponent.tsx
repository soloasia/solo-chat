import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Box } from 'native-base'
import React, { useContext, useState } from 'react'
import { ReactNode } from 'react'
import { BackHandler, InteractionManager, KeyboardAvoidingView, Platform, StyleSheet, View,Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {  baseColor, whiteColor, whiteSmoke } from '../config/colors'
import ScreenHeader, { headerData } from '../customs_items/ScreenHeader'
import { style } from '../styles'
import themeStyle from '../styles/theme'
import { ThemeContext } from '../utils/ThemeManager'

interface propsType {
    title: string | null,
    data: any,
    loading: boolean,
    rightIcon: any,
    children: ReactNode,
    is_main: boolean,
    is_background: boolean
}

export const baseComponentData: propsType = {
    title: null,
    data: undefined,
    loading: false,
    rightIcon: undefined,
    children: null,
    is_main: false,
    is_background: false
};

const BaseComponent: React.FC<propsType> = (props) => {
    const insets = useSafeAreaInsets()
    const [IsReady, setIsReady] = useState(false)
    const navigate:any = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (props.is_main)
                    return false;
                else {
                    navigate.goBack();
                    return true;
                }
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            if (props.is_background) {
                const task = InteractionManager.runAfterInteractions(() => {
                    setIsReady(true)
                });
                return () => {
                    task.cancel();
                    BackHandler.removeEventListener('hardwareBackPress', onBackPress);
                }
            }
            else {
                setIsReady(true)
            }
        }, [])
    );
    
    const {theme} : any = useContext(ThemeContext);
   
    const renderItem = () => {
        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.OS === "ios" ? 15 :0}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.mainContainer,{backgroundColor : themeStyle[theme].backgroundColor}]}
            >
                <View style={styles.container}>
                    <ScreenHeader
                        {...headerData}
                        title={props.title? props.title:''}
                        rightIcon={props.rightIcon}
                        is_main={props.is_main}
                    />
                    {props.data === null || !IsReady ? (props.loading ?
                        <View /> : null) :
                        props.children
                    }
                </View>
            </KeyboardAvoidingView>
        )
    }
    return (
        <View style={style.flexContainer}>
            {renderItem()}
        </View>
    )
}

export default React.memo(BaseComponent)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40
    },
    mainContainer: {
        flex: 1,
        // backgroundColor: whiteColor
        // backgroundColor: whiteSmoke
    }
})
