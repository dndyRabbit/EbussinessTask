import React, {useState, useEffect} from 'react';
import {ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {images, COLORS, SIZES} from '../../../constants';

const initialState = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const locationMaps = ({navigation}) => {
  const [currentPosition, setCurrentPosition] = useState(initialState);

  useEffect(() => {
    console.log(currentPosition);
    Geolocation.getCurrentPosition(
      position => {
        // alert(JSON.stringify(position));
        const {latitude, longitude} = position.coords;
        setCurrentPosition({
          ...currentPosition,
          latitude,
          longitude,
        });
      },
      error => console.log(error.message),
    );
  }, []);

  return currentPosition.latitude ? (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        initialRegion={currentPosition}
        showsUserLocation
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('userProfiles', {
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
          })
        }
        style={{
          width: '90%',
          height: 40,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: COLORS.button,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
          flexDirection: 'row',
          marginLeft: 20,
          position: 'absolute',
          bottom: 40,
          backgroundColor: `${COLORS.button}77`,
        }}>
        <Text style={{color: COLORS.secondary, fontWeight: 'bold'}}>
          Get My Current Location
        </Text>
      </TouchableOpacity>
    </>
  ) : (
    <ActivityIndicator style={{flex: 1}} animating size="large" />
  );
};

export default locationMaps;
