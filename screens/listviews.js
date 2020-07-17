import React, {useState, Component} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import {logIn, logOut} from '../redux/usersSlice';
import styled from 'styled-components/native';
import api from '../api';
import {isUrl} from '../utils';
import Swipeout from 'react-native-swipeout';
import StateSet from '../components/stateSet';

const Container = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 40px;
  border: 2px solid grey;
`;

const List_text = styled.Text`
  font-size: 30px;
`;

class FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRowKey: null,
    };
  }
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
            alert('delete');
            this.props.state(false);
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
        <Container>
          <List_text>{this.props.item.title}</List_text>
        </Container>
      </Swipeout>
    );
  }
}

export default ({jwt}) => {
  const [jwt_token, setJwt] = useState(jwt);
  const [user_data, setData] = useState('');
  const [state, setState] = useState(false);
  const dispatch = useDispatch();

  getData = async () => {
    try {
      const {data} = await api.urls(jwt_token);
      console.log(data);
      setData(data);
      setState(true);
    } catch (e) {
      alert('connect error');
    }
  };

  if (state) {
  } else {
    getData();
  }
  return (
    <Container>
      <Title>FlatList Test</Title>
      <FlatList
        data={user_data}
        renderItem={({item, index}) => {
          return <FlatListItem index={index} item={item} state={setState} />;
        }}
      />
      <TouchableOpacity onPress={() => dispatch(logOut())}>
        <Text>initalize redux store</Text>
      </TouchableOpacity>
    </Container>
  );
};
//export default ListView;

//export const state = ListView.set_state();
