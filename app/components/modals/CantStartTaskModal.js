import React from 'react';
import {
    Button,
    Text
} from 'native-base';

import BaseModal from './BaseModal';

export default class CantStartTaskModal extends React.Component {
    render() {
        const { visible, setModalVisible } = this.props;

        return (
            <BaseModal
                onRequestClose = {() => setModalVisible(false)}
                visible={visible}
                actionsComponent={<Button transparent style={{alignSelf: 'flex-end'}} onPress={() => setModalVisible(false)}><Text>ЗАКРЫТЬ</Text></Button>}
            >
                <Text style={{padding: 10, paddingBottom: 20}}>Вы не можете начать выполнение задачи пока есть другие незавершенные задачи.</Text>
            </BaseModal>
        );
    }
}
