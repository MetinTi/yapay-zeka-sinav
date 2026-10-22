# Yapay Zeka Eğitimi & Sınav — geliştirme geçmişi

> Her günün sonunda kısa kayıt: ne eklendi, ne değişti, deploy, görev durumu.
> Kaynak kural: kök [`AGENTS.md`](AGENTS.md) → *Operasyonel ritim*.

---

## 2026-09-28

- **Hosting repo kapanışı:** Kullanıcının sonraki “update docs and repo” talebiyle README, dağıtım belgesi, V2 işletim/açık iş listesi, Hosting hedefi ve kamuya uygun QA kaydı son durumla eşitlendi. Aşağıdaki yerel-only/bekleyen ifadeler önceki aşamaların kaydıdır; Hosting silme işi tamamlandı. Eski mobil/çeviri taslakları ve özel üretim dosyaları kapsam dışı kaldı. Yeni deploy yapılmadı.

- **İkinci Hosting sitesi silindi (22:05 TRT):** Kullanıcının açık talebiyle `yapay-zeka-sinav2-mt`, Firebase CLI üzerinden `yapay-zeka-egitim-mt` projesinden kalıcı olarak silindi. İşlem başarılı; Hosting listesinde yalnız ana site kaldı ve eski `yapay-zeka-sinav2-mt.web.app` adresi HTTP 404 döndü. Firebase Console üzerinde `sinav2.metintiryaki.com` ana siteye **Connected**; CNAME ana siteyi gösteriyor. Silme sonrası ana site ve özel alan adı HTTP 200, ana sayfa SHA256 değerleri eşit. Önceki bekleyen kayıtlar tarihçe olarak korunur. Bu işlemde yeni deploy, commit veya push yapılmadı.

- **Hosting birleştirme — son durum (yerel history kaydı):** `sinav2.metintiryaki.com` sitesi ana Firebase Hosting sitesi `yapay-zeka-egitim-mt` üzerine taşındı. Eski Hosting sitesi `yapay-zeka-sinav2-mt` silinecek; silme işlemi henüz tamamlandı sayılmıyor. 28 Eylül akşamı salt okunur kontrolde `sinav2` CNAME → `yapay-zeka-egitim-mt.web.app` ve HTTPS HTTP 200 doğrulandı. Önceki klon/sürüm ve altı dosya eşleşmesi aşağıdaki kayıtta korunur. Kullanıcının açık talebiyle bu ek yalnız yerelde tutulur; bu işlemde sınav projesine commit/push, deploy veya Hosting silme yapılmadı.

- **Hosting birleştirme (kapanış sonrası):** Kullanıcı ikinci Hosting sitesinin ana siteye taşınmasını ve silinmesini istedi. Revizyon 6 `f4c63895a7e7c5eb` olarak ana siteye klonlandı; altı dosya HTTP 200/SHA256 eşitliği doğrulandı. Wix `sinav2` CNAME ana siteye güncellendi; özel alan adı aktarımı ve eski site silme doğrulaması sürüyor. Kaynak değişiklikleri yerelde; yeni repo kapanışı istenmedi.


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

<a id="workflow-2026-10-20"></a>

## 2026-10-20 — Ortak agent akışı, kullanıcı önizlemesi ve toplu kapanış

