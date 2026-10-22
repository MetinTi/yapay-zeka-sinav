# Yapay Zeka Eğitimi — Tam İçerik Taslağı

> Kaynak: `mobile/assets/data/lessons.json` · 17 modül · Düzenleyip genişlettikten sonra `tools/handbook_to_lessons.py` veya doğrudan JSON ile uygulamaya aktarın.

---

## Modül 1: YAPAY ZEKAYA GİRİŞ VE TEMEL KAVRAMLAR

- **ID:** `modul-01-yapay-zekaya-gi-ri-s-ve-temel-kavram`
- **Alt başlık:** Handbook Bölüm 1 · ~6 dk okuma · ~10 dk toplam
- **Tahmini süre:** 10 dk


![artificial intelligence concept brain](assets/images/lessons/modul-01-00.jpg)

*Yapay zeka kavramsal görsel*

### 1.1 Yapay Zeka Nedir?

Yapay Zeka (YZ), insan zekasını taklit eden, öğrenebilen, problem çözebilen ve karar verebilen bilgisayar sistemlerinin tasarlanmasını inceleyen bilim dalıdır. İnsanın bilişsel yeteneklerini (öğrenme, akıl yürütme, algılama, dil anlama) makinelere kazandırmayı amaçlar.

Yapay Zekanın Tanımı ve Kapsamı

Yapay zeka üç ana kategoriye ayrılır:

- Dar YZ (Narrow AI): Belirli bir görevde uzmanlaşmış sistemlerdir. Örnek: Siri, Alexa, satranç programları, ChatGPT.
- Genel YZ (AGI): İnsan zekası seviyesinde her türlü görevi yapabilen sistemlerdir. Henüz mevcut değildir.
- Süper Zeka (Superintelligence): İnsan zekasını her alanda aşan teorik bir kavramdır.
YZ'nin Kısa Tarihi

Yapay zeka terimi resmi olarak 1956 yılında Dartmouth Konferansı'nda John McCarthy tarafından ortaya atılmıştır. Tarihsel dönemler:

- 1950-1956: Doğuş dönemi. Alan Turing'in Turing Testi kavramı.
- 1956-1974: Altın çağ. İlk YZ programları geliştirildi.
- 1974-1980: Birinci YZ kışı. Beklentilerin karşılanamaması.
- 1980-1987: Uzman sistemlerin yükselişi.
- 1987-1993: İkinci YZ kışı.
- 1993-2011: Sessiz büyüme. Makine öğrenmesinin gelişimi.
- 2011-Günümüz: Derin öğrenme devrimi ve büyük dil modelleri çağı.

> **İpucu:** Turing Testi (1950): Bir değerlendirici, metin üzerinden makine ile insan arasında ayrım yapamıyorsa makine 'zeki' sayılır. Test dil ve davranışı ölçer; gerçek anlayış veya bilinç kanıtlamaz. Günümüz LLM'leri bu tartışmayı yeniden gündeme getirmiştir.

Günlük Hayatta YZ Örnekleri

Akıllı telefon asistanları, sosyal medya akış algoritmaları, Netflix ve YouTube öneri sistemleri, e-posta spam filtreleri, navigasyon uygulamaları, yüz tanıma sistemleri, banka dolandırıcılık tespiti hayatımızdaki YZ örneklerinden bazılarıdır.


### 1.2 YZ vs Otomasyon vs Algoritmalar

Bu üç kavram sıkça birbirinin yerine kullanılır ancak aralarında önemli farklar vardır.

Kavramsal Farklılıklar

- Algoritma: Bir problemi çözmek için izlenen adım adım talimatlardır. Her algoritma YZ değildir, ancak her YZ sistemi algoritmalar kullanır.
- Otomasyon: Önceden tanımlanmış kurallara göre tekrarlayan görevleri makinelerin yapmasıdır. Öğrenme içermez.
- Yapay Zeka: Veriden öğrenen, deneyimle gelişen ve yeni durumlara adapte olabilen sistemlerdir.
Geleneksel Programlama vs YZ

Geleneksel programlamada geliştirici, kuralları açıkça kodlar: 'Eğer X olursa Y yap'. YZ'de ise sistem, örneklerden kuralları kendisi öğrenir. Geleneksel programlamada girdi + kurallar = çıktı iken, makine öğrenmesinde girdi + çıktı = kurallar (model) elde edilir.


> **İpucu:** Kısa yol: Geleneksel programlamada siz kuralları yazarsınız; makine öğrenmesinde model, örneklerden kuralları çıkarır.

- Algoritma — Ne yapar: adım adım talimat | Örnek: sıralama, rota hesabı | Veriden öğrenir mi: hayır
- Otomasyon — Ne yapar: sabit kuralları uygular | Örnek: fabrika hattı, zamanlanmış yedekleme | Veriden öğrenir mi: hayır
- Yapay Zeka — Ne yapar: veriden örüntü çıkarır | Örnek: spam filtresi, öneri motoru | Veriden öğrenir mi: evet
Karar Ağaçları ve Kural Tabanlı Sistemler

Kural tabanlı sistemler (uzman sistemler), 1980'lerde popüler olmuş ve insan uzmanların bilgisini 'eğer-o zaman' kuralları olarak kodlayan sistemlerdir. Tıbbi teşhis, finansal analiz gibi alanlarda kullanılmıştır; modern ML'den farklı olarak veriden öğrenmezler.

YZ Alt Alanları (İleri modüllerde derinleşeceğiz)

- Makine Öğrenmesi (ML) — Modül 2
- Derin Öğrenme ve sinir ağları — Modül 3
- Doğal Dil İşleme (NLP) — Modül 4
- Bilgisayarlı Görü (CV) — Modül 5
- Robotik, otonom sistemler ve karar destek uygulamaları
Yaygın Yanlış Anlamalar

- 'YZ her soruya doğru cevap verir' — Modeller hata yapar ve halüsinasyon üretebilir.
- 'ChatGPT gerçekten anlıyor' — Çoğunlukla olasılıksal metin üretir; bağlam penceresi sınırlıdır.
- 'Otomasyon = YZ' — Fabrika otomasyonu çoğu zaman sabit kuraldır, öğrenme içermez.
- 'Daha fazla veri her zaman daha iyi sonuç verir' — Veri kalitesi ve problem tanımı en az veri kadar önemlidir.

![AI history timeline Dartmouth](assets/images/lessons/modul-01-01.jpg)

*Yapay zekanın tarihsel gelişim çizelgesi*

### Modül sonu quiz

**S1.** Yapay zeka terimi ilk kez hangi yıl ve nerede ortaya atılmıştır?

- [A] 1950, Cambridge
- [B] 1956, Dartmouth Konferansı ✓
- [C] 1965, MIT
- [D] 1970, Stanford

**S2.** Aşağıdakilerden hangisi günlük hayatta karşılaştığımız bir YZ örneği DEĞİLDİR?

- [A] Netflix öneri sistemi
- [B] E-posta spam filtresi
- [C] Hesap makinesi ✓
- [D] Yüz tanıma

**S3.** Dar YZ (Narrow AI) ne anlama gelir?

- [A] İnsan zekasını her alanda aşan YZ
- [B] Belirli bir görevde uzmanlaşmış YZ ✓
- [C] Sınırlı bilgisayar gücü olan YZ
- [D] Sadece veri analizi yapan YZ

**S4.** Aşağıdakilerden hangisi YZ'nin tarihsel dönemlerinden 'YZ kışı' olarak adlandırılan dönemi en iyi tanımlar?

- [A] YZ'nin altın çağı
- [B] Beklentilerin karşılanamayıp fonların kesildiği dönem ✓
- [C] Derin öğrenmenin yükselişi
- [D] Büyük dil modellerinin ortaya çıkışı

**S5.** Algoritma, otomasyon ve yapay zeka arasındaki farkı en doğru anlatan ifade hangisidir?

- [A] Üçü de aynı şeydir, farklı isimler
- [B] Algoritma adımlardır, otomasyon kuralı uygular, YZ veriden öğrenir ✓
- [C] Yapay zeka algoritmadan basittir
- [D] Otomasyon her zaman YZ içerir

**S6.** Turing Testi'nin amacı nedir?

- [A] Bir bilgisayarın hızını ölçmek
- [B] Bir makinenin insan gibi düşünüp düşünemeyeceğini test etmek ✓
- [C] Programlama hatalarını bulmak
- [D] Veri tabanlarını test etmek

**S7.** Geleneksel programlama ile makine öğrenmesi arasındaki temel paradigma farkı nedir?

- [A] Geleneksel programlama daha hızlıdır
- [B] Geleneksel: girdi+kurallar=çıktı; ML: girdi+çıktı=kurallar (model) ✓
- [C] ML daha az veri kullanır
- [D] Geleneksel programlama internet gerektirir

**S8.** AGI (Artificial General Intelligence) ile Narrow AI arasındaki temel fark nedir?

- [A] AGI sadece teorik bir kavramdır, gerçekleşmemiştir; Narrow AI ise spesifik görevlerde uzmandır ✓
- [B] AGI daha az veri ister
- [C] Narrow AI her zaman daha pahalıdır
- [D] AGI sadece görsel işleme yapar

**S9.** 1980'lerin uzman sistemleri (expert systems) modern makine öğrenmesinden hangi yönüyle ayrılır?

- [A] Daha hızlı çalışırlar
- [B] Veriden öğrenmek yerine insan uzmanların bilgisini 'eğer-o zaman' kuralları olarak kodlarlar ✓
- [C] Sadece internet bağlantısıyla çalışırlar
- [D] Her durumda daha doğru sonuç verirler


---

## Modül 2: MAKİNE ÖĞRENMESİ (MACHINE LEARNING - ML)

- **ID:** `modul-02-maki-ne-ogrenmesi-machine-learning-m`
- **Alt başlık:** Handbook Bölüm 2 · ~40 dk okuma
- **Tahmini süre:** 40 dk


![supervised unsupervised reinforcement learning](assets/images/lessons/modul-02-00.jpg)

*ML türleri karşılaştırma şeması*
Yarı-Denetimli ve Transfer Öğrenme

Makine öğrenmesi, bilgisayarların verilerden öğrenerek açık bir programlama olmaksızın görevleri yerine getirebilmesini sağlayan yapay zeka alt dalıdır. Arthur Samuel'in 1959'daki tanımıyla: 'Bilgisayarlara açıkça programlanmadan öğrenme yeteneği kazandıran çalışma alanı'.


### 2.1 Makine Öğrenmesine Giriş

ML, büyük veri kümelerinden örüntüleri otomatik olarak keşfeder. Modern dünyada üretilen verinin manuel olarak işlenmesi imkansızdır; ML, bu veriden değer üretmenin en etkili yoludur.

ML Nedir ve Neden Önemlidir?

Bir e-posta spam filtresi düşünün. Geleneksel yaklaşımda kuralları el ile yazarsınız. ML yaklaşımında ise binlerce spam ve normal e-posta örneği verir, sistemin spam'i ayırt eden özellikleri kendisinin keşfetmesini sağlarsınız.

Geleneksel Programlama vs ML

- Müşteri davranışı tahmini ve segmentasyon Talep tahmini ve stok yönetimi Dolandırıcılık tespiti Kişiselleştirilmiş pazarlama ve öneri sistemleri Kestirimci bakım (predictive maintenance)
- Risk analizi ve kredi skorlama
Etiketli verilerle eğitim yapılır. Sistem, girdi-çıktı çiftlerinden öğrenir.

- Sınıflandırma (Classification): Kategorik çıktılar. Örnek: spam tespiti, tümör sınıflandırma.
- Regresyon (Regression): Sürekli sayısal çıktılar. Örnek: ev fiyatı tahmini, hisse senedi tahmini.
Denetimli Öğrenme (Supervised Learning)

Etiketsiz verilerle çalışır. Sistem, veri içindeki gizli yapıları kendisi keşfeder.

- Kümeleme (Clustering): Benzer örnekleri gruplara ayırma. Örnek: müşteri segmentasyonu.
- Boyut İndirgeme: PCA, t-SNE gibi teknikler ile yüksek boyutlu veriyi sıkıştırma.
- Anomali Tespiti: Olağandışı durumları yakalama.
Denetimsiz Öğrenme (Unsupervised Learning)

Ajan, ortamla etkileşime girer ve ödül/ceza sinyalleriyle öğrenir.

- Temel kavramlar: Ajan (agent), ortam (environment), durum (state), eylem (action), ödül (reward).
- Örnekler: AlphaGo, oyun YZ'leri, robotik kontrol, otonom araçlar.
Pekiştirmeli Öğrenme (Reinforcement Learning)

Yarı-denetimli öğrenme az miktarda etiketli ve çok miktarda etiketsiz veriyle çalışır. Transfer öğrenme ise bir görev için eğitilmiş modelin başka bir göreve uyarlanmasıdır.


![machine learning workflow pipeline](assets/images/lessons/modul-02-01.jpg)

*ML proje aşamaları akış şeması*

### 5. Overfitting ve Underfitting

- Karar Ağaçları (Decision Trees): Anlaşılması kolay, ağaç yapısında karar veren modeller.
- Random Forest: Birden fazla karar ağacının oylama yaptığı topluluk yöntemi.
- Support Vector Machines (SVM): Sınıfları en iyi ayıran hiper-düzlemi bulan algoritma.
- K-Nearest Neighbors (KNN): En yakın K komşuya bakarak sınıflandırma yapar.
- Naive Bayes: Bayes teoremine dayalı olasılıksal sınıflandırıcı.
- Linear/Logistic Regression: En temel sürekli değer ve sınıflandırma algoritmaları.
- Gradient Boosting (XGBoost, LightGBM): Yarışmaların favorisi olan güçlü topluluk yöntemleri.
Başarılı bir ML projesi sistematik aşamalar gerektirir. CRISP-DM en yaygın metodolojidir.


### 2.4 ML Projesinin Aşamaları

Projenin %70-80'i veri hazırlığında geçer. Veriler farklı kaynaklardan toplanır, temizlenir, normalleştirilir ve formatlanır.


### 1. Veri Toplama ve Hazırlama

Ham veriden anlamlı özellikler çıkarma sanatıdır. 'Çöp girerse çöp çıkar' prensibi geçerlidir.


### 2. Özellik Mühendisliği

Probleme uygun algoritma seçilir, veri eğitim/doğrulama/test olarak bölünür, hiperparametreler ayarlanır.


### 3. Model Seçimi ve Eğitimi

- Accuracy (Doğruluk): Doğru tahminlerin oranı. Dengesiz verilerde yanıltıcı olabilir.
- Precision (Kesinlik): Pozitif tahminlerin ne kadarı gerçekten pozitif? Recall (Duyarlılık): Gerçek pozitiflerin ne kadarını yakaladık? F1-Score: Precision ve Recall'un harmonik ortalaması.

