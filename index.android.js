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

export default class zhihurn extends Component {
    render() {
        return (
            <Root>
              <DashBoardView/>
            </Root>
        );
    }
}
AppRegistry.registerComponent('zhihurn', () => zhihurn);
