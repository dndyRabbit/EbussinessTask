import React, {useLayoutEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator} from '@react-navigation/stack';
import {Profile, Explore, Drinks, Inbox} from '../screens';
import HomeStack, {
  ExploreStack,
  MenuStack,
  GetLocationStack,
  ProfileStack,
  BookingTopStack,
} from './AppStack';
import AdminStack from './AdminStack';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const TabBarCustomButton = ({accessibilityState, children, onPress}) => {
  var isSelected = accessibilityState.selected;

  if (isSelected) {
    return (
      <View
        style={{
          marginHorizontal: 10,
          width: 50,
        }}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {children}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View
        style={{
          marginHorizontal: 10,
          width: 50,
        }}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {children}
        </TouchableOpacity>
      </View>
    );
  }
};

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={TabsStack} />
      <Stack.Screen name="Kulkas" component={MenuStack} />
      <Stack.Screen name="Explore" component={ExploreStack} />
      <Stack.Screen name="userProfiles" component={ProfileStack} />
      <Stack.Screen name="Delivery" component={BookingTopStack} />
      <Stack.Screen name="AlamatMaps" component={GetLocationStack} />
      <Stack.Screen name="AdminStack" component={AdminStack} />
    </Stack.Navigator>
  );
};

export const TabsStack = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: true,
        style: {
          position: 'absolute',
          left: 0,
          bottom: 5,
          right: 0,
          borderBottomWidth: 0,
          backgroundColor: '#114e60',
          borderRadius: 30,
          borderWidth: 1,
          borderColor: '#d8e3e7',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="home"
              size={focused ? 25 : 30}
              color={focused ? '#F6A545' : '#fff'}
              style={{marginTop: focused ? -5 : 0}}
            />
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 10,
                color: focused ? '#F6A545' : 'transparent',
                textAlign: 'center',
                marginBottom: focused ? 5 : -10,
              }}>
              Home
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Menu"
        component={Drinks}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="beer"
              size={focused ? 23 : 30}
              color={focused ? '#F6A545' : '#fff'}
              style={{marginTop: focused ? -2 : 0}}
            />
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 10,
                color: focused ? '#F6A545' : 'transparent',
                textAlign: 'center',
                marginBottom: focused ? 5 : -10,
              }}>
              Menu
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="compass"
              size={focused ? 25 : 30}
              color={focused ? '#F6A545' : '#fff'}
              style={{marginTop: focused ? -5 : 0}}
            />
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 10,
                color: focused ? '#F6A545' : 'transparent',
                textAlign: 'center',
                marginBottom: focused ? 5 : -10,
              }}>
              Explore
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Inbox"
        component={Inbox}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="book"
              size={focused ? 25 : 30}
              color={focused ? '#F6A545' : '#fff'}
              style={{marginTop: focused ? -5 : 0}}
            />
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 10,
                color: focused ? '#F6A545' : 'transparent',
                textAlign: 'center',
                marginBottom: focused ? 5 : -10,
              }}>
              Booking
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="account-tie"
              size={focused ? 25 : 30}
              color={focused ? '#F6A545' : '#fff'}
              style={{marginTop: focused ? -5 : 0}}
            />
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 10,
                color: focused ? '#F6A545' : 'transparent',
                textAlign: 'center',
                marginBottom: focused ? 5 : -10,
              }}>
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
