import React from 'react';
import { View, StyleSheet } from 'react-native';
import Progress from 'react-native-progress/Circle';

export default ({progress}) => (
    <View style={styles.container}>
        <Progress progress={progress} size={150} showsText thickness={5} color='#00A7FF' />
    </View>
)

const styles = StyleSheet.create({
    container : {
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        right: 0, 
        left: 0, 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});