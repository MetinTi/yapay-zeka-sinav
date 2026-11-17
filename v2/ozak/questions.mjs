// User-approved selection from the original V1 pool; generic V2 remains unchanged.
export const EXAM_VERSION = 'ozak-ai-awareness-202612-v2';
export const DURATION_SECONDS = 10 * 60;

export const questions = [
  {
    "id": "web-009",
    "sourceId": "web-009",
    "topic": "İstemin bileşenleri",
    "text": "Prompt mühendisliğinde \"Mükemmel Prompt Formülü\"nün bileşenleri nelerdir?",
    "options": [
      "Başlık, İçerik, Sonuç, Özet, Kaynakça",
      "Rol, Görev, Bağlam, Kısıtlamalar, Format",
      "Giriş, Gelişme, Sonuç",
      "Soru, Cevap, Doğrulama, Onay"
    ],
    "correct": 1,
    "explanation": "Mükemmel Prompt Formülü sunumda Rol, Görev, Bağlam, Kısıtlamalar ve Format olarak beş bileşenle detaylandırılmıştır.",
    "outcome": "Bir istemin rol, görev, bağlam, kısıtlamalar ve format bileşenlerini tanır."
  },
  {
    "id": "web-025",
    "sourceId": "web-025",
    "topic": "Zero-shot istem",
    "text": "Zero-Shot prompting hangi durumda kullanılır?",
    "options": [
      "Çok fazla veri olduğunda",
      "Model eğitilirken",
      "Sadece kod yazarken",
      "Örnek verilmeden doğrudan talimat verildiğinde"
    ],
    "correct": 3,
    "explanation": "Zero-shot, örnek vermeden talimat vermektir.",
    "outcome": "Örnek içermeyen doğrudan talimatı zero-shot olarak ayırt eder."
  },
  {
    "id": "web-006",
    "sourceId": "web-006",
    "topic": "Makine öğrenmesi türleri",
    "text": "Makine öğrenmesinin üç temel türü hangileridir?",
    "options": [
      "Denetimli, Denetimsiz ve Pekiştirmeli Öğrenme",
      "Hızlı, Orta ve Yavaş Öğrenme",
      "Yapay, Doğal ve Karma Öğrenme",
      "Tek katmanlı, Çok katmanlı ve Derin Öğrenme"
    ],
    "correct": 0,
    "explanation": "Sunumda ML'nin üç temel türü Denetimli (Supervised), Denetimsiz (Unsupervised) ve Pekiştirmeli (Reinforcement) Öğrenme olarak açıklanmıştır.",
    "outcome": "Denetimli, denetimsiz ve pekiştirmeli öğrenmeyi temel türler olarak tanır."
  },
  {
    "id": "web-028",
    "sourceId": "web-028",
    "topic": "Denetimli öğrenme",
    "text": "Denetimli öğrenmede temel özellik nedir?",
    "options": [
      "Veri etiketlenmemiştir",
      "Model kendi kendine öğrenir",
      "Girdi ve doğru çıktı vardır",
      "İnsan müdahalesi yoktur"
    ],
    "correct": 2,
    "explanation": "Denetimli öğrenmede doğru etiketli veri vardır.",
    "outcome": "Denetimli öğrenmede girdi ile doğru çıktı etiketinin birlikte bulunduğunu ayırt eder."
  },
  {
    "id": "web-043",
    "sourceId": "web-043",
    "topic": "Pekiştirmeli öğrenme",
    "text": "Bir yapay zeka modelinin \"ödül ve ceza\" (reward/penalty) mantığıyla kendi kendine öğrenmesini sağlayan Makine Öğrenmesi (ML) türü aşağıdakilerden hangisidir?",
    "options": [
      "Denetimli Öğrenme (Supervised Learning)",
      "Pekiştirmeli Öğrenme (Reinforcement Learning)",
      "Denetimsiz Öğrenme (Unsupervised Learning)",
      "Doğal Dil İşleme (NLP)"
    ],
    "correct": 1,
    "explanation": "Pekiştirmeli öğrenme (Reinforcement Learning), yapay zekanın ödül ve ceza mekanizmaları ile kendi kendine deneme yanılma yoluyla öğrenmesini sağlayan ML türüdür.",
    "outcome": "Ödül ve ceza geri bildirimiyle öğrenmeyi pekiştirmeli öğrenme olarak tanır."
  },
  {
    "id": "web-008",
    "sourceId": "web-008",
    "topic": "Doğal dil işlemenin bileşenleri",
    "text": "Doğal Dil İşleme (NLP) hangi temel bileşenlerden oluşur?",
    "options": [
      "Dil Anlama (NLU), Dil Üretimi (NLG), Konuşma Tanıma ve Konuşma Sentezi",
      "Sadece metin çevirisi ve duygu analizi",
      "Görüntü işleme ve ses tanıma",
      "Veri tabanı sorgulama ve raporlama"
    ],
    "correct": 0,
    "explanation": "NLP'nin temel bileşenleri sunumda Dil Anlama (NLU), Dil Üretimi (NLG), Konuşma Tanıma ve Konuşma Sentezi olarak sıralanmıştır.",
    "outcome": "Eğitimde ele alınan dil anlama, dil üretimi, konuşma tanıma ve konuşma sentezi bileşenlerini tanır."
  },
  {
    "id": "web-016",
    "sourceId": "web-016",
    "topic": "Metin sınıflandırma",
    "text": "Bir çağrı merkezi müdürü, müşteri şikayetlerini otomatik olarak kategorize etmek istiyor. Hangi yapay zeka alt dalı ve öğrenme türü en uygun çözümü sunar?",
    "options": [
      "Bilgisayarla Görü (Computer Vision) ve Pekiştirmeli Öğrenme",
      "Robotik ve Denetimsiz Öğrenme",
      "Büyük Veri analizi ve Derin Pekiştirmeli Öğrenme",
      "Doğal Dil İşleme (NLP) ve Denetimli Öğrenme (Supervised Learning)"
    ],
    "correct": 3,
    "explanation": "Müşteri şikayetlerinin metin tabanlı olması NLP gerektirir; etiketlenmiş geçmiş verilerden öğrenme ise Denetimli Öğrenme ile yapılır.",
    "outcome": "Metin tabanlı şikâyet sınıflandırmasını NLP ve denetimli öğrenmeyle ilişkilendirir."
  },
  {
    "id": "web-010",
    "sourceId": "web-010",
    "topic": "Büyük verinin 5V özelliği",
    "text": "Büyük Verinin (Big Data) 5V özelliği aşağıdakilerden hangisidir?",
    "options": [
      "Vision, Value, Verify, Volume, Velocity",
      "Video, Voice, Visual, Virtual, Verified",
      "Hacim (Volume), Çeşitlilik (Variety), Hız (Velocity), Değer (Value), Doğruluk (Veracity)",
      "Veri, Verimlilik, Vizyon, Varsayım, Varlık"
    ],
    "correct": 2,
    "explanation": "Büyük Verinin 5V özelliği sunumda Hacim, Çeşitlilik, Hız, Değer ve Doğruluk olarak gösterilmiştir.",
    "outcome": "Büyük verinin hacim, çeşitlilik, hız, değer ve doğruluk boyutlarını tanır."
  },
  {
    "id": "web-059",
    "sourceId": "web-059",
    "topic": "Veri çeşitliliği",
    "text": "Bir e-ticaret şirketi; mağaza içi kameralardan gelen müşteri dolaşım görüntülerini (video), sosyal medyadaki marka yorumlarını (metin) ve satın alma faturalarını (sayısal veriler) aynı anda birleştirerek anlamlı bir satış stratejisi oluşturmak istiyor. Bu durum Büyük Veri'nin (Big Data) en çok hangi \"V\" özelliğini vurgulamaktadır?",
    "options": [
      "Çeşitlilik (Variety)",
      "Hız (Velocity)",
      "Doğruluk (Veracity)",
      "Hacim (Volume)"
    ],
    "correct": 0,
    "explanation": "Video, metin ve sayısal verilerin aynı anda işlenmesi, Büyük Veri'nin farklı veri formatlarını barındırma özelliği olan Çeşitlilik (Variety) kavramını temsil eder.",
    "outcome": "Farklı veri biçimlerinin birlikte kullanılmasını çeşitlilik boyutuyla ilişkilendirir."
  },
  {
    "id": "web-058",
    "sourceId": "web-058",
    "topic": "Derin öğrenme ve GPU",
    "text": "Bir şirket otonom araçlar için yüksek çözünürlüklü kameralardan gelen anlık trafik videolarını analiz etmek istiyor. Veri hacmi petabaytlar seviyesinde ve kurallar geleneksel algoritmalarla manuel olarak kodlanamayacak kadar karmaşıktır. Bu şirketin teknoloji altyapısı tercihinde aşağıdakilerden hangisine öncelikli olarak yatırım yapması beklenir?",
    "options": [
      "Sadece yapısal verilerle çalışan kural tabanlı Makine Öğrenmesi (ML) algoritmalarına",
      "Derin Öğrenme (DL) ağlarını otonom şekilde eğitebilecek yüksek performanslı GPU donanımlarına",
      "Özellik çıkarımını manuel yapacak kalabalık bir insan veri etiketleme ekibine",
      "Oltalama (Phishing) saldırılarını engellemek için kurumsal ağ güvenlik duvarlarına"
    ],
    "correct": 1,
    "explanation": "Otonom araçlar gibi çok yüksek hacimli ve karmaşık görsellerin işlendiği yapılar, otonom çalışan derin öğrenme (DL) ağlarına ve bunları besleyecek güçlü GPU donanımlarına ihtiyaç duyar.",
    "outcome": "Yüksek hacimli karmaşık görüntü analizinde derin öğrenme ve GPU altyapısının rolünü tanır."
  }
];

export function scoreAnswers(answers) {
  let correct = 0, wrong = 0, empty = 0;
  for (const question of questions) {
    const answer = answers[question.id];
    if (!Number.isInteger(answer) || answer < 0 || answer >= question.options.length) empty++;
    else if (answer === question.correct) correct++;
    else wrong++;
  }
  return {score: correct * 10, correct, wrong, empty};
}
