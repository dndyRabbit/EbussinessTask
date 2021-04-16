import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {images, COLORS, SIZES} from '../../constants';

import {AuthContext} from '../../AppNavigator/AuthProvider';

const Home = ({navigation}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [toggle, setToggle] = useState(0);

  const toggleMenu = () => {
    const toValue = toggle ? 0 : 1;

    Animated.spring(scrollX, {
      toValue,
      friction: 20,
      useNativeDriver: true,
    }).start();

    setToggle(!toggle);
  };

  const {logout} = useContext(AuthContext);

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
    const rotate = scrollX.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '225deg'],
    });
    const rotateText = scrollX.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-225deg'],
    });
    const scale = scrollX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const translatePlus = scrollX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 60],
    });
    const translateMin = scrollX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -60],
    });

    return (
      <Animated.View
        style={{
          width: SIZES.width,
          alignItems: 'center',
          height: 180,
          padding: SIZES.padding * 2,
          justifyContent: 'center',
          transform: [{translateY: translateMin}],
          position: 'absolute',
          bottom: 0,
        }}>
        {/* InputDrinks */}
        <TouchableOpacity
          onPress={() => navigation.navigate('InputDrinks')}
          style={{
            transform: [{rotate}, {scale}, {translateX: translateMin}],
            borderWidth: 1,
            borderColor: COLORS.button,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            position: 'absolute',
          }}>
          <View
            style={{
              backgroundColor: `${COLORS.button}77`,
              width: 50,
              height: 50,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: COLORS.button,
            }}>
            <Animated.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{rotate: rotateText}],
              }}>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 25,
                }}>
                ㊗
              </Text>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 8,
                }}>
                Input
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Unknown */}
        <TouchableOpacity
          style={{
            transform: [{rotate}, {scale}, {translateX: translatePlus}],
            borderWidth: 1,
            borderColor: COLORS.button,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            position: 'absolute',
          }}>
          <View
            style={{
              backgroundColor: `${COLORS.button}77`,
              width: 50,
              height: 50,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: COLORS.button,
            }}>
            <Animated.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{rotate: rotateText}],
              }}>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 25,
                }}>
                ㊐
              </Text>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 8,
                }}>
                Unknown
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Booking */}
        <TouchableOpacity
          style={{
            transform: [{rotate}, {scale}, {translateY: translatePlus}],
            borderWidth: 1,
            borderColor: COLORS.button,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            position: 'absolute',
          }}>
          <View
            style={{
              backgroundColor: `${COLORS.button}77`,
              width: 50,
              height: 50,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: COLORS.button,
            }}>
            <Animated.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{rotate: rotateText}],
              }}>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 25,
                }}>
                ㊋
              </Text>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 8,
                }}>
                Booking
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Drinks */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Drinks')}
          style={{
            transform: [{rotate}, {scale}, {translateY: translateMin}],
            borderWidth: 1,
            borderColor: COLORS.button,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            position: 'absolute',
          }}>
          <View
            style={{
              backgroundColor: `${COLORS.button}77`,
              width: 50,
              height: 50,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: COLORS.button,
            }}>
            <Animated.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{rotate: rotateText}],
              }}>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 25,
                }}>
                ㊧
              </Text>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 8,
                }}>
                Drinks
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Menu */}
        <TouchableOpacity
          onPress={toggleMenu}
          activeOpacity={1}
          style={{
            transform: [{rotate}],
            borderWidth: 1,
            borderColor: COLORS.button,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}>
          <View
            style={{
              backgroundColor: `${COLORS.button}77`,
              width: 50,
              height: 50,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: COLORS.button,
            }}>
            <Animated.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{rotate: rotateText}],
              }}>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 25,
                }}>
                ㊮
              </Text>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: 8,
                }}>
                Menu
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <RenderBackground />
      <Image
        source={images.Logo}
        style={{
          width: 200,
          height: 200,
          position: 'absolute',
          top: 0,
          left: 20,
        }}
        resizeMode="contain"
      />
      <FloatingButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});

export default Home;
