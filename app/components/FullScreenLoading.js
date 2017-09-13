/**
 * Created by Syun on 2017/5/25.
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicatorIOS,
    ActivityIndicator,
    Image
} from 'react-native';

export default class FullScreenLoadingView extends Component {
    static propTypes = {
        isLoading:React.PropTypes.bool.isRequired,
    };
    static defaultProps = {
        isLoading:false
    };
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {httpRequestTips: this.props.message};
    }

    render() {
        let message = this.state.httpRequestTips == null ? '正在加载中,请稍候...' : this.state.httpRequestTips;

        return (
            this.props.isLoading ?
            <View style={styles.fullscreencontainer}>
                {/*<ActivityIndicator size="small"/>*/}
                <Image style={{width:60,height:60}} resizeMode="contain" source={require('../assets/Wedges.gif')}/>
                {/*<Text style={{color:'#222', marginTop:10}}>{message}</Text>*/}
            </View> :null
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.httpRequestTips != nextProps.message) {
            this.setState({httpRequestTips: nextProps.message})
        }
    }
}


const styles = StyleSheet.create({

    fullscreencontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:-30,
        zIndex:10000,
        backgroundColor:'#F1FAFE'
    }

});