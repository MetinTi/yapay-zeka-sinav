# Özak Global Holding — Eğitim Değerlendirme Testi

**Güncel set: 17 Kasım 2026 kullanıcı seçimi.** Genel V2 sınavı değişmez. Kurumun ayrı içerik onayı verilmiş gibi sunulmaz.

Soru seti sürümü: `ozak-ai-awareness-202612-v2`. Kullanıcı, özgün V1 havuzundan hazırlanan 15 soruluk seçkinin **3, 4, 5, 9 ve 10** numaralarını çıkardı; kalan sorular seçkideki sırayla kullanılır. Kaynak: [V1 havuzu](../index.html) ve aynı kimlikleri taşıyan [mobil havuz](../mobile/assets/data/exam_pool.json). Önceki genel iş senaryosu seti v1 olarak geçmişte korunur; güncel set aşağıdadır.

Ön ve son test aynı **10 soruyu** kullanır; süre 10 dakika, her doğru 10 puan, yanlış/boş 0 puandır. Yanlışlar doğruları götürmez. Ön testte anahtar ve açıklama açılmaz; son testte açılır. Soru ve doğru seçenek içerikleri kaynaktan korunur; seçenek sırası dengeli cevap anahtarı için düzenlenmiştir.

Amaç, eğitimdeki istem bileşenleri, öğrenme türleri, NLP, büyük veri ve DL/GPU konularını ölçmektir. Bu konuların ders programında bulunması gerekir. Ön testin düşük, son testin yüksek çıkacağı garanti edilmez; aynı soruları tekrar görme etkisi nedeniyle puan farkı tek başına eğitimin nedensel etkisini kanıtlamaz.

| Sınav sırası | İlk seçkideki sıra | Kaynak | Konu | Doğru |
|---|---|---|---|---|
| 1 | 1 | web-009 | İstemin bileşenleri | B |
| 2 | 2 | web-025 | Zero-shot istem | D |
| 3 | 6 | web-006 | Makine öğrenmesi türleri | A |
| 4 | 7 | web-028 | Denetimli öğrenme | C |
| 5 | 8 | web-043 | Pekiştirmeli öğrenme | B |
| 6 | 11 | web-008 | Doğal dil işlemenin bileşenleri | A |
| 7 | 12 | web-016 | Metin sınıflandırma | D |
| 8 | 13 | web-010 | Büyük verinin 5V özelliği | C |
| 9 | 14 | web-059 | Veri çeşitliliği | A |
| 10 | 15 | web-058 | Derin öğrenme ve GPU | B |

## 1. İstemin bileşenleri

Kaynak: `web-009`.

Prompt mühendisliğinde "Mükemmel Prompt Formülü"nün bileşenleri nelerdir?

- **A)** Başlık, İçerik, Sonuç, Özet, Kaynakça
- **B)** Rol, Görev, Bağlam, Kısıtlamalar, Format
- **C)** Giriş, Gelişme, Sonuç
- **D)** Soru, Cevap, Doğrulama, Onay

**Doğru cevap: B.** Rol, Görev, Bağlam, Kısıtlamalar, Format

**Açıklama:** Mükemmel Prompt Formülü sunumda Rol, Görev, Bağlam, Kısıtlamalar ve Format olarak beş bileşenle detaylandırılmıştır.

**Ölçülen kazanım:** Bir istemin rol, görev, bağlam, kısıtlamalar ve format bileşenlerini tanır.

## 2. Zero-shot istem

Kaynak: `web-025`.

Zero-Shot prompting hangi durumda kullanılır?

- **A)** Çok fazla veri olduğunda
- **B)** Model eğitilirken
- **C)** Sadece kod yazarken
- **D)** Örnek verilmeden doğrudan talimat verildiğinde

**Doğru cevap: D.** Örnek verilmeden doğrudan talimat verildiğinde

**Açıklama:** Zero-shot, örnek vermeden talimat vermektir.

**Ölçülen kazanım:** Örnek içermeyen doğrudan talimatı zero-shot olarak ayırt eder.

## 3. Makine öğrenmesi türleri

Kaynak: `web-006`.

Makine öğrenmesinin üç temel türü hangileridir?

- **A)** Denetimli, Denetimsiz ve Pekiştirmeli Öğrenme
- **B)** Hızlı, Orta ve Yavaş Öğrenme
- **C)** Yapay, Doğal ve Karma Öğrenme
- **D)** Tek katmanlı, Çok katmanlı ve Derin Öğrenme

