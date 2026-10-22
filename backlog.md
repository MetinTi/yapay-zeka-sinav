> **22 Ekim 2026 — kaynak aktarımı:** Bu belge mobil ürünün tarihsel kararlarını ve açık işlerini korur; tamamlandı kayıtları bu aktarımda yeniden cihaz/Store doğrulamasından geçirilmedi. Güncel web V2 için [README](README.md), çalışma akışı P0 işleri için [WORKFLOW_BACKLOG](docs/WORKFLOW_BACKLOG.md).
>
> | Dağıtım | Bu aktarımın kanıtı |
> |---|---|
> | App Store | Konsol sorgulanmadı; sürüm/yayın doğrulanmadı |
> | Google Play | Konsol sorgulanmadı; sürüm/yayın doğrulanmadı |
> | Galaxy Store | Konsol sorgulanmadı; sürüm/yayın doğrulanmadı |
>
> Eski özel teslim kaydı `docs/exam-v2-2026-09-28.md` public repoda bulunmaz; kamuya uygun karşılığı [docs/exam-v2.md](docs/exam-v2.md).

# Yapay Zeka Eğitimi & Sınav — Backlog

- [x] **HOST-20260928 · P1:** Ana Hosting sitesine taşıma ve ikinci siteyi silme tamamlandı (28 Eylül 22:05 TRT). Firebase alan adı ana sitede Connected; eski site silindi, listede yalnız ana site var ve eski URL HTTP 404. Ana site/özel alan adı HTTP 200 ve ana sayfa hash eşitliği doğrulandı.

- [x] **EXAM-V2-CLOSEOUT · P1:** 28 Eylül V2 günlük kaydı ve public repo için güvenli kaynak kapsamı hazırlandı; özel üretim yapılandırması/QA ve eski mobil taslaklar yerelde korunur. Kamuya uygun kayıt: `docs/exam-v2.md`.
- [ ] **EXAM-V2-MAIL · P2:** İsteğe bağlı e-posta teslimi henüz doğrulanmadı; kabul: kullanıcının yetkilendirdiği alıcıya bir deneme ve gelen kutusu kontrolü. Mevcut V2 sınıf akışını engellemez.
- [ ] **EXAM-V1-SHEET · P2:** Eski V1 tablo bağlantısı onarım gerektiriyor; bu çalışma V2 özel tablo kurulumundan ayrıdır.

- [x] **EXAM-V2-REV6 · P1:** 10 dakika, zorunlu ad, kod kurtarma ve özel eğitmen tablosu yayımlandı; 8 ön yüz testi, backend/yeniden deneme kontrolleri, 10/20/+10 gerçek Sheet kaydı, özel erişim ve 6/6 canlı kaynak eşitliği doğrulandı.

- [x] **EXAM-V2-20260928 · P1:** Sunuma bağlı 10 soruluk / 8 dakikalık V2 `sinav2.metintiryaki.com` adresinde yayımlandı; ön/son karşılaştırma, iki QR, PowerPoint açılışı, geçerli HTTPS ve gerçek tarayıcıda ana/başlangıç/bitiş ekranları doğrulandı. Ayrıntı: [teslim kaydı](docs/exam-v2-2026-09-28.md).

> **Kural (kesin):** Buradaki hiçbir madde silinmeyecek. Yapılanlar işaretlenir (`DONE`, ~~üstü çizili~~, tarih) ve **listeden çıkmaz**.

> Son güncelleme: 2026-05-19 (lokalizasyon kararı — backlog)

---

## Ürün kararları (onaylı — 2026-05-17)

