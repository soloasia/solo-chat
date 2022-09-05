import React, {useEffect, useRef, useCallback} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { baseColor } from '../config/colors';

export const InternetConnection = (): JSX.Element => {
  const animation = useRef(new Animated.Value(0)).current;

  const show = useCallback(
    (isConnected: boolean): void => {
      Animated.timing(animation, {
        toValue: isConnected ? 0 : 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    },
    [animation],
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      show(state.isConnected && state.isInternetReachable !== false);
    });
    return () => {
      unsubscribe();
    };
  }, [show]);

  return (
    <Animated.View style={[styles.container, {backgroundColor: baseColor, opacity: animation}]}>
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    text: {
        margin: 10,
        color: 'white',
        textAlign: 'center',
    },
});