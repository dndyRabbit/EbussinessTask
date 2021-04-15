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

const Register = ({navigation}) => {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const {register} = useContext(AuthContext);

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

  function RenderRegister() {
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
          Register ThinkTroppers !
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
          onPress={() => register(email, password)}
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
            Register
          </Text>
        </TouchableOpacity>

        <Text style={{fontSize: 12, color: COLORS.secondary}}>
          Already have an account?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.button,
                fontStyle: 'italic',
              }}>
              Login
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
      {RenderRegister()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});

export default Register;
