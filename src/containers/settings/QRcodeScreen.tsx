//import liraries
import { Image, VStack, Stack } from 'native-base';
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Platform, TouchableOpacity } from 'react-native';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import { deviceWidth, deviceHeight } from '../../styles/index';
import { whiteColor, whiteSmoke } from '../../config/colors';
import { bgQRcode } from '../../temp_data/ThemeBackground';
import { FlatListHorizontal, makeid, UserAvatar } from '../../customs_items/Components';
import { main_padding } from '../../config/settings';
import QRCode from 'react-native-qrcode-svg';

// create a component
const QRcodeScreen = () => {

    const [theme, setTheme] = useState(bgQRcode[0])
    const handleSelecteTheme = (item: any) => {
        setTheme(item)
    }

    useEffect(() => {
        // reactotron.log({ '====':  Appearance.getColorScheme() })
    }, []);



    const _renderThemes = ({ item, index }: any) => {
        return (
            <TouchableOpacity
                onPress={() => handleSelecteTheme(item)}
                style={{
                    width: 80, height: 100, borderRadius: 7,
                    marginLeft: index > 0 ? 10 : 0,
                    borderWidth: theme.themurl == item.themurl ? 3 : 0,
                    borderColor: theme.textColor, overflow: 'hidden'
                }}
            >
                <Image source={{
                    uri: item.themurl
                }} alt="image" width={80} height={100} style={{ overflow: 'hidden', borderRadius: 7 }} />
            </TouchableOpacity>
        )
    };
    return (
        <BaseComponent {...baseComponentData} title='QR Code'>
            <View style={styles.container}>
                <VStack justifyContent='space-between'>
                    <View style={{ width: deviceWidth, height: deviceHeight / 1.7 }}>
                        <ImageBackground source={{ uri: theme.themurl }} resizeMode="cover" style={{ width: deviceWidth, height: deviceHeight / 1.6, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                                width: 250, height: 250, backgroundColor: theme.textColor,
                                borderRadius: 25, justifyContent: 'center', alignItems: 'center',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 8,
                                },
                                shadowOpacity: 0.46,
                                shadowRadius: 11.14,
                                elevation: 17,
                            }}>
                                <View style={{padding: main_padding-5 ,borderRadius: 10, backgroundColor: whiteSmoke, marginTop: main_padding}}>
                                    <QRCode
                                        value="@chSoheng"
                                        logo={require('./../../assets/profile.png')}
                                        logoSize={30}
                                        logoBackgroundColor='transparent'
                                    />
                                </View>
                                
                                <View style={{ marginTop: main_padding + 10 }}>
                                    <Text style={{ fontFamily: 'lato', fontSize: 17, fontWeight: '700', color: whiteColor }}>@CHSOHENG</Text>
                                </View>
                            </View>
                            <UserAvatar style={{ position: 'absolute', top: 90, left: '38%', width: 100, height: 100 }}>
                                <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                            </UserAvatar>
                        </ImageBackground>
                    </View>
                    <View style={{ backgroundColor: whiteColor, borderTopLeftRadius: 25, borderTopRightRadius: 25, height: deviceHeight / 2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}>
                        <View style={{ padding: main_padding + 10 }}>
                            <Text style={{ fontFamily: 'lato', fontSize: 15 }}>THEMES QRCODE</Text>
                        </View>
                        <FlatList
                            listKey={makeid()}
                            showsHorizontalScrollIndicator={false}
                            removeClippedSubviews={Platform.OS === 'ios' ? false : true}
                            horizontal
                            data={bgQRcode}
                            renderItem={_renderThemes}
                            keyExtractor={(_, index) => index.toString()}
                        />
                    </View>
                </VStack>
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
export default QRcodeScreen;
