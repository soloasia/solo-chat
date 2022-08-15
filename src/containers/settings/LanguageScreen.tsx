//import liraries
import { Center, Divider, HStack } from 'native-base';
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { baseColor, boxColor, chatText, textColor, whiteColor } from '../../config/colors';
import { main_padding } from '../../config/settings';
import { FlatListVertical, TextItem } from '../../customs_items/Components';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import { data } from '../../temp_data/Language';

// create a component
const LanguageScreen = () => {

    const [languageData, setLanguageData] = useState<any>();
    const [selectedIndex,setSelectedIndex] = useState(0);
    const selectedLanguage = (index : number) => {
        setSelectedIndex(index);
    }

    const _renderItem = ({item,index}:any) => {
        return (
            <TouchableOpacity onPress={() => selectedLanguage(index)}>
                <HStack justifyContent={'space-between'} flex={1} style ={{alignItems : 'center',margin : 0}}>
                    <View>
                        <Text style = {{fontWeight: 'bold',fontSize : 16, fontFamily: 'lato'}}>{item.name}</Text> 
                        <View style = {{height: 4}}></View>
                        <Text style ={{color: chatText,fontSize : 14, fontFamily: 'lato'}}>{item.language}</Text> 
                    </View>
                    { index == selectedIndex ? <Ionicons name={'checkmark-circle'} size={25} style={{color:baseColor}}/> : <></>}
                </HStack>
                {
                  index == data.length - 1 ? <></> : <Divider marginTop={main_padding} marginBottom={main_padding} color={boxColor} _light={{ bg: boxColor}} _dark={{bg:whiteColor}}/>
                }
            </TouchableOpacity>
        )
    }

    useEffect(() => { 
        setLanguageData(data);
    }, []);

    return (
        <BaseComponent {...baseComponentData} title={'Language'} is_main={false} >
            <View style ={styles.container}>
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


