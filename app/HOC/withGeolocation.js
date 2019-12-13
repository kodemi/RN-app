import React from 'react';
import { connect } from 'react-redux';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import geolib from 'geolib';

import { setGeolocationStarted } from '../ducks/device';

const AIRPORT_AREA = [
    {latitude: 55.583981, longitude: 37.233854},
    {latitude: 55.594773, longitude: 37.239219},
    {latitude: 55.612557, longitude: 37.274281},
    {latitude: 55.596960, longitude: 37.302390},
    {latitude: 55.583532, longitude: 37.249411},
];

export default function withGeolocation(WrappedComponent) {
    class WithGeolocation extends React.Component {
        state = {
            position: null,
            inArea: false
        }

        componentWillMount() {
            BackgroundGeolocation.configure({
                // startForeground: false,
                desiredAccuracy: 10,
                stationaryRadius: 20,
                distanceFilter: 50,
                locationTimeout: 30,
                notificationTitle: 'Определение местоположения',
                notificationText: 'Включено',
                // debug: true,
                startOnBoot: false,
                stopOnTerminate: true,
                locationProvider: BackgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
                interval: 10000,
                fastestInterval: 5000,
                activitiesInterval: 10000,
                stopOnStillActivity: false,
                // url: 'http://192.168.81.15:3000/location'
            });
            BackgroundGeolocation.on('location', this.onLocation);
            BackgroundGeolocation.on('error', this.onError);
            BackgroundGeolocation.start(this.start);
        }

        onLocation = (location) => {
            const { latitude, longitude, time, speed, accuracy } = location;
            this.setState({
                position: { latitude, longitude, timestamp: time, speed, accuracy },
                inArea: geolib.isPointInside({latitude, longitude}, AIRPORT_AREA)
            });
        }

        onError = (error) => console.log('[ERROR] BackgroundGeolocation error:', error)

        start = () => {
            console.log('[DEBUG] BackgroundGeolocation started successfully'); 
            this.props.setGeolocationStarted(true);   
        }

        render() {
            return <WrappedComponent location={this.state.location} inArea={this.state.inArea} {...this.props} />;
        }
    }

    WithGeolocation.displayName = `WithGeolocation(${getDisplayName(WrappedComponent)})`;
    
    return connect(null, {setGeolocationStarted})(WithGeolocation);
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

