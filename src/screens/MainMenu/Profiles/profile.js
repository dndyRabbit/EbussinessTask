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

const Profile = ({navigation}) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState(0);

  const {user} = useContext(AuthContext);

  useEffect(() => {
    console.log(size);
    getUser();
    fetchOrderSize();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [loading, navigation]);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
          if (loading) {
            setLoading(false);
          }
        }
      });
  };

  //ambil data order yang sedang berjaan
  const fetchOrderSize = async () => {
    await firestore()
      .collection('order_ongoing')
      .where('userId', '==', user.uid)
      .get()
      .then(querySnapshot => {
        setSize(querySnapshot.size);
      });
  };

  function renderHeader() {
    return (
      <View style={{width: SIZES.width, padding: 20, alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 20,
            alignSelf: 'flex-start',
          }}>
          Profile
        </Text>
        <Image
          source={{uri: userData.userImg}}
          resizeMode="cover"
          style={{width: 150, height: 150, borderRadius: 75, marginBottom: 5}}
        />
        <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
          Hallo! {userData.fname}
        </Text>
        <Text style={{color: '#d1d9d9', fontSize: 12, fontWeight: 'bold'}}>
          {userData.email}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('userProfiles')}
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Icon name="account-edit" size={25} color="#fff" />
          <Text style={{color: '#fff'}}>Edit Profiles</Text>
        </TouchableOpacity>

        <View style={styles.rulerLine} />
        <TouchableOpacity
          onPress={() => navigation.navigate('Delivery')}
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',

            marginBottom: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>
              Semua Pesanan
            </Text>
            {size !== 0 ? (
              <Icon
                name="alert-octagram"
                size={25}
                color="#ffe268"
                style={{position: 'absolute', top: -10, left: -20}}
              />
            ) : null}
            <Icon name="clipboard-list-outline" size={25} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={[styles.rulerLine, {width: '100%', marginTop: -5}]} />

        <TouchableOpacity
          onPress={() => navigation.navigate('AlamatMaps')}
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',

            marginBottom: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>
              Alamat Pengiriman
            </Text>
            <Icon name="map-marker-outline" size={25} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={[styles.rulerLine, {width: '100%', marginTop: -5}]} />

        <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',

            marginBottom: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>
              Tentang ThinkTop
            </Text>
            <Icon name="information-variant" size={25} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={[styles.rulerLine, {width: '100%', marginTop: -5}]} />

        <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',

            marginBottom: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>
              Ketentuan dan Layanan
            </Text>
            <Icon name="security" size={25} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={[styles.rulerLine, {width: '100%', marginTop: -5}]} />
      </View>
    );
  }

  return <SafeAreaView style={styles.container}>{renderHeader()}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  rulerLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Profile;
