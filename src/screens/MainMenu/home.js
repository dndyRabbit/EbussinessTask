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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../AppNavigator/AuthProvider';

const Home = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [toggle, setToggle] = useState(0);

  const toggleMenu = () => {
    const toValue = toggle ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
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
      outputRange: ['0deg', '45deg'],
    });
    return (
      <View
        style={{
          width: SIZES.width,
          alignItems: 'center',
          padding: SIZES.padding * 2,
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={toggleMenu}
          activeOpacity={1}
          style={[styles.button, {transform: [{rotate}, {scale}]}]}>
          <Icon name="plus" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
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
          margin: SIZES.padding * 2,
          marginTop: 0,
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
