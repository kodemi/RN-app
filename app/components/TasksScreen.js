import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import { 
    Container,  
    Header, 
    Button, 
    Icon, 
    Title,
    Left,
    Right,
    Body
} from 'native-base';

import TasksList from '../containers/TasksListContainer';

export default class TasksScreen extends React.Component {
    static navigationOptions = {
        drawer: () => ({
            label: 'Notifications',
        })
    }

    componentWillMount() {
        const { token, user } = this.props.auth;
        this.props.startScheduleGetTasks(token, user);
    }

    componentWillUnmount() {
        this.props.stopScheduleGetTasks();
    }

    render() {
        const isTablet = this.props.layout.width > 1024;
        const { tasks } = this.props.data;

        return (
            <Container style={{paddingLeft: 0, marginLeft: 0}}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                            <Icon name='md-menu' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Задачи</Title>
                    </Body>
                    <Right />
                </Header>
                
                <View style={[isTablet ? styles.tablet : styles.mobile, {paddingLeft: 0}]}>
                    <TasksList navigation={this.props.navigation} tasks={tasks} style={isTablet ? {flex: 3}: null} />
                </View>                    
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    tablet: {
        flex: 1,
        flexDirection: 'row',
        // padding: 20,
    },
    mobile: {
        flex: 1,
        flexDirection: 'column'
    }
});
