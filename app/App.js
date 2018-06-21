import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
    Platform,
    Dimensions,
    ListView,
    TouchableOpacity,
    RefreshControl,
    TouchableWithoutFeedback,
    Animated,
    Easing
} from 'react-native';
import {FontAwesome} from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {
    Container,
    Header,
    Content,
    Button,
    Icon,
    Text,
    ListItem,
    Left,
    Body,
    Right,
    Thumbnail,
    Toast,
    Root
} from 'native-base';
import {StackNavigator, TabNavigator, DrawerNavigator, DrawerItems} from 'react-navigation';
import Colors from './utils/Colors';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreator from '../app/actions/themeActions'


import DashBoardView from './DashBoardView';
import DailyThemeView from './views/DailyThemeView';
import RecommendThemeView from './views/RecommendThemeView';
import MovieThemeView from './views/MovieThemeView';
import BoringThemeView from './views/BoringThemeView';
import DesignThemeView from './views/DesignThemeView';
import CompanyThemeView from './views/CompanyThemeView';
import FinanceThemeView from './views/FinanceThemeView';
import InternetThemeView from './views/InternetThemeView';
import GameThemeView from './views/GameThemeView';
import MusicThemeView from './views/MusicThemeView';
import ComicThemeView from './views/ComicThemeView';
import PEThemeView from './views/PEThemeView';
import ContentView from './views/ContentView';
import CommentView from './views/CommentView';
import SettingView from './views/SettingView';

import LoginView from './LoginView';

const DashDrawerPage = DrawerNavigator({
    Home: {
        screen: DashBoardView,
    },
    Comic: {
        screen: ComicThemeView
    },
    Music: {
        screen: MusicThemeView
    },
    Game: {
        screen: GameThemeView
    },
    Movie: {
        screen: MovieThemeView
    },
    Recommeng: {
        screen: RecommendThemeView
    },
    Theme: {
        screen: DailyThemeView,
    },
    Boring: {
        screen: BoringThemeView
    },
    Design: {
        screen: DesignThemeView
    },
    Company: {
        screen: CompanyThemeView
    },
    Finance: {
        screen: FinanceThemeView
    },
    Internet: {
        screen: InternetThemeView
    },
    PE: {
        screen: PEThemeView
    }
}, {
    drawerWidth: 200, // 抽屉宽
    drawerPosition: 'left', // 抽屉在左边还是右边
    // cardStack: {gesturesEnabled: false,},
    // contentComponent: CustomDrawerContentComponent,  // 自定义抽屉组件
    contentOptions: {
        initialRouteName: 'Home', // 默认页面组件
        activeItemKey: 'Theme',
        labelStyle: {//标签样式
            // color : 'red',
            height: 20,
        },
        activeTintColor: 'white',  // 选中文字颜色
        activeBackgroundColor: Colors.sidebar_active_color, // 选中背景颜色
        inactiveTintColor: '#95999D',  // 未选中文字颜色
        inactiveBackgroundColor: Colors.sidebar_default_color, // 未选中背景颜色
        style: {  // 样式
            marginVertical: 0,
        },
        //没有作用
        // onItemPress : (route) => {
        // 	 console.log('-------->' + JSON.stringify(route))
        // },

    },

    contentComponent: props => {
        return (
            <View style={{flex: 1, backgroundColor: Colors.sidebar_default_color}}>
                <View style={{height: 100, marginTop: 30}}>
                    <Button transparent onPress={() => props.navigation.navigate('Login')}
                            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{flex: 1, justifyContent: 'center',alignItems:'center'}}>
                            <Image style={{width: 60, height: 60}} source={require('./assets/person.png')}/>
                        </View>
                        {/*<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>*/}
                        {/*<Text style={{*/}
                        {/*color: '#95999D',*/}
                        {/*marginTop: 5*/}
                        {/*}}>请先登录</Text>*/}
                        {/*</View>*/}
                    </Button>
                    <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                        <View
                            style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                            <Image resizeMode="cover" style={{flex: 1, width: 30, height: 30, marginBottom: 5}}
                                   source={require('./assets/star.png')}/>
                            {/*<Text onPress={() => ToastUtil.show('请先登录哦', 1000, 'bottom', 'warning')}*/}
                            {/*style={{flex: 1, color: 'white', fontSize: 12}}>收藏</Text>*/}
                        </View>
                        <View
                            style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                            <Image resizeMode="cover" style={{flex: 1, width: 30, height: 30, marginBottom: 5}}
                                   source={require('./assets/message2.png')}/>
                            {/*<Text onPress={() => ToastUtil.show('请先登录哦', 1000, 'bottom', 'warning')}*/}
                            {/*style={{flex: 1, color: 'white', fontSize: 12}}>消息</Text>*/}
                        </View>
                        <Button style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            marginTop:-3
                        }} onPress={() => props.navigation.navigate('Setting')} transparent>
                            <View>
                                <Image resizeMode="cover" style={{flex: 1, width: 30, height: 30, marginBottom: 5}}
                                       source={require('./assets/setting.png')}/>
                                {/*<Text style={{flex: 1, color: 'white', fontSize: 12}}>设置</Text>*/}
                            </View>
                        </Button>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <DrawerItems style={{flex: 1}} {...props} />
                </ScrollView>
            </View>
        )
    },
});


let mainView = StackNavigator({
    Home: {screen: DashDrawerPage},
    // Dash: {screen: DashBoardView},
    Content: {screen: ContentView},
    Comment: {screen: CommentView},
    Login: {screen: LoginView},
    // Test: {screen: TestWechat},
    Setting:{screen:SettingView}
}, {
    // initialRouteName: 'DashDrawerPage',
    headerMode: 'none', //解决抽屉弹出有一个空白header的bug
    // transitionConfig:()=>({
    //     // 只要修改最后的forVertical就可以实现不同的动画了。
    //     screenInterpolator:CardStackStyleInterpolator.forVertical,
    // })
    // mode:'modal'，
});

module.exports = mainView;