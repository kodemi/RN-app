import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

export default class MissingConnectionWarning extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>НЕТ ПОДКЛЮЧЕНИЯ К СЕТИ</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red', 
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: 40,
        elevation: 5,
    },
    message: {
        color: 'white', 
        fontWeight: 'bold'
    }
});
