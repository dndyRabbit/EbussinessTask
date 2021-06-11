import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  InputMenu,
  UpdateMenu,
  HomeAdmin,
  PaymentConfirmation,
  OutletManage,
  SalesHistory,
  OrderFinished,
} from '../screens';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Stack = createStackNavigator();
const TopStack = createMaterialTopTabNavigator();

export const ConfirmationStack = () => {
  return (
    <TopStack.Navigator
      tabBarOptions={{
        showLabel: true,
        style: {},
      }}>
      <TopStack.Screen
        name="Payment Confirmation"
        component={PaymentConfirmation}
      />
      <TopStack.Screen name="Order Finished" component={OrderFinished} />
    </TopStack.Navigator>
  );
};

const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeAdmin" component={HomeAdmin} />
      <Stack.Screen name="InputMenu" component={InputMenu} />
      <Stack.Screen name="UpdateMenu" component={UpdateMenu} />
      <Stack.Screen name="PaymentConfirmation" component={ConfirmationStack} />
      <Stack.Screen name="OutletManage" component={OutletManage} />
      <Stack.Screen name="SalesHistory" component={SalesHistory} />
    </Stack.Navigator>
  );
};

export default AdminStack;
