// Faithful English rendering of the same assessment, with identical answer identities.
export {EXAM_VERSION, DURATION_SECONDS, scoreAnswers} from './questions.mjs';

export const questions = [
  {
    id: 'ai-limits',
    topic: 'The limits of AI',
    text: 'A colleague says, “The AI sounded very confident in this explanation, so it must be correct.” Which response is most appropriate?',
    options: [
      'A confident explanation shows that the information was recently verified.',
      'Even a fluent answer can be wrong; we should verify important information.',
      'Producing the same answer again is enough to verify the information.',
      'If the answer is detailed, we only need to check for spelling mistakes.'
    ],
    correct: 1,
    explanation: 'Generative AI creates new content from patterns it has learned. Fluency and confidence do not guarantee accuracy; important claims need separate verification.',
    outcome: 'Recognises that generative AI can produce convincing but incorrect content.'
  },
  {
    id: 'suitable-task',
    topic: 'Choosing a suitable use case',
    text: 'A team will use AI in its daily work for the first time. Which task is a more suitable starting point with human review?',
    options: [
      'Finalising and approving a supplier contract.',
      'Assigning employee performance ratings and entering them into the system.',
      'Deciding how much to pay for customer complaints and making the payments.',
      'Drafting a short summary of a public announcement for the team.'
    ],
    correct: 3,
    explanation: 'Drafting tasks with a clear scope, an easily checked result and no direct action are a suitable starting point. An employee still reviews the result.',
    outcome: 'Chooses an AI use case that is low risk and easy to review.'
  },
  {
    id: 'effective-prompt',
    topic: 'Writing an effective prompt',
    text: 'Using an approved tool, you will prepare a summary for your manager from project notes that contain no personal information. Which prompt defines the task most clearly?',
    options: [
      'Summarise these notes for the manager in no more than 5 bullet points; separate risks from next steps and identify missing information.',
      'Make these notes impressive for the manager; write a text that is as detailed and professional as possible.',
      'Complete the notes to meet the manager’s expectations; make suitable guesses about any next steps that are not stated.',
      'Write a summary of this project; decide its length and which information matters.'
    ],
    correct: 0,
    explanation: 'An effective prompt specifies the task, audience, output format and constraints. It asks for missing information to be flagged rather than invented.',
    outcome: 'Identifies a prompt that includes a task, context, constraints and output format.'
  },
  {
    id: 'meeting-actions',
    topic: 'Turning meeting notes into action items',
    text: 'An action list prepared from meeting notes does not specify the owner or deadline for one task. What output should you ask the AI to produce?',
    options: [
      'Assign the task to the person mentioned most often in similar meetings.',
      'Remove the task from the list to deal with the missing fields.',
      'Mark the missing fields as “not specified” and leave them for confirmation.',
      'Infer an owner and deadline from the team’s usual way of working and add them to the list.'
    ],
    correct: 2,
    explanation: 'When extracting action items from a meeting, decisions absent from the record should not be presented as agreed. Missing owners and deadlines are flagged for confirmation with the people involved.',
    outcome: 'Distinguishes missing information from invented information in summaries and action lists.'
  },
  {
    id: 'verify-research',
    topic: 'Checking sources and currency',
    text: 'AI has provided an industry percentage and a source link for your presentation. What should you do before using the percentage?',
    options: [
      'Ask another AI for the percentage and check whether it gives the same answer.',
      'Open the source and check that the percentage, scope and date support the claim in your presentation.',
      'Check that the link works, then add the percentage and the source name to the presentation.',
      'Round the percentage and mention that AI was used in preparing the presentation.'
    ],
    correct: 1,
    explanation: 'Having a source link is not enough. Check that the source actually supports the same number for the same scope and time period.',
    outcome: 'Verifies a research claim against its source, scope and currency.'
  },
  {
    id: 'excel-check',
    topic: 'Checking an Excel result',
    text: 'An Excel formula suggested by AI runs successfully and produces a monthly sales total. Which check is most useful before sharing the report?',
    options: [
      'Check that the formula covers the correct rows and agrees with sample calculations.',
      'Publish the result alongside the other totals in the report because no error message appeared.',
      'Repeat the calculation with the same prompt and add it to the report if both answers match.',
      'Format the cell as currency and check that the total looks reasonable.'
    ],
    correct: 0,
    explanation: 'A formula can use the wrong range or conditions without displaying an error. Check the scope, business rule and several independent sample calculations together.',
    outcome: 'Independently checks an apparently working result from an AI-assisted formula.'
  },
  {
    id: 'presentation-flow',
    topic: 'Presenting for your audience',
    text: 'You will prepare a five-minute PowerPoint presentation to management about an improvement proposal. What outline should you ask for first?',
    options: [
      'A detailed and comprehensive slide deck that presents all working notes in order.',
      'A technical slide deck comparing the features of the tools to be used.',
      'An outline focused on visual variety, introducing a different topic on every slide.',
      'An outline that briefly covers the problem, expected benefit, risks and decision requested.'
    ],
    correct: 3,
    explanation: 'A presentation outline is shaped by its audience, available time and intended decision. Asking AI for this structure first helps keep the slides focused on their purpose.',
    outcome: 'Connects a presentation draft to its audience, duration and communication goal.'
  },
  {
    id: 'protect-data',
    topic: 'Information security',
    text: 'You will summarise trends from a file containing customer names and contact details. What should you do before giving the file to AI?',
    options: [
      'Rename the file and upload it to a tool in your personal account.',
      'Delete the customer names and assume the remaining fields can be used freely.',
      'Check the permissions for the tool and data use, then appropriately remove sensitive information from the data you need.',
      'Upload the entire file as long as the tool’s history is turned off.'
    ],
    correct: 2,
    explanation: 'First check which tools and data uses your organisation permits. Use only necessary data that is appropriate to share; deleting names alone does not guarantee anonymity.',
    outcome: 'Checks tool permissions and data necessity before sharing personal or organisational data.'
  },
  {
    id: 'responsible-use',
    topic: 'Bias and responsible use',
    text: 'In a training announcement drafted by AI, technology-related tasks are recommended only to younger employees. What is the most appropriate approach?',
    options: [
      'Remove the age-based assumption and review the recommendations according to work-related needs and skills.',
      'Soften the wording while keeping the age-based division of tasks unchanged.',
      'Generate the text again and keep using the first version if similar recommendations appear.',
      'Add a note saying the text was prepared with AI and share the task recommendations unchanged.'
    ],
    correct: 0,
    explanation: 'AI output may contain biased assumptions. Review recommendations against work-related needs and skills rather than generalisations such as age.',
    outcome: 'Spots a biased assumption in workplace content and corrects it using relevant criteria.'
  },
  {
    id: 'human-approval',
    topic: 'Human review before sending',
    text: 'AI has drafted a proposal email to a customer. What is the most appropriate step before sending it?',
    options: [
      'Check the spelling and wording, and accept the prices and terms as drafted.',
      'Verify the recipient, prices and terms, then send it after obtaining any required approval from an authorised person.',
      'Ask a second AI to approve the draft and send it if both tools agree.',
      'Send the email first and check the prices and terms if the customer replies.'
    ],
    correct: 1,
    explanation: 'A proposal sent outside the organisation can create a commitment. A person should check the AI draft against the actual facts and the applicable approval process.',
    outcome: 'Verifies information and obtains necessary human approval before an action that affects the outside world.'
  }
];
