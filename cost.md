# Maliyet kaydı

## 28 Eylül 2026 — sınıf sınavı V2

| Kalem | Kapsam / sonuç |
|---|---|
| Kullanıcı yetkisi | 10 soruluk V2 sınav ve `sinav2.metintiryaki.com` yayını |
| Servis | Mevcut Firebase `yapay-zeka-egitim-mt`, ayrı Hosting site `yapay-zeka-sinav2-mt` |
| Miktar | Dört statik dosya, yaklaşık 48 KB disk boyutu; bir yayın |
| Mevcut durum | Projede billing açık; değişiklik yapılmadı. Hosting'de önceki release/version bulunmadı. |
| Fiyat | Hosting: 10 GB depolama ve aylık 10 GB veri aktarımı ücretsiz pay; aşım $0.026/GB depolama, $0.15/GB aktarım |
| Beklenen ek tutar | Bu küçük yayın ve sınıf kontrolü için ücretsiz pay içinde $0; gerçek fatura tutarı doğrulanmadı |
| Sürekli yeni ücretli iş | Yok; zamanlanmış worker, AI API, yeni abonelik veya plan değişimi yok |
| E-posta | Mevcut Apps Script servisi; agent gerçek e-posta göndermedi |

Fiyat kontrolü: 28 Eylül 2026, https://firebase.google.com/docs/hosting/usage-quotas-pricing . Bu kayıt bir bütçe limiti kurulduğu anlamına gelmez.

## 28 Eylül 2026 — Revizyon6

Mevcut V2 Hosting hedefine iki küçük yayın (ikinci yalnız mobil dekor taşması düzeltmesi);6 istemci dosyası, 52763 bayt. Mevcut Google hesabında özel Sheet ve Apps Script v15 kullanıldı; yeni plan, ücretli API, worker veya abonelik açılmadı. Gerçek e-posta gönderilmedi. Fiili fatura/ücretsiz kota bakiyesi doğrulanmadı; önceki maliyet kaydı tahmindir.

## 28 Eylül 2026 — gün sonu kapanışı

Giriş açıklaması sadeleştirmesiyle son Hosting sürümü `766629d323b0b03d` oldu (6 istemci dosyası). Kapanış sırasında yeni deploy, ücretli servis, plan değişimi veya gerçek e-posta gönderimi yapılmadı. Fiili fatura tutarı doğrulanmadı. Repo public olduğu için özel tablo ve kayıt kanıtları Git dışında tutuldu.

## 28 Eylül 2026 — Hosting birleştirme

Kullanıcının açık taşıma/silme talebiyle mevcut canlı sürüm aynı Firebase projesindeki ana siteye bir kez klonlandı (6 dosya, 52763 bayt). Wix CNAME güncellendi. Yeni servis, abonelik veya billing planı açılmadı. Fiili ek fatura tutarı ve kalan ücretsiz kota doğrulanmadı.
