import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {images, COLORS, SIZES} from '../../../constants';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../../AppNavigator/AuthProvider';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {Input} from 'react-native-elements';

const userProfiles = ({navigation, route}) => {
  const [userData, setUserData] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [loading, setLoading] = useState(true);

  const {user, logout} = useContext(AuthContext);

  useEffect(() => {
    setLoading(false);
    getUser();
  }, [loading]);

  const pickPhotos = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image.path);
    });
  };

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data : ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  const handleUpdate = async () => {
    let imgUrl = await uploadImage();

    if (imgUrl === null && userData.userImg) {
      imgUrl = userData.userImg;
    }

    firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        fname: userData.fname,
        lname: userData.lname,
        phone: userData.phone,
        location: userData.location,
        mapLocation: route.params,
        userImg: imgUrl,
      })
      .then(() => {
        console.log('user Updated!');
        Alert.alert(
          'Profile Updated!',
          'Your profile has been updated successfully!',
        );
        setImage(null);
        setLoading(true);
      });
  };

  const uploadImage = async () => {
    if (image === null) {
      return null;
    }

    //get the image URL
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    //add timestamps to file Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    //store the images to cloud storage firebase
    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    //set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setUploading(false);
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  //create a billing first to use it
  const getCurrentLocation = async () => {
    await fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        latitude +
        ',' +
        longitude +
        '&key=' +
        'AIzaSyA8ElaVFODmITeeRdzg-zmZPu_-MDRgPVs',
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(
          'ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson),
        );
      });
  };

  const RenderBackground = () => {
    return (
      <View style={{position: 'absolute'}}>
        <Image
          source={images.Background}
          style={{width: SIZES.width, height: SIZES.height}}
          resizeMode="cover"
        />
        <View
          style={{
            backgroundColor: 'black',
            width: SIZES.width,
            height: SIZES.height,
            position: 'absolute',
            opacity: 0.85,
          }}
        />
      </View>
    );
  };

  function renderUpdateProfiles() {
    return (
      <View
        style={{
          width: SIZES.width,
          padding: SIZES.padding * 2,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{marginBottom: 10, marginLeft: -10}}>
          <Icon name="keyboard-backspace" size={25} color={COLORS.button} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            color: COLORS.button,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          UPDATE PROFILE
        </Text>

        {/* Foto Profiles */}
        <View
          style={{
            padding: SIZES.padding,
            marginTop: -10,
            width: '100%',
            alignItems: 'center',
          }}>
          <Image
            source={{
              uri: userData.userImg
                ? userData.userImg
                : image
                ? image
                : 'https://images-platform.99static.com/ky8wEq_DEdvfN0l2lmUSfuVYL0g=/0x0:2000x2000/500x500/top/smart/99designs-contests-attachments/107/107446/attachment_107446690',
            }}
            resizeMode="cover"
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
              marginBottom: 10,
              borderRadius: 200 / 2,
              borderWidth: 3,
              borderColor: COLORS.button,
            }}
          />
          <TouchableOpacity
            onPress={pickPhotos}
            style={{
              width: 32,
              height: 27,
              top: '36%',
              borderWidth: 1,
              borderColor: COLORS.button,
              borderRadius: 3,
              position: 'absolute',
            }}>
            <Icon name="camera" size={30} color={COLORS.button} />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            marginTop: -10,
            fontSize: 16,
            fontWeight: 'bold',
            marginVertical: 5,
            color: COLORS.secondary,
            textAlign: 'center',
          }}>
          {userData ? userData.fname : ''} {userData ? userData.lname : ''}{' '}
        </Text>

        {/* first name */}
        <Input
          placeholder="First name..."
          value={userData ? userData.fname : ''}
          onChangeText={text => setUserData({...userData, fname: text})}
          leftIcon={<Icon name="account" size={20} color={COLORS.button} />}
          containerStyle={{marginBottom: -20}}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.secondary,
            padding: SIZES.padding,
            fontSize: 14,
          }}
        />

        {/* last name */}
        <Input
          placeholder="Last name..."
          value={userData ? userData.lname : ''}
          onChangeText={text => setUserData({...userData, lname: text})}
          leftIcon={<Icon name="account" size={20} color={COLORS.button} />}
          containerStyle={{marginBottom: -20}}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.secondary,
            padding: SIZES.padding,
            fontSize: 14,
          }}
        />

        {/* phone */}
        <Input
          placeholder="Phone..."
          value={userData ? userData.phone : ''}
          onChangeText={text => setUserData({...userData, phone: text})}
          leftIcon={<Icon name="phone" size={20} color={COLORS.button} />}
          containerStyle={{marginBottom: -20}}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.secondary,
            padding: SIZES.padding,
            fontSize: 14,
          }}
        />

        {/* location */}
        <Input
          placeholder="Alamat Lengkap..."
          leftIcon={
            <Icon name="map-marker-radius" size={20} color={COLORS.button} />
          }
          value={userData ? userData.location : ''}
          onChangeText={text => setUserData({...userData, location: text})}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.secondary,
            padding: SIZES.padding,
            fontSize: 14,
          }}
        />

        {uploading ? (
          <View style={{alignSelf: 'center'}}>
            <Text
              style={{
                fontStyle: 'italic',
                fontSize: 14,
                color: COLORS.secondary,
              }}>
              {transferred} % Completed
            </Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => handleUpdate()}
            style={{
              width: '100%',
              height: 55,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: COLORS.button,
              borderRadius: 3,
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <View
              style={{
                backgroundColor: `${COLORS.button}77`,
                width: '95%',
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: COLORS.button,
                borderRadius: 3,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.secondary,
                  fontWeight: 'bold',
                }}>
                Update Profile
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RenderBackground />
      <ScrollView>
        {renderUpdateProfiles()}
        {/* logout */}
        <TouchableOpacity
          onPress={() => logout()}
          style={{
            borderWidth: 1,
            borderColor: COLORS.button,
            width: 60,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            position: 'absolute',
            top: 20,
            right: 20,
          }}>
          <Text
            style={{
              color: COLORS.secondary,
              fontSize: 12,
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});
export default userProfiles;
