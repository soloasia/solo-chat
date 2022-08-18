import React, { useContext, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { boxColor } from '../config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { activeOpacity, main_padding } from '../config/settings';
import style from '../styles';
import { ThemeContext } from '../utils/ThemeManager';
import { color } from 'react-native-reanimated';
import themeStyle from '../styles/theme';
const SearchBox = (props:any) => {
    const {onChangeText,onSearch } = props
    const [state, setstate] = useState("");
    const {theme} : any = useContext(ThemeContext);
	return (
		<View style={styles.headerContainer}>
            <View style={{...styles.searchBox,backgroundColor : themeStyle[theme].primary}}>
                <TouchableOpacity onPress={onSearch} activeOpacity={activeOpacity}>
                    <Ionicons style={styles.searchIcon} name="search" />
                </TouchableOpacity>
                <TextInput
                    style={[style.p,{flex:1,color: themeStyle[theme].textColor}]}
                    returnKeyType="search"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={'#ADB9C6'}
                    placeholder={"Search"}
                    onChangeText={(value) => {
                        onChangeText(value)
                        setstate(value);
                    }}
                />
                {
                    state && <TouchableOpacity onPress={()=>console.log("clear")} activeOpacity={activeOpacity}>
                        <Ionicons style={styles.searchIcon} name="close-circle"/>
                    </TouchableOpacity>
                }
            </View>
        </View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
        backgroundColor:'red'
	},
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: main_padding

    },
    searchIcon: {
        fontSize: 22,
        marginHorizontal: 8,
        color: '#ADB9C6'
    },
    searchBox: {
        height: 45,
        width: '100%',
        borderRadius: 50,
        flexDirection: 'row', 
        alignItems: 'center',
    },
    textbox: {
        margin: 0,
        flex: 1,
        color: '#000'
    },
    searchDetailContainer: {
        margin: 8
    },
});

export default SearchBox;