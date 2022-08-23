import { StyleSheet, Text, Image, View, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { baseColor, placeholderDarkTextColor, placeholderTextColor, whiteColor, whiteSmoke } from '../config/colors';
import BottomSheet from 'reanimated-bottom-sheet';
import CameraRoll from '@react-native-community/cameraroll';
import { FlatListVertical, Footer } from '../customs_items/Components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import reactotron from 'reactotron-react-native';
import style from '../styles';
import Video from 'react-native-video';

const TestScreen = (props:any) => {
    const navigate: any = useNavigation();
    const insets = useSafeAreaInsets();
    const sheetRef = React.useRef<any>(null);
	const [data, setData] = useState<any>([]);
	const [state, setState] = useState<any>({
        image: null,
		index: null
    });
    const handleChange = (stateName: string, value: any) => {
        state[`${stateName}`] = value;
        setState({ ...state });
    };

	const getPhotos = () => {
		CameraRoll.getPhotos({
			first: 1000,
			assetType: 'All',
			include: ['filename', 'fileSize','imageSize','playableDuration']
		}).then((res) => {
			setData(res.edges);
		})
		.catch((error) => {
			console.log(error);
		});
	};
	
	const askPermission = async () => {
		if (Platform.OS === 'android') {
			const result = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
				{
					title : 'Permission Explanation',
					message: 'ReactNativeForYou would like to access your photos!',
				},
			);
			if (result !== 'granted') {
				return;
			} else {
				getPhotos();
			}
			} else {
			getPhotos();
			}
	};
	
	useEffect(() => {
		askPermission();
	}, []);

	function onSelectImage (item:any,index:any){
		handleChange('index',index)
		handleChange('image',item)
	}
	function millisToMinutesAndSeconds(millis:any) {
		var seconds:any = (millis / 60).toFixed(2);
		return seconds;
	}
	const _renderView = ({item,index}:any) =>{
		return(
			<TouchableOpacity onPress={()=>onSelectImage(item.node.image.uri,index)} style={{width: '33%',height: 150}}>
				<Image style={{width: '100%',height: 150,}} source={{uri: item.node.image.uri}}/>
				{item.node.type == 'video'?
					<View style={{position:'absolute',bottom:5,right:5,backgroundColor:placeholderDarkTextColor,padding:5,borderRadius:20}}>
						<Text style={[style.p,{color:whiteColor,fontSize:12}]}>{millisToMinutesAndSeconds(item.node.image.playableDuration)}</Text>
					</View>
					:
					<></>
				}
				{state.index == index?
					<View style={{position:'absolute',backgroundColor: 'white',opacity: 0.7,top:0,bottom:0,width:"100%",height:150,justifyContent:'center',alignItems:'center'}}>
						<View style={{backgroundColor:baseColor,width:30,height:30,borderRadius:30,alignItems:'center',justifyContent:'center'}}>
							<Text style={[style.p,{color:whiteColor}]}>1</Text>
						</View>
					</View>
					:
					<></>
				}
			</TouchableOpacity>
		)
	}
    const renderInner = () => (
		<FlatListVertical
			renderItem={_renderView}
			numColumns={3}
			data={data}
			ListFooterComponent={
				<>
					<Footer />
				</>
			}
		/>
    )
	const onSend = () =>{
		handleChange('image','')
		handleChange('index',null)
		sheetRef.current.snapTo(2)
	}
    const renderHeader = () => (
        <View style={styles.header}>
			<TouchableOpacity onPress={() => sheetRef.current.snapTo(2)} style={styles.panelHeader}>
				<Text style={[style.p,{color:whiteColor}]}>CANCEL</Text>
			</TouchableOpacity>
			<View style={styles.panelHeader}>
				<View style={styles.panelHandle} />
			</View>
			<TouchableOpacity onPress={onSend} style={styles.panelHeader}>
				{state.image?<Text style={[style.p,{color:whiteColor}]}>DONE</Text>:<></>}
			</TouchableOpacity>
        </View>
    )
    return (
        <View style={styles.container}>
            <BottomSheet
				ref={sheetRef}
				snapPoints={['50%', '95%', 0]}
				overdragResistanceFactor={1}
				renderContent={renderInner}
				renderHeader={renderHeader}
				initialSnap={2}
				enabledInnerScrolling={true}
				enabledContentGestureInteraction={false}
            />
            <TouchableOpacity onPress={() => sheetRef.current.snapTo(0)}>
                <View style={{width:100,height:40,backgroundColor:'red',marginTop:100,justifyContent:'center',alignItems:'center' }}>
                </View>
            </TouchableOpacity>
      </View>
    )
}
export default React.memo(TestScreen)
const IMAGE_SIZE = 200

const styles = StyleSheet.create({
  search: {
    borderColor: 'red',
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: whiteSmoke,
    justifyContent:'center',
    alignItems:'center'
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
    flex:1
  },
  header: {
    backgroundColor:baseColor,
    shadowColor: '#000000',
	padding:15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
	flexDirection:'row',
	alignItems:'center',
	justifyContent:'space-between'
  },
  panelHeader: {
    alignItems: 'center',
	justifyContent:'center'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor:whiteSmoke,
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor:whiteSmoke,
    alignItems: 'center',
    marginVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  photo: {
    width: '100%',
    height: 225,
    marginTop: 30,
  },
  map: {
    height: '100%',
    width: '100%',
  },
})