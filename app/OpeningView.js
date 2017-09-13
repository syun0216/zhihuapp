import React, {Component} from 'react';
import {View, StyleSheet, StatusBar, Image, Dimensions,Text} from 'react-native';
import {Button} from 'native-base';
import {StackNavigator, NavigationActions} from 'react-navigation'
import api from './api/_index';
import DashBoardView from './DashBoardView';
import ContentView from './views/ContentView';

export default class OpeningView extends Component {
    _winWidth = Dimensions.get('window').width;
    _winHeight = Dimensions.get('window').height;
    static navigationOptions = {
        headerMode: 'none',
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            pic: 'https://pic3.zhimg.com/v2-5af460972557190bd4306ad66f360d4a.jpg',
            isHttpRequesting: false
        };
    }

    componentDidMount() {
        this.setState({
            isHttpRequesting: true,
            isChange:false
        });
        this._requestOpeningAnimation();
        this._aniamteToDash();
    }

    _requestOpeningAnimation() {
        api.getFirstPageImg().then((data) => {
        })
            .catch((error) => {
                console.log('Api goes wrong');
            })
    }

    render() {
        return this._renderOpeningView();
    }

    _aniamteToDash() {
        // let countInit = 4;
        let countInit = 0;
        let _this = this;
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Dash'})
            ]
        });
        let TIMER = setInterval(()=> {
            if (countInit == 0) {
                _this.props.navigation.dispatch(resetAction);
                clearInterval(TIMER);
            }
            else {
                countInit--;
            }
        }, 1000);
        // return !this.state.isChange ? this._renderOpeningView() : <DashBoardView/>;
    }

    _renderOpeningView(){
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',position:'relative'}}>
                <Image source={{uri: this.state.pic}} style={{width: this._winWidth, height: this._winHeight}}/>
                <Text style={{position:'absolute',bottom:20,backgroundColor:'transparent',color:'white',fontSize:30}}>知乎日报</Text>
            </View>
        )
    }
}

// const StackOptions = ({navigation}) => {
//     let {navigate,state,goBack} = navigation;
//
//     // 用来判断是否隐藏或显示header
//     // const visible= state.params.isVisible;
//     // let header;
//     // if (visible === true){
//     //     header = null;
//     // }
//     // const headerStyle = {backgroundColor: Colors.main_red};
//     // const headerTitle = state.params.title;
//     // const headerTitleStyle = {fontSize:20,color:'white',fontWeight:'500'};
//     // const headerBackTitle = false;
//     const headerLeft = (
//         <Button transparent onPress={() => navigate('DrawerOpen')}>
//             <Image style={{width:24,height:24}} source={require('./assets/menu.png')} />
//         </Button>
//     );
//     // return {headerStyle,headerTitle,headerTitleStyle,headerBackTitle,headerLeft,header}
//       return {headerLeft};
// };

// let mainView = StackNavigator({
//     Home: {screen: OpeningView},
//     Dash: {screen: DashBoardView,navigationOptions: ({navigation}) => StackOptions({navigation})},
//     Content: {screen: ContentView}
// })

// module.exports = mainView;
