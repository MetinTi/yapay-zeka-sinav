# Yapay Zeka Eğitimi & Sınav — geliştirme geçmişi

> Her günün sonunda kısa kayıt: ne eklendi, ne değişti, deploy, görev durumu.
> Kaynak kural: kök [`AGENTS.md`](AGENTS.md) → *Operasyonel ritim*.

---

## 2026-09-28

- **Sınıf sınavı V2:** Sunum konularından 10 sabit soru hazırlandı; başlangıç ve bitiş aynı soruları kullanır. Son kullanıcı kararıyla süre 10 dakikadır. İlk başlangıç puanı korunur; bitişte puan farkı ve açıklamalar gösterilir.
- **Katılımcı kaydı:** Ad soyad zorunlu; katılımcı kodu, tarayıcıda adla kod bulma ve yenilemede yanıt/süre koruma eklendi. Kayıtlar yalnız eğitmenin eriştiği özel Google tablosunda tutulur. Apps Script v15 yayımlandı; kayıt tekrarları, ad/kod çakışması ve başarısız e-posta yeniden denemeleri ele alındı. E-posta isteğe bağlıdır; gerçek e-posta teslimi test edilmedi.
- **Yayın:** `sinav2.metintiryaki.com` için Wix DNS bağlantısı ve Firebase özel alan adı tamamlandı. Son Hosting sürümü `766629d323b0b03d`; altı istemci dosyasının canlı hash eşitliği ve Chrome açılışı doğrulandı. Kullanıcının istediği iki kayıt açıklaması kaldırıldı; ad zorunluluğu ve kayıt davranışı değişmedi.
- **Kontroller:** Sekiz frontend testi, 12 backend kontrolü ve iki yeniden deneme senaryosu geçti. Gerçek tarayıcı/özel tablo testinde başlangıç 10, bitiş 20, fark +10 görüldü; 320/390 px yatay taşma yok. V1 `index.html` değişmedi. Bugünkü sonuçlar [V2 kaydında](docs/exam-v2.md) ve [kamuya uygun kontrol özetinde](qa/closeout-2026-09-28.json) ayrılmıştır.
- **HTTPS ve Hosting:** Geçerli sertifika, HTTP→HTTPS yönlendirmesi ve temiz gizli pencerede güvenli bağlantı doğrulandı. Normal Chrome profilinin önceki sertifika istisnası durumu uyarı veriyordu; tarayıcı verisi/katılımcı kaydı silinmedi. Boş varsayılan Firebase Hosting sitesi silinemediği için bırakıldı; aktif sınav sitesi korundu.
- **Gün sonu kapsamı:** V2 kaynakları, backend şablonu ve bu kayıt tek repo kapanışına alındı. Repo herkese açık olduğundan gerçek özel tablo kimliği, üretim backend yapılandırması ve özel QA kanıtları yerelde korundu. Mayıs'tan kalma mobil/çeviri taslakları bu kapanışa dahil edilmedi. PowerPoint'in ayrıntılı geçmişi Training projesine aittir. Kapanışta yeni yayın, plan değişimi veya ücretli servis açılmadı.

---

## 2026-05-19

- **Auth + reklam altyapısı:** Firebase Auth (Google / Apple), `AuthGate`, `LoginScreen`, `AdService` (modül sonu interstitial), `docs/FIREBASE_AUTH_ADS_SETUP.md`. AdMob test ID’leri ile geliştirme.
- **Firebase bağlantısı:** Proje `yapay-zeka-egitim-mt` — `flutterfire configure` tamamlandı; `firebase_options.dart` (`isConfigured=true`), `google-services.json`, `GoogleService-Info.plist` (Xcode’a eklendi), `.firebaserc`. iOS `Runner.entitlements` imzaya bağlandı. **Giriş için Console:** Google + Apple provider + Android SHA-1 + iOS `REVERSED_CLIENT_ID` (Google etkinleştirildikten sonra plist yenileme) bekliyor.
- **Modül 1 içerik revizyonu:** `lessons.json` — bölüm sırası düzeltildi; Turing Testi, karşılaştırma tablosu (madde), YZ alt alanları, yanlış anlamalar, 2 ipucu kutusu eklendi; süre `~6 dk okuma · ~10 dk toplam`, `estimatedMinutes: 10`.
- **Modül 1 quiz:** 9 sorunun `correctIndex` ve zorluk seviyeleri handbook cevap anahtarına göre düzeltildi; kesik şık metinleri tamamlandı.
- **Sınav havuzu:** `handbook-01-2`, `handbook-01-3` `correctIndex` düzeltildi.
- **Parser:** `handbook_to_lessons.py` — kalan başlığın `insert(0)` ile en üste düşmesi hatası giderildi (`append`).

---

## 2026-05-17