| # | Karar | Durum |
|---|--------|--------|
| K1 | **17 modül** (handbook) — eğitim bu yapıda devam | **ONAY** |
| K2 | **Sosyal rozetler (G18)** | **ONAY** — Faz 3 / ertelendi |
| K3 | **Flashcard (G35)** | **ONAY** — kayıtlı, Faz 3+ (şimdilik yok) |
| K4 | **Newfound yok** — yalnızca Metin Tiryaki / metintiryaki.com | **ONAY** — B1, W1, e-posta şablonu |
| K5 | **Sınav yapısı** — mobil `exam_pool.json` (111 havuz → 20 soru) + Apps Script + e-posta; `examTags` / konuya göre sınav **yok** | **ONAY** |
| K6 | **İki backend** — sınav: Google Apps Script; gamification: Firebase | **ONAY** |
| K7 | **Çeviri motoru** — Google Cloud Translation Advanced (Neural) **kullanılmayacak**; batch çeviri **Gemini 2.5 Flash-Lite** | **ONAY 2026-05-19** |
| K8 | **Çeviri mimarisi** — statik cache: bir kez çevir → `lessons_{locale}.json`, `exam_pool_{locale}.json`, ARB; app içinde runtime çeviri API **yok** | **ONAY 2026-05-19** |

---

## Gamification & Dashboard (Faz 2 — yol haritası)

**Kaynak:** Kullanıcı yapılacaklar listesi + dashboard mockup (2026-05-17).\
**Ürün kararı:** Birincil istemci **Flutter `mobile/`**. Backend (sync, liderlik, auth) **Firebase** — Supabase kullanılmaz. Sınav sonuçları mevcut **Apps Script + Sheets** hattında kalır (B2).\
**Kaynak taslak uyarısı:** Orijinal listede Next.js / `app/ogren` / `app/profil` yolları vardı; bunlar **referans ekran adı** olarak kalır, uygulama `mobile/lib/screens/…` altında yapılır.

### DASHBOARD ekranı

| # | Madde | Detay |
|---|--------|--------|
| G1 | **Üst bar** | Kullanıcı adı + avatar + streak badge (🔥 X gün) |
| G2 | **3 metrik kartı** | XP, Seviye, Liderlik sırası |
| G3 | **Level progress** | İlerleme çubuğu + sonraki ünvana kalan XP metni |
| G4 | **Günlük hedef kartı** | 3 görev; tamamlananlar ✓ |
| G5 | **Rozet vitrini** | Son 4 kazanılan + kilitli rozetler |
| G6 | **“Devam et” kartı** | Son okunan bölüm + ilerleme % + kalan süre |

**UI referans:** Dashboard mockup — koyu tema, kart grid, mor vurgu, yeşil tamamlanan görevler.

### XP (deneyim puanı) sistemi

| # | Madde | Detay |
|---|--------|--------|
| G7 | **Aktivite → XP** | 10 dk okuma +20; quiz kolay +30 / orta +50 / zor +80; flashcard +5/kart; bölüm tamamlama +100; final sınav +500 |
| G8 | **Seviye eşiği** | Seviye başına gereken XP: `level * 500` (1→2: 500 XP; 8→9: 4500 XP) |
| G9 | **Seviye ünvanları** | 1–3 Veri Çırağı; 4–6 Algoritma Acemisi; 7–10 Sinir Ağları Çırağı; 11–15 ML Mühendisi; 16–20 YZ Ustası |

### Streak (seri) sistemi

| # | Madde | Detay |
|---|--------|--------|
| G10 | **Günlük aktivite** | Günde ≥1 aktivite → streak +1 |
| G11 | **Streak Freeze** | Haftada 1 ücretsiz — bir gün atlama hakkı |
| G12 | **Milestone XP** | 7 gün +50; 30 gün +200; 100 gün +1000 |
| G13 | **Yumuşak iniş** | Streak kırılınca: 14+ günse 7’ye geri; sıfıra inmez |

### Rozetler (48 toplam)

| # | Kategori | Örnekler |
|---|----------|----------|
| G14 | Streak | 7 / 30 / 100 / 365 gün |
| G15 | Bölüm | Her bölüm tamamlamada |
| G16 | Performans | Mükemmeliyetçi (3 quiz %100); Hızlı (quiz &lt;1 dk) |
| G17 | Keşif | Gece Kuşu (00:00–03:00); Erken Kalkan; Hafta Sonu Savaşçısı |
| G18 | Sosyal | İlk Yorum; 10 Arkadaş; Takım Kaptanı — **ONAY: Faz 3** (K2) |

