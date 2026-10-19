# AGENTS.md

> Applies to Claude Code, Cursor Agent, OpenAI Codex, Gemini CLI, Windsurf, and any LLM tooling configured for this project.

---

## 1. Core stance

This repository expects **judgment**, not blind obedience.

- **Do** use training knowledge, common product/engineering practice, and competitive/market context to evaluate trade-offs.
- **Do** offer alternatives, risks, and questions before or while implementing — especially for security, privacy, App Store / Play Store rules, data integrity, and retention-sensitive UX.
- **Do** disagree constructively when a request is ambiguous, under-specified, or likely to waste work. Propose a smaller or safer step first.
- **Do not** execute every instruction literally when it would cause clear harm, regressions, or platform-policy violations.

---

## 2. When to push back or pause

Slow down and challenge before proceeding when the work involves:

- Security, auth, PII, health claims, or store-review-sensitive strings
- Deleting user data, weakening database/firestore rules, or bypassing validation "to ship faster"
- One-off hacks that conflict with existing architecture without an explicit "we accept the debt" decision
- Scope that is clearly a product or business decision (pricing, legal copy) without a source of truth in the repo
- Any irreversible or wide blast-radius change (schema migration, delete, legal copy)

---

## 3. How to communicate

Calibrate depth to cost — pushing back on everything in long form wastes tokens and latency:

| Situation | Response |
|-----------|----------|
| Nothing looks risky | **Do the work.** At most one short assumption note. |
| Something is slightly off (edge case, naming, cheaper path) | **1–2 sentence flag** only. |
| Security / data loss / store review / major product bet | **Full debate** — state risks, give recommendation + option B. |

Always:
- State assumptions and risks briefly.
- If you must decline, say **why** and what you **can** do instead.
- If chat rules conflict with safety or platform policy, **safety wins** — explain the conflict.

---

## 4. App Store & Play Store rules — separate mobile scope only

These inherited platform checks apply only if separate mobile work is explicitly authorized; the current web product does not require a store release.

Always warn before implementing anything that could cause a store rejection. Known risk areas:

- **Background audio/recording** — Apple does not allow background recording without explicit entitlement and valid use case declaration.
- **Health & medical claims** — requires specific entitlements and review justification.
- **Push notifications** — must have explicit user opt-in; no dark patterns.
- **In-app purchases** — all digital goods must go through StoreKit / Google Billing; no external payment links for digital content.
- **Privacy labels** — any data collection must be declared accurately in App Privacy (Apple) and Data Safety (Google).
- **Tracking / ATT** — any cross-app tracking requires ATT prompt on iOS 14.5+.
- **Subscription cancellation** — must be cancellable from within the app or via platform settings; no friction flows.

When in doubt: **warn first, implement second.**

---

## 5. Localization

Current classroom V2 is **Turkish-only web**; see `README.md` and `docs/exam-v2.md`. The separate historical mobile plan proposed EN/TR/DE/FR/ES, with Arabic/RTL in V2; that is not authorization to expand this classroom release.

**Turkish language rules:**
- Always use correct Turkish special characters: `ç ş ğ ü ö ı İ`.
- Never substitute `i` for `İ` or `I` for `ı`.
- Review grammar carefully — machine translation often produces unnatural Turkish.
- Flag any translation string that looks off for human review.

---

## 6. Cost & budget controls

- **Per-change gate:** If a deployment or change is likely to exceed **USD 20**, warn and ask before proceeding.
- **End of every month:** Update `cost.md` with all recurring and one-time spend — cloud (Firebase, AWS, GCP…), Cursor or other agent subscriptions, Apple/Google developer programs, email (Resend, Mailgun…), storage, CDN, DNS/domain, analytics/crash paid tiers, AI/API keys metered by usage. Use tables. If something cannot be verified, say what's unknown and what export would resolve it.
- **Monthly cost review (1st of each month):** Produce a short consolidated summary for the maintainer of all inferred recurring app-related spend. Goal: one readable overview, not a forensic audit.

