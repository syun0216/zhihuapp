import React, {Component} from 'react';
import {View, Text, Image,Animated} from 'react-native';
import {Button} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ScrollTopUtil extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let color = this.props.color == "#fff" ? "#000" : this.props.color;
        return (
            <Animated.View style={{position:'absolute',right:10,bottom:this.props.positionBottom.interpolate({
                inputRange: [0, 1],
                outputRange: [-150, 50]
            })}} >
                <Button transparent onPress={this.props.toTop}>
                    <MaterialCommunityIcons name="arrow-up-bold-hexagon-outline"
                                            style={{fontSize: 40,color:color}}/>
                </Button>
            </Animated.View>
        )
    }
}
