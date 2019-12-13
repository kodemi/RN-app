import React, { Component } from 'react';
import { Modal, View } from 'react-native';
import { Form, Item, Text, Label, Button } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import flatten from 'flat';

import NumericInput from '../NumericInput';

export default class SOPPDriverArrivalModal extends Component {
    state = {
        data: this.props.data && flatten(this.props.data) || null
    }

    handleInputValueChange = (value, field) => {
        this.setState({
            data: {...this.state.data, [field]: value && parseInt(value)}
        });
    }

    saveTaskData = () => {
        const data = flatten.unflatten(this.state.data);
        this.props.saveTaskData(data);
    }

    render() {
        const { visible, setModalVisible, saveTaskData } = this.props;
        const { data } = this.state;

        return (
            <Modal
                onRequestClose = {() => setModalVisible(false)}
                onShow = {() => this.setState({data: data && flatten(data)})}
                animationType={"slide"}
                transparent={true}
                visible={visible}
            >
                <KeyboardAwareScrollView style={{flex: 1, padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                    <View style={{backgroundColor: '#fff', padding: 10}}>
                        {data && <Form>
                            <Item fixedLabel last>
                                <Label style={{fontSize: 12}}>БАГАЖ</Label>
                                <NumericInput 
                                    name='luggage' 
                                    value={data['luggage']} 
                                    autoFocus={true}
                                    onChange={this.handleInputValueChange} />
                            </Item>
                        </Form>}
                        <View style={styles.modalActions}>
                            <Button transparent onPress={() => this.saveTaskData()}>
                                <Text>СОХРАНИТЬ</Text>
                            </Button>
                            <Button transparent onPress={() => setModalVisible(false)}>
                                <Text>ОТМЕНА</Text>
                            </Button>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>
        );
    }
}

const styles = {
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10
    }
}