---

## 7. Daily operating rhythm

- **Start of day:** Skim `BACKLOG.md` and surface a short reminder of open tasks.
- **End of day:** Append to `history.md` what happened — features added, changes made, deployments, decisions, blockers.
- **Never delete** anything from `AGENTS.md`, `history.md`, or `BACKLOG.md`. Always update or cross out with ~~strikethrough~~.

---

## 8. Tech stack and product context

Current classroom V2 is the Turkish static web exam in `v2/`, with Google Apps Script and a private instructor Google Sheet; see `README.md` and `docs/exam-v2.md`. The separate earlier mobile plan is outside that V2 release scope. Do not add Flutter/React Native, Firebase Auth, Firestore, Storage, Analytics, Crashlytics or Remote Config merely because they appeared in the inherited generic mobile defaults. Document any explicitly authorized new service and its reason.

---

## 11. Relation to user preferences

Long-standing preferences in Cursor rules or chat (language, "single change at a time", no IPA builds unless asked) should be **respected where they don't conflict** with the above. If a rigid rule would force a harmful outcome, surface the tension and ask.

---

*Last updated: 2026-05-19*

---

## 10. Design system

Default output must look like a **premium consumer app** — not a Bootstrap template or admin panel.
Reference bar: Dribbble top shots, Awwwards Mobile Excellence, Apple Design Awards winners.

When in doubt: **make it more beautiful, not more minimal.**

### Visual language

| Element | Rule |
|---------|------|
| Depth | Layered cards, soft shadows, subtle parallax — never flat grey boxes |
| Color | Rich gradients or vibrant accent on dark/light base — never grey-on-white only |
| Typography | Large expressive headlines (Black/Bold weight), tight letter-spacing, clear hierarchy |
| Icons | SF Symbols, Phosphor, or Lucide — never default Material icons |
| Motion | Micro-animation on every interaction: scale, fade, spring physics |
| 3D / glass | Frosted glass cards, blurred backgrounds, subtle 3D transforms where appropriate |

### Component rules

- **Buttons** — gradient fill or bold solid color; never plain outlined grey
- **Cards** — floating (shadow + border-radius 24px+); never flat bordered boxes
- **Backgrounds** — gradient, mesh, or image-backed; never plain white or grey
- **Empty states** — illustrated or Lottie animated; not a grey icon + one-liner
- **Onboarding** — full-bleed illustration or Lottie animation per step
- **Bottom sheets / modals** — glassmorphism or strong surface color; not plain white popups

### Design tokens (defaults — override in `design_tokens.md` per project)

```
Primary gradient:   #6C3DE8 → #C44FD6
Accent:             #FF6B6B
Background dark:    #0D0D1A
Surface:            rgba(255,255,255,0.08)   ← glassmorphism
Border radius:      24px cards · 16px buttons · 999px chips
Shadow:             0 20px 60px rgba(0,0,0,0.3)
Font — display:     SF Pro Display / Inter — Black weight for headlines
Font — body:        SF Pro Text / Inter — Regular / Medium
Animation:          spring · stiffness 300 · damping 20
```

> Always check `design_tokens.md` if it exists in the project root — it overrides the defaults above.

### Mandatory references (check before designing a new screen)

- Dribbble mobile UI — https://dribbble.com/search/mobile-ui
- Awwwards Mobile Excellence — https://www.awwwards.com/websites/mobile-excellence
- Apple Design Awards — https://developer.apple.com/design/awards

### Prompt contract

When the user asks for a new screen or component without specifying style, always apply the above defaults. If the user pastes a Dribbble URL or screenshot, **match that reference exactly** — color, layout, depth, and motion.


## Ortak çalışma ve teslim akışı — 20 Ekim 2026

Bu son kullanıcı kararı mevcut proje, tasarım, dil, platform, güvenlik, maliyet ve yetki kurallarına eklenir; bunları topluca değiştirmez. Çelişkiyi sessizce çözme: aşağıdaki dar uzlaştırma dışında tam metni ve engeli bildir.

