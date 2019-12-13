import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';

const SOPPAgentArrivalDataView = ({openModal, data, editable=true}) => {
    const noPaxArrival = !data.pax.arrival;
    const noLuggage = data.luggage !== 0 && !data.luggage;
    const paxSetted = data.pax.arrival && (data.pax.arrival.ADT || data.pax.arrival.CHD || data.pax.arrival.INF);
    
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#ccc'}}>
            <View style={{paddingTop: 3}}>
                <View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{paddingRight: 10}}>
                            <Text style={{fontSize: 10, textDecorationLine: 'underline'}}>ПРИЛЕТ</Text>
                            {!noPaxArrival 
                                ? <View style={{flexDirection: 'row', paddingTop: 5}}>
                                    <View style={{paddingRight: 10}}>
                                        <Text style={styles.infoText}>ВЗРОСЛЫЕ:</Text>
                                        <Text style={styles.infoText}>ДЕТИ:</Text>
                                        <Text style={styles.infoText}>МЛАДЕНЦЫ:</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.infoText}>{paxSetted ? data.pax.arrival.ADT : '-'}</Text>
                                        <Text style={styles.infoText}>{paxSetted ? data.pax.arrival.CHD : '-'}</Text>
                                        <Text style={styles.infoText}>{paxSetted ? data.pax.arrival.INF : '-'}</Text>
                                    </View>
                                </View>
                                : <Text style={{...styles.infoText, paddingTop: 5}}>НЕТ ПАССАЖИРОВ</Text>
                            }

                        </View>
                        <View>
                            <Text style={{fontSize: 10, textDecorationLine: 'underline'}}>ТРАНЗИТ</Text>
                            <View style={{flexDirection: 'row', paddingTop: 5}}>
                                <View style={{paddingRight: 10}}>
                                    <Text style={styles.infoText}>ВЗРОСЛЫЕ:</Text>
                                    <Text style={styles.infoText}>ДЕТИ:</Text>
                                    <Text style={styles.infoText}>МЛАДЕНЦЫ:</Text>
                                </View>
                                <View>
                                    <Text style={styles.infoText}>{data.pax.transit.ADT}</Text>
                                    <Text style={styles.infoText}>{data.pax.transit.CHD}</Text>
                                    <Text style={styles.infoText}>{data.pax.transit.INF}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{paddingTop: 5}}>
                    <Text style={styles.infoText}>БАГАЖ: {noLuggage ? 'НЕТ' : (data.luggage || '-')}</Text>
                </View>
            </View>
            {editable && <View style={{justifyContent: 'center'}}>
                <Button transparent onPress={openModal}><Text>ИЗМЕНИТЬ</Text></Button>
            </View>}
        </View>
    );
}

const styles = {
    infoText: {
        fontSize: 12,
        textAlign: 'left',
        alignSelf: 'flex-start'
    }
};

export default SOPPAgentArrivalDataView;