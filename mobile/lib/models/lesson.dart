class LessonQuestion {
  const LessonQuestion({
    required this.question,
    required this.options,
    required this.correctIndex,
    this.level = 'easy',
  });

  factory LessonQuestion.fromJson(Map<String, dynamic> json) {
    return LessonQuestion(
      question: json['question'] as String? ?? '',
      options: (json['options'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      correctIndex: json['correctIndex'] as int? ?? 0,
      level: json['level'] as String? ?? 'easy',
    );
  }

  final String question;
  final List<String> options;
  final int correctIndex;
  final String level;
}

class LessonSection {
  const LessonSection({
    required this.type,
    required this.body,
    this.items = const [],
    this.questions = const [],
  });

  factory LessonSection.fromJson(Map<String, dynamic> json) {
    return LessonSection(
      type: json['type'] as String? ?? 'text',
      body: json['body'] as String? ?? '',
      items: (json['items'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      questions: (json['questions'] as List<dynamic>?)
              ?.map((e) => LessonQuestion.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );
  }

  final String type;
  final String body;
  final List<String> items;
  final List<LessonQuestion> questions;

  bool get isBullet => type == 'bullet';
  bool get isTip => type == 'tip';
  bool get isImage => type == 'image';
  bool get isQuiz => type == 'quiz';
}

class Lesson {
  const Lesson({
    required this.id,
    required this.order,
    required this.title,
    required this.subtitle,
    required this.estimatedMinutes,
    required this.examTags,
    required this.sections,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: json['id'] as String,
      order: json['order'] as int? ?? 0,
      title: json['title'] as String? ?? '',
      subtitle: json['subtitle'] as String? ?? '',
      estimatedMinutes: json['estimatedMinutes'] as int? ?? 10,
      examTags: (json['examTags'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      sections: (json['sections'] as List<dynamic>?)
              ?.map((e) => LessonSection.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );
  }

  final String id;
  final int order;
  final String title;
  final String subtitle;
  final int estimatedMinutes;
  final List<String> examTags;
  final List<LessonSection> sections;

  List<LessonSection> get contentSections =>
      sections.where((s) => !s.isQuiz).toList();

  LessonSection? get quizSection {
    for (final s in sections) {
      if (s.isQuiz && s.questions.isNotEmpty) return s;
    }
    return null;
  }
}
