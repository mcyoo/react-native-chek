import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform, rgba} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {logIn, logOut} from '../redux/usersSlice';
import firebase from 'react-native-firebase';
import api from '../api';
import ListView from '../screens/listviews';
import stateSet from '../components/stateSet';
import RNRestart from 'react-native-restart';
import {userSave} from '../redux/usersSlice';
import getUrl from '../components/getData';
import Loader from './loader';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  update_loading = () => {
    this.setState({
      isLoading: true,
      noAuth: false,
      user_data: [],
    });
  };

  async componentDidMount() {
    this._checkPermission();
    this._listenForNotifications();
  }

  async _checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    console.log(enabled);
    if (enabled) {
      // user has permissions
      if (this.props.isLoggedIn) {
        this._getData();
        //getUrl(this.props.jwt_token, this.update_state);
      } else {
        this._updateTokenToServer();
      }
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
      this.setState({noAuth: true});
      alert('알림 설정을 체크해주세요.');
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
      console.log(token);

      console.log('save start');
      this.props.dispatch(userSave(token));

      this._getData();
    } catch (e) {
      alert('Server register Error');
    }
  }

  async _getData() {
    try {
      console.log('this is _getData()');
      //this.update_loading();
      const {data} = await api.urls(this.props.jwt_token);
      console.log(data);
      this.setState({
        isLoading: false,
        user_data: data,
      });
    } catch (e) {
      alert('connect error');
    }
  }

  async _domainDelete(index) {
    try {
      console.log(index);
      const {status} = await api.domain({index: index}, this.props.jwt_token);
      console.log(status);

      if (status === 200) {
        await this._getData();
        console.log('delete');
      }
    } catch (e) {
      alert('connect error');
    }
  }

  async _registUrl(url) {
    try {
      const {status} = await api.registUrl({url: url}, this.props.jwt_token);
      console.log(status);

      if (status === 200) {
        await this._getData();
        console.log('registURL');
      }
    } catch (e) {
      alert('connect error');
    }
  }

  async _changeState(index) {
    try {
      console.log(index);
      const {status} = await api.change({index: index}, this.props.jwt_token);
      console.log(status);

      if (status === 200) {
        await this._getData();
        console.log('chage_state');
      }
    } catch (e) {
      alert('connect error');
    }
  }

  async _listenForNotifications() {
    // onNotificationDisplayed - ios only

    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        //앱이 활성화 된 상태에서 요청되는 push 알림을 처리하게 됩니다.
        alert('notiacive');
        console.log('onNotification', notification);
        //reset_state();
        //reset_state();
        //stateSet();
        //RNRestart.Restart();
        //this._getData();
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // foreground, background에서 실행 중일때, push 알림을 클릭하여 열 때, 해당 push 알림을 처리하게 됩니다.
        alert('notifore');
        //console.log('onNotificationOpened', notificationOpen); 안나옴
        //RNRestart.Restart();
        this._getData();
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      // 앱이 종료된 상황에서 push 알림을 클릭하여 열 때, 해당 push 알림을 처리하게 됩니다.
      alert('notiback');
      //console.log('getInitialNotification', notificationOpen); 안나옴
    }
  }

  render() {
    const {isLoading, user_data, noAuth} = this.state;
    return isLoading ? (
      noAuth ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '(255,255,255,0.4)',
          }}>
          <Text style={{fontSize: 30, color: 'rgba(0,0,0,0.4)'}}>😰</Text>
        </View>
      ) : (
        <Loader />
      )
    ) : (
      <ListView data={user_data} update={this} /> //getData={this._getData} />
    );
  }
}
