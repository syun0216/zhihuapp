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
import Swiper from 'react-native-swiper';
import FullScreenLoading from './components/FullScreenLoading';
import NewStatusBar from './components/NewStatusBar';
import ErrorView from './components/ErrorView';
import api from './api/_index';

import ToastUtil from './utils/ToastUtil';
import FooterUtil from './utils/FooterUtil';
import ScrollTopUtil from "./utils/ScrollTopUtil";
import Colors from './utils/Colors';

import UserStore from './cache/UserCache';

const LOADING = 0;
const LOAD_SUCCESS = 1;
const LOAD_FAILED = 2;

let current_page = 1;
let next_page = 1;
let list_data = [];
let all_data = [];
const _winWidth = Dimensions.get('window').width;
const _winHeight = Dimensions.get('window').height;
let user_id = null;

export default class DashBoardView extends Component {
    _scrollView = null;
    isFirstTime = false; //判断是不是第一次触发listview的onendreach方法
    static navigationOptions = {
        header: null,
        drawerLabel: '主页',
        drawerIcon: ({tintColor}) => (
            // <FontAwesome name="home" style={[styels.icon,{tintColor:tin}]}/>
            <Image
                source={require('./assets/home.png')}
                style={[styles.icon, {tintColor: tintColor}]}
            />

        ),
    };


