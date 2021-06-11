import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {images, COLORS, SIZES} from '../../constants';
import {AuthContext} from '../../AppNavigator/AuthProvider';

const Login = ({navigation}) => {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  const {login} = useContext(AuthContext);

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

  function RenderLogin() {
    return (
      <View
        style={{
          flex: 1,
          width: SIZES.width,
          padding: SIZES.padding * 2,
        }}>
        <Text
          style={{
            color: COLORS.secondary,
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 30,
          }}>
          Login ThinkTroppers !
        </Text>

        <TextInput
          onChangeText={value => onChangeEmail(value)}
          value={email}
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          style={{
            width: '100%',
            height: 40,
            borderColor: COLORS.button,
            borderWidth: 1,
            borderRadius: 10,
            padding: SIZES.padding,
            alignItems: 'center',
            marginBottom: 10,
          }}
        />

        <TextInput
          onChangeText={value => onChangePassword(value)}
          value={password}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          style={{
            width: '100%',
            height: 40,
            borderColor: COLORS.button,
            borderWidth: 1,
            borderRadius: 10,
            padding: SIZES.padding,
            marginBottom: 20,
          }}
        />

        <TouchableOpacity
          onPress={() => login(email, password)}
          style={{
            width: '100%',
            height: 40,
            backgroundColor: COLORS.button,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <Text
            style={{fontSize: 16, fontWeight: 'bold', color: COLORS.secondary}}>
            Login
          </Text>
        </TouchableOpacity>

        <Text style={{fontSize: 12, color: COLORS.secondary}}>
          Didnt Have an account yet?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.button,
                fontStyle: 'italic',
              }}>
              Register
            </Text>
          </TouchableOpacity>{' '}
          now!
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RenderBackground />
      <Image
        source={images.Logo}
        style={{
          width: 200,
          height: 200,
          alignSelf: 'center',
          marginTop: 80,
        }}
        resizeMode="contain"
      />
      {RenderLogin()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});

export default Login;
