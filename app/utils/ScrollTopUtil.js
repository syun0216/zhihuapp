import React, {Component} from 'react';
import {View, Text, Image,Animated} from 'react-native';
import {Button} from 'native-base';

export default class ScrollTopUtil extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Animated.View style={{position:'absolute',right:10,bottom:this.props.positionBottom.interpolate({
                inputRange: [0, 1],
                outputRange: [-150, 50]
            })}} >
                <Button transparent onPress={this.props.toTop}>
                    <Image source={require('../assets/top.png')} style={{width: 38, height: 38}}/>
                </Button>
            </Animated.View>
        )
    }
}
