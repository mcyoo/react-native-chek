import React, {useState, Component} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import {logIn, logOut} from '../redux/usersSlice';
import styled from 'styled-components/native';
import api from '../api';
import {isUrl} from '../utils';
import Swipeout from 'react-native-swipeout';
import StateSet from '../components/stateSet';
import RNRestart from 'react-native-restart';

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
        <Container>
          <List_text>{this.props.item.title}</List_text>
        </Container>
      </Swipeout>
    );
  }
}

export default ({data, update}) => {
  //const [user_data, setData] = useState(data);
  const dispatch = useDispatch();

  return (
    <Container>
      <Title>FlatList Test</Title>
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          return <FlatListItem index={index} item={item} update={update} />;
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
