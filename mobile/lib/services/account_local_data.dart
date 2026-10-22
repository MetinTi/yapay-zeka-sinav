import 'dart:convert';
import 'dart:io';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:yz_egitim_sinav/services/auth_service.dart';

/// Only UID-owned data is read. Old, ownerless keys are deliberately not adopted.
class AccountLocalData {
  AccountLocalData({String? Function()? currentUid})
    : _currentUid = currentUid ?? (() => AuthService.instance.currentUser?.uid);

  static final instance = AccountLocalData();
  final String? Function() _currentUid;

  String? get currentUid => _currentUid();

  static String ownerToken(String uid) =>
      base64Url.encode(utf8.encode(uid)).replaceAll('=', '');
  static String prefix(String uid) => 'account.${ownerToken(uid)}.';
  static String key(String uid, String name) => '${prefix(uid)}$name';

  String requireUid() {
    final uid = currentUid;
    if (uid == null) throw StateError('Aktif oturum bulunamadı.');
    return uid;
  }

  static const legacyKeys = {
    'profile_first_name',
    'profile_last_name',
    'profile_avatar_path',
    'completed_lesson_ids',
    'reminder_enabled',
    'reminder_hour',
    'reminder_minute',
  };

  Future<void> clearLegacy() async {
    final prefs = await SharedPreferences.getInstance();
    final path = prefs.getString('profile_avatar_path');
    try {
      if (path != null) {
        final file = File(path);
        if (await file.exists()) await file.delete();
      }
    } finally {
      for (final name in legacyKeys) {
        await prefs.remove(name);
      }
    }
  }

  Future<void> clear(String uid) async {
    final prefs = await SharedPreferences.getInstance();
    final path = prefs.getString(key(uid, 'profile_avatar_path'));
    try {
      if (path != null) {
        final file = File(path);
        if (await file.exists()) await file.delete();
      }
    } finally {
      for (final name
          in prefs.getKeys().where((k) => k.startsWith(prefix(uid))).toList()) {
        await prefs.remove(name);
      }
      await clearLegacy();
    }
  }
}

/// Local erasure happens only after server deletion succeeds, even if provider
/// sign-out subsequently fails. Kept separate so ordering can be tested offline.
Future<void> deleteAccountAndLocalData({
  required Future<void> Function() deleteRemote,
  required Future<void> Function() clearLocal,
  required Future<void> Function() signOutProvider,
}) async {
  await deleteRemote();
  await clearLocal();
  try {
    await signOutProvider();
  } catch (_) {
    // The Firebase account is already deleted; provider cache is best effort.
  }
}
