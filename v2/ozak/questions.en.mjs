// Faithful English rendering of the approved source items and option order.
export {EXAM_VERSION, DURATION_SECONDS, scoreAnswers} from './questions.mjs';

export const questions = [
  {
    "id": "web-009",
    "sourceId": "web-009",
    "topic": "The components of a prompt",
    "text": "In prompt engineering, what are the components of the “Perfect Prompt Formula”?",
    "options": [
      "Title, Content, Conclusion, Summary, References",
      "Role, Task, Context, Constraints, Format",
      "Introduction, Development, Conclusion",
      "Question, Answer, Verification, Approval"
    ],
    "correct": 1,
    "explanation": "The training presentation describes the Perfect Prompt Formula using five components: Role, Task, Context, Constraints and Format.",
    "outcome": "Recognises the role, task, context, constraints and format components of a prompt."
  },
  {
    "id": "web-025",
    "sourceId": "web-025",
    "topic": "Zero-shot prompting",
    "text": "When is zero-shot prompting used?",
    "options": [
      "When there is a large amount of data",
      "While the model is being trained",
      "Only when writing code",
      "When a direct instruction is given without examples"
    ],
    "correct": 3,
    "explanation": "Zero-shot prompting means giving an instruction without providing examples.",
    "outcome": "Identifies a direct instruction without examples as zero-shot prompting."
  },
  {
    "id": "web-006",
    "sourceId": "web-006",
    "topic": "Types of machine learning",
    "text": "What are the three main types of machine learning?",
    "options": [
      "Supervised, Unsupervised and Reinforcement Learning",
      "Fast, Medium and Slow Learning",
      "Artificial, Natural and Hybrid Learning",
      "Single-layer, Multi-layer and Deep Learning"
    ],
    "correct": 0,
    "explanation": "The presentation describes the three main types of machine learning as Supervised, Unsupervised and Reinforcement Learning.",
    "outcome": "Recognises supervised, unsupervised and reinforcement learning as the main types."
  },
  {
    "id": "web-028",
    "sourceId": "web-028",
    "topic": "Supervised learning",
    "text": "What is the defining feature of supervised learning?",
    "options": [
      "The data is unlabelled",
      "The model learns by itself",
      "Inputs and correct outputs are provided",
      "There is no human involvement"
    ],
    "correct": 2,
    "explanation": "Supervised learning uses data with correct labels.",
    "outcome": "Identifies that supervised learning pairs inputs with correct output labels."
  },
  {
    "id": "web-043",
    "sourceId": "web-043",
    "topic": "Reinforcement learning",
    "text": "Which type of machine learning enables an AI model to learn on its own through a reward/penalty mechanism?",
    "options": [
      "Supervised Learning",
      "Reinforcement Learning",
      "Unsupervised Learning",
      "Natural Language Processing (NLP)"
    ],
    "correct": 1,
    "explanation": "Reinforcement learning is the type of machine learning in which an AI system learns through trial and error using rewards and penalties.",
    "outcome": "Recognises learning from reward and penalty feedback as reinforcement learning."
  },
  {
    "id": "web-008",
    "sourceId": "web-008",
    "topic": "The components of natural language processing",
    "text": "What are the main components of Natural Language Processing (NLP)?",
    "options": [
      "Natural Language Understanding (NLU), Natural Language Generation (NLG), Speech Recognition and Speech Synthesis",
      "Only text translation and sentiment analysis",
      "Image processing and speech recognition",
      "Database queries and reporting"
    ],
    "correct": 0,
    "explanation": "The presentation lists Natural Language Understanding (NLU), Natural Language Generation (NLG), Speech Recognition and Speech Synthesis as the main components covered under NLP.",
    "outcome": "Recognises the language understanding, language generation, speech recognition and speech synthesis components covered in training."
  },
  {
    "id": "web-016",
    "sourceId": "web-016",
    "topic": "Text classification",
    "text": "A call centre manager wants to categorise customer complaints automatically. Which AI field and type of learning provide the most suitable solution?",
    "options": [
      "Computer Vision and Reinforcement Learning",
      "Robotics and Unsupervised Learning",
      "Big Data analysis and Deep Reinforcement Learning",
      "Natural Language Processing (NLP) and Supervised Learning"
    ],
    "correct": 3,
    "explanation": "Text-based customer complaints call for NLP; learning from labelled historical examples uses supervised learning.",
    "outcome": "Connects text-based complaint classification with NLP and supervised learning."
  },
  {
    "id": "web-010",
    "sourceId": "web-010",
    "topic": "The five Vs of Big Data",
    "text": "Which option lists the five Vs of Big Data?",
    "options": [
      "Vision, Value, Verify, Volume, Velocity",
      "Video, Voice, Visual, Virtual, Verified",
      "Volume, Variety, Velocity, Value, Veracity",
      "Data, Efficiency, Vision, Assumption, Asset"
    ],
    "correct": 2,
    "explanation": "The presentation lists the five Vs of Big Data as Volume, Variety, Velocity, Value and Veracity.",
    "outcome": "Recognises the volume, variety, velocity, value and veracity dimensions of Big Data."
  },
  {
    "id": "web-059",
    "sourceId": "web-059",
    "topic": "Data variety",
    "text": "An e-commerce company wants to develop a meaningful sales strategy by combining customer movement footage from in-store cameras (video), comments about the brand on social media (text), and purchase invoices (numerical data). Which “V” of Big Data does this situation emphasise most?",
    "options": [
      "Variety",
      "Velocity",
      "Veracity",
      "Volume"
    ],
    "correct": 0,
    "explanation": "Using video, text and numerical data together represents Variety: the Big Data dimension that covers different data formats.",
    "outcome": "Connects the use of different data formats together with the variety dimension."
  },
  {
    "id": "web-058",
    "sourceId": "web-058",
    "topic": "Deep learning and GPUs",
    "text": "A company wants to analyse live traffic videos from high-resolution cameras for autonomous vehicles. The data volume is at the petabyte scale, and the rules are too complex to code manually using traditional algorithms. Which technology infrastructure would the company be expected to prioritise?",
    "options": [
      "Rule-based machine learning algorithms that work only with structured data",
      "High-performance GPU hardware capable of training deep learning networks autonomously",
      "A large team of human data labellers to perform feature extraction manually",
      "Corporate network firewalls to prevent phishing attacks"
    ],
    "correct": 1,
    "explanation": "In this scenario, the very large volume of complex imagery points to deep learning networks and powerful GPU hardware to support their training.",
    "outcome": "Recognises the role of deep learning and GPU infrastructure in analysing large volumes of complex imagery."
  }
];
