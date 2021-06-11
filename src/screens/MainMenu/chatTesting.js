import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useLayoutEffect,
} from 'react';
import {View, Text} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {AuthContext} from '../../AppNavigator/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const ChatTest = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState([]);

  const item = route.params;

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        setUserData(documentSnapshot.data());
      });
  };

  useEffect(() => {
    console.log(item);
    getUser();
  }, []);

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapShot =>
        setMessages(
          snapShot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          })),
        ),
      );
    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );

    const {_id, createdAt, text, user} = messages[0];
    firestore().collection(`chats`).add({
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      renderUsernameOnMessage={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: item.email,
        name: item.name,
        avatar: item.image,
      }}
    />
  );
};

export default ChatTest;
