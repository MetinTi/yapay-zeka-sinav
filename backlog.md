# Yapay Zeka Eğitimi & Sınav — Backlog

Son gözden geçirme: **22 Ekim 2026**. Güncel web ürün: [README](README.md) ve [V2 işletim notu](docs/exam-v2.md). Mobil kaynaklar ayrı geliştirme kapsamıdır; kaynak aktarımı build, servis kurulumu veya mağaza yayını değildir. Tüm eski karar, ayrıntı ve ID'ler [özgün kayıtta](history.md#backlog-audit-2026-10-22) eksiksiz korunur. Tamamlandı kayıtları tarihsel kanıttır; yeni cihaz/Store kabulü sayılmaz.

| Dağıtım | Güncel kanıt sınırı |
|---|---|
| App Store | Konsol sorgulanmadı; sürüm/yayın doğrulanmadı. |
| Google Play | Konsol sorgulanmadı; sürüm/yayın doğrulanmadı. |
| Galaxy Store | Konsol sorgulanmadı; sürüm/yayın doğrulanmadı; plan yayın değildir. |

## Açık web ve süreç işleri

- [ ] **EXAM-V2-MAIL · P2:** İsteğe bağlı e-posta teslimi doğrulanmadı; kabul: ayrıca yetkilendirilmiş alıcıya deneme ve gelen kutusu kontrolü. V2 sınıf akışını engellemez.
- [ ] **EXAM-V1-SHEET · P2:** V1 tablo bağlantısının onarımı; V2 özel tablo kurulumundan ayrı.
- [ ] **W2:** Mobil havuz üretimi mevcut; V1 `index.html` gömülü P dizisiyle tek kaynak senkronu açık. Bu işi V2'nin 10 sabit soruluk sınıf kapsamıyla birleştirme.
- [ ] **B2:** Yeni yetkili Apps Script sürümünde dağıtım notları ve ilgili istemci endpoint'ini birlikte güncelle; bu kapanış deploy yapmaz.
- [ ] **DOC-HISTORY-ARCHIVE-P0 · P0:** Kayıpsız kısa geçmiş/ayrıntılı arşiv geçişi ayrı iş; [kanonik takip](docs/WORKFLOW_BACKLOG.md). Bu kapanışta başlatılmadı.

## Korunan mobil ürün kararları

| # | Karar | Durum |
|---|--------|--------|
| K1 | **17 modül** (handbook) — eğitim bu yapıda devam | **ONAY** |
| K2 | **Sosyal rozetler (G18)** | **ONAY** — Faz 3 / ertelendi |
| K3 | **Flashcard (G35)** | **ONAY** — kayıtlı, Faz 3+ (şimdilik yok) |
| K4 | **Newfound yok** — yalnızca Metin Tiryaki / metintiryaki.com | **ONAY** — B1, W1, e-posta şablonu |
| K5 | **Sınav yapısı** — mobil `exam_pool.json` (111 havuz → 20 soru) + Apps Script + e-posta; `examTags` / konuya göre sınav **yok** | **ONAY** |
| K6 | **İki backend** — sınav: Google Apps Script; gamification: Firebase | **ONAY** |
| K7 | **Çeviri motoru** — Google Cloud Translation Advanced (Neural) **kullanılmayacak**; batch çeviri **Gemini 2.5 Flash-Lite** | **ONAY 2026-05-19** |
| K8 | **Çeviri mimarisi** — statik cache: bir kez çevir → `lessons_{locale}.json`, `exam_pool_{locale}.json`, ARB; app içinde runtime çeviri API **yok** | **ONAY 2026-05-19** |

K1/K5/K6 mobil ürün planıdır; web V2 kapsamını değiştirmez. K7/K8 çeviri çalıştırma veya ücret yetkisi değildir; yeni uygulama öncesi güncel model/maliyet doğrulanır. Hedef kitle başlangıç ve profesyonel iş kullanıcısı; kod/teknik eğitim ve ağır uzun format yok. 12 modül taslağının yerini K1'deki 17 modül alır. Dersler giriş → içerik/örnek → pratik → cevaplı öz-değerlendirme yapısını korur; sınav ipucu/konu etiketi kullanılmaz.

## Mobil kaynak ile kararların uzlaştırılması — önce kabul

