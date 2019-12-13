import React from 'react';
import { Modal, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Hr from 'react-native-hr';

export default ({
    children, 
    fullscreen=false, 
    titleComponent=null, 
    actionsComponent=null, 
    backdropColor='rgba(0, 0, 0, 0.5)', 
    backgroundColor='#fff',
    contentPadding=10,
    width=300, 
    ...props
}) => (
    <Modal
        animationType={"slide"}
        transparent={true}
        {...props}
    >
        <View style={{flex: 1, padding: 20, backgroundColor: backdropColor, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flex: fullscreen ? 1 : null, width, backgroundColor, paddingVertical: 10, paddingHorizontal: contentPadding}}>
                {titleComponent}
                {!!titleComponent && <Hr lineStyle={{marginTop: 10, backgroundColor: '#ccc' }} />}
                <KeyboardAwareScrollView>
                    {children}
                </KeyboardAwareScrollView>
                {actionsComponent}
            </View>
        </View>
    </Modal>
)