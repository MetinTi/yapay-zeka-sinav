let assetsPromise, libraryAttempt = 0, modelAttempt = 0;
async function loadAssets() {
  const modelPath = modelAttempt ? `../ozak/report-model.mjs?retry=${modelAttempt}` : '../ozak/report-model.mjs';
  let model;
  try { model = await import(modelPath); }
  catch (error) { modelAttempt++; throw error; }
  const libraryPath = libraryAttempt ? `../ozak/vendor/jspdf-4.2.1.umd.min.js?retry=${libraryAttempt}` : '../ozak/vendor/jspdf-4.2.1.umd.min.js';
  try { await import(libraryPath); }
  catch (error) { libraryAttempt++; throw error; }
  const load = async path => {
    const response = await fetch(new URL(path, import.meta.url));
    if (!response.ok) throw new Error('Report asset unavailable');
    return new Uint8Array(await response.arrayBuffer());
  };
  const [regular, bold, logo] = await Promise.all([
    load('../ozak/assets/fonts/Manrope-Regular.ttf'),
    load('../ozak/assets/fonts/Manrope-Bold.ttf'),
    load('./assets/blanchard-logo.png')
  ]);
  return {jsPDF: globalThis.jspdf.jsPDF, regular, bold, logo, ...model};
}
function binary(bytes) {
  let value = '';
  for (let index = 0; index < bytes.length; index += 8192) value += String.fromCharCode(...bytes.subarray(index, index + 8192));
  return value;
}
const colors = {navy: [19, 43, 66], gold: [234, 196, 122], ink: [23, 46, 68], muted: [83, 101, 120], paper: [247, 248, 250], white: [255, 255, 255], line: [224, 230, 235]};

