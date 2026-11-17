// Separate Özak assessment. Existing general V2 questions remain unchanged.
export const EXAM_VERSION = 'ozak-ai-awareness-202612-v1';
export const DURATION_SECONDS = 10 * 60;

export const questions = [
  {
    id: 'ai-limits',
    topic: 'Yapay zekânın sınırları',
    text: 'Bir çalışma arkadaşın, “Yapay zekâ bu açıklamayı çok emin yazmış; doğru olmalı” diyor. Hangi yanıt en uygundur?',
    options: [
      'Emin bir anlatım, bilginin yakın zamanda doğrulandığını gösterir.',
      'Akıcı bir yanıt da hatalı olabilir; önemli bilgileri doğrulamalıyız.',
      'Aynı yanıtı tekrar üretmesi, bilgiyi doğrulamak için yeterlidir.',
      'Yanıt ayrıntılıysa yalnızca yazım hatalarını kontrol etmeliyiz.'
    ],
    correct: 1,
    explanation: 'Üretken yapay zekâ, öğrendiği örüntülerden yeni içerik oluşturur. Akıcılık ve kendinden emin anlatım doğruluk garantisi değildir; önemli iddialar ayrıca kontrol edilir.',
    outcome: 'Üretken yapay zekânın ikna edici fakat hatalı içerik üretebileceğini fark eder.'
  },
  {
    id: 'suitable-task',
    topic: 'Uygun kullanım alanı',
    text: 'Bir ekip, yapay zekâyı günlük işlerinde ilk kez kullanacak. İnsan kontrolüyle başlamak için hangi görev daha uygundur?',
    options: [
      'Tedarikçi sözleşmesinin son hâlini belirleyip onaylamak.',
      'Çalışanların performans notlarını belirleyip sisteme işlemek.',
      'Müşteri şikâyetlerinde ödenecek tutara karar verip işlemi yapmak.',
      'Herkese açık bir duyurudan ekip için kısa bir özet taslağı çıkarmak.'
    ],
    correct: 3,
    explanation: 'Kapsamı belli, sonucu kolayca kontrol edilebilen ve doğrudan işlem başlatmayan taslak işleri uygun bir başlangıçtır. Sonuç yine bir çalışan tarafından kontrol edilir.',
    outcome: 'Düşük riskli ve kontrol edilebilir bir yapay zekâ kullanım alanı seçer.'
  },
  {
    id: 'effective-prompt',
    topic: 'Etkili istem yazma',
    text: 'Onaylı bir araçta, kişisel bilgi içermeyen proje notlarından yöneticine özet hazırlayacaksın. Hangi istem görevi en açık biçimde tanımlar?',
    options: [
      'Yönetici için bu notları özetle: en çok 5 madde; risk ve sonraki adımları ayır, eksik bilgiyi belirt.',
      'Bu notları yönetici için etkileyici hâle getir; mümkün olduğunca ayrıntılı ve profesyonel bir metin yaz.',
      'Notları yöneticinin beklentilerine göre tamamla; belirtilmeyen sonraki adımları uygun biçimde tahmin et.',
      'Bu proje hakkında bir özet yaz; uzunluğunu ve hangi bilgilerin önemli olduğunu sen belirle.'
    ],
    correct: 0,
    explanation: 'Etkili istem; görevi, hedef kitleyi, çıktı biçimini ve sınırları belirtir. Eksik bilgiyi uydurmak yerine açıkça işaretlemeyi ister.',
    outcome: 'Görev, bağlam, sınır ve çıktı biçimi içeren bir istemi ayırt eder.'
  },
  {
    id: 'meeting-actions',
    topic: 'Toplantı notlarından iş takibi',
    text: 'Toplantı notlarından hazırlanan iş listesinde bir görevin sorumlusu ve teslim tarihi yazmıyor. Yapay zekâdan nasıl bir çıktı istemelisin?',
    options: [
      'Görevi, benzer toplantılarda en çok adı geçen kişiye atamasını.',
      'Eksik alanları doldurmak için görev satırını listeden çıkarmasını.',
      'Eksik alanları “belirtilmedi” diye işaretleyip teyide bırakmasını.',
      'Ekibin alışılmış işleyişinden bir sorumlu ve tarih çıkarıp listeye işlemesini.'
    ],
    correct: 2,
    explanation: 'Toplantıdan iş takibi çıkarırken kayıtta olmayan kararlar verilmiş gibi gösterilmez. Eksik sorumlu ve tarih alanları, ilgili kişilerle teyit edilmek üzere işaretlenir.',
    outcome: 'Özet ve iş takibi çıktılarında eksik bilgiyle uydurulmuş bilgiyi ayırır.'
  },
  {
    id: 'verify-research',
    topic: 'Kaynak ve güncellik kontrolü',
    text: 'Yapay zekâ, sunumunda kullanman için sektörle ilgili bir oran ve kaynak bağlantısı verdi. Oranı kullanmadan önce ne yapmalısın?',
    options: [
      'Oranı başka bir yapay zekâya sorup aynı yanıtı verip vermediğine bakmak.',
      'Kaynağı açıp oranın, kapsamın ve tarihin sunumdaki iddiaya uyduğunu kontrol etmek.',
      'Bağlantının çalıştığını kontrol edip sunuma kaynak adıyla birlikte eklemek.',
      'Oranı yuvarlayıp sunumda yapay zekâ desteği kullanıldığını belirtmek.'
    ],
    correct: 1,
    explanation: 'Kaynak bağlantısının bulunması yeterli değildir. Kaynağın gerçekten aynı sayıyı, aynı kapsam ve dönem için destekleyip desteklemediği kontrol edilir.',
    outcome: 'Araştırma çıktısındaki iddiayı kaynak, kapsam ve güncellik bakımından doğrular.'
  },
  {
    id: 'excel-check',
    topic: 'Excel sonucunu kontrol etme',
    text: 'Yapay zekânın önerdiği Excel formülü çalışıyor ve aylık satış toplamı üretiyor. Raporu paylaşmadan önce en yararlı kontrol hangisidir?',
    options: [
      'Formülün doğru satırları kapsadığını ve örnek hesaplarla uyuştuğunu kontrol etmek.',
      'Hata mesajı çıkmadığı için sonucu rapordaki diğer toplamlarla birlikte yayımlamak.',
      'Sonucu aynı istemle tekrar hesaplatıp iki yanıt aynıysa rapora eklemek.',
      'Hücreyi para birimi biçimine çevirip toplamın makul göründüğünü kontrol etmek.'
    ],
    correct: 0,
    explanation: 'Bir formül hata vermeden yanlış aralığı veya yanlış koşulları kullanabilir. Kapsam, iş kuralı ve birkaç bağımsız örnek hesap birlikte kontrol edilir.',
    outcome: 'Yapay zekâ destekli formüllerde çalışır görünen sonucu bağımsız olarak kontrol eder.'
  },
  {
    id: 'presentation-flow',
    topic: 'Hedef kitleye uygun sunum',
    text: 'Yönetime, bir iyileştirme önerisi için beş dakikalık PowerPoint sunumu hazırlayacaksın. İlk olarak nasıl bir akış istemelisin?',
    options: [
      'Tüm çalışma notlarını sırayla anlatan, ayrıntılı ve kapsamlı bir slayt dizisi.',
      'Kullanılacak araçların özelliklerini karşılaştıran, teknik ağırlıklı bir slayt dizisi.',
      'Görsel çeşitliliği öne çıkaran, her slaytta farklı bir konuyu tanıtan bir akış.',
      'Sorun, beklenen fayda, risk ve istenen kararı kısa biçimde anlatan bir akış.'
    ],
    correct: 3,
    explanation: 'Sunum akışı hedef kitleye, süreye ve beklenen karara göre kurulur. Yapay zekâdan önce bu yapıyı istemek, slaytların amaca hizmet etmesini kolaylaştırır.',
    outcome: 'Sunum taslağını hedef kitle, süre ve iletişim amacıyla ilişkilendirir.'
  },
  {
    id: 'protect-data',
    topic: 'Bilgi güvenliği',
    text: 'Müşteri adları ve iletişim bilgileri içeren bir dosyadan eğilim özeti çıkaracaksın. Dosyayı yapay zekâya vermeden önce ne yapmalısın?',
    options: [
      'Dosya adını değiştirip kişisel hesabındaki araca yüklemelisin.',
      'Müşteri adlarını silip kalan alanların kullanımını serbest saymalısın.',
      'Araç ve veri kullanım izinlerini kontrol edip gerekli veriyi uygun biçimde arındırmalısın.',
      'Aracın geçmişi kapalıysa dosyanın tamamını yükleyebilmelisin.'
    ],
    correct: 2,
    explanation: 'Önce kurumun izin verdiği araç ve veri kullanım koşulları kontrol edilir. Yalnız gerekli ve paylaşılması uygun veriler kullanılır; adları silmek tek başına anonimlik garantisi değildir.',
    outcome: 'Kişisel ve kurumsal veri paylaşımından önce araç izni ve veri gerekliliğini kontrol eder.'
  },
  {
    id: 'responsible-use',
    topic: 'Önyargı ve sorumlu kullanım',
    text: 'Yapay zekânın hazırladığı eğitim duyurusunda teknolojiyle ilgili görevler yalnız genç çalışanlara öneriliyor. En uygun yaklaşım hangisidir?',
    options: [
      'Yaşa dayalı varsayımı kaldırıp önerileri işle ilgili ihtiyaç ve becerilere göre gözden geçirmek.',
      'Metnin üslubunu yumuşatıp yaşa göre yapılan görev ayrımını olduğu gibi korumak.',
      'Aynı metni tekrar ürettirip benzer öneri gelirse ilk metni kullanmaya devam etmek.',
      'Metne yapay zekâyla hazırlandığı notunu ekleyip görev önerilerini değiştirmeden paylaşmak.'
    ],
    correct: 0,
    explanation: 'Yapay zekâ çıktıları önyargılı varsayımlar içerebilir. Öneriler yaş gibi genellemeler yerine işle ilgili ihtiyaç ve beceriler bakımından kontrol edilir.',
    outcome: 'İş içeriğinde önyargılı bir varsayımı fark edip uygun ölçütlerle düzeltir.'
  },
  {
    id: 'human-approval',
    topic: 'Gönderim öncesi insan kontrolü',
    text: 'Yapay zekâ, bir müşteriye gönderilecek teklif e-postasını hazırladı. E-postayı göndermeden önce en uygun adım hangisidir?',
    options: [
      'Yazım ve anlatımı kontrol edip fiyat ve koşulları taslaktaki gibi kabul etmek.',
      'Alıcıyı, fiyatı ve koşulları doğrulayıp gerekli yetkili onayından sonra göndermek.',
      'Taslağı ikinci bir yapay zekâya onaylatıp iki araç uzlaşırsa göndermek.',
      'Önce e-postayı gönderip müşteriden yanıt gelirse fiyat ve koşulları kontrol etmek.'
    ],
    correct: 1,
    explanation: 'Dışarıya gönderilen bir teklif taahhüt doğurabilir. Yapay zekânın taslağı, gerçek bilgiler ve geçerli onay süreci bakımından insan tarafından kontrol edilir.',
    outcome: 'Dış dünyaya etkisi olan bir işlemden önce doğrulama ve gerekli insan onayını uygular.'
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
