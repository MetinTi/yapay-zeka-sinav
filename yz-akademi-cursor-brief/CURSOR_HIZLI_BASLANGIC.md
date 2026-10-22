# Cursor için hızlı başlangıç komutları

## 1. Projeyi başlat (Cursor terminal'de)
```bash
npx create-next-app@latest yz-akademi --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd yz-akademi
npm install zustand dexie dexie-react-hooks framer-motion lucide-react
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card progress tabs dialog input
```

## 2. Cursor Composer / Agent'a vereceğin ilk prompt

```
CURSOR_BRIEF.md dosyasını oku. Bu, Türkçe yapay zeka öğrenme PWA'sının tam brief'idir.

İlk görev: Sprint 1'i tamamla.
- types/index.ts oluştur (brief'teki tüm interface'ler)
- lib/store.ts → Zustand store (User, progress, settings)
- lib/db.ts → Dexie database setup
- lib/gamification.ts → XP/level/streak hesapları (test edilebilir, pure functions)
- components/BottomNav.tsx → 4 sekme (Ana, Öğren, Liderlik, Profil)
- app/layout.tsx → bottom nav + PWA meta tagleri
- 4 sayfa stub: app/page.tsx, app/ogren/page.tsx, app/liderlik/page.tsx, app/profil/page.tsx
- tailwind.config.ts → brief'teki renk paletini ekle
- public/manifest.json oluştur

Sprint sonunda commit at: "feat: project skeleton (Sprint 1)"
Sonra Sprint 2 için onay bekle.
```

## 3. Sonraki sprint'ler için prompt şablonu

```
Sprint [N]'i tamamla. Brief'teki [N] numaralı sprint listesine bak.
İçeriği `content/chapters/` altındaki JSON'lardan oku (ornek-bolum.json ve ornek-quiz.json şemaya bak).
Tüm fonksiyonlar için unit test yaz (Vitest).
Bitince commit at ve dur.
```

## 4. Önemli ipuçları

- **Önce types, sonra logic, en son UI** — Cursor agent'ın kafası karışmasın.
- Her sprint sonunda `npm run build` ile prod build'in geçtiğini doğrula.
- IndexedDB schema'sını değiştirirken Dexie version migration yaz.
- Türkçe karakter testi: `console.log("ışığı çöz")` her dosyada UTF-8 olduğunu doğrular.
- PWA test: Chrome DevTools → Application → Manifest + Service Workers sekmeleri.

## 5. İçerik üretimi (handbook'tan JSON'a)

Handbook DOCX'inden bölümleri JSON'a çevirmek için Cursor'a şu prompt'u ver:

```
/mnt/uploads/Yapay_Zeka_Egitimi.docx dosyasını oku.
Her bölümü ornek-bolum.json şemasına göre ayrı JSON dosyalarına çevir:
content/chapters/01-yz-temelleri.json
content/chapters/02-makine-ogrenmesi.json
...

Her bölüm için 3 zorlukta toplam 9 quiz sorusu üret (3 kolay + 3 orta + 3 zor):
content/quizzes/01-quiz.json
...

Her bölümden 10-15 flashcard üret (terim-tanım):
content/flashcards/01-cards.json
```
```
