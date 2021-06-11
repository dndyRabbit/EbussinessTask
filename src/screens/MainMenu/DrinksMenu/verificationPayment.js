import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {images, COLORS, SIZES} from '../../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const VerificationPayment = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{
          uri:
            'https://cdn3.iconfinder.com/data/icons/flat-office-icons-1/140/Artboard_1-11-512.png',
        }}
        style={{width: 200, height: 200, position: 'absolute', top: 300}}
        resizeMode="cover"
      />
      <Image
        source={{
          uri:
            'https://cdn.iconscout.com/icon/free/png-256/refreshment-drink-1540557-1305560.png',
        }}
        style={{width: 200, height: 200, position: 'absolute', top: 20}}
        resizeMode="cover"
      />
      <Image
        source={{
          uri:
            'https://freepngimg.com/download/cloud/78635-decorative-vector-clouds-papercutting-pattern-effect-cutting.png',
        }}
        style={{width: 300, height: 200, position: 'absolute', top: 100}}
        resizeMode="contain"
      />
      <Image
        source={{
          uri:
            'https://www.pngkey.com/png/full/20-201026_money-png-money-vector-png.png',
        }}
        style={{
          width: 100,
          height: 200,
          position: 'absolute',
          top: 330,
          right: 80,
        }}
        resizeMode="contain"
      />
      <View
        style={{
          width: SIZES.width,
          padding: 20,
          alignSelf: 'flex-end',
          alignItems: 'center',
          position: 'absolute',
          bottom: 10,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Pembayaran Anda Sedang di Proses Mohon di tunggu yaaa :D
        </Text>

        <Text
          style={{
            textAlign: 'center',
            color: '#d1d9d9',
            fontSize: 14,
            fontWeight: 'bold',
          }}>
          Lihat Pesanan anda di:
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#d1d9d9',
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          Profile {'->'} Pesanan Saya
        </Text>
        <TouchableOpacity
          onPress={() => navigation.replace('Home')}
          style={{
            width: SIZES.width * 0.5,
            padding: 10,
            backgroundColor: '#ffb26b',
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Kembali ke Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  rulerLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default VerificationPayment;
