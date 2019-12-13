import React from 'react';
import { 
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
} from 'react-native';
// import Progress from 'react-native-progress/Circle';

export default ({animating=false}) => {
    if (!animating) { return null }
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <ActivityIndicator color='#00A7FF' size='large' animating />
                <Text style={styles.text}>Пожалуйста, подождите</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        right: 0, 
        left: 0, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    body: {
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 5,
        padding: 15,
        alignItems: 'center',
        borderRadius: 3
    },
    text: {
        paddingLeft: 10,
        fontSize: 16
    }
});