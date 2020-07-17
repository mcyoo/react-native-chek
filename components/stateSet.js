import React from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import ListView from '../screens/listviews';
import {recap} from '../redux/usersSlice';
import {useDispatch} from 'react-redux';

export default () => {
  console.log('dsff');
  const dispatch = useDispatch();
  dispatch(recap());
  return;
};
