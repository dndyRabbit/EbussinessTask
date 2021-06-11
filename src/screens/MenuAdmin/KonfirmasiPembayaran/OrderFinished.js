import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView,
} from 'react-native';
import {images, COLORS, SIZES} from '../../../constants';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../../AppNavigator/AuthProvider';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

const OrderFinished = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log(orders);

    navigation.addListener('focus', () => setLoading(!loading));
    setDeleted(false);
    return fetchOrdering();
  }, [loading, navigation, deleted]);

  const fetchOrdering = async () => {
    const list = [];
    await firestore()
      .collection('order_ongoing')
      .where('orderStatus', '==', 'Di proses')
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const {
            email,
            outlet,
            orderId,
            orderStatus,
            via,
            price,
            userId,
            userOrder,
            totalItem,
            time,
          } = doc.data();
          list.push({
            email,
            outlet,
            orderId,
            orderStatus,
            via,
            price,
            userId,
            userOrder,
            totalItem,
            time,
          });
        });
        setOrders(list);
        if (loading) {
          setLoading(false);
        }
      });
  };

  const storeFinishedOrder = ({...props}) => {
    // sementara sukses payment dlu tanpa konfirmasi admin
    console.log(props);

    firestore()
      .collection('order_finished')
      .doc(`${props.email}.${props.orderId}`)
      .set({
        email: props.email,
        orderId: props.orderId,
        userOrder: props.userOrder,
        orderStatus: props.orderStatus,
        outlet: props.outlet,
        time: props.time,
        totalItem: props.totalItem,
        userId: props.userId,
        totalPrice: props.totalPrice,
        via: props.via,
      })
      .then(() => {
        console.log(
          'Upload berhasil!',
          'Upload bukti pembayaran berhasil, pesanan anda di proses yeay!!',
        );
        deletePaymentEvidence(props);
      })
      .catch(error => {
        console.log('Something wrong when post to firebase.', error);
      });
  };

  const deletePaymentEvidence = async ({...props}) => {
    console.log(props.name);
    await firestore()
      .collection('order_ongoing')
      .doc(`${props.email}.${props.orderId}`)
      .delete()
      .then(() => {
        setDeleted(true);
      })
      .catch(e => console.log('Something wrong when deleeting: ', e));
  };

  function renderHeader() {
    return (
      <View style={{width: SIZES.width, padding: 20}}>
        <TouchableOpacity
          style={{
            marginLeft: -20,
            marginTop: -10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('HomeAdmin')}>
          <Icon name="arrow-left" size={25} color={COLORS.button} />
          <Text style={{color: '#fff'}}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderContent() {
    return (
      <View style={{width: SIZES.width, padding: 20, paddingBottom: 150}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.map((item, index) => (
            <View key={index}>
              <View
                style={{
                  width: '100%',

                  flexDirection: 'row',
                  marginBottom: 10,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    source={{uri: item.paymentEvidence}}
                    resizeMode="cover"
                    style={{
                      width: 100,
                      height: 170,
                    }}
                  />
                </TouchableOpacity>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Image
                    source={{uri: item.paymentEvidence}}
                    resizeMode="cover"
                    style={{
                      width: SIZES.width,
                      height: SIZES.height,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{position: 'absolute', top: 10, right: 10}}>
                    <Icon name="close-circle-outline" size={30} color="#fff" />
                  </TouchableOpacity>
                </Modal>
                <View
                  style={{
                    padding: 10,
                    width: '68%',
                    height: 170,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {item.orderStatus}
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 8,
                      fontStyle: 'italic',
                      textAlign: 'right',
                    }}>
                    Time Order: {moment(item.time.toDate()).fromNow()}
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 8,
                      fontStyle: 'italic',
                      textAlign: 'right',
                    }}>
                    Order ID: #{item.orderId}
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginBottom: 20,
                    }}>
                    {item.paymentVia}
                  </Text>
                  <Text style={{color: '#fff', fontSize: 12}}>
                    Total Item {item.totalItem}x
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}>
                    Total Price: Rp.{item.price}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <TouchableOpacity
                      style={{
                        padding: 5,
                        backgroundColor: '#f55c47',
                        width: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                        marginRight: 20,
                        alignSelf: 'flex-end',
                      }}>
                      <Text style={{fontSize: 10}}>Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        storeFinishedOrder({
                          email: item.email,
                          orderId: item.orderId,
                          userOrder: item.userOrder,
                          orderStatus: 'Selesai',
                          outlet: item.outlet,
                          time: firestore.Timestamp.fromDate(new Date()),
                          totalItem: item.totalItem,
                          userId: item.userId,
                          totalPrice: item.price,
                          via: item.via,
                        })
                      }
                      style={{
                        padding: 5,
                        backgroundColor: '#8fd9a8',
                        width: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                      }}>
                      <Text style={{fontSize: 10}}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.rulerLine} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.rulerLine} />
      {renderContent()}
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
    width: '90%',
    marginTop: 5,
    marginBottom: 15,
    alignSelf: 'center',
  },
});
export default OrderFinished;
