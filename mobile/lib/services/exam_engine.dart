import 'dart:math';

import 'package:yz_egitim_sinav/models/exam_question.dart';
import 'package:yz_egitim_sinav/services/exam_repository.dart';

class ExamEngine {
  ExamEngine({Random? random}) : _random = random ?? Random();

  final Random _random;

  static const levelWeights = {'easy': 1, 'medium': 2, 'hard': 3};

  Future<List<ExamQuestion>> pickExamQuestions() async {
    final pool = await ExamRepository.instance.loadPool();
    final count = pool.examQuestionCount;
    final source = List<PoolQuestion>.from(pool.questions)..shuffle(_random);
    return source.take(count).map(_prepareQuestion).toList();
  }

  ExamQuestion _prepareQuestion(PoolQuestion q) {
    final tagged = List.generate(
      q.options.length,
      (i) => _TaggedOption(q.options[i], i == q.correctIndex),
    )..shuffle(_random);
    return ExamQuestion(
      id: q.id,
      level: q.level,
      question: q.question,
      options: tagged.map((t) => t.text).toList(),
      correctIndex: tagged.indexWhere((t) => t.isCorrect),
      feedback: q.feedback,
    );
  }

  ExamResult calculateResult({
    required List<ExamQuestion> questions,
    required Map<int, int?> answers,
    required Duration elapsed,
  }) {
    var correct = 0;
    var wrong = 0;
    var empty = 0;
    var rawScore = 0;
    var maxRaw = 0;

    for (var i = 0; i < questions.length; i++) {
      final q = questions[i];
      final weight = levelWeights[q.level] ?? 1;
      maxRaw += weight;
      final picked = answers[i];
      if (picked == null) {
        empty++;
        continue;
      }
      if (picked == q.correctIndex) {
        correct++;
        rawScore += weight;
      } else {
        wrong++;
      }
    }

    final score = maxRaw > 0 ? ((rawScore * 100) / maxRaw).round() : 0;
    return ExamResult(
      score: score,
      correct: correct,
      wrong: wrong,
      empty: empty,
      elapsed: elapsed,
    );
  }
}

class _TaggedOption {
  _TaggedOption(this.text, this.isCorrect);
  final String text;
  final bool isCorrect;
}
