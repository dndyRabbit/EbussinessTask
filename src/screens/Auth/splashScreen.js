import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import {images, COLORS, SIZES} from '../../constants';

const SplashScreen = ({navigation}) => {
  const animation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: 1,
      tension: 2,
      friction: 10,
      duration: 3000,

      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      navigation.replace('Login');
    }, 3000);
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <RenderBackground />
      <Animated.View
        style={{
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [100, -100],
              }),
            },
          ],
        }}>
        <Image source={images.Logo} style={{width: 300}} resizeMode="contain" />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SplashScreen;