- Kullanıcı 15 projeyi tek tek önizledi; tüm mevcut özel kuralların korunmasına ek olarak boş/tekrarlı/yanlış talimatların temizlenmesini ve subagentlarla çalışmayı açıkça yetkilendirdi. İlk hazırlık PR’ları önizlemeden önce açılmıştı; kullanıcı durdurunca yayınlama süreci kesildi. Sonraki açık toplu teslim talimatıyla devam edildi; bu kayıt tek başına inceleme veya merge kanıtı değildir.
- Taban: `dda4210d11b8dda2fd47198fe95883f3e7f2cd54`; görev dalı `docs/preserve-rules-workflow-20261020`. Yalnız ilgili doküman yolları izole worktree’de hazırlandı; başka görevlerin değişiklikleri stage edilmedi.
- Ortak backlog taraması (otomatik bütün backlog geliştirmesi değil), son-HEAD doğrulama/güvenlik/Codex kapısı, bulgu sınıflandırması, yetkili scoped deploy ve güvenli dal temizliği eklendi. İhtiyaç kadar subagent, her kaynak için EU bölge doğrulaması ve mobil projelerde MacBook iOS / Windows PC Android-Galaxy build ayrımı son kullanıcı kararlarıdır; mevcut kapsam, güvenlik, maliyet ve özel veri sınırları sürer.
- Boş şablon ve mobil/beş dil varsayımları güncel Türkçe V2 web kapsamından ayrıldı; eski mobil kayıtlar tarihsel kapsamda korundu.
- History/archive ayrımına kayıpsız geçiş yalnız P0 backlog işidir; bu görevde arşiv oluşturulmadı/taşınmadı.
- Yayın tablosu varsa public sürüm, paket numarası, aday/inceleme ve kaynak provenance ayrı kanıtlardır. Projenin önceki ürün kabul kayıtları bu doküman işiyle yeniden sertifikalandırılmadı. Aktarılan başka canlı kontrol, bu ajanın yönetim API’si sorgusu olarak sunulmaz; public Apple metadata sonucu yalnız ilgili projede arındırılmış JSON’a kaydedilir.
- Kapsam: doküman/instruction; uygulama kaynakları, yerel build, model indirmesi, runtime deploy, credential/security ayarı veya Store yazımı yapılmadı. Bu repoda sürümlenen GitHub Actions workflow’u bulunmadığı doğrulandı; mevcut olmayan zorunlu CI kapısı iddiası kaldırıldı. Son ilgili PR HEAD’i için hedefli yerel doğrulama, güvenlik ve tamamlanmış Codex incelemesi korunur; ileride yapılandırılan ilgili CI kontrolleri ayrıca geçmelidir. Son diff/kapsam, ID/korunan kural/bağlantı kontrolleri ve eklenen metin secret taraması; son commit’e bağlı güvenlik ve Codex sonuçları PR’da izlenir. Sonraki düzeltme yalnız etkilenen kontrol/incelemeyi yeniler; yapılmayan kontrol başarılı sayılmaz.

- Codex P2 `4319485096` doğrulandı: `qa/closeout-2026-09-28.json` önceki review-policy durumunu kaydeder ve Git ağacında `.github/workflows/` yoktur; bu tarihsel kayıt yeni inceleme kararını iptal etmez. AGENTS proje uyarlaması gerçek CI kullanılabilirliğiyle netleştirildi; CI yapılandırması veya branch protection değiştirilmedi.

<a id="main-protection-p0-2026-10-20"></a>

## 2026-10-20 — Main koruması P0 planı

- Salt okunur GitHub denetiminde korumasız `main` doğrulandı; `DOC-MAIN-PROTECTION-P0` açık P0 olarak [docs/WORKFLOW_BACKLOG.md](docs/WORKFLOW_BACKLOG.md) içine eklendi. Gerçek CI/Codex/PR ve bypass-risk planı kullanıcı onayına bağlıdır; koruma/yetki/CI ayarı veya runtime değişmedi, mevcut görev kimlikleri ve kabulleri korunur. Bu kayıt merge/inceleme başarısı değildir.


<a id="readme-snapshot-2026-10-22"></a>

## 2026-10-22 — README düzeni ve önceki içerik

Kullanıcının README inceleme ve sadeleştirme isteğiyle kök belge proje tanıtımı, yerel kullanım ve kaynak navigasyonuna ayrıldı. Önceki README aşağıda eksiksiz korunur; içindeki yayın, test, erişim ve sürüm ifadeleri önceki kayıtları anlatır ve bugün yeniden doğrulanmış sayılmaz. V1 kurulum/e-posta sorun giderme notları da tarihsel bağlamlarıyla bu kayıtta tutulur. Yerel mobil kaynakların repoya eklenmesi ayrıca yetkilendirildi; bu karar build, Store yayını, yeni özellik veya servis kurulum onayı değildir.

<details>
<summary>Taşınmadan önceki README — tam metin</summary>

# yapay-zeka-sinav

## Eğitim sınavı V2 — 28 Eylül 2026 / Revizyon 6

