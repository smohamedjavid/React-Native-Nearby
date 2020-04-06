import React from 'react';
import {View, StyleSheet, Text, StatusBar, ToastAndroid, BackHandler} from 'react-native';
import {checkHasLocationPermission} from '../utils/functions';

class SplashScreen extends React.Component {
  componentDidMount() {
    let hasLocationPermission = checkHasLocationPermission();
    if(hasLocationPermission) {
      setTimeout(() => this.props.navigation.replace('Find'), 2000);
    } else {
      ToastAndroid.show(
        'App will work only when location enabled. Please turn on the location.',
        ToastAndroid.LONG,
      );
      BackHandler.exitApp();
    }
  }
  render() {
    return (
      <View style={Styles.container}>
         <StatusBar barStyle={'light-content'} translucent={true} backgroundColor='transparent' />
        <Text style={Styles.text}>BEAM</Text>
        <Text style={Styles.subtitle}>Dev'd by Javid</Text>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#744BFF',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF'
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#FFF'
  }
});

export default SplashScreen;
