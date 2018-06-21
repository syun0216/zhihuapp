package com.zhihurn.wxapi;

/**
 * Created by Syun on 2017/9/18.
 */

        import android.app.Activity;

        import android.app.Activity;
        import android.os.Bundle;


        import com.theweflex.react.WeChatModule;
        import com.theweflex.react.WeChatPackage;

public class WXEntryActivity extends Activity{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WeChatModule.handleIntent(getIntent());
        finish();
    }
}
