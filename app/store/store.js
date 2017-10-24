import {applyMiddleware,createStore} from 'redux';

import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import reducers from '../reducers/index';

import Colors from '../utils/Colors'

const middleware = applyMiddleware(promise(),createLogger(),thunk);

const defaultState = {
    color:{name:"纯黑",bgDefaultColor:Colors.sidebar_default_color,bgActiveColor:Colors.sidebar_active_color,
        fontDefaultColor:Colors.sidebar_font_default_color,fontActiveColor:Colors.sidebar_font_active_color}
};
const store = createStore(reducers,middleware);

export default store;