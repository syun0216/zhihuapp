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
import DashBoardView from './app/DashBoardView';
import SplashScreen from 'react-native-splash-screen'

export default class zhihurn extends Component {
    componentDidMount() {
        SplashScreen.hide();
    }
  render() {
    return (
      <Root>
        <DashBoardView/>
      </Root>
    );
  }
}

// let zhihurn = DashBoardView;
AppRegistry.registerComponent('zhihurn', () => zhihurn);