`v2/`, iki günlük Yapay Zeka Eğitimi için Türkçe sınıf değerlendirmesidir: **10 sabit soru, 10 dakika, her doğru 10 puan; ad soyad zorunlu**. Başlangıç ve bitiş aynı soruları kullanır. İlk başlangıç puanı korunur; bitiş sonucu ve puan farkı gösterilir.

- Eğitim adresi: https://sinav2.metintiryaki.com/ — `?asama=baslangic` veya `?asama=bitis`. Firebase alternatif adresi: https://yapay-zeka-egitim-mt.web.app/ . **Revizyon 6 / giriş metni sadeleştirmesi yayında:** `f4c63895a7e7c5eb` (ana siteye kopyalanan Revizyon 6); altı dosyanın canlı SHA256 eşitliği ve gerçek Chrome açılışı doğrulandı.
- Katılımcı kodu unutulursa adla **yalnız aynı tarayıcıdaki kayıtlar** aranır; bulunan kod kullanıcı tarafından seçilir. Farklı cihaz/alan adı arasında otomatik kurtarma yoktur. Yanıtlar ve kalan süre sayfa yenilendiğinde korunur.
- Kayıtlar özel eğitmen tablosuna yazılır; erişim yalnız eğitmenin hesabındadır. Katılımcı listesi herkese açık değildir.
- E-posta **isteğe bağlı ve ayrı bir işlemdir**; gerçek e-posta gönderimi/teslim testi yapılmadı. Sonuç JSON olarak indirilebilir.
- Apps Script V2 ek yolları 28 Eylül'de **v15** olarak yayımlandı. V1 davranışı korunuyor; V1 `index.html` ve mobil uygulama bu sınıf revizyonuyla değişmedi.
- Frontend 8 test; backend 12 temel kontrol ve 2 yeniden deneme senaryosu geçti. Yerel gerçek tarayıcıda başlangıç **10**, bitiş **20**, fark **+10**; ad/kod kurtarma, yenileme ve sunucu kayıt yanıtı doğrulandı. Ayrıntı ve yayın kanıtı: [V2 teslim kaydı](docs/exam-v2.md).

Bu GitHub deposu herkese açıktır. Gerçek `apps-script/V2.gs`, özel tablo kimliği, katılımcı kayıtları ve ekran kanıtları Git'e alınmaz; kamuya uygun backend şablonu `apps-script/V2.template.gs` dosyasındadır. Yerel özel teslim kaydı korunur. Önceki mobil/çeviri taslakları bu V2 kapanışının kapsamı değildir.

HTTPS sertifikası geçerlidir; 28 Eylül kontrolünde Chrome'un eski sertifika uyarısı oturum durumuna ayrıştırıldı ve temiz gizli pencerede güvenli bağlantı doğrulandı. 28 Eylül akşamı kullanıcı kararıyla Revizyon 6 ana Hosting sitesi `yapay-zeka-egitim-mt` üzerine kopyalandı. `sinav2.metintiryaki.com` CNAME hedefi ana siteye alındı; özel alan adı ana sitede Connected olarak doğrulandı. Eski `yapay-zeka-sinav2-mt` sitesi silindi (22:05 TRT); eski adres HTTP 404, ana site ve özel alan adı HTTP 200 dönüyor.

Yerel açılış: `python3 -m http.server 4179 --bind 127.0.0.1 --directory v2`

V2 yayını: `firebase deploy --only hosting --config firebase.v2.json --project yapay-zeka-egitim-mt`

Bu sınıf sürümü mobil ürünün çok dilli geliştirme kapsamından ayrıdır. Aşağıdaki genel Apps Script kurulum/e-posta yönergeleri önceki V1 hattını anlatır; V2 ek dosya ve yolları için teslim kaydını kullanın.

**Yapay Zeka Eğitimi — Online sınav** (statik sayfa + Google Apps Script + Google Sheets).

> **FlowFit ile ilgisi yok.** Bu depo, FlowFit mobil uygulamasından bağımsız ayrı bir projedir (eğitim sınavı / sonuç e-postası / tablo kaydı). FlowFit kodu veya lisansları bu repoda yoktur.

---

## Google Apps Script Kurulum

