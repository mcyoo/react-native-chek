import React from 'react';
import {StyleSheet, View, rgba} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: true};
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        visible: this.state.visible,
      });
    }, 50000);
  }

  render() {
    const {visible} = this.state;
    return (
      <AnimatedLoader
        visible={visible}
        overlayColor="rgba(255,255,255,0.4)"
        source={require('../assets/toast.json')}
        animationStyle={styles.lottie}
        speed={1}
      />
    );
  }
}
const styles = StyleSheet.create({
  lottie: {
    width: 250,
    height: 250,
  },
});
