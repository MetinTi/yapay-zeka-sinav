import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:yz_egitim_sinav/config/ad_config.dart';

/// Modül / bölüm tamamlandığında tam ekran (interstitial) reklam.
class AdService {
  AdService._();
  static final AdService instance = AdService._();

  InterstitialAd? _interstitial;
  bool _loading = false;
  bool _initialized = false;

  Future<void> initialize() async {
    if (_initialized) return;
    _initialized = true;
    await _loadInterstitial();
  }

  /// Modül tamamlandıktan sonra çağırın. Reklam yoksa veya hazır değilse sessizce geçer.
  Future<void> showInterstitialAfterLesson() async {
    if (!_initialized) await initialize();

    final ad = _interstitial;
    if (ad == null) {
      debugPrint('[AdService] Interstitial hazır değil, atlanıyor.');
      await _loadInterstitial();
      return;
    }

    final completer = Completer<void>();
    ad.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _interstitial = null;
        _loadInterstitial();
        if (!completer.isCompleted) completer.complete();
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        debugPrint('[AdService] Gösterim hatası: $error');
        ad.dispose();
        _interstitial = null;
        _loadInterstitial();
        if (!completer.isCompleted) completer.complete();
      },
    );

    await ad.show();
    return completer.future;
  }

  Future<void> _loadInterstitial() async {
    if (_loading || _interstitial != null) return;
    _loading = true;

    await InterstitialAd.load(
      adUnitId: AdConfig.interstitialUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitial = ad;
          _loading = false;
          debugPrint('[AdService] Interstitial yüklendi.');
        },
        onAdFailedToLoad: (error) {
          _loading = false;
          debugPrint('[AdService] Yüklenemedi: $error');
        },
      ),
    );
  }

  void dispose() {
    _interstitial?.dispose();
    _interstitial = null;
  }
}
