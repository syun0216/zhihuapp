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
    TouchableWithoutFeedback
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
import Swiper from 'react-native-swiper';
import FullScreenLoading from './components/FullScreenLoading';
import NewStatusBar from './components/NewStatusBar';
import ErrorView from './components/ErrorView';
import api from './api/_index';

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
import OpeningView from './OpeningView';
import testDashView from './testDashView';

import ToastUtil from './utils/ToastUtil';
import FooterUtil from './utils/FooterUtil';
import LoginView from "./LoginView";
import Colors from './utils/Colors';

import UserStore from './cache/UserCache';

const LOADING = 0;
const LOAD_SUCCESS = 1;
const LOAD_FAILED = 2;

let current_page = 1;
let next_page = 1;
let list_data = [];
const _winWidth = Dimensions.get('window').width;
const _winHeight = Dimensions.get('window').height;
let user_id = null;

class DashBoardView extends Component {
    _scrollView = null;
    static navigationOptions = {
        header: null,
        drawerLabel: '主页',
        drawerIcon: ({tintColor}) => (
            // <FontAwesome name="home" style={[styels.icon,{tintColor:tin}]}/>
            <Image
                source={require('./assets/homebig.png')}
                style={[styles.icon, {tintColor: tintColor}]}
            />

        ),
    };


    constructor(props) {
        super(props);
        let dsList = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            newsData: [],
            isHttpRequesting: false,
            newsList: dsList.cloneWithRows([]),
            requestStatus: LOADING,
            firstPageLoadingStatus: null,
            isLogin: false,
            refreshing: false
        }
    }

    componentDidMount() {
        this.setState({
            isHttpRequesting: true,
            refreshing: false
        });
        UserStore.getLoginUserJsonData((error, userId) => {
            "use strict";
            if (error != null || userId == null) {
                return;
            }
            this.setState({
                isLogin: true,
            });
        });
        this._requestNewsData();
    }

//requests
    _requestNewsData() {

        api.getNews().then((data) => {
            if (data.data != null) {
                data.data.date = data.data.date.substring(0, 4) + "/" + data.data.date.substring(4, 6) + "/" + data.data.date.substring(6, 8);
                data.data.weekday = this.setWeekDay(data.data.date);
                let _data = [];
                _data.push(data.data);
                list_data = data.data.stories;
                this.setState({
                    newsData: _data,
                    isHttpRequesting: false,
                    refreshing: false,
                    newsList: this.state.newsList.cloneWithRows(list_data),
                    firstPageLoadingStatus: LOAD_SUCCESS
                });
                // console.log(data.data);
                ToastUtil.show('加载成功', 1000, 'bottom');
                // console.log(this.state.newsData);
            }
        }).catch((error) => {
            this.setState({
                isHttpRequesting: false,
                refreshing: false,
                firstPageLoadingStatus: LOAD_FAILED
            });
            ToastUtil.show('加载失败', 1000, 'bottom', 'danger');
            console.log("Api call error");
        });
    }

    // _requestThemesData(){
    //   api.getTopics().then((data) => {
    //     if(data.data != null && data.data.others.length > 0){
    //     this.setState({
    //       themesData:data.data.others
    //     });
    //     // console.log(this.state.themesData);
    //     }
    //   })
    // }

    _requestNextNewsData(day) {
        // this.setState({requestStatus: LOADING});
        api.getNewsByDate(day).then((data) => {
            if (data.data !== null && data.data.stories.length !== 0) {
                // list_data.push(data.data.stories);
                data.data.date = data.data.date.substring(0, 4) + "/" + data.data.date.substring(4, 6) + "/" + data.data.date.substring(6, 8);
                data.data.weekday = this.setWeekDay(data.data.date);
                list_data = list_data.concat(data.data.stories);
                // console.log(list_data);
                current_page = next_page;
                this.setState({
                    // newsData: this.state.newsData.cloneWithRows(all_data),
                    requestStatus: LOADING,
                    newsList: this.state.newsList.cloneWithRows(list_data),
                });
            }
            else {
                this.setState({
                    requestStatus: LOAD_FAILED
                });
                next_page = current_page;
            }
        }).catch((error) => {
            this.setState({
                requestStatus: LOAD_FAILED
            });
            next_page = current_page;
            console.log("Api goes wrong");
        })
    }


