import React, { useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Actionsheet } from 'native-base'
import ImagePicker from 'react-native-image-crop-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { textColor, startBtn, backgroundDark, whiteSmoke } from '../config/colors';
import { deviceWidth } from '../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../utils/ThemeManager';
import { TextItem } from './Components';


const SelectImagePicker = ({ visible, onChange, onClose,photo }:any) => {
    const { theme }: any = useContext(ThemeContext);

    const onSelectImage = (type:any) => {
        ImagePicker.openPicker(
            {
                mediaType: 'photo',
                includeBase64: true
            }).then(async images =>{
                    onClose();
                    onChange(images);
                }
            )
    }
    const onCamera = () => {
        ImagePicker.openCamera(
            {
                mediaType: 'photo',
                includeBase64: true
            }).then(images =>{
                onClose()
                onChange(images);
            }
        )
    }
    return (
        <Actionsheet isOpen={visible} onClose={onClose} >
            <Actionsheet.Content style={{backgroundColor: theme=='dark' ? backgroundDark:whiteSmoke}}>
                <TextItem style={[{
                    color:textColor,
                    fontSize: 16,
                    textAlign: 'center',
                    marginBottom: 5,
                }]}>Choose an image</TextItem>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onCamera}
                    style={styles.buttonChooseImage}>
                    <Ionicons name='camera-outline' size={22} color={'#7C7C7C'} />
                    <TextItem style={[styles.textChooseImage]}>Camera</TextItem>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onSelectImage("image")}
                    style={styles.buttonChooseImage}>
                    <MaterialIcons name='photo-size-select-actual' size={22} color={startBtn} />
                    <TextItem style={[styles.textChooseImage]}>Gallery</TextItem>
                </TouchableOpacity>
            </Actionsheet.Content>
        </Actionsheet>
    )
}

export default SelectImagePicker

const styles = StyleSheet.create({
    buttonChooseImage: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 10,
        width: deviceWidth
    },
    textChooseImage: {
        color: '#757373',
        marginLeft: 10,
        fontSize: 15,
        // fontFamily: 'lato'
    },
})
