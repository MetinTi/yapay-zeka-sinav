# yapay-zeka-sinav
Yapay Zeka Eğitimi Online Sınav

## Google Apps Script Kurulum

1. `apps-script/Code.gs` dosyasındaki kodu Apps Script projesine yapıştırın.
2. `SPREADSHEET_ID` ve `RESULTS_SHEET_NAME` değerlerini kontrol edin.
3. `Deploy > Manage deployments > Edit` ekranında:
   - `Execute as`: **Me**
   - `Who has access`: **Anyone**
4. Deploy sonrası oluşan `/exec` URL'sini `index.html` içindeki `SCRIPT_URL` alanına yazın.
5. Apps Script'te `testManual()` çalıştırıp logda `{status:"ok"}` görün.

Not: `Execute as: User accessing the web app` seçilirse, diğer kullanıcılar Sheet/Mail yetkisi olmadığı için sonuçlar yazılamayabilir.
