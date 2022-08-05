import { Dimensions, StyleSheet } from "react-native";
import { baseColor, labelColor, placeholderTextColor, textColor, textSecondColor, whiteColor, whiteSmoke } from "../config/colors";
import { Battambang, BattambangBold, Moul } from "../config/fonts";

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;
export const activeOpacity: any = { activeOpacity: 0.6 }
export const paddingItem: number = 7;
export const spacingItem: number = 15;
export const paddingHorizontalItem = 15;
export const shadowWidth = 2;

export const style = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  flexTop: {
    flex: 0,
    backgroundColor: baseColor
  },
  flexContainer: {
    flex: 1,
    backgroundColor: whiteColor
  },
  flexContainerMain: {
    flex: 1,
    backgroundColor: baseColor
  },
  flexContainerCenter: {
    flex: 1,
    backgroundColor: whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  flexContainerCenterWhite: {
    flex: 1,
    backgroundColor: whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  containerCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    backgroundColor: '#fff',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 25,
    marginLeft: 15,
    marginTop: 20,
  },
  searchInputWidth: {
    paddingLeft: 15,
    height: 50,
    width: '87%',
    color: '#000',
  },
  backgroundContainer: {
    backgroundColor: baseColor,
    height: deviceWidth / 4,
    position: 'absolute',
    width: '100%',
  },
  currencyContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  scrollContainer: {
    backgroundColor: baseColor,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 15,
    flex: 1,
  },
  currency: {
    width: (deviceWidth - 46) / 2,
    height: deviceWidth / 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: '#aaa',
  },
  actionButtonContainer: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 10,
    justifyContent: 'center',
  },
  actionButton: {
    width: (deviceWidth - 43) / 2,
    height: deviceWidth / 9,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageImage: {
    height: deviceWidth / 18,
    width: deviceWidth / 10,
    marginRight: 10,
    borderRadius: 3,
  },
  ///language style//
  p: {
    fontSize: 15,
    color:textColor,
    fontFamily:'Lato-Regular'
  },
  pBold: {
    fontSize: 15,
    color:labelColor,
    fontFamily:'Lato-Bold'
  },
  pCategory: {
    ...Moul,
    fontSize: 16,
    color:labelColor
  },
  inputWidth: {
    paddingHorizontal: 15,
    height: 50,
    width: '100%',
    color: '#000',
  },
  button: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: baseColor,
    borderRadius: 10,
  },
  headerContainer: {
    backgroundColor: baseColor,
  },
  bodyContainer: {
    marginHorizontal: 15,
    paddingVertical: 5,
    // backgroundColor: '#fff',
    // borderRadius: 15,
    paddingTop: 20
  },
  buttonChoose: {
    flexDirection: 'row',
    width: deviceWidth,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10
  },
  textChoose: {
    fontSize: 15,
    color: textColor
  },
  coverImage: {
    width: 100,
    height: 100,
    backgroundColor: '#eee',
    marginLeft: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonHeader: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  transparent: { backgroundColor: 'transparent' },
  updateProfile: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(120, 120, 120,0.5)',
    height: 35,
    width: 35,
    right: 0,
    borderRadius: 20,
    bottom: 0,
  },
  buttonStyle: {
    marginHorizontal: 15
  },
  smallLine: {
    width: 1,
    borderWidth: 0.5,
    borderColor: placeholderTextColor,
    height: 20,
    marginHorizontal: 15
  },
  removeImage: {
    minWidth: 120,
    justifyContent: 'center',
    margin: 10
  },
  container: {
    flex: 1,
    backgroundColor: whiteColor,
    alignItems:'center',
    // justifyContent:'center'
  },
  // Set Shop Location
  getLocationButton: {
    right: 20,
    bottom: 120,
    position: 'absolute',
    zIndex: 10,
    elevation: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  markerButton: {
    right: 20,
    bottom: 180,
    position: 'absolute',
    zIndex: 10,
    elevation: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resetMarkerButton: {
    right: 20,
    position: 'absolute',
    zIndex: 10,
    elevation: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maker: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50
  },
  buttonSetLocation: {
    flexDirection: 'row',
    alignSelf: 'center',
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: baseColor,
    borderRadius: 5
  },
  titleDialog: {
    fontSize: 16,
    ...BattambangBold,
    color: baseColor
  },
  form: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#eee',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
});

export default style;
