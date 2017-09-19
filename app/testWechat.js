import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ToastAndroid,
} from 'react-native';
import ToastUtil from './utils/ToastUtil';
// import WeChat from 'react-native-wechat';
var WeChat = require('react-native-wechat');

//import fs from 'react-native-fs';
class CustomButton extends Component {
    render() {
        return (
            <TouchableHighlight
                style={styles.button}
                underlayColor="#a5a5a5"
                onPress={this.props.onPress}>
                <Text style={styles.buttonText}>{this.props.text}</Text>
            </TouchableHighlight>
        );
    }
}

export default class RNWeChatDemo extends Component {
    static navigationOptions = () => ({
        title: "wechat",
        headerBackTitle: null,
        // headerStyle: {backgroundColor: Colors.main_red},
        headerTitleStyle: {color: "white"},

    });
    constructor(props) {
        super(props);
        //应用注册
        WeChat.registerApp('wxde5c4e0148d6b550');
    }

    render() {
        return (
            <View style={{margin: 20}}>
                <Text style={styles.welcome}>
                    微信好友/朋友圈分享实例
                </Text>
                <CustomButton text='微信好友分享-文本'
                              onPress={() => {
                                  WeChat.isWXAppInstalled()
                                      .then((isInstalled) => {
                                          if (isInstalled) {
                                              WeChat.shareToSession({type: 'text', description: 'junwen hello world'})
                                                  .catch((error) => {
                                                      ToastUtil.show(error.message, 1000, 'bottom','danger');
                                                  });
                                          } else {
                                              ToastUtil.show('没有安装微信软件，请您安装微信之后再试', 1000, 'bottom','danger');
                                          }
                                      });
                              }}
                />
                <CustomButton text='微信好友分享-链接'
                              onPress={() => {
                                  WeChat.isWXAppInstalled()
                                      .then((isInstalled) => {
                                          if (isInstalled) {
                                              WeChat.shareToSession({
                                                  title: 'junwen\'s home',
                                                  description: '分享楼主的主页给你',
                                                  thumbImage: 'http://img.duoziwang.com/2016/12/08/18594927932.jpg',
                                                  type: 'news',
                                                  webpageUrl: 'https://syun0216.github.io/myHome/'
                                              })
                                                  .catch((error) => {
                                                      ToastUtil.show(error.message, 1000, 'bottom','danger');
                                                  });
                                          } else {
                                              ToastUtil.show('没有安装微信软件，请您安装微信之后再试', 1000, 'bottom','danger');
                                          }
                                      });
                              }}
                />
                <CustomButton text='微信朋友圈分享-文本'
                              onPress={() => {
                                  WeChat.isWXAppInstalled()
                                      .then((isInstalled) => {
                                          if (isInstalled) {
                                              WeChat.shareToTimeline({type: 'text', description: '嘿嘿嘿'})
                                                  .catch((error) => {
                                                      ToastUtil.show(error.message, 1000, 'bottom','danger');
                                                  });
                                          } else {
                                              ToastUtil.show('没有安装微信软件，请您安装微信之后再试', 1000, 'bottom','danger');
                                          }
                                      });
                              }}
                />
                <CustomButton text='微信朋友圈分享-链接'
                              onPress={() => {
                                  WeChat.isWXAppInstalled()
                                      .then((isInstalled) => {
                                          if (isInstalled) {
                                              WeChat.shareToTimeline({
                                                  title: 'junwen\'s home',
                                                  description: '分享楼主的主页给你',
                                                  thumbImage: 'http://img.duoziwang.com/2016/12/08/18594927932.jpg',
                                                  type: 'news',
                                                  webpageUrl: 'https://syun0216.github.io/myHome/'
                                              })
                                                  .catch((error) => {
                                                      ToastUtil.show(error.message, 1000, 'bottom','danger');
                                                  });
                                          } else {
                                              ToastUtil.show('没有安装微信软件，请您安装微信之后再试', 1000, 'bottom','danger');
                                          }
                                      });
                              }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    button: {
        margin: 5,
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cdcdcd',
    },
});