/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {Root} from 'native-base'
import App from './app/App';
import MapStateAndProps from './app/MapStateAndProps'
import SplashScreen from 'react-native-splash-screen'
import {Provider} from 'react-redux';
import store from './app/store/store'

export default class zhihurn extends Component {
    componentDidMount() {
        SplashScreen.hide();
    }
  render() {
    return (
      <Root>
          <Provider store={store}>
            <MapStateAndProps/>
          </Provider>
      </Root>
    );
  }
}

// let zhihurn = DashBoardView;
AppRegistry.registerComponent('zhihurn', () => zhihurn);
