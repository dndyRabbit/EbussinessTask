import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Home,
  Drinks,
  InputDrinks,
  Kulkas,
  userProfiles,
  ChatTest,
  Friends,
  Explore,
  locationMaps,
} from '../screens';

const Stack = createStackNavigator();

export const ExploreStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Explore" component={Explore} />
    </Stack.Navigator>
  );
};

export const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="userProfiles" component={userProfiles} />
      <Stack.Screen name="locationMaps" component={locationMaps} />
    </Stack.Navigator>
  );
};

export const FridgeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Kulkas" component={Kulkas} />
    </Stack.Navigator>
  );
};

export const MenuStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Drinks" component={Drinks} />

      <Stack.Screen name="Kulkas" component={Kulkas} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="InputDrinks" component={InputDrinks} />
    </Stack.Navigator>
  );
};

export default HomeStack;