**Doğru cevap: A.** Denetimli, Denetimsiz ve Pekiştirmeli Öğrenme

**Açıklama:** Sunumda ML'nin üç temel türü Denetimli (Supervised), Denetimsiz (Unsupervised) ve Pekiştirmeli (Reinforcement) Öğrenme olarak açıklanmıştır.

**Ölçülen kazanım:** Denetimli, denetimsiz ve pekiştirmeli öğrenmeyi temel türler olarak tanır.

## 4. Denetimli öğrenme

Kaynak: `web-028`.

Denetimli öğrenmede temel özellik nedir?

- **A)** Veri etiketlenmemiştir
- **B)** Model kendi kendine öğrenir
- **C)** Girdi ve doğru çıktı vardır
- **D)** İnsan müdahalesi yoktur

**Doğru cevap: C.** Girdi ve doğru çıktı vardır

**Açıklama:** Denetimli öğrenmede doğru etiketli veri vardır.

**Ölçülen kazanım:** Denetimli öğrenmede girdi ile doğru çıktı etiketinin birlikte bulunduğunu ayırt eder.

## 5. Pekiştirmeli öğrenme

Kaynak: `web-043`.

Bir yapay zeka modelinin "ödül ve ceza" (reward/penalty) mantığıyla kendi kendine öğrenmesini sağlayan Makine Öğrenmesi (ML) türü aşağıdakilerden hangisidir?

- **A)** Denetimli Öğrenme (Supervised Learning)
- **B)** Pekiştirmeli Öğrenme (Reinforcement Learning)
- **C)** Denetimsiz Öğrenme (Unsupervised Learning)
- **D)** Doğal Dil İşleme (NLP)

**Doğru cevap: B.** Pekiştirmeli Öğrenme (Reinforcement Learning)

**Açıklama:** Pekiştirmeli öğrenme (Reinforcement Learning), yapay zekanın ödül ve ceza mekanizmaları ile kendi kendine deneme yanılma yoluyla öğrenmesini sağlayan ML türüdür.

**Ölçülen kazanım:** Ödül ve ceza geri bildirimiyle öğrenmeyi pekiştirmeli öğrenme olarak tanır.

## 6. Doğal dil işlemenin bileşenleri

Kaynak: `web-008`.

Doğal Dil İşleme (NLP) hangi temel bileşenlerden oluşur?

- **A)** Dil Anlama (NLU), Dil Üretimi (NLG), Konuşma Tanıma ve Konuşma Sentezi
- **B)** Sadece metin çevirisi ve duygu analizi
- **C)** Görüntü işleme ve ses tanıma
- **D)** Veri tabanı sorgulama ve raporlama

**Doğru cevap: A.** Dil Anlama (NLU), Dil Üretimi (NLG), Konuşma Tanıma ve Konuşma Sentezi

**Açıklama:** NLP'nin temel bileşenleri sunumda Dil Anlama (NLU), Dil Üretimi (NLG), Konuşma Tanıma ve Konuşma Sentezi olarak sıralanmıştır.

**Ölçülen kazanım:** Eğitimde ele alınan dil anlama, dil üretimi, konuşma tanıma ve konuşma sentezi bileşenlerini tanır.

## 7. Metin sınıflandırma

Kaynak: `web-016`.

Bir çağrı merkezi müdürü, müşteri şikayetlerini otomatik olarak kategorize etmek istiyor. Hangi yapay zeka alt dalı ve öğrenme türü en uygun çözümü sunar?

- **A)** Bilgisayarla Görü (Computer Vision) ve Pekiştirmeli Öğrenme
- **B)** Robotik ve Denetimsiz Öğrenme
- **C)** Büyük Veri analizi ve Derin Pekiştirmeli Öğrenme
- **D)** Doğal Dil İşleme (NLP) ve Denetimli Öğrenme (Supervised Learning)

**Doğru cevap: D.** Doğal Dil İşleme (NLP) ve Denetimli Öğrenme (Supervised Learning)

**Açıklama:** Müşteri şikayetlerinin metin tabanlı olması NLP gerektirir; etiketlenmiş geçmiş verilerden öğrenme ise Denetimli Öğrenme ile yapılır.

**Ölçülen kazanım:** Metin tabanlı şikâyet sınıflandırmasını NLP ve denetimli öğrenmeyle ilişkilendirir.

## 8. Büyük verinin 5V özelliği

Kaynak: `web-010`.

