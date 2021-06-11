import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {images, COLORS, SIZES} from '../../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../../../AppNavigator/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const SalesHistory = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const {user} = useContext(AuthContext);

  useEffect(() => {
    console.log(orders);
    navigation.addListener('focus', () => setLoading(!loading));
    return fetchOrderDone();
  }, [loading, navigation]);

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

  const fetchOrderDone = async () => {
    const list = [];
    await firestore()
      .collection('order_finished')
      .where('orderStatus', '==', 'Selesai')
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const {
            email,
            orderId,
            orderStatus,
            outlet,
            time,
            totalItem,
            totalPrice,
            userId,
            userOrder,
            via,
          } = doc.data();
          list.push({
            email,
            orderId,
            orderStatus,
            outlet,
            time,
            totalItem,
            totalPrice,
            userId,
            userOrder,
            via,
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
        <TouchableOpacity onPress={() => navigation.navigate('HomeAdmin')}>
          <Icon name="arrow-left" size={25} color="#fff" />
        </TouchableOpacity>
        <Text>Kembali</Text>
      </View>
    );
  }

  function renderContent() {
    return (
      <View style={{width: SIZES.width, padding: 20, marginTop: 0}}>
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
                color="#fff"
              />
              <View style={{flex: 1, marginLeft: 10}}>
                <Text
                  style={{
                    color: '#cc9b6d',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  {item.outlet}
                </Text>
                <Text
                  style={{
                    color: '#cc9b6d',
                    fontSize: 10,
                    fontStyle: 'italic',
                    textAlign: 'right',
                  }}>
                  #{item.orderId}
                </Text>
                <Text
                  style={{
                    color: '#cc9b6d',
                    fontSize: 10,
                    fontStyle: 'italic',

                    textAlign: 'right',
                  }}>
                  {moment(item.time.toDate()).fromNow()}
                </Text>

                {item.userOrder.map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      color: '#fff',
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
                  }}>
                  Total {item.totalItem} Item ~ Rp {item.totalPrice}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'right',
                    color: '#fff',
                  }}>
                  {item.orderStatus}
                </Text>
              </View>
            </View>
            <View style={styles.rulerLine} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <SafeAreaView>
      <RenderBackground />
      {renderHeader()}
      <ScrollView>{renderContent()}</ScrollView>
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
    borderBottomColor: '#fff',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default SalesHistory;
