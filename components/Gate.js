import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {logIn, logOut} from '../redux/usersSlice';
import Listview from '../screens/listviews';
import Loading from '../screens/loading';

export default () => {
  const {isLoggedIn, token} = useSelector(state => state.usersReducer);
  return isLoggedIn ? <Listview jwt={token} /> : <Loading />;
};
