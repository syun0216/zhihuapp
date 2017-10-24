import React, {Component} from 'react';
import {
    View,
    Text,
    WebView,
    ScrollView,
    Dimensions,
    Image,
    StyleSheet,
    Animated,
    Easing,
    TouchableWithoutFeedback,
    Platform,
    TouchableOpacity
} from 'react-native';
import {
    Container,
    Header,
    Content,
    Footer,
    Left,
    Body,
    Right,
    Button,
    Icon,
    Title,
    Badge
} from 'native-base';
import api from '../api/_index';
import FullLoadingScreen from '../components/FullScreenLoading';
import NewStatusBar from '../components/NewStatusBar';
import ErrorView from '../components/ErrorView';
import HTMLView from 'react-native-htmlview';
import CommonCss from '../components/CommonCss';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ToastUtil from '../utils/ToastUtil';
import Colors from '../utils/Colors';

let WeChat = require('react-native-wechat');


_winWidth = Dimensions.get('window').width;
_winHeight = Dimensions.get('window').height;
export default class ContentView extends Component {

    static navigationOptions = () => ({header: null, gesturesEnabled: true});
    // 构造
    _top = 0;

    constructor(props) {
        super(props);

        WeChat.registerApp('wxde5c4e0148d6b550');
        this._top = props.navigation.state.params.preRoute === 'DashBoard' ? -220 : 0;
        // 初始状态
        this.state = {
            isHttpRequesting: false,
            newsContent: null,
            favoriteChecked: false,
            commentsCount: 0,
            LoadStatus: true,
            positionTop: new Animated.Value(0),
            fadeInOpacity: new Animated.Value(0),
            showShareList: false,
            statusBarHeight: 0,
            bounceWidth: 0
        };
    }

    componentDidMount() {
        this.setState({isHttpRequesting: true});
        this._requestNewsContent(this.props.navigation.state.params.id);
        this._requestComments(this.props.navigation.state.params.id);
    }


    render() {
        return (
            <Container>
                {Platform.OS === 'android' ? <NewStatusBar androidBgColor="black"/> :
                    <NewStatusBar style={{opacity: 0}} networkVisible={this.state.isHttpRequesting}
                                  androidBgColor="black" iosHeight={0} iosBgColor="white" borderBottom={1}/>}
                {this._renderFullLoadingView()}
                {this.state.newsContent === null ?
                    null : this._renderMainContentView()}
                {this.state.LoadStatus ? null : this._renderErrorView()}
            </Container>
        )
    }

    _requestComments(id) {
        api.getCommentsById(id).then((data) => {
            if (data != null && data.data != null) {
                this.setState({
                    commentsCount: data.data.comments
                });
            }
            ;
            ToastUtil.show('加载成功', 1000, 'bottom');
        }).catch(() => {
            ToastUtil.show('api goes wrong', 1000);
            // console.log('api goes wrong');
        })
    }

    _shareMonents(type){
        switch (type){
            case "moments":
                WeChat.isWXAppInstalled()
                    .then((isInstalled) => {
                        if (isInstalled) {
                            WeChat.shareToTimeline({
                                title: this.state.newsContent.title,
                                description: 'jw daily',
                                thumbImage: this.state.newsContent.images[0],
                                type: 'news',
                                webpageUrl: this.state.newsContent.share_url
                            })
                                .catch((error) => {
                                    if(error.message == -2){
                                        ToastUtil.show('分享失败', 1000, 'bottom','danger');

                                    }
                                    else{
                                        ToastUtil.show('分享成功', 1000, 'bottom','success');
                                    }
                                });
                        } else {
                            ToastUtil.show('没有安装微信软件，请您安装微信之后再试', 1000, 'bottom','danger');
                        }
                    });break;
            case "friends":
                WeChat.isWXAppInstalled()
                    .then((isInstalled) => {
                        if (isInstalled) {
                            WeChat.shareToSession({
                                title: 'jw daily',
                                description: this.state.newsContent.title,
                                thumbImage: this.state.newsContent.images[0],
                                type: 'news',
                                webpageUrl: this.state.newsContent.share_url
                            })
                                .catch((error) => {
                                if(error.message == -2){
                                    ToastUtil.show('分享失败', 1000, 'bottom','danger');

                                }
                                else{
                                    ToastUtil.show('分享成功', 1000, 'bottom','success');
                                }
                                });
                        } else {
                            ToastUtil.show('没有安装微信软件，请您安装微信之后再试', 1000, 'bottom','danger');
                        }
                    });break;
        }

    }

