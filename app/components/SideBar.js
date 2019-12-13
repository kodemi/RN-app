import React, { Component } from 'react';
import {
    Content, 
    List, 
    ListItem, 
    Text,
    Icon,
    Left,
    Body,
    CheckBox
} from 'native-base';
import { Image, View } from 'react-native';

const logo = require('../images/logo.png');

export default class SideBar extends Component {
    logout = () => {
        this.props.logout();
        this.props.navigation.navigate('DrawerClose');
    }

    goToSetting = () => {
        this.props.navigation.navigate('DrawerClose');       
        this.props.navigation.navigate('Settings');
    }

    render() {
        const { apiRoot, apiRoots, devMode } = this.props.data;
        const serverName = apiRoot && apiRoots.filter(root => root.key === apiRoot)[0].name;

        return (
            <Content style={{elevation: 10}}>
                <Image source={logo} resizeMode='contain' style={{height: 150, alignSelf: 'center', marginVertical: 20}} />
                <List>
                    <ListItem>
                        <Text style={{color: '#696969'}}>{this.props.auth.user.fullname}</Text>
                    </ListItem>
                    <ListItem icon onPress={this.logout}>
                        <Left><Icon name='md-exit' /></Left>
                        <Body><Text>Выйти</Text></Body>
                    </ListItem>
                    {devMode && <ListItem icon onPress={this.goToSetting}>
                        <Left><Icon name='md-settings' /></Left>
                        <Body>
                            <Text>Настройки</Text>
                        </Body>
                    </ListItem>    
                    }
                </List>
                <ListItem icon last style={devMode && {marginTop: 10, paddingBottom: 10}}>
                    <Left><Icon name='md-information-circle' /></Left>
                    <Body>
                        <Text style={{fontSize: 12}}>Версия: {this.props.device.appVersion}</Text>
                        {devMode && <Text style={{fontSize: 12}}>Сервер: {serverName}</Text>}
                    </Body>
                </ListItem>
            </Content>
        );
    }
}