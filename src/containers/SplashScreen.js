import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  ToastAndroid,
  BackHandler,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {checkHasLocationPermission} from '../utils/functions';

class SplashScreen extends React.Component {
  componentDidMount() {
    let hasLocationPermission = checkHasLocationPermission();
    if (hasLocationPermission) {
      if (Platform.OS === 'android') {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then((data) => {
            setTimeout(() => this.props.navigation.replace('Find'), 3000);
          })
          .catch((err) => {
            this.exitApp();
          });
      }else{
        setTimeout(() => this.props.navigation.replace('Find'), 2000);
      }
    } else {
      this.exitApp();
    }
  }

  exitApp(){
    ToastAndroid.show(
      'App will work only when location enabled. Please turn on the location.',
      ToastAndroid.LONG,
    );
    // BackHandler.exitApp();
  }
  render() {
    return (
      <View style={Styles.container}>
        <StatusBar
          barStyle={'light-content'}
          translucent={true}
          backgroundColor="transparent"
        />
        <SafeAreaView style={Styles.safeAreaContainer}>
          <View style={Styles.titleContainer}>
            <Text style={Styles.text}>Beam</Text>
          </View>
          <View style={Styles.subtitleContainer}>
            <Text style={Styles.subtitle}>Dev'd by Javid</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#744BFF',
  },
  safeAreaContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#FFF',
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: '10%'
  }
});

export default SplashScreen;
