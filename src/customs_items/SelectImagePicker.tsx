import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Actionsheet } from 'native-base'
import ImagePicker from 'react-native-image-crop-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { textColor, startBtn } from '../config/colors';
import { deviceWidth } from '../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';


const SelectImagePicker = ({ visible, onChange, onClose,photo }:any) => {
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
        <Actionsheet isOpen={visible} onClose={onClose}>
            <Actionsheet.Content>
                <Text style={[{
                    color:textColor,
                    fontSize: 16,
                    textAlign: 'center',
                    marginBottom: 5,fontFamily: 'lato'
                }]}>Choose an image</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onCamera}
                    style={styles.buttonChooseImage}>
                    <Ionicons name='camera-outline' size={22} color={'#534C4C'} />
                    <Text style={[styles.textChooseImage]}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onSelectImage("image")}
                    style={styles.buttonChooseImage}>
                    <MaterialIcons name='photo-size-select-actual' size={22} color={startBtn} />
                    <Text style={[styles.textChooseImage]}>Gallery</Text>
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
        fontFamily: 'lato'
    },
})
