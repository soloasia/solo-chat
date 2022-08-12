//import liraries
import { Actionsheet, Box, Button, useDisclose,Text } from 'native-base';
import React, { Component } from 'react';
import { View, StyleSheet, Modal } from 'react-native';

// create a component
const ExampleScreen = () => {
    const {
        isOpen,
        onOpen,
        onClose
      } = useDisclose();
    return (
        <View style={styles.container}>
            <Button onPress={onOpen}>Actionsheet</Button>
            <Modal
                presentationStyle="formSheet"
                visible ={true}
                //  hideModalContentWhileAnimating={true}
                // useNativeDriver={true}
                // isVisible={searchFilterModalShown}
                onDismiss={() => console.log('on dismiss')}>
                {/* <SearchFilterView searchFilter={state.searchFilter} /> */}
            </Modal>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default ExampleScreen;
