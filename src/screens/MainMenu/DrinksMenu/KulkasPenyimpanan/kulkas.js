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
import {images, COLORS, SIZES} from '../../../../constants';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../../../AppNavigator/AuthProvider';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import {takeOutlet} from '../../../../redux';

const orderVia = [
  {
    name: 'Pickup',
  },
  {
    name: 'Delivery',
  },
];

const Kulkas = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);

  const [outletVisible, setOutletVisible] = useState(false);

  const [selectedOutlet, setSelectedOutlet] = useState([]);
  const [selectedVia, setSelectedVia] = useState('');

  const [outlets, setOutlets] = useState([]);

  const {user} = useContext(AuthContext);

  const dispatch = useDispatch();
  const {data} = useSelector(state => state.OutletReducer);

  var total = orders.reduce((total, price) => total + price.totalPrice, 0);

  useEffect(() => {
    console.log(outlets);
    fetchOutlet();
    fetchOrders();
    setDeleted(false);
    navigation.addListener('focus', () => setLoading(!loading));
  }, [loading, deleted, navigation, data]);

  //select outlet thinktop
  function onSelectOutlet(outlet) {
    //filter restaurant
    console.log(outlet);
    setSelectedOutlet(outlet);
  }

  //select pickup or Order
  function onSelectVia(via) {
    //filter restaurant
    console.log(via);
    setSelectedVia(via);
  }

  const warning = () => {
    return (
      <View
        style={{
          width: SIZES.width * 0.8,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f7a440',
          position: 'absolute',
          bottom: 50,
          borderRadius: 20,
          alignSelf: 'center',
        }}>
        <Text style={{color: '#fff', textAlign: 'center', fontWeight: 'bold'}}>
          Mohon pilih outlet dan Delivery/Pickup order!!!
        </Text>
      </View>
    );
  };

  // store data outlet to redux
  const storeDataOutlet = (via, outlet) => {
    console.log(via, '', outlet);
    dispatch(takeOutlet(via, outlet));
    setOutletVisible(!outletVisible);
  };

  //fetch outlet thinktop
  const fetchOutlet = async () => {
    try {
      const list = [];
      await firestore()
        .collection('outlets')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {
              coordinate,
              description,
              rating,
              review,
              title,
              alamat,
            } = doc.data();
            list.push({coordinate, description, rating, review, title, alamat});
          });
          setOutlets(list);
          if (loading) {
            setLoading(false);
          }
        });
    } catch (error) {
      console.log('failed fetch fitlers', error);
    }
  };

  //ambil data orders
  const fetchOrders = async () => {
    try {
      const list = [];
      await firestore()
        .collection('shopping_cart')
        .where('userId', '==', user.uid)
        .orderBy('orderTime', 'desc')
        .get()
        .then(querySnapshot => {
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
        });
    } catch (e) {
      console.log(e);
    }
  };

  // Modal Pilih Outlet (pop up modal)
  function renderModalOutlet() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={outletVisible}
        onRequestClose={() => {
          setOutletVisible(!outletVisible);
        }}>
        <View
          style={{
            alignItems: 'center',
            width: SIZES.width,
            height: SIZES.height,
            backgroundColor: 'rgba(0,0,0,0.8)',
            position: 'absolute',
            bottom: 0,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: COLORS.primary,
              width: SIZES.width,
              height: 400,
              borderTopRightRadius: 30,
              borderTopLeftRadius: 30,
              padding: SIZES.padding * 2,
              paddingTop: SIZES.padding,
            }}>
            <View style={{flexDirection: 'row'}}>
              {orderVia.map((item, index) => (
                <TouchableOpacity
                  onPress={() => onSelectVia(item.name)}
                  key={index}
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    borderWidth: 1,
                    borderColor: COLORS.button,
                    marginRight: 20,
                    borderRadius: 20,
                    backgroundColor:
                      selectedVia === item.name
                        ? `${COLORS.button}55`
                        : 'transparent',
                  }}>
                  <Text style={{color: COLORS.secondary, fontWeight: '800'}}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={outlets}
              keyExtractor={item => item.title}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 20}}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => onSelectOutlet(item)}
                  activeOpacity={0.9}
                  style={{
                    width: SIZES.width * 0.85,
                    flexDirection: 'row',
                    marginVertical: 5,
                    borderWidth: selectedOutlet === item ? 1 : 0,
                    borderColor: COLORS.button,
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  <Image
                    source={images.outlet}
                    resizeMode="contain"
                    style={{
                      width: 40,
                      height: 40,
                      alignSelf: 'center',
                      marginRight: 20,
                    }}
                  />
                  <View
                    style={{
                      width: '80%',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: COLORS.secondary,
                        fontWeight: 'bold',
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'justify',
                        color: COLORS.secondary,
                        fontSize: 12,
                      }}>
                      {item.alamat}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => storeDataOutlet(selectedVia, selectedOutlet)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: COLORS.button,
                borderRadius: 3,
                alignSelf: 'center',
                width: '80%',
                padding: 10,
                backgroundColor: `${COLORS.button}55`,
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.secondary,
                  fontWeight: 'bold',
                }}>
                {selectedVia === 'Pickup' ? 'Pickup Order!' : 'Delivery Now!'}
              </Text>
            </TouchableOpacity>

            {/* close Modal */}
            <TouchableOpacity
              onPress={() => setOutletVisible(!outletVisible)}
              style={{position: 'absolute', right: 10, top: 10}}>
              <Icon
                name="close-circle-outline"
                size={30}
                color={COLORS.button}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

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

  //render content minuman
  function renderOrderList() {
    return (
      <View
        style={{
          width: SIZES.width,
          justifyContent: 'center',
          paddingBottom: data.outlet ? 215 : 150,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
                        {item.quantity} {item.title}
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
                          fontSize: 12,
                          color: COLORS.secondary,
                          fontWeight: 'bold',
                          marginTop: 10,
                        }}>
                        Rp {item.totalPrice}
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
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: COLORS.button,
                      borderRadius: 5,
                      alignSelf: 'flex-end',
                      paddingLeft: 5,
                      paddingRight: 5,
                      flexDirection: 'row',
                    }}>
                    {/* minus Quantity */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        borderRightWidth: 1,
                        borderRightColor: COLORS.button,
                      }}>
                      <Icon name="minus" color={COLORS.button} size={20} />
                    </TouchableOpacity>

                    {/* Qauntity */}
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginLeft: 15,
                        marginRight: 15,
                      }}>
                      {item.quantity}
                    </Text>

                    {/* Plus Quantity */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        borderLeftWidth: 1,
                        borderLeftColor: COLORS.button,
                        paddingLeft: 5,
                      }}>
                      <Icon name="plus" color={COLORS.button} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  //render pilih outlet, dan memesan lewat apa
  function renderOutlet() {
    return (
      <View
        style={{
          width: SIZES.width,
          marginBottom: 5,
        }}>
        {/* goBack */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{margin: 5, marginBottom: -10}}>
          <Icon name="keyboard-backspace" size={25} color={COLORS.button} />
        </TouchableOpacity>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          colors={[`${COLORS.button}99`, 'transparent']}
          style={{
            width: '100%',
            // backgroundColor: 'white',
            padding: 10,

            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {data.via ? (
            data.via === 'Pickup' ? (
              <Image
                source={images.outlet}
                resizeMode="contain"
                style={{
                  width: 45,
                  height: 45,
                }}
              />
            ) : (
              <Image
                source={images.driver}
                resizeMode="contain"
                style={{
                  width: 60,
                  height: 60,
                }}
              />
            )
          ) : (
            <Image
              source={images.Logo}
              resizeMode="contain"
              style={{
                width: 60,
                height: 60,
              }}
            />
          )}

          <View style={{width: '60%', paddingRight: 10, marginLeft: 10}}>
            <Text style={{fontWeight: 'bold', color: '#fff'}}>
              {data.via ? (
                <Text style={{fontWeight: 'bold', color: '#fff'}}>
                  {data.outlet ? `${data.via} dari ~ ${data.outlet.title}` : ''}
                </Text>
              ) : (
                <Text
                  style={{
                    fontWeight: 'normal',
                    fontStyle: 'italic',
                    color: '#fff',
                  }}>
                  Via
                </Text>
              )}
            </Text>
            <Text style={{fontSize: 12, color: '#fff'}} numberOfLines={2}>
              {data.outlet ? (
                data.outlet.alamat
              ) : (
                <Text
                  style={{fontSize: 12, fontStyle: 'italic', color: '#fff'}}>
                  Silahkan pilih alamat terlebih dahulu
                </Text>
              )}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setOutletVisible(true)}
            style={{position: 'absolute', top: '50%', right: 10}}>
            <Text style={{color: '#00adb5', fontWeight: 'bold'}}>Change</Text>
          </TouchableOpacity>
        </LinearGradient>

        {data.outlet ? (
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={[`${COLORS.button}99`, 'transparent']}
            style={{
              width: SIZES.width,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
              // backgroundColor: '#ffc996',
            }}>
            <Text
              style={{
                fontSize: 14,
                fontStyle: 'italic',
                color: COLORS.secondary,
                marginBottom: 10,
                textAlign: 'center',
              }}>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {data.outlet.title}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontStyle: 'italic',
                    textAlign: 'center',
                  }}>
                  932.0 M from your location
                </Text>
              </View>
            </Text>
          </LinearGradient>
        ) : null}
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
      .collection('shopping_cart')
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
      {renderOutlet()}
      {renderOrderList()}
      {renderModalOutlet()}
      <View
        style={{
          width: SIZES.width,
          padding: SIZES.padding,
          paddingLeft: SIZES.padding * 2,
          paddingRight: SIZES.padding * 2,
          flexDirection: 'row',
          position: 'absolute',
          bottom: 0,
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
          disabled={data.outlet === null || data.via === '' ? true : false}
          onPress={() =>
            navigation.navigate('Checkout', {
              total,
              userOrder: orders,
              outlet: data,
            })
          }
          style={{
            width: '40%',
            height: 30,
            backgroundColor:
              data.outlet === null && data.via === ''
                ? '#aaaaaa'
                : `${COLORS.button}55`,
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
            Payments
          </Text>
        </TouchableOpacity>
      </View>

      {data.outlet === null && data.via === '' ? warning() : null}
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
