# yapay-zeka-sinav

## Eğitim sınavı V2 — 28 Eylül 2026 / Revizyon 6

`v2/`, iki günlük Yapay Zeka Eğitimi için Türkçe sınıf değerlendirmesidir: **10 sabit soru, 10 dakika, her doğru 10 puan; ad soyad zorunlu**. Başlangıç ve bitiş aynı soruları kullanır. İlk başlangıç puanı korunur; bitiş sonucu ve puan farkı gösterilir.

- Eğitim adresi: https://sinav2.metintiryaki.com/ — `?asama=baslangic` veya `?asama=bitis`. Firebase alternatif adresi: https://yapay-zeka-sinav2-mt.web.app/ . **Revizyon 6 / giriş metni sadeleştirmesi yayında:** `766629d323b0b03d`; altı dosyanın canlı SHA256 eşitliği ve gerçek Chrome açılışı doğrulandı.
- Katılımcı kodu unutulursa adla **yalnız aynı tarayıcıdaki kayıtlar** aranır; bulunan kod kullanıcı tarafından seçilir. Farklı cihaz/alan adı arasında otomatik kurtarma yoktur. Yanıtlar ve kalan süre sayfa yenilendiğinde korunur.
- Kayıtlar özel eğitmen tablosuna yazılır; erişim yalnız eğitmenin hesabındadır. Katılımcı listesi herkese açık değildir.
- E-posta **isteğe bağlı ve ayrı bir işlemdir**; gerçek e-posta gönderimi/teslim testi yapılmadı. Sonuç JSON olarak indirilebilir.
- Apps Script V2 ek yolları 28 Eylül'de **v15** olarak yayımlandı. V1 davranışı korunuyor; V1 `index.html` ve mobil uygulama bu sınıf revizyonuyla değişmedi.
- Frontend 8 test; backend 12 temel kontrol ve 2 yeniden deneme senaryosu geçti. Yerel gerçek tarayıcıda başlangıç **10**, bitiş **20**, fark **+10**; ad/kod kurtarma, yenileme ve sunucu kayıt yanıtı doğrulandı. Ayrıntı ve yayın kanıtı: [V2 teslim kaydı](docs/exam-v2.md).

Bu GitHub deposu herkese açıktır. Gerçek `apps-script/V2.gs`, özel tablo kimliği, katılımcı kayıtları ve ekran kanıtları Git'e alınmaz; kamuya uygun backend şablonu `apps-script/V2.template.gs` dosyasındadır. Yerel özel teslim kaydı korunur. Önceki mobil/çeviri taslakları bu V2 kapanışının kapsamı değildir.

HTTPS sertifikası geçerlidir; 28 Eylül kontrolünde Chrome'un eski sertifika uyarısı oturum durumuna ayrıştırıldı ve temiz gizli pencerede güvenli bağlantı doğrulandı. Boş varsayılan Firebase sitesi bırakıldı; aktif sınav `yapay-zeka-sinav2-mt` sitesidir.

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
