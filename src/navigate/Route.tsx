import { SafeAreaView, useColorScheme, View, Platform, LogBox, StatusBar, Text } from "react-native";
import React, { createContext, useContext, useEffect, useState } from 'react'
import { createNavigationContainerRef, NavigationContainer,  DefaultTheme, DarkTheme, ThemeProvider, CommonActions,} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import style, { deviceWidth } from "../styles";
import NetInfo from '@react-native-community/netinfo';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons'
import ChatScreen from "../components/ChatScreen";
import ContactScreen from "../components/ContactScreen";
import SettingScreen from "../components/SettingScreen";
import ChatListScreen from "../containers/chat/ChatListScreen";
import AuthOptionScreen from "../components/AuthOptionScreen";
import LoginScreen from '../containers/auth/LoginScreen';
import SignupScreen from "../containers/auth/SignupScreen";
import messaging from '@react-native-firebase/messaging';
import AppearanceScreen from "../containers/settings/AppearanceScreen";
import QRcodeScreen from '../containers/settings/QRcodeScreen';
import ChatProfileScreen from '../containers/chat/ChatProfileScreen';
import MediaFilesScreen from '../containers/chat/MediaFilesScreen';
import CreateGroup from '../containers/chat/CreateGroup';
import LanguageScreen from "../containers/settings/LanguageScreen";
import EditProfileScreen from "../containers/settings/EditProfileScreen";
import ProfileNotification from "../containers/chat/ProfileNotification";
import themeStyle from "../styles/theme";
import { ThemeContext } from "../utils/ThemeManager";

import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../functions/UserAuth";
import { loadData } from "../functions/LoadData";
import SplashScreen from "../components/SplashScreen";
import FullImageDisplay from '../components/ShowFullImage';
import { main_padding } from '../config/settings';
import ScanQrScreen from "../containers/contact/ScanQrScreen";
import MemberScreen from "../containers/chat/MemberScreen";
import VideoFullScreen from "../containers/chat/VideoFullScreen";
import reactotron from "reactotron-react-native";
import { LanguageContext } from "../utils/LangaugeManager";
import { showToast, ToastStatus } from "../functions/BaseFuntion";
import { Box, useToast } from "native-base";
import { whiteSmoke } from "../config/colors";
import Toast from 'react-native-simple-toast';
import NoInternetScreen from "../components/NoInternetScreen";
import _ from 'lodash'
// import MemberScreen from "../containers/chat/MemberScreen";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export const navigationRef: any = createNavigationContainerRef()


const Route = () => {
  const dispatch = useDispatch();
  const no_connection = useSelector( (state: {no_connection: any}) => state.no_connection);
  const auth:any = useAuth();
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);

  const [splashscreen,setSplash] = useState(true)
  const {theme} : any = useContext(ThemeContext);
  const {tr} : any = useContext(LanguageContext);
  
  useEffect(() => {
    checkPermissionNotification();
    requestMobileToken();
    if (auth !== null) {
      const init = async () => {
        if(user){
          loadData(dispatch);
        }
      };
      init().finally(async () => {
        const timer = setTimeout(() => {
          setSplash(false)
        }, 1500);
        return () => clearTimeout(timer);
      });
      }
  }, [user])

  useEffect(() => {
    const inter = setInterval(() => {
      const unsubscribe = NetInfo.addEventListener(
        (state: {isConnected: any}) => {
          if (!state.isConnected) {
            dispatch({type: 'LOAD_NO_CONNECTION', value: true});
          } else {
            dispatch({type: 'LOAD_NO_CONNECTION', value: false});
          }
        },
      );
      unsubscribe();
    }, 1000);

    if (no_connection) {
      clearInterval(inter);
    }
  }, []);

 
  const checkPermissionNotification = async () => {
    const check = await messaging().isDeviceRegisteredForRemoteMessages;
    if (Platform.OS === 'ios' || !check) {
      await registerForNotification();
    }
    await requestForNotificationPermission();
  }
  const registerForNotification = async () => {
    // await requestNotifications(['alert', 'badge', 'sound']);
    await messaging().registerDeviceForRemoteMessages();
  };
  const requestMobileToken = async () => {
    const token = await messaging().getToken();
    dispatch({ type: 'LOAD_MOBILE_TOKEN', value: token });
  };

  const requestForNotificationPermission = async () => {
    const granted = await messaging().requestPermission();
    if (granted) {
      console.log('User granted messaging permissions!');
    } else {
      console.log('User declined messaging permissions :(');
    }
  };
  function MainStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // cardStyleInterpolator:
          //   CardStyleInterpolators.forFadeFromBottomAndroid,
        }}>
        {!_.isEmpty(token)? 
          <>
            <Stack.Screen name="Main" component={MainTab} />
            <Stack.Screen name="AuthOption" component={AuthOptionScreen} />
          </>
            :
            <>
              <Stack.Screen name="AuthOption" component={AuthOptionScreen} />
              <Stack.Screen name="Main" component={MainTab} />
            </>
          }
        {/* <Stack.Screen name="Main" component={MainTab} /> */}
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Appearance" component={AppearanceScreen} />
        <Stack.Screen name="QRcode" component={QRcodeScreen} />
        <Stack.Screen name="ProfileChat" component={ChatProfileScreen} />
        <Stack.Screen name="Mediafile" component={MediaFilesScreen} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ProfileNoti" component={ProfileNotification} />
        <Stack.Screen name="DisplayFullImg" component={FullImageDisplay} />
        <Stack.Screen name="ScanQr" component={ScanQrScreen} />
        <Stack.Screen name="Members" component={MemberScreen} />
        <Stack.Screen name="VideoFull" component={VideoFullScreen} />
      </Stack.Navigator>
    );
  }
  function MainTab() {
    return (
      <Tab.Navigator
        backBehavior="initialRoute"
        initialRouteName={tr("chats")}
        screenOptions={({ route }) => ({
          headerShown: false,
          resetOnBlur : false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height:Platform.OS ==='ios'? 90:50,
            paddingHorizontal: 5,
            paddingTop: 0,
            paddingBottom:Platform.OS ==='ios'?main_padding+10:5,
            backgroundColor: themeStyle[theme].backgroundColor,
            position: 'absolute',
            borderStartWidth:1,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontFamily:'Montserrat-Regular'
          },
        })}
      >
        <Tab.Screen
          name={tr("contacts")}
          component={ContactScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'person-circle' : 'person-circle-outline'}
                color={color}
                size={25}
              />
            ),
          }}
        />
        <Tab.Screen
          name={tr("chats")}
          component={ChatScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'ios-chatbubbles-sharp' : 'ios-chatbubbles-outline'}
                color={color}
                size={25}
              />
            ),
          }}
        />
        <Tab.Screen
          name={tr("settings")}
          component={SettingScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                color={color}
                size={25}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  LogBox.ignoreAllLogs();
  return (
    <SafeAreaProvider>
       <StatusBar barStyle = "dark-content" hidden = {false} translucent = {true}/>   
       <NavigationContainer>
        {/* <NoInternetScreen /> */}
          {no_connection ? <NoInternetScreen /> :
            splashscreen?
              <SplashScreen/>
              :
                <MainStack />
          }
        </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Route;



function PublicNotification() {
  throw new Error("Function not implemented.");
}