- **Handbook → mobil eğitim:** `docs/handbook_extracted.md` + `tools/handbook_to_lessons.py` → **17 modül** `mobile/assets/data/lessons.json`; görsel placeholder alanları; bölüm sonu **153 sınav sorusu** (modül başına 9).
- **Eğitim UI:** `lesson.dart` — `image`, `quiz` bölüm tipleri; `lesson_quiz_section.dart`, `lesson_quiz_sheet.dart`; modül sonu soruları **Modülü Tamamla** sonrası isteğe bağlı sheet; tamamlanınca **modül listesine dönüş** (sonraki modül otomatik açılmaz).
- **Ana sayfa:** Metin Tiryaki kutusu diğer butonlarla aynı formatta (sarı gradyan); “17 modül · handbook + sınav soruları”.
- **Mobil sınav (M3–M5):** `tools/build_exam_pool.py` → `exam_pool.json` (**111 havuz**: 60 web + 51 handbook); rastgele **20 soru**, 45 dk; `exam_start_screen`, `exam_screen`, `exam_result_screen`; `ExamApiService` → Apps Script submit + **e-posta**.
- **Gamification backlog:** Dashboard / XP / streak / rozet yol haritası `backlog.md`’e eklendi; **Firebase** (Supabase yok); onaylı ürün kararları K1–K6.
- **Marka temizliği (B1, W1):** Newfound kaldırıldı — `index.html`, `Code.gs`, `assets/app_logo.png`; GitHub Pages push; Apps Script deploy + `testManual` OK.
- **Dokümantasyon:** `docs/USERDOC-en-tr.md` (kullanıcı kılavuzu EN/TR).
- **Test:** `flutter analyze` / `flutter test` geçti.
- **UI — Educa kit (Figma Community):** Kullanıcı Figma linki + Home ekran referansı paylaştı; Inspect/export adımları anlatıldı.
- **Ana sayfa Educa düzeni:** `home_screen.dart` yenilendi — beyaz zemin, `#4A69FF` vurgu, karşılama + arama, yatay “Son çalışmalar” / “Önerilen modüller” kartları, hızlı erişim (sınav + site), alt navigasyon (Ana Sayfa · Modüller · Sınav). `app_theme.dart` Educa renkleri + açık AppBar. Latest News / ödeme / öğretmen akışı **yok** (ürün kararı). Modül ilerlemesi şimdilik tamamlandı/tamamlanmadı (0/1). Simulator testi kullanıcıya bırakıldı.

---

## 2026-05-16

- **Proje planı:** Mobil Flutter uygulaması (eğitim + sınav) için plan oluşturuldu; mevcut web sınavı (`index.html`) + Apps Script backend korunacak.
- **Tercihler netleşti:** Platform = Flutter mobil; sınav kilidi yok (eğitim isteğe bağlı); marka = **metintiryaki** (Newfound değil); eğitim = **12 modül** (Prompt ve ML ayrı genişletildi).
- **Plan sırası güncellendi:** Önce eğitim içeriği, sonra sınav modülü.
- **Faz 0 — Flutter iskelet:** `mobile/` oluşturuldu (`com.metintiryaki`, `yz_egitim_sinav`); `lib/app.dart`, `lib/config/app_theme.dart`, `lib/screens/home_screen.dart` — metintiryaki markalı ana sayfa (Eğitime Başla / Sınava Git); `tr_TR` locale; `url_launcher`.
- **Faz 1 — Eğitim içeriği:** `assets/data/lessons.json` — 12 modül tam metin (metin, madde listesi, sınav ipucu); `lib/models/lesson.dart`; `lesson_repository.dart`; `lesson_progress_service.dart` (`shared_preferences`); `lessons_list_screen.dart`; `lesson_detail_screen.dart` (Modülü Tamamla → sonraki modül).
- **Bağımlılıklar:** `shared_preferences`, `flutter_localizations`; `pubspec.yaml` assets tanımı.
- **Test:** `flutter analyze` temiz; widget testi ana sayfa butonları.
- **iOS / Xcode:** Kullanıcı `Runner.xcworkspace` yolu netleştirildi (`mobile/ios/`). `pod install` çalıştırıldı — `shared_preferences_foundation` modül hatası giderildi. Xcode “Use Version on Disk” uyarısı açıklandı.
- **Agent dosyaları:** `agents.md`, `history.md`, `backlog.md` oluşturuldu (FlowFit örnek alındı).
- **Eğitim stratejisi değişti:** Sınav odaklı içerik bırakıldı; **sıfırdan eğitim müfredatı** (v2). Hedef kitle: başlangıç + profesyonel; teknik/kod track **yok**; uzun format (15+ modül, tam gün) **yok**. ~10 modül × ~20 dk. `backlog.md` güncellendi (E10–E19 müfredat, M3–M5 ertelendi).
- **Modül 1 (v2) yazıldı:** `mobile/assets/data/lessons.json` — “Yapay Zeka Nedir, Neden Şimdi?”; sınav ipucu yok; pratik ve öz-değerlendirme bölümleri eklendi. Şu an listede yalnızca 1 modül.
- **Müfredat düzeltmesi:** Kullanıcı 12 modül / daha detaylı istedi; v2 plan 10 modüle indirilmişti — **12 modüle geri alındı** (Prompt ve iş hayatı ikiye bölündü; LLM + sohbet araçları ayrıldı). `backlog.md` güncellendi.
- **Logo ve ana sayfa:** Kullanıcı logosu `assets/images/app_logo.png`; ana sayfa üstünde görsel; `flutter_launcher_icons` ile iOS/Android uygulama ikonu güncellendi.
