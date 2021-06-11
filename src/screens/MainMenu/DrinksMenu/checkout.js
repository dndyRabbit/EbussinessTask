import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
} from 'react-native';
import {images, COLORS, SIZES} from '../../../constants';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../../AppNavigator/AuthProvider';

const payments = [
  {
    paymentVia: 'BNI Bank Negara Indonesia',
    noRek: '123465789',
    image:
      'https://www.pinclipart.com/picdir/big/105-1051729_bank-negara-indonesia-logo-bank-bni-transparan-clipart.png',
  },
  {
    paymentVia: 'BCA Bank Asia Asia',
    noRek: '123465789',
    image: 'https://cdn.iconscout.com/icon/free/png-512/bca-225544.png',
  },
  {
    paymentVia: 'OVO',
    noRek: '0895605264487',
    image:
      'https://1.bp.blogspot.com/-zqvCZXYnnfA/XciTU6Ikw_I/AAAAAAAABJc/TrUNMleviBsRtXgnDWzFEhZjxN03ET7_gCLcBGAsYHQ/s1600/Logo%2BOVO.png',
  },
];

const Checkout = ({navigation, route}) => {
  const [userData, setUserData] = useState([]);

  const {user} = useContext(AuthContext);
  const item = route.params;

  const outlet = item.outlet;
  const userOrder = item.userOrder;
  const totalPrice = item.total;

  let totalQty = userOrder.reduce((a, b) => a + b.quantity || 0, 0);

  const [selectedPayment, setSelectedPayment] = useState([]);
  const [outletVisible, setOutletVisible] = useState(false);

  const onSelectedPayment = payment => {
    console.log(payment);
    setSelectedPayment(payment);
  };

  useEffect(() => {
    console.log(selectedPayment);

    // console.log(userData.fname);
    // console.log(totalQty);
    // console.log(totalPrice);
    // console.log(outlet);
    // console.log(userOrder);
    getUser();
  }, []);

  const storeUserOrderData = async () => {
    await firestore()
      .collection('userOrder')
      .add({
        userId: user.uid,
        payment: selectedPayment,
        name: `${userData.fname} ${userData.lname}`,
        outlet: outlet.outlet,
        itemOrder: userOrder,
        totalItem: totalQty,
        totalPrice,
        alamat: userData.location,
        phone: userData.phone,
      })
      .then(doc => {
        // navigation.navigate('FinishPayment', {payment:selectedPayment})
        console.log('order masuk ke firebase!');
        setOutletVisible(false);

        navigation.replace('FinishPayment', {
          payment: selectedPayment,
          orderId: doc.id,
          itemOrder: userOrder,
          outlet: outlet.outlet.title,
          userName: userData.fname,
          price: totalPrice,
          QuantityItem: totalQty,
          via: outlet.via,
        });
      })
      .catch(e => {
        console.log('Something wrong: ', e);
      });
  };

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data : ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  const RenderDelivery = () => {
    return (
      <View>
        <View style={{width: '100%'}}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: 10,
            }}>
            ThinkTop Outlet
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 0.25,
                alignItems: 'center',
              }}>
              <Image
                source={images.outlet}
                resizeMode="contain"
                style={{width: 40, height: 40}}
              />
              <Text style={{color: '#fff', fontWeight: 'bold'}}>923 M</Text>
            </View>
            <View style={{flex: 0.8}}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                {outlet.outlet.title}
              </Text>
              <Text style={{color: '#fff'}}>{outlet.outlet.alamat}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.rulerLine]} />

        {/* Alamat Penerima */}
        <View style={{width: '100%'}}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: 10,
            }}>
            Alamat Delivery
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 0.25,
                alignItems: 'center',
              }}>
              <Image
                source={images.mapMarker}
                resizeMode="contain"
                style={{width: 30, height: 30}}
              />
            </View>
            <View style={{flex: 0.8}}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                {userData.fname}
              </Text>
              <Text style={{color: '#fff'}}>{userData.location}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const RenderPickup = () => {
    return (
      <View style={{width: '100%'}}>
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
            marginBottom: 10,
          }}>
          ThinkTop Outlet
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 0.25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={images.outlet}
              resizeMode="contain"
              style={{width: 40, height: 40}}
            />
            <Text style={{color: '#fff', fontWeight: 'bold'}}>923 M</Text>
          </View>
          <View style={{flex: 0.8}}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
              {outlet.outlet.title}
            </Text>
            <Text style={{color: '#fff'}}>{outlet.outlet.alamat}</Text>
          </View>
        </View>
        <View style={styles.rulerLine} />
        <Text
          style={{
            textAlign: 'center',
            color: '#fff',
            fontSize: 16,
            marginTop: 10,
            fontWeight: 'bold',
          }}>
          Ambil Pesanan sesuai Outlet
        </Text>
      </View>
    );
  };

  // render checkout pages
  function renderHeader() {
    return (
      <View
        style={{
          width: SIZES.width,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 15,
        }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Checkout
        </Text>
      </View>
    );
  }

  //render pengiriman user (delivery)
  function renderPengiriman() {
    return (
      <View
        style={{
          width: SIZES.width,
          paddingLeft: 20,
        }}>
        <Text style={{color: '#fff', fontWeight: 'bold'}}>{outlet.via}</Text>
        <View
          style={{
            width: '100%',
            padding: 20,
            paddingLeft: 0,
            flexDirection: 'row',
          }}>
          <Image
            source={images.pengiriman}
            resizeMode="contain"
            style={{
              width: 50,
              height: 150,
            }}
          />
          <View
            style={{
              flex: 1,
              height: 170,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 0.3,
                padding: 5,
              }}>
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                {outlet.outlet.title}
              </Text>
              <Text numberOfLines={2} style={{color: '#fff', fontSize: 10}}>
                {outlet.outlet.alamat}
              </Text>
            </View>

            <View style={{flex: 0.6, padding: 5}}>
              <Text style={{color: '#fff', fontSize: 12, fontStyle: 'italic'}}>
                Deliver to :
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#fff',
                  marginTop: 10,
                  fontWeight: 'bold',
                }}>
                Home
              </Text>
              <Text numberOfLines={3} style={{color: '#fff', fontSize: 10}}>
                {userData.location}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //tampilan pick up now
  function renderPickup() {
    return (
      <View
        style={{
          width: SIZES.width,
          paddingLeft: 20,
        }}>
        <Text style={{color: '#fff', fontWeight: 'bold'}}>{outlet.via}</Text>
        <View
          style={{
            width: '100%',
            padding: 20,
            paddingLeft: 0,
            flexDirection: 'row',
          }}>
          <Image
            source={images.outlet}
            resizeMode="contain"
            style={{
              width: 50,
              height: 50,
              marginRight: 10,
            }}
          />
          <View
            style={{
              flex: 1,
              padding: 5,
            }}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
              {outlet.outlet.title}
            </Text>
            <Text numberOfLines={2} style={{color: '#fff', fontSize: 10}}>
              {outlet.outlet.alamat}
            </Text>
          </View>
        </View>
        <View style={[styles.rulerLine, {width: '50%'}]} />
      </View>
    );
  }

  //me render pemesanan user
  function renderPemesanan() {
    return (
      <View style={{width: SIZES.width, padding: 20, paddingTop: 5}}>
        <View
          style={{
            width: '100%',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#fff',
          }}>
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Icon name="fridge-outline" size={20} color="#fff" />
              <Text style={{marginLeft: 10, color: '#fff', fontWeight: 'bold'}}>
                Pesanan
              </Text>
            </View>
            <Text style={{color: '#fff'}}>Total {totalQty} Items</Text>
          </View>
          <View style={styles.rulerLine} />
          <View>
            {userOrder.map((order, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginVertical: 5,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      marginRight: 10,
                      marginTop: 2,
                    }}>
                    <Text style={{fontSize: 12, color: '#fff'}}>
                      {order.quantity} x
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                      {order.title}
                    </Text>
                    <Text
                      style={{
                        color: '#e1e5ea',
                        fontSize: 12,
                        fontStyle: 'italic',
                      }}>
                      {order.about}
                    </Text>
                  </View>
                </View>
                <Text style={{color: '#fff', fontWeight: '800'}}>
                  ~ Rp {order.totalPrice}
                </Text>
              </View>
            ))}
            <View style={styles.rulerLine} />
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                Total Pembayaran
              </Text>
              <Text style={{color: '#fff'}}>~ Rp. {totalPrice}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // render payment Method
  function renderPayment() {
    return (
      <View style={{width: SIZES.width, padding: 20, marginTop: -20}}>
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          Pilih Metode Pembayaran
        </Text>
        {payments.map((payment, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelectedPayment(payment)}
            style={{
              width: '100%',
              marginVertical: 5,
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: COLORS.button,
                padding: 15,
                justifyContent: 'space-between',
                flexDirection: 'row',
                backgroundColor:
                  selectedPayment === payment
                    ? `${COLORS.button}77`
                    : 'transparent',
              }}>
              <View>
                <Text
                  style={{
                    color: COLORS.secondary,
                    marginBottom: 10,
                    fontWeight: 'bold',
                  }}>
                  {payment.paymentVia}
                </Text>
                <Text style={{color: COLORS.secondary}}>
                  No.Pembayaran `{payment.noRek}`
                </Text>
              </View>

              <Image
                source={{uri: payment.image}}
                resizeMode="contain"
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  //render payment button to confirmation
  function renderPaymentButton() {
    return (
      <View style={{paddingBottom: 30}}>
        <TouchableOpacity
          onPress={() => setOutletVisible(true)}
          style={{
            width: SIZES.width * 0.8,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f58634',

            alignSelf: 'center',
            borderRadius: 5,
            marginBottom: 10,
          }}>
          <Text style={{color: '#fff', fontWeight: '900'}}>
            Pay ~ Rp. {totalPrice}
          </Text>
        </TouchableOpacity>

        {/* batal button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Kulkas')}
          style={{
            width: SIZES.width * 0.4,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ce1212',
            alignSelf: 'center',
            borderRadius: 5,
          }}>
          <Text style={{color: '#fff', fontWeight: '900'}}>Batal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Modal Pilih Outlet (pop up modal)
  function renderModalPaymentConfirmation() {
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
              height: 500,
              borderTopRightRadius: 30,
              borderTopLeftRadius: 30,
              padding: SIZES.padding * 2,
              paddingTop: SIZES.padding,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 20,
              }}>
              Mempersiapkan Pesanan ...
            </Text>

            {outlet.via === 'Pickup' ? <RenderPickup /> : <RenderDelivery />}

            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: '#ffb26b',
                position: 'absolute',
                bottom: 80,
                padding: 10,
                borderRadius: 10,
              }}>
              <Text style={{fontSize: 16, color: '#fff', textAlign: 'center'}}>
                Pastikan Handphone kamu dihubungi driver/tim ThinkTop
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => storeUserOrderData()}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: COLORS.button,
                borderRadius: 3,
                width: '80%',
                padding: 10,
                backgroundColor: `${COLORS.button}55`,
                position: 'absolute',
                bottom: 20,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.secondary,
                  fontWeight: 'bold',
                }}>
                Continue
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderHeader()}
        {outlet.via === 'Pickup' ? renderPickup() : renderPengiriman()}
        {renderPemesanan()}
        {renderPayment()}
        {renderPaymentButton()}
        {renderModalPaymentConfirmation()}
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
    alignSelf: 'center',
  },
});

export default Checkout;