### 4. Değerlendirme Metrikleri

Overfitting: Modelin eğitim verisini ezberlemesi, yeni veride başarısız olması. Underfitting: Modelin veriyi yeterince öğrenememesi. Doğru denge çapraz doğrulama ile bulunur.


![classification regression difference](assets/images/lessons/modul-02-02.jpg)

*Sınıflandırma vs regresyon görseli*

### Modül sonu quiz

**S1.** Etiketli verilerle yapılan öğrenme türü hangisidir?

- [A] Denetimsiz öğrenme
- [B] Denetimli öğrenme ✓
- [C] Pekiştirmeli öğrenme
- [D] Transfer öğrenme

**S2.** Aşağıdakilerden hangisi bir sınıflandırma (classification) problemidir?

- [A] Ev fiyatı tahmini
- [B] Hisse senedi değerini tahmin etme
- [C] E-postanın spam olup olmadığını belirleme ✓
- [D] Sıcaklık tahmini

**S3.** Pekiştirmeli öğrenmenin temel kavramlarından biri nedir?

- [A] Etiketli veri
- [B] Ödül (reward) ✓
- [C] PCA
- [D] Tokenization

**S4.** F1-Score neyi ifade eder?

- [A] Sadece doğruluk oranını ✓
- [B] Precision ve Recall'un harmonik ortalamasını
- [C] Modelin eğitim süresini
- [D] Modelin parametre sayısını

**S5.** Overfitting (aşırı uydurma) ne demektir?

- [A] Modelin yeterince öğrenememesi ✓
- [B] Modelin eğitim verisini ezberleyip yeni veride başarısız olması
- [C] Modelin çok hızlı eğitilmesi
- [D] Veri kümesinin çok büyük olması

**S6.** Random Forest algoritmasının tek bir karar ağacına göre avantajı nedir?

- [A] Daha hızlı çalışır ✓
- [B] Birden fazla ağacın oylama yapmasıyla daha doğru ve genelleyici
- [C] Daha az bellek kullanır
- [D] Daha kolay yorumlanır

**S7.** Dengesiz (imbalanced) bir veri kümesinde (örn: %99 negatif, %1 pozitif) neden 'accuracy' yanıltıcı olabilir?

- [A] Çünkü accuracy hesaplaması yavaştır ✓
- [B] Çünkü her şeyi negatif tahmin eden bir model bile %99 accuracy
- [C] Accuracy sadece regresyonda kullanılır
- [D] Dengesiz veride accuracy hesaplanamaz

**S8.** K-Nearest Neighbors (KNN) algoritmasının en büyük dezavantajı nedir?

- [A] Eğitim aşaması çok uzundur ✓
- [B] Tahmin aşamasında tüm veri kümesini kontrol ettiği için büyük
- [C] Sadece görüntü verisiyle çalışır
- [D] Sadece denetimsiz öğrenmede kullanılır

**S9.** CRISP-DM metodolojisinde 'Veri Hazırlama' aşaması neden tüm projenin %70-80'ini kaplar?

- [A] Çünkü modeller çok yavaştır ✓
- [B] Veri toplama, temizleme, dönüştürme ve özellik mühendisliği
- [C] Çünkü algoritmalar otomatik çalışır
- [D] Çünkü deployment çok kolaydır


---

## Modül 3: DERİN ÖĞRENME (DEEP LEARNING - DL)

- **ID:** `modul-03-deri-n-ogrenme-deep-learning-dl`
- **Alt başlık:** Handbook Bölüm 3 · ~45 dk okuma
- **Tahmini süre:** 45 dk


![neural network architecture](assets/images/lessons/modul-03-00.jpg)

*Yapay sinir ağı yapısı*
Gradient Descent ve Optimizasyon


### 3.1 Derin Öğrenmeye Giriş

Derin öğrenme, çok katmanlı yapay sinir ağlarını kullanan makine öğrenmesinin alt dalıdır. Klasik ML'den farkı, özellik mühendisliğini otomatik yapması ve büyük veriyle daha iyi performans göstermesidir.

DL Nedir? ML'den Farkları

Sinir ağındaki gizli katman sayısının fazla olmasından gelir. Klasik sinir ağları 1-2 gizli katmana sahipken, derin ağlar onlarca hatta yüzlerce katmandan oluşabilir.

Neden 'Derin' Öğrenme?

Derin öğrenmenin patlaması üç faktöre dayanır: (1) GPU'ların paralel hesaplama gücü, (2) ImageNet gibi büyük veri kümelerinin varlığı, (3) Yeni mimari ve eğitim teknikleri (ReLU, dropout, batch normalization).


### 3.2 Yapay Sinir Ağları (ANN)

Yapay sinir ağları, insan beynindeki nöronlardan ilham alır. Bir yapay nöron girdileri alır, ağırlıklarla çarpar, toplar ve aktivasyon fonksiyonundan geçirerek çıktı üretir.

Biyolojik Nöronlardan Yapay Nörona

Perceptron, en basit sinir ağı birimidir (Frank Rosenblatt, 1957). Çok Katmanlı Perceptron (MLP), girdi katmanı, bir veya daha fazla gizli katman ve çıktı katmanından oluşur.

Perceptron ve Çok Katmanlı Ağlar

- ReLU (Rectified Linear Unit): max(0, x). Derin ağlarda en yaygın kullanılan fonksiyondur.
- Sigmoid: 0 ile 1 arasında değer üretir. İkili sınıflandırma çıktısı için kullanılır.
- Tanh: -1 ile 1 arasında değer üretir.
- Softmax: Çok sınıflı sınıflandırma çıktıları için olasılık dağılımı üretir.
Aktivasyon Fonksiyonları

Geri yayılım, sinir ağlarının nasıl öğrendiğinin temelidir. Çıktıdaki hata, ağ üzerinden geriye doğru yayılarak her ağırlığın hataya katkısı hesaplanır ve ağırlıklar güncellenir.

Backpropagation Algoritması

Gradient descent, kayıp fonksiyonunu minimize eden algoritmadır. Varyantları: SGD (Stochastic), Mini-batch GD, Adam, RMSprop. Adam, derin öğrenmede en popüler optimizer'dır.


![convolutional neural network CNN](assets/images/lessons/modul-03-01.jpg)

*CNN mimarisi - convolution, pooling katmanları*
Fine-Tuning Yaklaşımları


### 3.3 İleri Düzey DL Mimarileri

CNN'ler özellikle görüntü işleme için tasarlanmıştır. Convolution katmanları yerel özellikleri (kenarlar, dokular) tespit eder, pooling katmanları boyutu azaltır.

- Uygulamalar: Yüz tanıma, tıbbi görüntü analizi, otonom araçlar, OCR.
- Önemli mimariler: LeNet, AlexNet, VGG, ResNet, EfficientNet.
Convolutional Neural Networks (CNN)

RNN'ler sıralı veri (metin, ses, zaman serisi) için tasarlanmıştır. Geçmiş bilgiyi 'hafıza' olarak tutar.

- LSTM (Long Short-Term Memory): Uzun vadeli bağımlılıkları öğrenebilen
- GRU (Gated Recurrent Unit): LSTM'in daha basit versiyonu.
- Uygulamalar: Metin üretimi, makine çevirisi, zaman serisi tahmini.
Recurrent Neural Networks (RNN) ve LSTM

Ian Goodfellow tarafından 2014'te geliştirilen GAN'lar, üretici (generator) ve ayırt edici (discriminator) iki ağın rekabetiyle çalışır.

- Uygulamalar: Deepfake, sanat üretimi, veri artırma, görüntü düzeltme.
Generative Adversarial Networks (GAN)


### 2017'de Google'ın 'Attention is All You Need' makalesiyle tanıtıldı. Self-attention mekanizması sayesinde RNN'lerden çok daha hızlı ve etkili.

- BERT: Google'ın çift yönlü dil modeli, anlama görevlerinde başarılı.
- GPT serisi: OpenAI'nin üretken dil modeli.
- Modern büyük dil modellerinin (Claude, Gemini, LLaMA) temelidir.
Transfer öğrenme, bir görev için eğitilmiş büyük modelin başka bir görev için uyarlanmasıdır. Az veriyle yüksek performans sağlar.


### 3.4 Transfer Learning ve Fine-Tuning

ImageNet'te eğitilmiş ResNet'i tıbbi görüntü analizine, BERT'i Türkçe NLP'ye uyarlayabilirsiniz. Hugging Face Hub binlerce hazır model sunar.

Önceden Eğitilmiş Modeller

- Feature extraction: Sadece son katmanı eğitme.
- Full fine-tuning: Tüm ağırlıkları az miktarda güncelleme.
- LoRA (Low-Rank Adaptation): Verimli fine-tuning tekniği.

![transformer architecture attention](assets/images/lessons/modul-03-02.jpg)

*Transformer ve attention mekanizması*

![activation functions ReLU sigmoid](assets/images/lessons/modul-03-03.jpg)

*Aktivasyon fonksiyonları grafikleri*

### Modül sonu quiz

**S1.** Derin öğrenme neyin alt dalıdır?

- [A] Robotiğin
- [B] Makine öğrenmesinin ✓
- [C] Veritabanı yönetiminin
- [D] Web programlamanın

**S2.** Görüntü işleme için en yaygın kullanılan derin öğrenme mimarisi hangisidir?

- [A] RNN
- [B] CNN (Convolutional Neural Network) ✓
- [C] Transformer
- [D] SVM

**S3.** ChatGPT, Claude gibi modern dil modellerinin temelindeki mimari nedir?

- [A] CNN
- [B] RNN
- [C] Transformer ✓
- [D] Decision Tree

**S4.** ReLU aktivasyon fonksiyonu nasıl çalışır?

- [A] Her zaman 1 değeri döner ✓
- [B] max(0, x) --- negatif değerleri 0 yapar, pozitifleri aynen
- [C] Sadece 0 veya 1 üretir
- [D] -1 ile 1 arasında değer üretir

**S5.** Backpropagation algoritmasının amacı nedir?

- [A] Veriyi tersine sıralamak ✓
- [B] Çıktıdaki hatayı ağ üzerinden geriye yayarak ağırlıkları
- [C] Modeli daha hızlı çalıştırmak
- [D] Veri kümesini bölmek

**S6.** GAN (Generative Adversarial Network) nasıl çalışır?

- [A] Tek bir ağ veri üretir ✓
- [B] Üretici (generator) ve ayırt edici (discriminator) iki ağın
- [C] Sadece sınıflandırma yapar
- [D] Sadece zaman serisi tahmini yapar

**S7.** Transformer mimarisindeki 'self-attention' mekanizmasının RNN'lere kıyasla en büyük avantajı nedir?

- [A] Daha az bellek kullanır ✓
- [B] Sıralı işleme yerine paralel işleme yaparak uzun bağımlılıkları
- [C] Sadece kısa metinlerle çalışır
- [D] Eğitim verisi gerektirmez

**S8.** Transfer learning'in en önemli avantajı nedir?

- [A] Modeli sıfırdan eğitir ✓
- [B] Önceden büyük veriyle eğitilmiş modelleri kullanarak az veriyle
- [C] Sadece görüntülerde çalışır
- [D] İnternet bağlantısı gerektirmez

**S9.** LSTM'in standart RNN'e göre çözdüğü problem nedir?

- [A] Daha hızlı çalışır ✓
- [B] Vanishing gradient problemini çözerek uzun vadeli
- [C] Sadece görüntü işleyebilir
- [D] Eğitim verisi gerektirmez


---

## Modül 4: DOĞAL DİL İŞLEME (NLP)

- **ID:** `modul-04-dogal-di-l-i-sleme-nlp`
- **Alt başlık:** Handbook Bölüm 4 · ~35 dk okuma
- **Tahmini süre:** 35 dk


![natural language processing pipeline](assets/images/lessons/modul-04-00.jpg)

*NLP pipeline ve teknikleri*

### 4.2 Temel NLP Teknikleri

NLP, bilgisayarların insan dilini anlama, yorumlama ve üretme yeteneğini geliştirmeyi amaçlayan YZ alt dalıdır. Hesaplamalı dilbilim, makine öğrenmesi ve derin öğrenmenin kesişimindedir.

Dil ve Bilgisayarlar

