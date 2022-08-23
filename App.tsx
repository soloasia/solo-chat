/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
 import { extendTheme, NativeBaseProvider } from 'native-base';

 import React, { useState } from 'react';


 import { View } from 'react-native';
 import { Provider } from 'react-redux';
 import Route from './src/navigate/Route';
 import store from './src/store';
 import { ThemeProvider } from './src/utils/ThemeManager';
 import LanguageManager from './src/utils/LangaugeManager';
 import { ProvideAuth } from './src/functions/UserAuth';

 
 const theme = extendTheme({
   components: {
     Select: {
         baseStyle: {},
         defaultProps: {},
         variants: {},
         sizes: {},
     }
   }
 });

 const App = () => {
   return ( 
    <ThemeProvider>
        <Provider store={store}>
        <ProvideAuth>
          <LanguageManager>
            <NativeBaseProvider theme={theme}>
                <View style={{flex:1}}>
                    <Route />
                </View>
            </NativeBaseProvider>
          </LanguageManager>
        </ProvideAuth>
      </Provider>
    </ThemeProvider>
   );
 };
 export default App;
 