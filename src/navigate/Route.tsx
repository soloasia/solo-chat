import { SafeAreaView, useColorScheme, View, Platform, LogBox, StatusBar } from "react-native";
import React from 'react'
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import style, { deviceWidth } from "../styles";
import { baseColor } from "../config/colors";
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
import reactotron from "reactotron-react-native";
import AppearanceScreen from "../containers/settings/AppearanceScreen";
import QRcodeScreen from '../containers/settings/QRcodeScreen';
import ChatProfileScreen from '../containers/chat/ChatProfileScreen';
import MediaFilesScreen from '../containers/chat/MediaFilesScreen';
import CreateGroup from '../containers/chat/CreateGroup';
import LanguageScreen from "../components/LanguageScreen";
import EditProfileScreen from "../components/EditProfileScreen";
import ExampleScreen from "../components/ExampleScreen";
import ScanScreen from "../components/ScanScreen";
import ProfileNotification from "../containers/chat/ProfileNotification";






const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export const navigationRef: any = createNavigationContainerRef()

const Route = () => {

  React.useEffect(() => {
    checkPermissionNotification()
  }, [])


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
  const requestForNotificationPermission = async () => {
    const granted = await messaging().requestPermission();
    if (granted) {
      console.log('User granted messaging permissions!');
    } else {
      console.log('User declined messaging permissions :(');
    }
  };



  const colorScheme = useColorScheme();
  function MainStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // cardStyleInterpolator:
          //   CardStyleInterpolators.forFadeFromBottomAndroid,
        }}>

        <Stack.Screen name="AuthOption" component={AuthOptionScreen} />
        <Stack.Screen name="Main" component={MainTab} />
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
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Example" component={ExampleScreen} />
        <Stack.Screen name="ProfileNoti" component={ProfileNotification} />



      </Stack.Navigator>
    );
  }
  function MainTab() {
    const customTabBarStyle = {
      keyboardHidesTabBar: true,
      activeTintColor: baseColor,
      inactiveTintColor: '#666',
      allowFontScaling: false,
      style: {
        backgroundColor: '#fff',
      },
      labelStyle: {
        fontSize: 12,
        fontFamily: 'Lato-Regular'
      },
      showIcon: true,
      showLabel: true,
      tabStyle: { width: deviceWidth / 4, marginTop: 3 },
      indicatorStyle: {
        height: 0,
      },
    };
    return (
      <Tab.Navigator
        backBehavior="initialRoute"
        initialRouteName="Chat"
        tabBarOptions={customTabBarStyle}
        screenOptions={({ route }: any) => {
          return {
            tabBarVisible: route.params ? route.params.showTabBar : true,
          };
        }}
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
  return (
    <SafeAreaProvider>
       <StatusBar barStyle = "dark-content" hidden = {false} translucent = {true}/>
      <NavigationContainer>
        {/* <SafeAreaView
          // edges={['left', 'right', 'top']}
          style={[
            style.safeAreaContainer,
            {
              backgroundColor: '#fff',
            },
          ]}> */}
        <MainStack />
        {/* </SafeAreaView> */}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Route;