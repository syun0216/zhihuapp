import Colors from '../utils/Colors';
const defaultColor = {name:"纯白",bgDefaultColor:"#fff",bgActiveColor:"#fff",
    fontDefaultColor:"#959595",fontActiveColor:"#000"};
const themeReducer = (state={color:defaultColor},action) => {
    // "use strict";
    switch (action.type){
        case "CHANGE_THEME":
            return state = {...state,color:action.color};break;
        default:return state;break;
    }
}

export default themeReducer;