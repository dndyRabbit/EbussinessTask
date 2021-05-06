import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {images, SIZES, COLORS} from '../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStack, {
  ExploreStack,
  MenuStack,
  FridgeStack,
  ProfileStack,
} from './AppStack';

const Tab = createBottomTabNavigator();

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

const TabsStack = () => {
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
        component={MenuStack}
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
        component={ExploreStack}
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
        name="Fridge"
        component={FridgeStack}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="fridge-top"
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
              Fridge
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Profiles"
        component={ProfileStack}
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

export default TabsStack;