//common functions
    setWeekDay(date) {
        let _day = new Date(date).getDay();
        switch (_day) {
            case 0 :
                return "星期日";
                break;
            case 1 :
                return "星期一";
                break;
            case 2 :
                return "星期二";
                break;
            case 3 :
                return "星期三";
                break;
            case 4 :
                return "星期四";
                break;
            case 5 :
                return "星期五";
                break;
            case 6 :
                return "星期六";
                break;
        }
    }

    getDate(count) {
        let _date = new Date();
        _date.setDate(_date.getDate() + count); //获取AddDayCount天后的日期
        let y = _date.getFullYear();
        let m = _date.getMonth() + 1; //获取当前月份的日期
        m = m > 10 ? m : "0" + m;
        let d = _date.getDate();
        d = d >= 10 ? d : "0" + d;
        return y + "" + m + "" + d;
    }

    _onRefreshToRequestFirstPageData() {
        this.setState({
            refreshing: true
        });
        list_data = [];
        current_page = 1;
        next_page = 1;
        this._requestNewsData();
    }

    _onPullToRequestNextPageData() {
        console.log(1);
        next_page = current_page - 1;
        // this.setState({requestStatus: LOADING});
        this._requestNextNewsData(this.getDate(next_page));
    }

    _onErrorToRequestFirstPageData() {
        this.setState({
            firstPageLoadingStatus: LOADING,
            isHttpRequesting: true
        });
        list_data = [];
        current_page = 1;
        next_page = 1;
        this._requestNewsData();
    }

    _listenScroll(e) {
        // console.log(e);
    }


