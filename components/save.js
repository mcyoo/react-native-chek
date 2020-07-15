import React from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {useDispatch} from 'react-redux';
import {userSave} from '../redux/usersSlice';

//to do loading screen
export default ({jwt}) => {
  const dispatch = useDispatch();
  console.log('im save');
  dispatch(userSave(jwt));
  return <Text>im save</Text>;
};
