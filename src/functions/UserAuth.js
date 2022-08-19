import React, {useState, useEffect, useContext, createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {loadUser} from '../actions/User';
import { loadToken } from '../actions/Token';
import { GET, POST } from './BaseFuntion';
const authContext = createContext();

export function ProvideAuth({children}) {
  const _auth = useProvideAuth();
  return <authContext.Provider value={_auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const dispatch = useDispatch();
  useEffect(() => {
    checkUser();
  }, []);

  const [user, setUser] = useState(null);
  async function checkUser() {
    let token = await AsyncStorage.getItem('@token');
    // dispatch(loadToken(token))
    dispatch({ type: 'LOAD_USER_TOKEN', value: token });
    if (token === null) {
        setUser(false);
    } else {
        const formdata = new FormData();
        formdata.append("token",token);
        GET('me/detail',formdata)
        .then((result) => {
            dispatch(loadUser(result.data));
            setUser(true)
        })
        .catch(() => {
          setUser(false);
        });
    }
  }
  return {
    user,
  };
}
