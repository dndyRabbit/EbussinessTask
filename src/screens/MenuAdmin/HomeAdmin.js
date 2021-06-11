import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {images, COLORS, SIZES} from '../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../AppNavigator/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const HomeAdmin = ({navigation}) => {
  const {user} = useContext(AuthContext);

  function renderHeader() {
    return (
      <View style={{width: SIZES.width, padding: 20}}>
        <TouchableOpacity
          style={{marginLeft: -20}}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} color={COLORS.button} />
        </TouchableOpacity>
        <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
          Hello Admin!, {user.email}
        </Text>
      </View>
    );
  }

  function renderNavigation() {
    return (
      <View style={{width: SIZES.width, padding: 20}}>
        {/* Input Menu */}
        <TouchableOpacity
          onPress={() => navigation.navigate('InputMenu')}
          style={{
            width: '100%',
            padding: 10,
            borderWidth: 1,
            borderColor: COLORS.button,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: `${COLORS.button}77`,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <Text style={{color: '#fff'}}>Input Menu</Text>
            <Icon name="database-import" size={25} color={COLORS.button} />
          </View>
        </TouchableOpacity>

        {/* Riwayat Penjualan */}
        <TouchableOpacity
          onPress={() => navigation.navigate('SalesHistory')}
          style={{
            width: '100%',
            padding: 10,
            borderWidth: 1,
            borderColor: COLORS.button,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: `${COLORS.button}77`,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <Text style={{color: '#fff'}}>Riwayat Penjualan</Text>
            <Icon name="history" size={25} color={COLORS.button} />
          </View>
        </TouchableOpacity>

        {/* Konfirmasi Pembayaran */}
        <TouchableOpacity
          onPress={() => navigation.navigate('PaymentConfirmation')}
          style={{
            width: '100%',
            padding: 10,
            borderWidth: 1,
            borderColor: COLORS.button,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: `${COLORS.button}77`,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <Text style={{color: '#fff'}}>Konfirmasi Pembayaran </Text>
            <Icon name="beaker-check-outline" size={25} color={COLORS.button} />
          </View>
        </TouchableOpacity>

        {/* Outlet Manage */}
        <TouchableOpacity
          onPress={() => navigation.navigate('OutletManage')}
          style={{
            width: '100%',
            padding: 10,
            borderWidth: 1,
            borderColor: COLORS.button,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: `${COLORS.button}77`,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <Text style={{color: '#fff'}}>Manage Outlet</Text>
            <Icon name="store-outline" size={25} color={COLORS.button} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderNavigation()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  rulerLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#053975',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default HomeAdmin;
