# Yapay Zeka Eğitimi ve Sınav

İki günlük yapay zeka eğitimi için Türkçe sınıf değerlendirmesi. Güncel web sürümü `v2/` içinde bulunur: **10 sabit soru, 10 dakika, her doğru 10 puan**. Başlangıç ve bitiş aynı soruları kullanır; ilk başlangıç puanı korunur, bitişte sonuç ve puan farkı gösterilir.

[Sınavı aç](https://sinav2.metintiryaki.com/) · [Başlangıç](https://sinav2.metintiryaki.com/?asama=baslangic) · [Bitiş](https://sinav2.metintiryaki.com/?asama=bitis)

## Web sürümünü yerelde çalıştır

Python 3 yeterlidir; web istemcisinin paket kurulumu veya derleme adımı yoktur. Depo kökünde:

```sh
python3 -m http.server 4179 --bind 127.0.0.1 --directory v2
```

Tarayıcıda `http://127.0.0.1:4179/` adresini aç. Ad soyad zorunludur; katılımcı kodu ve sınav taslağı aynı tarayıcıda saklanır. Kod kurtarma farklı cihaz veya alan adları arasında çalışmaz. E-posta ayrı ve isteğe bağlıdır; sonuç JSON olarak da indirilebilir.

Sunucuya kayıt Google Apps Script ve özel eğitmen tablosunu gerektirir. Backend şablonu, kurulum sınırları ve yayın komutu için [V2 rehberini](docs/exam-v2.md) kullan. Yerel HTTP sunucusunu açmak backend kurulumu veya canlı kayıt doğrulaması değildir.

Node.js ile hedefli web kontrolleri:

```sh
node --test qa/participant-state.test.mjs
node qa/v2-backend.test.cjs
```

## Kaynaklar ve kapsam

| Kaynak | İçerik |
|---|---|
| [`v2/`](v2/) | Güncel Türkçe sınıf web sınavı |
| [`apps-script/V2.template.gs`](apps-script/V2.template.gs) | Kamuya uygun V2 backend şablonu |
| [`mobile/README.md`](mobile/README.md) | Ayrı Flutter eğitim/sınav kaynakları |
| [`backlog.md`](backlog.md) | Mobil ürün kararları, geliştirme planı ve tarihsel görevler |
| [`ai-education.md`](ai-education.md) | Eğitim içeriği |
| [`docs/handbook_extracted.md`](docs/handbook_extracted.md) | Handbook'tan çıkarılan kaynak metin |
| [`tools/`](tools/) | Eğitim içeriği, görseller ve sınav havuzu üretim araçları |
| [`yz-akademi-cursor-brief/`](yz-akademi-cursor-brief/) | Önceki PWA yaklaşımına ait tasarım ve ürün taslakları |
| [`design_tokens.md`](design_tokens.md) | Projeye özel tasarım kuralları |

Mobil kaynaklar ve eğitim taslakları, 22 Ekim 2026 kullanıcı kararıyla ayrı kaynak kapsamı olarak repoya alınır. Bu kaynakların bulunması mobil uygulamanın yayımlandığı veya yeni özellik, servis kurulumu ve build işlemlerinin yetkilendirildiği anlamına gelmez. Önceki PWA/çok dilli planlar güncel V2 web kapsamından ayrıdır. Kök `index.html` ve `apps-script/Code.gs` önceki V1 hattına aittir.

## Belgeler ve veri sınırı

- [V2 akışı, backend kurulumu ve açık işler](docs/exam-v2.md)
- [Dağıtım bilgileri](DEPLOYMENT.md)
- [Çalışma kuralları](AGENTS.md) ve [çalışma düzeni P0 işleri](docs/WORKFLOW_BACKLOG.md)
- [Geliştirme ve yayın geçmişi](history.md); [önceki README'nin V1 kurulum/e-posta notları](history.md#readme-snapshot-2026-10-22)

Depo herkese açıktır. Gerçek `apps-script/V2.gs`, özel tablo kimliği, katılımcı kayıtları ve özel ekran kanıtları Git dışında kalır. Kayıtlar özel eğitmen tablosunda tutulur; katılımcı listesi herkese açık değildir. E-posta teslimi için mevcut kabul sınırı ve tarihli yayın/test kanıtları V2 rehberi ile geçmiş kaydında izlenir.