### Bölüm listesi (mobil: `lessons_list_screen` / öğren sekmesi)

| # | Madde | Detay |
|---|--------|--------|
| G19 | **17 bölüm grid** | Her biri `ChapterCard`: ikon, başlık, dakika, ilerleme % |
| G20 | **Kilit (prerequisite)** | Önceki bölüm tamamlanmadan 🔒 |

### Profil (mobil: profil ekranı — henüz yok)

| # | Madde | Detay |
|---|--------|--------|
| G21 | **İstatistikler** | Toplam okuma süresi; tamamlanan bölüm; quiz başarı oranı |
| G22 | **Tüm rozetler** | Kazanılan + kilitli + ipuçları |
| G23 | **Ayarlar** | Bildirimler; günlük hedef; tema |

### Teknik stack — birincil (Flutter + Firebase)

| # | Katman | Seçim |
|---|--------|--------|
| G24 | **İstemci** | Flutter (`mobile/`) — Dart 3 |
| G25 | **UI** | Material 3 + `AppColors`; **çift referans:** Educa (açık, mavi `#4A69FF`) ana sayfa **DONE**; Faz 2 dashboard mockup (koyu, mor) — birleştirme kararı bekliyor |
| G26 | **Yerel state** | Service sınıfları (+ isteğe bağlı Riverpod); kaynak taslaktaki Zustand **kullanılmaz** |
| G27 | **Yerel persistence (MVP)** | `shared_preferences` + gerekirse Hive / `sqflite` |
| G28 | **Animasyon** | Flutter implicit / `AnimationController` (kaynak: Framer Motion **kullanılmaz**) |
| G29 | **İkonlar** | Material Icons / `cupertino_icons` |
| G30 | **Backend (Faz 2)** | **Firebase Auth** — kullanıcı oturumu |
| G31 | **Veri sync + liderlik** | **Cloud Firestore** — XP, streak, rozetler, leaderboard |
| G32 | **Push bildirim** | **Firebase Cloud Messaging (FCM)** — günlük hedef / streak hatırlatma |
| G33 | **Uzak yapılandırma (opsiyonel)** | Firebase Remote Config — günlük hedef, XP katsayıları (E3 ile uyumlu) |

### Kaynak taslak — uygulanmayacak (referans)

| # | Orijinal (liste) | Proje karşılığı |
|---|------------------|-----------------|
| G36 | Next.js + App Router | **Yok** — yalnızca Flutter mobil (+ mevcut `index.html` web sınav) |
| G37 | Tailwind + shadcn/ui | Flutter tema / widget’lar |
| G38 | IndexedDB + Dexie | G27 yerel depolama |
| G39 | next-pwa | Store dağıtımı (M8); ayrı PWA yok |

### Diğer gamification maddeleri

| # | Madde | Not |
|---|--------|-----|
| G34 | **Dashboard → Home veya tab** | ~~Alt navigasyon taslağı (Ana Sayfa · Modüller · Sınav)~~ **Kısmi DONE 2026-05-17** — yalnızca `HomeScreen`; gamification dashboard (G1–G6) ve profil sekmesi sırada |
| G35 | **Flashcard modülü** | **ONAY: Faz 3+** (K3) — XP kuralı hazır, özellik sonra |
| G40 | **Gamification ↔ Firebase sync** | Oturum açıkken Firestore; offline önce yerel (G27), sonra merge |

---

## Eğitim müfredatı v2 — sıfırdan (öncelik)

**Güncel durum (K1 ONAY):** **17 modül** `lessons.json` — handbook kaynak; devam ediyoruz. Aşağıdaki 12 modüllük v2 tablo **tarihsel taslak** (referans); aktif müfredat 17 bölüm.

