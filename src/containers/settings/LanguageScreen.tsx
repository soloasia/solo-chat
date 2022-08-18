//import liraries
import { useTheme } from '@react-navigation/native';
import { Center, Divider, HStack } from 'native-base';
import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { baseColor, boxColor, chatText, textColor, whiteColor } from '../../config/colors';
import { main_padding } from '../../config/settings';
import { FlatListVertical, TextItem } from '../../customs_items/Components';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import { data } from '../../temp_data/Language';
import firestore from '@react-native-firebase/firestore';
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// create a component
const LanguageScreen = () => {
    const [languageData, setLanguageData] = useState<any>([]);
    const [selectedIndex,setSelectedIndex] = useState(0);
    const selectedLanguage = async (index : number) => {
        setSelectedIndex(index);
        console.log(languageData[index].code);
        i18n.locale = languageData[index].code.toLowerCase();
        await storeLanguage(languageData[index].code.toLowerCase());
    }

    const storeLanguage = async (value : string) => {
        try {
            await AsyncStorage.setItem("language", value);
        
        } catch (e) {
            // saving error
            
        }
    }
    const _renderItem = ({item,index}:any) => {
        return (
            <TouchableOpacity onPress={() => selectedLanguage(index)}>
                <HStack justifyContent={'space-between'} flex={1} style ={{alignItems : 'center',margin : 0}}>
                    <View>
                        <TextItem style = {{fontWeight: 'bold',fontSize : 14}}>{item.label}</TextItem> 
                        <View style = {{height: 4}}></View>
                        <TextItem style ={{color: chatText,fontSize : 12, textTransform: 'uppercase'}}>{item.code}</TextItem> 
                    </View>
                    { index == selectedIndex ? <Ionicons name={'checkmark-circle'} size={25} style={{color:baseColor}}/> : <></>}
                </HStack>
               <Divider marginTop={main_padding} marginBottom={main_padding} color={boxColor} _light={{ bg: boxColor}} _dark={{bg:whiteColor}}/>
            </TouchableOpacity>
        )
    }

    const getLanguage = async () => {
        try {
            const value = await AsyncStorage.getItem("language");
            if(value != null) {
                console.log("value",value);
                console.log("language data",languageData.length);
                if(languageData.length > 0) {
                    const result = languageData.find((e : any) => e.code.toLowerCase() == value.toLowerCase());
                    console.log("result",result);
                    const index = languageData.indexOf(result);
                    console.log("language index: ",index);
                    setSelectedIndex(index);
                }
              
            }
        } catch(e) {
            // error reading value
        }
    }

    useEffect(() => { 
        const subscriber = firestore()
        .collection('translations')
        .doc('languages')
        .onSnapshot(documentSnapshot => {
            var lang = documentSnapshot.data();
            if(lang != null || lang != undefined) {
                setLanguageData(lang["language"]);
                console.log("language data",languageData.length);
                getLanguage();
            }
            
        });
      return () => subscriber();
    }, []);
    
    return (
        <BaseComponent {...baseComponentData} title={i18n.t('language')} is_main={false} >
            <View style ={[styles.container,{}]}>
            {/* <TextItem>{i18n.t('language')}</TextItem> */}
            <FlatListVertical
                style={{paddingTop : main_padding}}
                data={languageData}
                renderItem={_renderItem}
            />
            </View>
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    checkMarkCircle: {
        width: 30,
        height: 30,
        borderRadius: 30/2,
        backgroundColor : baseColor,
        alignItems : 'center'
    },
    container: {
        margin : main_padding,
        // borderRadius: 10,
        // backgroundColor: "white",
        // borderWidth : 0.5,
        // borderColor : 'lightgrey',
        // alignContent :'center'
    },
});

//make this component available to the app
export default LanguageScreen;


