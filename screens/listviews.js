import React, {useState, Component, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
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

const Container = styled.View`
  display: flex;
`;

const Title = styled.Text`
  font-size: 40px;
  border: 2px solid grey;
`;

const List_text = styled.Text`
  font-size: 20px;
`;

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
      onOpen: (secId, rowId, direction) => {
        this.setState({activeRowKey: this.props.item.key});
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
          <View style={{flex: 1, flexDirection: 'row'}}>
            <List_text>
              {this.props.item.title} {this.props.item.url}
            </List_text>
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  }
}

export default ({data, update}) => {
  const [user_data, setData] = useState('');
  const dispatch = useDispatch();

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

  const handleSubmit = () => {
    if (!isFormValid()) {
      return;
    }
    update._registUrl(user_data);
  };

  return (
    <Container>
      <Title>FlatList Test</Title>
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          return <FlatListItem index={index} item={item} update={update} />;
        }}
      />

      <Input
        value={user_data}
        placeholder="URL"
        keyboardType="email-address"
        autoCapitalize="none"
        stateFn={setData}
      />
      <Btn text={'등록'} accent onPress={handleSubmit} />

      <TouchableOpacity onPress={() => dispatch(logOut())}>
        <Text>initalize redux store</Text>
      </TouchableOpacity>
    </Container>
  );
};
//export default ListView;

//export const state = ListView.set_state();