1. `apps-script/Code.gs` dosyasındaki kodu Apps Script projesine yapıştırın.
2. `SPREADSHEET_ID` ve `RESULTS_SHEET_NAME` değerlerini kontrol edin.
3. `Deploy > Manage deployments > Edit` ekranında:
   - `Execute as`: **Me**
   - `Who has access`: **Anyone**
4. Deploy sonrası oluşan `/exec` URL'sini:
   - `index.html` içindeki `SCRIPT_URL` değişkenine yazın;
   - aynı bilgileri **`DEPLOYMENT.md`** dosyasına kopyalayın (bir sonraki deploy’da neyin aktif olduğunu unutmamak için).
5. **(Önerilir)** `apps-script/appsscript.json` içeriğini projede manifest olarak ekleyin: **Project Settings** (dişli) → **Show "appsscript.json" in editor** açık olsun → sol dosya listesinde `appsscript.json` oluşturup repodaki JSON’u yapıştırın. Böylece Gmail/Sheet izinleri net talep edilir.
6. Apps Script'te `testManual()` çalıştırın; ilk çalıştırmada **izin ekranı** gelirse aşağıdaki **“The script does not have permission…”** başlığındaki adımlarla **Allow** verin. Sonra logda `{status:"ok"}` ve `emailSent: true` hedeflenir.

Not: `Execute as: User accessing the web app` seçilirse, diğer kullanıcılar Sheet/Mail yetkisi olmadığı için sonuçlar yazılamayabilir.

## E-posta gitmiyorsa

1. **Apps Script’te güncel `Code.gs`’i yapıştırıp yeniden deploy edin** (Manage deployments → Edit → Version: New version → Deploy). Eski sürüm çalışıyor olabilir.
2. **Gönderen adres (`from`)**: Kod artık `GmailApp.sendEmail` içinde **`from: SENDER_EMAIL` kullanmıyor**. Google, Gmail’de “Bu adres adına gönder” (Send mail as) doğrulanmamış bir adresle `from` kullanımında çoğu zaman hata verir; böylece **hiç mail çıkmaz**. Şu an gönderen, deployment’ı çalıştıran Google hesabıdır; yanıtlar `replyTo: metin@metintiryaki.com` ile gelir. “Gönderen” satırında mutlaka `metin@metintiryaki.com` görünsün istiyorsanız: Gmail → Ayarlar → Hesaplar → “Başka bir e-posta adresinden gönder” ile adresi doğrulayın; ardından isterseniz `Code.gs` içinde tekrar `from: SENDER_EMAIL` ekleyebilirsiniz.
3. **Kota**: Ücretsiz hesapta günlük Apps Script / Gmail kotası dolmuş olabilir. Ertesi gün deneyin veya [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas) sayfasına bakın.
4. **Tablo sütunu**: `Sonuclar` sayfasında son sütunda `ERR: ...` yazıyorsa tam hata mesajı orada; `testManual()` çalıştırıp **Execution log**’a da bakın.
5. **Yetkilendirme**: Script ilk çalıştırmada Gmail izni istemiş olmalı; izin iptal edildiyse yeniden yetkilendirin.

### “The script does not have permission to perform that action” (mail)

Bu hata **kod hatası değil**; Google hesabı `GmailApp` / `MailApp` için **OAuth izni vermemiş** (veya token eski/kısıtlı) demektir.

**A) “Authorization required” / “Review permissions” çıkıyorsa**

1. **Review permissions** → hesabı seç → **Advanced** → **Go to … (unsafe)** (kendi projen) → **Allow** (Gmail + Sheet + Mail).

**B) Ekranda hiç izin penceresi çıkmıyorsa (senin ekran)**

Google bazen **pencere göstermeden** bu hatayı yazar. Çoğunlukla: daha önce sadece **Sheet** onaylanmış, **mail kapsamları hiç tokena eklenmemiş**; veya eski token takılı kalmış.

