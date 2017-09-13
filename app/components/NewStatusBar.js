import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Colors from '../utils/Colors';
import {StatusBar, Platform, View, Animated, Dimensions} from 'react-native';

const _winWidth = Dimensions.get('window').width;
const _winHeight = Dimensions.get('window').height;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
export default class NewStatusBar extends Component {
    static propTypes = {
        barStyle: React.PropTypes.string, //ios
        networkVisible: React.PropTypes.bool, //ios
        transition: React.PropTypes.string, //ios
        hidden: React.PropTypes.bool, //ios
        iosBgColor: React.PropTypes.string, //ios
        iosHeight: React.PropTypes.number, //ios
        borderBottom: React.PropTypes.number, //ios
        androidBgColor: React.PropTypes.string, //android
        transparent: React.PropTypes.bool //android
    };

    static defaultProps = {
        barStyle: 'default',
        networkVisible: false,
        transition: 'fade',
        hidden: false,
        iosBgColor: 'transparent',
        iosHeight: STATUSBAR_HEIGHT,
        borderBottom: 0,
        androidBgColor: 'white',
        transparent: false
    };

    constructor(props) {
        super(props);
    }

    render() {
        let _platformIos = Platform.OS === 'ios';
        let {barStyle, networkVisible, transition, hidden, iosBgColor, iosHeight, borderBottom, androidBgColor, transparent} = this.props;
        return (
            <Animated.View style={{
                backgroundColor: iosBgColor,
                height: 20,
                borderBottomWidth: borderBottom,
                borderColor: "#ccc",
                width: _winWidth,
                position:'absolute',
                top:0,left:0,
                zIndex:1000
            }}>
                <StatusBar barStyle={barStyle} networkActivityIndicatorVisible={networkVisible}
                           transition={transition} hidden={hidden} backgroundColor={androidBgColor}
                           translucent={transparent}/>
            </Animated.View>
        )
        // return _platform == 'ios'? <StatusBar barStyle={barStyle} networkActivityIndicatorVisible={networkVisible}
        // transition={transition} hidden={hidden}/> : <StatusBar backgroundColor={bgColor} translucent={transparent}/>
    }
}
