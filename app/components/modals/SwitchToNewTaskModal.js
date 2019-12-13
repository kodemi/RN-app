import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'native-base';

import BaseModal from './BaseModal';

export default class SwitchToNewTaskModal extends React.Component {

    render() {
        const { visible, setModalVisible, switchToTask } = this.props;
        return (
            <BaseModal
                onRequestClose = {() => setModalVisible(false)}
                visible={visible}
                titleComponent={
                    <Text style={{fontSize: 16, textAlign: 'center', fontWeight: 'bold'}}>НОВАЯ ЗАДАЧА</Text>
                }
                actionsComponent={
                    <View style={styles.modalActions}>
                        <Button transparent onPress={() => switchToTask()}>
                            <Text>ДА</Text>
                        </Button>
                        <Button transparent onPress={() => setModalVisible(false)}>
                            <Text>НЕТ</Text>
                        </Button>
                    </View>
                }
            >
                <Text>Поступила новая задача. Вы хотите переключиться на нее?</Text>
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