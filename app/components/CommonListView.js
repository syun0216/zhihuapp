import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {ListView,RefreshControl,Text,StyleSheet,Dimensions,View,Image,TouchableOpacity,TouchableWithoutFeedback,ScrollView} from 'react-native';
import {ListItem,Body,Left,Right,Thumbnail,Button,Container,Content,Header} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../utils/Colors';
_winWidth = Dimensions.get('window').width;
_winHeight = Dimensions.get('window').height;
let list_data = [];

export default class CommonListView extends Component{
  static propTypes = {
    //  refreshable:React.PropTypes.bool,
    //  renderRow: React.PropTypes.func,
    //  renderSeparator: React.PropTypes.func,
    //  renderFooter: React.PropTypes.func,
    //  requestingFunc:React.PropTypes.func,
    //  data:React.PropTypes.object.isRequired,
     navigation:React.PropTypes.object.isRequired,
     scrollInfo:React.PropTypes.func,
        // renderRow:React.PropTypes.func.isRequired,
  };
  _refreshable = false;
  _isEnd = true;
  constructor(props){
    super(props);
    this._refreshable = props.refreshable == null ? false : props.refreshable;
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource:ds.cloneWithRows([])
    };
  }

  componentDidMount(){
      list_data = this.props.data.stories;
    this.setState({
      dataSource:this.state.dataSource.cloneWithRows(this.props.data.stories)
    });
  }

//requests
  _onRefreshToRequestFirstPageData(){
    if(this.props.requestingFunc != null){
      this.props.requestingFunc();
    }
    else{
      return null;
    }
  }

//views
    render(){
      return <View style={{backgroundColor:Colors.fontBlack}}>{this._mainListView()}</View>;
    }

  _mainListView(){
    let refreshControl = this._refreshable ? <RefreshControl
            style={{backgroundColor: Colors.TRANSPARENT}}
            refreshing={this.state.refreshing}
            onRefresh={() => this._onRefreshToRequestFirstPageData()}
        /> : null;
      return (
        <ListView
            style={{backgroundColor: Colors.bgColor}}
          initialListSize={10}
          pageSize={5}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this._renderListItemView(rowData)}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
          renderHeader={() => this._renderHeaderView()}
          onScroll={(sview) => this.props.scrollInfo(sview)}
          scrollEventThrottle={20}
          // renderSectionHeader={(sectionData,sectionID) => this._renderSectionHeaderView(sectionData,sectionID)}
          refreshControl={refreshControl}
        />
      )
  }

  _renderListItemView(rowData){
      return (
          <TouchableWithoutFeedback transparent style={{height: 70, flex: 1, padding: 10, justifyContent: 'center',backgroundColor:Colors.bgColor}}
                                    onPress={() => this.props.navigation.navigate('Content', {
                                        id: rowData.id,
                                        title: rowData.title,
                                        list_data:list_data
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
                  {rowData.images !== null ? <View style={{width:60}}><Image style={{width:50,height:50}} source={{uri:rowData.images[0]}}/></View> : null}
              <View style={{flex: 1, justifyContent: 'center'}}><Text
                  style={{color: Colors.fontBlack}}>{rowData.title.split("").length > 18 ? rowData.title.substr(0, 18) + '...' : rowData.title}</Text></View>
            </View>
          </TouchableWithoutFeedback>
      )
  }

  _renderHeaderView(){
    return (
        <View >
            <View style={styles.titleImg}>
                <View style={{
                    width: _winWidth,
                    height: 200,
                    position: 'absolute',
                    backgroundColor: '#5b7492',
                    opacity: 0.15,
                    zIndex:1000
                }} />
                <Image style={{width:_winWidth,height:200}} source={{uri:this.props.data.image}}/>
                <View style={styles.titleView}>
                    {/*<Text style={[styles.titleText,{marginBottom:3}]}>{this.props.data.name}</Text>*/}
                    <Text style={styles.titleText}>{this.props.data.description}</Text>
                </View>
                <View style={{
                    width: 120, height: 4,
                    backgroundColor: Colors.main_yellow,
                    position:'absolute',right:10,bottom:55
                }} />

                <View style={styles.subTitleView}>
                    <Text style={[styles.titleText,{marginBottom:3}]}>{this.props.data.name}</Text>
                </View>
            </View>


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
                <Text>主编</Text>
                <View style={{flex:1,flexDirection:'row',alignItems:'flex-start'}}>
                    {
                        this.props.data.editors.map((item,idx) => {
                            return (
                                <View key={`${idx}`} style={{marginLeft:20,marginTop:-3}}>
                                    <Image style={{width:20,height:20,borderRadius:10}} source={{uri:item.avatar}} />
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        </View>

    )
  }

  _renderSectionHeaderView(){
    return (
      <ListItem>
        <Left><Text>主编</Text>
          {
            this.props.data.editors.map((item,idx) => {
              return (
                <View key={`${idx}`} style={{marginLeft:20,marginTop:-3}}>
                    <Image style={{width:20,height:20,borderRadius:10}} source={{uri:item.avatar}} />
                </View>
              )
            })
          }
        </Left>
        <Body>
        </Body>
        <Right></Right>
      </ListItem>
    )
  }
}

const styles = StyleSheet.create({
  titleImg:{
    // flex: 1,
    // justifyContent: 'center',
    // position:'relative',
    // alignItems: 'center',
    width:_winWidth,
    // backgroundColor: '#9DD6EB',
    height: 200,
    position:'relative'
  },
  titleView:{
    position:'absolute',
    bottom:50,
    right:10,
    width:_winWidth*0.7,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:5,
      backgroundColor:"transparent",
  },
  titleText:{
      color: 'white',
      lineHeight: 25,
      fontWeight: 'bold',
      paddingBottom: 10,
      marginLeft:10,
      textShadowOffset: {width: 1, height: 2},
      textShadowColor: '#000',
      fontSize: 18,
      textAlign:'right'
  },
    subTitleView:{
        position:'absolute',
        bottom:0,
        right:10,
        width:_winWidth*0.8,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:5,
        backgroundColor:"transparent",
    },
  editorView:{
    flex:1,
    justifyContent:"center",
    alignItems:'center',
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:'#ccc',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:5
    }
});
