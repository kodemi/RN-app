import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { Container } from 'native-base';

import { home } from '../constants/routes';
import Pin from './Pin';

export default class Login extends Component {
    static navigationOptions = {
        header: () => ({
            visible: false
        })
    }

    loginUser = (value) => {
        this.props.loginUser({pin: value}, home);
    }

    render() {
        const { deviceReady } = this.props.device;
        const { apiRoots, apiRoot } = this.props.data;
        const serverName = apiRoot && apiRoots.filter(root => root.key === apiRoot)[0].name;
        return (
            <Container>
                <View style={styles.container}>
                    {deviceReady 
                        ? <Pin title='ВВЕДИТЕ ПИНКОД' waiting={this.props.auth.isFetching} layout={this.props.layout} onSubmit={this.loginUser} />
                        : <Text style={{alignSelf: 'center'}}>РЕГИСТРАЦИЯ УСТРОЙСТВА...</Text>
                    }
                    {this.props.data.devMode && serverName && <Text style={{textAlign: 'center', fontSize: 10}}>СЕРВЕР: {serverName.toUpperCase()}</Text>}
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // padding: 20
    },
});