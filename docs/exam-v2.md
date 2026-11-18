# Eğitim sınavı V2

Yayın ve kabul kanıtlarının tarihi **28 Eylül 2026**; 22 Ekim belge kapanışı bunları yeniden canlı doğrulama saymaz. Yayın adresi: https://sinav2.metintiryaki.com/ . Başlangıç için `?asama=baslangic`, bitiş için `?asama=bitis` kullanılır.

## Katılımcı akışı

10 sabit soru, 10 dakika, her doğru 10 puan. Başlangıç ve bitiş aynı soruları kullanır. İlk başlangıç puanı korunur; bitişte puan farkı ve kısa açıklamalar açılır. Sorular AI çıktısını denetleme, Python, istem, token, embedding, vektör veritabanı/RAG, kaynak doğrulama, prompt injection, veri politikası ve n8n/onay konularını kapsar.

Ad soyad zorunludur. Kod unutulursa yalnız aynı tarayıcı ve alan adındaki ad kayıtları aranır; birden fazla kod varsa katılımcı seçer. Farklı cihaz veya alan adları arasında otomatik kurtarma yoktur. Yanıtlar ve kalan süre yenilemede korunur. Bu sınıf değerlendirmesidir; istemcideki cevap anahtarı yüksek güvenlikli sınav koruması değildir.

Eğitmen özel Google tablosunda adı, kodu ve başlangıç/bitiş puanlarını görür. Sunucu `saved:true` dönmedikçe kayıt doğrulandı gösterilmez. Katılımcı listesini dışarı açan bir API yoktur. E-posta ayrı ve isteğe bağlı işlemdir; gerçek e-posta gönderimi/teslimi test edilmedi. JSON indirme alternatifi vardır. Kullanıcının istediği iki giriş açıklaması kaldırılmıştır; ad zorunluluğu ve kayıt davranışı korunmuştur.

## Kaynak ve kurulum sınırı

- `v2/`: Yayınlanan altı statik istemci dosyası. Uygulama paketi veya üçüncü taraf npm bağımlılığı yoktur.
- `apps-script/Code.gs`: V1 davranışı ve V2 yollarına yönlendirme.
- `apps-script/V2.template.gs`: Kamuya uygun backend şablonu. `V2.gs` olarak kopyalayıp özel eğitmen tablosu kimliğini yerel dosyada ayarlayın. Apps Script'e `Code.gs` ve yapılandırılmış `V2.gs` yüklenir; şablonu üçüncü dosya olarak eklemeyin.
- Gerçek `V2.gs`, özel tablo kimliği, katılımcı/ekran kanıtları ve ayrıntılı iç teslim kaydı Git'e alınmaz. Canlı v15 kaynağı yerelde korunur; repo şablonu yalnız tablo kimliği ve açıklama satırı bakımından farklıdır.
- Önceki mobil ve çeviri taslakları 28 Eylül V2 yayınının kapsamı değildir. 22 Ekim 2026 ayrı kaynak aktarımında Git’e alınmıştır; bu aktarım mobil build/yayın veya cihaz kabulü değildir. Bkz. [mobil kaynaklar](../mobile/README.md) ve [ürün backlogu](../backlog.md). Sunumun ayrıntılı geçmişi Training projesinde tutulur.

## Yayın ve doğrulama

