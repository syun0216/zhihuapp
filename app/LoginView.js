/**
 * Created by Syun on 2017/5/24.
 */
import React, {Component} from 'react'
import {StyleSheet, ScrollView, Image, View, Dimensions, TouchableOpacity, Animated, Easing,Platform} from 'react-native'
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Label,
    Button,
    Text,
    Toast,
    Header,
    Body,
    Left,
    Right,
    Icon
} from 'native-base';
import NewStatusBar from './components/NewStatusBar';
import UserStore from './store/UserStore';
import Colors from './utils/Colors';
import ToastUtil from './utils/ToastUtil';
import Modal from 'react-native-modal';

const _winWidth = Dimensions.get('window').width;
const _winHeight = Dimensions.get('window').height;

export default class LoginView extends Component {
    static navigationOptions = () => ({
        title: "用户登录",
        headerBackTitle: null,
        headerStyle: {backgroundColor: Colors.main_red},
        headerTitleStyle: {color: "white"},

    });

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            disabled: true,
            isLoading: false,
            anim: [1, 2, 3].map(() => new Animated.Value(0)), // 初始化3个值
            rotateValue: new Animated.Value(0),
            rStart: true,
            isModalVisible:false
        };
    }

    componentDidMount() {
        this._rotationStart();
    }

    _rotationStart() {
        this.state.rotateValue.setValue(0);
        if (this.state.rStart) {
            Animated.timing(this.state.rotateValue, {
                toValue: 1,
                duration: 5000,
                easing: Easing.linear
            }).start(() => this._rotationStart());
        }
        else {
            this.state.rotateValue.setValue(0);
        }
    }


    render() {
        return (
                Platform.OS === 'android' ? this._renderAndroidMainLoginView() : this._renderIosMainLoginView()
        );

    }

    _renderRegisterView(){
        return (
            <Modal isVisible={this.state.isModalVisible}
                   onBackButtonPress={() => this.setState({isModalVisible:false})}
                   onBackdropPress={() => this.setState({isModalVisible:false})}
                   backdropOpacity={.7}
                   animationIn={'zoomInDown'}
                   animationOut={'zoomOutUp'}
                   animationInTiming={1000}
                   animationOutTiming={1000}
                   backdropTransitionInTiming={1000}
                   backdropTransitionOutTiming={1000}
                   style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <View style={{ width:_winWidth *0.8,height:200,backgroundColor:'white',borderRadius:10,paddingRight:15}}>
                    <Container>
                        <Content>
                            <Form>
                                <Item fixedLabel>
                                    <Label style={{fontSize:14}}>手机号码</Label>
                                    <Input
                                            style={{fontSize:14}}
                                        onChangeText={(phone) => this._getPhone(phone)}
                                           multiline={false}
                                           autoFocus={false}
                                           placeholder='请输入手机号'
                                           keyboardType='numeric'
                                           clearButtonMode='while-editing'
                                           placeholderTextColor='gray'
                                           maxLength={11}
                                           returnKeyType='done'/>
                                </Item>
                                <Item fixedLabel>
                                    <Label style={{fontSize:14}}>密码</Label>
                                    <Input
                                            style={{fontSize:14}}
                                        onChangeText={(password) => this._getPassword(password)}
                                           multiline={false}
                                           autoFocus={false}
                                           placeholder='请输入密码'
                                           clearButtonMode='while-editing'
                                           placeholderTextColor='gray'
                                           returnKeyType='done'
                                           secureTextEntry={true}/>
                                </Item>
                            </Form>
                            <Button style={{margin:20,backgroundColor:Colors.main_yellow}} block  onPress={() => this._register()}>
                                <Text>注册</Text>
                            </Button>
                            <Button transparent block style={{marginTop:5}}><Text style={{color:Colors.main_red}}>没有账号？去注册</Text></Button>
                        </Content>
                    </Container>
                </View>
            </Modal>
        )
    }

    _renderIosMainLoginView(){
        return (
            <View style={{flex: 1, backgroundColor: 'transparent',}}>
                {this._renderRegisterView()}
                <NewStatusBar iosBgColor="transparent" iosHeight={0} barStyle="light-content"/>
                <View>
                    <Image resizeMode="cover" style={{
                        height: _winHeight,
                        width: _winWidth,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0
                    }} source={{uri: 'bg'}}/>
                    <View style={{
                        height: _winHeight,
                        width: _winWidth, backgroundColor: Colors.fontBlack, opacity: 0.5, position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0
                    }}/>
                </View>
                <ScrollView style={{position: 'relative'}}>
                    <View style={{flex: 1}}>
                        <Button onPress={() => this.props.navigation.goBack()} transparent
                                style={{position: 'absolute', top: 25, right: 10, zIndex: 20}}>
                            <Image style={{width: 18, height: 18}} source={require('./assets/close.png')}/>
                        </Button>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            width: _winWidth,
                            height: 150,
                            position:'absolute',
                            top:_winHeight*0.15,
                            left:0
                        }}>
                            <Animated.View style={{
                                transform: [{
                                    rotateZ: this.state.rotateValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg']
                                    })
                                }],
                                width: 80, height: 80
                            }}>
                                <Image style={{width: 80, height: 80}} source={require('./assets/react.png')}/>
                            </Animated.View>
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: _winWidth,
                                    height: 30
                                }}>
                                <Text style={{color: 'white',fontSize:18}}>知乎日报</Text>
                            </View>
                        </View>

                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            width: _winWidth,
                            marginTop: 50,
                            position: 'absolute',
                            top: 0.35 * _winHeight,
                            left: 0
                        }}>
                            <View style={{
                                flex: 1,
                                width: 0.8 * _winWidth,
                                height: 50,
                                backgroundColor: '#000',
                                marginBottom: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0.6
                            }}>
                                <View style={{width: 40, paddingLeft: 10}}><Image source={require("./assets/phone.png")}
                                                                                  style={{
                                                                                      width: 22,
                                                                                      height: 22,
                                                                                      marginTop: -2
                                                                                  }}/></View>
                                <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
                                    <Input
                                        style={{color: 'white', width: _winWidth * 0.55}}
                                        onChangeText={(phone) => this._getPhone(phone)}
                                        multiline={false}
                                        autoFocus={false}
                                        placeholder='请输入手机号'
                                        keyboardType='numeric'
                                        clearButtonMode='while-editing'
                                        placeholderTextColor='gray'
                                        maxLength={11}
                                        returnKeyType='done'/></View>
                            </View>
                            <View style={{
                                flex: 1,
                                width: 0.8 * _winWidth,
                                height: 50,
                                backgroundColor: '#000',
                                marginBottom: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0.6
                            }}>
                                <View style={{width: 40, paddingLeft: 10}}><Image
                                    source={require("./assets/password.png")}
                                    style={{width: 20, height: 20, marginTop: -2}}/></View>
                                <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
                                    <Input
                                        style={{color: 'white', width: _winWidth * 0.55}}
                                        onChangeText={(password) => this._getPassword(password)}
                                        multiline={false}
                                        autoFocus={false}
                                        placeholder='请输入密码'
                                        clearButtonMode='while-editing'
                                        placeholderTextColor='gray'
                                        returnKeyType='done'
                                        secureTextEntry={true}/></View>
                            </View>
                            <View style={{
                                width: _winWidth,
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 20
                            }}>
                                <TouchableOpacity style={{
                                    width: _winWidth * 0.6,
                                    height: 50,
                                    backgroundColor: Colors.main_yellow,
                                    flex: 1,
                                    alignItems: 'center',
                                    borderRadius: 25,
                                    justifyContent: 'center'
                                }} onPress={() => this._login()}><View>
                                    <Text style={{color: 'white'}}>登录</Text>

                                </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: _winWidth, height: 20, marginTop: 15}}>
                                <Text style={{textAlign: 'center', fontSize: 12, color: 'white'}}>忘记密码？</Text>
                            </View>

                        </View>

                    </View>
                </ScrollView>
                <View style={{position: 'absolute', bottom: 0, left: 0.1 * _winWidth, opacity: 0.5}}>
                    <View style={{width: 0.8 * _winWidth, borderTopColor: 'white', borderTopWidth: 1,}}>
                        <Text onPress={() => this.setState({isModalVisible:true})} style={{textAlign: 'center', color: 'white', padding: 10, fontSize: 12}}>新用户？点击注册</Text>
                    </View>
                </View>
            </View>
        )
    }

    _renderAndroidMainLoginView(){
        return (
            <Container>
                <Header style={{backgroundColor:'white'}}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}><Icon name='arrow-back' style={{fontSize:24,color:'#959595'}}/></Button>
                    </Left>
                    <Body><Text>用户登录</Text></Body>
                    <Right></Right>
                </Header>
                {this._renderLoginView()}
            </Container>
        )
    }

    _renderLoginView(){
        return (
            <Container>
                <Content>
                    <Form>
                        <Item fixedLabel>
                            <Label>手机号码</Label>
                            <Input onChangeText={(phone) => this._getPhone(phone)}
                                   multiline={false}
                                   autoFocus={false}
                                   placeholder='请输入手机号'
                                   keyboardType='numeric'
                                   clearButtonMode='while-editing'
                                   placeholderTextColor='gray'
                                   maxLength={11}
                                   returnKeyType='done'/>
                        </Item>
                        <Item fixedLabel>
                            <Label>密码</Label>
                            <Input onChangeText={(password) => this._getPassword(password)}
                                   multiline={false}
                                   autoFocus={false}
                                   placeholder='请输入密码'
                                   clearButtonMode='while-editing'
                                   placeholderTextColor='gray'
                                   returnKeyType='done'
                                   secureTextEntry={true}/>
                        </Item>
                    </Form>
                    <Button style={{margin:20,backgroundColor:Colors.main_blue}} block  onPress={() => this._login()}>
                        <Text>登录</Text>
                    </Button>
                    <Button transparent block style={{marginTop:5}}><Text style={{color:Colors.main_red}}>没有账号？去注册</Text></Button>
                </Content>
            </Container>
        )
    }

    _getPhone(text) {
        let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (reg.test(text)) {
            this.setState({
                phone: text,
                disabled: false
            })
        }

    }

    _getPassword(text) {
        this.setState({
            password: text
        })
    }

    _login() {
        if (this.state.phone === '' && this.state.password === '') {
            ToastUtil.show('请填写用户名或密码', 1000, 'bottom');
            return;
        }
        if (this.state.phone !== '18022129789' && this.state.password !== '123') {
            ToastUtil.show('用户名和密码错误', 1000, 'bottom', 'danger');
            return;
        }
        // const resetAction = NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: 'Home'})
        //     ]
        // });
        UserStore.setLoginUserJsonData(this.state.phone);
        // console.log(userData.account.id);
        // this.props.navigation.dispatch(resetAction);
        this.props.navigation.goBack();
    }

    _register(){
        if (this.state.phone === '' && this.state.password === '') {
            ToastUtil.show('请填写用户名或密码', 1000, 'bottom');
            return;
        }
        if (this.state.phone !== '18022129789' && this.state.password !== '123') {
            ToastUtil.show('用户名和密码错误', 1000, 'bottom', 'danger');
            return;
        }
    }
}



const Styles = StyleSheet.create({
    loginBtn: {
        padding: 10,
    }
});