import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'es.ulpgc.ionic.angular',
  appName: 'IonicAngularApp',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '19',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '0',
      GOOGLE_MAPS_ANDROID_API_KEY: 'AIzaSyCz4WvFFbwV_d2neqTmiXVN-bsfbsS2lgw',
      GOOGLE_MAPS_IOS_API_KEY: 'AIzaSyCz4WvFFbwV_d2neqTmiXVN-bsfbsS2lgw'
    }
  }
};

export default config;
