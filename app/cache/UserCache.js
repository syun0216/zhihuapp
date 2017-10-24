/**
 * Created by Syun on 2017/5/24.
 */
import {
    AsyncStorage
} from 'react-native';

let _userJSONData = null;

let UserServices = {

    _STORAGE_KEY_USER_DATA: 'storage_key_user_data',

    isLogin:_userJSONData !== null,

    /**
     * 存储用户信息
     * @param userInfo("id":"xxxxx","name":"xxxxx")
     */
    setLoginUserJsonData(userData){
        "use strict";
        _userJSONData = userData;
        AsyncStorage.setItem(this._STORAGE_KEY_USER_DATA, JSON.stringify(userData));
    },

    /**
     * 获取登录用户信息
     * @param callBack 返回error和用户的信息，json("id":"xxxx","name":"xxx")
     */
    getLoginUserJsonData(callBack){
        "use strict";
        if (callBack == null) {
            return;
        }
        if (_userJSONData != null) {
            callBack(null, _userJSONData);
            return;
        }

        AsyncStorage.getItem(this._STORAGE_KEY_USER_DATA, (error, value) => {
            if (error != null || value == null || value.length == 0) {
                callBack(error, null);
                return;
            }
            this.isLogin = !!_userJSONData;
            _userJSONData = JSON.parse(value);;
            callBack(null, _userJSONData);
        });

        /**
         * 清空用户信息
         */

    },
    clearStoreUser(){
        _userJSONData = null;
        AsyncStorage.clear();
    }

};

module.exports = UserServices;