    _requestNewsContent(id) {
        api.getNewsById(id).then((data) => {
            if (data.data != null) {
                let _html_class = data.data.image != null ? "html_content" : null;
                let _html = `<!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="referrer" content="never">
                        <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui">
                        <!-- viewport 后面加上 minimal-ui 在safri 体现效果 -->
                        <meta name="apple-mobile-web-app-capable" content="yes">
                        <!-- 隐藏状态栏/设置状态栏颜色 -->
                        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
                        <!-- uc强制竖屏 -->
                        <meta name="screen-orientation" content="portrait">
                        <!-- UC强制全屏 -->
                        <meta name="full-screen" content="yes">
                        <!-- UC应用模式 -->
                        <meta name="browsermode" content="application">
                        <!-- QQ强制竖屏 -->
                        <meta name="x5-orientation" content="portrait">
                        <!-- QQ强制全屏 -->
                        <meta name="x5-fullscreen" content="true">
                        <!-- QQ应用模式 -->
                        <meta name="x5-page-mode" content="app">
                        <title>知乎日报</title>
                        <link rel="shortcut icon" href="static/favicon.ico">
                        <link href="${data.data.css[0]}" rel="stylesheet">
                        <style media="screen">
                          body{
                            margin:0;
                            padding:0;
                          }
                          ${CommonCss}
                        </style>
                      </head><body>
                      <div style="overflow-x:hidden">
                        <div class="img_div" style="background-image:url(${data.data.image})">
                          <h3>${data.data.title}</h3>
                          <span>图片&nbsp;&nbsp;:&nbsp;&nbsp;${data.data.image_source}</span>
                        </div>
                          <div class="${_html_class}" style="margin-top:${this._top}px;">
                            ${data.data.body}
                          </div>
                      </div>
                      </body>
                    </html>`;
                // let _html = `<div><p style="color:red">这是测试的html</p></div>`
                data.data.html = _html;
                setTimeout(() => {
                    this.setState({isHttpRequesting: false, newsContent: data.data});
                }, 400)
                // this.setState({isHttpRequesting: false, newsContent: data.data});
                // console.log(this.state.newsContent);
            }
        }).catch((error) => {
            console.log('Api goes wrong');
            this.setState({isHttpRequesting: false, LoadStatus: false});
        });
    }

    // _getScrollPosition(scrollview){
    //     this.setState({
    //         bounceWidth:-scrollview.nativeEvent.contentOffset.y + 200
    //     });
    //     console.log(scrollview.nativeEvent.contentOffset.y);
    // }

    _renderFullLoadingView() {
        return <FullLoadingScreen message="正在加载中..." isLoading={this.state.isHttpRequesting}/>
    }

    _renderErrorView() {
        return <ErrorView retry={() => {
            this._requestNewsContent();
            this._requestComments()
        }}/>;
    }

    _renderPreventClickView() {
        return this.state.showShareList ? <TouchableWithoutFeedback onPress={() => this._toHideShareListView()}>
            <View style={{
                width: _winWidth,
                height: _winHeight,
                position: 'absolute',
                zIndex: 99,
                top: 0,
                left: 0,
                backgroundColor: '#5b7492',
                opacity: 0.3
            }}/>
        </TouchableWithoutFeedback> : null;
    }

