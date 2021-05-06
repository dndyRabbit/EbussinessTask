import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './AuthProvider';

import {ActivityIndicator, View} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import auth from '@react-native-firebase/auth';

import AuthStack from './AuthStack';
import TabsStack from './BottomStack';

const Routes = () => {
  const [initializing, setInitializing] = useState(true);
  const {setUser, user} = useContext(AuthContext);

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? <TabsStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
