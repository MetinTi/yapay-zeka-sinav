import 'dart:io';

import 'package:flutter/foundation.dart';

/// AdMob unit IDs. Varsayılan: Google test ID'leri (geliştirme).
/// Prod: `--dart-define=AD_USE_TEST_IDS=false` + gerçek ID'ler.
abstract final class AdConfig {
  static const useTestIds = bool.fromEnvironment(
    'AD_USE_TEST_IDS',
    defaultValue: kDebugMode,
  );

  /// Android / iOS AdMob uygulama kimliği (Info.plist / AndroidManifest).
  static String get appId {
    if (useTestIds) {
      return Platform.isIOS
          ? 'ca-app-pub-3940256099942544~1458002511'
          : 'ca-app-pub-3940256099942544~3347511713';
    }
    return Platform.isIOS
        ? const String.fromEnvironment('ADMOB_APP_ID_IOS')
        : const String.fromEnvironment('ADMOB_APP_ID_ANDROID');
  }

  /// Modül tamamlandıktan sonra gösterilen tam ekran reklam.
  static String get interstitialUnitId {
    if (useTestIds) {
      return Platform.isIOS
          ? 'ca-app-pub-3940256099942544/4411468910'
          : 'ca-app-pub-3940256099942544/1033173712';
    }
    return Platform.isIOS
        ? const String.fromEnvironment('ADMOB_INTERSTITIAL_IOS')
        : const String.fromEnvironment('ADMOB_INTERSTITIAL_ANDROID');
  }
}
