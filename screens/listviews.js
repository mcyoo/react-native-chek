import React, {useState, Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  StyleSheet,
  Clipboard,
  rgba,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import {isUrl} from '../utils';
import Swipeout from 'react-native-swipeout';
import Input from '../components/Input';
import Btn from '../components/Btn';
import Loader from './loader';
import DismissKeyboard from '../components/DismissKeyboard';

const isAndroid = Platform.OS === 'android';

function Item({item}) {
  return (
    <View style={styles.listItem}>
      <View style={{flex: 1}}>
        <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
        <Text>{item.url}</Text>
      </View>
      <View
        style={{
          height: 50,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {item.change ? (
          <Text style={{fontSize: 30}}>😲</Text>
        ) : (
          <Text style={{fontSize: 30}}>😳</Text>
        )}
      </View>
    </View>
  );
}

class FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRowKey: null,
    };
  }

  handleClick = () => {
    Linking.canOpenURL(this.props.item.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.item.url);
        this.props.update._changeState(this.props.index);
      } else {
        alert('알 수 없는 URL');
        console.log("Don't know how to open URI: " + this.props.item.url);
      }
    });
  };

  render() {
    const swipeSettings = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {
        if (this.state.activeRowKey != null) {
          this.setState({activeRowKey: null});
        }
      },
      //close: this.state.activeRowKey !== this.props.index,
      onOpen: (secId, rowId, direction) => {
        this.setState({activeRowKey: rowId});
      },
      right: [
        {
          onPress: () => {
            console.log(this.props.index);
            this.props.update._domainDelete(this.props.index);
          },
          text: 'Delete',
          type: 'delete',
        },
      ],
      rowId: this.props.index,
      sectionId: 1,
    };

    return (
      <Swipeout {...swipeSettings}>
        <TouchableOpacity onPress={this.handleClick}>
          <Item item={this.props.item} />
        </TouchableOpacity>
      </Swipeout>
    );
  }
}

export default ({data, update, isLoading}) => {
  const [user_data, setData] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = () => {
    if (user_data === '') {
      alert('URL 주소를 입력해 주세요.');
      return false;
    }
    if (!isUrl(user_data)) {
      alert('잘못된 URL 주소입니다.');
      setData('');
      return false;
    }
    return true;
  };

  const onRefresh = () => {
    update._getData();
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      return;
    }
    setLoading(true);
    update._registUrl(user_data);
    setData('');
    setLoading(false);
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setData(text);
  };

  const checkData = () => {
    if (data.length === 0) {
      return false;
    } else {
      return true;
    }
  };
  const checkData_Five = () => {
    if (data.length === 5) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <View style={isAndroid ? styles.android_container : styles.ios_container}>
      <StatusBar barStyle={isAndroid ? 'default' : 'dark-content'} />
      {checkData() ? (
        <FlatList
          style={{flex: 1}}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={data}
          renderItem={({item, index}) => {
            return <FlatListItem index={index} item={item} update={update} />;
          }}
        />
      ) : (
        <DismissKeyboard>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: 'rgba(0,0,0,0.2)'}}>
              😳 ➡️ 변화 없음
            </Text>
            <Text
              style={{fontSize: 20, color: 'rgba(0,0,0,0.2)', marginTop: 6}}>
              😲 ➡️ 변화 있음
            </Text>
          </View>
        </DismissKeyboard>
      )}
      <KeyboardAvoidingView behavior={isAndroid ? 'height' : 'position'}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginBottom: 12,
          }}>
          <Input
            value={user_data}
            placeholder="URL"
            keyboardType="email-address"
            autoCapitalize="none"
            stateFn={setData}
          />
          <Btn text={'붙여넣기'} accent onPress={fetchCopiedText} />
          <Btn
            text={'등록'}
            loading={loading}
            accent
            onPress={handleSubmit}
            prevent={checkData_Five()}
          />
        </View>
      </KeyboardAvoidingView>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  android_container: {
    flex: 1,
    backgroundColor: 'white',
  },
  ios_container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: '#FFF',
    width: '95%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
});
