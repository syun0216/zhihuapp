import React, {Component} from 'react';
import {Text, Image, View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import {Container, Content, Button} from 'native-base';

export default class ErrorView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 400}}>
                <Image source={require('../assets/error.png')} resizeMode="cover"/>
                <Text onPress={this.props.retry} style={{marginTop: 10, color: '#959595'}}>加载失败，请点击重试...</Text>
            </View>
        )
    }
}
