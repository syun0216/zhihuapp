import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Container, Button} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import NewStatusBar from './NewStatusBar'

export default class CommonHeaderView extends Component {
    static propTypes = {
        headerName: React.PropTypes.string,
        navigation: React.PropTypes.object.isRequired,
        statusBarSetting: React.PropTypes.object,
        isLoading: React.PropTypes.bool
    };


    static defaultProps = {
        headerName: null,
        statusBarSetting: {
            networkVisible: false,
            iosBgColor: 'transparent',
            iosHeight: 0,
            barStyle: 'light-content'
        },
    };

    constructor(props) {
        super(props);
    }

    render() {
        let {statusBarSetting, headerName, navigation} = this.props;
        return (
            <View style={{position: 'absolute', zIndex: 999, top: 10, left: 5}}>
                {/*<NewStatusBar networkVisible={statusBarSetting.networkVisible} iosBgColor={statusBarSetting.iosBgColor}*/}
                              {/*iosHeight={statusBarSetting.iosHeight} barStyle={statusBarSetting.barStyle}/>*/}
                {/*<LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>*/}
                    {/*<View>*/}
                        <Button  transparent
                                onPress={() => navigation.navigate('DrawerOpen', {id: 1})}>
                            <Image style={{width: 22, height: 22}} source={require('../assets/menu.png')}/>
                        </Button>
                        {/*<Text style={{*/}
                            {/*color: 'white',*/}
                            {/*textAlign: 'center',*/}
                            {/*fontSize: 18,*/}
                            {/*marginTop: 23*/}
                        {/*}}>{headerName}</Text>*/}
                    {/*</View>*/}
                {/*</LinearGradient>*/}

            </View>
        )
    }

}

let styles = StyleSheet.create({
    linearGradient: {
        height: 60,
        position: 'relative',
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