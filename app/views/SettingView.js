import React,{Component} from 'react';
import {View,StyleSheet,TouchableOpacity} from 'react-native';
import { Container, Header, Content, ListItem, Text, Radio, Right,Icon,Button,Left ,Body} from 'native-base';
import Colors from '../utils/Colors';

export default class SettingView extends Component{
    static navigationOptions = () => ({
        title: "设置",
        headerBackTitle: null,
        headerStyle: {backgroundColor: Colors.main_red},
        headerTitleStyle: {color: "white"},
    });

    constructor(props){
        super(props);
        this.state = {
            bgColor:"#fff",
            fontColor:Colors.fontBlack
        }
    }

    render(){
       return (
           <Container>
               <Header style={{backgroundColor:this.state.bgColor}}>
                   <Left><Button  transparent onPress={() => this.props.navigation.goBack()}><Icon
                       name='arrow-back' style={{color: this.state.fontColor}}/></Button></Left>
                   <Body><Text style={{color:this.state.fontColor}}>设置</Text></Body>
                   <Right></Right>
               </Header>
               <Content>
                   {this._renderSettingItem()}
               </Content>
           </Container>
       )
    }

    _renderSettingItem(){
        let _data = [
            {name:"纯黑",bgDefaultColor:Colors.sidebar_default_color,bgActiveColor:Colors.sidebar_active_color,
            fontDefaultColor:Colors.sidebar_font_default_color,fontActiveColor:Colors.sidebar_font_active_color},
            {name:"红",bgDefaultColor:"#972a1d",bgActiveColor:"#f12713",fontDefaultColor:Colors.sidebar_font_default_color,fontActiveColor:Colors.sidebar_font_active_color},
            {name:"蓝",bgDefaultColor:"#3698da",bgActiveColor:"#24a6f2",fontDefaultColor:"#ccc",fontActiveColor:"#fff"},
            {name:"紫",bgDefaultColor:"#9b12b4",bgActiveColor:"#be55ed",fontDefaultColor:Colors.sidebar_font_default_color,fontActiveColor:Colors.sidebar_font_active_color},
            {name:"绿",bgDefaultColor:"#27a75c",bgActiveColor:"#87d27b",fontDefaultColor:Colors.sidebar_font_default_color,fontActiveColor:Colors.sidebar_font_active_color},
            {name:"橙",bgDefaultColor:"#fb9507",bgActiveColor:"#f4d03f",fontDefaultColor:Colors.sidebar_font_default_color,fontActiveColor:Colors.sidebar_font_active_color},
            {name:"白",bgDefaultColor:"#abb8b8",bgActiveColor:"#dadfe3",fontDefaultColor:"#000",fontActiveColor:"#ff5858"},
        ];

            return (
                <View>
                    <View style={styles.subtitle}><Text style={{color:Colors.fontBlack}}>主题</Text></View>
                    {_data.map((val,idx) => {
                        return (
                            <TouchableOpacity key={`${idx}`} onPress={() => this.changeColor(val)}>
                                <View  style={[styles.settingItem,{backgroundColor:val.bgDefaultColor}]}>
                                    <Text style={{color:val.fontDefaultColor}}>{val.name}</Text>
                                </View>
                            </TouchableOpacity>
                    )
                    })}
                </View>
            )
    }

    changeColor(color){
        this.setState({
           bgColor:color.bgDefaultColor,
           fontColor:color.fontActiveColor
        });
    }
}

const styles = StyleSheet.create({
    settingItem:{
        // backgroundColor:"#fff",
        // borderBottomWidth:1,
        // borderColor:"#ccc",
        padding:20
    },
    subtitle:{
        padding:10,
    }
});