    _renderShareView() {
        return (
            <Animated.View style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: 'white',
                position: 'absolute',
                zIndex: 1000,
                borderTopWidth: 1,
                borderTopColor: '#ccc',
                width: _winWidth,
                height: 150,
                bottom: this.state.positionTop.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-150, 0]
                }),
                opacity: this.state.fadeInOpacity
            }}>
                <View style={{width: _winWidth, height: 40, borderBottomWidth: 1, borderColor: "#ccc"}}>
                    <Text style={{flex: 1, textAlign: 'center', marginTop: 13, color: Colors.fontBlack}}>分享文章</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={() => this._shareMonents('moments')}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Image style={{width: 32, height: 32}} source={require('../assets/moments.png')}/>
                            <Text style={{fontSize: 12, color: Colors.fontBlack, marginTop: 10}}>朋友圈</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={() => this._shareMonents('friends')}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Image style={{width: 36, height: 36}} source={require('../assets/wechat.png')}/>
                            <Text style={{fontSize: 12, color: Colors.fontBlack, marginTop: 6}}>微信好友</Text>
                        </View>
                    </TouchableOpacity>
                    {/*<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>*/}
                        {/*<Image style={{width: 36, height: 36}} source={require('../assets/qq.png')}/>*/}
                        {/*<Text style={{fontSize: 12, color: Colors.fontBlack, marginTop: 4}}>qq</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>*/}
                        {/*<Image style={{width: 32, height: 32}} source={require('../assets/weibo.png')}/>*/}
                        {/*<Text style={{fontSize: 12, color: Colors.fontBlack, marginTop: 10}}>微博</Text>*/}
                    {/*</View>*/}
                </View>
            </Animated.View>
        )
    }

    _renderMainContentView() {
        const navigation = this.props.navigation;
        return (
            <Container>
                {this.state.showShareList ? this._renderPreventClickView() : null}
                {this._renderShareView()}
                {/*<ScrollView*/}
                {/*onScroll={(scrollview) => this._getScrollPosition(scrollview)}*/}
                {/*scrollEventThrottle={15}>*/}
                {/*<View>*/}
                <WebView bounces={true}
                         scalesPageToFit={true}
                         source={{html: this.state.newsContent.html}}
                         style={{width: _winWidth, height: _winHeight}}>
                </WebView>
                {/*</View>*/}
                {/*</ScrollView>*/}
                {/*<View style={{flex:1,justifyContent:'center',alignItems:'center',height:200}}>*/}
                {/*<View style={{height:3,width:this.state.bounceWidth,backgroundColor:Colors.main_blue}}/>*/}
                {/*</View>*/}
                <Footer style={{backgroundColor: 'white'}}>
                    <Button transparent style={styles.bottomButton} onPress={() => this.props.navigation.goBack()}><Icon
                        name='arrow-back' style={{color: '#959595'}}/></Button>
                    <Button transparent style={styles.bottomButton}
                            onPress={() => this._toNextArticle()}><MaterialCommunityIcons name="chevron-double-down"
                                                                                          style={[styles.IconStyle, {fontSize: 22}]}/></Button>
                    <Button transparent style={styles.bottomButton}
                            onPress={() => this._toShowShareListView()}><MaterialCommunityIcons name="share-variant"
                                                                                                style={[styles.IconStyle, {fontSize: 18}]}/></Button>
                    <Button transparent style={styles.bottomButton} onPress={() => this.addNewsToFavorite()}>
                        {this.state.favoriteChecked ?
                            <MaterialIcons name='favorite' style={{fontSize: 20, color: '#ff5858'}}/> :
                            <MaterialIcons name="favorite-border" style={[styles.IconStyle, {fontSize: 20}]}/>}
                    </Button>

                    <Button transparent style={[styles.bottomButton, {position: 'relative'}]}
                            onPress={() => this.props.navigation.navigate('Comment', {
                                id: this.props.navigation.state.params.id,
                                count: this.state.commentsCount
                            })}>
                        <MaterialCommunityIcons name="comment-processing-outline"
                                                style={[styles.IconStyle, {fontSize: 18}]}/>
                        <Text style={{
                            position: 'absolute',
                            top: 0,
                            color: '#ff5858',
                            left: 50
                        }}>{this.state.commentsCount}</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }

    //commonFunction
    _toNextArticle() {
        let list_item = this.props.navigation.state.params.list_data;
        let idx = Math.floor(Math.random() * list_item.length);
        this.setState({
            isHttpRequesting: true
        });
        this.setState({
            newsContent: null,
            commentsCount: 0
        });
        this._requestNewsContent(list_item[idx].id);
        this._requestComments(list_item[idx].id);
        // let nextId = null;
        // for(let idx in list_item){
        //   if(list_item[idx-1].id === currentId){
        // //     if(idx < list_item.length){
        // //       nextId = list_item[idx].id;
        // // //       this._requestNewsContent(list_item[idx+1].id);
        // // //       this._requestComments(list_item[idx+1].id);
        // // //       currentId=list_item[idx+1].id;
        // //     }
        // //     else{
        // //       ToastUtil.show('已经是最后一条了...',1000,'bottom');
        // //     }
        //   }
        // }
    }

    _toShowShareListView() {
        this.setState({
            showShareList: true
        });
        Animated.parallel(['fadeInOpacity', 'positionTop'].map(property => {
            return Animated.spring(this.state[property], {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear
            })
        })).start();
    }

    _toHideShareListView() {
        this.setState({
            showShareList: false
        });
        Animated.sequence(['positionTop'].map(property => {
            return Animated.timing(this.state[property], {
                toValue: 0,
                duration: 400,
                easing: Easing.linear
            })
        })).start();
    }

    addNewsToFavorite() {
        if (!this.state.favoriteChecked) {
            this.setState({
                favoriteChecked: true
            });
            ToastUtil.show('收藏成功', 1000, 'top', 'success');
        }
        else {
            this.setState({
                favoriteChecked: false
            });
            ToastUtil.show('取消收藏', 1000, 'top', 'warning');
        }
    }

}
const styles = StyleSheet.create({
    bottomButton: {
        flex: 1,
        marginTop: 5,
        alignItems:'center',
        justifyContent:'center',
    },
    IconStyle: {
        color: "#959595",
        // fontSize:18
    }
});
