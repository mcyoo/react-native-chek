import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import api from '../api';
import {useSelector, useDispatch} from 'react-redux';

export default (getUrl = async (token, setState) => {
  console.log(token);
  try {
    const {data} = await api.urls(token);
    console.log(data);
    setState({
      isLoading: false,
      user_data: data,
    });
    return;
  } catch (e) {
    alert('error');
  }
});