**Kararlar (2026-05-16):**
- **Hedef kitle:** (a) tam başlangıç + (b) profesyonel iş kullanıcısı — kod/teknik eğitim **yok** (c yok).
- **Derinlik:** (a) kısa giriş + (b) orta derinlik — ~~**12 modül**~~ → **17 modül (handbook)** aktif; modül başı ~20–25 dk. **Uzun format yok** (tam gün, ağır ödev).
- **Sınav:** Eğitim içeriğine **göre hareket edilmez**; `examTags` / “sınav ipucu” kullanılmaz.
- **Eski `lessons.json` (12 modül, sınav özeti):** arşivlenir, v2 ile **değiştirilecek**.

| # | Modül | Süre | Odak |
|---|--------|------|------|
| E10 | **1. Yapay Zeka Nedir, Neden Şimdi?** | ~15 dk | ~~Mitler, günlük hayat, bağlam~~ **İÇERİK DONE** |
| E11 | **2. Kavramlar Sözlüğü** | ~20 dk | AI, ML, DL, LLM, üretken AI — kod yok, örneklerle |
| E12 | **3. Veri ve Dijital Okuryazarlık** | ~20 dk | Veri kalitesi, gizlilik, KVKK farkındalığı |
| E13 | **4. Büyük Dil Modelleri** | ~22 dk | Tahmin/üretim mantığı (basit), bağlam penceresi, sınırlar |
| E14 | **5. Sohbet Araçlarıyla Çalışmak** | ~22 dk | ChatGPT, Gemini, Copilot; hesap, gizlilik ayarları, iyi alışkanlıklar |
| E15 | **6. Prompt Yazmaya Giriş** | ~22 dk | Net talimat, rol, örnek; kötü/iyi prompt karşılaştırması |
| E16 | **7. Prompt ile İş Akışları** | ~25 dk | E-posta, özet, rapor, toplantı notu, sunum taslağı |
| E17 | **8. Görsel, Ses ve Video** | ~20 dk | Ne zaman hangi araç; telif, deepfake farkındalığı |
| E18 | **9. Pazarlama ve İletişimde AI** | ~22 dk | İçerik, sosyal medya, müşteri mesajları, marka sesi |
| E19 | **10. Eğitim ve Yönetimde AI** | ~22 dk | Ders/toplantı, karar desteği, verimlilik, ekip kullanımı |
| 11 | **Riskler ve Sorumlu Kullanım** | ~20 dk | Etik, halüsinasyon, KVKK, kurum politikası |
| 12 | **Araç Seçimi ve Yol Haritası** | ~20 dk | Kişisel araç seti; sonraki öğrenme adımları |

**İçerik yapısı (her modül):** giriş metni → ana bölümler → örnekler → “Pratikte dene” → modül sonu 2–3 öz-değerlendirme sorusu (cevaplı). **Sınav ipucu yok.**

| # | Madde | Not |
|---|--------|-----|
| E20 | ~~**Müfredat onayı**~~ **DONE 2026-05-16** → **12 modüle revize** | Kullanıcı geri bildirimi: 10 modül az; **12 modül** korunacak, daha detaylı |
| E21 | **17 modül içerik kalitesi** | Handbook aktarımı DONE (M9); parser/UI iyileştirme, görseller |
| E22 | ~~**examTags / sınav ipucu**~~ | **İptal (K5)** — kullanılmayacak |
| E23 | ~~E1 sınav odaklı genişletme~~ | **İptal** — v2 müfredat ile yerine geçti |
| E24 | ~~E2 soru–konu eşlemesi~~ | **İptal (K5)** — `exam_pool.json` + rastgele 20 soru |

---

## Çapraz kesim — agent / süreç

| # | Madde | Not |
|---|--------|-----|
| P1 | ~~**Agent ve proje kayıtları**~~ **DONE 2026-05-16** | `agents.md`, `history.md`, `backlog.md` oluşturuldu. |

