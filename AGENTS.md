# AGENTS.md

Bu kurallar Claude Code, Cursor Agent, OpenAI Codex, Gemini CLI, Windsurf ve projede kullanılan diğer LLM araçları için geçerlidir.

*Son güncelleme: 22 Ekim 2026*

## 1. Çalışma yaklaşımı ve iletişim

- Körü körüne uygulamak yerine mühendislik ve ürün yargısını kullan; eğitim bilgisi, yaygın uygulamalar ve pazar bağlamıyla seçenekleri değerlendir. Basit, ölçeklenebilir ve pratik çözümü tercih et.
- Türkçe, doğal, doğrudan ve “sen” diliyle iletişim kur. Varsayımları ve riskleri kısa belirt; teknik derinliği işin maliyetine ve önemine göre ayarla.
- Risk görünmüyorsa işi yap; küçük bir sorun için 1–2 cümle yeterlidir. Güvenlik, veri kaybı, mağaza incelemesi veya önemli ürün kararında riski, önerini ve alternatifi açıkla.
- Belirsiz, gereksiz iş çıkaran veya mimariye aykırı istekleri yapıcı biçimde sorgula; daha küçük/güvenli adımı öner. Açıkça kabul edilmemiş teknik borcu tek seferlik bir yamayla gizleme.
- Güvenlik, kimlik doğrulama, kişisel veri, sağlık iddiası, mağaza metni, veri silme, doğrulamayı atlama, veri tabanı kurallarını zayıflatma ve geniş etkili şema değişikliğinde uygulamadan önce riski değerlendir. Kaynağı olmayan fiyatlandırma ve hukuki metin kararlarını varsayma.
- Açık zarar, regresyon veya platform ihlali doğuracak talimatı olduğu gibi uygulama. Yapamayacağın işi nedenleri ve uygulanabilir alternatifiyle açıkla; güvenlik/platform kurallarıyla çatışmayı bildir.
- Dil, tek değişiklik odağı ve istenmeden IPA üretmeme gibi mevcut kullanıcı tercihlerini koru. Açıkça uzlaştırılmamış bir kural çelişkisi varsa ilgili metinleri ve engeli bildir; sessizce yorumlayıp geçme.

## 2. Ürün kapsamı, teknoloji ve dil

- Sınıf V2 ürünü `v2/` altındaki **Türkçe statik web sınavıdır**; Google Apps Script ve özel eğitmen Google Sheet kullanır. Güncel ürün bağlamı için `README.md` ve `docs/exam-v2.md` esas alınır.
- Katılımcı verileri ve özel backend verileri public repo dışında kalır.
- V1 ve EN/TR/DE/FR/ES, ileride Arapça/RTL öneren eski mobil plan, sınıf V2 yayınının kapsamını genişletmez. 22 Ekim 2026 kararıyla yerel mobil kaynaklar ve ilgili plan/belgeler içerik ve gizli bilgi kontrolüyle ayrı kaynak kapsamı olarak repoya alınabilir; bu karar build, deploy veya mağaza yayını yetkisi değildir.
- Flutter/React Native, Firebase Auth, Firestore, Storage, Analytics, Crashlytics veya Remote Config'i eski genel mobil varsayımlarda geçtiği için web ürününe ekleme. Açıkça yetkilendirilmiş yeni hizmeti ve gerekçesini belgele.
- Türkçede `ç ş ğ ü ö ı İ` karakterlerini doğru kullan; `İ/i` ve `I/ı` ayrımını koru. Dil bilgisi ve doğal anlatımı kontrol et; kuşkulu çeviriyi insan incelemesine bildir.

## 3. Güvenlik, erişim ve maliyet sınırları

