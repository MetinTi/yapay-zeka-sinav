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