---

## Mobil uygulama (`mobile/`)

| # | Madde | Not |
|---|--------|-----|
| M0 | ~~**Flutter proje iskeleti + ana sayfa**~~ **DONE 2026-05-16** | `flutter create mobile`; metintiryaki markası; Eğitime Başla / Sınava Git; tema `#1a5276` / `#2e86c1`. |
| M1 | ~~**12 modül eğitim içeriği (`lessons.json`)**~~ **DONE 2026-05-16** → **SUPERSEDED** | Sınav özeti taslağı; **v2 müfredat (E10–E19)** ile değiştirilecek. |
| M2 | ~~**Eğitim ekranları + ilerleme**~~ **DONE 2026-05-16** | Ders listesi, ders detay, tamamlanma rozeti; `shared_preferences`; sınavı kilitlemez. |
| M3 | ~~**Sınav — soru havuzu**~~ **DONE 2026-05-17** | `exam_pool.json`: 60 web + 51 handbook (17×3); rastgele 20. |
| M4 | ~~**Sınav ekranları**~~ **DONE 2026-05-17** | Başlangıç / sınav / sonuç; 45 dk; zorluk ağırlıklı puan. |
| M5 | ~~**Apps Script API entegrasyonu**~~ **DONE 2026-05-17** | `ExamApiService` → submit + e-posta; `exam_api_config.dart`. |
| M9 | ~~**Handbook → 17 modül**~~ **DONE 2026-05-17** | `lessons.json` + `handbook_to_lessons.py`; modül sonu quiz (isteğe bağlı sheet). |
| M10 | ~~**Educa UI — Ana sayfa**~~ **DONE 2026-05-17** | Figma: [Educa Community kit](https://www.figma.com/design/0eatV8JXuOsIAZIIzwDpkS/Educa---Education-Mobile-App-UI-kit-Figma--Community-); `home_screen.dart` + `app_theme.dart` (açık tema, alt bar). |
| M11 | **Educa UI — Modül listesi** | `lessons_list_screen.dart` — Educa kart/grid stili; ana sayfa ile görsel tutarlılık |
| M12 | **Educa UI — Ders detay + quiz** | `lesson_detail_screen`, quiz sheet — video/ödeme yok; handbook metin akışı |
| M13 | **Educa UI — Sınav ekranları** | `exam_start_screen`, `exam_screen`, `exam_result_screen` — aynı renk/spacing |
| M14 | **Educa — bilinçli dışlama** | Login, onboarding 3 adım, ödeme, wishlist, Latest News, öğretmen akışı — **uygulanmayacak** (K4, K5) |
| M15 | **Modül ilerlemesi (ince)** | Bölüm içi % / “son okunan” — `LessonProgressService` genişletme; ana sayfa kartlarında gerçek ilerleme |
| M16 | **Bildirimler (placeholder → FCM)** | Ana sayfa çan ikonu şimdilik SnackBar; **G32** ile değişecek |
| M17 | **Community lisans kontrolü** | Educa Figma kit — store öncesi ticari kullanım / atıf |
| M6 | **Cila — marka ve TR** | Logo DONE; eski ana sayfa (gradyan 3 kutu) **superseded** M10; kalan: `attemptHint` paritesi; Türkçe smoke test |
| M7 | **iOS pod / Xcode dokümantasyonu** | `pod install` sonrası workspace; `mobile/README.md` kısa iOS adımları (isteğe bağlı). |
| M8 | **Store hazırlığı** | İkon, splash, gizlilik metni — **IPA yalnızca kullanıcı istediğinde**. |

---

## Web sınav (`index.html`)

| # | Madde | Not |
|---|--------|-----|
| W1 | ~~**Newfound kaldır (K4)**~~ **DONE 2026-05-17** | `index.html` → `app_logo.png` + METİN TİRYAKI |
| W2 | **Soru havuzu tek kaynak (K5)** | Mobil: `build_exam_pool.py` → `exam_pool.json` **DONE**; web `index.html` hâlâ gömülü P dizisi — senkron script sırada |

---

## Backend (`apps-script/`)

| # | Madde | Not |
|---|--------|-----|
| B1 | ~~**Newfound kaldır — e-posta markası (K4)**~~ **DONE 2026-05-17** | Deploy + `testManual` OK; logo canlı: sinav.metintiryaki.com/assets/app_logo.png |
| B2 | **Deploy notları güncel tutma** | Her yeni Apps Script sürümünde `DEPLOYMENT.md` + `index.html` `SCRIPT_URL`. |

---

## Lokalizasyon & çeviri (Faz 2+ — henüz başlanmadı)

**Karar (2026-05-19):** Cloud Translation Advanced Neural **yok**; **Gemini 2.5 Flash-Lite** batch script ile çeviri. Maliyet hedefi: tek seferlik, düşük (TR kaynak ~204K karakter).

| # | Madde | Detay |
|---|--------|--------|
| L1 | **Çeviri script** | `tools/translate_content.py` — Gemini 2.5 Flash-Lite API; modül modül batch; JSON şema + quiz `correctIndex` doğrulama |
| L2 | **Terim sözlüğü (glossary)** | YZ terimleri: ML, NLP, transformer vb. — prompt’ta sabit; Modül 1 pilot → onay → kalan modüller |
| L3 | **Statik içerik dosyaları** | `lessons_en.json`, `exam_pool_en.json` (sonra DE/FR/ES); TR kaynak değişmez |
| L4 | **UI l10n (Flutter ARB)** | `flutter gen-l10n`: `app_tr.arb`, `app_en.arb`; login, home, profil, nav metinleri |
| L5 | **App locale yükleme** | Cihaz dili veya Profil’de dil seçici + `SharedPreferences`; `LessonRepository` / `ExamRepository` locale’e göre asset |
| L6 | **Maliyet kontrolü** | Runtime API çağrısı yok; yeni modül eklenince yalnızca o modül çevrilir |
| L7 | **Kalite kontrolü** | Modül başına insan gözden geçirme; isteğe bağlı DeepL spot-check (ana motor değil) |

**Hedef diller (AGENTS.md):** EN, TR, DE, FR, ES — TR kaynak; ilk hedef dil **EN**.

**Kullanılmayacak:** Google Cloud Translation Advanced (Neural) — ~$20/1M karakter; yapılandırılmış eğitim/quiz içeriği için uygun değil.

---

## Eğitim içeriği — iyileştirme (ileri)

| # | Madde | Not |
|---|--------|-----|
| E1 | **Modül içeriklerini genişletme** | Sunum notlarından daha zengin metin; modül başına mini quiz (ürün kararı). |
| E2 | ~~**Soru–konu eşlemesi (`examTags`)**~~ | **İptal (K5)** — tek havuz sınavı |
| E3 | **Uzak içerik (Faz 2)** | Firebase Remote Config veya Apps Script `action=lessons`; MVP’de yerel JSON yeterli. |

---

## Öncelik özeti (sıradaki iş)

1. **Educa UI (devam)** — **M11** modül listesi → **M12** ders detay → **M13** sınav ekranları (kullanıcı “sonra bakarız”)\
2. **Gamification Faz 2** — G1–G6 Dashboard + G7–G9 XP (**G25** tema birleştirme)\
3. **G10–G13** Streak + **G14–G17** Rozetler (G18 sosyal Faz 3)\
4. **G19–G20** Bölüm grid + kilit; **G21–G23** Profil\
5. **G30–G32** Firebase Auth + Firestore + FCM\
6. **E21** — 17 modül içerik kalitesi; **M6** cila; **W2** web havuzu senkronu\
7. **L1–L7** — Lokalizasyon (Gemini 2.5 Flash-Lite batch + statik JSON/ARB) — **henüz başlanmadı**