- **Belge kapanışı:** “update docs and repo” tüm backlogun güncel kod/test, kullanıcı kararları, PR ve yayın kanıtıyla gözden geçirilmesidir; tüm backlogu uygulama emri değildir. ID, önceki kanıt, bağımlılık ve engelleri koru; iptal, erteleme ve açıkça risk-kabul edilmiş işi ayrı tut, risk kabulü uydurma. Tamamlananları ilgili konu gruplarıyla belgenin en altında tarih + tek cümle + mevcut geçmiş arşivine bağlantı olarak tut; ayrıntı/karar/kanıtı arşive taşı. Eski “silme” kuralı kayıpsız taşımayı engellemez: özgün kayıt arşivde eksiksiz kalır, aktif belgede ID ve bağlantı korunur; kayıp doğuracak değişiklik yapma.
- **Git ve inceleme:** İzole görev dalında çalış; önce commit, sonra PR; main’e doğrudan push yok. Merge’den önce değişiklikle orantılı gerekli doğrulama, güvenlik incelemesi ve tamamlanmış Codex incelemesi en son ilgili PR HEAD’ini kapsamalıdır. Yeni düzeltmede etkilenen kontrol/incelemeyi yenile. Boş/atlanan kontrol, sessizlik, tetikleme veya emoji tamamlanma kanıtı değildir; sırf bot emojisi almak için sonsuz tekrar yapma. İnceleme/erişim eksikse PR açık kalır, engel raporlanır.
- **Bulgu ele alma:** Her bulguyu değerlendir: doğrulanmış kapsam içi kusuru rutin onay beklemeden düzelt ve hedefli doğrula; yanlış pozitifi somut kanıtla açıkla; belgelenmiş bilinçli kullanıcı/ürün kararını kaynağıyla koru, yeni maddi risk/bağlam olmadan tekrar açma. Düzeltme yeni kapsam veya aşağıdaki özel onay sınırına giriyorsa o sınırı uygula.
- **Yayın ve temizlik:** Önceden yetkili görev/servis/ortam kapsamında gerekli kontrol → scoped deploy → sağlık/canlı kontrol → kaynak/hedef kaydı → rapor akışını ayrıca rutin onay sormadan tamamla. Belge bakımı runtime deploy, build, Store upload/review/publication yetkisi vermez. Geri döndürülemez silme, credential/erişim/güvenlik değişikliği, yeni ücret, özel veri aktarımı ve kapsam genişlemesinde mevcut özel onay kuralları sürer. Gerçek merge’i ve hedef dalı doğrula; yalnız bu görevin dalını, yeni/birleşmemiş/aktif işi olmadığını doğruladıktan sonra projenin özel temizlik kuralıyla temizle; ilgisiz değişiklik/worktree korunur.
- **Yayın özeti:** Bu web/backend/araştırma projesine mobil mağaza tablosu uygulanmaz; kaynak, hedef, yayın ve kabul kanıtını kendi mevcut belgelerinde ayır. Mobil ürün ayrıca yetkilendirilirse mobil backlogun başında App Store/Play/Galaxy özeti gerekir; planlanan Galaxy dağıtımını yayın sayma.

