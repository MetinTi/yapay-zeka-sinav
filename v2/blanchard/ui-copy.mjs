// Static, reviewed English UI copy. No translation service or participant data transfer.
const english = [
  ['.skip', 'Skip to content'],
  ['.intro .eyebrow', '<span class="short-line" aria-hidden="true"></span> INFORMED USE, A STRONG START'],
  ['.intro h1', 'AI Training<br><span>Assessment Test</span>'],
  ['.intro .lead', 'Assess your knowledge of core AI concepts, learning approaches and methods of use.'],
  ['.learning-path>div:first-child strong', 'Pre-test'],
  ['.learning-path>div:first-child small', 'See your starting point before training.'],
  ['.learning-path>div:last-child strong', 'Post-test'],
  ['.learning-path>div:last-child small', 'Compare your scores after training.'],
  ['.facts>div:nth-child(1)>span', 'questions'],
  ['.facts>div:nth-child(2)>strong>span', ' min'],
  ['.facts>div:nth-child(2)>span', 'test duration'],
  ['.facts>div:nth-child(3)>span', 'maximum score'],
  ['.preview-note', '<span class="dot" aria-hidden="true"></span> Pre-test and post-test · 10 points per correct answer.'],
  ['.intro-footnote', 'This is not a competition; it is a brief look at your learning before and after training.'],
  ['#link-title', 'Assessment link'],
  ['#start-form>h2', 'Start your assessment'],
  ['.phase-picker legend', 'Assessment stage'],
  ['.phase-picker label:first-of-type strong', 'Pre-test'],
  ['.phase-picker label:first-of-type em', 'Before training'],
  ['.phase-picker label:last-of-type strong', 'Post-test'],
  ['.phase-picker label:last-of-type em', 'After training'],
  ['label[for="participant-name"]', 'Your full name'],
  ['label[for="participant"]', 'Your participant code'],
  ['#code-hint', 'Your code is generated automatically. Use the same browser for the pre-test and post-test.'],
  ['.rules', 'Each correct answer earns <strong>10 points</strong>. Wrong answers do not deduct points. The pre-test and post-test use the same 10 questions.'],
  ['#start-form>.primary', 'Start test <span aria-hidden="true">↗</span>'],
  ['.data-note', 'Your name and code are sent when you start. Your answers are sent for scoring when you finish. Your score is recorded in your trainer’s private spreadsheet and saved in this browser.'],
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
  ['#download', 'Download result PDF ↓'],
  ['#review-toggle', 'View answers and explanations'],
  ['#home', 'Back to start'],
  ['footer>span', 'Blanchard Türkiye · Training Assessment Test'],
  ['footer>a', 'Trainer: Metin Tiryaki ↗'],
  ['#confirm-dialog h2', 'Ready to finish?'],
  ['#confirm-dialog button[value="cancel"]', 'Back to questions'],
  ['#confirm-dialog button[value="finish"]', 'Finish']
];
const attributes = [
  ['.language-options', 'aria-label', 'Language selection'],
  ['.trainer-art', 'alt', 'Metin Tiryaki and his applications’ logos'],
  ['.learning-path', 'aria-label', 'Assessment flow'],
  ['.timer', 'aria-label', 'Time remaining'],
  ['.progress', 'aria-label', 'Questions answered'],
  ['#question-nav', 'aria-label', 'Questions']
];
export function applyPageLanguage(language) {
  document.documentElement.lang = language;
  document.querySelector('#language-current').innerHTML = language === 'en' ? '🇬🇧 <span>EN English</span><span class="language-chevron" aria-hidden="true">⌄</span>' : '🇹🇷 <span>TR Türkçe</span><span class="language-chevron" aria-hidden="true">⌄</span>';
  if (language === 'en') {
    document.title = 'Blanchard Türkiye · AI Training Assessment Test';
    document.querySelector('meta[name="description"]').content = 'Blanchard Türkiye AI Training: assessment before and after training.';
    for (const [selector, html] of english) document.querySelector(selector).innerHTML = html;
    for (const [selector, name, value] of attributes) document.querySelector(selector).setAttribute(name, value);
  }
}
