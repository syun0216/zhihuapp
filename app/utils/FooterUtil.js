import React,{Component} from 'react';
import {StyleSheet,Text,ActivityIndicator} from 'react-native';
import {ListItem,Button,Spinner,Body,Left,Right} from 'native-base';

export default class FooterUtil extends Component{
  constructor(props){
    super(props);
    props.message === null ? '正在载入中...' : props.message;
    props.callback === null ? null : props.callback;
    props.loading === null ? false :props.loading;
  }
  render(){
    return (
      <ListItem style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <Button transparent onPress={this.props.callback}>
            {this.props.isLoading ? <ActivityIndicator size="small"/> : null}
            <Text style={{marginLeft:5}}>{this.props.message}</Text>
          </Button>
      </ListItem>
    )
  }

}
