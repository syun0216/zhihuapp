import React, {Component} from 'react';
import {Text, View, Image,Animated,Easing,ScrollView,Dimensions,TextInput} from 'react-native';
import {Container, Header, Footer, Body, Content, Left, Right, Button, Icon} from 'native-base';
import api from '../api/_index';
import NewStatusBar from '../components/NewStatusBar';
import FullScreenLoading from '../components/FullScreenLoading';
import ErrorView from '../components/ErrorView';
import ToastUtil from '../utils/ToastUtil';
import Colors from '../utils/Colors';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const _winWidth = Dimensions.get('window').width;
const _winHeight = Dimensions.get('window').height;

export default class CommentView extends Component {
    _scrollView = null;
    static navigationOptions = () => ({header: null, gesturesEnabled: true});

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            longComments: null,
            shortComments: null,
            isShortCommentsShow: false,
            arrow:new Animated.Value(0),
            opacity:new Animated.Value(0),
            isModalVisible:false
        };
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        this._requestLongCommentsData();
        this._requestShortCommentsData();
    }

    //request function
    _requestShortCommentsData() {
        api.getShortComments(this.props.navigation.state.params.id).then((data) => {
            if (data.data !== null && data.data.comments.length !== 0) {
                this.setState({
                    shortComments: this.getLocalDate(data.data.comments),
                    isLoading: false
                });
                // console.log(this.state.shortComments);
            }
            ToastUtil.show('加载成功', 1000, 'bottom');
        }).catch(() => {
            ToastUtil.show('api goes wrong', 1000, 'bottom');
            this.setState({
                isLoading: false
            })
        });
    }

    _requestLongCommentsData() {
        api.getLongComments(this.props.navigation.state.params.id).then((data) => {
            // console.log(data);
            if (data.data !== null && data.data.comments.length !== 0) {
                this.setState({
                    longComments: this.getLocalDate(data.data.comments)
                })
            }
        }).catch(() => {
            ToastUtil.show('api goes wrong', 1000, 'bottom');
        });
    }

    //common function
    getLocalDate(ns) {
        ns.map((val) => {
            val.time = new Date(parseInt(val.time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
        });
        return ns;
    }

    _onShowShortComments() {
        if(!this.state.isShortCommentsShow){
            Animated.timing(this.state.arrow, {
                toValue: 1, // 目标值
                duration: 500, // 动画时间
                easing: Easing.linear // 缓动函数
            }).start();
            Animated.timing(this.state.opacity, {
                toValue: 1, // 目标值
                duration: 1000, // 动画时间
                easing: Easing.linear // 缓动函数
            }).start();
        }
        else{
            Animated.timing(this.state.arrow, {
                toValue: 0, // 目标值
                duration: 500, // 动画时间
                easing: Easing.linear // 缓动函数
            }).start();
            Animated.timing(this.state.opacity, {
                toValue: 0, // 目标值
                duration: 400, // 动画时间
                easing: Easing.linear // 缓动函数
            }).start();
            // this._scrollView.scrollTo({y:0,animated: true})
        }
        if(!this.state.isShortCommentsShow){
            this.setState({
                isShortCommentsShow: !this.state.isShortCommentsShow
            })
        }
        else{
            setTimeout(() => {
                this.setState({
                    isShortCommentsShow: !this.state.isShortCommentsShow
                })
            },500)
        }
    }

    render() {
        return (
            <Container>
                <Header style={{backgroundColor:'white'}}>
                    <Left></Left>
                    <Body><Text style={{
                        color: '#1e90ff',
                        fontSize: 18
                    }}>{this.props.navigation.state.params.count}条评论</Text></Body>
                    <Right>
                        {/*<Button transparent onPress={() => this._scrollView.scrollToEnd({animated: true})}><Text>scroll 200</Text></Button>*/}
                    </Right>
                </Header>
                {this._renderFullLoadingView()}
                   <Content>
                        {this.state.shortComments !== null ? this._renderShortCommentView() : null}
                        {this.state.longComments !== null ? this._renderLongCommentView() : null}
                       {this._renderCommentModalView()}
                    </Content>
                <Footer style={{backgroundColor: '#fff',}}>
                    <Left><Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back'
                              style={{
                                  fontSize: 22,
                                  color: '#ccc'
                              }}/></Button></Left>
                    <Body><Button transparent onPress={() => this.setState({isModalVisible:true})}>
                        <FontAwesome name="pencil-square-o" style={{fontSize: 20, color: Colors.fontBlack}}/>
                        <Text style={{marginLeft:5}}>写评论</Text>
                    </Button></Body>
                    <Right></Right>
                </Footer>
            </Container>
        )
    }

    _renderCommentModalView(){
        return (
            <Modal isVisible={this.state.isModalVisible}
                   onBackButtonPress={() => this.setState({isModalVisible:false})}
                   onBackdropPress={() => this.setState({isModalVisible:false})}
                   style={{flex:1,justifyContent:'center',alignItems:'center',borderRadius:10}}>
                <View style={{ width:_winWidth *0.8,height:200,backgroundColor:'white',display:"flex",justifyContent:"center",alignItems:"center"}}>
                    {/*<View style={{borderBottomWidth:1,borderColor:Colors.fontBlack,height:120}}>*/}
                        {/*<TextInput*/}
                            {/*multiline={true}*/}
                            {/*numberOfLines={10}*/}
                            {/*onChangeText={(text) => this.setState({text})}*/}
                            {/*style={{}}*/}
                            {/*/>*/}
                    {/*</View>*/}
                    <Text>暂未开放😯</Text>
                </View>
            </Modal>
        )
    }

    _renderLongCommentView() {
        return (
            <View>
                {this.state.longComments.map((item, idx) => {
                    return this._renderCommonCommentView(item, idx);
                })}
            </View>
        )

    }

    _renderShortCommentView() {
        return (
            <View>
                {this._renderCommonTitleView('短评')}
                <Animated.View style={{opacity:this.state.opacity}}>
                    {this.state.isShortCommentsShow ? this.state.shortComments.map((item, idx) => {
                        return this._renderCommonCommentView(item, idx);
                    }) : null}
                </Animated.View>
            </View>
        )
    }

    _renderCommonTitleView(name) {
        return (
            <Button style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: 10,
                borderBottomWidth: 1,
                height: 50,
                backgroundColor: 'white',
                borderBottomColor: '#ccc',
            }} transparent onPress={() => this._onShowShortComments()}>
                <Text style={{flex: 1, color: Colors.fontBlack}}>{name}</Text>
                <Animated.Image style={[{width: 20, height: 20},{transform: [{
                    rotateZ: this.state.arrow.interpolate({
                        inputRange: [0,1],
                        outputRange: ['0deg', '180deg']
                    })
                }]}]} source={require('../assets/drop-down.png')}/>
            </Button>
        )
    }

    _renderCommonCommentView(data, key) {
        return (
            <View key={`${key}`} style={{
                flex: 1,
                padding: 10,
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderColor: '#ccc',
                backgroundColor: 'white'
            }}>
                <View style={{width: 50}}>
                    <Image style={{width: 34, height: 34, borderRadius: 20}} source={{uri: data.avatar}}/>
                </View>
                <View style={{flex: 1, paddingRight: 5, marginTop: 5}}>
                    <View style={{
                        height: 10,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 10
                    }}>
                        <Text>{data.author}</Text>
                        <View style={{flexDirection: 'row'}}><Image style={{width: 18, height: 18}}
                                                                    source={require('../assets/like_selected.png')}/>
                            <Text style={{ marginLeft: 5}}>{data.likes}</Text></View>
                    </View>
                    <View style={{flex: 1, marginBottom: 10}}><Text
                        style={{lineHeight: 20,}}>{data.content}</Text></View>
                    <View style={{height: 10, marginBottom: 10}}><Text style={{color: "#ccc"}}>{data.time}</Text></View>
                </View>
            </View>
        );
    }

    _renderFullLoadingView() {
        return <FullScreenLoading message="正在加载中..." isLoading={this.state.isLoading}/>
    }

}