- Mağaza şifreleri ve anahtarlar Google Drive kök klasöründe tutulur. Bu konum bilgisi sırları repoya, belgelere, loglara veya sohbet çıktısına kopyalama izni değildir.
- Hesap/anahtar erişimi veya eski genel “tam yetki” ifadesi tek başına credential, erişim/güvenlik değişikliği, ücret ya da özel veri aktarımı yetkisi vermez.
- Geri döndürülemez silme, credential/erişim/güvenlik değişikliği, yeni ücret, özel veri aktarımı ve kapsam genişlemesinde mevcut özel onay sınırlarını koru; zaten verilmiş açık yetkiyi tekrar isteme.
- **Bir değişiklik veya deployment'ın 20 USD'yi aşması bekleniyorsa önceden bildir ve onay al.** Bu eşik, daha düşük tutarlı yeni ücretler için mevcut özel onay sınırını kaldırmaz.

## 4. Git, doğrulama ve inceleme

- İzole görev dalında çalış; önce commit, sonra PR oluştur. `main` dalına doğrudan push yapma; ilgisiz dosya değişikliklerini ve worktree'leri koru.
- **Bu projede CI kullanılmıyor.** Olmayan GitHub CI kontrolünü zorunlu kılma veya başarı kanıtı olarak gösterme. Kullanıcı kararına göre değişiklikle orantılı hedefli yerel doğrulama, güvenlik incelemesi ve tamamlanmış Codex incelemesi yeterlidir; merge öncesinde son ilgili PR HEAD'ini kapsamalıdır.
- Düzeltme geldiyse etkilenen kontrolü ve incelemeyi yenile. Boş/atlanan sonuç, `NEUTRAL`, sessizlik, incelemeyi tetiklemek veya emoji tamamlanma kanıtı değildir; sırf bot emojisi için sonsuz tekrar yapma. İnceleme ya da erişim eksikse PR'ı açık bırak ve engeli raporla.
- Her bulguyu değerlendir: doğrulanmış kapsam içi kusuru rutin onay beklemeden düzelt ve hedefli doğrula; yanlış pozitifi somut kanıtla açıkla. Belgelenmiş bilinçli kullanıcı/ürün kararını kaynağıyla koru; yeni maddi risk veya bağlam yoksa tekrar açma. Düzeltme özel onay sınırına ya da yeni kapsama giriyorsa o sınırı uygula.
- Gerçek merge'i ve hedef dalı doğrula. Yalnız bu görevin dalını, yeni/birleşmemiş/aktif işi olmadığını doğruladıktan sonra projenin temizlik kurallarına göre temizle.
- `main` için [ruleset 25666505](https://github.com/MetinTi/yapay-zeka-sinav/rules/25666505) etkindir: PR zorunlu, dal silme ve force-push engelli, bypass yok, açık inceleme konuşmaları çözülmeli; zorunlu onay sayısı 0 ve CI/status gate yoktur. Codex ve güvenlik incelemesi son ilgili HEAD için süreç gereğidir; ruleset bunları otomatik doğrulamaz. Koruma takibi `docs/WORKFLOW_BACKLOG.md` içindedir. [28 Eylül kaydı](qa/closeout-2026-09-28.json) yalnız o tarihteki korumasız durumun kanıtıdır.

## 5. Belgeler ve geçmiş

- Gün başında işin kapsamına göre `backlog.md` ve `docs/WORKFLOW_BACKLOG.md` dosyalarındaki açık işleri gözden geçir, kısa hatırlatma yap. Gün sonunda özellik, değişiklik, deployment, karar ve engelleri `history.md` içine kaydet.
- “update docs and repo”, tüm backlogun güncel kod/test, kullanıcı kararları, PR ve yayın kanıtıyla gözden geçirilmesidir; tüm backlogu uygulama emri değildir.
- ID, önceki kanıt, bağımlılık ve engelleri koru. İptal, erteleme ve açıkça risk kabul edilmiş işleri ayrı tut; risk kabulü uydurma.
- Tamamlanan işleri konu gruplarıyla aktif belgenin en altında tarih + tek cümle + mevcut ayrıntılı geçmişe bağlantı olarak tut; ayrıntı, karar ve kanıtı `history.md` içine taşı.
- AGENTS, backlog ve geçmiş düzenlemesinde benzersiz kural veya kayıtları kaybetme. Tekrarların birleştirilmesi ve açıkça kaldırılması istenen kuralların temizlenmesi yetkilidir; geçmiş kaydını kayıpsız taşırken aktif belgede ID ve bağlantıyı koru. Sadece güncelliğini yitiren maddeleri güncelle veya üstünü çiz.
- **P0 geçmiş düzeni:** `docs/WORKFLOW_BACKLOG.md` içindeki `DOC-HISTORY-ARCHIVE-P0`, ileride `history.md` kısa tarihli dizin + `history_archive.md` ayrıntılı kanıt/karar düzenine kayıpsız geçişi izler. Şimdilik kanonik ayrıntılı geçmiş `history.md` dosyasıdır; bu belge düzenlemesi arşiv geçişini başlatmaz. Gereksiz paralel TODO veya ikinci arşiv oluşturma.

## 6. Deployment ve yayın kanıtı

- Önceden yetkili görev/servis/ortam kapsamında gerekli kontrol → kapsamla sınırlı deploy → sağlık/canlı kontrol → kaynak/hedef kaydı → rapor akışını ayrıca rutin onay istemeden tamamla.
- Belge bakımı veya kaynakları repoya ekleme; runtime deploy, build, Store upload/review/publication yetkisi vermez.
- Web/backend/araştırma işi için kaynak, hedef, yayın ve kabul kanıtını mevcut belgelerde ayrı tut; mobil mağaza tablosu uygulama.
- Mobil ürün ayrıca yetkilendirilirse mobil backlogun başında App Store/Play/Galaxy özeti bulunsun. Build, mağaza incelemesi ve public yayın ayrı kanıtlardır; planlanan Galaxy dağıtımını yayın sayma.

## 7. Firebase/GCP bölgesi

- Kurulum ve deploy öncesinde her ilgili kaynağın gerçek bölgesini ayrı kontrol et; US varsayılanına sessizce düşme.
- Bölgesi seçilebilen yeni kaynaklarda öncelik Frankfurt (`europe-west3`); desteklenmiyorsa Belçika (`europe-west1`) veya uygun başka bir AB bölgesidir. Mevcut uygun EU bölgesini sırf tercih sırası için taşıma.
- Functions, Cloud Run/SSR, App Hosting, Firestore/Realtime Database, Storage ve yardımcı kaynakları birlikte değerlendir. İstemci endpoint'leri ile Hosting rewrite hedefleri seçilen bölgeyle uyuşsun; deploy sonrasında gerçek hedefi doğrula.
- Firebase Hosting global CDN ve Google'ın bölge seçtirmediği/zorunlu tuttuğu hizmetler istisnadır: gerekçeyi kaydet, EU'ya sabitlenmiş gibi sunma. [Kaynak konumları](https://firebase.google.com/docs/projects/locations) · [Hosting](https://firebase.google.com/docs/hosting).
- Mevcut US kaynağı için bağımlılık, veri ve geri dönüş planıyla EU geçiş işini backlog'a yaz. Veri taşıma, kaynak silme, erişim değişikliği veya yeni ücret için gereken onayı atlama; belge işi altyapı taşımasını başlatmaz.

## 8. Mobil geliştirme ve mağazalar

Bu bölüm yalnız ayrıca yetkilendirilen mobil çalışma için geçerlidir; web V2 mağaza yayını gerektirmez.

### Build makineleri

- iOS build/archive/sign yalnız MacBook'ta macOS/Xcode ile yapılır.
- Android ve Galaxy Store dağıtım/release paketleri yalnız Windows PC'de üretilir. Mac'te Android/Galaxy için dağıtım APK/AAB üretim komutu çalıştırma.
- Mac'te Android debug çalıştırma, test ve emülatör/simülatör kontrolü yapılabilir; bunun gerektirdiği debug derlemesi dağıtım paketi üretme izni değildir.
- Build ve Store upload/review/publication için mevcut açık yetki sınırlarını koru. PC'ye aynı kaynak commit'i ve sabitlenmiş araç sürümleriyle geç.

### Mağaza ve gizlilik kontrolleri

Mağaza reddi doğurabilecek uygulamadan önce uyar; kuşkuda önce riski bildir, sonra uygula. İlgili platformun güncel kurallarını doğrula:

- **Arka plan ses/kayıt:** Geçerli kullanım gerekçesi ve gerekli platform izin/yeteneklerini doğrula.
- **Sağlık/tıbbi iddia:** Gerekli izin ve inceleme gerekçesini doğrula.
- **Bildirim:** Açık kullanıcı izni al; manipülatif akış kullanma.
- **Dijital ürün ödemeleri:** StoreKit/Google Billing gerekliliklerini ve dış ödeme bağlantısı kısıtlarını uygula.
- **Gizlilik beyanı:** Veri toplamayı App Privacy ve Data Safety'de doğru beyan et.
- **Takip/ATT:** iOS 14.5+ üzerinde uygulamalar arası takip için ATT izni uygula.
- **Abonelik iptali:** Uygulamadan veya platform ayarlarından sürtünmesiz iptal olanağını koru.

## 9. Tasarım sistemi

Hedef, premium tüketici uygulaması kalitesidir: Dribbble üst düzey örnekler, Awwwards Mobile Excellence ve Apple Design Awards referans çıtasıdır. Kullanıcı stil belirtmezse aşağıdaki varsayılanları uygula; proje kökündeki `design_tokens.md` varsa önceliklidir. Kullanıcının verdiği Dribbble bağlantısı veya ekran görüntüsünün renk, yerleşim, derinlik ve hareketini eşleştir.

### Görsel dil ve bileşenler

| Öğe | Kural |
|---|---|
| Derinlik | Katmanlı kartlar, yumuşak gölgeler, ince paralaks; düz gri kutular kullanma. |
| Renk/zemin | Zengin gradyan, canlı vurgu, mesh veya görsel; yalnız gri-beyaz ya da düz beyaz/gri zemin kullanma. |
| Tipografi | Büyük, güçlü Black/Bold başlıklar, sıkı harf aralığı ve net hiyerarşi. |
| İkon | SF Symbols, Phosphor veya Lucide; varsayılan Material ikonları kullanma. |
| Hareket | Etkileşimlerde ölçek, fade ve yay fiziğiyle mikro animasyon. |
| Cam/3D | Uygun yerde buzlu cam kart, bulanık arka plan ve hafif 3D dönüşüm. |
| Buton | Gradyan veya güçlü dolgu; düz gri çerçeveyle yetinme. |
| Kart | Gölgeli/yüzen yüzey ve en az 24 px köşe yarıçapı; düz çerçeveli kutu kullanma. |
| Boş durum | İllüstrasyon veya Lottie animasyonu; gri ikon ve tek satırla yetinme. |
| Onboarding | Her adımda tam alan illüstrasyon veya Lottie animasyonu. |
| Modal/bottom sheet | Cam efekti veya güçlü yüzey rengi; düz beyaz açılır pencere kullanma. |

### Varsayılan token'lar

```text
Primary gradient: #6C3DE8 → #C44FD6
Accent: #FF6B6B
Background dark: #0D0D1A
Surface: rgba(255,255,255,0.08)
Border radius: cards 24px · buttons 16px · chips 999px
Shadow: 0 20px 60px rgba(0,0,0,0.3)
Display font: SF Pro Display / Inter — Black
Body font: SF Pro Text / Inter — Regular / Medium
Animation: spring · stiffness 300 · damping 20
```

Yeni ekran tasarlamadan önce zorunlu referansları kontrol et:

- [Dribbble mobile UI](https://dribbble.com/search/mobile-ui)
- [Awwwards Mobile Excellence](https://www.awwwards.com/websites/mobile-excellence)
- [Apple Design Awards](https://developer.apple.com/design/awards)

## 10. Subagent kullanımı

Birden fazla geliştirme, test veya inceleme işi gerektiğinde bağımsız işleri hızlandırmak için ihtiyaç kadar subagent kullan; sabit sayı sınırı veya ayrıca rutin izin şartı yoktur. Dosya çakışması ve gereksiz mükerrer işi önle; sonuçları birleştirerek doğrula. Kapsam, güvenlik, maliyet ve yetki kuralları bütün subagentlara uygulanır.
