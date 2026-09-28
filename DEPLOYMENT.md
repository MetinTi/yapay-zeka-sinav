# YZ Sınav — Deployment notları

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

V2 web yayını `firebase.v2.json` ile yalnız `yapay-zeka-egitim-mt` projesinin `yapay-zeka-sinav2-mt` Hosting sitesine gider. Son sürüm `766629d323b0b03d`; altı canlı dosya kaynakla eşleşir. Gün sonu belge/repo kapanışı yeni deploy başlatmaz. [V2 işletim ve doğrulama özeti](docs/exam-v2.md).
