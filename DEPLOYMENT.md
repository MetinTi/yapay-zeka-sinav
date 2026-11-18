# YZ Sınav — Deployment notları

> Bu dosyadaki canlı sürüm/erişim kanıtları 28 Eylül 2026 tarihlidir. 22 Ekim 2026 belge kapanışında yeni deploy veya canlı kabul kontrolü yapılmadı. Son kaynak aktarımı [PR #5](https://github.com/MetinTi/yapay-zeka-sinav/pull/5), `bb65dad`; kaynak sürümü Hosting/Apps Script sürümü değildir.

**Deploy → Manage deployments** penceresindeki değerleri buraya yapıştırın. Her **New version → Deploy** sonrası bu dosyayı ve `index.html` içindeki `SCRIPT_URL` satırını güncelleyin.

---

### Son güncelleme

2026-09-28

---

### Apps Script proje adı

YZ Sınav

---

### Web app URL (`.../exec` ile bitsin)

Tek satır, başında/sonunda ekstra tırnak veya markdown link **yok** — sadece URL:

```
https://script.google.com/macros/s/AKfycbwMu1jzZcUOJzvbvyCeJNIlTJHHFCqQZSSzN6S5cryZIsj6jDFyCqq31c8_D9NpbWyf/exec
```

---

### Deployment ID

`/macros/s/` ile `/exec` arası (yukarıdaki URL ile aynı olmalı):

```
AKfycbwMu1jzZcUOJzvbvyCeJNIlTJHHFCqQZSSzN6S5cryZIsj6jDFyCqq31c8_D9NpbWyf
```

> **Dikkat:** Harf **O** ile rakam **0**, **I** ile **l** kolay karışır. Elle yazma; Apps Script’ten kopyala-yapıştır.

---

### Library URL

```
https://script.google.com/macros/library/d/1YjrTGRf2H6d7N7TpRBklAyBx0FB7wceCQfFCpruhlC9Wz6EStADCsMXx/12
```

---

### Script düzenleyici

```
https://script.google.com/home/projects/1YjrTGRf2H6d7N7TpRBklAyBx0FB7wceCQfFCpruhlC9Wz6EStADCsMXx/edit
```

---

## `index.html` ile eşleşme

```text
index.html içinde: var SCRIPT_URL=".../exec";
```

Buradaki **Web app URL** ile `SCRIPT_URL` **aynı** olmalı.

---

## Hızlı kontrol

1. Web app URL sonuna örnek: `?callback=cb&action=history&email=test@test.com` — JSON/JSONP beklenir.
2. Apps Script’te `testManual()` → mail + Sheet.

## 28 Eylül 2026 — V2 ek kayıt servisi

Mevcut `/exec` dağıtımı **v15** olarak güncellendi; URL değişmedi. Yerel üretim kaynağı `apps-script/Code.gs` + Git'e alınmayan `apps-script/V2.gs` dosyalarıdır. Yeni kurulumda `V2.template.gs` dosyasını `V2.gs` olarak kopyalayıp özel tablo kimliğini yerel dosyada ayarlayın; iki V2 dosyasını birlikte Apps Script'e yüklemeyin. V1 davranışı aynı; eski V1 tablo bağlantısının silinmiş olduğu saptandı, bu revizyon V1 kayıt onarımı değildir.

V2 web yayını `firebase.v2.json` ile yalnız `yapay-zeka-egitim-mt` projesinin ana `yapay-zeka-egitim-mt` Hosting sitesine gider. Son sürüm `f4c63895a7e7c5eb` (Revizyon 6 klonu); altı canlı dosya kaynakla eşleşir. Gün sonu belge/repo kapanışı yeni deploy başlatmaz. [V2 işletim ve doğrulama özeti](docs/exam-v2.md).

28 Eylül 22:05 TRT: Eski `yapay-zeka-sinav2-mt` Hosting sitesi silindi. `sinav2.metintiryaki.com` ana siteye bağlıdır; gelecekteki yayınlarda yukarıdaki `firebase.v2.json` yapılandırmasını kullanın.


## Özak — ayrı sınav dağıtımı (17 Kasım 2026)

Kullanıcı, Özak sınavının ana sınav korunarak ayrı yayımlanmasını ve mevcut özel eğitmen tablosuna bağlanmasını istedi. Özak yolu `https://sinav2.metintiryaki.com/ozak/`, frontend dizini `v2/ozak/`; genel kök sınav dosyaları aynı bırakılır. Hosting aynı global siteye yalnız ek dosyalarla yayımlanır.

Özak backend'i **ayrı Apps Script projesidir**. `apps-script/Ozak.template.gs` ve `apps-script/ozak-appsscript.json` yalnız bu ayrı projeye aittir; ana Apps Script'e yüklenmez. Özel tablo kimliği repoya alınmaz. Ayrı endpoint `v2/ozak/backend-config.mjs` içindedir. `Execute as me` / açıkça onaylanmış `Anyone` ayarı, katılımcıdan Google izni istemeden yazma sağlar; public okuma yolu yoktur. Proje sahibi ilk Sheets iznini kendisi tamamladı.

[Grup bağlantıları ve işletim](docs/exam-v2.md#ozak-202612) · [soru seti](docs/ozak-exam-questions.md) · [tarihli yayın/kabul kanıtı](history.md#ozak-exam-live-2026-11-17). Kaynak/test, Apps Script v2, Hosting yayını ve gerçek tablo kabulü ayrı kanıtlardır; Google OAuth proje sahibi uyarısı ile HTTPS sertifika hatası karıştırılmaz.


### 17 Kasım — seçilen 10 soru ve PDF güncellemesi

Özak girişinin sağ üst dil menüsü/tema sırası, eşit yükseklikteki görselleri ve portföy favicon’u güncellendi. Sonuç indirme JSON yerine yerel jsPDF/Manrope ile logolu PDF üretir. Genel V2’nin JSON/e-posta davranışı değişmedi. Yeni soru seti `ozak-ai-awareness-202612-v2`; Özak Apps Script v3 eski ve yeni sürümü ayrı anahtarlarla kabul eder. Son kayıtlı Hosting yayını `a87c8f87f30e4fa6`; bu belge/repo kapanışı yeniden deploy başlatmaz.

[Kaynak/HTTPS/sağlık kanıtı](qa/ozak-selected10-release-2026-11-17.json) · [işletim](docs/exam-v2.md#ozak-202612) · [ayrıntılı karar ve kabul sınırı](history.md#ozak-selected10-pdf-2026-11-17). Tanıtım PDF’si ve kişisel ekran/PDF kanıtları Downloads’ta kalır, herkese açık repoya eklenmez.


## Blanchard özel sınıf bağlantısı

Mevcut Özak Apps Script projesinde Blanchard için `BLANCHARD_CLASS_SHA256` ve `BLANCHARD_CLASS_EXPIRES_AT` Script Properties değerlerini ayarla. İlk değer, rastgele üretilmiş 64 küçük onaltılık karakterin UTF-8 SHA-256 özetidir. İkinci değer UTC ISO tarihidir. Davetin kendisini yalnız özel sınıf bağlantısında `/blanchard/#sinif=…` biçiminde paylaş. Ön ve son test için aynı bağlantı ve tarayıcı kullanılır. Yeni süre veya davet gerekiyorsa değerleri yayındaki projenin ayarlarında değiştir.

`apps-script/Ozak.template.gs` içindeki çalışma kitabı yer tutucusu dağıtımdan önce mevcut özel değerle doldurulur. Aynı Apps Script dağıtımı yeni sürüme alınır. Ardından `firebase.v2.json` yapılandırmasıyla yalnız Blanchard dosyalarını güncelle. İlgili Hosting kuralı Apps Script bağlantısını Blanchard sayfalarında açar. Önceki Özak ve genel sınav varlıklarını koru. [Apps Script özellikleri](https://developers.google.com/apps-script/guides/properties) · [Firebase Hosting başlıkları](https://firebase.google.com/docs/hosting/full-config#headers).
