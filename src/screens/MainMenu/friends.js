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

const Friends = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState([]);

  const getUser = async () => {
    const list = [];
    await firestore()
      .collection('users')
      .orderBy('createdAt', 'desc')
      .get()
      .then(documentSnapshot => {
        documentSnapshot.forEach(doc => {
          const {
            createdAt,
            email,
            fname,
            lname,
            location,
            phone,
            userImg,
          } = doc.data();
          list.push({
            createdAt,
            email,
            fname,
            lname,
            location,
            phone,
            userImg,
          });
          setUserData(list);
        });
      });
  };

  useEffect(() => {
    console.log(userData);
    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: SIZES.width,
          padding: SIZES.padding * 2,
        }}>
        <Text style={{color: 'white', fontSize: 16}}>THIS IS MY FRIEND </Text>
        <FlatList
          data={userData}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate('ChatTest', {
                    email: item.email,
                    name: item.fname,
                    image: item.userImg,
                  })
                }
                style={{
                  justifyContent: 'center',
                  marginVertical: 10,
                  backgroundColor: 'white',
                }}>
                <Text>{item.email}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <View style={styles.rulerLine} />
      </View>
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
    borderBottomColor: '#f4f4f4',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Friends;
