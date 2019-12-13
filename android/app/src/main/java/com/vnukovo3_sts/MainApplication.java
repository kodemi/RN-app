package com.vnukovo3_sts;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.heyao216.react_native_installapk.InstallApkPackager;
import com.rnfs.RNFSPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.marianhello.react.BackgroundGeolocationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.zmxv.RNSound.RNSoundPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.microsoft.codepush.react.CodePush;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new SplashScreenReactPackage(),
            new ReactNativeRestartPackage(),
            new InstallApkPackager(),
            new RNFSPackage(),
            new OrientationPackage(),
            new BackgroundTimerPackage(),
            new BackgroundGeolocationPackage(),
            new RNDeviceInfo(),
            new RNSoundPackage(),
            new ReactNativeConfigPackage(),
            new ReactNativeOneSignalPackage(),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new SnackbarPackage(),
            new VectorIconsPackage()
        );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
