# Firebase Auth + AdMob kurulumu

> Tarihsel mobil kurulum notlarıdır; aşağıdaki Console/servis/erişim ve mağaza adımları ayrıca yetkilendirilir. Kaynak aktarımı bunları uygulamaz. Gerçek istemci yapılandırmaları Git dışında kalır.

Mobil kaynaklar e-posta/parola, Google ve Apple girişini ve modül sonunda reklam entegrasyonunu içerir; güncel cihaz/Store kabulü bu belgeyle doğrulanmaz.

## 1. Firebase projesi

**Proje:** `yapay-zeka-egitim-mt` (YZ Egitim Sinav) — repoda `.firebaserc` ile bağlı.

```bash
cd mobile
dart pub global activate flutterfire_cli
flutterfire configure --project=yapay-zeka-egitim-mt --platforms=android,ios --yes
```

- `lib/firebase_options.dart` güncellenir. **FlutterFire, bu projenin özel `isConfigured` alanını üretmez ve önceki dosyayı ezebilir.** Gerçek yerel yapılandırma tamamlandıktan sonra `DefaultFirebaseOptions` sınıfına elle `static const bool isConfigured = true;` ekle; `AppBootstrap` bu alanı kullanır.
- Firebase kurmadan yalnız kaynakları incelemek/test etmek için `lib/firebase_options.dart.example` dosyasını `lib/firebase_options.dart` olarak kopyala; örnekteki `isConfigured = false` değerini koru.
- `android/app/google-services.json` ve `ios/Runner/GoogleService-Info.plist` eklenir.
- iOS: `GoogleService-Info.plist` Xcode Runner hedefine bağlanır.

### Console (girişin çalışması için zorunlu)

[Firebase Console → yapay-zeka-egitim-mt](https://console.firebase.google.com/project/yapay-zeka-egitim-mt)

1. **Authentication → Sign-in method**
   - **E-posta/Parola** → Etkinleştir → kaydet (e-posta girişi için zorunlu)
   - **Google** → Etkinleştir → kaydet
   - **Apple** → Etkinleştir (Apple Developer: Services ID, Key, Team ID)
2. **Android uygulama ayarları** (`com.metintiryaki.yz_egitim_sinav`)
   - SHA-1 parmak izi ekle (debug için):
     ```bash
     cd mobile/android && ./gradlew :app:signingReport
     ```
     veya Android Studio → Gradle → `signingReport` → `Variant: debug` → SHA1
   - Kaydettikten sonra `google-services.json` yeniden indir veya `flutterfire configure` tekrar çalıştır (`oauth_client` dolu olmalı)
3. **Google etkinleştikten sonra iOS**
   - `GoogleService-Info.plist` yeniden indir — içinde `CLIENT_ID` ve `REVERSED_CLIENT_ID` görünmeli
   - `REVERSED_CLIENT_ID` değerini `ios/Runner/Info.plist` → `CFBundleURLTypes` içine URL scheme olarak ekle (aşağı §2)

### Android Gradle

`android/settings.gradle.kts` içine:

```kotlin
id("com.google.gms.google-services") version "4.4.2" apply false
```

`android/app/build.gradle.kts` plugins bloğuna:

```kotlin
id("com.google.gms.google-services")
```

`minSdk` en az **23** önerilir (`google_mobile_ads`).

### Firebase Console

1. **Authentication** → Sign-in method → **Google** ve **Apple** etkinleştirin.
2. Apple: Services ID, Key, Team ID (Apple Developer) bağlayın.
3. iOS: Xcode → Runner → **Sign in with Apple** capability (entitlements dosyası repoda).

## 2. Google Sign-In (iOS)

`GoogleService-Info.plist` içindeki `REVERSED_CLIENT_ID` değerini `Info.plist` içine URL scheme olarak ekleyin (flutterfire / Firebase dokümantasyonu).

## 3. AdMob

1. [AdMob](https://admob.google.com/) → uygulama oluşturun (iOS + Android).
2. **Interstitial** reklam birimi oluşturun (modül sonu).
3. Prod build:

```bash
flutter run --dart-define=AD_USE_TEST_IDS=false \
  --dart-define=ADMOB_APP_ID_IOS=ca-app-pub-XXXX~YYYY \
  --dart-define=ADMOB_APP_ID_ANDROID=ca-app-pub-XXXX~YYYY \
  --dart-define=ADMOB_INTERSTITIAL_IOS=ca-app-pub-XXXX/ZZZZ \
  --dart-define=ADMOB_INTERSTITIAL_ANDROID=ca-app-pub-XXXX/ZZZZ
```

Geliştirmede **test reklam ID'leri** varsayılandır (`kDebugMode`).

Manifest / Info.plist içindeki `GADApplicationIdentifier` prod App ID ile güncellenmeli.

## 4. Mağaza / gizlilik (önemli)

| Konu | Not |
|------|-----|
| Apple | Google sunuyorsanız **Sign in with Apple zorunlu** (uygulandı). |
| Gizlilik etiketi | E-posta, kullanıcı kimliği, reklam verisi beyan edin. |
| ATT (iOS) | Kişiselleştirilmiş reklam için izin gerekebilir. |
| COPPA / çocuk | Eğitim uygulaması yaş sınırına göre reklam kısıtı değerlendirin. |

## 5. Kod özeti

| Dosya | Görev |
|-------|--------|
| `lib/config/app_bootstrap.dart` | Firebase + AdMob init |
| `lib/services/auth_service.dart` | Google / Apple giriş |
| `lib/services/ad_service.dart` | Modül sonu interstitial |
| `lib/screens/auth/auth_gate.dart` | Giriş zorunluluğu |
| `lesson_detail_screen.dart` | Tamamlanınca `showInterstitialAfterLesson()` |

## 6. Test

1. `flutterfire configure` sonrası yukarıdaki özel `isConfigured` alanını elle ekle; gerçek yapılandırma için `true`, public örnek için `false`.
2. Simulator’da Google / Apple girişi.
3. Modülü tamamla → test interstitial görünmeli.

Firebase bağlı değilken: giriş ekranı açılır, butonlar uyarı gösterir; reklam test modunda denenebilir.
