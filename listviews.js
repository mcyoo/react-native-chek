import React from 'react';
import {View, Text, StyleSheet, SectionList} from 'react-native';

export default function listviews({user_json_data}) {
  return (
    <View style={styles.container}>
      {user_json_data.map(item => (
        <Text>
          {item.fields.title} {item.fields.url} {item.fields.change}
        </Text>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
