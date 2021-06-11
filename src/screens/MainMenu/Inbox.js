import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {images, COLORS, SIZES} from '../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../../AppNavigator/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const Inbox = ({navigation}) => {
  const {user} = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontSize: 26,
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#d1d9d9',
        }}>
        Belum Ada Inbox nih
      </Text>
      <Image
        source={{
          uri:
            'https://www.tekportal.net/wp-content/uploads/2018/11/unknown.png',
        }}
        style={{
          width: SIZES.width,
          height: SIZES.height,
          position: 'absolute',
          opacity: 0.1,
        }}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 20,
  },
  rulerLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Inbox;
