import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {Dark} from '../MapStyles';
import URL from '../config/endpoints';
import BottomDrawer from '../components/bottomDrawer/BottomDrawer';
import Slider from '@react-native-community/slider';

import {checkHasLocationPermission} from '../utils/functions';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

const MINIMUM_VALUE_FOR_DISTANCE = 1;
const MAXIMUM_VALUE_FOR_DISTANCE = 80;

const MINIMUM_VALUE_FOR_NUMBER_OF_SCOOTERS = 1;
const MAXIMUM_VALUE_FOR_NUMBER_OF_SCOOTERS = 200;

class HomeScreen extends React.Component {
  drawer;
  map;
  constructor(props) {
    super(props);
    this.state = {
      darkMode: false,
      ready: true,
      numberOfScooters: 10,
      coordinates: [],
      maximumDistance: 10,
      scooters: [],
      region: {
        latitude: 3.2,
        longitude: 103.4,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  getScooters(initialCoordinates) {
    const {maximumDistance, numberOfScooters, coordinates} = this.state;
    fetch(URL.getNearbyScooters, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: initialCoordinates || coordinates,
        numberOfScooters: numberOfScooters,
        maxDistance: maximumDistance * 1000,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('response----->', json);
        this.setState(
          {scooters: json.scooters ? json.scooters : this.state.scooters},
          () => {
            this.drawer.closeBottomDrawer();
            this.map.fitToElements(true);
          },
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    let hasLocationPermission = checkHasLocationPermission();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          const coordinates = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          this.setState(
            {
              region,
              coordinates,
            },
            () => {
              this.getScooters(coordinates);
              this.map.animateToRegion(region, 10);
            },
          );
        },
        (error) => {
          console.log(error.code, error.message);
          Alert.alert('', error.message);
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000},
      );
    }
  }
  render() {
    const {darkMode, maximumDistance, numberOfScooters, scooters} = this.state;

    return (
      <SafeAreaView
        style={[
          Styles.container,
          {backgroundColor: darkMode ? '#121212' : '#FFFFFF'},
        ]}>
        <StatusBar
          barStyle={darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={darkMode ? '#121212' : '#FFFFFF'}
        />
        <View style={Styles.container}>
          <MapView
            ref={(comp) => (this.map = comp)}
            provider={PROVIDER_GOOGLE}
            style={Styles.map}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={false}
            followsUserLocation
            customMapStyle={darkMode ? Dark : []}
            onRegionChange={(region) => {
              // this.setState({region: region}, () =>
              //   setTimeout(() => this.drawer.closeBottomDrawer(), 200),
              // );
              this.drawer.closeBottomDrawer();
            }}>
            {scooters.map((marker) => {
              return (
                <Marker
                  coordinate={{
                    latitude: marker.location.coordinates[1],
                    longitude: marker.location.coordinates[0],
                  }}
                  title={marker.scooter_id.toString()}
                  description={marker.address}
                  image={require('../assets/images/scooter.png')}
                />
              );
            })}
          </MapView>

          <BottomDrawer
            ref={(component) => (this.drawer = component)}
            containerHeight={320}
            backgroundColor={this.state.darkMode ? '#121212' : '#FFF'}
            roundedEdges={true}
            shadow={true}
            startUp={false}>
            <View style={Styles.options}>
              <View style={Styles.horizontalLine} />
              <View style={Styles.optionsContainer}>
                <Text style={Styles.text}>
                  Distance (KM): {maximumDistance}
                </Text>
                <View style={Styles.sliderHintValueContainer}>
                  <Text style={Styles.sliderLeftHintValue}>
                    {MINIMUM_VALUE_FOR_DISTANCE}
                  </Text>
                  <Text style={Styles.sliderRightHintValue}>
                    {MAXIMUM_VALUE_FOR_DISTANCE}
                  </Text>
                </View>
                <Slider
                  style={Styles.slider}
                  step={1}
                  value={maximumDistance}
                  onValueChange={(value) =>
                    this.setState({maximumDistance: value})
                  }
                  minimumValue={MINIMUM_VALUE_FOR_DISTANCE}
                  maximumValue={MAXIMUM_VALUE_FOR_DISTANCE}
                  minimumTrackTintColor="#744BFF"
                  maximumTrackTintColor="#744BFF"
                  thumbTintColor="#744BFF"
                />
                <Text style={Styles.text}>
                  Number of Scooters: {numberOfScooters}
                </Text>
                <View style={Styles.sliderHintValueContainer}>
                  <Text style={Styles.sliderLeftHintValue}>
                    {MINIMUM_VALUE_FOR_NUMBER_OF_SCOOTERS}
                  </Text>
                  <Text style={Styles.sliderRightHintValue}>
                    {MAXIMUM_VALUE_FOR_NUMBER_OF_SCOOTERS}
                  </Text>
                </View>
                <Slider
                  style={Styles.slider}
                  step={1}
                  value={numberOfScooters}
                  onValueChange={(value) =>
                    this.setState({numberOfScooters: value})
                  }
                  minimumValue={MINIMUM_VALUE_FOR_NUMBER_OF_SCOOTERS}
                  maximumValue={MAXIMUM_VALUE_FOR_NUMBER_OF_SCOOTERS}
                  minimumTrackTintColor="#744BFF"
                  maximumTrackTintColor="#744BFF"
                  thumbTintColor="#744BFF"
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => this.getScooters()}>
                <View style={Styles.search}>
                  <Text style={Styles.searchLabel}>Search</Text>
                </View>
              </TouchableOpacity>
            </View>
          </BottomDrawer>
          <View style={Styles.headerContainer}>
            <Text style={Styles.headerLabel}>Find your ride</Text>
          </View>
          <TouchableOpacity
            onPress={() => this.setState({darkMode: !this.state.darkMode})}
            activeOpacity={0.75}
            style={Styles.darkModeButton}>
            <Text style={Styles.darkModeButtonLabel}>
              {this.state.darkMode ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    // height: '81%',
    // width: '100%',
    flex: 1,
  },
  options: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 16,
    left: 14,
  },
  headerLabel: {
    color: '#744BFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  darkModeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    borderRadius: 34,
    backgroundColor: '#744BFF',
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  darkModeButtonLabel: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  optionsContainer: {
    flex: 1,
    marginHorizontal: '10%',
  },
  text: {
    color: '#744BFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  horizontalLine: {
    marginTop: 12,
    width: 40,
    height: 2,
    backgroundColor: '#DEDEDE',
    alignSelf: 'center',
  },
  search: {
    borderRadius: 34,
    backgroundColor: '#744BFF',
    alignSelf: 'center',
    paddingHorizontal: 50,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchLabel: {
    color: '#FFF',
    fontSize: 16,
  },
  slider: {
    width: '100%',
    height: 50,
  },
  sliderHintValueContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: -10,
    justifyContent: 'space-between',
  },
  sliderLeftHintValue: {
    marginLeft: 10,
    textAlign: 'left',
    color: '#744BFF',
  },
  sliderRightHintValue: {
    marginRight: 10,
    textAlign: 'right',
    color: '#744BFF',
  },
});

export default HomeScreen;
