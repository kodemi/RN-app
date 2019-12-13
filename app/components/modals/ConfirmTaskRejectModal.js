import React from 'react';
import {
    Text,
    Button
} from 'native-base';
import {
    View
} from 'react-native';

import BaseModal from './BaseModal';

export default class ConfirmTaskRejectModal extends React.Component {
    render() {
        const { visible, confirmReject, cancelReject } = this.props;

        return (
            <BaseModal
                onRequestClose = {cancelReject}
                visible={visible}
                titleComponent={
                    <Text style={{fontSize: 16, textAlign: 'center', fontWeight: 'bold'}}>ПОДТВЕРДИТЕ ТЕХ. ОТКАЗ</Text>
                }
            >
                <View> 
                    <Button block large danger onPress={confirmReject}><Text style={{color: 'white'}}>ПОДТВЕРЖДАЮ</Text></Button>
                    <Button block large light onPress={cancelReject} style={{marginTop: 10}}><Text>ОТМЕНА</Text></Button>
                </View>
            </BaseModal>
        );
    }
}