import React, {Component} from 'react';
import {View, Text, Image,Animated} from 'react-native';
import {Button} from 'native-base';

export default class ScrollTopUtil extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Animated.View style={{position:'absolute',right:0,bottom:this.props.positionBottom.interpolate({
                inputRange: [0, 1],
                outputRange: [-150, 50]
            })}} >
                <Button transparent onPress={this.props.toTop}>
                    <Image source={require('../assets/top.png')} style={{width: 40, height: 40}}/>
                </Button>
            </Animated.View>
        )
    }
}
