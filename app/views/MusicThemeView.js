import React,{Component} from 'react';
import {View,Text,StyleSheet,Image,Dimensions,ListView,Platform} from 'react-native';
import {Header,Container,Content,Left,Body,Right,Button} from 'native-base';
import api from '../api/_index';
import NewStatusBar from '../components/NewStatusBar';import FullScreenLoading from '../components/FullScreenLoading';
import CommonListView from '../components/CommonListView';import CommonHeaderView from '../components/CommonHeaderView';
export default class DailyThemeView extends Component{
  static navigationOptions = {
    header:null,
    drawerLabel: '音乐日报',
   drawerIcon: () => (
     <View>
           <Image
               source={require('../assets/music.png')}
               style={styles.icon}
           />
     </View>

   ),
  };

    constructor(props) {
        super(props);
        this.state = {
            themeData: null,
            isHttpRequesting: false,
            statusBarColor: 'transparent',
            statusBarHeight: 0,
            iosBarStyle: 'light-content',
            fadeOpacity:0
        }
    }

    componentDidMount() {
        this.setState({
            isHttpRequesting: true
        });
        this._requestThemesData();
    }

    //requests
    _requestThemesData() {
        api.getTopicsById(7).then((data) => {
            if (data.data !== null && data.data.stories.length !== 0) {
                for (let item of data.data.stories) {
                    if (typeof item.images === 'undefined') {
                        item.images = null;
                    }
                }
                this.setState({
                    themesData: data.data,
                    isHttpRequesting: false,
                })
            }
        })
    }

    _scrollInfo(sview) {
        if (sview.nativeEvent.contentOffset.y > 186) {
            this.setState({
                statusBarColor: '#fff',
                iosBarStyle: 'default',
                fadeOpacity:120/186
            })
        }
        else {
            this.setState({
                statusBarColor: 'transparent',
                iosBarStyle: 'light-content',
                fadeOpacity:(sview.nativeEvent.contentOffset.y - 60)/186
            })
        }
        // console.log(sview.nativeEvent.contentOffset.y);
    }

    //views

    render() {
        let _statusBarSetting = {
            networkVisible: this.state.isHttpRequesting,
            iosBgColor: this.state.statusBarColor,
            iosHeight: 20,
            barStyle: this.state.iosBarStyle
        };
        return (
            <Container>
                {Platform.OS === 'android' ? null : <NewStatusBar networkVisible={_statusBarSetting.networkVisible}
                                                                  iosBgColor={_statusBarSetting.iosBgColor}
                                                                  iosHeight={_statusBarSetting.iosHeight} barStyle={_statusBarSetting.barStyle}
                />}
                {/*<CommonHeaderView statusBarSetting={_statusBarSetting} isLoading={this.state.isHttpRequesting} headerName="动漫日报" navigation={this.props.navigation}/>*/}
                <Button style={{position: 'absolute', top: 18, left: 25, zIndex: 1000}} transparent
                        onPress={() => this.props.navigation.navigate('DrawerOpen', {id: 1})}>
                    <View style={{
                        width: 30,
                        height: 30,
                        backgroundColor: '#000',
                        borderRadius:15,
                        position:'relative',
                        opacity:this.state.fadeOpacity,
                        position:"absolute",
                        left:-2
                    }} />
                    <Image style={{width: 22, height: 22,}} source={require('../assets/menu.png')}/>

                </Button>
                {this._renderFullLoadingView()}
                {this.state.themesData != null ?
                    <CommonListView scrollInfo={(sview) => this._scrollInfo(sview)} style={{marginTop: 50}}
                                    data={this.state.themesData} navigation={this.props.navigation}/> : null}
            </Container>
        )
    }

    _renderFullLoadingView(){
      return <FullScreenLoading message="正在加载中..." isLoading={this.state.isHttpRequesting}/>
    }
}

const styles = StyleSheet.create({
  icon:{
    width:24,
    height:24
  }
});