- **Subagent kullanımı:** Birden fazla geliştirme, test veya inceleme işi gerektiğinde bağımsız işleri hızlandırmak için ihtiyaç kadar subagent kullan; sabit sayı sınırı veya ayrıca rutin izin şartı yoktur. Dosya çakışmasını ve gereksiz mükerrer işi önle, sonuçları birleştirerek doğrula. Mevcut kapsam/güvenlik/maliyet kuralları bütün subagentlara uygulanır. Bu son karar, eski sayı/izin ve bağımsız işleri paralel yürütmeme kısıtlarının yalnız bu kısmının yerini alır.
- **Firebase/GCP EU bölgesi:** Kurulum ve deploy öncesinde her ilgili kaynağın gerçek bölgesini ayrı ayrı kontrol et; US varsayılanına sessizce düşme. Bölgesi seçilebilen yeni kaynaklarda öncelik Frankfurt (`europe-west3`), desteklenmiyorsa Belçika (`europe-west1`) veya uygun başka bir AB bölgesidir. Functions, Cloud Run/SSR, App Hosting, Firestore/Realtime Database, Storage ve ilgili yardımcı kaynakları birlikte değerlendir; istemci endpoint’leri ile Hosting rewrite hedefleri de seçilen bölgeyle uyuşsun. Mevcut uygun EU bölgesini sırf tercih sırası için taşıma; deploy sonrasında gerçek hedefi doğrula. Firebase Hosting global CDN ve Google’ın bölge seçtirmediği/zorunlu tuttuğu hizmetler istisnadır: gerekçesini kaydet, EU’ya sabitlenmiş gibi sunma. [Resmî kaynak](https://firebase.google.com/docs/projects/locations) · [Hosting](https://firebase.google.com/docs/hosting). Mevcut US kaynağında bağımlılık/veri/geri dönüş planıyla EU geçiş işini backlog’a yaz; veri taşıma, kaynak silme, erişim değişikliği veya yeni ücret için gereken onayı atlama. Bu belge işi altyapı taşıması başlatmaz.
- **Geçmiş düzeni — P0:** Ayrı history arşivi olmayan bu projede kayıpsız `history.md` kısa tarihli dizin + `history_archive.md` ayrıntılı kanıt/karar düzenine geçiş backlog’da P0’dır. Şimdilik mevcut history dosyası kanonik ayrıntılı geçmiş olarak kullanılır; taşıma veya yeni arşiv bu görevde yapılmaz. Eski arşiv oluşturma yasağı bu son kullanıcı kararıyla yalnız planlanan P0 geçişi için aşılmıştır; gereksiz paralel TODO/ikinci arşiv açma.

Hesap/anahtar erişimi veya eski genel “tam yetki” ifadesi tek başına credential, erişim/güvenlik, ücret ya da özel veri aktarımı yetkisi değildir; mevcut özel onay sınırları geçerlidir.

**yapay-zeka-sinav uyarlaması:** README’deki güncel V2 Türkçe sınıf web sınavı ve özel katılımcı/backend verisinin public repo dışında kalması korunur. V1/mobil/beş dil planları tarihsel veya ayrı kapsamdır; mevcut web kapanışına mağaza özeti uygulanmaz, ileride ayrıca yetkilendirilen mobil backlog için uygulanır. Yerel untracked backlog.md/mobile çalışması bu PR’a taşınmaz; ayrı arşiv yerine mevcut history.md kullanılır.

Bu görevdeki P0 takibi [docs/WORKFLOW_BACKLOG.md](docs/WORKFLOW_BACKLOG.md) içindedir; yerel untracked backlog bu public PR’a kopyalanmaz.

Mevcut takip kaynakları: [history.md](history.md) · [ayrıntılı geçmiş](history.md).

Ayrıca yetkilendirilecek mobil çalışma için: **Mobil build makinesi:** iOS build/archive/sign yalnız MacBook’ta macOS/Xcode ile yapılır. Android ve Galaxy Store dağıtım/release paketleri yalnız Windows PC’de üretilir; Mac’te Android/Galaxy için APK/AAB üretim komutu çalıştırma. Mac’te Android debug çalıştırma, test ve emülatör/simülatör kontrolü yapılabilir; bunun gerektirdiği debug derlemesi dağıtım paketi üretme izni değildir. Build ve Store upload/review/publication için mevcut açık yetki kapıları korunur; PC’ye aynı kaynak commit’i ve sabitlenmiş araç sürümleriyle geç. Bu madde eski genel Mac/Windows Android geliştirme izninin build sınırını belirler.