| ID | Mevcut kaynak / açık kabul |
|---|---|
| M14, G30 | `AuthGate`, Google/Apple/e-posta Auth ve login mevcut; M14'teki “login uygulanmayacak” eski kararıyla çatışıyor. Mayıs history'si Auth eklenmesini kaydeder; kararın açık uzlaştırılması ve gerçek oturum kabulü bekler. Login'i kaldırma/yeniden kurma yetkisi yok. Onboarding 3 adım, ödeme, wishlist, Latest News, öğretmen dışlamaları korunur. |
| G21–G23, G34 | Profil ve bildirim ayar ekranı mevcut; “profil henüz yok” güncel değil. Okuma süresi/quiz istatistiği, rozetler, günlük hedef ve tema seçimi için kaynak varlığı/kabul ayrıca doğrulanmalı; profil varlığı G21–G23 tamamlandı değildir. |
| M16, G32 | Çan `NotificationSettingsScreen` açar; `ReminderNotificationService` yerel günlük hatırlatma içerir. Eski SnackBar-only notu geçersiz. Cihaz izin/teslim kabulü bekler; bu kod FCM değildir, G32 push planı ayrı ve açık. |
| G25, G29 | Eski açık Educa/koyu dashboard ve Material ikon kararları, güncel `design_tokens.md`/AGENTS tasarım tercihiyle uzlaştırılıp görsel kabul edilmeli. Var olan kodu sessizce tasarım borcu kabul etme. |

## Açık mobil geliştirme ve kabul işleri

Kaynak incelemesi yeni özellik uygulama emri değildir. Önce yukarıdaki kararlar; ardından kullanıcının seçtiği iş. Eski “M11→M12→M13 sonra bakarız” ertelemesi korunur; kaynakların bulunması görsel kabulün yerine geçmez.

| ID | Kalan iş / bağımlılık |
|---|---|
| M11 | Modül listesinde kartlar ve tamamlanma özeti mevcut; G19 grid beklentisi ve ortak tasarımla görsel kabul bekler. |
| M12 | Ders detay ve quiz sheet mevcut; handbook akışı, metin/görsel yerleşimi ve ortak tasarım kabulü bekler. Video/ödeme kapsamı yok. |
| M13 | Başlangıç/sınav/sonuç ekranları mevcut; ortak renk/spacing ve gerçek cihaz smoke kabulü bekler. |
| M15, G6 | İlerleme yalnız tamamlanan ID/0–1 düzeyinde; bölüm içi yüzde, son okunan ve kalan süre açık. |
| M6 | Logo tarihsel tamamlandı; `attemptHint` paritesi ve Türkçe smoke açık. Eski üç kutulu home M10 ile aşılmıştır. |
| M7 | iOS pod/workspace kısa rehberi; mevcut mobil README hazırlığı vardır, hedefli workspace adımları ayrıca doğrulanmalı. Build emri değildir. |
| M8 | İkon/splash/gizlilik ve mağaza kabulü açık; mevcut dosyalar yayın kanıtı değil. IPA yalnız açık istekle; Android/Galaxy release Windows PC'de. |
| M17 | Educa Community kit ticari kullanım/atıf lisansı Store öncesi doğrulanmalı. Ders görsel atıfları bu lisansın yerine geçmez. |
| E1, E21 | E1 sunum notlarından zengin eğitim metni ve mini quiz geliştirme işi E21 kalite kabulüyle birlikte açık; sınav odaklı genişletme değildir. 17 modül aktarımı mevcut; parser/UI, görseller, içerik ve cevap anahtarlarının insan kalite kabulü açık. Modül 1 için önceki revizyon kanıtı history'de. |
| G1–G5 | Ad/avatar kaynakta kısmen var; streak, XP/seviye/sıra metrikleri, level progress, üç görev ve rozet vitrini açık. G25 tema kabulüne bağlı. |
| G7–G9 | XP aktivite kuralları, `level * 500` eşikleri ve unvanlar plan; özgün sayısal kurallar history'de korunur. |
| G10–G13 | Günlük aktivite serisi, haftalık freeze, milestone XP ve yumuşak iniş plan. |
| G14–G17 | 48 rozet planının streak/bölüm/performans/keşif kategorileri; sosyal kategori G18 ile ertelenmiştir. |
| G19–G20 | 17 bölüm mevcut fakat liste düzeninde; ChapterCard grid ve önceki bölüm tamamlanma kilidi açık. Sınav kilidiyle karıştırma. |
| G24, G26–G28 | Flutter/Dart, service sınıfları, shared_preferences ve Flutter animasyonu kaynakta; Hive/sqflite/Riverpod yalnız gerektikçe seçenek. Next.js/Zustand/Framer Motion'a geçiş yok. |
| G31, G40 | Firestore XP/streak/rozet/leaderboard ve offline yerel→merge sync açık; Auth varlığı bunları tamamlamaz. Yeni servis/erişim onayı gerekir. |
| G33, E3 | Remote Config/günlük hedef/XP veya Apps Script uzak içerik opsiyonel Faz 2; MVP yerel JSON. Mevcut web'e servis ekleme yetkisi yok. |

