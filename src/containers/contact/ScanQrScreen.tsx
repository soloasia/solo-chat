import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, Image, View, TouchableOpacity, Platform } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { baseColor, whiteSmoke } from '../../config/colors';
import { ThemeContext } from '../../utils/ThemeManager';
import { deviceHeight, deviceWidth } from '../../styles';
import * as Animatable from "react-native-animatable";
import { RNCamera } from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import reactotron from 'reactotron-react-native';
import { GET, POST, showToast, ToastStatus } from '../../functions/BaseFuntion';
import { useDispatch } from 'react-redux';
import { loadContact } from '../../actions/Contact';

const ScanQrScreen = (props:any) => {
    const navigate: any = useNavigation();
    const insets = useSafeAreaInsets();
	const [isFlash,setFlash] = useState(false);
	const [reactivate,setActive] = useState(false);
	const dispatch:any = useDispatch();
	const {theme} : any = useContext(ThemeContext);
	function makeSlideOutTranslation(translationType:any, fromValue:any) {
		return {
			from: {
				[translationType]: deviceWidth * -0.18
			},
			to: {
				[translationType]: fromValue
			}
		};
	}
	const onAddFriend = (item:any) =>{
        const formdata = new FormData();
        formdata.append("contact_user_id", item);
        POST('contact/add', formdata)
        .then(async (result: any) => {
            if (result.status) {
                showToast(result.message, ToastStatus.SUCCESS, 2000);
				setActive(false);
				GET(`me/contact?page=1`)
				.then(async (result: any) => {
					if(result.status){
						dispatch(loadContact(result.data.data));
						const timer = setTimeout(() => {
							navigate.goBack();
						}, 500);
						return () => clearTimeout(timer);
					}
				})
				.catch(e => {
				});
            } else {
                showToast(result.errors[0], ToastStatus.WARNING, 2000);
				setActive(true)
            }
        })
    }
    return (
        <View>
           	<QRCodeScanner
				showMarker
				onRead={(e)=>onAddFriend(e.data)}
				cameraStyle={{ height: deviceHeight}}
				// reactivate={true}
				vibrate={Platform.OS == "android"}
				flashMode={isFlash?RNCamera.Constants.FlashMode.torch: RNCamera.Constants.FlashMode.off}
				customMarker={
					<View style={styles.rectangleContainer}>
						<View style={styles.topOverlay}>
							<TouchableOpacity onPress={()=>setFlash(isFlash => !isFlash)}>
								<Ionicons name={isFlash?'flash-outline':'flash-off-outline'} size={30} color={whiteSmoke} />
							</TouchableOpacity>
						</View>
						<View style={{ flexDirection: "row" }}>
							<View style={styles.leftAndRightOverlay} />
							<View style={styles.rectangle}>
								<View style={{width:deviceWidth * 0.73,height:deviceWidth * 0.73}}>
								</View>
								<Animatable.View
									style={styles.scanBar}
									direction="alternate-reverse"
									iterationCount="infinite"
									duration={1700}
									easing="linear"
									animation={makeSlideOutTranslation(
										"translateY",
										deviceWidth * -0.54
									)}
								/>
							</View>
							<View style={styles.leftAndRightOverlay} />
						</View>
						<View style={styles.bottomOverlay} />
					</View>
				}
				topViewStyle={{marginTop :Platform.OS ==='ios'? insets.top + 40:70}}
				topContent={
					<View style ={{justifyContent : 'center',alignItems:'center',height:50,position:'absolute',bottom:-5,left:10}}>
						<TouchableOpacity onPress={()=>navigate.goBack()}>
							<Text style={{color: baseColor ,fontWeight :'500',fontSize :16}}>Cancel</Text>
						</TouchableOpacity>
					</View>
				}
			/>
        </View>
    )
}


export default ScanQrScreen;
const overlayColor = "rgba(0,0,0,0.5)";

const rectDimensions = deviceWidth * 0.7; 
const scanBarWidth = deviceWidth * 0.4; 
const scanBarHeight = deviceWidth * 0.003;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
      },
      text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20
      },
      textSmall: {
        fontSize: 20,
        color: '#ffeb3b'
      },
      rectangleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
      },
      rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
      },
    
      topOverlay: {
        flex: 1,
        height: deviceWidth,
        width: deviceWidth,
        backgroundColor: overlayColor,
        justifyContent: "center",
        alignItems: "center",
      },
    
      bottomOverlay: {
        flex: 1,
        height: deviceWidth,
        width: deviceWidth,
        backgroundColor: overlayColor,
        paddingBottom: deviceWidth * 0.1
      },
    
      leftAndRightOverlay: {
        height: deviceWidth * 0.8,
        width: deviceWidth,
        backgroundColor: overlayColor
      },
    
      scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        backgroundColor: baseColor
      }
})