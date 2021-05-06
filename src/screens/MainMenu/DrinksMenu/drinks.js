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
import {CardMenu} from '../../Components';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../../AppNavigator/AuthProvider';

const Drinks = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [listPayment, setListPaymnet] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState('all');
  const [filterData, setFilterData] = useState(menu);
  const [count, setCount] = useState(0);

  const {user} = useContext(AuthContext);

  let total = orderItems.reduce((a, b) => a + b.total || 0, 0);

  let quantityItem = total / listPayment.price;

  useEffect(() => {
    fetchFilters();
    setLoading(false);
    fetchSizeFridge();
    fetchPost();
    setDeleted(false);
    setFilterData(menu);
  }, [deleted, loading]);

  function onSelectCategories(category) {
    //filter restaurant
    if (category !== 'all') {
      setFilterData([...menu.filter(a => a.tags.includes(category))]);
    } else {
      setFilterData(menu);
    }
    setSelectedCategories(category);
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

          if (loading) {
            setLoading(false);
          }
        });
    } catch (error) {}
  };

  //fetch size of fridge
  const fetchSizeFridge = async () => {
    await firestore()
      .collection('orders')
      .where('userId', '==', user.uid)
      .orderBy('orderTime', 'desc')
      .get()
      .then(querySnapshot => {
        setCount(querySnapshot.size);
      });
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
                setDeleted(true);
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

  //create new order to firestore
  const toShoppingCart = async () => {
    await firestore()
      .collection('orders')
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
        setOrderItems([]);
        setModalVisible(!modalVisible);
        setDeleted(true);
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
        {/* item in fridge */}
        {count ? (
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 20,
              height: 20,
              borderRadius: 20 / 2,
              backgroundColor: '#ce1212',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                fontWeight: 'bold',
              }}>
              {count}
            </Text>
          </View>
        ) : null}

        {/* keranjang */}
        <TouchableOpacity
          style={{position: 'absolute', right: 10, top: 10}}
          onPress={() => navigation.navigate('Kulkas')}>
          <Icon name="fridge" size={30} color={COLORS.button} />
        </TouchableOpacity>

        <Icon
          name="store-outline"
          size={30}
          color={COLORS.button}
          style={{margin: 15}}
        />
        <TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <Text style={{fontSize: 12, color: COLORS.secondary}}>Pickup </Text>
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
            <Text style={{color: '#f8f5f1', fontSize: 12}}>OUTLET TUTUP </Text>
            <Text
              style={{color: '#f8f5f1', fontSize: 16, fontWeight: 'bold'}}
              numberOfLines={1}>
              ~ ThinkTop Cipulir{' '}
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
          contentContainerStyle={{paddingBottom: 20}}
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
        animationType="slide"
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
              style={{marginBottom: 10, alignSelf: 'center'}}>
              <Icon
                name="arrow-collapse-down"
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
              }}>
              <TouchableOpacity
                onPress={() => toShoppingCart()}
                style={{
                  height: 40,
                  flex: 0.3,
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

              {/* Buy Now */}
              <TouchableOpacity
                style={{
                  height: 40,
                  flex: 0.7,
                  backgroundColor: `${COLORS.button}77`,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: COLORS.button,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Icon
                  name="hand-pointing-up"
                  color={COLORS.secondary}
                  size={25}
                />
                <Text style={{color: COLORS.secondary}}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RenderBackground />
      {renderHeader()}
      {/* {renderHeaderModal()} */}
      {renderCategories()}
      {renderMenu()}
      {renderOrderCheck()}
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
