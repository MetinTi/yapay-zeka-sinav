# Tarayıcıda sonuç PDF’si

- `jspdf-4.2.1.umd.min.js`: [jsPDF v4.2.1](https://github.com/parallax/jsPDF/releases/tag/v4.2.1), npm `jspdf@4.2.1` paketinden değiştirilmeden alındı. MIT lisansı `jspdf-LICENSE.txt` içindedir. Paket SHA-512: `YyAXyvnmjTbR4bHQRLzex3CuINCDlQnBqoSYyjJwTP2x9jDLuKDzy7aKUl0hgx3uhcl7xzg32agn5vlie6HIlQ==`.
- `../assets/fonts/Manrope-Regular.ttf` ve `Manrope-Bold.ttf`: Metin’in portföyündeki SIL Open Font License lisanslı Manrope değişken fontunun 400/700 ağırlıklarında statik örnekleri. Lisans `../assets/fonts/OFL.txt` içindedir.

PDF yalnız indirme düğmesine basıldığında tarayıcıda oluşturulur. Kütüphane/font/logo aynı kaynaktan yüklenir; sonuç bilgisi bir PDF servisine gönderilmez. HTML render, AcroForm, JavaScript ekleme veya dış kaynak yükleme özellikleri kullanılmaz.