## Ertelenmiş ve iptal edilmiş kapsam

- **G18 / K2:** Sosyal rozetler Faz 3'e ertelendi; kullanıcı kararı korunur.
- **G35 / K3:** Flashcard Faz 3+; G7'de XP kuralının bulunması uygulandığı anlamına gelmez.
- **L1–L7 / K7–K8:** Çok dil ayrı mobil Faz 2+; henüz başlanmadı. L1 batch script + şema/`correctIndex`, L2 sözlük + Modül 1 pilot insan onayı, L3 statik JSON, L4 Flutter ARB, L5 locale yükleme/seçici, L6 yalnız değişen modülü çevirme ve runtime API olmaması, L7 insan incelemesi/isteğe bağlı DeepL spot-check. TR kaynak; EN ilk, sonra DE/FR/ES planı; web V2 Türkçe kalır. Script/locale varlıkları bu kaynakta bulunmadı; API çalıştırılmadı.
- **E2, E22, E24:** `examTags`/soru-konu eşlemesi/sınav ipucu K5 ile iptal; rastgele tek havuz kararı korunur.
- **E23 / eski E1:** Sınav odaklı içerik genişletme, v2 müfredat kararıyla aşılmıştır; Güncel E1 eğitim metni/mini quiz geliştirmesi ve E21 kalite işi açık kalır. Yeni sınav odaklı kapsam açma.
- **G36–G39:** Next.js/App Router, Tailwind/shadcn, IndexedDB/Dexie ve next-pwa tarihsel uygulanmayacak referanslar; karşılıkları Flutter tema/widget, G27 ve M8. Ayrı PWA kararı yok.
- **E10–E19, E20 ve numarasız 11/12:** 12 modüllük eski taslak ve E20 onayı K1 ile tarihsel kaldı; E10'un eski içerik tamamlandı kaydı korunur. E4–E9 özgün backlogda bulunmaz; yeni ID/iş uydurulmadı. [Tam karar ve özgün tablolar](history.md#backlog-audit-2026-10-22).

## Tamamlanan / tarihsel kaynak kayıtları

### Web ve kaynak kapanışı

- **HOST-20260928 · 28 Eylül 2026:** Ana Hosting'e geçiş/eski site silme ve HTTP/hash kabulü o tarihte tamamlandı; [ayrıntı](history.md#2026-09-28).
- **EXAM-V2-20260928, EXAM-V2-REV6, EXAM-V2-CLOSEOUT · 28 Eylül 2026:** V2 ilk 8 dakikalık sürümün ardından Rev6 ile 10 dakikaya geçti; yayın/özel Sheet/ön-son test ve public kaynak kapanışı tarihsel kanıtları [geçmişte](history.md#2026-09-28), güncel davranış [V2 notunda](docs/exam-v2.md).
- **W1, B1 · 17 Mayıs 2026:** Newfound marka kaldırma ve o günün Apps Script test/deploy kaydı [geçmişte](history.md#2026-05-17).
- **PR #5 · 22 Ekim 2026:** Mobil/eğitim kaynak aktarımı, README/AGENTS düzeni ve main koruması `bb65dada9d2c0b7148b76b93499f34178e75cf2d` ile birleşti; [inceleme ve kanıt](history.md#backlog-audit-2026-10-22).

### Mobil temel ve eğitim

- **P1, M0, M2 · 16 Mayıs 2026:** Proje kayıtları, Flutter iskeleti ve eğitim ekranları/yerel tamamlanma kaydı tarihsel kaynak işi olarak tamamlandı; [kanıt](history.md#2026-05-16).
- **M1 · 16 Mayıs 2026:** İlk 12 modül sınav özeti tamamlandı ve K1/M9 ile aşıldı; [özgün kayıt](history.md#backlog-audit-2026-10-22).
- **M3, M4, M5, M9, M10 · 17 Mayıs 2026:** 111/20/45 dk sınav, API entegrasyonu, handbook 17 modül ve Educa home kaynak işleri tarihsel tamamlandı; yeni cihaz/backend/Store kabulü değildir, [kanıt ve özgün ayrıntı](history.md#backlog-audit-2026-10-22).

### Hesap verisi güvenliği

- [x] **M-ACCOUNT-LOCAL · P1/P2 · 22 Ekim 2026:** Profil/ilerleme/avatar/hatırlatıcı UID bazında ayrıldı; başarılı hesap silmede yerel temizlik ve hesap değişiminde özel ekranların kapanması 10 yerel testle doğrulandı; gerçek cihaz/Firebase silme kabulü ayrı, [bulgu ve kanıt](history.md#account-local-review-2026-10-22).
