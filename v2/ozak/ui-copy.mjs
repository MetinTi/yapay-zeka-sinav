// Static, reviewed English UI copy. No translation service or participant data transfer.
const english = [
  ['.skip', 'Skip to content'],
  ['.intro .eyebrow', '<span class="short-line" aria-hidden="true"></span> INFORMED USE, A STRONG START'],
  ['.intro h1', 'AI Training<br><span>Assessment Test</span>'],
  ['.intro .lead', 'Assess your knowledge of using AI accurately, safely and effectively in everyday work.'],
  ['.learning-path>div:first-child strong', 'Pre-test'],
  ['.learning-path>div:first-child small', 'See your starting point before training.'],
  ['.learning-path>div:last-child strong', 'Post-test'],
  ['.learning-path>div:last-child small', 'Compare your scores after training.'],
  ['.facts>div:nth-child(1)>span', 'work scenarios'],
  ['.facts>div:nth-child(2)>strong>span', ' min'],
  ['.facts>div:nth-child(2)>span', 'test duration'],
  ['.facts>div:nth-child(3)>span', 'maximum score'],
  ['.preview-note', '<span class="dot" aria-hidden="true"></span> Pre-test and post-test · 10 points per correct answer.'],
  ['.intro-footnote', 'This is not a competition; it is a brief look at your learning before and after training.'],
  ['#group-picker>.eyebrow', 'YOUR SESSION'],
  ['#group-title', 'Choose your group'],
  ['#group-title + .hint', 'Continue with the group your trainer assigned. If you received a group link, this step is completed automatically.'],
  ['#group-picker>.hint:last-child', 'All groups use the same 10 questions. Dates shown are examples; the schedule is not confirmed.'],
  ['.change-group', 'Change group'],
  ['#start-form>h2', 'Start your assessment'],
  ['.phase-picker legend', 'Assessment stage'],
  ['.phase-picker label:first-of-type strong', 'Pre-test'],
  ['.phase-picker label:first-of-type em', 'Before training'],
  ['.phase-picker label:last-of-type strong', 'Post-test'],
  ['.phase-picker label:last-of-type em', 'After training'],
  ['label[for="participant-name"]', 'Your full name'],
  ['label[for="participant"]', 'Your participant code'],
  ['#new-code', 'New code'],
  ['#code-hint', 'Keep your code and use it again for the post-test. Scores are compared with the pre-test saved in this browser. Your pre-test score will not appear here on another device.'],
  ['#recover-code', 'Forgot my code · find by name'],
  ['.rules', 'Each correct answer earns <strong>10 points</strong>. Wrong answers do not deduct points. The pre-test and post-test use the same 10 questions.'],
  ['#start-form>.primary', 'Start test <span aria-hidden="true">↗</span>'],
  ['.data-note', 'When you start, your name and code are sent for registration in your trainer’s private Google spreadsheet. Your result is sent when you finish. Your code and scores are also saved in this browser.'],
  ['#storage-warning', 'This browser does not allow saving. Download your result to keep a copy.'],
  ['#options legend', 'Answer options'],
  ['#previous', '← Previous'],
  ['#next', 'Next →'],
  ['#finish', 'Finish assessment'],
  ['#result-title', 'Put your knowledge to work.'],
  ['.result-numbers>div:nth-child(1)>span', 'correct'],
  ['.result-numbers>div:nth-child(2)>span', 'wrong'],
  ['.result-numbers>div:nth-child(3)>span', 'unanswered'],
  ['#retry-result-sync', 'Retry saving to the trainer’s list'],
  ['#download', 'Download result ↓'],
  ['#review-toggle', 'View answers and explanations'],
  ['#home', 'Back to start'],
  ['footer>span', 'Özak Global Holding · Training Assessment Test'],
  ['footer>a', 'Trainer: Metin Tiryaki ↗'],
  ['#confirm-dialog h2', 'Ready to finish?'],
  ['#confirm-dialog button[value="cancel"]', 'Back to questions'],
  ['#confirm-dialog button[value="finish"]', 'Finish']
];
const attributes = [
  ['.language-picker', 'aria-label', 'Language selection'],
  ['.trainer-art', 'alt', 'Metin Tiryaki and his applications’ logos'],
  ['.learning-path', 'aria-label', 'Assessment flow'],
  ['.group-links', 'aria-label', 'Training groups'],
  ['.timer', 'aria-label', 'Time remaining'],
  ['.progress', 'aria-label', 'Questions answered'],
  ['#question-nav', 'aria-label', 'Questions']
];
export const exampleDays = {1: 4, 2: 6, 3: 10};
export function exampleDate(group, language) {
  return language === 'en' ? `Example date · ${exampleDays[group]} December 2026` : `Örnek tarih · ${exampleDays[group]} Aralık 2026`;
}
export function applyPageLanguage(language) {
  document.documentElement.lang = language;
  if (language === 'en') {
    document.title = 'Özak Global Holding · AI Training Assessment Test';
    document.querySelector('meta[name="description"]').content = 'Özak Global Holding AI Training: assessment before and after training.';
    for (const [selector, html] of english) document.querySelector(selector).innerHTML = html;
    for (const [selector, name, value] of attributes) document.querySelector(selector).setAttribute(name, value);
  }
  document.querySelectorAll('.group-link').forEach((link, index) => {
    const group = index + 1;
    link.querySelector('strong').textContent = language === 'en' ? `Group ${group}` : `Grup ${group}`;
    link.querySelector('.group-date').textContent = exampleDate(group, language);
    if (language === 'en') link.href += '&lang=en';
  });
  if (language === 'en') document.querySelector('.change-group').href = './?lang=en';
}
