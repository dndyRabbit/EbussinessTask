import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {images, COLORS, SIZES} from '../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../../AppNavigator/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const CardMenu = ({item, onDelete, onModal}) => {
  const {user} = useContext(AuthContext);
  // const [userData, setUserData] = useState(null);

  // const getUser = async () => {
  //   await firestore()
  //     .collection('users')
  //     .doc(item.userId)
  //     .get()
  //     .then(documentSnapshot => {
  //       if (documentSnapshot.exists) {
  //         setUserData(documentSnapshot.data());
  //       }
  //     });
  // };

  // useEffect(() => {
  //   getUser();
  // }, []);

  return (
    <View
      style={{
        width: 140,
        height: 130,
        marginHorizontal: 10,
        marginVertical: 5,
      }}>
      <Image
        source={{uri: item.postImg}}
        style={{width: 80, height: 80, borderRadius: 80 / 2, marginBottom: 5}}
        resizeMode="cover"
      />

      {item.tags[0] === 'promos' ? (
        <Icon
          name="sale"
          size={25}
          color={COLORS.button}
          style={{position: 'absolute', left: 0, top: 0}}
        />
      ) : null}
      {item.tags[0] === 'favorite' ? (
        <Icon
          name="heart"
          size={25}
          color="#cf0000"
          style={{position: 'absolute', bottom: 50, right: 60}}
        />
      ) : null}

      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[COLORS.button, 'transparent']}
        style={{
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 12,
            color: COLORS.secondary,
            fontWeight: 'bold',
          }}>
          {item.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 10,
            color: COLORS.secondary,
            fontStyle: 'italic',
          }}>
          {item.about}
        </Text>
      </LinearGradient>

      <TouchableOpacity
        onPress={() => onModal(item.id)}
        style={{
          transform: [{rotate: '45deg'}],
          borderWidth: 1,
          borderColor: COLORS.button,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
          position: 'absolute',
          bottom: 40,
          right: 5,
        }}>
        <View
          style={{
            backgroundColor: `${COLORS.button}77`,
            width: 45,
            height: 45,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: COLORS.button,
          }}>
          <View
            style={{
              justifyContent: 'center',
              transform: [{rotate: '-45deg'}],
            }}>
            <Text
              style={{
                color: COLORS.secondary,
                fontSize: 10,
              }}>
              Rp.
            </Text>
            <Text
              style={{
                color: COLORS.secondary,
                fontSize: 10,
              }}>
              {item.price}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {user.uid === item.userId ? (
        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          style={{position: 'absolute', top: 0, right: 0}}>
          <Icon name="delete" size={20} color={COLORS.button} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default CardMenu;
