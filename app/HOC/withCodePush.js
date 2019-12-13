import React from 'react';
import { View } from 'react-native';
import codePush from 'react-native-code-push';
import cmp from 'semver-compare';

import DownloadProgress from '../components/DownloadProgress';
import { showMessage } from '../utils';
import { getAppVersion, downloadAppFile } from '../api';

const codePushOptions = {
    installMode: codePush.InstallMode.ON_NEXT_RESUME, 
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};

export default function withCodePush(WrappedComponent) {
    class WithCodePush extends React.Component {
        state = {
            downloading: false,
            downloadProgress: 0
        }

        codePushStatusDidChange(status) {
            switch(status) {
                case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                    console.log("Checking for updates.");
                    getAppVersion().then(version => {
                        if (version && cmp(version, this.props.device.appVersion) === 1) {
                            showMessage("Доступно обновление", {type: 'info', duration: 'indefinite', action: {title: 'ЗАГРУЗИТЬ', onPress: () => {
                                downloadAppFile(progress => this.setState({downloading: progress < 0.999, downloadProgress: progress}));
                            }}});
                        }
                    })
                    break;
                case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                    console.log("Downloading package.");
                    showMessage("Загружается обновление", {type: "info"});
                    break;
                case codePush.SyncStatus.INSTALLING_UPDATE:
                    console.log("Installing update.");
                    break;
                case codePush.SyncStatus.UP_TO_DATE:
                    console.log("Up-to-date.");
                    break;
                case codePush.SyncStatus.UPDATE_INSTALLED:
                    console.log("Update installed.");
                    showMessage("Приложение обновлено", {type: 'success', duration: 'indefinite', action: {title: 'ПЕРЕЗАПУСТИТЬ', onPress: () => codePush.restartApp()}});
                    break;
            }
        }

        render() {
            return (
                <View style={{flex: 1}}>
                    <WrappedComponent {...this.props} />
                    {this.state.downloading && <DownloadProgress progress={this.state.downloadProgress} />}
                </View>
            )
        }
    }
    WithCodePush.displayName = `WithCodePush(${getDisplayName(WrappedComponent)})`;

    return codePush(codePushOptions)(WithCodePush);
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}