import React, { Component } from 'react';
import { View, Text, AsyncStorage, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Facebook } from 'expo';

class HomeAuth extends Component {
  state = {
    facebookLoginFail: false,
    facebookLoginSuccess: false,
    fbToken: null,
    fbUserId: null
  };

  appId = '1650628351692070';
  //appId = '413723559041218';

  componentDidMount() {
    console.log(this.state);
    if (this.state.fbToken !== null) {
      this.props.navigation.navigate('menteeListView');
    }
  }

  onButtonPress() {
    this.facebookLogin();
  }

  onAuthComplete = props => {
    //after user successfully logs in navigate to menteeListView page
    if (this.state.fbToken) {
      this.props.navigation.state = this.state;
      this.props.navigation.navigate('menteeListView', {fbId: this.state.fbUserId});
    }
  };

  facebookLogin = async () => {
    const token = await AsyncStorage.getItem('fb_token');
    this.initFacebookLogin();
  };

  initFacebookLogin = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(this.appId, {
      permissions: ['public_profile', 'email', 'user_friends']
    });

    if (type === 'cancel') {
      this.setState({ facebookLoginFail: true });
    }

    if (type === 'success') {
      await AsyncStorage.setItem('fb_token', token);
      this.setState({
        facebookLoginSuccess: true,
        fbToken: token
      });
      //API call to FB Graph API. Will add more code to fetch social media data
      let response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      let responseJson = await response.json();
      console.log("Printing token");
      console.log(token);
      console.log("Printing response");
      console.log(responseJson);
      console.log("Printed response.json()");

      // Get the Facebook User ID from the response so we can look up the Mentees of this user
      console.log("Facebook ID: " + responseJson.id);
      // Matt Bongiovi: 1842505195770400
      this.setState({ fbUserId: responseJson.id });

      this.onAuthComplete(this.props);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.splashStyle} source={require('../assets/heymentorsplash.png')} />

        <TouchableOpacity style={styles.buttonStyle} onPress={this.onButtonPress.bind(this)}>
          <Text style={styles.textStyle}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  splashStyle: {
    marginTop: 100,
    width: 275,
    height: 275,
    alignSelf: 'center',
    marginBottom: 80
  },
  buttonStyle: {
    backgroundColor: '#007aff',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'center',
    width: 280,
    height: 50
  },
  textStyle: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
});

export default HomeAuth;