- Belirsizlik (Ambiguity): 'Yüz' kelimesi sayı mı, organ mı, fiil mi? Bağlam (Context): Aynı kelime farklı bağlamlarda farklı anlamlara gelir.
- Dil çeşitliliği: Dünyada 7000+ dil, her birinin kendine özgü yapısı.
- İronik/mecazi ifadeler: Sözcüklerin yüzeysel anlamından farklı kullanımı.
- Türkçe gibi sondan eklemeli dillerin morfolojik karmaşıklığı.
- Tokenization (Simgeleme): Metni kelime veya alt-kelime parçalarına ayırma.
- Stemming: Kelime köklerini bulma (örn: 'çalışıyorum' → 'çalış').
- Lemmatization: Sözlük formuna indirgeme (örn: 'gidiyordum' → 'gitmek').
- Part-of-Speech (POS) Tagging: Kelimelerin türlerini belirleme (isim, fiil, sıfat).
- Named Entity Recognition (NER): Kişi, yer, organizasyon isimlerini tespit etme.
- Word Embeddings: Kelimeleri vektör uzayında temsil etme (Word2Vec,

![word2vec embeddings vector space](assets/images/lessons/modul-04-01.jpg)

*Word embeddings vektör uzayı*
İş Dünyasında LLM Kullanımı

- Sentiment Analysis (Duygu Analizi): Metnin duygusal tonunu (pozitif/negatif/nötr) tespit etme. Sosyal medya analizi, müşteri yorumları.
- Makine Çevirisi: Google Translate, DeepL gibi sistemler. Modern modeller Transformer tabanlıdır.
- Soru-Cevap Sistemleri: Belge veya bilgi tabanından soruları cevaplama.
- Text Summarization (Metin Özetleme): Extractive (özgün cümleleri çıkarma) ve abstractive (yeni cümleler üretme) yaklaşımlar.
- Chatbot'lar: Müşteri hizmetleri, kişisel asistanlar.
- Konuşma tanıma ve sentezi: Siri, Alexa, çağrı merkezi otomasyonu.

### 4.4 Büyük Dil Modelleri (LLM)

- GPT serisi (OpenAI): GPT-3.5, GPT-4, GPT-4o, GPT-5.
- Claude (Anthropic): Claude Opus, Sonnet, Haiku ailesi.
- Gemini (Google): Multimodal yetenekleriyle öne çıkar.
- LLaMA (Meta): Açık kaynak alternatifler.
- Mistral, Qwen, DeepSeek: Yükselen modeller.
- Net ve spesifik talimatlar verme.
- Bağlam sağlama ve rol atama.
- Few-shot örnekler kullanma.
- Chain-of-thought (adım adım düşünme) tetikleme.
- Çıktı formatını açıkça belirtme.
Prompt Engineering Temel Prensipleri

Dil modellerini harici bilgi kaynaklarıyla zenginleştirme tekniği. Modelin hafızasında olmayan güncel veya özel bilgileri kullanmasını sağlar. Şirket içi belgeler, yasal mevzuat gibi alanlarda kritiktir.

RAG (Retrieval Augmented Generation)

- Müşteri hizmetleri otomasyonu İçerik üretimi ve düzenleme Kod yazma ve gözden geçirme Belge analizi ve özetleme Eğitim ve onboarding süreçleri

![GPT Claude LLM comparison](assets/images/lessons/modul-04-02.png)

*Büyük dil modelleri karşılaştırma*

### Modül sonu quiz

**S1.** Tokenization ne demektir?

- [A] Verilerin şifrelenmesi
- [B] Metnin kelime veya alt-kelime parçalarına ayrılması ✓
- [C] Modellerin eğitilmesi
- [D] Veritabanı sorgulaması

**S2.** LLM kısaltması neyi ifade eder?

- [A] Linear Learning Machine
- [B] Large Language Model ✓
- [C] Logical Learning Method
- [D] Limited Language Memory

**S3.** Aşağıdakilerden hangisi bir NLP uygulaması DEĞİLDİR?

- [A] Makine çevirisi
- [B] Duygu analizi
- [C] Yüz tanıma ✓
- [D] Metin özetleme

**S4.** Word Embedding (kelime gömme) nedir?

- [A] Kelimeleri silme tekniği ✓
- [B] Kelimelerin anlamsal ilişkilerini koruyarak vektör uzayında
- [C] Yazım hatalarını bulma yöntemi
- [D] Cümle uzunluğunu ölçme

**S5.** Stemming ile Lemmatization arasındaki fark nedir?

- [A] İkisi de aynı şeydir ✓
- [B] Stemming kelimenin kökünü kesip atar; Lemmatization sözlük
- [C] Stemming sadece İngilizce çalışır
- [D] Lemmatization sadece sayılarla çalışır

**S6.** NER (Named Entity Recognition) ne işe yarar?

- [A] Sayıları toplar ✓
- [B] Metindeki kişi, yer, organizasyon gibi adlandırılmış varlıkları
- [C] Cümleleri çevirir
- [D] Dosya isimlerini değiştirir

**S7.** RAG (Retrieval Augmented Generation) tekniği neyi çözer?

- [A] Modeli hızlandırır ✓
- [B] LLM'nin eğitim verisinde olmayan güncel veya özel bilgileri
- [C] Sadece görüntü işlemede kullanılır
- [D] Veri toplamayı otomatize eder

**S8.** Chain-of-Thought (CoT) prompting tekniği LLM'lerde neyi iyileştirir?

- [A] Sadece çıktının uzunluğunu ✓
- [B] Modelin adım adım akıl yürütmesini tetikleyerek karmaşık
- [C] Modelin renk algısını
- [D] Eğitim süresini

**S9.** Türkçe gibi sondan eklemeli (agglutinative) dillerin NLP'de oluşturduğu zorluk nedir?

- [A] Sadece kısa kelimeleri var ✓
- [B] Tek bir kelime köküne çok sayıda ek alarak teorik olarak
- [C] Hiç zorluk oluşturmaz
- [D] Sadece sözel iletişimde sorun olur


---

## Modül 5: BİLGİSAYARLI GÖRÜ (COMPUTER VISION)

- **ID:** `modul-05-bi-lgi-sayarli-goru-computer-vision`
- **Alt başlık:** Handbook Bölüm 5 · ~30 dk okuma
- **Tahmini süre:** 30 dk


![object detection YOLO bounding box](assets/images/lessons/modul-05-00.jpg)

*Nesne tespiti örnekleri*

### 5.1 Görüntü İşleme Temelleri

Dijital görüntü, pixel adı verilen küçük renkli karelerden oluşan bir matristir. Renkli görüntüler RGB (kırmızı-yeşil-mavi) kanallarıyla temsil edilir. Her pixel 0-255 arası değerler alır.

Dijital Görüntüler ve Pixel'ler

- Yeniden boyutlandırma ve kırpma Gri tonlamaya çevirme Histogram eşitleme (kontrast iyileştirme)
- Gürültü azaltma (Gaussian blur, median filter)
- Kenar tespiti (Sobel, Canny edge detection)
- Veri artırma (data augmentation): rotasyon, çevirme, parlaklık ayarı
- Nesne Tanıma ve Tespiti: Görüntüdeki nesneleri sınıflandırma ve konumlarını bulma. YOLO, Faster R-CNN gibi modeller.
- Yüz Tanıma: Biometrik kimlik doğrulama, sosyal medya etiketleme, güvenlik sistemleri.
- OCR (Optik Karakter Tanıma): Belgelerden metin çıkarma, plaka tanıma.
- Tıbbi Görüntü Analizi: MR, BT, röntgen üzerinde hastalık tespiti. Cilt kanseri taraması, retinopati tespiti.
- Otonom Araçlarda Görü Sistemleri: Tesla, Waymo gibi sistemler kameralarla yol algılama yapar.
- Endüstriyel Kalite Kontrol: Üretim hattında kusurlu ürün tespiti.
- Semantik segmentasyon: Her pikseli bir sınıfa atama (yol, gökyüzü, araç).

![face recognition biometric](assets/images/lessons/modul-05-01.jpg)

*Yüz tanıma sistemleri*
İş Dünyasında Yaratıcı YZ Kullanımı

- DALL-E (OpenAI): Metinden görsel üreten ilk büyük model.
- Midjourney: Sanatsal kalitesiyle öne çıkan platform.
- Stable Diffusion: Açık kaynak, yerel olarak çalıştırılabilen model.
- Adobe Firefly: Ticari kullanım için güvenli üretim.
- Sora, Runway, Veo: Metinden video üreten modeller.
Üretken Görsel YZ Modelleri

- Reklam ve pazarlama görselleri Ürün konsept tasarımı Storyboard ve mockup hazırlama Sosyal medya içerikleri Eğitim materyalleri ve illüstrasyonlar

![stable diffusion text to image](assets/images/lessons/modul-05-02.jpg)

*Stable Diffusion ile görsel üretimi*

### Modül sonu quiz

**S1.** Dijital bir görüntüyü oluşturan en küçük birim nedir?

- [A] Bit
- [B] Pixel ✓
- [C] Byte
- [D] Voksel

**S2.** DALL-E, Midjourney ve Stable Diffusion ne tür modellerdir?

- [A] Metin sınıflandırma
- [B] Metinden görsel üretme ✓
- [C] Ses tanıma
- [D] Veritabanı yönetimi

**S3.** OCR neyi yapar?

- [A] Online oyun simülasyonu
- [B] Görüntülerden metin çıkarma (Optik Karakter Tanıma) ✓
- [C] Otomatik renklendirme
- [D] Görüntü sıkıştırma

**S4.** Bir RGB görüntüde her pixel kaç değerle temsil edilir?

- [A] 1 değer ✓
- [B] 3 değer (kırmızı, yeşil, mavi kanalları)
- [C] 10 değer
- [D] 256 değer

**S5.** Object Detection (nesne tespiti) ve Image Classification (görüntü sınıflandırma) arasındaki temel fark nedir?

- [A] İkisi de aynı şeydir ✓
- [B] Classification tüm görüntüye tek etiket verir; Detection
- [C] Classification daha yavaştır
- [D] Detection sadece siyah-beyaz görüntülerle çalışır

**S6.** Semantic segmentation nedir?

- [A] Görüntüyü ikiye bölme ✓
- [B] Görüntüdeki her pixeli bir sınıfa atama (yol, gökyüzü, araç
- [C] Görüntü sıkıştırma
- [D] Renk paleti çıkarma

**S7.** Data augmentation (veri artırma) tekniği neden kullanılır?

- [A] Sadece dosya boyutunu artırmak için ✓
- [B] Eğitim verisini rotasyon, çevirme, kırpma gibi dönüşümlerle
- [C] Verileri silmek için
- [D] Sadece renkli görüntülerde çalışır

**S8.** Stable Diffusion'ın DALL-E'den temel farkı nedir?

- [A] Daha az kaliteli üretir ✓
- [B] Açık kaynak olduğu için kendi donanımınızda lokal olarak
- [C] Sadece İngilizce çalışır
- [D] Sadece siyah-beyaz görsel üretir

**S9.** YOLO (You Only Look Once) algoritmasını diğer nesne tespit algoritmalarından ayıran özellik nedir?

- [A] Sadece tek nesne tespit eder ✓
- [B] Tek geçişte (single pass) hem nesne sınıfını hem konumunu
- [C] İnternet gerektirir
- [D] Sadece insan tespit eder


---

## Modül 6: BÜYÜK VERİ (BIG DATA) VE YZ

- **ID:** `modul-06-buyuk-veri-big-data-ve-yz`
- **Alt başlık:** Handbook Bölüm 6 · ~25 dk okuma
- **Tahmini süre:** 25 dk


![big data 5V volume velocity variety veracity](assets/images/lessons/modul-06-00.jpg)

*Big Data 5V şeması*

### 6.2 Big Data Teknolojileri

- Volume (Hacim): Veri miktarı (TB, PB, EB).
- Velocity (Hız): Verinin oluşma ve işlenme hızı (saniye başına milyonlarca olay).
- Variety (Çeşitlilik): Yapılandırılmış, yarı-yapılandırılmış, yapılandırılmamış veri (metin, görsel, video, ses).
- Veracity (Doğruluk): Veri kalitesi ve güvenilirliği.
- Value (Değer): Veriden çıkarılan iş değeri.

### 5V: Big Data'nın Boyutları

Geleneksel veri tabanları yapılandırılmış, sınırlı boyutta veriyle çalışır. Big Data ise petabaytlarca yapılandırılmamış veriyi dağıtık sistemlerle işler.

Geleneksel Veri vs Büyük Veri

- Data Warehouse: Yapılandırılmış, temizlenmiş veri için. Analitik raporlama amaçlı.
- Data Lake: Ham veriyi tüm formatlarda saklar. Esneklik sağlar.
- Data Lakehouse: Her ikisinin birleşimi (Databricks, Snowflake).
- Hadoop Ekosistemi: HDFS (dağıtık dosya sistemi), MapReduce (paralel işleme), YARN (kaynak yönetimi).
- Apache Spark: Hadoop'tan 100 kat hızlı bellek-içi işleme motoru.
Spark MLlib makine öğrenmesi için.

- NoSQL Veritabanları: MongoDB (belge), Cassandra (sütun), Neo4j (graf),
- Dağıtık Sistemler: Kafka (mesajlaşma), Flink (akış işleme),
- Bulut Veri Platformları: Snowflake, Databricks, AWS Redshift, Google

![hadoop spark ecosystem architecture](assets/images/lessons/modul-06-01.jpg)

*Hadoop ve Spark ekosistem mimarisi*
Gerçek Zamanlı Veri İşleme ve ML


### 6.3 Big Data ve YZ İlişkisi

'Veri, YZ'nin yakıtıdır' özdeyişi boşuna değildir. Modern YZ modelleri, özellikle derin öğrenme, büyük miktarda veri gerektirir.

Eksik veri imputasyonu, aykırı değer tespiti, veri dengeleme (oversampling, undersampling), veri standardizasyonu kritik adımlardır.

Veri Kalitesi ve Önişleme

Feature Store, özelliklerin tek yerden yönetildiği merkezi sistemdir (Feast, Tecton). Veri tutarlılığı ve yeniden kullanımı sağlar.

Feature Stores ve ML Altyapısı

Streaming ML (Kafka + Spark Streaming + ML modelleri) ile gerçek zamanlı tahmin yapılır. Örnek: Anlık dolandırıcılık tespiti, dinamik fiyatlandırma.


### Modül sonu quiz

**S1.** Big Data'nın 5V'sinden olmayan hangisidir?

- [A] Volume
- [B] Velocity
- [C] Variety
- [D] Virtuality ✓

**S2.** Apache Spark'ın Hadoop MapReduce'a göre temel avantajı nedir?

- [A] Daha ucuzdur
- [B] Bellek-içi (in-memory) işleme ile çok daha hızlıdır ✓
- [C] Daha az veri işler
- [D] Sadece görüntü verisi için çalışır

**S3.** Aşağıdakilerden hangisi bir NoSQL veritabanıdır?

- [A] MySQL
- [B] PostgreSQL
- [C] MongoDB ✓
- [D] Oracle

**S4.** Data Warehouse ile Data Lake arasındaki temel fark nedir?

- [A] İkisi de aynıdır ✓
- [B] Data Warehouse yapılandırılmış ve işlenmiş veri için, Data Lake
- [C] Data Lake daha pahalıdır
- [D] Data Warehouse sadece görsel veri saklar

**S5.** Big Data'nın 'Veracity' boyutu neyi ifade eder?

- [A] Veri miktarını ✓
- [B] Veri kalitesi ve güvenilirliğini
- [C] Veri hızını
- [D] Veri tipi çeşitliliğini

**S6.** Veri YZ için neden bu kadar kritiktir?

- [A] Çünkü disk doldurur ✓
- [B] Çünkü modern YZ modelleri, özellikle derin öğrenme, büyük
- [C] Sadece görsel olduğu için
- [D] Veri hiç önemli değildir

**S7.** Feature Store'un (özellik deposu) ML pipeline'larındaki rolü nedir?

- [A] Sadece veri yedekleme ✓
- [B] Özelliklerin merkezi yönetimi, eğitim-production tutarlılığı ve
- [C] Sadece görsel veri depolama
- [D] Internet bağlantısı sağlama

**S8.** Streaming ML (akış makine öğrenmesi) hangi senaryoda kritiktir?

- [A] Aylık rapor üretiminde ✓
- [B] Anlık dolandırıcılık tespiti, dinamik fiyatlandırma gibi gerçek
- [C] Sadece offline veri analizinde
- [D] Sadece veri yedeklemede

**S9.** Lakehouse mimarisi (Databricks, Snowflake) neyi çözer?

- [A] Sadece performans sorunlarını ✓
- [B] Data Warehouse'un yapılandırılmış sorgulama yeteneği ile Data
- [C] Sadece görsel veri yönetir
- [D] İnternet hızını artırır


---

## Modül 7: NESNELERIN İNTERNETİ (IoT) VE YZ

- **ID:** `modul-07-nesnelerin-i-nterneti-iot-ve-yz`
- **Alt başlık:** Handbook Bölüm 7 · ~25 dk okuma
- **Tahmini süre:** 25 dk


![IoT architecture layers](assets/images/lessons/modul-07-00.jpg)

*IoT mimarisi katmanları*
Nesnelerin İnterneti (IoT), fiziksel cihazların internet üzerinden birbirleriyle ve sistemlerle iletişim kurduğu ağdır. Akıllı evden endüstriyel tesislere kadar her yerdedir.

- Sensörler: Sıcaklık, nem, hareket, ışık, ses gibi fiziksel ölçümleri yapar.
- Aktüatörler: Komutları fiziksel eylemlere dönüştürür (motor, ısıtıcı, valf).
- Bağlantı protokolleri: WiFi, Bluetooth, Zigbee, LoRaWAN, NB-IoT, 5G.
- Edge cihazlar: Veriyi yerel olarak işleyen gateway'ler.
Tipik IoT mimarisi 4 katmandan oluşur: Algılama katmanı (sensörler), ağ katmanı (bağlantı), veri işleme katmanı (cloud/edge), uygulama katmanı (kullanıcı arayüzü).


### 7.2 IoT ve YZ Entegrasyonu

Verinin oluştuğu yerde (cihazda veya yakınında) YZ modellerinin çalışmasıdır. Avantajları: düşük gecikme, gizlilik, bant genişliği tasarrufu. NVIDIA Jetson, Google Coral, Raspberry Pi gibi platformlar kullanılır.

Edge AI: Uçta Yapay Zeka

Sensörlerden gelen verilerle makinelerin arızalanmadan önce tespit edilmesi. ML modelleri vibrasyon, sıcaklık, akım gibi sinyalleri analiz eder. Üretim duruşlarını %50'ye kadar azaltır.

Predictive Maintenance (Kestirimci Bakım)

- Akıllı şehirler: Trafik yönetimi, akıllı aydınlatma, atık yönetimi.
- Akıllı evler: Termostat, güvenlik, ses asistanları.
- Endüstriyel IoT (IIoT): Üretim hatları, lojistik, enerji.
- Akıllı tarım: Toprak nem sensörleri, drone'larla mahsul izleme, otomatik sulama.
- Sağlık IoT: Giyilebilir cihazlar, uzaktan hasta takibi.

![edge AI cloud computing](assets/images/lessons/modul-07-01.jpg)

*Edge AI ve cloud entegrasyonu*

### 7.3 Gerçek Dünya Örnekleri

- Nest ve Ecobee akıllı termostatlar: Kullanıcı alışkanlıklarını öğrenip enerji tasarrufu sağlar.
- Apple Watch, Fitbit: Kalp ritmi, uyku, aktivite takibi yapar.
- John Deere akıllı traktörler: GPS, sensörler ve YZ ile hassas tarım.
- Fabrika 4.0 ve dijital ikizler: Fiziksel sistemin dijital kopyası, simülasyon ve optimizasyon için kullanılır.
- Amazon Go mağazalar: Kameralar, sensörler ve YZ ile kasiyersiz alışveriş.

### Modül sonu quiz

**S1.** IoT neyin kısaltmasıdır?

- [A] Internet of Tools
- [B] Internet of Things ✓
- [C] Information of Technology
- [D] Integration of Telecom

**S2.** Edge AI ne demektir?

- [A] Sadece bulutta çalışan YZ
- [B] Verinin oluştuğu yerde (cihazda) çalışan YZ ✓
- [C] Sadece sınır ülkelerde kullanılan YZ
- [D] Çok pahalı YZ

**S3.** Aşağıdakilerden hangisi bir IoT uygulamasıdır?

- [A] Excel tablosu
- [B] Akıllı termostat ✓
- [C] Word belgesi
- [D] Hesap makinesi

**S4.** Predictive Maintenance (kestirimci bakım) nasıl çalışır?

- [A] Önceden belirlenmiş tarihlerde bakım yapar ✓
- [B] Sensörlerden gelen verileri ML ile analiz ederek arıza olmadan
- [C] Hiç bakım yapmaz
- [D] Sadece elektrik kesintilerinde çalışır

**S5.** Edge AI'ın bulut tabanlı YZ'ye göre temel avantajları nelerdir?

- [A] Daha az doğru çalışır ✓
- [B] Düşük gecikme, gizlilik koruması ve bant genişliği tasarrufu
- [C] Sadece gece çalışır
- [D] İnternet gerektirir

**S6.** Dijital ikiz (digital twin) kavramı nedir?

- [A] İkinci bir bilgisayar ✓
- [B] Fiziksel bir sistemin veya nesnenin gerçek zamanlı dijital
- [C] Sadece grafik tasarımı
- [D] Yedek hard disk

**S7.** IIoT (Industrial IoT) uygulamalarında ML modellerinin edge'de çalıştırılması neden tercih edilir?

- [A] Daha ucuzdur ✓
- [B] Üretim hattında milisaniyelik kararlar gerekir; bulut gecikmesi
- [C] Bulut çalışmaz
- [D] Sadece akşamları çalışır

**S8.** Hassas tarımda (precision agriculture) YZ ve IoT entegrasyonunun temel faydası nedir?

- [A] Sadece estetik ✓
- [B] Toprak sensörleri ve drone verilerinin ML ile analizi sayesinde
- [C] Sadece güneşli günlerde çalışır
- [D] Geleneksel tarımdan daha yavaştır

**S9.** Federated Learning IoT senaryolarında neden uygundur?

- [A] Çok hızlıdır ✓
- [B] Cihazlardan veri toplamadan, her cihazda yerel eğitim yapıp
- [C] Sadece tek cihaz kullanır
- [D] İnternet gerektirmez


---

## Modül 8: VR, AR VE YZ

- **ID:** `modul-08-vr-ar-ve-yz`
- **Alt başlık:** Handbook Bölüm 8 · ~20 dk okuma
- **Tahmini süre:** 20 dk


![VR AR MR difference](assets/images/lessons/modul-08-00.jpg)

*VR ve AR fark karşılaştırması*

### 8.2 YZ ile Zenginleştirilmiş VR/AR

- VR (Virtual Reality): Tamamen sanal bir ortama daldıran teknoloji.
Meta Quest, PlayStation VR, Apple Vision Pro.

- AR (Augmented Reality): Gerçek dünyaya dijital katmanlar ekler.
Pokemon GO, IKEA Place uygulaması.

- MR (Mixed Reality): VR ve AR'nin birleşimi. Microsoft HoloLens.
- XR (Extended Reality): Tüm bu teknolojileri kapsayan şemsiye terim.

### 8.1 VR ve AR Temelleri

Yüksek çözünürlüklü ekranlar, motion tracking, eye tracking, haptic feedback, spatial audio teknolojileriyle çalışır. Apple Vision Pro gibi cihazlar 4K mikro-OLED ekran ve çoklu sensör kullanır.

- Akıllı NPC'ler: YZ destekli karakterler oyunlarda daha gerçekçi davranışlar sergiler.
- Gerçek zamanlı çeviri ve AR overlay: Google Translate ile yabancı yazıları anında çevirme.
- Sanal asistanlar: VR ortamında hologram şeklinde rehber AI.
- Procedural content generation: Sonsuz dünya üretimi (No Man's Sky).
- Hand tracking ve gesture recognition: YZ ile el hareketlerinin tanınması.

![metaverse virtual world](assets/images/lessons/modul-08-01.jpg)

*Metaverse konsepti*

### 8.3 Uygulama Alanları

- Eğitim ve simülasyon: Pilot eğitimi, askeri tatbikatlar, tehlikeli iş eğitimleri.
- Sağlık: Cerrahi simülasyon, ağrı yönetimi, fobi tedavisi, anatomi eğitimi.
- Mimarlık ve tasarım: Yapı sahipleri inşaat öncesi binayı VR'da gezebilir.
- Perakende: Sanal kıyafet deneme, mobilya yerleştirme (IKEA Place).
- Metaverse: Sanal toplantılar, etkinlikler, dijital ekonomi.
- Uzaktan işbirliği: Sanal toplantı odaları, 3D modeller üzerinde takım çalışması.

### Modül sonu quiz

**S1.** VR ve AR arasındaki temel fark nedir?

- [A] VR ucuzdur, AR pahalıdır
- [B] VR tamamen sanal ortam, AR gerçek dünyaya dijital katmanlar ✓
- [C] VR sadece oyunda kullanılır
- [D] AR sadece askeri amaçlıdır

**S2.** Pokemon GO hangi teknolojinin örneğidir?

- [A] VR
- [B] AR ✓
- [C] MR
- [D] AI

**S3.** Metaverse kavramı neyi ifade eder?

- [A] Yeni bir programlama dili
- [B] Sanal dünya ve dijital ekonomi konseptleri ✓
- [C] Bir e-ticaret sitesi
- [D] Bir veritabanı yönetim sistemi

**S4.** MR (Mixed Reality) nedir?

- [A] Sadece müzik dinleme teknolojisi ✓
- [B] VR ve AR'nin birleşimi; gerçek ve sanal nesnelerin etkileşimli
- [C] Eski bir VR teknolojisi
- [D] Sadece simülasyon yazılımı

**S5.** Akıllı NPC'ler (Non-Player Characters) oyunlarda nasıl bir gelişme sağlar?

- [A] Sadece görsel kalitede ✓
- [B] YZ destekli karakterler daha gerçekçi davranışlar
- [C] Sadece oyunu yavaşlatır
- [D] Hiçbir gelişme sağlamaz

**S6.** Procedural content generation neyi ifade eder?

- [A] Manuel içerik üretimi ✓
- [B] Algoritmalarla otomatik içerik (harita, karakter, görev)
- [C] Sadece müzik üretimi
- [D] Sadece reklam üretimi

**S7.** Sağlık alanında VR/AR ile YZ entegrasyonunun en somut faydalarından biri nedir?

- [A] Sadece eğlence ✓
- [B] Cerrahların sanal ortamda riskli operasyonları pratik etmesi,
- [C] Hiçbir faydası yok
- [D] Sadece reçete yazımı

**S8.** Apple Vision Pro gibi yeni nesil XR cihazlarında YZ'nin rolü nedir?

- [A] Hiçbir rol ✓
- [B] El takibi, göz takibi, spatial computing, gerçek zamanlı çeviri
- [C] Sadece pil yönetimi
- [D] Sadece ses kalitesi

**S9.** VR/AR'da 'motion sickness' problemini azaltmak için YZ nasıl kullanılır?

- [A] Hiçbir şekilde ✓
- [B] Tahmine dayalı render, foveated rendering (göz takibiyle odak
- [C] Sadece daha yüksek ses
- [D] Sadece daha küçük ekran


---

## Modül 9: YZ VE SİBER GÜVENLİK

- **ID:** `modul-09-yz-ve-si-ber-guvenli-k`
- **Alt başlık:** Handbook Bölüm 9 · ~25 dk okuma
- **Tahmini süre:** 25 dk


![AI cybersecurity threat detection](assets/images/lessons/modul-09-00.jpg)

*Siber güvenlikte YZ uygulamaları*
Privacy-Preserving ML

- Anomali Tespiti: Normal ağ trafiğinden sapan davranışları tespit etme.
Sıfır gün saldırıları için kritik.

- Tehdit İstihbaratı: Dark web ve sosyal medyadaki tehditleri otomatik takip etme.
- Phishing Tespiti: E-postaların içeriğini, gönderici reputasyonunu ve
URL'leri analiz ederek oltalama saldırılarını engelleme.

- Malware Tespiti: Dosya davranışını analiz ederek bilinmeyen zararlı yazılımları yakalama. CrowdStrike, SentinelOne gibi platformlar.
- SIEM Sistemleri ve YZ: Splunk, IBM QRadar gibi platformlar milyonlarca log'u YZ ile analiz eder.
- Davranışsal Analiz (UEBA): Kullanıcı ve cihaz davranışlarını profilleyerek içeriden tehditleri tespit etme.

### 9.2 YZ Sistemlerinin Güvenliği

Görüntülere insan gözüyle görülemeyen gürültü ekleyerek YZ'yi yanıltma. Örnek: Bir dur tabelasına stickerlar yapıştırılarak otonom aracı hız limiti olarak okutmak.

Adversarial Attacks (Düşman Saldırıları)

Eğitim verisine kötü amaçlı örnekler enjekte ederek modeli zehirlemek. Açık kaynak modellerde özellikle risklidir.

Model Poisoning ve Data Poisoning

- Differential Privacy: Veriye gürültü ekleyerek bireyleri koruma.
- Homomorphic Encryption: Şifreli veri üzerinde hesaplama yapma.
- Federated Learning: Veriyi merkezi sunucuya göndermeden, cihazlarda eğitim yapma. Google klavyesi (Gboard) bu yöntemi kullanır.

![adversarial attack machine learning](assets/images/lessons/modul-09-01.jpg)

*Adversarial attack örneği*

### 9.3 Etik Hacking ve YZ

- Penetrasyon testlerinde YZ: Otomatik zafiyet taraması, brute force optimizasyonu.
- Otomatik exploit üretimi: Bilinen zafiyetler için exploit kod üretimi.
- YZ ile sosyal mühendislik: Deepfake sesli aramalar, kişiselleştirilmiş phishing.
- Defansif YZ: Red team vs Blue team kapsamında YZ'nin çift yönlü kullanımı.

### Modül sonu quiz

**S1.** YZ'nin siber güvenlikte en yaygın kullanım alanlarından biri nedir?

- [A] Sadece logo tasarımı
- [B] Anomali tespiti ve tehdit avı ✓
- [C] Sadece e-posta yazımı
- [D] Sadece dosya silme

**S2.** Phishing nedir?

- [A] Balık tutma uygulaması
- [B] Sahte e-posta veya sitelerle kullanıcıları kandırma saldırısı ✓
- [C] Bir programlama dili
- [D] Bir antivirüs yazılımı

**S3.** Federated Learning'in temel mantığı nedir?

- [A] Tüm veriyi merkezi sunucuda toplama
- [B] Veriyi cihazlarda tutup sadece model güncellemelerini paylaşma ✓
- [C] Sadece bir kullanıcı için çalışma
- [D] İnterneti kapatma

**S4.** Adversarial Attack nedir?

- [A] Rakip şirketlere saldırı ✓
- [B] YZ modelini yanıltmak için girdiye küçük, insan gözüyle
- [C] Klasik bir hacking yöntemi
- [D] Network kablosu kesme

**S5.** Data Poisoning saldırısı nasıl çalışır?

- [A] Veritabanlarına virüs bulaştırma ✓
- [B] Eğitim verisine kötü amaçlı örnekler enjekte ederek modelin
- [C] Sadece e-posta saldırısı
- [D] DNS kaydı silme

**S6.** UEBA (User and Entity Behavior Analytics) ne için kullanılır?

- [A] Reklam analizi ✓
- [B] Kullanıcı ve cihaz davranışlarını profilleyerek anormal
- [C] Web tasarımı
- [D] Sosyal medya yönetimi

**S7.** Differential Privacy mekanizması ML modellerinde nasıl çalışır?

- [A] Modeli daha hızlı yapar ✓
- [B] Eğitim verisine matematiksel olarak ölçülebilir gürültü
- [C] Sadece dosya boyutunu küçültür
- [D] Modeli daha doğru yapar

**S8.** YZ'nin sosyal mühendislik saldırılarında kullanımı nasıl bir tehdit oluşturur?

- [A] Hiçbir tehdit ✓
- [B] Deepfake sesli aramalar, kişiselleştirilmiş ve dilbilgisel
- [C] Sadece eski sistemleri etkiler
- [D] Sadece İngilizce konuşan ülkeleri etkiler

**S9.** Model evasion (kaçış) saldırısı ile model extraction (çıkarma) saldırısı arasındaki fark nedir?

- [A] Aynı şeyler ✓
- [B] Evasion: modeli yanlış tahmin yapmaya zorlamak; Extraction:
- [C] Evasion daha pahalıdır
- [D] İkisi de imkansızdır


---

## Modül 10: YAPAY ZEKANIN SEKTÖREL UYGULAMALARI

- **ID:** `modul-10-yapay-zekanin-sektorel-uygulamalari`
- **Alt başlık:** Handbook Bölüm 10 · ~50 dk okuma
- **Tahmini süre:** 50 dk


![AI industry applications](assets/images/lessons/modul-10-00.jpg)

*Sektörel YZ uygulamaları haritası*
- Algoritmik Trading: Saniyeler içinde milyonlarca işlem. Yüksek frekanslı trading firmaları YZ kullanır.
- Kredi Skorlama: Geleneksel skorlamaya ek olarak sosyal medya, mobil veri gibi alternatif veri kaynakları.
- Fraud Detection: Anomali tespiti ile dolandırıcılık önleme. Visa,
MasterCard her işlemi gerçek zamanlı YZ ile kontrol eder.

- Robo-advisors: Wealthfront, Betterment gibi otomatik yatırım danışmanları.
- Risk Yönetimi: Piyasa risk modellemesi, stress testing.
- Anti-Money Laundering (AML): Şüpheli işlem örüntülerini tespit.
- Hastalık Teşhisi: Google DeepMind'ın diyabetik retinopati teşhisi,
- İlaç Keşfi: AlphaFold ile protein yapısı tahmini Nobel Ödülü kazandı.
İlaç geliştirme süresini yıllardan aylara indiriyor.

- Kişiselleştirilmiş Tıp: Genomik verilerle hastaya özel tedavi planları.
- Radyoloji ve Patoloji: MR, BT, mamografi analizinde radyolog seviyesinde performans.
- Robotik Cerrahi: da Vinci robotu, daha hassas operasyonlar.
- Mental Sağlık: Chatbot terapistleri (Woebot, Wysa), depresyon belirtileri tespiti.

![AI finance fintech banking](assets/images/lessons/modul-10-01.jpg)

*Finansta YZ kullanımı*
- Öneri Sistemleri: Amazon satışlarının %35'i, Netflix izlemelerinin %75'i öneri sistemlerinden gelir.
- Dinamik Fiyatlandırma: Uber surge pricing, Amazon saatlik fiyat değişimleri.
- Müşteri Segmentasyonu: RFM analizi, müşteri yaşam boyu değeri (CLV) tahmini.
- Chatbot'lar ve Sanal Asistanlar: 7/24 müşteri desteği, sipariş takibi.
- Talep Tahmini: Mevsimsellik, trendler ve dış faktörlerle envanter optimizasyonu.
- Görsel Arama: Pinterest Lens, Google Lens ile fotoğraftan ürün bulma.
- Kalite Kontrol: Bilgisayarlı görü ile hatalı ürünleri saniyeler içinde tespit.
- Kestirimci Bakım: Sensör verileriyle arızadan önce müdahale.
- Tedarik Zinciri Optimizasyonu: Talep tahmini, rota planlama, envanter yönetimi.
- Robotik ve Otomasyon: İşbirlikçi robotlar (cobot'lar), montaj hatları.
- Dijital İkiz: Fabrikanın dijital kopyasında simülasyon ve optimizasyon.
- Enerji Optimizasyonu: YZ ile tesisin enerji tüketimini azaltma.

![AI healthcare medical](assets/images/lessons/modul-10-02.jpg)

*Sağlıkta YZ uygulamaları*

### 10.6 İnsan Kaynakları

- Otonom Araçlar: Tesla, Waymo, Cruise. Seviye 1-5 otonomluk skalası.
- Trafik Yönetimi: Akıllı kavşaklar, dinamik sinyalizasyon.
- Rota Optimizasyonu: UPS ORION sistemi yılda 100 milyon mil tasarruf sağlar.
- Lojistik: Depo robotları (Amazon Kiva), drone teslimat.
- Filo Yönetimi: Yakıt verimliliği, sürücü davranışı analizi.
- CV Tarama: Binlerce başvuru arasından uygun adayları otomatik filtreleme.
- Yetenek Eşleştirme: LinkedIn'in iş öneri sistemi.
- Çalışan Tutma (Retention) Analizi: Hangi çalışanın işten ayrılma riski yüksek? Performans Değerlendirme: 360 derece geri bildirim analizi, üretkenlik metriklerinin yorumlanması.
- Çeşitlilik ve Kapsayıcılık: Önyargısız işe alım süreçleri (dikkatli kullanılmazsa tersi etki yapabilir).

![autonomous vehicle self driving](assets/images/lessons/modul-10-03.jpg)

*Otonom araçlar*
- Kişiselleştirilmiş Kampanyalar: Spotify Wrapped, Netflix kişiselleştirilmiş thumbnail'ler.
- Müşteri Yaşam Boyu Değeri (CLV) Tahmini.
- Sosyal Medya Analizi: Brand monitoring, influencer keşfi, viral içerik tespiti.
- İçerik Üretimi: Reklam metinleri, görseller, video kurguları.
- A/B Testing: Çok değişkenli testlerin YZ ile optimizasyonu.
- Attribution Modelling: Hangi pazarlama kanalı satışa katkı yaptı?

### Modül sonu quiz

**S1.** Netflix izlemelerinin yaklaşık yüzde kaçı öneri sisteminden geliyor?

- [A] %10
- [B] %25
- [C] %50
- [D] %75 ✓

**S2.** Robo-advisor ne yapar?

- [A] Endüstriyel robotları kontrol eder
- [B] Otomatik yatırım danışmanlığı sağlar ✓
- [C] Sadece ev temizliği yapar
- [D] Sadece müşteri hizmetleri verir

**S3.** AlphaFold hangi alanda devrim yaratmıştır?

- [A] Müzik üretimi
- [B] Protein yapısı tahmini ve ilaç keşfi ✓
- [C] Otomobil tasarımı
- [D] Sosyal medya pazarlaması

**S4.** İK alanında YZ kullanımının en büyük etik riski nedir?

- [A] Çok yavaş çalışması ✓
- [B] Eğitim verisindeki tarihsel önyargıların (cinsiyet, etnisite)
- [C] Sadece teknik problemler
- [D] Sadece elektrik tüketimi

**S5.** Otonom araç seviyelerinde (1-5) Seviye 5 ne anlama gelir?

- [A] Otomatik park ✓
- [B] Her koşulda insan müdahalesi gerektirmeyen tam otonom sürüş
- [C] Şerit takibi
- [D] Sadece otoyolda otomatik sürüş

**S6.** Müşteri Yaşam Boyu Değeri (CLV) tahmini neden önemlidir?

- [A] Sadece istatistik için ✓
- [B] Pazarlama bütçesinin doğru müşterilere yönlendirilmesi ve
- [C] Sadece muhasebe için
- [D] Hiç önemli değildir

**S7.** Dolandırıcılık tespitinde (fraud detection) precision ve recall arasındaki trade-off neden kritiktir?

- [A] Önemli değildir ✓
- [B] Çok yüksek recall (her şüpheli işlemi yakalama) müşteri
- [C] Sadece bankalar için geçerlidir
- [D] Sadece teknik bir konudur

**S8.** Üretim hatlarındaki bilgisayarlı görü tabanlı kalite kontrol sistemlerinin geleneksel manuel kontrole üstünlüğü nedir?

- [A] Sadece daha pahalı ✓
- [B] Yorulmaz, 7/24 çalışır, milisaniye hızında karar verir,
- [C] Sadece elektrikli ürünlerde çalışır
- [D] Her zaman daha az doğrudur

**S9.** İlaç keşfinde AlphaFold gibi modellerin geleneksel yöntemlere üstünlüğü nedir?

- [A] Hiçbir üstünlüğü yok ✓
- [B] Geleneksel deneysel yöntemlerle yıllar süren protein yapısı
- [C] Sadece beslenme analizi yapar
- [D] Sadece ucuz ilaçlar geliştirir


---

## Modül 11: YAPAY ZEKANIN HUKUKİ BOYUTU

- **ID:** `modul-11-yapay-zekanin-hukuki-boyutu`
- **Alt başlık:** Handbook Bölüm 11 · ~30 dk okuma
- **Tahmini süre:** 30 dk


![EU AI Act risk categories](assets/images/lessons/modul-11-00.jpg)

*EU AI Act risk kategorileri*
Malpraktis ve Tıbbi Hatalar

Dünyanın ilk kapsamlı YZ yasası 2024'te kabul edildi. Risk bazlı yaklaşım uygular:

- Yasaklı YZ: Sosyal puanlama, gerçek zamanlı biometrik kimlik tespiti (istisnalar dışında).
- Yüksek Riskli YZ: Sağlık, eğitim, işe alım, kredi skorlama. Ciddi compliance gereksinimleri.
- Sınırlı Risk: Chatbot kullanıldığının bildirilmesi gerekir.
- Minimal Risk: Spam filtreleri, video oyunları (serbest).
AB Yapay Zeka Yasası (EU AI Act)

GDPR'ın 22. maddesi otomatik karar verme süreçlerine sınırlamalar getirir. Açıklama hakkı, itiraz hakkı, insan denetimi hakkı tanır.

KVKK (Kişisel Verilerin Korunması Kanunu) GDPR'a benzer prensipler içerir. Cumhurbaşkanlığı Dijital Dönüşüm Ofisi Yapay Zeka Strateji Belgesi yayınladı. 2024'te yapay zeka kanun teklifi gündeme geldi.

Türkiye'de YZ Düzenlemeleri

BDDK bankacılıkta, SPK sermaye piyasalarında, Sağlık Bakanlığı tıbbi cihaz mevzuatında YZ ile ilgili düzenlemeler yapmaktadır.


### 11.2 Sorumluluk ve Hesap Verebilirlik

Otonom bir aracın kazasında kim sorumlu? Sürücü, üretici, yazılım geliştirici, veri sağlayıcı? Mevcut hukuk sistemleri bu soruları henüz tam yanıtlamamış durumda.

YZ Kararlarının Sorumluluğu

YZ'ye hukuki kişilik tanınmalı mı? Avrupa Parlamentosu 2017'de bunu önerdi ama büyük tartışmalar var. Çoğunluk bu görüşe karşı.

Hukuki Kişilik Tartışmaları

AB Ürün Sorumluluğu Direktifi YZ kapsamına genişletildi. Üreticiler YZ sistemlerinin neden olduğu zararlardan sorumlu.

Doktor YZ önerisini kabul ederse veya reddederse ve yanlış çıkarsa sorumluluk kimde? FDA, EMA bu konuda kılavuzlar yayınlıyor.


![GDPR data protection](assets/images/lessons/modul-11-01.jpg)

*GDPR ve veri koruma*

### 11.4 Sözleşmeler ve Compliance

- YZ Tarafından Üretilen İçeriğin Telif Hakları: ABD Telif Hakkı Ofisi salt YZ ürünleri korumuyor. İnsan müdahalesi gerekiyor.
- Patent ve YZ: DABUS davası: YZ mucit olarak kabul edilmedi (çoğu ülkede).
- Eğitim Verisi ve Telif: New York Times - OpenAI davası, sanatçılar -
Stable Diffusion davaları sürüyor.

- Veri Sahipliği: Veri sahipleri, model sahipleri, çıktı kullanıcıları arasındaki haklar tartışmalı.
- Açık Kaynak Modeller: Apache 2.0, MIT, Llama lisansı. Ticari kullanım şartları farklılaşır.
- YZ Kullanım Sözleşmeleri: OpenAI, Anthropic, Google'ın hizmet şartları farklılık gösterir. Veri kullanımı, çıktı sahipliği, sorumluluk kısıtlamaları.
- Vendor Management: Üçüncü taraf YZ hizmetlerinin değerlendirilmesi, supply chain riski.
- SLA'lar (Service Level Agreements): Uptime, response time, accuracy garantileri.
- Denetim ve Compliance: ISO/IEC 42001 YZ Yönetim Sistemi standardı,
NIST AI Risk Management Framework.


### Modül sonu quiz

**S1.** AB Yapay Zeka Yasası (EU AI Act) ne tür bir yaklaşım benimser?

- [A] YZ'yi tamamen yasaklar
- [B] Risk bazlı yaklaşım (yasaklı, yüksek risk, sınırlı risk, ✓
- [C] Sadece para cezaları
- [D] Hiçbir düzenleme getirmez

**S2.** Türkiye'deki KVKK neyin kısaltmasıdır?

- [A] Kapsamlı Veri Kullanım Komitesi
- [B] Kişisel Verilerin Korunması Kanunu ✓
- [C] Kamu Veri Kontrol Komisyonu
- [D] Kalkınma Verileri Koruma Kurulu

**S3.** Yüksek riskli YZ uygulamalarına örnek nedir?

- [A] Spam filtresi
- [B] Sağlık teşhisi, kredi skorlama, işe alım ✓
- [C] Video oyunu
- [D] Hava durumu uygulaması

**S4.** GDPR'ın 22. maddesi neyi düzenler?

- [A] Bilet fiyatlarını ✓
- [B] Otomatik karar verme süreçlerinde bireylerin haklarını
- [C] Reklam vergilerini
- [D] Domain isimlerini

**S5.** DABUS davası hangi hukuki sorunu gündeme getirdi?

- [A] Yazılım fiyatları ✓
- [B] YZ'nin patent mucidi olarak kabul edilip edilemeyeceği
- [C] İnternet hızı
- [D] Şarj cihazı standartları

**S6.** ISO/IEC 42001 standardı neyi düzenler?

- [A] Bilgisayar üretim standartları ✓
- [B] Yapay Zeka Yönetim Sistemleri
- [C] Internet hızı
- [D] Pil ömrü

**S7.** YZ tarafından üretilen içeriğin telif hakkı konusunda ABD Telif Hakkı Ofisi'nin yaklaşımı nedir?

- [A] YZ ürünleri tam olarak korur ✓
- [B] Salt YZ tarafından üretilen içerikleri korumaz; telif için
- [C] Hiçbir telif korunmaz
- [D] Sadece sanatçılara verilir

**S8.** EU AI Act'e göre 'yasaklı YZ uygulamaları' kategorisine giren bir örnek nedir?

- [A] Hava durumu tahmini ✓
- [B] Sosyal puanlama (social scoring) sistemleri ve gerçek zamanlı
- [C] Yazılım geliştirme araçları
- [D] Çeviri uygulamaları

**S9.** New York Times - OpenAI davası gibi telif davalarının temel hukuki argümanı nedir?

- [A] OpenAI çok pahalı ✓
- [B] Telifli içeriğin izinsiz olarak büyük dil modellerinin
- [C] İnternet yavaş
- [D] Sadece tasarım problemi


---

## Modül 12: YAPAY ZEKANIN ETİK BOYUTU

- **ID:** `modul-12-yapay-zekanin-eti-k-boyutu`
- **Alt başlık:** Handbook Bölüm 12 · ~40 dk okuma
- **Tahmini süre:** 40 dk


![AI ethics principles](assets/images/lessons/modul-12-00.jpg)

*YZ etik prensipleri şeması*

### 12.1 YZ Etiği Temelleri

YZ sistemleri milyonlarca insanın hayatını etkileyen kararlar veriyor: kim işe alınacak, kim kredi alacak, kim koşullu salıverilecek. Etik olmayan YZ ayrımcılığı sistematikleştirebilir.

- Şeffaflık (Transparency): Sistemin nasıl çalıştığı anlaşılabilir olmalı.
- Adalet (Fairness): Farklı gruplara karşı ayrımcılık yapmamalı.
- Mahremiyet (Privacy): Kişisel verilerin korunması.
- Hesap Verebilirlik (Accountability): Hatalar için sorumluluk.
- Güvenlik (Safety): Zarar vermemeli.
- İnsan Kontrolü (Human Oversight): Kritik kararlarda insan müdahalesi.
Temel Etik Prensipler

OECD AI Principles, UNESCO Recommendation on Ethics of AI, IEEE Ethically Aligned Design gibi uluslararası çerçeveler vardır.


### 12.2 Önyargı ve Ayrımcılık (Bias)

Önyargı veriden, algoritmadan veya geliştiriciden gelir. Veri toplama, etiketleme, model tasarımı her aşama bias kaynağı olabilir.

Algoritmik Önyargı Nasıl Oluşur?

- Amazon CV Tarama Sistemi: Kadın adayları cezalandırdığı için 2018'de iptal edildi.
- COMPAS: ABD'de mahkumların tekrar suç işleme riskini tahmin eden sistem, siyahi sanıklara karşı önyargılı bulundu.
- Apple Card: Aynı gelirli çiftlerde erkeklere kadınlardan 20 kat fazla kredi limiti verdi.
- Yüz tanıma sistemleri: Beyaz erkeklerde %99 doğru, koyu tenli kadınlarda %65 doğru çalıştığı tespit edildi.
- Demographic Parity: Tüm gruplarda pozitif tahmin oranı eşit.
- Equal Opportunity: Tüm gruplarda true positive rate eşit.
- Equalized Odds: Hem TPR hem FPR tüm gruplarda eşit.
- Çeşitli ve temsili veri kümeleri Bias audit araçları (IBM AI Fairness 360, Microsoft Fairlearn)
- Çeşitlilik içeren geliştirici ekipleri

![algorithmic bias examples](assets/images/lessons/modul-12-01.jpg)

*Algoritmik önyargı örnekleri*

### 12.4 Mahremiyet ve Veri Koruma


### 12.3 Şeffaflık ve Açıklanabilirlik (XAI)

Derin öğrenme modelleri milyarlarca parametreden oluşur. Bir kararın neden verildiğini anlamak zordur. Bu 'kara kutu' problemidir.

- LIME (Local Interpretable Model-agnostic Explanations): Tek bir tahminin yerel açıklaması.
- SHAP (SHapley Additive exPlanations): Her özelliğin tahmine katkısını oyun teorisiyle hesaplar.
- Attention visualization: Sinir ağının hangi bölüme 'dikkat' ettiğini gösterir.
- Counterfactual explanations: 'Eğer X değişseydi sonuç değişir miydi?' soruları.
GDPR'a göre otomatik karar verme süreçlerinde bireylerin açıklama hakkı vardır. Bankalar kredi reddi gerekçesini açıklamak zorundadır.

- Differential Privacy: Veriye matematiksel olarak ölçülebilir gürültü ekleyerek bireylerin gizliliğini garanti eder. Apple, Google kullanır.
- Veri Minimizasyonu: Sadece gerekli verileri toplama prensibi (GDPR gereksinimi).
- Anonimleştirme vs De-anonimleştirme: Anonim sanılan veriler başka veri kümeleriyle birleştirilerek kimliklendirilebilir (Netflix Prize dataset olayı).
- Kişisel Verilerin Korunması: GDPR, CCPA, KVKK gibi yasalar.
- Veri silme hakkı (Right to be Forgotten): Modelin eğitim verisinden çıkarılma talepleri zor bir sorundur.

![explainable AI SHAP LIME](assets/images/lessons/modul-12-02.jpg)

*Explainable AI (XAI) görselleştirme*

### 12.6 Manipülasyon ve Dezenformasyon


### 12.5 İşsizlik ve Ekonomik Etki

McKinsey, 2030'a kadar dünya genelinde 400-800 milyon işin otomasyondan etkileneceğini öngörüyor. En çok etkilenenler: rutin idari işler, veri girişi, müşteri hizmetleri ilk seviye.

Otomasyon ve İş Kayıpları

- Prompt engineer'lar AI ethicist'ler ML mühendisleri ve veri bilimciler AI auditor'lar İnsan-YZ etkileşim tasarımcıları
Yeniden beceri kazanma (reskilling) ve beceri geliştirme (upskilling) hayati önemde. WEF'e göre 2030'a kadar çalışanların %50'si yeniden eğitilmeli.

Sam Altman, Elon Musk gibi YZ liderlerinin de gündeme getirdiği UBI (Universal Basic Income) konsepti. Finlandiya, Kenya gibi ülkelerde pilot uygulamalar yapıldı.

- Deepfakes: Yapay yüzler, sesler, videolar. Politikada, dolandırıcılıkta, intikam pornosunda kullanılıyor.
- Propaganda ve Mikro-Hedefleme: Cambridge Analytica skandalı, Brexit ve
- Echo Chambers (Yankı Odaları): Sosyal medya algoritmaları aynı görüşteki içerikleri öneriyor, kutuplaşmayı artırıyor.
- Sosyal Medya Algoritmaları: Etkileşim odaklı algoritmalar tartışmacı içerikleri öne çıkarıyor.
- Önlemler: İçerik doğrulama araçları (Content Credentials), kaynak şeffaflığı, medya okuryazarlığı eğitimi.

![deepfake detection](assets/images/lessons/modul-12-03.jpg)

*Deepfake tespiti*
- Katil Robotlar (LAWS - Lethal Autonomous Weapons Systems): İnsan müdahalesi olmadan hedef seçen silahlar.
- Stop Killer Robots kampanyası: 30+ ülke yasaklanmasını istiyor.
- Askeri YZ Uygulamaları: İstihbarat analizi, drone'lar, savunma sistemleri.
- Uluslararası Düzenlemeler: BM Konvansiyonel Silahlar Konvansiyonu altında müzakereler sürüyor ama bağlayıcı yasak yok.
- Etik İlkeler: Pentagon Five Ethical Principles for AI, NATO'nun AI

### 12.8 Sürdürülebilirlik

GPT-3 eğitimi 1287 MWh enerji harcadı ve 552 ton CO2 üretti (550 New York-San Francisco uçuşuna eşdeğer). GPT-4 ve sonraki modeller çok daha büyük.

YZ Modellerinin Karbon Ayak İzi

Bir ChatGPT sorgusu, bir Google aramasının yaklaşık 10 katı enerji harcar. Veri merkezleri 2026'da küresel elektrik tüketiminin %4-5'ini kullanacak.

- Daha verimli mimari tasarımı Model sıkıştırma (pruning, quantization, distillation)
- Yenilenebilir enerjili veri merkezleri Carbon-aware computing: Düşük karbon saatlerinde eğitim Federated learning ile veri taşıma maliyetini azaltma

### Modül sonu quiz

**S1.** YZ etiğinin temel prensiplerinden biri DEĞİLDİR?

- [A] Şeffaflık
- [B] Adalet
- [C] Mahremiyet
- [D] Maksimum hız ✓

**S2.** Deepfake nedir?

- [A] Derin bir göl
- [B] YZ ile üretilen sahte yüz, ses veya video ✓
- [C] Bir veritabanı türü
- [D] Bir kameralı program

**S3.** Algoritmik önyargı (algorithmic bias) çoğunlukla nereden kaynaklanır?

- [A] İnternet hızından
- [B] Eğitim verisindeki tarihsel ve toplumsal önyargılardan ✓
- [C] Bilgisayar markasından
- [D] Hava durumundan

**S4.** XAI (Explainable AI) neden önemlidir?

- [A] Sadece akademik bir konu ✓
- [B] Yüksek riskli kararlarda (sağlık, kredi) kararın gerekçesinin
- [C] Sadece pazarlama amaçlı
- [D] Modeli yavaşlatır

**S5.** Amazon'un CV tarama sisteminin neden iptal edildiği örneği neyi gösterir?

- [A] Sistemin çok hızlı çalıştığını ✓
- [B] Tarihsel veriden öğrenen modelin geçmişteki cinsiyet
- [C] Amazon'un YZ kullanmadığını
- [D] Sadece teknik bir sorun

**S6.** Differential Privacy ne yapar?

- [A] Veriyi siler ✓
- [B] Veriye matematiksel olarak ölçülebilir gürültü ekleyerek
- [C] Veriyi büyütür
- [D] Veriyi çoğaltır

**S7.** Fairness metriklerinden 'Demographic Parity' ile 'Equalized Odds' arasındaki fark nedir?

- [A] İkisi de aynı ✓
- [B] Demographic Parity: tüm gruplarda pozitif tahmin oranı eşit;
- [C] Sadece bankacılıkta kullanılır
- [D] Sadece akademik konu

**S8.** GPT-3'ün eğitiminin yaklaşık 552 ton CO2 emisyonuna yol açtığı düşünüldüğünde, 'Green AI' hareketinin temel önerileri nelerdir?

- [A] Sadece daha pahalı modeller ✓
- [B] Daha verimli mimari tasarımı, model sıkıştırma (pruning,
- [C] Sadece daha küçük modeller
- [D] Hiçbir öneri yok

**S9.** AI Alignment problemi nedir?

- [A] Modellerin grafiksel hizalanması ✓
- [B] YZ sistemlerinin hedeflerini ve davranışlarını insan değerleri
- [C] Bilgisayar parçalarının hizalanması
- [D] Sadece akademik problem


---

## Modül 13: YZ PROJE YÖNETİMİ VE UYGULAMA

- **ID:** `modul-13-yz-proje-yoneti-mi-ve-uygulama`
- **Alt başlık:** Handbook Bölüm 13 · ~30 dk okuma
- **Tahmini süre:** 30 dk


![MLOps lifecycle CI/CD](assets/images/lessons/modul-13-00.jpg)

*MLOps yaşam döngüsü*

### 13.1 YZ Projesine Başlamak

Her şey net bir iş problemiyle başlar. 'YZ yapalım' değil 'müşteri kaybını %20 azaltalım' veya 'üretim hataları %50 düşsün' gibi ölçülebilir hedefler.

İş Problemi Tanımlama

- Yeterli veri yoksa Problem deterministikse (basit kurallar yeterliyse)
- %100 doğruluk gerekliyse Açıklanabilirlik kritikse ve karmaşık model gerekiyorsa Maliyet faydasını aşıyorsa
YZ Uygun mu? (When NOT to use AI)

POC (Proof of Concept) ile küçük başlayın. Veri kalitesini, miktarını, erişilebilirliğini test edin.

Veri Keşfi ve Fizibilite

Geliştirme maliyeti (insan, altyapı), operasyon maliyeti (cloud, lisans), beklenen fayda (gelir artışı, maliyet azalması, verimlilik) hesaplanır.

- Veri Bilimcisi (Data Scientist): İstatistik, ML modelleri, iş anlayışı.
- ML Mühendisi: Production'a alma, scaling, MLOps.
- Veri Mühendisi: Veri pipeline'ları, data warehouse, ETL.
- Domain Uzmanı: Sektör bilgisi, problem doğrulama. Çoğu projenin başarısızlığının nedeni domain uzmanının eksikliğidir.
- MLOps Mühendisi: Model deployment, monitoring, retraining.
- Product Manager: Roadmap, paydaşlarla iletişim, önceliklendirme.
- Etik / Hukuk Danışmanı: Compliance, bias kontrolü.

![CRISP-DM data mining](assets/images/lessons/modul-13-01.jpg)

*CRISP-DM metodolojisi*

### 13.5 Yaygın Hatalar ve Önleme

-----------------------------------------------------------------------+


### 13.3 YZ Proje Metodolojileri

Cross-Industry Standard Process for Data Mining. 6 aşama: İş Anlama → Veri Anlama → Veri Hazırlama → Modelleme → Değerlendirme → Deployment.

Klasik Agile'ı ML projelerine uyarlamak gerekir. Sprint'ler veriyle ilgili belirsizlikleri içerir. Spike'lar (araştırma sprint'leri) yaygındır.

Basit baseline modelden başlayıp incremental olarak iyileştirin. 'Perfect is the enemy of good' prensibi geçerlidir.


### 13.4 MLOps: Production'a Alma

Kod, veri ve model versiyonları takip edilmeli. DVC (Data Version Control), MLflow, Weights & Biases gibi araçlar kullanılır.

Continuous Integration/Deployment ML projelerinde model eğitimi ve deployment otomatize edilir. GitHub Actions, GitLab CI, Kubeflow.

- Performans metrikleri (accuracy, latency, throughput)
- Data drift: Giriş verisinin dağılımındaki değişimler Concept drift: Tahmin edilen değişkenin davranışındaki değişimler Model fairness drift
Yeni modeli production'a almadan önce kontrol grubuyla karşılaştırın. Champion-challenger yaklaşımı.

- Scheduled retraining: Belirli aralıklarla (haftalık, aylık).
- Triggered retraining: Drift tespit edilince.
- Online learning: Sürekli güncelleme.
- Data Leakage: Eğitim verisine test verisinden bilgi sızması. En sinsi hatadır. Gelecekteki bilgiyi modelin görmesine yol açar.
- Yanlış Metrik Seçimi: Dengesiz veride accuracy yanıltıcıdır. Tıbbi teşhiste recall, spam tespitinde precision daha önemli olabilir.
- Production-Training Gap: Eğitim ve gerçek ortam arasındaki farklılıklar. Feature engineering tutarsızlığı en yaygın sebep.
- Teknik Borç: 'Hidden technical debt in ML systems' makalesi öne çıkarır. ML kodu bir buz dağının görünen kısmıdır.
- Cold Start Problemi: Yeni kullanıcılar/ürünler için yeterli veri olmaması.

### Modül sonu quiz

**S1.** CRISP-DM nedir?

- [A] Bir programlama dili
- [B] Veri madenciliği için endüstri standardı süreç metodolojisi ✓
- [C] Bir veri tabanı
- [D] Bir donanım

**S2.** MLOps neyin kısaltmasıdır?

- [A] Machine Learning Operations ✓
- [B] Multi-Level Operations
- [C] Mobile Learning Optimization
- [D] Modern Logic Operations

**S3.** Bir ML projesinde zamanın yaklaşık yüzde kaçı veri hazırlığında geçer?

- [A] %10
- [B] %30
- [C] %50
- [D] %70-80 ✓

**S4.** Data leakage (veri sızıntısı) nedir?

- [A] Verinin internetten sızması ✓
- [B] Test verisinden veya gelecekten gelen bilgilerin eğitim
- [C] Hard diskten veri kaybı
- [D] Şifre kırılması

**S5.** A/B testing ML modelleri için nasıl kullanılır?

- [A] Hiç kullanılmaz ✓
- [B] Yeni modeli (challenger) production'daki mevcut model
- [C] Sadece e-posta pazarlamasında
- [D] Sadece ofis tasarımında

**S6.** Model drift'in iki ana türü nelerdir?

- [A] Yüksek ve düşük ✓
- [B] Data drift (giriş dağılımının değişimi) ve Concept drift
- [C] Hızlı ve yavaş
- [D] İyi ve kötü

**S7.** Production-Training Gap'in en yaygın sebebi nedir?

- [A] İnternet hızı ✓
- [B] Feature engineering tutarsızlığı: eğitim sırasında kullanılan
- [C] Sadece donanım farkı
- [D] Hiçbir zaman olmaz

**S8.** 'Hidden Technical Debt in ML Systems' makalesinin ana mesajı nedir?

- [A] ML kodları kısadır ✓
- [B] ML kodu bir buz dağının görünen kısmıdır; veri yönetimi,
- [C] ML projeleri ucuzdur
- [D] Sadece akademik bir konu

**S9.** Champion-challenger yaklaşımı nedir?

- [A] Bir oyun teorisi ✓
- [B] Production'daki mevcut modeli (champion) yeni model adayı
- [C] Sadece spor analizi
- [D] Bir veritabanı yöntemi


---

## Modül 14: YZ ARAÇLARI VE PLATFORMLARI

- **ID:** `modul-14-yz-araclari-ve-platformlari`
- **Alt başlık:** Handbook Bölüm 14 · ~25 dk okuma
- **Tahmini süre:** 25 dk


![python ML libraries TensorFlow PyTorch](assets/images/lessons/modul-14-00.jpg)

*Python ML ekosistemi*

### 14.2 Cloud AI Servisleri


### 14.1 Programlama ve Framework'ler

Python, YZ'nin de facto dili. NumPy, Pandas, Matplotlib temel kütüphaneler.

- TensorFlow ve Keras (Google): Production-grade derin öğrenme framework'ü.
- PyTorch (Meta): Araştırmada en popüler, dinamik computation graph.
- Scikit-learn: Klasik ML algoritmaları için altın standart.
- Hugging Face: Önceden eğitilmiş model hub'ı, Transformers kütüphanesi.
- JAX: Google'ın yüksek performanslı sayısal hesaplama kütüphanesi.
- LangChain, LlamaIndex: LLM uygulama geliştirme.
- AWS AI/ML: SageMaker (uçtan uca ML), Bedrock (foundation models),
Rekognition (görüntü), Comprehend (NLP), Lex (chatbot).

- Google Cloud AI: Vertex AI, AutoML, Document AI, Translation,
- Microsoft Azure AI: Azure ML, Cognitive Services, OpenAI Service, Bot
- IBM Watson: Watsonx platformu, enterprise odaklı çözümler.
- Anthropic API: Claude modellerine erişim.
- OpenAI API: GPT modelleri, DALL-E, Whisper, embeddings.

![AWS Azure GCP AI services](assets/images/lessons/modul-14-01.jpg)

*Cloud AI servisleri karşılaştırma*

### 14.5 Model Deployment

- Google AutoML: Tablular, görüntü, metin, video için otomatik ML.
- DataRobot: Enterprise AutoML platformu.
- H2O.ai: Açık kaynak ve enterprise versiyonlar.
- Azure AutoML, AWS SageMaker Autopilot.
- Power Automate, Zapier: Workflow otomasyonu.
- n8n, Make.com: Görsel iş akışı tasarımı.
- Labelbox: Görüntü, video, metin için labeling platformu.
- Scale AI: Profesyonel data annotation hizmetleri.
- Amazon SageMaker Ground Truth: Crowdsourcing entegrasyonu.
- Roboflow: Bilgisayarlı görü datasetleri için.
- CVAT (Açık Kaynak): Intel'in geliştirdiği video annotation aracı.
- TensorFlow Serving: Production-grade TF model serving.
- TorchServe: PyTorch için.
- ONNX: Cross-framework model exchange formatı.
- Triton Inference Server (NVIDIA): GPU optimizasyonu.
- Docker ve Kubernetes: Konteynerizasyon ve orkestrasyon.
- Ray Serve, BentoML: Modern ML serving framework'leri.
- Edge deployment: TensorFlow Lite, ONNX Runtime, Core ML.

### Modül sonu quiz

**S1.** Aşağıdakilerden hangisi bir derin öğrenme framework'üdür?

- [A] Excel
- [B] PyTorch ✓
- [C] Photoshop
- [D] Word

**S2.** Hugging Face nedir?

- [A] Bir gülen yüz emojisi
- [B] Önceden eğitilmiş YZ modellerinin paylaşıldığı platform ve ✓
- [C] Bir kozmetik markası
- [D] Bir oyun

**S3.** Aşağıdakilerden hangisi bir cloud AI servisi DEĞİLDİR?

- [A] AWS SageMaker
- [B] Azure AI
- [C] Google Vertex AI
- [D] Microsoft Word ✓

**S4.** TensorFlow ile PyTorch arasındaki temel kullanım farkı nedir?

- [A] Aynıdır ✓
- [B] Genel olarak TensorFlow production deployment'ta, PyTorch
- [C] TensorFlow sadece görüntü için
- [D] PyTorch sadece metin için

**S5.** AutoML araçlarının temel amacı nedir?

- [A] Sadece görsel oluşturmak ✓
- [B] Model seçimi, hiperparametre ayarı ve özellik mühendisliği gibi
- [C] Sadece veri silmek
- [D] Sadece dosya yedeklemek

**S6.** ONNX neyin kısaltmasıdır ve ne işe yarar?

- [A] Online Network Exchange; ağ optimizasyonu ✓
- [B] Open Neural Network Exchange; framework'ler arası model taşıma
- [C] Optic Network X-ray; görüntü analizi
- [D] Hiçbir anlamı yok

**S7.** LangChain ve LlamaIndex gibi araçların temel kullanım amacı nedir?

- [A] Sadece veri görselleştirme ✓
- [B] LLM uygulamalarının geliştirilmesi: prompt yönetimi, RAG
- [C] Sadece veritabanı yönetimi
- [D] Sadece web tasarımı

**S8.** Model deployment'ta TensorFlow Lite ve Core ML'in kullanım alanı nedir?

- [A] Büyük sunucularda model çalıştırma ✓
- [B] Edge cihazlarda (mobil, embedded) optimize edilmiş model
- [C] Sadece veri analizi
- [D] Sadece veri saklama

**S9.** Kubernetes ML projelerinde neden önemlidir?

- [A] Hiç önemli değil ✓
- [B] Model serving'i konteynerize ederek otomatik scaling, yüksek
- [C] Sadece grafik kartlar için
- [D] Sadece veri görselleştirme


---

## Modül 15: YAPAY ZEKANIN GELECEĞİ

- **ID:** `modul-15-yapay-zekanin-gelecegi`
- **Alt başlık:** Handbook Bölüm 15 · ~35 dk okuma
- **Tahmini süre:** 35 dk


![artificial general intelligence AGI](assets/images/lessons/modul-15-00.jpg)

*AGI yolculuğu konsepti*

### 15.1 Teknolojik Trendler

Metin, görsel, ses, video, kodu birlikte anlayan modeller. GPT-4o, Claude Opus, Gemini multimodal yeteneklere sahiptir.

Geniş alanlarda çok büyük veriyle eğitilen, sonra spesifik görevlere uyarlanabilen büyük modeller. LLM'ler bunun en bilinen örneği.

Sadece soruları yanıtlamayan, otonom olarak görevleri tamamlayan, araçları kullanan, planlama yapan YZ sistemleri. Devin (yazılım), AutoGPT, Claude Computer Use örnekleri.

AI Agents (YZ Ajanları)

Kuantum bilgisayarlarda çalışan ML algoritmaları. Optimizasyon, simülasyon gibi alanlarda potansiyel sağlıyor. IBM Q, Google Sycamore.

Quantum Machine Learning

İnsan beyninin mimarisini taklit eden çipler. Düşük güçle yüksek verim. Intel Loihi, IBM TrueNorth.

Neuromorphic Computing

Neuralink, Synchron gibi şirketler beyin-bilgisayar arayüzleri geliştiriyor. Felçli hastalar için potansiyel.


### 15.2 Genel Yapay Zeka (AGI) Yolunda

AGI: İnsanın yapabileceği her bilişsel görevi yapabilen YZ. Tahminler değişiyor: Sam Altman 2027-2030, Yann LeCun on yıllar, Demis Hassabis 2030-2035.

AGI Nedir ve Ne Zaman Gerçekleşebilir?

AGI'yi de aşan, her alanda insandan üstün YZ. Nick Bostrom 'Superintelligence' kitabında riskleri detaylandırır.

Süper Zeka (Superintelligence)

YZ'nin amaçlarını insan değerleriyle hizalama problemi. 'AI Safety' alanı bu konuya odaklanır. Anthropic, OpenAI, DeepMind alignment araştırması yapıyor.

- Yanlış hizalama: Yanlış amaçları olan süper zeka.
- Kötü niyetli kullanım: Otonom silahlar, kitlesel manipülasyon.
- Güç yoğunlaşması: Az sayıda aktörün YZ'yi kontrol etmesi.
- İş gücü ve sosyal yapı bozulması.

![multimodal AI vision language](assets/images/lessons/modul-15-01.jpg)

*Multimodal YZ yetenekleri*

### 15.4 Düzenleyici Gelecek

- Eğitim Sisteminin Evrimi: Kişiselleştirilmiş öğrenme, AI tutor'lar, geleneksel diploma sisteminin sorgulanması.
- Çalışma Hayatının Geleceği: Hibrit insan-YZ takımlar, 4 günlük çalışma haftası, sürekli öğrenme zorunluluğu.
- Demokrasi ve Yönetişim: Seçim kampanyalarında YZ, otomatik politika analizi, derin dezenformasyon riski.
- Sağlık Hizmetlerinde Devrim: Erken teşhis, ilaç keşfi, yaş geri çevirme araştırmaları, kişiselleştirilmiş genomik tedavi.
- Yaratıcı Endüstriler: Yazarlar, sanatçılar, müzisyenler için yeni araçlar ve etik sorunlar.
- Küresel YZ Yönetişimi: BM AI Advisory Body, Bletchley Park
Deklarasyonu (2023), Seul Zirvesi (2024).

- Standartlar ve Sertifikasyon: ISO/IEC 42001, NIST AI RMF, sektörel sertifikalar.
- Uluslararası İşbirliği vs Rekabet: ABD-Çin teknoloji yarışı, ihracat kontrolleri, çip kısıtlamaları.
- Ulusal YZ Stratejileri: 60+ ülke YZ stratejisi yayınladı. Türkiye 2021'de strateji belgesini açıkladı.

![quantum machine learning](assets/images/lessons/modul-15-02.jpg)

*Quantum computing ve ML*

### 15.5 Etik ve Toplumsal Hazırlık

- YZ Okuryazarlığı: Her vatandaşın YZ'yi anlama ve eleştirel kullanma yetisi.
- Toplumsal Diyalog: Geliştiriciler, politikacılar, akademisyenler, vatandaşlar arasında diyalog.
- Kapsayıcı YZ Geliştirme: Global Güney'in sesi, az kaynaklı diller için modeller.
- Çeşitlilik ve Temsil: Geliştirici ekiplerinde, eğitim verilerinde, kullanım vakalarında çeşitlilik.
- Sürdürülebilir Gelişim: BM SDG'leri için YZ uygulamaları, gezegen sağlığı.

### Modül sonu quiz

**S1.** AGI neyin kısaltmasıdır?

- [A] Advanced Graphics Interface
- [B] Artificial General Intelligence ✓
- [C] Automated Game Industry
- [D] Active Group Integration

**S2.** Multimodal AI ne demektir?

- [A] Sadece metin işleyen YZ
- [B] Metin, görsel, ses, video gibi birden fazla veri türünü ✓
- [C] Çok pahalı YZ
- [D] Çok eski YZ

**S3.** AI Agent (YZ Ajanı) ne yapar?

- [A] Sadece soruları yanıtlar
- [B] Otonom olarak görevleri tamamlar, araçları kullanır, planlama ✓
- [C] Sadece müzik üretir
- [D] Sadece grafik tasarımı

**S4.** Foundation Model nedir?

- [A] Bir inşaat YZ'si ✓
- [B] Geniş alanlarda çok büyük veriyle eğitilen, spesifik görevlere
- [C] Sadece veritabanı temelleri
- [D] Eski bir model türü

**S5.** Quantum Machine Learning'in temel vaadi nedir?

- [A] Daha ucuz olması ✓
- [B] Klasik bilgisayarlarda zor olan optimizasyon ve simülasyon
- [C] Daha güzel grafikler
- [D] Sadece teorik bir konu

**S6.** Brain-Computer Interface (BCI) örneği hangisidir?

- [A] Klavye ✓
- [B] Neuralink
- [C] Mouse
- [D] Monitör

**S7.** AI Alignment problemi neden 'varoluşsal risk' olarak değerlendirilir?

- [A] Sadece akademik bir konu ✓
- [B] İnsan değerleriyle hizalanmamış süper zeka, insanlık için
- [C] Sadece bilim kurgu
- [D] Hiçbir önemi yok

**S8.** Neuromorphic computing'in geleneksel von Neumann mimarisine üstünlüğü hangi alanlarda olabilir?

- [A] Hiçbir alanda ✓
- [B] İnsan beynini taklit eden mimarisi sayesinde düşük güç
- [C] Sadece grafik üretiminde
- [D] Sadece veri saklamada

**S9.** Bletchley Park Deklarasyonu (2023) ne anlama gelir?

- [A] Sadece akademik bildiri ✓
- [B] ABD, Çin, İngiltere ve 25+ ülkenin frontier AI risklerini ele
- [C] Bir oyun yarışması
- [D] Sadece İngiltere'nin ulusal kararı


---

## Modül 16: UYGULAMALI ÇALIŞTAY VE ÖRNEKLER

- **ID:** `modul-16-uygulamali-calistay-ve-ornekler`
- **Alt başlık:** Handbook Bölüm 16 · ~30 dk okuma
- **Tahmini süre:** 30 dk


![Jupyter notebook machine learning](assets/images/lessons/modul-16-00.jpg)

*Jupyter notebook ML örneği*
GPT Modelleri ve Dil Devrimi


### 16.1 Hands-on Egzersizler

Iris veri kümesi ile klasik sınıflandırma örneği:

- Veri yükleme: scikit-learn'den load_iris Eğitim/test ayrımı: train_test_split Model seçimi: DecisionTreeClassifier veya RandomForestClassifier Eğitim: model.fit()
- Tahmin ve değerlendirme: accuracy_score, classification_report Görselleştirme: confusion matrix, decision boundary
Basit Bir ML Modeli Oluşturma (Jupyter Notebook)

- Role assignment: 'Sen deneyimli bir pazarlama uzmanısın\...' Few-shot prompting: Örneklerle öğretme Chain-of-thought: 'Adım adım düşün' Çıktı formatı belirleme: JSON, tablo, madde işaretleri Iteratif iyileştirme: Çıktıyı eleştirip yeniden yazdırma
ChatGPT/Claude ile Prompt Engineering

Google AutoML veya Azure AutoML'de kod yazmadan model eğitme deneyimi.

AutoML ile Model Eğitme

Teachable Machine (Google) ile webcam'den 5 dakikada görüntü sınıflandırıcı eğitme.


### 16.2 Vaka Çalışmaları

Netflix izleme süresinin %75'i öneri sisteminden geliyor. Collaborative filtering, content-based filtering ve deep learning kombinasyonu. 2009'da \$1M ödüllü 'Netflix Prize' yarışması.

Netflix Öneri Sistemi


### 8 kamera + neural network = otonom sürüş. Tesla'nın 'shadow mode' ile milyonlarca aracın verisini topladığı yaklaşım. FSD (Full Self-Driving) beta süreçleri ve tartışmaları.


### 2016'da Lee Sedol'u yenen DeepMind'ın AlphaGo'su. Monte Carlo Tree Search + Deep Reinforcement Learning. Sonraki versiyon AlphaZero hiç insan verisi kullanmadan satranç, Go ve Shogi'de en iyi oldu.

AlphaGo ve Oyun YZ'si

GPT-1 (2018, 117M parametre) → GPT-4 (2023, tahminen 1.7T parametre). ChatGPT 2 ayda 100M kullanıcıya ulaştı (TikTok'un yarısı kadar sürede).


![ChatGPT prompt engineering](assets/images/lessons/modul-16-01.jpg)

*ChatGPT/Claude prompt örnekleri*
Katılımcılardan kendi sektörleriyle ilgili problemler getirmeleri istenir ve YZ uygulanabilirliği tartışılır.


### 16.3 İnteraktif Q&A ve Senaryolar

- Bir bankada kredi başvurularının %40'ı manuel inceleniyor. Hangi adımlar? Bir e-ticaret sitesi müşteri sorularını otomatize etmek istiyor.
- Bir fabrika üretim hatasını %5'ten %1'e indirmek istiyor.
- Bir hastane radyoloji yükünü azaltmak istiyor. Hangi YZ çözümleri? Bir lise öğrenci başarısını artırmak istiyor. Kişiselleştirilmiş öğrenme nasıl tasarlanır?

### Modül sonu quiz

**S1.** Jupyter Notebook nedir?

- [A] Bir kitap markası
- [B] Veri bilimi ve ML için interaktif kod yazma ortamı ✓
- [C] Bir oyun konsolu
- [D] Sadece İngilizce öğrenme aracı

**S2.** AlphaGo hangi oyunda dünya şampiyonu Lee Sedol'u yenmiştir?

- [A] Satranç
- [B] Go ✓
- [C] Tavla
- [D] Tetris

**S3.** Iris veri kümesi neden ML eğitimlerinde sıkça kullanılır?

- [A] Çok büyük olduğu için
- [B] Küçük, anlaşılır, dengeli ve klasik sınıflandırma problemini ✓
- [C] Sadece İngilizce olduğu için
- [D] Çok karmaşık olduğu için

**S4.** Few-shot prompting tekniği nedir?

- [A] Birkaç saniyede prompt yazma ✓
- [B] LLM'ye birkaç örnek vererek görevi öğretme tekniği
- [C] Sadece görsel ile prompt verme
- [D] Çok kısa prompt

**S5.** Tesla'nın 'shadow mode' yaklaşımı nasıl çalışır?

- [A] Sadece geceleri çalışır ✓
- [B] Üretimdeki Tesla araçları kendi karar verirken aynı zamanda
- [C] Sadece simülasyonda çalışır
- [D] Hiç çalışmaz

**S6.** Netflix Prize yarışması neyle ünlüdür?

- [A] Film yarışmasıdır ✓
- [B] 2009'da öneri sistemi iyileştirmek için 1 milyon dolar ödüllü
- [C] Bir Oscar ödülüdür
- [D] Sadece Hollywood ile ilgilidir

**S7.** Iris veri kümesinde DecisionTreeClassifier ve RandomForestClassifier arasında performans farkı genelde küçüktür. Nedeni nedir?

- [A] Algoritmaların aynı olması ✓
- [B] Iris veri kümesi küçük, dengeli ve doğrusal olarak ayrılabilir
- [C] İnternet hızı
- [D] Çiçek türü olduğu için

**S8.** Bir LLM ile prompt engineering yaparken 'iteratif iyileştirme' yaklaşımı nedir?

- [A] Aynı prompt'u tekrar tekrar atma ✓
- [B] Çıktıyı modelin kendisine eleştirtip yeniden ürettirme; veya
- [C] Sadece İngilizce yazma
- [D] Sadece kısa cevap isteme

**S9.** AlphaZero'nun AlphaGo'ya kıyasla en büyük yeniliği nedir?

- [A] Daha hızlı olması ✓
- [B] Hiç insan oyun verisi kullanmadan, sadece self-play (kendi
- [C] Sadece satranç oynaması
- [D] Daha ucuz olması


---

## Modül 17: KAYNAKLAR VE İLERİ ÖĞRENİM

- **ID:** `modul-17-kaynaklar-ve-i-leri-ogreni-m`
- **Alt başlık:** Handbook Bölüm 17 · ~15 dk okuma
- **Tahmini süre:** 15 dk


![AI learning roadmap](assets/images/lessons/modul-17-00.jpg)

*YZ öğrenme yol haritası*

### 17.4 BONUS: YZ Sözlüğü (Temel Terimler)


### 17.1 Önerilen Kaynaklar

- Coursera: Andrew Ng'in 'Machine Learning' (klasik), 'Deep Learning
- edX: MIT 'Introduction to Deep Learning', Harvard 'CS50 AI'.
- Udacity: AI for Everyone, Deep Learning Nanodegree.
- Fast.ai: Pratik odaklı derin öğrenme kursları (Jeremy Howard).
- DeepLearning.AI: Specialized courses (NLP, GANs, MLOps).
- 'Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow' -
- 'Deep Learning' - Ian Goodfellow, Yoshua Bengio (teorik, ücretsiz online).
- 'Pattern Recognition and Machine Learning' - Christopher Bishop (matematiksel).
- 'The Hundred-Page Machine Learning Book' - Andriy Burkov (özet).
- 'Designing Machine Learning Systems' - Chip Huyen (production odaklı).
- 'Life 3.0' - Max Tegmark (felsefi).
- arXiv.org: Tüm YZ makalelerinin ön baskıları.
- Papers with Code: Makaleler + kod implementasyonları.
- Distill.pub: Görsel anlatımlı YZ makaleleri.
- Anthropic, OpenAI, DeepMind, Google AI bloglar.
Araştırma Kaynakları

- Lex Fridman Podcast: YZ liderleriyle uzun röportajlar.
- Two Minute Papers: Güncel makalelerin özetleri.
- 3Blue1Brown: Matematiksel sezgi ile YZ konseptleri.
- Yannic Kilcher: Makale incelemeleri.
- Türkçe: Tirendaz Akademi, Eğitim Sepeti.
- Kaggle: Yarışmalar, datasetler, notebook'lar, kurslar.
- GitHub: Açık kaynak projelere katkı.
- Reddit: r/MachineLearning, r/LocalLLaMA, r/artificial.
- Hugging Face: Model hub, dataset hub, topluluk.
- Stack Overflow & Stack Exchange: Soru-cevap.
- Discord/Slack toplulukları: Anthropic, OpenAI, çeşitli framework toplulukları.
- Yerel Meetup'lar: PyData İstanbul, ML Türkiye, AI Türkiye.
- Google TensorFlow Developer Certificate AWS Certified Machine Learning - Specialty Microsoft Azure AI Engineer Associate Microsoft Azure Data Scientist Associate IBM AI Engineering Professional Certificate DeepLearning.AI Specialization sertifikaları NVIDIA Deep Learning Institute sertifikaları
- Algorithm / Algoritma: Problem çözmek için adım adım talimatlar.
- API: Application Programming Interface, yazılımların birbiriyle iletişim arayüzü.
- Backpropagation / Geri Yayılım: Sinir ağlarında öğrenmenin temeli.
- Bias / Önyargı: Modelin sistematik hatası veya ayrımcılık.
- Dataset / Veri Kümesi: Eğitim için kullanılan veri topluluğu.
- Deep Learning / Derin Öğrenme: Çok katmanlı sinir ağlarıyla ML.
- Epoch: Tüm eğitim verisinin bir kez gözden geçirilmesi.
- Feature / Özellik: Modelin girdi olarak kullandığı değişken.
- Gradient Descent: Hata minimizasyonu için optimizasyon algoritması.
- Hallucination / Halüsinasyon: LLM'lerin yanlış ama emin görünen yanıtları.
- Hyperparameter / Hiperparametre: Modelin eğitim öncesi ayarlanan parametreleri.
- Inference / Çıkarım: Eğitilmiş modelin tahmin yapması.
- Loss Function / Kayıp Fonksiyonu: Modelin hatasını ölçen fonksiyon.
- Neural Network / Sinir Ağı: Beyinden ilham alan ML mimarisi.
- Overfitting: Modelin eğitim verisini ezberlemesi.
- Parameter / Parametre: Modelin öğrendiği değerler (ağırlıklar).
- Prompt: LLM'lere verilen talimat metni.
- Reinforcement Learning: Ödül-ceza ile öğrenme.
- Token: Metnin işlenebilir en küçük birimi.
- Training / Eğitim: Modelin veriden öğrenme süreci.
- Transfer Learning: Bir görevdeki bilgiyi başka göreve aktarma.

### Modül sonu quiz

**S1.** Andrew Ng hangi online eğitim platformunda popüler Machine Learning dersleri vermektedir?

- [A] Netflix
- [B] Coursera ✓
- [C] Instagram
- [D] TikTok

**S2.** Kaggle hangi alanda ünlüdür?

- [A] Yemek tarifleri
- [B] Veri bilimi yarışmaları ve datasetler ✓
- [C] Müzik paylaşımı
- [D] Sosyal medya

**S3.** arXiv.org ne için kullanılır?

- [A] Online alışveriş
- [B] Bilimsel makalelerin (özellikle YZ) ön baskılarının paylaşımı ✓
- [C] Müzik dinleme
- [D] Oyun oynama

**S4.** Papers with Code'un benzersiz özelliği nedir?

- [A] Sadece makale gösterir ✓
- [B] Akademik makaleleri kod implementasyonları ve benchmark
- [C] Sadece video paylaşır
- [D] Sadece görsel paylaşır

**S5.** Hangi sertifikasyon TensorFlow framework'ünde uzmanlığı belgeler?

- [A] AWS Solutions Architect ✓
- [B] Google TensorFlow Developer Certificate
- [C] Microsoft Office Specialist
- [D] Cisco CCNA

**S6.** Fast.ai kurslarının yaklaşımının özelliği nedir?

- [A] Sadece teorik ✓
- [B] Top-down ve pratik odaklı yaklaşım: önce uygulamayı yapıp sonra
- [C] Sadece İngilizce
- [D] Sadece çocuklar için

**S7.** Distill.pub'ı diğer YZ kaynaklarından ayıran özellik nedir?

- [A] Sadece kısa makaleler ✓
- [B] İnteraktif görselleştirmeler ve sezgisel açıklamalarla YZ
- [C] Sadece video içerikleri
- [D] Sadece akademik makaleler

**S8.** Hugging Face'in ML topluluğuna katkısı nedir?

- [A] Sadece blog yayınlar ✓
- [B] Transformers kütüphanesi, model hub, dataset hub ve Spaces ile
- [C] Sadece akademik konferans
- [D] Sadece donanım üretir

**S9.** Bir YZ öğrenme yolculuğunda 'derinlik vs genişlik' tercihinde dengeli yaklaşım neden önerilir?

- [A] Sadece akademik tavsiye ✓
- [B] Temel kavramları (matematik, istatistik, programlama) sağlam
- [C] Sadece bir alana odaklanmak yeterli
- [D] Hiç kavram öğrenmemek lazım


---
