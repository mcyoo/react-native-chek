import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {logIn, logOut} from '../redux/usersSlice';
import firebase from 'react-native-firebase';
import api from '../api';
import Listview from '../screens/listviews';
import Save from '../components/save';

export default class extends React.Component {
  state = {
    isLoading: true,
  };
  async componentDidMount() {
    this._checkPermission();
    this._listenForNotifications();
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async _checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    console.log(enabled);
    if (enabled) {
      // user has permissions
      this._updateTokenToServer();
    } else {
      // user doesn't have permission
      this._requestPermission();
    }
  }

  async _requestPermission() {
    try {
      // User has authorised
      await firebase.messaging().requestPermission();
      await this._updateTokenToServer();
    } catch (error) {
      // User has rejected permissions
      alert("you can't handle push notification");
    }
  }

  async _updateTokenToServer() {
    const fcmToken = await firebase.messaging().getToken();
    console.log(fcmToken);
    try {
      const {
        data: {token},
      } = await api.register({
        user_os: Platform.OS,
        user_ver: Platform.Version,
        token: fcmToken,
      });
      this.setState({
        token,
        isLoading: false,
      });
      console.log(token);
    } catch (e) {
      alert('Server register Error');
    }
  }

  async _listenForNotifications() {
    // onNotificationDisplayed - ios only

    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        //앱이 활성화 된 상태에서 요청되는 push 알림을 처리하게 됩니다.
        console.log('onNotification', notification);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // foreground, background에서 실행 중일때, push 알림을 클릭하여 열 때, 해당 push 알림을 처리하게 됩니다.
        console.log('onNotificationOpened', notificationOpen);
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      // push 알림을 클릭하여 열 때, 해당 push 알림을 처리하게 됩니다.
      console.log('getInitialNotification', notificationOpen);
    }
  }

  render() {
    const {isLoading, token} = this.state;
    return isLoading ? <Text>Loading</Text> : <Save jwt={token} />; //To do loading screen
  }
}