//views
    render() {
        return (
            <Container style={{position:'relative'}}>
                {/*<NewStatusBar networkVisible={this.state.isHttpRequesting}/>*/}
                <Header style={{backgroundColor: Colors.fontBlack, borderBottomWidth: 0}} iosBarStyle="light-content">
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen', {id: 1})}>
                            <Image style={{width: 24, height: 24}} source={require('./assets/menu.png')}/>
                        </Button>
                    </Left>
                    <Body><Text style={{fontSize: 18, color: 'white'}}>今日热闻</Text></Body>
                    <Right>
                        <Button transparent onPress={() => {
                            this._scrollView.scrollTo({y: 0, animated: true});
                        }}><View><Text style={{color: 'white'}}>scroll top</Text></View></Button>
                    </Right>
                </Header>
                {this.state.isHttpRequesting ? this._renderLoadingView() : null}
                {this.state.firstPageLoadingStatus === LOAD_FAILED ? this._renderErrorView() : null}
                {/*<Content>*/}
                {this.state.newsData.length === 0 ? null : this._renderNewsListView()}
                {/*</Content>*/}
            </Container>
        );
    }

    _renderLoadingView() {
        return <FullScreenLoading message="正在加载中..."/>
    }

    _renderErrorView() {
        return <ErrorView retry={() => this._onErrorToRequestFirstPageData()}/>
    }

    _renderNewsListView() {

        return <ListView
            style={{backgroundColor: Colors.bgColor}}
            ref={(scrollView) => {
                this._scrollView = scrollView;
            }}
            initialListSize={10}
            pageSize={10}
            dataSource={this.state.newsList}
            renderSectionHeader={(sectionData, sectionID) => this._renderSectionHeader(sectionData, sectionID)}
            renderRow={(rowData) => this._renderNewsItem(rowData)}
            renderHeader={() => this._swiperView()}
            renderFooter={() => this._renderFooter()}
            showsVerticalScrollIndicator={false}
            onEndReached={() => this._onPullToRequestNextPageData()}
            onEndReachedThreshold={5}
            scrollRenderAheadDistance={50}
            onMomentumScrollEnd={() => this._listenScroll()}
            refreshControl={
                <RefreshControl
                    style={{backgroundColor: 'white'}}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this._onRefreshToRequestFirstPageData()}
                />}
        />
    }


    _renderNewsItem(rowData) {
        return (
            <TouchableWithoutFeedback transparent style={{height: 70, flex: 1, padding: 10, justifyContent: 'center'}}
                                      onPress={() => this.props.navigation.navigate('Content', {
                                          id: rowData.id,
                                          title: rowData.title,
                                          preRoute: 'DashBoard',
                                          list_data: list_data
                                      })}>
                <View style={{
                    backgroundColor: 'white',
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    padding: 10,
                    flex: 1,
                    flexDirection: 'row',
                    borderRadius: 10,
                    shadowColor: '#5b7392',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.15,
                    shadowRadius: 2,
                    elevation: 1,
                }}>
                    <View style={{width: 60}}><Image style={{width: 50, height: 50}} source={{uri: rowData.images[0]}}/></View>
                    <View style={{flex: 1, justifyContent: 'center'}}><Text
                        style={{color: Colors.fontBlack}}>{rowData.title.split("").length > 18 ? rowData.title.substr(0, 18) + '...' : rowData.title}</Text></View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _swiperView() {
        return (
            <Swiper height={200} autoplay={true} showsButtons={false} showsPagination={true}
                    paginationStyle={{flex:1,alignItems:'flex-end'}} dotStyle={{width:10,height:10,borderRadius:5,marginLeft:10}}
                    activeDotColor="white" activeDotStyle={{width:10,height:10,borderRadius:5,marginLeft:10}}
                // style={{marginTop: -20}} dotStyle={{marginTop: -40}} activeDotStyle={{marginTop: -40}}>
            >
                {this.state.newsData[0].top_stories.map((item, index) => {
                    return (
                        <Button transparent style={styles.slide1} key={`${index}`}
                                onPress={() => this.props.navigation.navigate('Content', {
                                    id: item.id,
                                    title: item.title,
                                    preRoute: 'DashBoard'
                                })}>
                            <View style={{position: 'relative'}}>
                                <Image style={{width: _winWidth, height: 250}} source={{uri: `${item.image}`}}/>
                                <View style={{
                                    width: _winWidth,
                                    height: 250,
                                    position: 'absolute',
                                    backgroundColor: '#fff',
                                    opacity: 0.3
                                }}></View>
                                <View style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: 90,
                                    right: 10,
                                    // paddingBottom:10,
                                    width: _winWidth * 0.8,

                                }}>
                                    <View style={{position:'relative'}}>
                                        <Text style={{
                                            color: 'white',
                                            lineHeight: 28,
                                            fontWeight: 'bold',
                                            paddingBottom: 10,
                                            textShadowOffset: {width: 1, height: 2},
                                            textShadowColor: '#000',
                                            fontSize: 18,
                                            textAlign:'right'
                                        }}>{item.title}</Text>
                                        <View style={{
                                            width: 120, height: 4,
                                            backgroundColor: Colors.main_yellow, position: 'absolute', right: 0,bottom:-10
                                        }}></View>
                                    </View>

                                </View>
                            </View>
                        </Button>
                    )
                })}
            </Swiper>
        )
    }

    _renderSectionHeader(sectionData, sectionID) {
        return (
            <View key={`${sectionID}`} style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
                width: 200,
                backgroundColor: Colors.main_yellow,
                height: 30,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                shadowColor: '#5b7392',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                shadowRadius: 2,
            }}>
                <Text style={{
                    color: '#fff',
                    textAlign: 'center',
                    marginTop: 5
                }}>{this.state.newsData[0].date} {this.state.newsData[0].weekday}</Text>
            </View>
        )
    }

    _renderFooter() {
        // return <FooterUtil isLoading={true} message="正在加载中..." />;
        switch (this.state.requestStatus) {
            case LOADING:
                return <FooterUtil isLoading={true} message="正在加载中..."/>;
                break;
            case LOAD_SUCCESS:
                return null;
            case LOAD_FAILED:
                return <FooterUtil message="加载失败,请点击重试" callback={() => this._onPullToRequestNextPageData()}/>;
                break;
            default:
                return null;
                break;
        }
    }

}


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
        activeBackgroundColor: '#1D2328', // 选中背景颜色
        inactiveTintColor: '#95999D',  // 未选中文字颜色
        inactiveBackgroundColor: '#242A2F', // 未选中背景颜色
        style: {  // 样式
            marginVertical: 0,
        },
        //没有作用
        // onItemPress : (route) => {
        // 	 console.log('-------->' + JSON.stringify(route))
        // },

    },

    contentComponent: props => {
        // console.log('contentComponent');

        return (
            <View style={{flex: 1, backgroundColor: '#242A2F'}}>
                <View style={{height: 110, marginTop: 40}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, marginLeft: 16, justifyContent: 'space-around'}}>
                            <Image style={{width: 48, height: 48}} source={require('./assets/person.png')}/>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text onPress={() => props.navigation.navigate('Login')}
                                  onLongPress={() => props.navigation.navigate('Test')}
                                  style={{
                                      color: '#95999D',
                                      marginRight: 25,
                                  }}>请先登录</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                        <View
                            style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                            <Image resizeMode="cover" style={{flex: 1, width: 25, height: 25, marginBottom: 5}}
                                   source={require('./assets/star.png')}/>
                            <Text onPress={() => ToastUtil.show('请先登录哦', 1000, 'bottom', 'warning')}
                                  style={{flex: 1, color: 'white', fontSize: 12}}>收藏</Text></View>
                        <View
                            style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                            <Image resizeMode="cover" style={{flex: 1, width: 25, height: 25, marginBottom: 5}}
                                   source={require('./assets/message2.png')}/>
                            <Text onPress={() => ToastUtil.show('请先登录哦', 1000, 'bottom', 'warning')}
                                  style={{flex: 1, color: 'white', fontSize: 12}}>消息</Text></View>
                        <View
                            style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                            <Image resizeMode="cover" style={{flex: 1, width: 25, height: 25, marginBottom: 5}}
                                   source={require('./assets/setting.png')}/>
                            <Text style={{flex: 1, color: 'white', fontSize: 12}}>设置</Text></View>
                    </View>
                </View>
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
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
    Test:{screen:testDashView}
}, {
    // initialRouteName: 'DashDrawerPage',
    headerMode: 'none', //解决抽屉弹出有一个空白header的bug
});

module.exports = mainView;

const styles = StyleSheet.create({
    iosSwiper: {
        marginTop: -20,

    },
    isIosDot: {
        marginTop: -30,
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
        alignItems: 'center',
        // backgroundColor: '#9DD6EB',
        height: 200,
    },
    slide1_img: {
        width: 100,
        backgroundColor: '#9DD6EB',
        height: 200
    },
    slide1_text: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'linear-gradient(180deg,transparent,rgba(0,0,0,.7))'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    icon: {
        width: 24,
        height: 24
    }
});
