import 'package:flutter/foundation.dart' show debugPrint;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:shared_preferences/shared_preferences.dart';
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

  String get summary =>
      enabled ? 'Her gün $timeLabel' : 'Kapalı';
}

/// Günlük eğitim hatırlatması (yerel bildirim).
class ReminderNotificationService {
  ReminderNotificationService._();
  static final ReminderNotificationService instance =
      ReminderNotificationService._();

  static const _prefEnabled = 'reminder_enabled';
  static const _prefHour = 'reminder_hour';
  static const _prefMinute = 'reminder_minute';
  static const _notificationId = 44001;
  static const _channelId = 'daily_education_reminder';

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  bool _initialized = false;

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
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);

    _initialized = true;
    await rescheduleIfEnabled();
  }

  Future<ReminderSettings> loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    return ReminderSettings(
      enabled: prefs.getBool(_prefEnabled) ?? false,
      hour: prefs.getInt(_prefHour) ?? 9,
      minute: prefs.getInt(_prefMinute) ?? 0,
    );
  }

  Future<bool> requestPermission() async {
    final android = _plugin.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();
    if (android != null) {
      final granted = await android.requestNotificationsPermission();
      if (granted == false) return false;
    }

    final ios = _plugin.resolvePlatformSpecificImplementation<
        IOSFlutterLocalNotificationsPlugin>();
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

  Future<void> applySettings(ReminderSettings settings) async {
    if (!_initialized) await initialize();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefEnabled, settings.enabled);
    await prefs.setInt(_prefHour, settings.hour);
    await prefs.setInt(_prefMinute, settings.minute);

    await _plugin.cancel(_notificationId);

    if (!settings.enabled) return;

    final permitted = await requestPermission();
    if (!permitted) {
      await prefs.setBool(_prefEnabled, false);
      throw ReminderNotificationException(
        'Bildirim izni verilmedi. Ayarlardan izin açabilirsiniz.',
      );
    }

    await _scheduleDaily(settings.hour, settings.minute);
    debugPrint(
      '[ReminderNotificationService] Günlük hatırlatma: ${settings.timeLabel}',
    );
  }

  Future<void> rescheduleIfEnabled() async {
    final settings = await loadSettings();
    if (!settings.enabled) return;
    if (!_initialized) await initialize();
    await _plugin.cancel(_notificationId);
    try {
      await _scheduleDaily(settings.hour, settings.minute);
    } catch (e) {
      debugPrint('[ReminderNotificationService] yeniden planlama: $e');
    }
  }

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
