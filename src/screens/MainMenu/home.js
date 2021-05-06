import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {images, COLORS, SIZES} from '../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../AppNavigator/AuthProvider';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';

const ITEM_SIZE = SIZES.width * 0.45;

const Home = ({navigation}) => {
  const [favorite, setFavorite] = useState([]);
  const {user, logout} = useContext(AuthContext);

  React.useEffect(() => {
    fetchFavDrinks();
  }, []);

  const fetchFavDrinks = async () => {
    try {
      const list = [];
      await firestore()
        .collection('drinks')
        .where('tags', 'array-contains', 'favorite')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {about, postImg, postTime, price, tags, title} = doc.data();
            list.push({
              id: doc.id,
              about,
              postImg,
              postTime,
              price,
              tags,
              title,
            });
          });
          setFavorite(list);
        });
    } catch (e) {
      console.log('something wrong!', e);
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

  const FloatingButton = () => {
    return (
      <>
        {user.uid === 'beQY3fpLGmQQCtuNUeXkzJGG8bn1' ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('InputDrinks')}
            style={{
              transform: [{rotate: '45deg'}, {translateX: 60}],
              borderWidth: 1,
              borderColor: COLORS.button,
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              position: 'absolute',
              bottom: 150,
              right: 60,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{rotate: '-45deg'}],
              }}>
              <Icon name="database-import" size={25} color={COLORS.secondary} />
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 8,
                }}>
                Input
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
      </>
    );
  };

  const RenderSwiperBanner = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 230,
        }}>
        <SwiperFlatList
          autoplay
          autoplayDelay={4}
          autoplayLoop
          showPagination
          paginationActiveColor={COLORS.button}
          paginationStyle={{alignSelf: 'flex-start'}}
          paginationStyleItem={{
            width: 8,
            height: 8,
            marginHorizontal: 3,
          }}>
          <View style={{width: SIZES.width}}>
            <Image
              source={images.Banner1}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 200,
              }}
            />
          </View>
          <View style={{width: SIZES.width}}>
            <Image
              source={images.Banner2}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 200,
              }}
            />
          </View>
          <View style={{width: SIZES.width}}>
            <Image
              source={images.Banner3}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 200,
              }}
            />
          </View>
        </SwiperFlatList>
      </View>
    );
  };

  const RenderFavoriteDrinks = () => {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            width: ITEM_SIZE,
            marginHorizontal: 5,
          }}>
          <LinearGradient
            colors={[COLORS.button, COLORS.primary]}
            style={{
              alignItems: 'center',
              borderRadius: 5,
              marginHorizontal: 10,
            }}>
            <Text
              style={{
                color: COLORS.secondary,
                fontWeight: 'bold',
                marginBottom: 5,
              }}>
              {item.title}
            </Text>
            <Image
              source={{uri: item.postImg}}
              style={{width: 120, height: 120, borderRadius: 60}}
            />
            <Text
              style={{
                alignSelf: 'flex-start',
                paddingLeft: 10,
                fontSize: 12,
                color: COLORS.secondary,
                marginVertical: 5,
              }}>
              {item.about}
            </Text>
            <Text style={{fontSize: 16, color: COLORS.secondary}}>
              Rp.{item.price}
            </Text>
            {item.tags[1] ? (
              <Icon
                name="sale"
                size={30}
                color="#ff8303"
                style={{position: 'absolute', bottom: 60, left: 0}}
              />
            ) : null}
            <Icon
              name="heart"
              size={25}
              color="#cf0000"
              style={{position: 'absolute', bottom: 5, right: 5}}
            />
          </LinearGradient>
        </View>
      );
    };
    return (
      <View
        style={{
          width: SIZES.width,
          height: 310,
          // backgroundColor: '#687980',
          marginTop: 10,
          padding: SIZES.padding * 2,
        }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
          }}>
          Favorit Thinktopers!
        </Text>
        <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
          }}>
          <Text
            style={{
              fontSize: 12,
              color: COLORS.button,
              fontStyle: 'italic',
              textDecorationLine: 'underline',
            }}>
            See all
          </Text>
        </TouchableOpacity>

        <Carousel
          data={favorite}
          layout={'stack'}
          autoplay
          loop
          autoplayDelay={3}
          key={item => `${item.id}`}
          layoutCardOffset={18}
          sliderWidth={SIZES.width}
          itemWidth={150}
          useScrollView
          renderItem={renderItem}
          activeSlideAlignment="center"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <RenderBackground />
      <RenderSwiperBanner />
      <RenderFavoriteDrinks />
      <FloatingButton />

      <Image
        source={images.Logo}
        style={{
          width: 70,
          height: 70,
          top: -5,
          left: 10,
          position: 'absolute',
        }}
        resizeMode="contain"
      />

      {/* logout */}
      <TouchableOpacity
        onPress={() => logout()}
        style={{
          borderWidth: 1,
          borderColor: COLORS.button,
          width: 60,
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
          position: 'absolute',
          top: 0,
          right: 0,
        }}>
        <Text
          style={{
            color: COLORS.secondary,
            fontSize: 12,
          }}>
          Logout
        </Text>
      </TouchableOpacity>
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
    borderBottomColor: '#053975',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Home;
