import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {images, COLORS, SIZES} from '../../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../../../AppNavigator/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const OnGoing = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const {user} = useContext(AuthContext);

  useEffect(() => {
    console.log(orders);
    return fetchOrdering();
  }, []);

  //ambil data order yang sedang berjaan
  const fetchOrdering = async () => {
    const list = [];
    await firestore()
      .collection('order_ongoing')
      .where('userId', '==', user.uid)
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
          });
        });
        setOrders(list);
        if (loading) {
          setLoading(false);
        }
      });
  };

  function renderHeader() {
    return (
      <View
        style={{
          width: SIZES.width,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: -20,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="arrow-left" size={25} color="#000" />
        </TouchableOpacity>
        <Text>Kembali</Text>
      </View>
    );
  }

  function renderContent() {
    return (
      <View style={{width: SIZES.width, padding: 20}}>
        {orders.map((item, index) => (
          <View key={index}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <Icon
                name={item.via === 'Delivery' ? 'motorbike' : 'store'}
                size={25}
                color="#000"
                style
              />
              <View style={{flex: 1, marginLeft: 10}}>
                <Text
                  style={{
                    color: '#cc9b6d',
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: 10,
                  }}>
                  {item.outlet}
                </Text>
                {item.userOrder.map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      color: '#000',
                      fontSize: 16,
                      fontWeight: '300',
                      marginBottom: 5,
                    }}>
                    {item.title} x {item.quantity}
                  </Text>
                ))}
                <Text
                  style={{
                    color: '#afb9c8',
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginBottom: 10,
                  }}>
                  Total {item.totalItem} Item ~ Rp {item.price}
                </Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {item.orderStatus}
                </Text>
                {item.orderStatus === 'Di proses' ? (
                  <Text
                    style={{
                      color: '#afb9c8',
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}>
                    Yayy! Pesanan anda sedang di proses!{' '}
                    {item.via === 'Delivery' ? (
                      <Text
                        style={{
                          color: '#afb9c8',
                          fontSize: 12,
                          fontWeight: 'bold',
                          marginBottom: 10,
                        }}>
                        Kurir sedang dalam perjalanan rumah anda :D
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: '#afb9c8',
                          fontSize: 12,
                          fontWeight: 'bold',
                          marginBottom: 10,
                        }}>
                        Pesanan sedang dibuat :D, mohon Pickup di outlet yang
                        dipesan{' '}
                      </Text>
                    )}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: '#afb9c8',
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}>
                    Pesanan anda sedang di verifikasi mohon tunggu beberapa
                    menit{' '}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.rulerLine} />
          </View>
        ))}
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderHeader()}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  rulerLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#687980',
    width: '80%',
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'center',
  },
});

export default OnGoing;
