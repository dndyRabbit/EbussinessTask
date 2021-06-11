import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  ScrollView,
} from 'react-native';
import {images, COLORS, SIZES} from '../../../constants';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../../AppNavigator/AuthProvider';

const AlamatMaps = ({navigation}) => {
  const [userData, setUserData] = useState([]);

  const {user} = useContext(AuthContext);

  function renderTambahLocationButton() {
    return (
      <View style={{width: SIZES.width, padding: 20}}>
        <Text>Pilih Alamat</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('locationMaps')}
          style={{
            width: 170,
            height: 40,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: COLORS.button,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
            flexDirection: 'row',
            marginLeft: 20,
          }}>
          <Icon name="map-marker-radius" size={20} color={COLORS.button} />

          <Text style={{color: COLORS.button, fontSize: 12}}>
            Tambah Lokasi baru
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data : ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    console.log(userData);
    getUser();
  }, []);

  function renderLocation() {
    return (
      <View style={{width: SIZES.width, padding: 20}}>
        <Text>
          {' '}
          latitude ~ {userData.mapLocation ? userData.mapLocation.latitude : ''}
        </Text>
        <Text>
          {' '}
          longitude ~{' '}
          {userData.mapLocation ? userData.mapLocation.longitude : ''}
        </Text>
      </View>
    );
  }
  return (
    <SafeAreaView>
      {renderTambahLocationButton()}
      {renderLocation()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});

export default AlamatMaps;
