import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import MenteeList from '../components/menteeList/MenteeList';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';

const API_URL = 'https://heymentortestdeployment.herokuapp.com';

class MenteeListView extends Component {
  state = {
    menteeItem: [],
    fbToken: '',
    fbUserId: ''
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem('fb_token');
    const id = await AsyncStorage.getItem('fb_id');

    this.setState({
      fbToken: token,
      fbUserId: id
    });

    this.getUserData(this.state.fbUserId);
  }

  constructMenteeItemsFromResponse = async menteeIds => {
    menteeItems = [];

    try {
      for (let mentee of menteeIds) {
        let response = await fetch(`${API_URL}/mentees/${mentee}`);
        let responseJson = await response.json();

        fullName =
          responseJson[0].person.fname + ' ' + responseJson[0].person.lname;
        menteeItems.push({
          name: fullName,
          school: responseJson[0].school.name,
          grade: responseJson[0].school.grade,
          id: responseJson[0].mentee_id,
          fullMentee: responseJson[0]
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ menteeItem: menteeItems });
  };

  getUserData = async userId => {
    try {
      let response = await fetch(`${API_URL}/mentors/${userId}`);
      let responseJson = await response.json();
      this.constructMenteeItemsFromResponse(responseJson[0].mentee_ids);
    } catch (error) {
      console.log(error);
    }
  };

  static navigationOptions = ({ navigation }) => ({
    title: 'Mentees',
    headerTitleStyle,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('notifications');
        }}
      >
        <Icon
          name="ios-notifications"
          type="ionicon"
          size={34}
          iconStyle={styles.leftImage}
        />
      </TouchableOpacity>
    ),

    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('settings');
        }}
      >
        <Icon
          name="gear"
          type="font-awesome"
          size={34}
          iconStyle={styles.rightImage}
        />
      </TouchableOpacity>
    )
  });

  render() {
    return (
      <ScrollView>
        <MenteeList
          menteeItem={this.state.menteeItem}
          navigation={this.props.navigation}
        />
      </ScrollView>
    );
  }
}

const headerTitleStyle = {
  flex: 1,
  textAlign: 'center',
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold'
};

const styles = StyleSheet.create({
  leftImage: {
    marginLeft: 20,
    marginBottom: 5
  },
  rightImage: {
    marginRight: 10,
    marginBottom: 5
  }
});

export default MenteeListView;
