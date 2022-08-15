//import liraries
import { Image, VStack, Stack, Icon } from 'native-base';
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Platform, TouchableOpacity } from 'react-native';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import style, { deviceWidth, deviceHeight } from '../../styles/index';
import { whiteColor, whiteSmoke, bgChat, textDesColor } from '../../config/colors';
import { bgQRcode } from '../../temp_data/ThemeBackground';
import { FlatListHorizontal, makeid, UserAvatar } from '../../customs_items/Components';
import { main_padding } from '../../config/settings';
import QRCode from 'react-native-qrcode-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

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

    // const rightIcon = () => {
    //     return (
    //         <TouchableOpacity style={style.containerCenter}>
    //             <Icon name='share-social' as={Ionicons} size='lg' />
    //             {/* <UserAvatar style={{width:35,height:35}}>
    //                 <Image source={require('../../assets/profile.png')} resizeMode='cover' style={{width:'100%',height:'100%'}}/>
    //             </UserAvatar> */}
    //         </TouchableOpacity>
    //     )
    // }
    return (
        <BaseComponent {...baseComponentData} title='QR Code'>
            <View style={styles.container}>
                <VStack justifyContent='space-between'>
                    <View style={{ width: deviceWidth, height: deviceHeight / 1.2, alignItems: 'center', justifyContent: 'center', }}>
                        {/* <ImageBackground source={{ uri: theme.themurl }} resizeMode="cover" style={{ width: deviceWidth, height: deviceHeight / 1.6, justifyContent: 'center', alignItems: 'center' }}> */}
                        <View style={{
                            width: deviceWidth * .8, height: deviceHeight * .45, backgroundColor: whiteSmoke,
                            borderRadius: 25, justifyContent: 'center', alignItems: 'center',
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.18,
                            shadowRadius: 1.00,

                            elevation: 1,
                        }}>
                            <View style={{ padding: main_padding, borderRadius: 10, backgroundColor: bgChat, marginTop: main_padding }}>
                                <QRCode
                                    value="@chSoheng"
                                    // logo={require('./../../assets/profile.png')}
                                    logoSize={30}
                                    size={200}
                                    logoBackgroundColor='transparent'
                                />
                            </View>

                            <View style={{ marginTop: main_padding + 10 }}>
                                <Text style={{ fontFamily: 'lato', fontSize: 17, fontWeight: '700', color: textDesColor }}>@CHSOHENG</Text>
                            </View>
                        </View>
                        <LinearGradient
                            colors={['#F3AE2D', '#F0DF48', '#4B38F7D2', '#3276F5F3', '#0099FF']}
                            start={{ x: 0, y: 0 }}

                            end={{ x: 1, y: 1 }}
                            style={{ marginTop: 15, width: 105, borderRadius: 100, height: 105, position: 'absolute', top: '14%', left: '38%' }}
                        >
                            <View style={{ margin: 1.5, backgroundColor: whiteColor, justifyContent: 'center', borderRadius: 100, width: 102, height: 102, }}>
                                <Image source={require('./../../assets/profile.png')} resizeMode='cover' style={{ borderRadius: 100, width: 102, height: 102, overflow: 'hidden' }} />
                            </View>
                        </LinearGradient>
                        {/* </ImageBackground> */}
                    </View>
                    {/* <View style={{ backgroundColor: whiteColor, borderTopLeftRadius: 25, borderTopRightRadius: 25, height: deviceHeight / 2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}>
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
                    </View> */}
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
