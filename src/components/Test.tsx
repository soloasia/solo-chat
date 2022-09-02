import { View } from 'native-base';
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { main_padding } from '../config/settings';

const logo = {
  uri: 'https://reactnative.dev/img/tiny_logo.png',
  width: 64,
  height: 64
};

const Test = () => (
    <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView>
            <View style={{padding:main_padding}}>
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
                    <Image source={logo} />
            </View>
        </ScrollView>
  </KeyboardAvoidingView>
);

export default Test;