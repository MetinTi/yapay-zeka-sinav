import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';
import 'package:yz_egitim_sinav/services/reminder_notification_service.dart';

class NotificationSettingsScreen extends StatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  State<NotificationSettingsScreen> createState() =>
      _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState
    extends State<NotificationSettingsScreen> {
  bool _loading = true;
  bool _busy = false;
  bool _enabled = false;
  TimeOfDay _time = const TimeOfDay(hour: 9, minute: 0);

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final settings = await ReminderNotificationService.instance.loadSettings();
    if (!mounted) return;
    setState(() {
      _enabled = settings.enabled;
      _time = TimeOfDay(hour: settings.hour, minute: settings.minute);
      _loading = false;
    });
  }

  Future<void> _pickTime() async {
    if (Platform.isIOS) {
      await _pickTimeCupertino();
      return;
    }

    final picked = await showTimePicker(
      context: context,
      initialTime: _time,
      helpText: 'Hatırlatma Saati Seçin',
      cancelText: 'İptal',
      confirmText: 'Tamam',
    );
    if (picked != null) {
      setState(() => _time = picked);
    }
  }

  Future<void> _pickTimeCupertino() async {
    var temp = _time;
    await showCupertinoModalPopup<void>(
      context: context,
      builder: (ctx) {
        return Container(
          height: 320,
          color: CupertinoColors.systemBackground.resolveFrom(ctx),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    CupertinoButton(
                      padding: EdgeInsets.zero,
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('İptal'),
                    ),
                    const Text(
                      'Hatırlatma Saati',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    CupertinoButton(
                      padding: EdgeInsets.zero,
                      onPressed: () {
                        setState(() => _time = temp);
                        Navigator.pop(ctx);
                      },
                      child: const Text(
                        'Tamam',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: CupertinoDatePicker(
                  mode: CupertinoDatePickerMode.time,
                  initialDateTime: DateTime(
                    2020,
                    1,
                    1,
                    _time.hour,
                    _time.minute,
                  ),
                  use24hFormat: true,
                  onDateTimeChanged: (value) {
                    temp = TimeOfDay(hour: value.hour, minute: value.minute);
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _save() async {
    if (_busy) return;
    setState(() => _busy = true);
    try {
      await ReminderNotificationService.instance.applySettings(
        ReminderSettings(
          enabled: _enabled,
          hour: _time.hour,
          minute: _time.minute,
        ),
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _enabled
                  ? 'Her gün ${_formatTime(_time)} hatırlatması ayarlandı.'
                  : 'Günlük hatırlatma kapatıldı.',
            ),
          ),
        );
      }
    } on ReminderNotificationException catch (e) {
      if (mounted) {
        setState(() => _enabled = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message)),
        );
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Bildirim ayarı kaydedilemedi.'),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  String _formatTime(TimeOfDay time) {
    final h = time.hour.toString().padLeft(2, '0');
    final m = time.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  @override
  Widget build(BuildContext context) {
    return AppPageScaffold(
      title: 'Bildirimler',
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : AbsorbPointer(
              absorbing: _busy,
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(
                  AppTokens.space5,
                  AppTokens.space2,
                  AppTokens.space5,
                  AppTokens.space7,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Her gün seçtiğiniz saatte eğitim modüllerinizi '
                      'hatırlatırız.',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: AppTokens.space5),
                    Material(
                      color: Theme.of(context).colorScheme.surface,
                      borderRadius: BorderRadius.circular(AppTokens.radiusMd),
                      child: SwitchListTile(
                        title: const Text(
                          'Günlük Hatırlatma',
                          style: TextStyle(fontWeight: FontWeight.w600),
                        ),
                        subtitle: Text(
                          _enabled
                              ? 'Açık · ${_formatTime(_time)}'
                              : 'Kapalı',
                        ),
                        value: _enabled,
                        activeThumbColor: AppTokens.scale700,
                        onChanged: (value) => setState(() => _enabled = value),
                      ),
                    ),
                    const SizedBox(height: AppTokens.space3),
                    Material(
                      color: Theme.of(context).colorScheme.surface,
                      borderRadius: BorderRadius.circular(AppTokens.radiusMd),
                      child: ListTile(
                        enabled: _enabled,
                        leading: Icon(
                          Icons.schedule_rounded,
                          color: _enabled
                              ? AppTokens.scale700
                              : Theme.of(context)
                                  .colorScheme
                                  .onSurface
                                  .withValues(alpha: 0.35),
                        ),
                        title: const Text(
                          'Hatırlatma Saati',
                          style: TextStyle(fontWeight: FontWeight.w600),
                        ),
                        subtitle: Text(_formatTime(_time)),
                        trailing: const Icon(Icons.chevron_right_rounded),
                        onTap: _enabled ? _pickTime : null,
                      ),
                    ),
                    const SizedBox(height: AppTokens.space5),
                    AppGradientButton(
                      label: 'Kaydet',
                      icon: Icons.notifications_active_outlined,
                      onPressed: _busy ? () {} : _save,
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