// Only text and fixed local images are drawn; no HTML, scripts or remote report service.
export async function createResultPdf(result, profile, language = 'tr') {
  assetsPromise ||= loadAssets().catch(error => {assetsPromise = null; throw error;});
  const {jsPDF, regular, bold, logo, createReportModel, reportFilename} = await assetsPromise;
  const model = createReportModel(result, profile, language);
  model.title = model.title.replace('â', 'a');
  const en = language === 'en', copy = (tr, english) => en ? english : tr;
  const pdf = new jsPDF({unit: 'mm', format: 'a4', compress: true, putOnlyUsedFonts: true});
  pdf.addFileToVFS('Manrope-Regular.ttf', binary(regular));
  pdf.addFont('Manrope-Regular.ttf', 'Manrope', 'normal');
  pdf.addFileToVFS('Manrope-Bold.ttf', binary(bold));
  pdf.addFont('Manrope-Bold.ttf', 'Manrope', 'bold');
  pdf.setLanguage(en ? 'en-GB' : 'tr-TR');
  pdf.setProperties({title: model.title, subject: `${model.phase} - ${model.code}`, author: 'Metin Tiryaki', creator: 'Blanchard Türkiye Eğitim Değerlendirmesi'});
  const text = (value, x, y, size = 10, color = colors.ink, weight = 'normal', options = {}) => {
    pdf.setFont('Manrope', weight); pdf.setFontSize(size); pdf.setTextColor(...color);
    pdf.text(String(value), x, y, options);
  };
  const lines = (value, width, size, weight = 'normal') => {
    pdf.setFont('Manrope', weight); pdf.setFontSize(size);
    return pdf.splitTextToSize(String(value), width);
  };
  const card = (y, height, color = colors.white) => {
    pdf.setFillColor(...color); pdf.setDrawColor(...colors.line);
    pdf.roundedRect(18, y, 174, height, 4, 4, 'FD');
  };
  const background = () => {pdf.setFillColor(...colors.paper); pdf.rect(0, 0, 210, 297, 'F');};
  background();
  pdf.setFillColor(...colors.navy); pdf.rect(0, 0, 210, 60, 'F');
  text('BLANCHARD TÜRKİYE', 18, 15, 8, colors.gold, 'bold');
  text(copy('Yapay Zeka Eğitimi', 'AI Training'), 18, 29, 19, colors.white, 'bold');
  text(copy('Değerlendirme Sonucu', 'Assessment Result'), 18, 39, 19, colors.white, 'bold');
  text(model.phase, 18, 52, 10, colors.gold, 'bold');
  pdf.setFillColor(255, 253, 247); pdf.roundedRect(137, 14, 55, 25, 3, 3, 'F');
  pdf.addImage(logo, 'PNG', 142, 19, 45, 45 * 134 / 434);
  text('Metin Tiryaki', 164.5, 50, 9, colors.white, 'normal', {align: 'center'});

  const nameLines = lines(model.name, 160, 14, 'bold');
  const extraNameHeight = Math.max(0, nameLines.length - 1) * 6;
  const participantHeight = 56 + extraNameHeight;
  card(70, participantHeight);
  text(copy('KATILIMCI', 'PARTICIPANT'), 25, 81, 8, colors.muted, 'bold');
  nameLines.forEach((line, index) => text(line, 25, 90 + index * 6, 14, colors.ink, 'bold'));
  const metaY = 101 + extraNameHeight;
  text(copy('Katılımcı kodu', 'Participant code'), 25, metaY, 8, colors.muted);
  text(model.code, 25, metaY + 6, 10, colors.ink, 'bold');
  text(copy('Grup', 'Group'), 120, metaY, 8, colors.muted);
  text(model.group, 120, metaY + 6, 10, colors.ink, 'bold');
  text(model.dateLabel, 25, metaY + 17, 8, colors.muted);

  let y = 70 + participantHeight + 10;
  card(y, 46, colors.navy);
  text(copy('BU DENEMENİN PUANI', 'THIS ATTEMPT’S SCORE'), 25, y + 10, 8, colors.gold, 'bold');
  text(model.score, 25, y + 32, 35, colors.white, 'bold');
  text('/ 100', 54, y + 32, 12, colors.gold);
  [[model.correct, copy('doğru', 'correct')], [model.wrong, copy('yanlış', 'wrong')], [model.empty, copy('boş', 'unanswered')]].forEach(([value, label], index) => {
    const x = 108 + index * 30;
    text(value, x, y + 24, 22, colors.white, 'bold', {align: 'center'});
    text(label, x, y + 33, 8, colors.white, 'normal', {align: 'center'});
  });
  y += 54;
  text(`${copy('Kullanılan süre', 'Time taken')}: ${model.elapsedLabel}`, 20, y, 9, colors.muted);
  y += 9;
  if (model.comparison) {
    card(y, 29);
    const comparison = model.comparison;
    const delta = `${comparison.delta > 0 ? '+' : ''}${comparison.delta}`;
    [[copy('Ön test', 'Pre-test'), `${comparison.baseline}/100`], [copy('Son test', 'Post-test'), `${comparison.current}/100`], [copy('Puan farkı', 'Score difference'), delta]].forEach(([label, value], index) => {
      const x = 47 + index * 58;
      text(label, x, y + 9, 8, colors.muted, 'normal', {align: 'center'});
      text(value, x, y + 21, 16, colors.ink, 'bold', {align: 'center'});
    });
    y += 39;
  }
  text(copy('SONUCUN HAKKINDA', 'ABOUT YOUR RESULT'), 20, y, 8, colors.muted, 'bold');
  y += 7;
  for (const notice of model.notices) {
    const wrapped = lines(notice, 164, 9);
    const height = wrapped.length * 4.7;
    if (y + height > 274) {
      pdf.addPage(); background();
      text(model.title, 18, 22, 12, colors.ink, 'bold'); y = 34;
    }
    wrapped.forEach((line, index) => text(line, 20, y + index * 4.7, 9, colors.muted));
    y += height + 4;
  }
  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    pdf.setPage(page); pdf.setDrawColor(...colors.line); pdf.line(18, 282, 192, 282);
    text('Blanchard Türkiye · Metin Tiryaki', 18, 289, 8, colors.muted);
    text(`${page} / ${pageCount}`, 192, 289, 8, colors.muted, 'normal', {align: 'right'});
  }
  return {blob: pdf.output('blob'), filename: reportFilename(result, profile).replace(/^OZAK-/, 'BLANCHARD-')};
}

export async function downloadResultPdf(result, profile, language) {
  const {blob, filename} = await createResultPdf(result, profile, language);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename;
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