Büyük Verinin (Big Data) 5V özelliği aşağıdakilerden hangisidir?

- **A)** Vision, Value, Verify, Volume, Velocity
- **B)** Video, Voice, Visual, Virtual, Verified
- **C)** Hacim (Volume), Çeşitlilik (Variety), Hız (Velocity), Değer (Value), Doğruluk (Veracity)
- **D)** Veri, Verimlilik, Vizyon, Varsayım, Varlık

**Doğru cevap: C.** Hacim (Volume), Çeşitlilik (Variety), Hız (Velocity), Değer (Value), Doğruluk (Veracity)

**Açıklama:** Büyük Verinin 5V özelliği sunumda Hacim, Çeşitlilik, Hız, Değer ve Doğruluk olarak gösterilmiştir.

**Ölçülen kazanım:** Büyük verinin hacim, çeşitlilik, hız, değer ve doğruluk boyutlarını tanır.

## 9. Veri çeşitliliği

Kaynak: `web-059`.

Bir e-ticaret şirketi; mağaza içi kameralardan gelen müşteri dolaşım görüntülerini (video), sosyal medyadaki marka yorumlarını (metin) ve satın alma faturalarını (sayısal veriler) aynı anda birleştirerek anlamlı bir satış stratejisi oluşturmak istiyor. Bu durum Büyük Veri'nin (Big Data) en çok hangi "V" özelliğini vurgulamaktadır?

- **A)** Çeşitlilik (Variety)
- **B)** Hız (Velocity)
- **C)** Doğruluk (Veracity)
- **D)** Hacim (Volume)

**Doğru cevap: A.** Çeşitlilik (Variety)

**Açıklama:** Video, metin ve sayısal verilerin aynı anda işlenmesi, Büyük Veri'nin farklı veri formatlarını barındırma özelliği olan Çeşitlilik (Variety) kavramını temsil eder.

**Ölçülen kazanım:** Farklı veri biçimlerinin birlikte kullanılmasını çeşitlilik boyutuyla ilişkilendirir.

## 10. Derin öğrenme ve GPU

Kaynak: `web-058`.

Bir şirket otonom araçlar için yüksek çözünürlüklü kameralardan gelen anlık trafik videolarını analiz etmek istiyor. Veri hacmi petabaytlar seviyesinde ve kurallar geleneksel algoritmalarla manuel olarak kodlanamayacak kadar karmaşıktır. Bu şirketin teknoloji altyapısı tercihinde aşağıdakilerden hangisine öncelikli olarak yatırım yapması beklenir?

- **A)** Sadece yapısal verilerle çalışan kural tabanlı Makine Öğrenmesi (ML) algoritmalarına
- **B)** Derin Öğrenme (DL) ağlarını otonom şekilde eğitebilecek yüksek performanslı GPU donanımlarına
- **C)** Özellik çıkarımını manuel yapacak kalabalık bir insan veri etiketleme ekibine
- **D)** Oltalama (Phishing) saldırılarını engellemek için kurumsal ağ güvenlik duvarlarına

**Doğru cevap: B.** Derin Öğrenme (DL) ağlarını otonom şekilde eğitebilecek yüksek performanslı GPU donanımlarına

**Açıklama:** Otonom araçlar gibi çok yüksek hacimli ve karmaşık görsellerin işlendiği yapılar, otonom çalışan derin öğrenme (DL) ağlarına ve bunları besleyecek güçlü GPU donanımlarına ihtiyaç duyar.

**Ölçülen kazanım:** Yüksek hacimli karmaşık görüntü analizinde derin öğrenme ve GPU altyapısının rolünü tanır.

## Dil ve veri sınırı

[Aynı 10 sorunun İngilizce sunumu](../v2/ozak/questions.en.mjs), aynı kimlik, seçenek sırası, doğru yanıt ve sürümü kullanır. TR varsayılandır; [English giriş](https://sinav2.metintiryaki.com/ozak/?lang=en) paylaşılabilir. Bu çeviri eşleştirmesi ayrı psikometrik eşdeğerlik çalışması değildir.

Sorular gerçek katılımcı/müşteri verisi içermez. Soru bazında kuruma raporlama veya yeni kişisel veri toplama yetkisi oluşturmaz. Eski soru sürümünün kayıtları yeni sürümden ayrıdır; [işletim ve kabul sınırı](exam-v2.md#ozak-202612), [17 Kasım değişiklik kaydı](../history.md#ozak-selected10-pdf-2026-11-17).
