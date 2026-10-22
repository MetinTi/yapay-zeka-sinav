import 'package:flutter/foundation.dart' show debugPrint;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:yz_egitim_sinav/services/account_local_data.dart';
import 'package:timezone/data/latest_all.dart' as tz_data;
import 'package:timezone/timezone.dart' as tz;

class ReminderSettings {
  const ReminderSettings({
    required this.enabled,
    required this.hour,
    required this.minute,
  });

  final bool enabled;
  final int hour;
  final int minute;

  String get timeLabel {
    final h = hour.toString().padLeft(2, '0');
    final m = minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  String get summary => enabled ? 'Her gün $timeLabel' : 'Kapalı';
}

/// Günlük eğitim hatırlatması (yerel bildirim).
class ReminderNotificationService {
  ReminderNotificationService({AccountLocalData? accountData})
    : _accountData = accountData ?? AccountLocalData.instance;
  static final ReminderNotificationService instance =
      ReminderNotificationService();
  final AccountLocalData _accountData;

  static const _prefEnabled = 'reminder_enabled';
  static const _prefHour = 'reminder_hour';
  static const _prefMinute = 'reminder_minute';
  static const _notificationId = 44001;
  static const _channelId = 'daily_education_reminder';

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  bool _initialized = false;
  String? _scheduledUid;
  Future<void> _pending = Future<void>.value();

  Future<void> _serialize(Future<void> Function() action) {
    final result = _pending.then((_) => action());
    _pending = result.catchError((Object _) {});
    return result;
  }

  Future<void> cancelPending() => _serialize(() async {
    if (!_initialized) await initialize();
    await _plugin.cancel(_notificationId);
    _scheduledUid = null;
  });

  Future<void> clearAccount(String uid) => _serialize(() async {
    if (_scheduledUid == uid) {
      await _plugin.cancel(_notificationId);
      _scheduledUid = null;
    }
  });

  Future<void> initialize() async {
    if (_initialized) return;

    tz_data.initializeTimeZones();
    try {
      final timezone = await FlutterTimezone.getLocalTimezone();
      tz.setLocalLocation(tz.getLocation(timezone));
    } catch (e) {
      debugPrint('[ReminderNotificationService] timezone: $e');
      tz.setLocalLocation(tz.getLocation('Europe/Istanbul'));
    }

    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const ios = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );
    const settings = InitializationSettings(android: android, iOS: ios);

    await _plugin.initialize(settings);

    const channel = AndroidNotificationChannel(
      _channelId,
      'Eğitim Hatırlatmaları',
      description: 'Günlük modül çalışma hatırlatması',
      importance: Importance.defaultImportance,
    );
    await _plugin
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >()
        ?.createNotificationChannel(channel);

    _initialized = true;
    // Also remove notifications created by old, ownerless installations.
    await _plugin.cancel(_notificationId);
  }

  Future<ReminderSettings> loadSettings() =>
      _loadSettings(_accountData.currentUid);

  Future<ReminderSettings> _loadSettings(String? uid) async {
    if (uid == null) {
      return const ReminderSettings(enabled: false, hour: 9, minute: 0);
    }
    final prefs = await SharedPreferences.getInstance();
    return ReminderSettings(
      enabled: prefs.getBool(AccountLocalData.key(uid, _prefEnabled)) ?? false,
      hour: prefs.getInt(AccountLocalData.key(uid, _prefHour)) ?? 9,
      minute: prefs.getInt(AccountLocalData.key(uid, _prefMinute)) ?? 0,
    );
  }

  Future<bool> requestPermission() async {
    final android = _plugin
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();
    if (android != null) {
      final granted = await android.requestNotificationsPermission();
      if (granted == false) return false;
    }

    final ios = _plugin
        .resolvePlatformSpecificImplementation<
          IOSFlutterLocalNotificationsPlugin
        >();
    if (ios != null) {
      final granted = await ios.requestPermissions(
        alert: true,
        badge: true,
        sound: true,
      );
      return granted ?? false;
    }

    return true;
  }

  Future<void> applySettings(ReminderSettings settings) {
    final uid = _accountData.requireUid();
    return _serialize(() async {
      if (_accountData.currentUid != uid) return;
      if (!_initialized) await initialize();

      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(
        AccountLocalData.key(uid, _prefEnabled),
        settings.enabled,
      );
      await prefs.setInt(AccountLocalData.key(uid, _prefHour), settings.hour);
      await prefs.setInt(
        AccountLocalData.key(uid, _prefMinute),
        settings.minute,
      );

      await _plugin.cancel(_notificationId);

      _scheduledUid = null;
      if (!settings.enabled) return;

      final permitted = await requestPermission();
      if (!permitted) {
        await prefs.setBool(AccountLocalData.key(uid, _prefEnabled), false);
        throw ReminderNotificationException(
          'Bildirim izni verilmedi. Ayarlardan izin açabilirsiniz.',
        );
      }

      if (_accountData.currentUid != uid) return;
      await _scheduleDaily(settings.hour, settings.minute);
      _scheduledUid = uid;
      debugPrint(
        '[ReminderNotificationService] Günlük hatırlatma: ${settings.timeLabel}',
      );
    });
  }

  Future<void> rescheduleIfEnabled() => _serialize(() async {
    if (!_initialized) await initialize();
    await _plugin.cancel(_notificationId);
    _scheduledUid = null;
    final uid = _accountData.currentUid;
    final settings = await _loadSettings(uid);
    if (!settings.enabled || uid != _accountData.currentUid) {
      return;
    }
    try {
      // Restoring a session never requests permission; the user opts in in UI.
      await _scheduleDaily(settings.hour, settings.minute);
      _scheduledUid = uid;
    } catch (e) {
      debugPrint('[ReminderNotificationService] yeniden planlama: $e');
    }
  });

  Future<void> _scheduleDaily(int hour, int minute) async {
    final scheduled = _nextInstance(hour, minute);

    const androidDetails = AndroidNotificationDetails(
      _channelId,
      'Eğitim Hatırlatmaları',
      channelDescription: 'Günlük modül çalışma hatırlatması',
      importance: Importance.defaultImportance,
      priority: Priority.defaultPriority,
    );
    const iosDetails = DarwinNotificationDetails();
    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _plugin.zonedSchedule(
      _notificationId,
      'Yapay Zeka Eğitimi',
      'Bugünkü modülünüze göz atmayı unutmayın.',
      scheduled,
      details,
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
      matchDateTimeComponents: DateTimeComponents.time,
    );
  }

  tz.TZDateTime _nextInstance(int hour, int minute) {
    final now = tz.TZDateTime.now(tz.local);
    var next = tz.TZDateTime(
      tz.local,
      now.year,
      now.month,
      now.day,
      hour,
      minute,
    );
    if (next.isBefore(now)) {
      next = next.add(const Duration(days: 1));
    }
    return next;
  }
}

class ReminderNotificationException implements Exception {
  ReminderNotificationException(this.message);
  final String message;

  @override
  String toString() => message;
}
