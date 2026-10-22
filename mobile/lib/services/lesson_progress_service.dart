import 'package:shared_preferences/shared_preferences.dart';

class LessonProgressService {
  LessonProgressService._();
  static final LessonProgressService instance = LessonProgressService._();

  static const _key = 'completed_lesson_ids';

  Future<Set<String>> getCompletedIds() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_key)?.toSet() ?? {};
  }

  Future<void> markCompleted(String lessonId) async {
    final prefs = await SharedPreferences.getInstance();
    final ids = await getCompletedIds();
    ids.add(lessonId);
    await prefs.setStringList(_key, ids.toList());
  }

  Future<bool> isCompleted(String lessonId) async {
    final ids = await getCompletedIds();
    return ids.contains(lessonId);
  }
}
