import { Box } from 'native-base';
import React from 'react'
import { StyleSheet, TouchableOpacity, View,Image,Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import colors, { baseColor, whiteColor, whiteSmoke } from '../config/colors';
import style, { activeOpacity, deviceWidth } from '../styles';
import { TextItem } from './Components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface propsType {
    title: string,
    rightIcon: any | undefined,
    is_main: boolean
}
export const headerData: propsType = {
    title: '',
    rightIcon: undefined,
    is_main: false
};

const ScreenHeader: React.FC<propsType> = (props) => {
    const { title, rightIcon, is_main } = props;
    const insets = useSafeAreaInsets();
    const navigate:any = useNavigation();
    return (
        <View style={[styles.header, {flexDirection:'row',alignItems:'center'}]}>
            {is_main  ?
                <View style={[style.buttonHeader]}>
                    <Text style={[style.pBold,{fontSize:25}]}>{title}</Text>
                </View>
            :  title !='Log In' && title !='Sign Up'?
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={()=>navigate.goBack()}
                    style={[style.buttonHeader]}>
                    <Ionicons name='chevron-back' size={25} color={colors.textColor} />
                </TouchableOpacity>
            :<View style={{width: 50 }}/>}
            <TextItem style={[style.pBold, styles.title, {textAlign: 'center'}]} numberOfLines={1}>{is_main? '':title}</TextItem>
            {rightIcon ? rightIcon() :
                <Box
                    style={{
                        width: 50
                    }}
                />
            }
        </View>
    )
}
export default React.memo(ScreenHeader);

const styles = StyleSheet.create({
    header: {
        minHeight: 50,
        width: deviceWidth,
        backgroundColor: whiteColor,
        paddingHorizontal: 15,
    },
    title: {
        flex: 1,
        fontSize: 18,
        color: colors.textColor,
    },
    badge: {
        position: 'absolute',
        zIndex: 1,
        elevation: 1,
        right: 10,
        top: 5
    },
    headerLogo:{
        height:30,
        width:80
    }
})