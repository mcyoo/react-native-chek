import React, {useEffect} from 'react';
import {View, Text, Platform, rgba, Image} from 'react-native';
import firebase from 'react-native-firebase';
import api from '../api';
import ListView from '../screens/listviews';
import {userSave} from '../redux/usersSlice';
import SplashScreen from 'react-native-splash-screen';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      noAuth: false,
      user_data: [],
    };
  }

  async componentDidMount() {
    //this.loadAssets();
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
    this._checkPermission();
    this._listenForNotifications();
  }

  async loadAssets() {
    const images = [
      require('../assets/1F9D1_color.png'),
      require('../assets/1F64B_color.png'),
    ];
    images.map(image => {
      Image.prefetch(image);
    });
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
        status,
      } = await api.register({
        user_os: Platform.OS,
        user_ver: Platform.Version,
        token: fcmToken,
      });
      console.log(token);
      if (status === 200) {
        //save
        this.props.dispatch(userSave(token));
        this._getData();
      } else {
        alert('잘못된 요청입니다.');
      }
    } catch (e) {
      alert('데이터 연결을 확인해 주세요.');
    }
  }

  async _getData() {
    console.log('getData');
    try {
      this.setState({
        isLoading: true,
      });

      const {data, status} = await api.urls(this.props.jwt_token);
      console.log(data);

      if (status === 200) {
        this.setState({
          isLoading: false,
          user_data: data,
        });
      } else {
        alert('잘못된 요청입니다.');
      }
    } catch (e) {
      alert('데이터 연결을 확인해 주세요.');
    }
  }

  async _domainDelete(index) {
    console.log('delete');
    try {
      this.setState({
        isLoading: true,
      });

      const {status} = await api.domain({index: index}, this.props.jwt_token);
      console.log(status);

      if (status === 200) {
        await this._getData();
      } else {
        alert('잘못된 요청입니다.');
      }
    } catch (e) {
      alert('데이터 연결을 확인해 주세요.');
    }
  }

  async _registUrl(url) {
    console.log('registURL');
    try {
      this.setState({
        isLoading: true,
      });

      const {status} = await api.registUrl({url: url}, this.props.jwt_token);
      console.log(status);

      if (status === 200) {
        await this._getData();
      } else {
        alert('잘못된 요청입니다.');
      }
    } catch (e) {
      alert('데이터 연결을 확인해 주세요.');
    }
  }

  async _changeState(index) {
    console.log('chage_state');
    try {
      this.setState({
        isLoading: true,
      });

      const {status} = await api.change({index: index}, this.props.jwt_token);
      console.log(status);

      if (status === 200) {
        await this._getData();
      } else {
        alert('잘못된 요청입니다.');
      }
    } catch (e) {
      alert('데이터 연결을 확인해 주세요.');
    }
  }

  async _listenForNotifications() {
    // onNotificationDisplayed - ios only

    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        //앱이 활성화 된 상태에서 요청되는 push 알림을 처리하게 됩니다.
        //alert('notiacive');
        console.log('onNotification', notification);
        //RNRestart.Restart();
        this._getData();
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // foreground, background에서 실행 중일때, push 알림을 클릭하여 열 때, 해당 push 알림을 처리하게 됩니다.
        //alert('notifore');
        //console.log('onNotificationOpened', notificationOpen); 안나옴
        //RNRestart.Restart();
        this._getData();
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      // 앱이 종료된 상황에서 push 알림을 클릭하여 열 때, 해당 push 알림을 처리하게 됩니다.
      //alert('notiback');
      //console.log('getInitialNotification', notificationOpen); 안나옴
    }
  }

  render() {
    const {isLoading, user_data, noAuth} = this.state;
    return noAuth ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 50, color: 'rgba(0,0,0,0.3)'}}>😂</Text>
        <Text style={{fontSize: 30, color: 'rgba(0,0,0,0.3)'}}>
          알림 설정 해주세요.
        </Text>
      </View>
    ) : (
      <ListView data={user_data} update={this} isLoading={isLoading} />
    );
  }
}
