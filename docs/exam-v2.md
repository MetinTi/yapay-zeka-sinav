# Eğitim sınavı V2

28 Eylül 2026 gün sonu. Canlı adres: https://sinav2.metintiryaki.com/ . Başlangıç için `?asama=baslangic`, bitiş için `?asama=bitis` kullanılır.

## Katılımcı akışı

10 sabit soru, 10 dakika, her doğru 10 puan. Başlangıç ve bitiş aynı soruları kullanır. İlk başlangıç puanı korunur; bitişte puan farkı ve kısa açıklamalar açılır. Sorular AI çıktısını denetleme, Python, istem, token, embedding, vektör veritabanı/RAG, kaynak doğrulama, prompt injection, veri politikası ve n8n/onay konularını kapsar.

Ad soyad zorunludur. Kod unutulursa yalnız aynı tarayıcı ve alan adındaki ad kayıtları aranır; birden fazla kod varsa katılımcı seçer. Farklı cihaz veya alan adları arasında otomatik kurtarma yoktur. Yanıtlar ve kalan süre yenilemede korunur. Bu sınıf değerlendirmesidir; istemcideki cevap anahtarı yüksek güvenlikli sınav koruması değildir.

Eğitmen özel Google tablosunda adı, kodu ve başlangıç/bitiş puanlarını görür. Sunucu `saved:true` dönmedikçe kayıt doğrulandı gösterilmez. Katılımcı listesini dışarı açan bir API yoktur. E-posta ayrı ve isteğe bağlı işlemdir; gerçek e-posta gönderimi/teslimi test edilmedi. JSON indirme alternatifi vardır. Kullanıcının istediği iki giriş açıklaması kaldırılmıştır; ad zorunluluğu ve kayıt davranışı korunmuştur.

## Kaynak ve kurulum sınırı

- `v2/`: Yayınlanan altı statik istemci dosyası. Uygulama paketi veya üçüncü taraf npm bağımlılığı yoktur.
- `apps-script/Code.gs`: V1 davranışı ve V2 yollarına yönlendirme.
- `apps-script/V2.template.gs`: Kamuya uygun backend şablonu. `V2.gs` olarak kopyalayıp özel eğitmen tablosu kimliğini yerel dosyada ayarlayın. Apps Script'e `Code.gs` ve yapılandırılmış `V2.gs` yüklenir; şablonu üçüncü dosya olarak eklemeyin.
- Gerçek `V2.gs`, özel tablo kimliği, katılımcı/ekran kanıtları ve ayrıntılı iç teslim kaydı Git'e alınmaz. Canlı v15 kaynağı yerelde korunur; repo şablonu yalnız tablo kimliği ve açıklama satırı bakımından farklıdır.
- Önceki mobil ve çeviri taslakları bu kapanışın kapsamı değildir. Bunlar yerelde korunmuştur. Sunumun ayrıntılı geçmişi Training projesinde tutulur.

## Yayın ve doğrulama

| Alan | Sonuç |
|---|---|
| Firebase proje / site | `yapay-zeka-egitim-mt` / `yapay-zeka-egitim-mt` |
| Son Hosting sürümü | `f4c63895a7e7c5eb` (Revizyon 6 klonu); altı dosya HTTP 200 ve yerel SHA256 ile eşit |
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
