import 'package:shared_preferences/shared_preferences.dart';
import 'package:yz_egitim_sinav/services/account_local_data.dart';

class LessonProgressService {
  LessonProgressService({AccountLocalData? accountData})
    : _accountData = accountData ?? AccountLocalData.instance;
  static final LessonProgressService instance = LessonProgressService();
  final AccountLocalData _accountData;
  static const _key = 'completed_lesson_ids';

  Future<Set<String>> getCompletedIds() async {
    final uid = _accountData.currentUid;
    if (uid == null) return {};
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(AccountLocalData.key(uid, _key))?.toSet() ?? {};
  }

  Future<void> markCompleted(String lessonId) async {
    final uid = _accountData.requireUid();
    final prefs = await SharedPreferences.getInstance();
    final key = AccountLocalData.key(uid, _key);
    final ids = prefs.getStringList(key)?.toSet() ?? <String>{};
    ids.add(lessonId);
    await prefs.setStringList(key, ids.toList());
  }

  Future<bool> isCompleted(String lessonId) async =>
      (await getCompletedIds()).contains(lessonId);
}
