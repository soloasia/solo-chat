//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import { main_padding } from '../../config/settings';
import { FlatListHorizontal, makeid } from '../../customs_items/Components';
import { deviceWidth } from '../../styles/index';
import { textDesColor, whiteColor, baseColor, whiteSmoke, textColor } from '../../config/colors';
import MediaWidget from '../../components/MediaWidget';
import FileWidget from '../../components/FileWidget';

const listheadertext = ['Media', 'Files', 'Links']

const MediaFilesScreen = () => {
    const [headerIdx, setHeaderIdx] = useState(0)

    const _renderItem = ({ item, index }: any) => {
        return (
            <View style={{ width: deviceWidth / 3.5, marginLeft: index == 0 ? 5 : 10 }}>
                <TouchableOpacity
                    onPress={() => setHeaderIdx(index)}
                    style={{
                        backgroundColor: index == headerIdx ? baseColor : whiteColor,
                        borderRadius:20 ,
                        alignItems: 'center', padding: 5
                    }}
                >
                    <Text style={{ fontSize: 14, fontFamily: 'lato', fontWeight: index == headerIdx ? 'bold' : 'normal', color: index == headerIdx ? whiteSmoke : textColor }}>{item.toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
        )
    }

   

    return (
        <BaseComponent {...baseComponentData} title='Media, files & links'>
            <View style={{ flex: 1,paddingHorizontal: main_padding, marginTop: main_padding - 5 }}>
                <View style={{marginBottom: main_padding}}>
                    <FlatListHorizontal
                        listKey={makeid()}
                        renderItem={_renderItem}
                        data={listheadertext}
                    />
                </View>
                
                <View style={{ paddingTop: main_padding - 5, flex: 1 }}>
                    {headerIdx == 0 ? 
                        <MediaWidget /> 
                    : headerIdx == 1 ?
                        <FileWidget />
                    : <View></View>}
                </View>
            </View>
        </BaseComponent>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});

//make this component available to the app
export default MediaFilesScreen;
