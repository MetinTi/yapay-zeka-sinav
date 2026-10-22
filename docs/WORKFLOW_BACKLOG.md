# Agent çalışma düzeni — görev backlogu

## P0 — Main dalı koruması

- [x] **DOC-MAIN-PROTECTION-P0 · P0 — Main korumasını kullanıcı onayına hazırla:** **2026-10-20 02:46:24 +0300 (Europe/Istanbul)** salt okunur GitHub denetiminde `main` korumasız (`protected=false`, etkin kurallar/ruleset boş, klasik koruma HTTP404). Depoya uygun PR zorunluluğu, doğrudan push/force-push/main silmeyi engelleme, admin/bypass istisnaları ve acil kurtarma planını değerlendir; somut ayar önizlemesini kullanıcıya sun. Bu repoda sürümlenen `.github/workflows/` yok; olmayan CI adını zorunlu kontrol diye seçme. Gerekli gerçek CI ve uygulanabilir Codex kapısını önce ayrı onaylı kapsamda hazırlayıp son PR HEAD’inde çalıştığını doğrula. Son ilgili PR HEAD’i için hedefli yerel doğrulama, güvenlik ve tamamlanmış Codex incelemesini koru; yorum/emoji veya NEUTRAL/atlanan sonuç gerçek başarılı CI yerine geçmez. Tek-maintainer/reviewer yetkisini ve PR birleşmesinin kilitlenmemesini değerlendir. Kabul: somut plan kullanıcıca onaylanır; ancak ayrı yetkili uygulama görevinde ayarlar etkinleştirilip API’den okunarak ve main’e yıkıcı deneme yapmadan izin/veri koruma yollarıyla doğrulanır. **Bu backlog işinde koruma, yetki, CI veya deployment ayarı değiştirilmedi.**

Bu çalışma akışı kaydı P0 işleri izler. 20 Ekim belge PR’ına alınmayan yerel mobil backlog ve kaynaklar, kullanıcının 22 Ekim 2026 ayrı yetkisiyle sürümlenmiştir; [mobil backlog](../backlog.md) ayrı ürün kapsamıdır.

- [ ] **DOC-HISTORY-ARCHIVE-P0 · P0 — Kısa geçmiş / ayrıntılı arşiv:** `history.md` içinde tarihli tek cümle ve arşiv bağlantısı; `history_archive.md` içinde ayrıntılı kanıt/karar/eski kayıt düzenine kayıpsız geç. Mevcut kayıt, ID ve bağlantıları koru; eski bekleyen işi güncel görev sanma. Kabul: tüm eski kayıtların korunumu ve bağlantı kontrolü; bu görevde taşıma yapılmaz.

## Tamamlanan çalışma akışı işleri

- **DOC-MAIN-PROTECTION-P0 · 22 Ekim 2026:** Kullanıcının açık uygulama yetkisiyle [main ruleset #25666505](https://github.com/MetinTi/yapay-zeka-sinav/rules/25666505) etkinleştirildi; PR zorunluluğu, force-push/silme engeli ve boş bypass listesi API'den doğrulandı; CI/status gate yok, son HEAD Codex ve güvenlik incelemesi manuel süreçtir. [Kanıt ve karar](../history.md#main-protection-2026-10-22). Yukarıdaki özgün plan geçmiş bağlamı için korunur; ayrı plan onayı bekleme durumu son uygulama yetkisiyle tamamlanmıştır.