1. **Manifest:** Project settings → **Show "appsscript.json" in editor** → repodaki `apps-script/appsscript.json` **aynen** yapıştır → Kaydet.
2. **Kodu güncelle:** Repodaki `Code.gs` içindeki **`authorizeMailScopes`** fonksiyonu projede olsun (tüm dosyayı yapıştırmak en kolayı).
3. **Eski izni sil:** https://myaccount.google.com/permissions → **Google Apps Script** (veya ilgili) erişimini **Kaldır**.
4. Editörde **`authorizeMailScopes`** seç → **Run** → bu kez çoğu kullanıcıda **izin ekranı gelir** → **Allow**.
5. Ardından **`testManual`**.

**Workspace (kurumsal) hesap:** Yönetici Gmail/Apps Script’i kısıtladıysa pencere hiç gelmez veya Allow sonrası yine bloklanır — IT gerekir.

Projeye **`appsscript.json`** eklemediysen mail kapsamları hiç talep edilmemiş olabilir; mutlaka **B** adımlarını uygula.

</details>


## 2026-10-22 — Yerel kaynakların sürümlenmesi

- Kullanıcı yerel mobil/eğitim/tasarım/araç/brief kaynaklarının uygun içeriklerinin public repoya eklenmesini ve README'nin sadeleştirilmesini yetkilendirdi; önceki V2 kapanışındaki yerel mobil kapsam dışı kararı bu aktarım için aşılmıştır. Yeni build, Store yayını, runtime deploy veya servis kurulumu yapılmadı.
- README tanıtım/çalıştırma/kaynak dizinine dönüştürüldü; özgün README tarihli kayıtta korundu. Mobil backlog tarihsel karar ve kabul sınırlarıyla eklendi; workflow P0 işleri ayrı kaldı.
- Gerçek mobil Firebase istemci yapılandırmaları ignore edilerek yerelde korundu; yapılandırılmamış public örnek ve kurulum notu eklendi. Build/önbellek dosyaları Git dışında kaldı.
- Flutter 3.47.2 / Dart 3.13.2 ile `flutter pub get` eski yerel SDK çözümlemesini yeniledi; `pubspec.lock` güncellendi. `flutter analyze --no-pub` temiz. Eski ana sayfa beklentisi mevcut AuthGate başlangıcına uyarlanmış widget testiyle değiştirildi; `flutter test --no-pub` 1 test geçti. Bu yerel kontroller Firebase oturumu, cihaz veya Store kabulü değildir.
- Public eklenecek 254 dosya üzerinde Gitleaks taramasındaki 5 uyarı `mobile/ios/Podfile.lock` içindeki SPEC CHECKSUMS değerleridir; anahtar değil, bağımlılık bütünlük hashleridir. Diğer gerçek istemci anahtarları stage dışında kaldı. Python AST/JSON ayrıştırma ve `git diff --cached --check` geçti. Web ön yüz/backend hedefli kontrolleri geçti; gerçek ağa/e-postaya çıkılmadı.
- Son kaynak incelemesinde kurulum rehberinin FlutterFire'ın projeye özel `isConfigured` alanını ürettiği iddiası düzeltildi: CLI çıktısına alanın yerelde elle eklenmesi gerektiği ve public örneğin `false` kalacağı açıklandı. Runtime/auth davranışı değiştirilmedi.


<a id="main-protection-2026-10-22"></a>

## 2026-10-22 — Main koruması ve agent kurallarının düzenlenmesi

- Kullanıcı CI kullanılmadığını, Codex ve güvenlik incelemesinin yeterli olduğunu belirterek main korumasının uygulanmasını açıkça yetkilendirdi. Subagent, aktif ve main'e özel ruleset `25666505` oluşturdu; bağımsız ruleset GET ve `/rules/branches/main` okumalarında `pull_request`, `non_fast_forward`, `deletion` kuralları doğrulandı. Bypass listesi boş; mevcut yönetici `current_user_can_bypass=never`.
- Tek-maintainer kilitlenmesini önlemek için required approving review sayısı 0, codeowner/last-push approval kapalı; stale review dismissal ve review thread resolution açık. CI/status gate eklenmedi. Son ilgili PR HEAD'inde tamamlanmış Codex ve güvenlik incelemesi manuel gerekliliktir; GitHub otomatik review garantisi değildir. [Ruleset](https://github.com/MetinTi/yapay-zeka-sinav/rules/25666505).
- Kullanıcı AGENTS tekrarlarının birleştirilmesini, başlıklara göre gruplanmasını, çelişkilerin son kararlarla çözülmesini ve eski maliyet dosyası kullanımının kaldırılmasını yetkilendirdi; 20 USD ön onay sınırı ve özel erişim/güvenlik kuralları korunur. Kullanıcı beyanıyla mağaza şifre/anahtarlarının Google Drive kök klasöründe tutulduğu yalnız konum bilgisi olarak kaydedilir; anahtarlar okunmadı/aktarılmadı. Eski maliyet dosyası yerelde korunur ve Git takibinden çıkarılır.
- Temiz `git archive` kopyasında gerçek Firebase dosyaları olmadan public örnekle `flutter pub get`, `flutter analyze --no-pub` ve widget testi geçti. Temiz SDK çözümlemesiyle kilit dosyası uyumlandı; ardından `flutter pub get --enforce-lockfile` geçti.


