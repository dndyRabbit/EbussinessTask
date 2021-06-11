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
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../../AppNavigator/AuthProvider';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const FinishPayment = ({route, navigation}) => {
  const [timerCount, setTimer] = useState(300);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const {user} = useContext(AuthContext);

  const item = route.params;

  useEffect(() => {
    console.log(item);
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    paymentFailed();
    return () => clearInterval(interval);
  }, [timerCount]);

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 500,
      cropping: true,
    }).then(image => {
      setImage(image.path);
    });
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    let docId = user.email + '.' + item.orderId;
    firestore()
      .collection('payment_evidence')
      .doc(docId)
      .set({
        userId: user.uid,
        email: user.email,
        orderId: item.orderId,
        paymentVia: item.payment.paymentVia,
        uploadedTime: firestore.Timestamp.fromDate(new Date()),
        paymentEvidence: imageUrl,
        name: item.userName,
        price: item.price,
        itemQty: item.QuantityItem,
        userOrder: item.itemOrder,
        via: item.via,
        outlet: item.outlet,
      })
      .then(() => {
        Alert.alert(
          'Upload berhasil!',
          'Upload bukti pembayaran berhasil, pesanan anda di proses yeay!!',
        );
        setImage(null);
        deleteFirestore();
        deleteKulkasUser();
        storeFinishedOrder();
        navigation.replace('VerificationPayment');
      })
      .catch(error => {
        console.log('Something wrong when post to firebase.', error);
      });
  };

  const storeFinishedOrder = () => {
    // sementara sukses payment dlu tanpa konfirmasi admin
    let docId = user.email + '.' + item.orderId;
    firestore()
      .collection('order_ongoing')
      .doc(docId)
      .set({
        userId: user.uid,
        email: user.email,
        orderId: item.orderId,
        userOrder: item.itemOrder,
        price: item.price,
        orderStatus: 'Verifikasi Pembayaran',
        outlet: item.outlet,
        via: item.via,
        totalItem: item.QuantityItem,
      })
      .then(() => {
        console.log(
          'Upload berhasil!',
          'Upload bukti pembayaran berhasil, pesanan anda di proses yeay!!',
        );
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
    filename = name + '.' + item.orderId + '.' + extension;

    setUploading(true);
    setTransferred(0);

    //store the images to cloud storage firebase
    const storageRef = storage().ref(`buktiPembayaran/${filename}`);
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

  //jika user tidak mengupload bukti pembayaran
  const paymentFailed = () => {
    if (timerCount === 0) {
      navigation.navigate('Kulkas');
      deleteFirestore();
    }
  };

  //store sukses userOrder ke firestore(finishedOrder)
  const paymentSuccess = () => {};

  //delete payment order jika user tidak melakukan pembayaran sesuai waktu/pembayaran berhasil
  const deleteFirestore = () => {
    firestore()
      .collection('userOrder')
      .doc(item.orderId)
      .delete()
      .then(() => {})
      .catch(e => console.log('Something wrong when deleeting: ', e));
  };

  //delete kulkas user jika order berhasil
  const deleteKulkasUser = () => {
    item.itemOrder.forEach(doc => {
      const {id} = doc;
      firestore()
        .collection('shopping_cart')
        .doc(id)
        .delete()
        .then(() => {})
        .catch(e => console.log('Something wrong when deleeting: ', e));
    });
  };

  function renderTimer() {
    return (
      <View
        style={{
          width: SIZES.width,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={images.time}
          resizeMode="cover"
          style={{
            width: 170,
            height: 170,
          }}
        />
        <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
          Selesaikan Pembayaran dalam
        </Text>
        <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
          {timerCount}
        </Text>
        <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
          Detik
        </Text>
      </View>
    );
  }

  function renderMethodPayment() {
    return (
      <View style={{width: SIZES.width, padding: 20}}>
        <Text style={{color: '#fff', textAlign: 'right', fontStyle: 'italic'}}>
          orderID : #{item.orderId}
        </Text>
        <View
          style={{
            alignSelf: 'center',
            width: SIZES.width,
            marginVertical: -5,
            padding: 10,
            paddingTop: 0,
            marginTop: 20,
          }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#aaaaaa',
              padding: 15,
              justifyContent: 'space-between',
              flexDirection: 'row',
              backgroundColor: `${'#e7d4b5'}77`,
            }}>
            <View>
              <Text
                style={{
                  color: COLORS.secondary,
                  marginBottom: 10,
                  fontWeight: 'bold',
                }}>
                {item.payment.paymentVia}
              </Text>
              <Text style={{color: COLORS.secondary}}>
                No.Pembayaran `{item.payment.noRek}`
              </Text>
            </View>

            <Image
              source={{uri: item.payment.image}}
              resizeMode="contain"
              style={{
                width: 50,
                height: 50,
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  function renderPaymentEvidence() {
    return (
      <View
        style={{
          width: SIZES.width,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          padding: 10,
          paddingBottom: 100,
        }}>
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
          Upload Bukti Pembayaran disini
        </Text>
        <Image
          source={{
            uri: image
              ? image
              : 'https://cdn-cziplee-estore.azureedge.net//no_image_uploaded.png',
          }}
          resizeMode="cover"
          style={{width: 200, height: 250, marginTop: 5, borderRadius: 5}}
        />

        <TouchableOpacity
          onPress={() => takePhoto()}
          style={{
            position: 'absolute',
            top: 37,
            width: 200,
            height: 250,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="camera" size={40} color={COLORS.button} />
        </TouchableOpacity>

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
            onPress={() => submitPost()}
            style={{
              width: '40%',
              backgroundColor: `${COLORS.button}77`,
              borderWidth: 1,
              borderColor: COLORS.button,
              padding: 10,
              marginTop: 10,
              borderRadius: 10,
            }}>
            <Text
              style={{textAlign: 'center', color: '#fff', fontWeight: 'bold'}}>
              Upload
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderTimer()}
        {renderMethodPayment()}
        {renderPaymentEvidence()}
      </ScrollView>
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
    borderBottomColor: '#fff',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default FinishPayment;
