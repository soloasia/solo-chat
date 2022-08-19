import { SafeAreaView, useColorScheme, View, Platform, LogBox, StatusBar } from "react-native";
import React, { createContext, useContext, useState } from 'react'
import { createNavigationContainerRef, NavigationContainer,  DefaultTheme, DarkTheme, ThemeProvider,} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import style, { deviceWidth } from "../styles";
import { backgroundDark, baseColor, greyDark } from "../config/colors";
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
import { useDispatch } from "react-redux";
import { useAuth } from "../functions/UserAuth";
import { loadData } from "../functions/LoadData";
import SplashScreen from "../components/SplashScreen";
import FullImageDisplay from '../components/ShowFullImage';
import { main_padding } from '../config/settings';
import ScanQrScreen from "../containers/contact/ScanQrScreen";


const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export const navigationRef: any = createNavigationContainerRef()

const Route = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const [splashscreen,setSplash] = useState(true)
  
  React.useEffect(() => {
    checkPermissionNotification();
	requestMobileToken();
	if (auth !== null) {
		const init = async () => {
		  loadData(dispatch);
		};
		init().finally(async () => {
		  const timer = setTimeout(() => {
			  setSplash(false)
		  }, 1500);
		  return () => clearTimeout(timer);
		  // if (auth.user !== null) await RNBootSplash.hide({fade: true});
		});
	  }
  }, [])

  const {theme} : any = useContext(ThemeContext);

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
        {auth.user ? 
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
      </Stack.Navigator>
    );
  }
  function MainTab() {
    return (
      <Tab.Navigator
        backBehavior="initialRoute"
        initialRouteName={"Chat"}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height:Platform.OS ==='ios'? 90:50,
            paddingHorizontal: 5,
            paddingTop: 0,
            paddingBottom:Platform.OS ==='ios'?main_padding+10:5,
            backgroundColor: themeStyle[theme].backgroundColor,
            position: 'absolute',
            borderTopWidth: 0,
        },
      })}
      >
        <Tab.Screen
          name="Contact"
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
          name="Chat"
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
          name="Setting"
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
  const LightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: baseColor,
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: "black",
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)',
    },
  };
  
  const MyDarkTheme = {
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: baseColor,
      background: backgroundDark,
      card: 'rgb(255, 255, 255)',
      text: "white",
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)',
    },
  };

  return (
    <SafeAreaProvider>
       <StatusBar barStyle = "dark-content" hidden = {false} translucent = {true}/>   
       <NavigationContainer>
          {splashscreen? <SplashScreen/>:<MainStack />}
        </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Route;



