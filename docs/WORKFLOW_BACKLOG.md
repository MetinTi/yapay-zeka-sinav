# Agent çalışma düzeni — görev backlogu

## P0 — Main dalı koruması

- [ ] **DOC-MAIN-PROTECTION-P0 · P0 — Main korumasını kullanıcı onayına hazırla:** **2026-10-20 02:46:24 +0300 (Europe/Istanbul)** salt okunur GitHub denetiminde `main` korumasız (`protected=false`, etkin kurallar/ruleset boş, klasik koruma HTTP404). Depoya uygun PR zorunluluğu, doğrudan push/force-push/main silmeyi engelleme, admin/bypass istisnaları ve acil kurtarma planını değerlendir; somut ayar önizlemesini kullanıcıya sun. Bu repoda sürümlenen `.github/workflows/` yok; olmayan CI adını zorunlu kontrol diye seçme. Gerekli gerçek CI ve uygulanabilir Codex kapısını önce ayrı onaylı kapsamda hazırlayıp son PR HEAD’inde çalıştığını doğrula. Son ilgili PR HEAD’i için hedefli yerel doğrulama, güvenlik ve tamamlanmış Codex incelemesini koru; yorum/emoji veya NEUTRAL/atlanan sonuç gerçek başarılı CI yerine geçmez. Tek-maintainer/reviewer yetkisini ve PR birleşmesinin kilitlenmemesini değerlendir. Kabul: somut plan kullanıcıca onaylanır; ancak ayrı yetkili uygulama görevinde ayarlar etkinleştirilip API’den okunarak ve main’e yıkıcı deneme yapmadan izin/veri koruma yollarıyla doğrulanır. **Bu backlog işinde koruma, yetki, CI veya deployment ayarı değiştirilmedi.**

Bu public görev kaydı yalnız aşağıdaki P0 işlerini izler; mevcut yerel untracked `backlog.md` ve eski mobil taslaklar bu PR’a kopyalanmaz.

- [ ] **DOC-HISTORY-ARCHIVE-P0 · P0 — Kısa geçmiş / ayrıntılı arşiv:** `history.md` içinde tarihli tek cümle ve arşiv bağlantısı; `history_archive.md` içinde ayrıntılı kanıt/karar/eski kayıt düzenine kayıpsız geç. Mevcut kayıt, ID ve bağlantıları koru; eski bekleyen işi güncel görev sanma. Kabul: tüm eski kayıtların korunumu ve bağlantı kontrolü; bu görevde taşıma yapılmaz.
