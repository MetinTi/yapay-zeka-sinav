# Yapay Zeka Eğitimi — mobil kaynaklar

Flutter eğitim ve değerlendirme uygulamasının kaynak çalışmasıdır. Canlı Türkçe V2 sınıf sınavı kökteki `v2/` dizinindedir; bu dizinin Git'e eklenmesi mobil yayın veya cihaz kabulü anlamına gelmez.

## Yerel hazırlık

- Flutter/Dart sürümünü `pubspec.lock` içindeki SDK sınırlarıyla eşleştir. Bu aktarımda Flutter 3.47.2 / Dart 3.13.2 kullanıldı; `flutter --version` ile kontrol et.
- `flutter pub get` çalıştır.
- `lib/firebase_options.dart.example` dosyasını `lib/firebase_options.dart` olarak kopyala. Firebase kullanacaksan kendi istemci yapılandırmanı yerelde tamamla; Android `android/app/google-services.json` ve iOS `ios/Runner/GoogleService-Info.plist` dosyaları Git dışında kalır. FlutterFire ile yeniden üretirsen projeye özel `isConfigured` alanını sınıfa elle ekle (gerçek yapılandırmada `true`); CLI bu alanı üretmez. Ayrıntı: [Firebase/Auth/reklam kurulum notları](../docs/FIREBASE_AUTH_ADS_SETUP.md).
- `flutter analyze` ve `flutter test` ile doğrula. Firebase örneğinde `isConfigured = false` olduğundan gerçek yapılandırma olmadan oturum açma kapalıdır.

İstemci Firebase/Auth ve AdMob entegrasyon kodu içerir; bu aktarım yeni servis kurulumu, erişim değişikliği veya reklam yayını yapmaz. Masaüstü/web klasörleri Flutter iskeletidir; Firebase yapılandırması yalnız Android/iOS içindir.

## İçerik ve takip

- [Mobil ürün backlogu](../backlog.md): eski karar ve planlar korunur; tamamlandı işaretleri güncel cihaz/Store kabulü sayılmaz.
- [Eğitim taslağı](../ai-education.md), `assets/data/lessons.json`, `assets/data/exam_pool.json`.
- [İçerik araçları](../tools/) ve [referans brief](../yz-akademi-cursor-brief/).

Mobil build, Store upload ve yayın ayrıca yetki gerektirir. iOS release yalnız MacBook; Android/Galaxy release paketleri yalnız Windows PC üzerinde hazırlanır.
