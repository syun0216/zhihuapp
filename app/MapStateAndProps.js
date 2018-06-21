import React, { PureComponent } from 'react';
import App from './App';
import {connect} from 'react-redux';

class MapStateAndProps extends PureComponent {
  render() {
    return (
        <App  
          screenProps={{...this.props}}
        />
    )
  }
}

const appStateToProps = (state) => ({
  theme: state.theme.color
})

const appmapDispatchToProps = dispatch => ({
  changeTheme: (color) => dispatch({type:'CHANGE_THEME',color}),
  dispatch: dispatch
})

export default connect(appStateToProps,appmapDispatchToProps)(MapStateAndProps)