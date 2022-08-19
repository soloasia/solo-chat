//import liraries
import { AspectRatio, Box, Center, Heading, HStack, Icon, Image, Slider, Stack, Text } from 'native-base';
import React, { Component, useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Platform, Appearance } from 'react-native';
import BaseComponent, { baseComponentData } from '../../functions/BaseComponent';
import { main_padding } from '../../config/settings';
import { textDesColor, startBtn, whiteSmoke, bgChat, baseColor, backgroundDark, borderDivider } from '../../config/colors';
import { FlatListHorizontal, makeid } from '../../customs_items/Components';
import { themeData } from '../../temp_data/ThemeBackground';
import { deviceWidth } from '../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { appearance, textSize } from '../../actions/appearanceAction';
import reactotron from 'reactotron-react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import _ from 'lodash';
import { ThemeContext } from '../../utils/ThemeManager';
import themeStyle from '../../styles/theme';

// create a component
const AppearanceScreen = () => {
    const textsize = useSelector((state: any) => state.textSizeChange);
    const appearanceTheme = useSelector((state: any) => state.appearance);
	const {theme} : any = useContext(ThemeContext);

    const [themeAppearance, setTheme] = useState(_.isEmpty(appearanceTheme) ? themeData[0] : appearanceTheme)
    const dispatch: any = useDispatch();
    const [size, setSize] = useState(textsize != false ? textsize : 13)

    const handleSelecteTheme = (item: any) => {
        setTheme(item)
        dispatch(appearance(item))
    }

    // useEffect(() => {
    //     reactotron.log({ '====':  Appearance.getColorScheme() })

    //   }, []);
    


    const _renderThemes = ({ item, index }: any) => {
        return (
            <TouchableOpacity
                onPress={() => handleSelecteTheme(item)}
                style={{
                    width: 80, height: 102, borderRadius: 7,
                    marginLeft: index > 0 ? 10 : 0,
                    borderWidth: themeAppearance.themurl == item.themurl ? 3 : 0,
                    borderColor: themeAppearance.textColor, overflow: 'hidden'
                }}
            >
                <Image source={{
                    uri: item.themurl
                }} alt="image" width={80} height={100} style={{ overflow: 'hidden', borderRadius: 7 }} />
            </TouchableOpacity>
        )
    };

    const textsizeChange = (value: any) => {
        setSize(value);
        dispatch(textSize(value))
    }

    return (
        <BaseComponent {...baseComponentData} title='Appearance'>
            <View style={{ paddingVertical: main_padding }}>
                <View style={{ paddingVertical: main_padding - 5, paddingHorizontal: main_padding + 5 }}>
                    <Text color={textDesColor} fontSize='xs' fontFamily='lato'>THEME CHAT</Text>
                </View>
                <Box alignItems="center">
                    <Box maxW="90%" rounded="lg" overflow="hidden"
                        borderColor={borderDivider} borderWidth="1"
                        backgroundColor={themeStyle[theme].backgroundColor}
                       
                    >
                        <Box>
                            <AspectRatio w="100%" ratio={16 / 8}>
                                <Image source={{
                                    uri: themeAppearance.themurl
                                }} alt="image" />
                            </AspectRatio>
                            <View style={{ position: 'absolute', backgroundColor: '#ECF1FDE7', top: 7, left: 10, ...styles.chatBody, borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderTopRightRadius: 15 }}>
                                <View style={{ ...styles.chatBack }}>
                                    <Text style={{ fontFamily: 'lato', fontSize: size }}>Good Morning!Good Morning!</Text>
                                    <Text style={{ fontFamily: 'lato', fontSize: size }}>Good Morning!</Text>
                                </View>
                            </View>
                            <View style={{ position: 'absolute', backgroundColor: themeAppearance.textColor, top: 100, right: 10, ...styles.chatBody, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <View style={{ ...styles.chatBack }}>
                                    <Text color='text.50' fontSize={size}>Good Morning! Morning!</Text>
                                </View>
                            </View>
                        </Box>
                        <Stack p="4" space={3}>
                            <View style={{ height: 120 }}>
                                <FlatList
                                    listKey={makeid()}
                                    showsHorizontalScrollIndicator={false}
                                    removeClippedSubviews={Platform.OS === 'ios' ? false : true}
                                    horizontal
                                    data={themeData}
                                    renderItem={_renderThemes}
                                    keyExtractor={(_, index) => index.toString()}
                                />
                            </View>
                        </Stack>
                    </Box>
                </Box>
                <View style={{ paddingVertical: main_padding, paddingHorizontal: main_padding + 5 }}>
                    <Text color={textDesColor} fontSize='xs' fontFamily='lato'>TEXT SIZE  ({size}pixels)</Text>
                </View>
                <Box alignItems="center">
                    <Box maxW="90%" rounded="lg" overflow="hidden"
                        borderColor={borderDivider} borderWidth="1"
                        backgroundColor={themeStyle[theme].backgroundColor}
                       
                    >
                        <Stack p="4" space={3}>
                            <View style={{ width: deviceWidth, flexDirection: 'row', paddingVertical: 5 }}>
                                <Text style={{ marginRight: 15, fontSize: 13, fontFamily: 'lato' }}>A</Text>
                                <Slider maxW="300" defaultValue={size}
                                    minValue={13} colorScheme={baseColor}
                                    maxValue={23} accessibilityLabel="text size"
                                    step={1}
                                    onChange={(value) => textsizeChange(value)}
                                >
                                    <Slider.Track >
                                        
                                        <Slider.FilledTrack bg={baseColor} />
                                    </Slider.Track>
                                    <Slider.Thumb bg={baseColor} size={5} />
                                </Slider>
                                <Text style={{ paddingLeft: 10, fontSize: 23, fontFamily: 'lato' }}>A</Text>
                            </View>
                        </Stack>
                    </Box>
                </Box>
            </View>
        </BaseComponent>
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
    chatBody: {
        transform: [{ scaleY: 1 }],
        paddingHorizontal: 10,
        marginTop: 10,

    },
    chatBack: {
        maxWidth: deviceWidth / 1.3,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginVertical: 1,
        overflow: 'hidden',
    },
});

//make this component available to the app
export default AppearanceScreen;
