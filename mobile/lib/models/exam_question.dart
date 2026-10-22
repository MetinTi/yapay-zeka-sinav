class PoolQuestion {
  const PoolQuestion({
    required this.id,
    required this.source,
    required this.level,
    required this.question,
    required this.options,
    required this.correctIndex,
    this.feedback = '',
  });

  factory PoolQuestion.fromJson(Map<String, dynamic> json) {
    return PoolQuestion(
      id: json['id'] as String,
      source: json['source'] as String? ?? 'web',
      level: json['level'] as String? ?? 'easy',
      question: json['question'] as String? ?? '',
      options: (json['options'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      correctIndex: json['correctIndex'] as int? ?? 0,
      feedback: json['feedback'] as String? ?? '',
    );
  }

  final String id;
  final String source;
  final String level;
  final String question;
  final List<String> options;
  final int correctIndex;
  final String feedback;
}

class ExamPool {
  const ExamPool({
    required this.poolSize,
    required this.examQuestionCount,
    required this.durationMinutes,
    required this.questions,
  });

  factory ExamPool.fromJson(Map<String, dynamic> json) {
    return ExamPool(
      poolSize: json['poolSize'] as int? ?? 0,
      examQuestionCount: json['examQuestionCount'] as int? ?? 20,
      durationMinutes: json['durationMinutes'] as int? ?? 45,
      questions: (json['questions'] as List<dynamic>?)
              ?.map((e) => PoolQuestion.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );
  }

  final int poolSize;
  final int examQuestionCount;
  final int durationMinutes;
  final List<PoolQuestion> questions;
}

/// Sınav oturumunda gösterilen soru (şıklar karıştırılmış).
class ExamQuestion {
  const ExamQuestion({
    required this.id,
    required this.level,
    required this.question,
    required this.options,
    required this.correctIndex,
    this.feedback = '',
  });

  final String id;
  final String level;
  final String question;
  final List<String> options;
  final int correctIndex;
  final String feedback;
}

class ExamResult {
  const ExamResult({
    required this.score,
    required this.correct,
    required this.wrong,
    required this.empty,
    required this.elapsed,
  });

  final int score;
  final int correct;
  final int wrong;
  final int empty;
  final Duration elapsed;
}
