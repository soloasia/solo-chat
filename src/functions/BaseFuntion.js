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


export default async function base64File(url) {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
}

export const convertHMS = (value) => {
  if (value < 1) {
      return '00:00';
  }
  else {
      const sec = parseInt(value, 10); // convert value to number if it's string
      let hours = Math.floor(sec / 3600); // get hours
      let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
      let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
      // add 0 if value < 10
      if (hours < 10) { hours = "0" + hours; }
      if (minutes < 10) { minutes = "0" + minutes; }
      if (seconds < 10) { seconds = "0" + seconds; }
      return (hours < 1 ? '' : (hours + ':')) + minutes + ':' + seconds; // Return is HH : MM : SS
  }
}

export async function postCreateGroup(end_point, params) {
  let token = await AsyncStorage.getItem('@token');

  return new Promise(async (resolve, reject) => {
      let headers = {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
      }
      fetch(`${base_url}${end_point}`,{
        method  : 'POST',
        headers : headers,
        body :  JSON.stringify(params)
      }) .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => resolve(error));
  }) 
};

export async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
}

export function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}