| Alan | Sonuç |
|---|---|
| Firebase proje / site | `yapay-zeka-egitim-mt` / `yapay-zeka-egitim-mt` |
| 28 Eylül’de doğrulanan Hosting sürümü | `f4c63895a7e7c5eb` (Revizyon 6 klonu); altı dosya HTTP 200 ve yerel SHA256 ile eşit |
| Apps Script | v15; üretim kaynakları yerelde korunuyor |
| Frontend | 8 test geçti; soru, süre, ad/kod kurtarma, eski taslak, yenileme ve e-posta yanıt durumları |
| Backend | 12 temel mock kontrolü ve 2 yeniden deneme senaryosu geçti; ağ/e-posta isteği yok |
| Gerçek tarayıcı / tablo | Başlangıç 10, bitiş 20, fark +10; ad/kod seçimi, yenileme ve sunucu kayıt yanıtları doğrulandı |
| Özel tablo | Paylaşım yalnız eğitmende; anonim CSV erişimi HTTP 401 |
| Mobil web | 320 ve 390 px görünümde yatay taşma yok |
| V1 | `index.html` SHA256 değişmedi; bu V2 işi eski V1 tablo sorununun onarımı değildir |
| E-posta | Gerçek gönderim veya kutuda teslim doğrulanmadı |

[Makine tarafından okunabilir kapanış özeti](../qa/closeout-2026-09-28.json), [değişiklik geçmişi](../history.md).

Yerel testler:

```sh
node --test qa/participant-state.test.mjs
node qa/v2-backend.test.cjs
```

Dar yayın komutu:

```sh
firebase deploy --only hosting --config firebase.v2.json --project yapay-zeka-egitim-mt
```

Yayınlanan dizin yalnız `v2/` olur. Ders belgeleri, özel tablo içerikleri, QA dosyaları ve sunum bu Hosting paketine girmez. Gün sonu belge/repo kapanışı için çalışan sürüm yeniden yayımlanmadı; yeni plan, ücretli API veya worker açılmadı. Fiili fatura tutarı doğrulanmadı.

## HTTPS ve Hosting birleştirme

28 Eylül kontrolünde geçerli Google Trust Services sertifikası, TLS 1.3, HTTP 200 ve HTTP→HTTPS 301 yönlendirmesi doğrulandı. Normal Chrome oturumu daha önce izin verilmiş sertifika hatası durumunu taşıyordu; aynı adreste temiz gizli pencere güvenli bağlantı gösterdi. Tarayıcı verileri ve katılımcı kayıtları silinmedi; sertifika denetimi atlanmadı.

