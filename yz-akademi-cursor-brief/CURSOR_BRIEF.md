# Cursor Agent Brief — YZ Eğitim PWA

> Bu dokümanı Cursor agent'ına (Composer / Agent mode) ver. Tüm projeyi sıfırdan kurması için yeterli detayda yazılmıştır.

---

## Proje özeti

**Ad:** YZ Akademi (geçici)
**Tip:** Mobile-first Progressive Web App
**Amaç:** Türkçe yapay zeka eğitim handbook'unu interaktif, gamification destekli bir öğrenme uygulamasına dönüştürmek.
**Hedef kitle:** YZ öğrenmek isteyen Türk kullanıcılar (öğrenci, profesyonel, meraklı).

---

## Teknik stack

- **Framework:** Next.js 14+ (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand (lightweight global state)
- **Persistence:** IndexedDB (Dexie.js wrapper) + localStorage fallback
- **PWA:** next-pwa veya @ducanh2912/next-pwa
- **Animasyon:** Framer Motion
- **İkonlar:** Lucide React
- **Backend (sonra):** Supabase (auth + sync + leaderboard)
- **Push notification:** Web Push API + service worker

**Neden Next.js?** SSR ile SEO, App Router ile modern yapı, Vercel'e tek tıkla deploy, PWA desteği iyi.

---

## Klasör yapısı

```
yz-akademi/
├── app/
│   ├── layout.tsx                  # Root layout, PWA meta, manifest
│   ├── page.tsx                    # Ana sayfa = Dashboard
│   ├── ogren/
│   │   ├── page.tsx                # Bölüm listesi
│   │   └── [chapterId]/
│   │       └── page.tsx            # Bölüm okuma ekranı
│   ├── quiz/
│   │   └── [chapterId]/page.tsx    # Quiz ekranı
│   ├── flashcard/page.tsx          # Flashcard çalışma
│   ├── liderlik/page.tsx           # Leaderboard
│   ├── profil/page.tsx             # Kullanıcı profili + rozetler
│   ├── api/
│   │   └── sync/route.ts           # Supabase sync endpoint
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn componentleri
│   ├── BottomNav.tsx
│   ├── XPBar.tsx
│   ├── StreakBadge.tsx
│   ├── BadgeCard.tsx
│   ├── QuizQuestion.tsx
│   ├── Flashcard.tsx
│   └── ChapterCard.tsx
├── lib/
│   ├── store.ts                    # Zustand store
│   ├── db.ts                       # Dexie/IndexedDB setup
│   ├── gamification.ts             # XP, level, streak hesapları
│   ├── spaced-repetition.ts        # SM-2 algoritması
│   └── content.ts                  # Bölüm verisi loader
├── content/
│   ├── chapters/
│   │   ├── 01-yz-temelleri.json
│   │   ├── 02-makine-ogrenmesi.json
│   │   └── ... (17 bölüm)
│   ├── quizzes/                    # Her bölüm için 3 zorlukta soru
│   └── flashcards/                 # Terim-tanım kartları
├── public/
│   ├── manifest.json
│   ├── icons/                      # PWA ikonları (192, 512, maskable)
│   └── sw.js                       # Service worker (auto-gen)
└── types/
    └── index.ts                    # TypeScript types
```

---

## Veri modelleri (TypeScript)

```typescript
// types/index.ts

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string;        // ISO date
  streakFreezesAvailable: number;  // haftada 1 free
  totalReadingMinutes: number;
  joinedAt: string;
}

export interface Chapter {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;                    // lucide icon name
  color: 'purple' | 'teal' | 'amber' | 'coral' | 'blue' | 'pink';
  estimatedMinutes: number;
  sections: Section[];
  prerequisites?: number[];        // önce tamamlanması gereken bölümler
}

export interface Section {
  id: string;
  title: string;
  content: ContentBlock[];
}

export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'bullet' | 'image' | 'code' | 'quote';
  text?: string;
  level?: number;                  // heading için
  url?: string;                    // image için
  language?: string;               // code için
}

export interface Quiz {
  id: string;
  chapterId: number;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  xpReward: number;                // 30 / 50 / 80
}

export interface Flashcard {
  id: string;
  chapterId: number;
  front: string;                   // terim
  back: string;                    // tanım
  // Spaced repetition state (her kullanıcıda farklı)
}

export interface FlashcardState {
  flashcardId: string;
  easeFactor: number;              // SM-2: başlangıç 2.5
  interval: number;                // gün cinsinden
  repetitions: number;
  nextReviewDate: string;
  lastReviewedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'chapter' | 'performance' | 'discovery' | 'social';
  unlockedAt?: string;
}

export interface ProgressRecord {
  chapterId: number;
  sectionId: string;
  completed: boolean;
  readPercent: number;
  highlights: Highlight[];
  notes: Note[];
  lastReadAt: string;
}

export interface Highlight {
  id: string;
  blockId: string;
  startOffset: number;
  endOffset: number;
  color: 'yellow' | 'green' | 'pink' | 'blue';
  createdAt: string;
}

export interface Note {
  id: string;
  blockId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyGoal {
  date: string;
  targetMinutes: number;           // 10 / 20 / 40
  completedMinutes: number;
  tasksCompleted: number;
  tasksTotal: number;
  bonusClaimed: boolean;
}
```

---

## Gamification mantığı

### XP sistemi
```typescript
// lib/gamification.ts

export const XP_REWARDS = {
  READ_10_MINUTES: 20,
  COMPLETE_SECTION: 30,
  COMPLETE_CHAPTER: 100,
  QUIZ_EASY: 30,
  QUIZ_MEDIUM: 50,
  QUIZ_HARD: 80,
  QUIZ_PERFECT: 25,                // bonus, %100 doğru
  FLASHCARD_REVIEW: 5,
  FINAL_EXAM_PASS: 500,
  STREAK_7_DAYS: 50,
  STREAK_30_DAYS: 200,
  STREAK_100_DAYS: 1000,
  DAILY_GOAL_BONUS: 25,
};

// Seviye için gereken toplam XP (artan zorluk)
export function xpForLevel(level: number): number {
  // L1→2: 500, L2→3: 1000, L3→4: 1500 ... formula: level * 500
  return Array.from({ length: level }, (_, i) => (i + 1) * 500)
    .reduce((a, b) => a + b, 0);
}

export function calculateLevel(totalXP: number): { level: number; current: number; needed: number } {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) level++;
  const current = totalXP - xpForLevel(level);
  const needed = xpForLevel(level + 1) - xpForLevel(level);
  return { level, current, needed };
}

export const LEVEL_TITLES: { min: number; title: string }[] = [
  { min: 1, title: 'Veri Çırağı' },
  { min: 4, title: 'Algoritma Acemisi' },
  { min: 7, title: 'Sinir Ağları Çırağı' },
  { min: 11, title: 'ML Mühendisi' },
  { min: 16, title: 'YZ Ustası' },
  { min: 21, title: 'YZ Filozofu' },
];
```

### Streak sistemi
```typescript
export function updateStreak(user: User, today: string): User {
  const last = new Date(user.lastActivityDate);
  const now = new Date(today);
  const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);

  if (diffDays === 0) return user;                          // bugün zaten aktif
  if (diffDays === 1) return { ...user, streak: user.streak + 1, lastActivityDate: today };

  // Streak Freeze otomatik kullan
  if (diffDays === 2 && user.streakFreezesAvailable > 0) {
    return {
      ...user,
      streak: user.streak + 1,
      streakFreezesAvailable: user.streakFreezesAvailable - 1,
      lastActivityDate: today
    };
  }

  // Yumuşak iniş: 14+ günlük streak kırılınca 7'ye düşer
  const newStreak = user.streak >= 14 ? 7 : 0;
  return { ...user, streak: newStreak, lastActivityDate: today };
}
```

### Spaced Repetition (SM-2 algoritması)
```typescript
// lib/spaced-repetition.ts
// Kullanıcı 0-5 arası kalite puanı verir (Anki tarzı)
// 0-2: yanlış/zor, 3-5: doğru

export function updateFlashcardState(
  state: FlashcardState,
  quality: 0 | 1 | 2 | 3 | 4 | 5
): FlashcardState {
  let { easeFactor, interval, repetitions } = state;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  }

  easeFactor = Math.max(1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    ...state,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextReview.toISOString(),
    lastReviewedAt: new Date().toISOString(),
  };
}
```

---

## Ekranlar (öncelik sırasına göre)

### 1. Dashboard (`app/page.tsx`)
**MVP — ilk yapılacak**
- Üst: kullanıcı adı + avatar + streak badge (🔥 X gün)
- 3 metrik kartı: XP, Seviye, Liderlik sırası
- Level progress bar + sonraki ünvana ne kadar kaldığı
- Günlük hedef kartı (3 task, tamamlananlar ✓)
- Rozet vitrini (son 4 kazanılan + kilitliler)
- "Devam et" kartı: son okunan bölüm + ilerleme

### 2. Bölüm listesi (`app/ogren/page.tsx`)
- 17 bölüm grid'i (her biri ChapterCard)
- Her kart: ikon, başlık, dakika, ilerleme %, kilitliyse 🔒
- Prerequisite bölüm tamamlanmazsa kilitli

### 3. Bölüm okuma (`app/ogren/[chapterId]/page.tsx`)
- Üst: bölüm başlığı + progress bar + okuma süresi sayacı
- İçerik: ContentBlock'ları render et
- Sağa kaydır → highlight modu (4 renk seçeneği)
- Metni uzun bas → not ekleme modal'ı
- Alt: "Bölümü bitir" butonu → quiz'e yönlendir
- Otomatik kaydet: scroll pozisyonu + okunan blok ID'leri

### 4. Quiz (`app/quiz/[chapterId]/page.tsx`)
- 3 zorluk seçimi (kolay/orta/zor)
- Soru-soru ilerleme (one at a time)
- Cevap sonrası: doğru/yanlış animasyonu + açıklama
- Sonuç ekranı: skor, kazanılan XP, yanlışları gözden geçir
- %100 yapanlara "Mükemmeliyetçi" rozeti

### 5. Flashcard (`app/flashcard/page.tsx`)
- Bugünün kartları (nextReviewDate <= today)
- Kart çevirme animasyonu (front → back)
- 4 buton: "Tekrar (0)", "Zor (3)", "İyi (4)", "Kolay (5)"
- SM-2 ile bir sonraki tekrar tarihini güncelle

### 6. Liderlik (`app/liderlik/page.tsx`)
- Sekmeler: Haftalık, Arkadaşlar, Lig (Bronz/Gümüş/Altın)
- Top 50 listesi, kendi sıran vurgulu
- Haftalık reset (Pazartesi 00:00)

### 7. Profil (`app/profil/page.tsx`)
- İstatistikler: toplam okuma süresi, tamamlanan bölüm, quiz başarı oranı
- Tüm rozetler (kazanılan + kilitli + ipuçları)
- Ayarlar: bildirimler, günlük hedef, tema

---

## PWA gereksinimleri

### `public/manifest.json`
```json
{
  "name": "YZ Akademi",
  "short_name": "YZ Akademi",
  "description": "Türkçe yapay zeka öğrenme platformu",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#534AB7",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "Quiz çöz", "url": "/quiz" },
    { "name": "Flashcard", "url": "/flashcard" }
  ]
}
```

### Service worker davranışları
- Tüm içerik (JSON) cache-first
- Statik asset'ler cache-first
- API çağrıları network-first, fallback cache
- Push notification: streak hatırlatması (akşam 8'de), arkadaş aktivitesi

### Offline destek
- İçerik IndexedDB'de saklanır (Dexie)
- İlerleme online olunca Supabase'e sync
- Conflict resolution: last-write-wins (sonra geliştirilebilir)

---

## Tasarım sistemi

### Renkler (Tailwind config)
```js
// tailwind.config.ts
colors: {
  primary: { 50: '#EEEDFE', 500: '#534AB7', 700: '#3C3489', 900: '#26215C' },
  success: { 50: '#E1F5EE', 500: '#1D9E75', 700: '#0F6E56' },
  warning: { 50: '#FAEEDA', 500: '#EF9F27', 700: '#854F0B' },
  danger:  { 50: '#FCEBEB', 500: '#E24B4A', 700: '#A32D2D' },
  accent:  { 50: '#FAECE7', 500: '#D85A30', 700: '#993C1D' },
}
```

### Tipografi
- **Display font:** Plus Jakarta Sans (başlıklar)
- **Body font:** Inter (gövde)
- **Mono:** JetBrains Mono (kod)
- Boyutlar: 12, 14, 16, 18, 22, 28, 36

### Bileşen stilleri
- Card: `bg-white rounded-2xl border border-gray-100 p-4 shadow-sm`
- Button primary: `bg-primary-500 text-white rounded-xl py-3 px-6 font-medium active:scale-95 transition`
- Badge unlocked: dolu, canlı renk
- Badge locked: gri + lock ikonu + %35 opacity

### Animasyonlar (Framer Motion)
- Sayfa geçişleri: slide-x (mobile native hissi)
- XP kazanma: number count-up + scale pulse
- Rozet kazanma: confetti + scale-bounce modal
- Streak fire: flame ikonunda subtle pulse

---

## Geliştirme sırası (sprint planı)

### Sprint 1 — İskelet (1-2 gün)
1. `npx create-next-app@latest yz-akademi --typescript --tailwind --app`
2. shadcn/ui kurulumu, gerekli component'ler ekle
3. Klasör yapısını oluştur
4. TypeScript types
5. Bottom navigation + 4 sayfa stub
6. Zustand store kurulumu

### Sprint 2 — Veri ve içerik (1-2 gün)
7. Bölüm JSON şemasını tanımla
8. İlk 2 bölümün içeriğini JSON'a aktar (handbook'tan)
9. Dexie/IndexedDB setup
10. Content loader (lib/content.ts)

### Sprint 3 — Dashboard + okuma (2-3 gün)
11. Dashboard tüm kartlar
12. Bölüm listesi
13. Bölüm okuma ekranı (basit haliyle, highlight/not sonra)
14. İlerleme kaydetme

### Sprint 4 — Quiz + gamification (2-3 gün)
15. Quiz ekranı (3 zorluk)
16. XP/level hesaplamaları
17. Streak sistemi + günlük hedef
18. Rozet kazanma mantığı

### Sprint 5 — Flashcard + PWA (2 gün)
19. Flashcard ekranı + SM-2
20. PWA manifest + service worker
21. Push notification altyapı
22. Offline test

### Sprint 6 — Polish + sosyal (sonra)
23. Animasyonlar (Framer Motion)
24. Highlight + not alma
25. Supabase auth + sync
26. Liderlik tablosu

---

## Cursor agent'a verilecek ilk prompt örneği

> Aşağıdaki brief'i kullanarak `yz-akademi` adında bir Next.js 14 + TypeScript + Tailwind projesi oluştur. App Router kullan. İlk olarak Sprint 1'i tamamla: proje iskeleti, klasör yapısı, TypeScript types, bottom navigation, Zustand store ve 4 ana sayfanın boş stub'larını yap. Tasarım sistemini tailwind.config.ts'e yansıt. Bittikten sonra dur, Sprint 2'ye geçmek için onay iste.

---

## Önemli notlar

- **İçerik kaynağı:** Önceki konuşmada hazırladığımız 17 bölümlük handbook DOCX'i. Bunu Cursor agent'a yükle veya parse edip JSON'a çevir.
- **Türkçe karakterler:** ı, ş, ğ, ü, ö, ç — tüm dosyalar UTF-8 olmalı, font Türkçe glyph'leri desteklemeli (Inter ve Plus Jakarta Sans destekliyor).
- **Auth opsiyonel:** İlk versiyonda anonim kullanıcı (localStorage'da UUID). Supabase entegrasyonu sonra.
- **Test:** Vitest + Testing Library. Gamification fonksiyonları (XP, level, streak, SM-2) mutlaka unit test'li olmalı.
- **Deploy:** Vercel — `vercel --prod`. PWA otomatik çalışır.

---

## Sonraki adımlar

1. Bu brief'i Cursor'da yeni bir klasöre `CURSOR_BRIEF.md` olarak koy
2. Cursor Composer / Agent mode aç
3. "Bu brief'i oku ve Sprint 1'i başlat" de
4. Her sprint sonunda commit at, test et, devam et