    constructor(props) {
        super(props);
        console.log("props",props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        let dsList = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            newsData: ds.cloneWithRowsAndSections([]),
            isHttpRequesting: false,
            newsList: dsList.cloneWithRows([]),
            requestStatus: LOADING,
            firstPageLoadingStatus: null,
            isLogin: false,
            refreshing: false,
            titleData: null,
            positionBottom: new Animated.Value(0),
            swiperShow: false,

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
                all_data = _data;
                list_data = data.data.stories;
                this.setState({
                    newsData: this.state.newsData.cloneWithRowsAndSections(all_data),
                    isHttpRequesting: false,
                    refreshing: false,
                    newsList: this.state.newsList.cloneWithRows(list_data),
                    firstPageLoadingStatus: LOAD_SUCCESS,
                    titleData: _data
                });
                setTimeout(() => {
                    this.setState({
                        swiperShow: true
                    });
                }, 100)
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

    _requestNextNewsData(day) {
        // this.setState({requestStatus: LOADING});
        api.getNewsByDate(day).then((data) => {
            if (data.data !== null && data.data['stories'].length !== 0) {
                list_data.push(data.data.stories);
                data.data.date = data.data.date.substring(0, 4) + "/" + data.data.date.substring(4, 6) + "/" + data.data.date.substring(6, 8);
                data.data.weekday = this.setWeekDay(data.data.date);
                all_data.push(data.data);
                list_data = list_data.concat(data.data['stories']);
                current_page = next_page;
                this.setState({
                    newsData: this.state.newsData.cloneWithRowsAndSections(all_data),
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
        m = m >= 10 ? m : "0" + m;
        let d = _date.getDate();
        d = d >= 10 ? d : "0" + d;
        return y + "" + m + "" + d;
    }

    _getListViewData(sview) {
        if (sview.nativeEvent.contentOffset.y > 100) {
            Animated.spring(this.state.positionBottom, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear
            }).start();
        }
        else {
            Animated.timing(this.state.positionBottom, {
                toValue: 0,
                duration: 200,
                easing: Easing.linear
            }).start();
        }
        // console.log(sview.nativeEvent.contentOffset.y);
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
        next_page = current_page - 1;
        // if(this.isFirstTime){
        //     if(this.state.requestStatus !== LOADING){
        //         this.isFirstTime = false;
        //     }
        //     return;
        // }
        // this.setState({requestStatus: LOADING});
        // this.isFirstTime = true;
        this._requestNextNewsData(this.getDate(next_page));
    }

    _onErrorToRequestNextPage() {
        this.setState({requestStatus: LOADING});
        next_page = current_page - 1;
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


//views
    render() {
        return (
            <Container>
                {Platform.OS === 'android' ? <NewStatusBar androidBgColor="black"/> : <NewStatusBar networkVisible={this.state.isHttpRequesting}

                                                                                                    barStyle="light-content"/>}
                <NewStatusBar androidBgColor="black" networkVisible={this.state.isHttpRequesting}
                              iosBgColor="transparent" iosHeight={0}
                              barStyle="light-content"/>
                {Platform.OS == "android" ? <Header style={{backgroundColor: Colors.fontBlack, borderBottomWidth: 0}}>
                        <Left>
                            <Button transparent
                                    onPress={() => this.props.navigation.navigate('DrawerOpen', {id: 1})}>
                                <Image style={{width: 20, height: 20}} source={require('./assets/menu.png')}/>
                            </Button>
                        </Left>
                        <Body><Text style={{fontSize: 18, color: 'white'}}>今日热闻</Text></Body>
                        <Right>
                        </Right>
                    </Header> :
                    <Button style={{position: 'absolute', zIndex: 1000, top: 13, left: 23}} transparent
                            onPress={() => this.props.navigation.navigate('DrawerOpen', {id: 112312})}>
                        <Image style={{width: 22, height: 22}} source={require('./assets/menu.png')}/>
                    </Button>
                }

                {this._renderLoadingView()}
                {this.state.firstPageLoadingStatus === LOAD_FAILED && this.state.titleData === null  ? this._renderErrorView() : null}
                {/*<Content>*/}
                {this.state.titleData === null ? null : this._renderNewsListView()}
                {/*</Content>*/}
                {this._renderScrollTopView()}
            </Container>
        );
    }

    _renderLoadingView() {
        return <FullScreenLoading message="正在加载中..." isLoading={this.state.isHttpRequesting}/>
    }

    _renderScrollTopView() {
        return this.state.titleData === null ? null : <ScrollTopUtil toTop={() => {
            this._scrollView.scrollTo({y: 0, animated: true});
        }} positionBottom={this.state.positionBottom}/>
    }

    _renderErrorView() {
        return <ErrorView retry={() => this._onErrorToRequestFirstPageData()}/>
    }

    _renderNewsListView() {

        return <ListView
            ref={(scrollView) => {
                this._scrollView = scrollView;
            }}
            initialListSize={10}
            pageSize={10}
            dataSource={this.state.newsData}
            renderSectionHeader={(sectionData, sectionID) => this._renderSectionHeader(sectionData, sectionID)}
            renderRow={(rowData, rowId, sectionID) => this._renderNewsItem(rowData, rowId, sectionID)}
            renderHeader={() => this._swiperView()}
            renderFooter={() => this._renderFooter()}
            enableEmptySections={true}
            showsVerticalScrollIndicator={false}
            onEndReached={() => this._onPullToRequestNextPageData()}
            onEndReachedThreshold={10}
            scrollRenderAheadDistance={50}
            removeClippedSubviews={false} //修正安卓轮播图不显示问题
            // onMomentumScrollEnd={() => this._listenScroll()}
            onScroll={(sview) => this._getListViewData(sview)}
            scrollEventThrottle={20}
            refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this._onRefreshToRequestFirstPageData()}
                />}
        />
    }


    _renderNewsItem(rowData, rowId, sectionID) {
        // console.log(sectionID);
        // console.log(rowId);
        if (sectionID === 'stories') {
            return (
                <View>
                    {rowData.map((item, idx) => {
                        return <TouchableWithoutFeedback key={`${idx}`} transparent style={{
                            height: 70,
                            flex: 1,
                            padding: 10,
                            justifyContent: 'center'
                        }}
                                                         onPress={() => this.props.navigation.navigate('Content', {
                                                             id: item.id,
                                                             title: item.title,
                                                             preRoute: 'DashBoard',
                                                             list_data: list_data,
                                                         })}>
                            <View style={{
                                backgroundColor: 'white',
                                marginBottom: 10,
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
                                <View style={{width: 60}}><Image style={{width: 50, height: 50}}
                                                                 source={{uri: item.images[0]}}/></View>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text
                                        style={{
                                            color: Colors.fontBlack,
                                            lineHeight: 20,
                                            fontSize: 14
                                        }}>{item.title}</Text></View>
                            </View>
                        </TouchableWithoutFeedback>
                    })}
                </View>
            )

        }
        else {
            return null
        }

    }

    _swiperView() {
        // if (this.state.swiperShow) {
        return (
            <Swiper height={250} autoplay={true} showsButtons={false} showsPagination={true}
                    paginationStyle={{marginLeft: 180}}
                    dotStyle={{width: 10, height: 10, borderRadius: 5, marginLeft: 10}}
                    activeDotColor="white" activeDotStyle={{width: 10, height: 10, borderRadius: 5, marginLeft: 10}}
                // style={{marginTop: -20}} dotStyle={{marginTop: -40}} activeDotStyle={{marginTop: -40}}>
            >
                {this.state.titleData[0].top_stories.map((item, index) => {
                    return (
                        <Button transparent style={styles.slide1} key={`${index}`}
                                onPress={() => this.props.navigation.navigate('Content', {
                                    id: item.id,
                                    title: item.title,
                                    preRoute: 'DashBoard',
                                    list_data: list_data
                                })}>
                            <View style={{position: 'relative'}}>
                                <Image style={{width: _winWidth, height: 250}} source={{uri: `${item.image}`}}/>
                                <View style={{
                                    width: _winWidth,
                                    height: 250,
                                    position: 'absolute',
                                    backgroundColor: '#5b7492',
                                    opacity: 0.2
                                }}/>
                                <View style={{
                                    width: _winWidth,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: 90,
                                    right: 10,
                                    // paddingBottom:10,
                                    width: _winWidth * 0.8,

                                }}>
                                    <View style={{position: 'relative'}}>
                                        <Text style={{
                                            color: 'white',
                                            lineHeight: 30,
                                            fontWeight: 'bold',
                                            paddingBottom: 10,
                                            textShadowOffset: {width: 1, height: 2},
                                            textShadowColor: '#000',
                                            fontSize: 20,
                                            textAlign: 'right'
                                        }}>{item.title}</Text>
                                        <View style={{
                                            width: 120,
                                            height: 4,
                                            backgroundColor: Colors.main_yellow,
                                            position: 'absolute',
                                            right: 0,
                                            bottom: -10
                                        }}/>
                                    </View>

                                </View>
                            </View>
                        </Button>
                    )
                })}
            </Swiper>
        )
        // }
        // else {
        //     return <View style={{height: 250, backgroundColor: 'transparent'}}/>
        // }
    }

    _renderSectionHeader(sectionData, sectionID) {
        // console.log(sectionData);
        // return (
        //     <View style={{
        //         marginTop: 10,
        //         marginLeft: 10,
        //         marginRight: 10,
        //         width: 200,
        //         backgroundColor: Colors.main_yellow,
        //         height: 30,
        //         flex: 1,
        //         justifyContent: 'center',
        //         alignItems: 'center',
        //         borderRadius: 15,
        //         shadowColor: '#5b7392',
        //         shadowOffset: {width: 0, height: 2},
        //         shadowOpacity: 0.8,
        //         shadowRadius: 2,
        //     }}>
        //         <Text style={{
        //             color: '#fff',
        //             textAlign: 'center',
        //             marginTop: 5
        //         }}>{sectionData.date}{sectionData.weekday}</Text>
        //     </View>
        // );
        return (
            <LinearGradient colors={['#000', '#192f6a', '#4c669f']} style={styles.linearGradient}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    {/*<View style={{flex:1,alignItems:'center',justifyContent:'center'}} >*/}
                    {/*</View>*/}
                    <View>
                        <Text style={styles.buttonText} onPress={() => {
                            this._scrollView.scrollTo({y: 0, animated: true});
                        }}>
                            {sectionData.date} {sectionData.weekday}
                        </Text>
                    </View>
                    {/*<View style={{flex:1,alignItems:'flex-end',marginRight:15,justifyContent:'center',borderColor:'white'}}>*/}
                    {/*/!*<TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>*!/*/}
                    {/*/!*<View>*!/*/}
                    {/*/!*<Image style={{width: 30, height: 30}} source={require('./assets/person.png')}/>*!/*/}
                    {/*/!*</View>*!/*/}
                    {/*/!*</TouchableOpacity>*!/*/}
                    {/*</View>*/}
                </View>
            </LinearGradient>
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
                return <FooterUtil message="加载失败,请点击重试" callback={() => this._onErrorToRequestNextPage()}/>;
                break;
            default:
                return null;
                break;
        }
    }

}

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
    },
    linearGradient: {
        marginBottom: 10,
        flex: 1,
        width: _winWidth,
        height: 60,
        flexDirection: 'row',
        opacity: 0.7
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
});
