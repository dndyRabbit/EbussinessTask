import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Home, Drinks, InputDrinks} from '../screens';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Drinks" component={Drinks} />
      <Stack.Screen name="InputDrinks" component={InputDrinks} />
    </Stack.Navigator>
  );
};

export default AuthStack;