<a id="backlog-audit-2026-10-22"></a>

## 2026-10-22 — Backlogun kaynak ve kararlarla uzlaştırılması

- Kullanıcının “update docs and repo” isteğiyle mobil/web backlogunun tamamı mevcut kaynaklarla karşılaştırıldı; tüm backlogu uygulama, mobil build, servis kurma, canlı veri okuma veya yayın yetkisi çıkarılmadı. Özgün backlog aşağıda eksiksiz tutulur; aktif dosya açık işleri, kararları ve geçmişe bağlantılı tamamlanmış/iptal kayıtlarını ayırır. Ayrı geçmiş arşivi oluşturulmadı; `DOC-HISTORY-ARCHIVE-P0` açık kalır.
- Kaynak: 17 eğitim modülü; 111 havuzdan 20 soru ve 45 dakika; ders listesi/detay/quiz/sınav ekranları, Google/Apple/e-posta Auth, profil ve yerel bildirim ayarları mevcut. Bunlar eski “profil henüz yok”, “M16 çan yalnız SnackBar” ve “M14 login uygulanmayacak” ifadeleriyle uzlaştırıldı: kaynak varlığı kaydedildi; ürün kararı ve cihaz kabulü tamamlandı sayılmadı. M14 çatışması ürün kararı bekler; Auth kaldırılmadı veya yeni özellik yetkilendirilmedi. G25/G29 eski Educa/Material tercihi ile güncel tasarım token/ikon kuralı arasındaki kabul işi de açık tutuldu.
- `LessonProgressService` yalnız tamamlanan ders ID'lerini saklar; M15 ince ilerleme/son okunan açık. XP/streak/rozet/leaderboard/Firestore/FCM kodu doğrulanmadı; G1–G23, G31–G35/G40 plan kapsamı korundu. Auth kaynağı G30'u cihaz/Console kabulüne dönüştürmez. Çeviri scripti, locale assetleri ve ARB dosyaları bulunmadı; L1–L7 ayrı, ertelenmiş mobil plan olarak korundu. K7 model seçimi yeni ücretli çalıştırma öncesi güncellik ve onay kontrolü gerektirir; çeviri çalıştırılmadı.
- Eski 12 modül taslağı ve E20 onayı, K1 ile 17 modüle geçişten önceki tarihsel kararlardır; E22/E24/E2 iptalleri ve E23 ile eski E1 sınav odaklı kapsamın yerine geçme kararı korunur. Güncel E1 eğitim metni/mini quiz geliştirmesi ve E21 içerik kalite işi açık kalır; E23 yalnız eski sınav odaklı E1 kararını aşar. G18 Faz 3, G35 Faz 3+ ertelenmiştir. Risk kabulü varsayılmadı.
- PR [#5](https://github.com/MetinTi/yapay-zeka-sinav/pull/5), 22 Ekim 2026 21:56:37 TRT'de `main` dalına `bb65dada9d2c0b7148b76b93499f34178e75cf2d` olarak birleşti. İncelenen son PR HEAD'i `aca3133e8c77a686932f545879ba42217862efbf`; [Codex/güvenlik inceleme kaydı](https://github.com/MetinTi/yapay-zeka-sinav/pull/5#issuecomment-6348796646). Önceki kaynak aktarımında kaydedilen Flutter analyze/widget ve web kontrol sonuçları burada yeniden çalıştırılmış veya canlı yayın kabulü gibi sunulmaz.
- App Store, Google Play ve Galaxy sürüm/yayın bilgisi bu kapanışta sorgulanmadı. V2 yayını 28 Eylül kanıtıdır; yeni canlı kontrol veya deploy yapılmadı. V2 e-posta teslimi, V1 Sheet onarımı, mobil ürün kararlarının uzlaştırılması, cihaz/Store kabulü ve geçmiş arşivi P0 işi açık kalır.

<details>
<summary>22 Ekim 2026 kapanışı öncesindeki backlog — eksiksiz özgün kayıt</summary>

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

</details>

<a id="workflow-closeout-2026-10-22"></a>

## 2026-10-22 — Çalışma akışı backlogunun kapanışı

Main korumasının tamamlanan planı aktif listede tarihli tek cümle ve kanıt bağlantısına indirgenir; özgün plan, kabul ölçütleri ve önceki korumasız durum kaydı aşağıda eksiksiz korunur. Kullanıcının 22 Ekim CI kullanmama kararı geçerlidir; son HEAD Codex/güvenlik incelemesi ve hedefli yerel doğrulama süreç koşuludur. `DOC-HISTORY-ARCHIVE-P0` açık kalır; bu kayıt arşiv geçişi başlatmaz.

<details>
<summary>22 Ekim 2026 kapanışı öncesindeki WORKFLOW_BACKLOG — eksiksiz özgün kayıt</summary>

# Agent çalışma düzeni — görev backlogu

## P0 — Main dalı koruması

- [x] **DOC-MAIN-PROTECTION-P0 · P0 — Main korumasını kullanıcı onayına hazırla:** **2026-10-20 02:46:24 +0300 (Europe/Istanbul)** salt okunur GitHub denetiminde `main` korumasız (`protected=false`, etkin kurallar/ruleset boş, klasik koruma HTTP404). Depoya uygun PR zorunluluğu, doğrudan push/force-push/main silmeyi engelleme, admin/bypass istisnaları ve acil kurtarma planını değerlendir; somut ayar önizlemesini kullanıcıya sun. Bu repoda sürümlenen `.github/workflows/` yok; olmayan CI adını zorunlu kontrol diye seçme. Gerekli gerçek CI ve uygulanabilir Codex kapısını önce ayrı onaylı kapsamda hazırlayıp son PR HEAD’inde çalıştığını doğrula. Son ilgili PR HEAD’i için hedefli yerel doğrulama, güvenlik ve tamamlanmış Codex incelemesini koru; yorum/emoji veya NEUTRAL/atlanan sonuç gerçek başarılı CI yerine geçmez. Tek-maintainer/reviewer yetkisini ve PR birleşmesinin kilitlenmemesini değerlendir. Kabul: somut plan kullanıcıca onaylanır; ancak ayrı yetkili uygulama görevinde ayarlar etkinleştirilip API’den okunarak ve main’e yıkıcı deneme yapmadan izin/veri koruma yollarıyla doğrulanır. **Bu backlog işinde koruma, yetki, CI veya deployment ayarı değiştirilmedi.**

Bu çalışma akışı kaydı P0 işleri izler. 20 Ekim belge PR’ına alınmayan yerel mobil backlog ve kaynaklar, kullanıcının 22 Ekim 2026 ayrı yetkisiyle sürümlenmiştir; [mobil backlog](../backlog.md) ayrı ürün kapsamıdır.

- [ ] **DOC-HISTORY-ARCHIVE-P0 · P0 — Kısa geçmiş / ayrıntılı arşiv:** `history.md` içinde tarihli tek cümle ve arşiv bağlantısı; `history_archive.md` içinde ayrıntılı kanıt/karar/eski kayıt düzenine kayıpsız geç. Mevcut kayıt, ID ve bağlantıları koru; eski bekleyen işi güncel görev sanma. Kabul: tüm eski kayıtların korunumu ve bağlantı kontrolü; bu görevde taşıma yapılmaz.

## Tamamlanan çalışma akışı işleri

- **DOC-MAIN-PROTECTION-P0 · 22 Ekim 2026:** Kullanıcının açık uygulama yetkisiyle [main ruleset #25666505](https://github.com/MetinTi/yapay-zeka-sinav/rules/25666505) etkinleştirildi; PR zorunluluğu, force-push/silme engeli ve boş bypass listesi API'den doğrulandı; CI/status gate yok, son HEAD Codex ve güvenlik incelemesi manuel süreçtir. [Kanıt ve karar](../history.md#main-protection-2026-10-22). Yukarıdaki özgün plan geçmiş bağlamı için korunur; ayrı plan onayı bekleme durumu son uygulama yetkisiyle tamamlanmıştır.

</details>


<a id="account-local-review-2026-10-22"></a>

## 2026-10-22 — PR #5 sonrası yerel hesap verisi bulguları

- Kullanıcı, PR #5 sonrası P1 hesap silmede ilerlemenin kalması ve P2 hesaplar arasında profil/ilerleme karışması bulgularını iletti. Kaynakta ikisi de doğrulandı: `clearLocal` yalnız ad/soyad/avatar temizliyordu; profil ve `completed_lesson_ids` anahtarları globaldi. Önceki kaynak aktarımı incelemesi bu kusurları yakalamamıştır; önceki PASS kaydı bu sonradan doğrulanan kusurları geçersiz kılmaz.
- Etki: ortak cihazda ikinci hesap öncekinin ad/avatar/ilerlemesini görebilir; başarılı hesap silmede yerel ilerleme kalır. Ayrıca tek avatar dosyası ve yerel hatırlatıcı ayarları aynı hesap sahipliği açısından değerlendirildi. Gizlilik metni değiştirilerek sorun gizlenmez; düzeltme uygulama verisi sahipliğinde yapılır.
- Kapsam: kullanıcı UID'sine göre yerel veri ayırma ve başarılı silme sonrasında ilgili hesabın yerel durumunu temizleme; gerçek Firebase hesabı/verisi silinmez, yetki/güvenlik ayarı veya mağaza yayını yapılmaz. Hedefli regresyon testleri ve son ilgili HEAD Codex/güvenlik incelemesi tamamlanmadan düzeltme kapanmış sayılmaz. [Kullanıcının ilettiği inceleme konusu](https://github.com/MetinTi/yapay-zeka-sinav/pull/5#discussion_r4352314058).
- Düzeltme: profil/ilerleme/avatar ve hatırlatıcı anahtarları UID kapsamında tutulur; UID asenkron işlemden önce yakalanır. Silme, yakalanmış UID için Firebase silmesi başarılı olduktan sonra hatırlatıcıyı ve yerel verileri temizler; sağlayıcı çıkış hatası temizliği atlatmaz. Firebase silmesi başarısızsa yerel durum korunur. UID bazlı iç navigator hesap değişiminde açık özel ekranları kaldırır; sistem geri tuşu da korunur.
- Geçiş kararı: eski global anahtar/avatar/hatırlatıcı kayıtlarının sahibi doğrulanamadığından ilk hazırlıkta temizlenir, ilk giriş yapan hesaba taşınmaz. Önceki yerel profil/ilerleme/hatırlatıcı tercihleri yeniden girilmek zorunda kalabilir; yeni UID kapsamındaki başka hesap verileri korunur. Bu görevde gerçek cihaz veya hesap üzerinde temizlik çalıştırılmadı.
- Son kaynaklarla temiz public kopyada Flutter 3.47.2 / Dart 3.13.2 `flutter analyze --no-pub` temiz, `flutter test --no-pub` **10/10** geçti (mevcut widget + UID izolasyonu, asenkron UID yakalama, avatar ayrımı/silme, başarılı/başarısız uzak silme, sağlayıcı hatası, eski verinin temizliği, hatırlatıcı geçişi ve sistem geri tuşu/özel ekran sıfırlama). Firebase/sağlayıcı silme ve bildirim platform çağrıları test çiftleriyle temsil edildi; gerçek ağ/hesap silme veya bildirim teslimi yok. Kurulum kilidi aynı public kopyada `pub get --enforce-lockfile` ile doğrulandı; bağımlılık değişmedi.
