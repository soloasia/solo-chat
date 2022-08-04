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
 import React from 'react';
 import { View } from 'react-native';
 import { Provider } from 'react-redux';
 import Route from './src/navigate/Route';
 import store from './src/store';
 
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
     <Provider store={store}>
         <NativeBaseProvider theme={theme}>
             <View style={{flex:1}}>
                 <Route />
             </View>
         </NativeBaseProvider>
     </Provider>
   );
 };
 export default App;
 