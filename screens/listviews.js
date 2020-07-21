import React, {useState, Component, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  StyleSheet,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Clipboard,
  rgba,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {logIn, logOut} from '../redux/usersSlice';
import styled from 'styled-components/native';
import api from '../api';
import {isUrl} from '../utils';
import Swipeout from 'react-native-swipeout';
import StateSet from '../components/stateSet';
import RNRestart from 'react-native-restart';
import Input from '../components/Input';
import Btn from '../components/Btn';

const Container = styled.View``;

const Title = styled.Text`
  font-size: 40px;
  border: 2px solid grey;
`;

const List_text = styled.Text`
  font-size: 20px;
`;

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
          <Text style={{fontSize: 30}}>🧐</Text>
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
            //RNRestart.Restart();
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

export default ({data, update}) => {
  const [user_data, setData] = useState('');
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const isFormValid = () => {
    if (user_data === '') {
      alert('All fields are required.');
      return false;
    }
    if (!isUrl(user_data)) {
      alert('URL is invalid');
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
    update._registUrl(user_data);
    setData('');
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
    <View style={styles.container}>
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 20, color: 'rgba(0,0,0,0.4)'}}>
            🧐 ➡️ 변화 없음
          </Text>
          <Text style={{fontSize: 20, color: 'rgba(0,0,0,0.4)', marginTop: 6}}>
            😲 ➡️ 변화 있음
          </Text>
        </View>
      )}
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
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
          loading={checkData_Five()}
          accent
          onPress={handleSubmit}
        />
      </View>

      <TouchableOpacity onPress={() => dispatch(logOut())}>
        <Text>initalize redux store</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 20,
  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: '#FFF',
    width: '92%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
});
