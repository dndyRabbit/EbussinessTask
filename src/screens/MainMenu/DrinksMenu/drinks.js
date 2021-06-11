import React, {useState, useContext, useEffect, useLayoutEffect} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import {images, COLORS, SIZES} from '../../../constants';
import {CardMenu} from '../../Components';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../../AppNavigator/AuthProvider';
import {useSelector, useDispatch} from 'react-redux';
import {takeOutlet} from '../../../redux';

const orderVia = [
  {
    name: 'Pickup',
  },
  {
    name: 'Delivery',
  },
];

const Drinks = ({navigation}) => {
  const [menu, setMenu] = useState([]);

  const [loading, setLoading] = useState(true);

  const [listPayment, setListPaymnet] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [filters, setFilters] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [orders, setOrders] = useState([]);

  const [selectedOutlet, setSelectedOutlet] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState('all');
  const [selectedVia, setSelectedVia] = useState('');
  const [filterData, setFilterData] = useState(menu);

  const [modalVisible, setModalVisible] = useState(false);
  const [outletVisible, setOutletVisible] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [bg, setBg] = useState(false);

  const {user} = useContext(AuthContext);

  const dispatch = useDispatch();

  const {data} = useSelector(state => state.OutletReducer);

  let total = orderItems.reduce((a, b) => a + b.total || 0, 0);

  let totalQty = orders.reduce((a, b) => a + b.quantity || 0, 0);
  let totalPrice = orders.reduce((a, b) => a + b.totalPrice || 0, 0);

  let quantityItem = total / listPayment.price;

  useEffect(() => {
    console.log(loading);
    console.log(uploading);
    fetchOutlet();
    fetchFilters();
    fetchPost();
    navigation.addListener('focus', () => setLoading(!loading));
    return () => {
      fetchOrders();
    };
  }, [loading, navigation]);

  //select categories favorite, promos dll
  function onSelectCategories(category) {
    //filter restaurant
    if (category !== 'all') {
      setFilterData([...menu.filter(a => a.tags.includes(category))]);
    } else {
      setFilterData(menu);
    }
    setSelectedCategories(category);
    setBg(true);
  }

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

  // Edit Quantity order
  const editOrder = (action, menuId, price) => {
    let orderList = orderItems.slice();
    let item = orderList.filter(a => a.menuId == menuId);

    if (action == '+') {
      if (item.length > 0) {
        let newQty = item[0].qty + 1;
        item[0].qty = newQty;
        item[0].total = item[0].qty * price;
      } else {
        const newItem = {
          menuId: menuId,
          qty: 1,
          price: price,
          total: price,
        };
        orderList.push(newItem);
      }
      setOrderItems(orderList);
    } else {
      if (item.length > 0) {
        if (item[0]?.qty > 0) {
          let newQty = item[0].qty - 1;
          item[0].qty = newQty;
          item[0].total = newQty * price;
        }
      }
      setOrderItems(orderList);
    }
  };

  // get index quantity of order
  function getOrderQty(menuId) {
    let orderItem = orderItems.filter(a => a.menuId == menuId);

    if (orderItem.length > 0) {
      let newQty = orderItem[0].qty;
      return newQty;
    }
    return 0;
  }

  //ambil data dari keranjang
  const fetchOrders = async () => {
    const list = [];
    await firestore()
      .collection('shopping_cart')
      .where('userId', '==', user.uid)
      .orderBy('orderTime', 'desc')
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const {quantity, totalPrice} = doc.data();
          list.push({
            quantity,
            totalPrice,
          });
        });
        setOrders(list);
      });
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

  //fetch filters data
  const fetchFilters = async () => {
    try {
      const list = [];
      await firestore()
        .collection('filters')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {filter, icon} = doc.data();
            list.push({filter, icon});
          });
          setFilters(list);
          if (loading) {
            setLoading(false);
          }
        });
    } catch (error) {
      console.log('failed fetch fitlers', error);
    }
  };

  // ngambil menu dari firestore
  const fetchPost = async () => {
    const list = [];
    try {
      await firestore()
        .collection('drinks')
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {
              userId,
              title,
              about,
              price,
              postImg,
              postTime,
              tags,
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              title,
              about,
              price,
              postImg,
              postTime,
              tags,
            });
          });
          setMenu(list);
        });
    } catch (error) {}
  };

  //delete fitur untuk menghapus menu (only admin)
  const handleDelete = menuId => {
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
          onPress: () => deleteMenu(menuId),
        },
      ],
      {cancelable: false},
    );
  };
  const deleteMenu = menuId => {
    console.log('current post ID: ', menuId);

    firestore()
      .collection('drinks')
      .doc(menuId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();

          if (postImg !== null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been deleted!`);
                deleteFirestore(menuId);
                if (loading) {
                  setLoading(false);
                }
              })
              .catch(e => console.log('Error while deleting image', e));
          } else {
            deleteFirestore(menuId);
          }
        }
      });
  };
  const deleteFirestore = menuId => {
    firestore()
      .collection('drinks')
      .doc(menuId)
      .delete()
      .then(() => {
        Alert.alert('Menu Deleted', 'Your Menu has successfully Deleted!');
      })
      .catch(e => console.log('Something wrong when deleeting: ', e));
  };

  //ambil data dari firestore untuk di munculkan di modal
  const paymentCheck = async menuId => {
    console.log('current ID : ', menuId);

    setModalVisible(true);

    await firestore()
      .collection('drinks')
      .doc(menuId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setListPaymnet(documentSnapshot.data());
          console.log(listPayment);
        }
      });
  };

  //open outlet modal
  const outletCheck = () => {
    setOutletVisible(true);
  };

  // store data outlet to redux
  const storeDataOutlet = (via, outlet) => {
    console.log(via, '', outlet);
    dispatch(takeOutlet(via, outlet));
    setOutletVisible(!outletVisible);
  };

  //create new order to firestore
  const toShoppingCart = async () => {
    setUploading(true);
    await firestore()
      .collection('shopping_cart')
      .add({
        userId: user.uid,
        title: listPayment.title,
        about: listPayment.about,
        postImg: listPayment.postImg,
        orderTime: firestore.Timestamp.fromDate(new Date()),
        totalPrice: total,
        quantity: quantityItem,
      })
      .then(() => {
        Alert.alert(
          'Masuk ke kulkas :D',
          'Your Order has been created to the Firestore Successfully!',
        );
        setUploading(false);
        setOrderItems([]);
        setModalVisible(!modalVisible);
      })
      .catch(e => {
        console.log('Something wrong: ', e);
      });
  };

  //close modal function
  const closeModal = () => {
    setModalVisible(!modalVisible);
    setOrderItems([]);
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

  //renderHeader
  function renderHeader() {
    return (
      <View
        style={{
          width: SIZES.width,
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Icon
          name="store-outline"
          size={30}
          color={COLORS.button}
          style={{margin: 15}}
        />
        <TouchableOpacity onPress={() => outletCheck()}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <Text style={{fontSize: 12, color: COLORS.secondary}}>
              {data.via ? (
                data.via
              ) : (
                <Text
                  style={{color: '#aaaaaa', fontSize: 12, fontStyle: 'italic'}}>
                  Via
                </Text>
              )}{' '}
            </Text>
            <Text style={{fontWeight: '700', color: COLORS.secondary}}>
              984.5 M ~ Dari{' '}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '85%',
            }}>
            <Text style={{color: '#f8f5f1', fontSize: 12}}>OUTLET BUKA </Text>
            <Text
              style={{color: '#f8f5f1', fontSize: 16, fontWeight: 'bold'}}
              numberOfLines={1}>
              ~{' '}
              {data.outlet ? (
                data.outlet.title
              ) : (
                <Text
                  style={{color: '#aaaaaa', fontSize: 16, fontStyle: 'italic'}}>
                  Pilih Outlet
                </Text>
              )}{' '}
            </Text>
          </View>
          <Icon
            name="chevron-down"
            size={35}
            color="#aaaaaa"
            style={{position: 'absolute', right: -30, bottom: -8}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  //renderCategories
  function renderCategories() {
    return (
      <View
        style={{
          width: SIZES.width,
          backgroundColor: `${COLORS.button}88`,
          height: 50,
          padding: SIZES.padding,
          flexDirection: 'row',
          borderTopColor: COLORS.button,
          borderTopWidth: 1,
          borderBottomColor: COLORS.button,
          borderBottomWidth: 1,
        }}>
        <ScrollView horizontal>
          {filters.map((item, index) => (
            <TouchableOpacity
              onPress={() => onSelectCategories(item.filter)}
              key={index}
              style={{
                marginHorizontal: 5,
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: '100%',
                backgroundColor:
                  selectedCategories === item.filter ? '#fff' : '#2b4f60',
                borderBottomWidth: 0,
                borderLeftWidth: 0,
                borderWidth: 3,
                borderColor:
                  selectedCategories === item.filter ? '#2b4f60' : '#fff',
                borderLeftColor: '#008891',
                borderBottomColor: '#008891',
                borderBottomRightRadius: 40,
                borderTopLeftRadius: 40,
                flexDirection: 'row',
                shadowColor: '#008891',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              <Icon
                name={item.icon}
                size={20}
                color={selectedCategories === item.filter ? '#008891' : '#fff'}
              />
              <Text
                style={{
                  color:
                    selectedCategories === item.filter ? '#008891' : '#fff',
                  fontSize: 10,
                  marginLeft: 3,
                }}>
                {item.filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  //nge render menu menu gengs
  function renderMenu() {
    return (
      <View
        style={{
          flex: 1,
          width: SIZES.width,
          padding: SIZES.padding * 2,
        }}>
        <FlatList
          data={filterData}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          scrollEventThrottle={1}
          renderItem={({item}) => (
            <CardMenu
              item={item}
              onDelete={handleDelete}
              onModal={paymentCheck}
            />
          )}
          numColumns={2}
        />
      </View>
    );
  }

  // Modal Checking payment (pop up modal)
  function renderOrderCheck() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
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
              marginBottom: -100,
              borderTopRightRadius: 30,
              borderTopLeftRadius: 30,
              padding: SIZES.padding * 2,
              paddingTop: SIZES.padding,
            }}>
            {/* close Modal */}
            <TouchableOpacity
              onPress={() => closeModal()}
              style={{marginBottom: 10, alignSelf: 'flex-end'}}>
              <Icon
                name="close-circle-outline"
                size={25}
                color={COLORS.button}
              />
            </TouchableOpacity>

            {/* checking all item order */}
            <View
              style={{
                padding: 5,
                justifyContent: 'flex-start',
                borderWidth: 1,
                borderColor: COLORS.button,
                flexDirection: 'row',
              }}>
              <Image
                source={{uri: listPayment.postImg}}
                style={{
                  width: 80,
                  height: 80,
                  marginRight: 10,
                }}
              />
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: COLORS.secondary,
                  }}>
                  {listPayment.title}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontStyle: 'italic',
                    color: COLORS.secondary,
                  }}>
                  {listPayment.about}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontStyle: 'italic',
                    color: COLORS.secondary,
                    marginTop: 10,
                  }}>
                  Rp.{listPayment.price}
                </Text>
              </View>
            </View>

            {/* Quantity change */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  editOrder('-', listPayment.postTime, listPayment.price)
                }>
                <Icon name="minus-circle" size={30} color={COLORS.button} />
              </TouchableOpacity>

              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginLeft: 5,
                  marginRight: 5,
                  color: COLORS.secondary,
                }}>
                {getOrderQty(listPayment.postTime)}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  editOrder('+', listPayment.postTime, listPayment.price)
                }>
                <Icon name="plus-circle" size={30} color={COLORS.button} />
              </TouchableOpacity>

              {/* Change the price according to quantity input */}
              <Text
                style={{
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: COLORS.secondary,
                  marginTop: 10,
                  position: 'absolute',
                  right: 0,
                }}>
                Total Rp.{total}
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginTop: 60,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {uploading ? (
                <View style={{alignSelf: 'center'}}>
                  <ActivityIndicator size="large" color="#a0937d" />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => toShoppingCart()}
                  style={{
                    height: 40,
                    flex: 1,
                    backgroundColor: `${COLORS.button}77`,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: COLORS.button,
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Icon name="basket-fill" color={COLORS.secondary} size={25} />
                  <Text
                    style={{
                      color: COLORS.secondary,
                      fontSize: 12,
                      marginLeft: 5,
                    }}>
                    kulkas ku
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

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
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 10}}
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
                {data.via === 'Pickup' ? 'Pickup Order!' : 'Delivery Now!'}
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

  //menampilkan tombol kulkas
  function renderToFridge() {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Kulkas')}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: SIZES.width * 0.8,
          position: 'absolute',
          bottom: 70,
          backgroundColor: `${'#85603f'}`,
          alignSelf: 'center',
          borderBottomLeftRadius: 50,
          borderTopRightRadius: 50,
          borderTopLeftRadius: 5,
          borderBottomRightRadius: 5,
          shadowColor: '#fff',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          elevation: 7,
          padding: 5,
          paddingLeft: 30,
          paddingRight: 30,
        }}>
        <View>
          <Text style={{color: '#fff', fontSize: 12}}>{totalQty} Items</Text>
          <Text style={{color: '#fff', marginTop: 5}}>Rp {totalPrice}</Text>
        </View>
        <Icon name="fridge-outline" size={25} color="#fff" />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RenderBackground />
      {renderHeader()}
      {renderCategories()}
      {renderMenu()}
      {renderOrderCheck()}
      {renderModalOutlet()}
      {totalQty === 0 ? <View /> : renderToFridge()}
      {!bg ? (
        <Image
          source={images.bg}
          resizeMode="contain"
          style={{
            width: 380,
            height: 380,
            position: 'absolute',
            bottom: 200,
            right: 0,
          }}
        />
      ) : null}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});

export default Drinks;
