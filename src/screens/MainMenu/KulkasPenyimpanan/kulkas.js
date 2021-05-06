import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Text,
  FlatList,
  ScrollView,
} from 'react-native';
import {images, COLORS, SIZES} from '../../../constants';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../../AppNavigator/AuthProvider';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

const Kulkas = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);

  const {user} = useContext(AuthContext);

  var total = orders.reduce((total, price) => total + price.totalPrice, 0);

  const fetchOrders = async () => {
    try {
      const list = [];
      await firestore()
        .collection('orders')
        .where('userId', '==', user.uid)
        .orderBy('orderTime', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('Total Post', querySnapshot.size);

          querySnapshot.forEach(doc => {
            const {
              userId,
              title,
              about,
              postImg,
              quantity,
              totalPrice,
              orderTime,
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              title,
              about,
              postImg,
              quantity,
              totalPrice,
              orderTime,
            });
          });
          setOrders(list);
          if (loading) {
            setLoading(false);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchOrders();
    setDeleted(false);
  }, [loading, deleted]);

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

  function renderOrderList() {
    return (
      <View
        style={{
          width: SIZES.width,
          justifyContent: 'center',
          paddingBottom: 10,
        }}>
        <Text
          style={{
            fontSize: 30,
            fontStyle: 'italic',
            color: COLORS.secondary,
            marginBottom: 10,
            alignSelf: 'flex-end',
          }}>
          My Kulkas
        </Text>
        {orders.map((item, index) => {
          return (
            <LinearGradient
              key={index}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[COLORS.button, 'transparent']}
              style={{
                width: '100%',
                marginVertical: 5,
                height: 70,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  padding: SIZES.padding,
                  paddingLeft: SIZES.padding * 2,
                  paddingRight: SIZES.padding * 2,
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={{uri: item.postImg}}
                    resizeMode="cover"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 5,
                      marginRight: 5,
                    }}
                  />
                  <View>
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
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 10,
                        color: COLORS.secondary,
                        fontStyle: 'italic',
                        marginTop: 5,
                      }}>
                      Qty {item.quantity}x {item.title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 10,
                        color: COLORS.secondary,
                        fontStyle: 'italic',
                      }}>
                      Ordered: {moment(item.orderTime.toDate()).fromNow()}
                    </Text>
                  </View>
                </View>

                {/* Trash can */}
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 10,
                  }}>
                  <Icon name="trash-can" size={20} color={COLORS.button} />
                </TouchableOpacity>

                <View
                  style={{
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: COLORS.button,
                    borderRadius: 5,
                    flex: 0.45,
                    marginBottom: -5,
                    alignSelf: 'flex-end',
                  }}>
                  <Text style={{color: 'white', fontSize: 10}}>Sub Price:</Text>
                  <Text
                    style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>
                    Rp.{item.totalPrice}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          );
        })}
      </View>
    );
  }

  const handleDelete = orderId => {
    Alert.alert(
      'Deleted Post',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deleteOrders(orderId),
        },
      ],
      {cancelable: false},
    );
  };
  const deleteOrders = orderId => {
    console.log('current post ID : ', orderId);
    firestore()
      .collection('orders')
      .doc(orderId)
      .delete()
      .then(() => {
        Alert.alert(
          'Order Removed!',
          'Your Order has successfully Removed form the Frigde!',
          setDeleted(true),
        );

        if (loading) {
          setLoading(false);
        }
      })
      .catch(e => console.log('Something wrong when deleeting: ', e));
  };

  return (
    <SafeAreaView style={styles.container}>
      <RenderBackground />

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderOrderList()}
      </ScrollView>

      <View
        style={{
          alignSelf: 'flex-end',
          width: SIZES.width,
          height: 50,
          padding: SIZES.padding,
          paddingLeft: SIZES.padding * 2,
          paddingRight: SIZES.padding * 2,
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: '60%',
            height: 30,
            backgroundColor: `${COLORS.button}55`,
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: COLORS.button,
          }}>
          <Icon name="currency-btc" size={20} color={COLORS.button} />
          <Text
            style={{
              color: 'white',
              marginLeft: 5,
              fontWeight: 'bold',
              fontSize: 12,
            }}>
            Total price: Rp.
            {total}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: '40%',
            height: 30,
            backgroundColor: `${COLORS.button}55`,
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: COLORS.button,
            marginLeft: 5,
          }}>
          <Icon name="handshake" size={20} color={COLORS.button} />
          <Text style={{color: 'white', marginLeft: 5, fontWeight: 'bold'}}>
            Buy Now
          </Text>
        </TouchableOpacity>
      </View>

      {/* goBack */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{position: 'absolute', top: 10, left: 5}}>
        <Icon name="keyboard-backspace" size={25} color={COLORS.button} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});

export default Kulkas;
