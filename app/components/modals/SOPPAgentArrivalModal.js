import React from 'react';
import { View } from 'react-native';
import { Form, Item, ListItem, Text, Label, Button, CheckBox, Body } from 'native-base';
import flatten from 'flat';

import BaseModal from './BaseModal';
import NumericInput from '../NumericInput';

export default class SOPPAgentArrivalModal extends React.Component {
    state = {
        data: this.props.data && flatten(this.props.data) || null,
        noPaxArrival: !this.props.data.pax.arrival,
        noLuggage: this.props.data.luggage !== 0 && !this.props.data.luggage,
    }

    handleInputValueChange = (value, field) => {
        this.setState({
            data: {...this.state.data, [field]: value && parseInt(value)}
        });
    }

    saveTaskData = () => {
        const data = flatten.unflatten(this.state.data);
        if (this.state.noPaxArrival) {
            data.pax.arrival = null;
        } else {
            if (!this.props.data.pax.arrival) {
                data.pax.arrival = { ADT: 0, CHD: 0, INF: 0 };
            }
        }
        if (this.state.noLuggage) {
            data.luggage = null;
        } else {
            if (!data.luggage) {
                data.luggage = 0;
            }
        }
        this.props.saveTaskData(data);
    }

    togglePaxArrival = () => {
        const noPaxArrival = !this.state.noPaxArrival;
        this.setState({ noPaxArrival });
    }

    toggleLuggage = () => {
        this.setState({noLuggage: !this.state.noLuggage});
    }

    render() {
        const { visible, setModalVisible, title } = this.props;
        const { data } = this.state;

        return (
            <BaseModal
                onRequestClose = {() => setModalVisible(false)}
                onShow = {() => this.setState({data: data && flatten(data)})}
                visible={visible}
                fullscreen
                titleComponent={
                    <View>
                        <Text style={{fontSize: 12, textAlign: 'center', fontWeight: 'bold'}}>ЗАДАЧА</Text>
                        <Text style={{fontSize: 16, textAlign: 'center', fontWeight: 'bold'}}>{title.toUpperCase()}</Text>
                    </View>
                }
                actionsComponent={
                    <View style={styles.modalActions}>
                        <Button transparent onPress={() => this.saveTaskData()}>
                            <Text>СОХРАНИТЬ</Text>
                        </Button>
                        <Button transparent onPress={() => setModalVisible(false)}>
                            <Text>ОТМЕНА</Text>
                        </Button>
                    </View>
                }
            >
                {data && <Form style={{paddingTop: 10}}>
                    <Text style={{paddingTop: 10, textAlign: 'center', fontSize: 14}}>ПРИЛЕТ</Text>
                    <ListItem style={{paddingLeft: 10}}>
                        <CheckBox checked={this.state.noPaxArrival} onPress={this.togglePaxArrival} />
                        <Body>
                            <Text style={{fontSize: 12}}>НЕТ ПАССАЖИРОВ</Text>
                        </Body>
                    </ListItem>
                    {!this.state.noPaxArrival && <View>
                        <Item fixedLabel>
                            <Label style={{fontSize: 12}}>ВЗРОСЛЫЕ</Label>
                            <NumericInput
                                disabled={this.state.noPaxArrival} 
                                name='pax.arrival.ADT' 
                                value={data['pax.arrival.ADT']} 
                                onChange={this.handleInputValueChange} />
                        </Item>
                        <Item fixedLabel>
                            <Label style={{fontSize: 12}}>ДЕТИ</Label>
                            <NumericInput 
                                disabled={this.state.noPaxArrival}
                                name='pax.arrival.CHD' 
                                value={data['pax.arrival.CHD']} 
                                onChange={this.handleInputValueChange} />
                        </Item>
                        <Item fixedLabel>
                            <Label style={{fontSize: 12}}>МЛАДЕНЦЫ</Label>
                            <NumericInput
                                disabled={this.state.noPaxArrival} 
                                name='pax.arrival.INF' 
                                value={data['pax.arrival.INF']} 
                                onChange={this.handleInputValueChange} />
                        </Item>
                    </View>}
                    <Text style={{paddingTop: 10, textAlign: 'center', fontSize: 14}}>ТРАНЗИТ</Text>
                    <Item fixedLabel>
                        <Label style={{fontSize: 12}}>ВЗРОСЛЫЕ</Label>
                        <NumericInput
                            name='pax.transit.ADT' 
                            value={data['pax.transit.ADT']} 
                            onChange={this.handleInputValueChange} />
                    </Item>
                    <Item fixedLabel>
                        <Label style={{fontSize: 12}}>ДЕТИ</Label>
                        <NumericInput 
                            name='pax.transit.CHD' 
                            value={data['pax.transit.CHD']} 
                            onChange={this.handleInputValueChange} />
                    </Item>
                    <Item fixedLabel>
                        <Label style={{fontSize: 12}}>МЛАДЕНЦЫ</Label>
                        <NumericInput 
                            name='pax.transit.INF' 
                            value={data['pax.transit.INF']} 
                            onChange={this.handleInputValueChange} />
                    </Item>
                    <Text style={{paddingTop: 10, textAlign: 'center', fontSize: 14}}>БАГАЖ</Text>
                    {/*<ListItem style={{paddingLeft: 10}}>
                        <CheckBox checked={this.state.noLuggage} onPress={this.toggleLuggage} />
                        <Body>
                            <Text style={{fontSize: 12}}>НЕТ БАГАЖА</Text>
                        </Body>
                    </ListItem>*/}
                    {!this.state.noLuggage && <Item fixedLabel last>
                        <Label style={{fontSize: 12}}>БАГАЖ</Label>
                        <NumericInput 
                            disabled={this.state.noLuggage}
                            name='luggage' 
                            value={data['luggage']} 
                            onChange={this.handleInputValueChange} />
                    </Item>}
                </Form>}
            </BaseModal>
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