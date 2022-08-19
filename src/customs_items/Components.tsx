import { AlertDialog, HStack, Modal, Toast,Button as NButton, } from "native-base";
import React, { ReactNode, useCallback, useContext, useRef } from "react";
import { FlatList, Platform, StyleSheet, Text, TextInputProps, TextProps, TouchableOpacity, TouchableOpacityProps, TouchableWithoutFeedback, View } from "react-native";
import style, { activeOpacity } from "../styles";
import FontAwsome from 'react-native-vector-icons/FontAwesome'
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors, { baseColor, borderColor, boxColor, buttonColor, buttonSecondColor, greyDark, textColor, textSecondColor, whiteColor, whiteSmoke } from "../config/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeContext } from "../utils/ThemeManager";
import themeStyle from "../styles/theme";

export const makeid = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+<>?:|.,";

    for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export const TextItem = (props: TextProps | ReactNode | any) => {
    const {theme} : any = useContext(ThemeContext);
    return (
        <Text
            {...props}
            style={[style.p, style.textChoose, props.style,{color : themeStyle[theme].textColor}]}>{props.children}</Text>
    )
}
export const CardItem = (props: any) => {
    return (
        <TouchableOpacity
            {...activeOpacity}
            style={styles.columnItem}
            onPress={props.onPress}>
            {props.children}
        </TouchableOpacity>
    )
}

export const UserAvatar = (props: any) => {
    return (
        <View  style={[styles.userAvatar,props.style]}>
            {props.children}
        </View>
    )
}


export const CardItemRow = (props: any) => {
    return (
        <TouchableOpacity
            {...activeOpacity}
            style={styles.rowItem}
            onPress={props.onPress}>
            <HStack alignItems="center">
                {props.leftIcon}
                {props.children}
            </HStack>
            {props.showRightIcon && <Feather name="chevron-right" size={20} color="#555" />}
        </TouchableOpacity>
    )
}


export function FlatListScroll(props:any) {
    return (
      <FlatList
        {...props}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'ios' ? false : true}
        data={['dumy']}
        renderItem={() => {
          return props.children;
        }}
        bounces={false}
        scrollEventThrottle={16}
        ListEmptyComponent={null}
        ListHeaderComponent={null}
        ItemSeparatorComponent={props.devide}
        keyExtractor={(_, index) => index.toString()}
      />
    );
  }
  export function FlatListVertical(props:any) {
    return (
      <FlatList
        {...props}
        listKey={makeid()}
        cellKey={makeid()}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'ios' ? false : true}
        data={props.data}
        scrollEventThrottle={16}
        onEndReachedThreshold={0.01}
        renderItem={props.renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
    );
  }
  export function FlatListHorizontal(props:any) {
    return (
      <FlatList
        {...props}
        listKey={makeid()}
        cellKey={makeid()}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'ios' ? false : true}
        horizontal
        data={props.data}
        // bounces={false}
        scrollEventThrottle={16}
        renderItem={props.renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
    );
  }

  export function CustomsModal(props:any) {
    return (
        <Modal isOpen={props.isOpen} onClose={props.isClose}>
            <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>{props.title}</Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
  }

  export const AlertBox = (props: any) => {
    const cancelRef = React.useRef(null);
    return (
        <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={props.isOpen}
            onClose={props.onCloseAlert}
        >
            <AlertDialog.Content>
                <AlertDialog.Header>
                    <Text style={style.pBold}>{props.title}</Text>
                </AlertDialog.Header>
                <AlertDialog.Body>
                    <TextItem>{props.des}</TextItem>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                    <NButton
                        style={{backgroundColor:greyDark}}
                        _text={{
                            ...style.p,
                            color: textColor
                        }}
                        onPress={props.onCloseAlert}>
                        {props.btn_cancle}
                    </NButton>
                    <NButton
                        style={{backgroundColor:baseColor}}
                        _text={{
                            ...style.p,
                            color: whiteSmoke
                        }} onPress={props.onConfirm} ml={3}>
                        {props.btn_name}
                    </NButton>
                </AlertDialog.Footer>
            </AlertDialog.Content>
            
        </AlertDialog>
    )
}

  export const Footer = () => {
    const insets = useSafeAreaInsets()
    return (
        <View style={{
            height: insets.bottom > 0 ? (insets.bottom + 15):70
        }} />
    )
}

  export const ToastStatus = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
  };
  export const showToast = (title:any, status:any, duration:any) => {
    return Toast.show({
      title: title,
      duration: duration,
    //   status: status,
    });
  }
const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 50 / 2,
        marginTop: 20,
        backgroundColor: buttonColor
    },
    buttonSecond: {
        height: 50,
        borderRadius: 50 / 2,
        marginTop: 20,
        backgroundColor: buttonSecondColor
    },
    buttonText: {
        color: whiteColor,
        fontSize: 16
    },
    buttonCreate: {
        width: 'auto',
        alignSelf: 'center',
        paddingHorizontal: 30,
        backgroundColor: whiteColor
    },
    title: {
        color: textSecondColor,
        fontSize: 15,
        marginHorizontal: 5,
    },
    buttonSmallCreate: {
        marginTop: 0,
        alignSelf: 'flex-start',
        paddingHorizontal: 0,
        paddingVertical: 0,
        height: 30,
        marginLeft: 10
    },
    currency: {
        color: colors.discountColor,
        fontSize: 15,
        marginHorizontal: 5
    },
    bottomSheet: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.20,
        shadowRadius: 4.65,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        elevation: 0.8,
        backgroundColor: whiteColor
    },
    contentContainer: {
        flex: 1
    },
    bottomSheetTitle: {
        color: baseColor,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5
    },
    textError: {
        fontSize: 12,
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 13
    },
    rowItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: whiteColor,
        marginTop: 10,
        borderRadius: 5,
    },
    columnItem: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: whiteColor,
        borderRadius: 10,
        marginBottom:20
    },
    userAvatar:{
        width:55,
        height:55,
        borderRadius:100,
        alignItems: 'center',
        backgroundColor: boxColor,
    },
    select: {
        borderStyle: 'solid',
        borderWidth: 0.7,
        borderColor: borderColor,
        marginTop: 3,
        height: 55,
        borderRadius: 10
    },
    searchContainer: {
        paddingHorizontal: 10,
        marginBottom: 15
    },
    mainItemContainer: {
        marginHorizontal: 15,
        marginBottom: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        height: 70,
        width: 70,
        borderRadius: 70 / 2,
        backgroundColor: whiteSmoke
    },
    images: {
        height: 80,
        width: 120,
        borderRadius: 5,
        backgroundColor: whiteSmoke
    },
    overlayContainer: {
        position: 'absolute',
        zIndex: 1,
        height: 70,
        width: 70,
        borderRadius: 70 / 2,
        backgroundColor: 'rgba(0,0,0,0.3)',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    overlayContainerOne: {
        position: 'absolute',
        zIndex: 1,
        height: 70,
        width: 70,
        borderRadius: 70 / 2,
        backgroundColor: 'rgba(0,0,0,0.3)',
        left: 25,
        right: 0,
        top: 5,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

