import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Home,
  Kulkas,
  userProfiles,
  Checkout,
  Explore,
  locationMaps,
  AlamatMaps,
  FinishPayment,
  VerificationPayment,
  OnGoing,
  OrderDone,
  Failed,
} from '../screens';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TabsStack} from './BottomStack';

const Stack = createStackNavigator();
const TopStack = createMaterialTopTabNavigator();

export const BookingTopStack = () => {
  return (
    <TopStack.Navigator
      tabBarOptions={{
        showLabel: true,
        style: {},
      }}>
      <TopStack.Screen name="OnGoing" component={OnGoing} />
      <TopStack.Screen name="Done" component={OrderDone} />
      <TopStack.Screen name="Failed" component={Failed} />
    </TopStack.Navigator>
  );
};

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
    </Stack.Navigator>
  );
};

export const GetLocationStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AlamatMaps" component={AlamatMaps} />
      <Stack.Screen name="locationMaps" component={locationMaps} />
    </Stack.Navigator>
  );
};

export const MenuStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Kulkas" component={Kulkas} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="FinishPayment" component={FinishPayment} />
      <Stack.Screen
        name="VerificationPayment"
        component={VerificationPayment}
      />
      <Stack.Screen name="Home" component={TabsStack} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default HomeStack;
