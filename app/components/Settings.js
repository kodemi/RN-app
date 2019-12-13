import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import { 
    Container,  
    Content,
    Header, 
    Button, 
    Icon, 
    Title,
    Left,
    Right,
    Body,
    Text,
    ListItem,
    Radio,
} from 'native-base';
import RNRestart from 'react-native-restart';

const ApiRootRow = ({root, selected, onSelect}) => (
    <ListItem selected={selected} onPress={() => onSelect(root)}>
        <Body style={{marginLeft: -10}}>
            <Text>{root.name}</Text>
            <Text note>{root.description}</Text>
        </Body>
        <Right>
            <Radio selected={selected}/>
        </Right>
    </ListItem>
)

export default class Settings extends React.Component {
    state = {
        initialApiRoot: this.props.data.apiRoot,
        selectedApiRoot: this.props.data.apiRoot,
        showRestartButton: false
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.data.apiRoot !== this.state.initialApiRoot) {
            RNRestart.Restart();
        }
    }

    handleApiRootSelect = root => {
        const showRestartButton = root.key !== this.state.initialApiRoot;
        this.setState({selectedApiRoot: root.key, showRestartButton});
    }

    setApiRoot = () => {
        this.props.stopScheduleGetTasks();
        this.props.clearTasks();
        this.props.logoutUser();
        this.props.setApiRoot(this.state.selectedApiRoot);
    }

    render() {
        const { apiRoots } = this.props.data;

        return (
            <Container style={{paddingLeft: 0, marginLeft: 0}}>
                <Header noShadow>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='md-arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Настройки</Title>
                    </Body>
                    <Right />
                </Header>
                
                <Content>
                    <ListItem itemHeader first style={{paddingBottom: 5}}>
                        <Text>СЕРВЕР ДАННЫХ</Text>
                    </ListItem>
                    {apiRoots.map(root => <ApiRootRow key={root.key} root={root} selected={root.key === this.state.selectedApiRoot} onSelect={this.handleApiRootSelect} />)}
                    {this.state.showRestartButton && <ListItem>
                        <Body>
                            <Button danger block onPress={this.setApiRoot}><Text>НЕОБХОДИМ ПЕРЕЗАПУСК</Text></Button>
                        </Body>
                    </ListItem>}
                </Content>                    
            </Container>
        );
    }
}
