import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:yz_egitim_sinav/models/lesson.dart';

class LessonRepository {
  LessonRepository._();
  static final LessonRepository instance = LessonRepository._();

  List<Lesson>? _cache;

  Future<List<Lesson>> loadLessons() async {
    if (_cache != null) return _cache!;
    final raw = await rootBundle.loadString('assets/data/lessons.json');
    final list = jsonDecode(raw) as List<dynamic>;
    _cache = list
        .map((e) => Lesson.fromJson(e as Map<String, dynamic>))
        .toList()
      ..sort((a, b) => a.order.compareTo(b.order));
    return _cache!;
  }

  Future<Lesson?> getById(String id) async {
    final lessons = await loadLessons();
    for (final lesson in lessons) {
      if (lesson.id == id) return lesson;
    }
    return null;
  }

  Future<Lesson?> getNext(String currentId) async {
    final lessons = await loadLessons();
    final index = lessons.indexWhere((l) => l.id == currentId);
    if (index < 0 || index >= lessons.length - 1) return null;
    return lessons[index + 1];
  }
}
