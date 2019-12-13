import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';

export default SOPPDriverArrivalDataView = ({openModal, data, editable=true}) => (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <View style={!editable && {paddingTop: 3}}>
            <View>
                <Text style={styles.infoText}>БАГАЖ: {data.luggage}</Text>
            </View>
        </View>
        {editable && <View style={{justifyContent: 'center'}}>
            <Button transparent onPress={openModal}><Text>ИЗМЕНИТЬ</Text></Button>
        </View>}
    </View>
)

const styles = {
    infoText: {
        fontSize: 12,
        textAlign: 'left',
        alignSelf: 'flex-start'
    }
};