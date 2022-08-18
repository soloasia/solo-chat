import React from "react";
import { PermissionsAndroid, Platform,FlatList,Text } from "react-native";
import { Battambang, BattambangBold } from "../config/fonts";
import style,{ deviceWidth } from "../styles";
import { Toast,AlertDialog,Button as NButton } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { baseColor, whiteSmoke,discountColor } from "../config/colors";
import reactotron from "reactotron-react-native";

export const MethodType = {
    POST: 'POST',
    GET: 'GET'
}

let base_url = `https://chat-app.solo-asia.com/api/`;
export async function GET(end_point) {
    let token = await AsyncStorage.getItem('@token');
    var myHeader = new Headers();
    myHeader.append('Cache-Control','no-cache');
    myHeader.append('Accept','application/json');
    myHeader.append('Content-Type','application/json');
    myHeader.append('Authorization', `Bearer ${token}`);
    return new Promise(async (resolve, reject) => {
      try {
        await fetch(`${base_url}${end_point}`, {
          method: 'GET',
          headers: myHeader,
        })
          .then(res => res.json())
          .then(result => {
            resolve(result);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
  export async function POST(end_point, form_data) {
    let token = await AsyncStorage.getItem('@token');
    var myHeader = new Headers();
    myHeader.append('Cache-Control','no-cache');
    myHeader.append('Accept','application/json');
    myHeader.append('Content-Type','multipart/form-data');
    myHeader.append('Authorization', `Bearer ${token}`);
    return new Promise(async (resolve, reject) => {
      try {
        await fetch(`${base_url}${end_point}`, {
          method: 'POST',
          headers: myHeader,
          body: form_data,
        })
          .then(res => res.json())
          .then(result => {
            resolve(result);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
export const ToastStatus = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
  };
  export const showToast = (title, status, duration) => {
    return Toast.show({
      fontFamily: Battambang.fontFamily,
      title: title,
      duration: duration,
      status: status,
    });
  };


