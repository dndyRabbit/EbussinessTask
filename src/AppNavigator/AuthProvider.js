import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth()
              .signInWithEmailAndPassword(email, password)
              .then(() => {
                alert('Login Successfully!');
              });
          } catch (error) {
            console.log(error);
            if (error.code === 'auth/wrong-password') {
              Alert.alert('Wrong Password !');
            } else if (error.code === 'auth/too-many-requests') {
              Alert.alert(
                'Too many request, account has ben disabled temporarly!',
              );
            }
          }
        },
        register: async (email, password) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: '',
                    lname: '',
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  });
              });
          } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
              Alert.alert('Used', 'That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
              Alert.alert('Invalid', 'That email address is invalid!');
            }
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
