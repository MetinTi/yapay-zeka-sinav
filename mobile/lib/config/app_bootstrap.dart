import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/widgets.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:yz_egitim_sinav/firebase_options.dart';
import 'package:yz_egitim_sinav/services/ad_service.dart';
import 'package:yz_egitim_sinav/services/account_local_data.dart';
import 'package:yz_egitim_sinav/services/auth_service.dart';
import 'package:yz_egitim_sinav/services/reminder_notification_service.dart';

/// Uygulama açılışında Firebase + AdMob başlatma.
abstract final class AppBootstrap {
  static bool firebaseReady = false;

  static Future<void> init() async {
    WidgetsFlutterBinding.ensureInitialized();

    await AccountLocalData.instance.clearLegacy();
    await MobileAds.instance.initialize();
    await AdService.instance.initialize();
    await ReminderNotificationService.instance.initialize();

    if (!DefaultFirebaseOptions.isConfigured) {
      debugPrint(
        '[AppBootstrap] Firebase yapılandırılmadı — Auth kapalı. '
        'Bkz. docs/FIREBASE_AUTH_ADS_SETUP.md',
      );
      return;
    }

    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    firebaseReady = true;
    await AuthService.instance.warmUp();
    debugPrint('[AppBootstrap] Firebase Auth hazır.');
  }
}