~~`yapay-zeka-egitim-mt` boş varsayılan site olarak bırakılmıştı; aktif sınav ikinci sitedeydi.~~ 28 Eylül akşamı kullanıcı tek Hosting sitesi istedi. Canlı sürüm ana `yapay-zeka-egitim-mt` sitesine klonlandı ve özel alan adının CNAME hedefi güncellendi. Özel alan adı ana sitede Connected olarak doğrulandıktan sonra eski `yapay-zeka-sinav2-mt` sitesi 22:05 TRT itibarıyla silindi. Hosting listesinde yalnız ana site kaldı; eski adres HTTP 404, ana site ve özel alan adı HTTP 200 dönüyor. [Firebase çoklu site açıklaması](https://firebase.google.com/docs/hosting/multisites).

## Açık işler ve tamamlanan Hosting görevi

- [x] **HOST-20260928:** Ana siteye taşıma, özel alan adı bağlantısı ve ikinci Hosting sitesinin silinmesi doğrulandı.
- [ ] **EXAM-V2-MAIL:** Gerçek e-posta teslim testi bekliyor.
- [ ] **EXAM-V1-SHEET:** Eski V1 tablo bağlantısı onarımı ayrı iş olarak bekliyor.

<a id="ozak-202612"></a>

## Özak Global Holding — Aralık 2026 ayrı sınavı

17 Kasım 2026 kullanıcı kararıyla Özak için **tamamen ayrı giriş, uygulama dosyaları ve Apps Script projesi** hazırlandı; aynı gün yayın ve gerçek eğitmen tablosuna bağlantı yetkisi verildi. Genel V2'nin altı dosyası ve mevcut Apps Script yayını değiştirilmez. Özak üstte eğitmenin uygulama görselini ve büyük özgün kurum logosunu yan yana, ana bölümde “Yapay Zekâ Eğitimi / Değerlendirme Testi” başlığını içerir. Tekrarlayan kurum/eğitim satırları kaldırıldı; puan bilgisi 10 soru / süre / puan satırının altındadır. İki görselin yüksekliği eşittir; favicon eğitmenin portföyünden alınmıştır. Logo [resmî siteden](https://www.ozakglobal.com/) alındı; [kaynak kaydı](../v2/ozak/assets/README.md) mevcuttur.

### Bağlantılar

| Grup | Ön test | Son test |
|---|---|---|
| Grup 1 | [Aç](https://sinav2.metintiryaki.com/ozak/?grup=1&asama=baslangic) | [Aç](https://sinav2.metintiryaki.com/ozak/?grup=1&asama=bitis) |
| Grup 2 | [Aç](https://sinav2.metintiryaki.com/ozak/?grup=2&asama=baslangic) | [Aç](https://sinav2.metintiryaki.com/ozak/?grup=2&asama=bitis) |
| Grup 3 | [Aç](https://sinav2.metintiryaki.com/ozak/?grup=3&asama=baslangic) | [Aç](https://sinav2.metintiryaki.com/ozak/?grup=3&asama=bitis) |

[Kurum girişi](https://sinav2.metintiryaki.com/ozak/) parametresiz açıldığında üç gruptan seçim yapılır; grup bağlantısı paylaşıldığında kurum/eğitim/grup otomatik gelir. Yalnız ad soyad ve mevcut katılımcı kodu girilir. Bağlantılar kimlik doğrulama değildir; internetten kayıt gönderilebilir. Bilinmeyen/çift grup veya geçersiz aşama parametresi genel sınava düşmez, form açılmaz.

### Dil, tema ve grup tarihleri

- Türkçe varsayılandır: [TR giriş](https://sinav2.metintiryaki.com/ozak/). [English giriş](https://sinav2.metintiryaki.com/ozak/?lang=en) aynı sayfanın paylaşılabilir İngilizce sürümüdür. Grup/aşama bağlantısına `&lang=en` eklenir; örneğin [Group 1 pre-test](https://sinav2.metintiryaki.com/ozak/?grup=1&asama=baslangic&lang=en). Dil seçimi mevcut grup/aşamayı korur; bilinmeyen veya çift `lang` Türkçeye döner.
- İngilizce giriş, form, 10 soru, sonuç ve açıklamalar statik çevrilir; çeviri API’si kullanılmaz. Soru kimliği, seçenek sırası, cevap anahtarı, sürüm, süre, puanlama ve katılımcı kayıt kapsamı aynıdır. Dil değiştirmek devam eden sınavın cevaplarını, kimliğini veya ilk bitiş saatini sıfırlamaz. Dil veya tarih backend payload’ına eklenmez.
- Grup 1 **4 Aralık 2026**, Grup 2 **6 Aralık 2026**, Grup 3 **10 Aralık 2026** yalnız **örnek tarihlerdir**; eğitim programı kesinleşmiş değildir. Kullanıcı isteğiyle arayüzde “örnek” etiketi gösterilmez; programın kesinleştiğine dair yeni bir teyit alınmadı. Görüntüleme günleri `ui-copy.mjs` içindeki `groupDays` alanındadır; sunucu kayıt zamanını belirlemez.
- Sağ üstte yalnız etkin dilin bayrağı ve adı görünür; düğmeye basınca TR/EN menüsü açılır. Hemen altında hedef temayı yazan “Açık tema / Koyu tema” düğmesi vardır. Tema Özak için ortak `ozak:theme` anahtarında saklanır; genel sınavın ayarı değiştirilmez. İlk açılış sistem temasını izler.

Yerel açılış: depo kökünde `python3 -m http.server 4187 --bind 127.0.0.1 --directory v2`, ardından `http://127.0.0.1:4187/ozak/`. Yerel sayfa da yapılandırılmış gerçek Özak backend'ini kullanır; denemeler gerçek tabloya yazabilir. Saf testlerde mock kullanılır; gerçek kişisel veriyle deneme yapılmaz.

### Soru seti ve katılımcı davranışı

- Sürüm `ozak-ai-awareness-202612-v2`; 10 soru / 10 dakika / her doğru 10 puan. [Tam sorular, anahtar ve kazanımlar](ozak-exam-questions.md) kullanıcının yayın onayı kapsamındadır; kurumun ayrı içerik onayına dair iddia değildir.
- Kullanıcı, özgün havuzdan hazırlanan 15 soruluk seçkinin 3/4/5/9/10 numaralarını çıkardı; kalan 10 soru kullanılır. Metinler ve doğru seçenek içerikleri korunur; seçeneklerin sırası dengeli anahtar için düzenlenmiştir. Eski iş senaryosu seti geçerli sınav değildir.
- Ön/son test aynı soruları kullanır. Ön testte cevap anahtarı/açıklama açılmaz; son testte açılır. İstemci anahtarı yüksek güvenlikli sınav koruması değildir. Tekrar görme etkisi olabilir; puan farkı tek başına eğitimin nedensel etkisini kanıtlamaz.
- Kurum + eğitim + grup + soru seti sürümü + kod kapsamında tarayıcı ve backend ayrımı vardır. Eski önizleme sürümü genel veya canlı Özak kayıtlarına taşınmaz. Yanıt ve ilk bitiş saati yenilemede korunur.
- Özak için ilk sunucuya kaydedilen ön ve son test resmî kayıttır; bütün denemeler günlükte tutulur. Tekrar gönderim aynı ID ile tekilleşir. Tekrar denemesi ekranda/PDF’de ilk yerel aşama puanından ayrılır. Genel V2'nin ilk ön/en son son test davranışı aynı kalır.
- Ön testi olmayan sonuç sıfır başlangıç kabul edilmez; fark boş kalır. Ekrandaki karşılaştırma yalnız aynı tarayıcıdaki ön testten gelir. Farklı cihazda kod elle girilebilir, backend aynı kapsamında eşleştirir; sonuç/katılımcı listesi okuma API'si açılmaz.
- Ad/kod/sonuç eğitmenin özel tablosuna gönderilir. `saved:true` olmadan “kaydedildi” gösterilmez; hata/yeniden deneme ve **logolu PDF indirme** vardır. PDF ad, katılımcı kodu, grup, Türkiye saatinde tamamlanma tarihi, süre, puan/doğru/yanlış/boş sayıları, mevcutsa ön/son farkı ve kayıt/tekrar durumunu içerir. Cevap anahtarı ve teknik payload PDF’ye eklenmez. Özak'ta e-posta yoktur; genel V2'nin isteğe bağlı e-postası korunur.

### Ayrı backend ve özel eğitmen tablosu

Özak frontend'i `v2/ozak/app.mjs`, `exam-context.mjs`, `persistence.mjs`, `backend-config.mjs`, statik arayüz çevirileri için `ui-copy.mjs` ve İngilizce sorular için `questions.en.mjs` kullanır. Ana endpoint'e fallback yoktur. Salt okunur katılımcı/süre yardımcıları ile temel stil dosyası genel V2'den yeniden kullanılır; bunlar değiştirilmez.

`apps-script/Ozak.template.gs` bağımsız proje şablonudur; `apps-script/ozak-appsscript.json` yalnız Sheets izni ve Europe/Istanbul saat dilimi ister. Gerçek tablo kimliği yalnız özel yapılandırmada tutulur; repoya yazılmaz. **Genel sınavın Apps Script projesine bu dosyalar eklenmez ve mevcut dağıtımı güncellenmez.** Özak ayrı proje/endpoint kullanır. Yeni kurulumda şablon `Code.gs`, manifest `appsscript.json` adıyla ayrı projeye yüklenir.

Mevcut özel eğitmen tablosundaki **Özak katılımcılar** ve **Özak sınav kayıtları** sekmeleri kullanılır; eski sekmeler/kayıtlar taşınmaz, silinmez veya Özak'a atanmaz. Cihaz tamamlanma zamanı sunucu kayıt zamanından ayrıdır; sunucu zamanı UTC ISO metindir ve günlükten özete birebir kopyalanır (Apps Script v2’de eklendi, v3’te korunur). Soru bazında yanıt toplama ve yeni dashboard yoktur. Tablo paylaşımı bu çalışma için genişletilmez.

Backend `Execute as me` ve kullanıcıca ayrıca onaylanan `Anyone` ayarıyla çalışır. İlk Google Sheets yetkisini proje sahibi verir; katılımcıdan Google oturumu/OAuth izni istenmez. Kullanıcının gördüğü “Google hasn't verified this app” ekranı yeni proje sahibinin yetkilendirmesiydi; HTTPS sertifika hatası değildir. Bu ayarda katılımcıların kişisel Google verileri için izin alınmaz. [Google'ın yürütme kimliği açıklaması](https://developers.google.com/apps-script/guides/web#permissions).

Firebase Hosting global CDN; Apps Script/Google Sheets bu kurulumda kaynak bölgesi seçtirmez. Frankfurt'a sabitlenmiş gibi sunulmaz; mevcut tablo taşınmadı, yeni bölgesel GCP veritabanı/servisi kurulmadı.

Yayın, kaynak eşitliği, gerçek kayıt ve kabul kanıtı [17 Kasım yayın kaydında](../history.md#ozak-exam-live-2026-11-17) ayrı izlenir. Önceki yerel taslak kanıtı [korunur](../history.md#ozak-exam-preview-2026-11-17); tek başına canlı kabul değildir.

17 Kasım giriş/TR–EN güncellemesi: [ayrıntılı kapanış](../history.md#ozak-layout-en-2026-11-17), [Hosting ve kaynak eşitliği kanıtı](../qa/ozak-layout-en-release-2026-11-17.json). Özak Apps Script v2 bu arayüz güncellemesi için yeniden yayımlanmadı.


### Sonuç PDF’si ve yeni soru sürümünün yayını

`report-model.mjs` katılımcının göreceği alanları hazırlar; `result-pdf.mjs` düğmeye basıldığında yerel jsPDF, Manrope fontları ve kurum logosuyla A4 PDF üretir. Sonuç dış PDF servisine gönderilmez; bu bağımlılıklar yalnız Özak dizinindedir. [Sürümler ve MIT/OFL lisansları](../v2/ozak/vendor/README.md). İndirme hatasında kullanıcı yeniden deneyebilir; kayıt doğrulanmadıysa PDF bunu açıkça yazar.

Özak Apps Script v3, eski `ozak-ai-awareness-202612-v1` ile yeni `ozak-ai-awareness-202612-v2` kayıtlarını kabul eder. Anahtarın sürüm alanı sayesinde eski sonuçlar yeni soruların başlangıç puanı olarak kullanılmaz; devam eden eski sınavın kaydı reddedilmez. Tarayıcıda yeni set de ayrı kapsamda saklanır. Genel V2 ve eski Apps Script değişmez.

17 Kasım son yayın kaydı: Hosting `a87c8f87f30e4fa6`. Kapanışta canlı statik dosyalar kaynak SHA256’larıyla, backend’in salt okunur sağlık yanıtı ise yeni soru sürümüyle karşılaştırılır. Bu kontrol gerçek tabloya yeni sonuç yazma/kabul denemesi değildir; ilk ayrı backend’in gerçek tablo kabulü önceki tarihli kayıtta, yeni sürümün mock kabulü ve güncel HTTPS kanıtı [yeni yayın kaydında](../qa/ozak-selected10-release-2026-11-17.json) ayrıdır. [Kararlar, tanıtım belgesi ve repo durumu](../history.md#ozak-selected10-pdf-2026-11-17).
