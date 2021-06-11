import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {images, COLORS, SIZES} from '../../../constants';
import {AuthContext} from '../../../AppNavigator/AuthProvider';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Input} from 'react-native-elements';
import MultiSelect from 'react-native-multiple-select';

const tags = [
  {
    id: 1,
    name: 'favorite',
  },
  {
    id: 2,
    name: 'promos',
  },
  {
    id: 3,
    name: 'combo',
  },
];

const InputMenu = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [title, setTitle] = useState(null);
  const [price, setPrice] = useState(null);
  const [about, setAbout] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const onSelectedItemsChange = selectedItems => {
    setSelectedTags(selectedItems);
  };

  const pickPhotos = () => {
    ImagePicker.openPicker({
      width: 600,
      height: 600,
      cropping: true,
    }).then(image => {
      setImage(image.path);
    });
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    firestore()
      .collection('drinks')
      .add({
        userId: user.uid,
        title,
        about,
        price,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        tags: selectedTags,
      })
      .then(() => {
        Alert.alert(
          'Post Published',
          'Your Post has been Published to the Firestore Successfully!',
        );
        setTitle(null);
        setAbout(null);
        setImage(null);
        setPrice(null);
        setSelectedTags([]);
      })
      .catch(error => {
        console.log('Something wrong when post to firebase.', error);
      });
  };

  const uploadImage = async () => {
    if (image === null) {
      return null;
    }

    //get the image url
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    //add the timestamp filename
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

  React.useEffect(() => {
    console.log(selectedTags);
  }, [selectedTags]);

  function renderInputContent() {
    return (
      <View
        style={{
          width: SIZES.width,
          padding: SIZES.padding * 2,
          paddingBottom: 60,
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
          INPUT NEW MENU!
        </Text>

        {/* nama minuman */}
        <Input
          placeholder="Nama Minuman..."
          leftIcon={<Icon name="beer" size={20} color={COLORS.button} />}
          value={title}
          containerStyle={{marginBottom: -20}}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.secondary,
            padding: SIZES.padding,
            fontSize: 14,
          }}
          onChangeText={value => setTitle(value)}
        />

        {/* About minuman */}
        <Input
          placeholder="Tentang Minuman..."
          leftIcon={
            <Icon name="information-variant" size={20} color={COLORS.button} />
          }
          value={about}
          containerStyle={{marginBottom: -20}}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.secondary,
            padding: SIZES.padding,
            fontSize: 14,
          }}
          onChangeText={value => setAbout(value)}
        />

        {/* Harga Minuman */}
        <Input
          placeholder="Harga..."
          leftIcon={
            <Icon name="currency-usd" size={20} color={COLORS.button} />
          }
          value={price}
          keyboardType="numeric"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.secondary,
            padding: SIZES.padding,
            fontSize: 14,
          }}
          onChangeText={value => setPrice(value)}
        />

        <MultiSelect
          items={tags}
          uniqueKey="name"
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedTags}
          selectText="Tags"
          searchInputPlaceholderText="Search tags..."
          onChangeInput={text => console.log(text)}
          tagRemoveIconColor={COLORS.button}
          tagBorderColor={COLORS.button}
          tagTextColor="#CCC"
          selectedItemTextColor={COLORS.button}
          selectedItemIconColor={COLORS.button}
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{color: '#CCC'}}
          submitButtonColor={COLORS.button}
          submitButtonText="Submit"
          styleDropdownMenu={{
            width: '93%',
            marginLeft: 10,
            marginTop: -15,
          }}
          styleTextDropdown={{marginLeft: 10, fontStyle: 'italic'}}
          styleSelectorContainer={{
            width: '93%',
            marginLeft: 10,
            marginTop: -15,
          }}
          styleItemsContainer={{width: '100%'}}
        />

        {/* Foto Produk */}
        <View
          style={{
            padding: SIZES.padding,
            marginTop: -10,
            width: '100%',
          }}>
          <Image
            source={{
              uri: image
                ? image
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6bkZX4V5o8QaYeLVo2nYurPqwOS4hDeVytU5BCz7NOPUC9hLp0vZDYIofJzDBpT2XHhc&usqp=CAU',
            }}
            resizeMode="cover"
            style={{
              width: 200,
              height: 200,
              borderRadius: 10,
              marginBottom: 10,
              borderRadius: 3,
              borderWidth: 3,
              borderColor: COLORS.button,
            }}
          />
          <TouchableOpacity
            onPress={pickPhotos}
            style={{
              width: 115,
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: COLORS.button,
              borderRadius: 3,
            }}>
            <View
              style={{
                backgroundColor: `${COLORS.button}77`,
                width: 100,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: COLORS.button,
                borderRadius: 3,
              }}>
              <Text
                style={{
                  fontStyle: 'italic',
                  fontSize: 12,
                  color: COLORS.button,
                }}>
                Pick A Picture!
              </Text>
            </View>
          </TouchableOpacity>
        </View>

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
            onPress={submitPost}
            disabled={image ? false : true}
            style={{
              width: '100%',
              height: 55,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: COLORS.button,
              borderRadius: 3,
              alignSelf: 'center',
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
                Submit
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
      <ScrollView>{renderInputContent()}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});

export default InputMenu;
