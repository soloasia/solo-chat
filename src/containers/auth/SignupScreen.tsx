import { HStack, useToast } from 'native-base';
import React, { useState } from 'react'
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const SignupScreen = (props: any) => {
    return (
        <View>
        </View >
    )
}

export default SignupScreen;

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#ffff',
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 45,
        color: "#aaa",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
    },
    icon: {
        paddingHorizontal: 5,
    },
})
