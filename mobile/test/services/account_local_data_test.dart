import 'dart:async';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:yz_egitim_sinav/services/reminder_notification_service.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:yz_egitim_sinav/services/account_local_data.dart';
import 'package:yz_egitim_sinav/services/lesson_progress_service.dart';
import 'package:yz_egitim_sinav/services/user_profile_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  String? uid;
  late AccountLocalData data;
  late UserProfileService profile;
  late LessonProgressService progress;

  setUp(() {
    SharedPreferences.setMockInitialValues({});
    uid = 'user-A';
    data = AccountLocalData(currentUid: () => uid);
    profile = UserProfileService(accountData: data);
    progress = LessonProgressService(accountData: data);
  });

  test(
    'profile and progress belong to each UID, and signed-out reads are empty',
    () async {
      await profile.saveNames(firstName: ' Ada ', lastName: ' A ');
      await progress.markCompleted('lesson-1');
      uid = 'user-B';
      expect((await profile.load()).displayName, isEmpty);
      expect(await progress.getCompletedIds(), isEmpty);
      await profile.saveNames(firstName: 'Bob', lastName: 'B');
      await progress.markCompleted('lesson-2');
      uid = 'user-A';
      expect((await profile.load()).displayName, 'Ada A');
      expect(await progress.getCompletedIds(), {'lesson-1'});
      uid = null;
      expect((await profile.load()).displayName, isEmpty);
      expect(await progress.getCompletedIds(), isEmpty);
      await expectLater(progress.markCompleted('forbidden'), throwsStateError);
      await expectLater(
        profile.saveNames(firstName: 'X', lastName: ''),
        throwsStateError,
      );
    },
  );

  test('ownerless legacy data is never adopted by any account', () async {
    SharedPreferences.setMockInitialValues({
      'profile_first_name': 'Old owner',
      'profile_avatar_path': '/old-owner/avatar.jpg',
      'completed_lesson_ids': ['legacy-lesson'],
      'reminder_enabled': true,
    });
    for (final owner in ['user-A', 'user-B']) {
      uid = owner;
      expect((await profile.load()).displayName, isEmpty);
      expect((await profile.load()).avatarPath, isNull);
      expect(await progress.getCompletedIds(), isEmpty);
    }
  });

  test(
    'async operations retain the UID captured before awaiting storage',
    () async {
      final save = profile.saveNames(firstName: 'Ada', lastName: 'A');
      final mark = progress.markCompleted('lesson-A');
      uid = 'user-B';
      await Future.wait([save, mark]);
      expect((await profile.load()).displayName, isEmpty);
      expect(await progress.getCompletedIds(), isEmpty);
      uid = 'user-A';
      final load = profile.load();
      final read = progress.getCompletedIds();
      uid = 'user-B';
      expect((await load).displayName, 'Ada A');
      expect(await read, {'lesson-A'});
    },
  );

  test(
    'avatars use separate files even if account changes during picker await',
    () async {
      final dir = await Directory.systemTemp.createTemp('account-avatars-');
      addTearDown(() => dir.delete(recursive: true));
      final source = File('${dir.path}/source.jpg');
      await source.writeAsBytes([1, 2, 3]);
      final picker = Completer<XFile?>();
      profile = UserProfileService(
        accountData: data,
        documentsDirectory: () async => dir,
        pickAvatar: () => picker.future,
      );
      final saving = profile.pickAndSaveAvatar();
      uid = 'user-B';
      picker.complete(XFile(source.path));
      final pathA = (await saving)!;
      expect((await profile.load()).avatarPath, isNull);
      final pathB = (await profile.pickAndSaveAvatar())!;
      expect(pathA, isNot(pathB));
      await data.clear('user-A');
      expect(await File(pathA).exists(), isFalse);
      expect(await File(pathB).exists(), isTrue);
      expect((await profile.load()).avatarPath, pathB);
    },
  );

  test(
    'successful deletion clears all account state before failing provider signout',
    () async {
      await profile.saveNames(firstName: 'Ada', lastName: 'A');
      await progress.markCompleted('lesson-A');
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(
        AccountLocalData.key('user-A', 'reminder_enabled'),
        true,
      );
      await prefs.setInt(AccountLocalData.key('user-A', 'reminder_hour'), 10);
      await prefs.setString(
        AccountLocalData.key('user-B', 'profile_first_name'),
        'Bob',
      );
      await prefs.setBool('device_preference', true);
      final order = <String>[];
      await deleteAccountAndLocalData(
        deleteRemote: () async {
          order.add('remote');
          uid = null;
        },
        clearLocal: () async {
          order.add('local');
          await data.clear('user-A');
        },
        signOutProvider: () async {
          order.add('provider');
          throw Exception('provider unavailable');
        },
      );
      expect(order, ['remote', 'local', 'provider']);
      expect(
        prefs.getKeys().where(
          (k) => k.startsWith(AccountLocalData.prefix('user-A')),
        ),
        isEmpty,
      );
      expect(
        prefs.getString(AccountLocalData.key('user-B', 'profile_first_name')),
        'Bob',
      );
      expect(prefs.getBool('device_preference'), isTrue);
    },
  );

  test(
    'failed remote deletion preserves local state and skips provider signout',
    () async {
      await progress.markCompleted('lesson-A');
      var cleaned = false;
      var signedOut = false;
      await expectLater(
        deleteAccountAndLocalData(
          deleteRemote: () async => throw Exception('requires recent login'),
          clearLocal: () async {
            cleaned = true;
            await data.clear('user-A');
          },
          signOutProvider: () async {
            signedOut = true;
          },
        ),
        throwsException,
      );
      expect(cleaned, isFalse);
      expect(signedOut, isFalse);
      expect(await progress.getCompletedIds(), {'lesson-A'});
    },
  );
  test(
    'reminder session switches cancel old reminder and restore only new UID without permission',
    () async {
      debugDefaultTargetPlatformOverride = TargetPlatform.android;
      AndroidFlutterLocalNotificationsPlugin.registerWith();
      addTearDown(() {
        debugDefaultTargetPlatformOverride = null;
      });
      const channel = MethodChannel(
        'dexterous.com/flutter/local_notifications',
      );
      final calls = <String>[];
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
          .setMockMethodCallHandler(channel, (call) async {
            calls.add(call.method);
            if (call.method == 'initialize' ||
                call.method == 'requestNotificationsPermission') {
              return true;
            }
            return null;
          });
      addTearDown(
        () => TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
            .setMockMethodCallHandler(channel, null),
      );
      final reminders = ReminderNotificationService(accountData: data);
      await reminders.applySettings(
        const ReminderSettings(enabled: true, hour: 10, minute: 15),
      );
      expect(calls, contains('zonedSchedule'));
      calls.clear();
      uid = 'user-B';
      await reminders.rescheduleIfEnabled();
      expect(calls, ['cancel']);
      expect((await reminders.loadSettings()).enabled, isFalse);
      calls.clear();
      uid = 'user-A';
      await reminders.rescheduleIfEnabled();
      expect(calls, ['cancel', 'zonedSchedule']);
      calls.clear();
      await reminders.clearAccount('user-A');
      await data.clear('user-A');
      expect(calls, ['cancel']);
      expect((await reminders.loadSettings()).enabled, isFalse);
    },
  );

  test(
    'retired legacy values and avatar are erased, without touching scoped owners',
    () async {
      final dir = await Directory.systemTemp.createTemp('legacy-avatar-');
      addTearDown(() => dir.delete(recursive: true));
      final avatar = File('${dir.path}/profile_avatar.jpg');
      await avatar.writeAsBytes([1]);
      SharedPreferences.setMockInitialValues({
        'profile_first_name': 'Legacy',
        'profile_avatar_path': avatar.path,
        'completed_lesson_ids': ['old'],
        'reminder_enabled': true,
        AccountLocalData.key('user-B', 'profile_first_name'): 'Bob',
      });
      expect(AccountLocalData.prefix('user-A').endsWith('.'), isTrue);
      expect(
        AccountLocalData.prefix(
          'user-B',
        ).startsWith(AccountLocalData.prefix('user-A')),
        isFalse,
      );
      await data.clearLegacy();
      final prefs = await SharedPreferences.getInstance();
      expect(
        prefs.getKeys().intersection(AccountLocalData.legacyKeys),
        isEmpty,
      );
      expect(await avatar.exists(), isFalse);
      expect(
        prefs.getString(AccountLocalData.key('user-B', 'profile_first_name')),
        'Bob',
      );
    },
  );
}
