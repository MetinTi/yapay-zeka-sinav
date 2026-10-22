import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';
import 'package:yz_egitim_sinav/screens/profile/legal_document_screen.dart';
import 'package:yz_egitim_sinav/screens/profile/notification_settings_screen.dart';
import 'package:yz_egitim_sinav/services/auth_service.dart';
import 'package:yz_egitim_sinav/services/reminder_notification_service.dart';
import 'package:yz_egitim_sinav/services/user_profile_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  bool _loading = true;
  bool _busy = false;
  String? _avatarPath;
  String? _email;
  String _reminderSummary = 'Kapalı';

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final profile = await UserProfileService.instance.load();
    final reminder = await ReminderNotificationService.instance.loadSettings();
    final user = AuthService.instance.currentUser;
    if (!mounted) return;
    setState(() {
      _firstNameController.text = profile.firstName;
      _lastNameController.text = profile.lastName;
      _avatarPath = profile.avatarPath;
      _email = user?.email;
      _reminderSummary = reminder.summary;
      _loading = false;
    });
  }

  Future<void> _saveNames({bool showSnackBar = false}) async {
    await UserProfileService.instance.saveNames(
      firstName: _firstNameController.text,
      lastName: _lastNameController.text,
    );
    if (showSnackBar && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profil kaydedildi.')),
      );
    }
  }

  Future<void> _pickAvatar() async {
    if (_busy) return;
    setState(() => _busy = true);
    try {
      final path = await UserProfileService.instance.pickAndSaveAvatar();
      if (path != null && mounted) {
        setState(() => _avatarPath = path);
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _openSupport() async {
    const email = 'metin@metintiryaki.com';
    const subject = 'YZ Eğitimi Destek';
    final mailto = Uri.parse(
      'mailto:$email?subject=${Uri.encodeComponent(subject)}',
    );
    final gmailWeb = Uri.parse(
      'https://mail.google.com/mail/?view=cm&fs=1&to=$email'
      '&su=${Uri.encodeComponent(subject)}',
    );

    for (final mode in [
      LaunchMode.externalApplication,
      LaunchMode.platformDefault,
    ]) {
      try {
        if (await launchUrl(mailto, mode: mode)) return;
      } catch (_) {}
    }

    if (!mounted) return;
    await showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(
            AppTokens.space4,
            0,
            AppTokens.space4,
            AppTokens.space4,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'E-posta uygulaması açılamadı',
                style: Theme.of(ctx).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
              ),
              const SizedBox(height: AppTokens.space2),
              Text(
                'Simülatörde Mail kurulu olmayabilir. Aşağıdan devam edin:',
                style: Theme.of(ctx).textTheme.bodyMedium?.copyWith(
                      fontSize: 14,
                    ),
              ),
              const SizedBox(height: AppTokens.space3),
              ListTile(
                leading: const Icon(Icons.mail_outline_rounded),
                title: const Text('Mail Uygulamasını Dene'),
                subtitle: Text(email),
                onTap: () async {
                  Navigator.pop(ctx);
                  await launchUrl(mailto, mode: LaunchMode.externalApplication);
                },
              ),
              ListTile(
                leading: const Icon(Icons.language_rounded),
                title: const Text('Gmail (Tarayıcı)'),
                onTap: () async {
                  Navigator.pop(ctx);
                  await launchUrl(
                    gmailWeb,
                    mode: LaunchMode.externalApplication,
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.copy_rounded),
                title: const Text('Adresi Kopyala'),
                onTap: () {
                  Clipboard.setData(const ClipboardData(text: email));
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('$email panoya kopyalandı.')),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _signOut() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Çıkış Yap'),
        content: const Text('Oturumunuz kapatılacak. Devam edilsin mi?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Çıkış Yap'),
          ),
        ],
      ),
    );
    if (ok != true || !mounted) return;

    setState(() => _busy = true);
    try {
      await AuthService.instance.signOut();
    } on AuthException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _deleteAccount() async {
    final ok1 = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Hesabı Sil'),
        content: const Text(
          'Firebase hesabınız ve bu cihazdaki profil verileriniz kalıcı olarak silinir. '
          'Bu işlem geri alınamaz.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(foregroundColor: AppTokens.error),
            child: const Text('Sil'),
          ),
        ],
      ),
    );
    if (ok1 != true || !mounted) return;

    setState(() => _busy = true);
    try {
      await _saveNames();
      await AuthService.instance.deleteAccount();
      await UserProfileService.instance.clearLocal();
    } on AuthException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Hesap silinemedi. Lütfen tekrar giriş yapıp deneyin.'),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageScaffold(
      title: 'Profil',
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
                  children: [
                    _AvatarSection(
                      avatarPath: _avatarPath,
                      busy: _busy,
                      onTap: _pickAvatar,
                    ),
                    if (_email != null && _email!.isNotEmpty) ...[
                      const SizedBox(height: AppTokens.space3),
                      Text(
                        _email!,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                    const SizedBox(height: AppTokens.space5),
                    _ProfileField(
                      label: 'Ad',
                      controller: _firstNameController,
                      onSubmitted: (_) => _saveNames(),
                    ),
                    const SizedBox(height: AppTokens.space3),
                    _ProfileField(
                      label: 'Soyad',
                      controller: _lastNameController,
                      onSubmitted: (_) => _saveNames(),
                    ),
                    const SizedBox(height: AppTokens.space4),
                    AppGradientButton(
                      label: 'Kaydet',
                      icon: Icons.check_rounded,
                      onPressed: _busy
                          ? () {}
                          : () => _saveNames(showSnackBar: true),
                    ),
                    const SizedBox(height: AppTokens.space5),
                    _ProfileMenuTile(
                      icon: Icons.notifications_outlined,
                      title: 'Bildirimler',
                      subtitle: _reminderSummary,
                      onTap: () async {
                        await Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) =>
                                const NotificationSettingsScreen(),
                          ),
                        );
                        final reminder = await ReminderNotificationService
                            .instance
                            .loadSettings();
                        if (mounted) {
                          setState(() => _reminderSummary = reminder.summary);
                        }
                      },
                    ),
                    _ProfileMenuTile(
                      icon: Icons.privacy_tip_outlined,
                      title: 'Gizlilik Politikası',
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => const LegalDocumentScreen(
                              title: 'Gizlilik Politikası',
                              assetPath: 'assets/legal/privacy_policy_tr.md',
                            ),
                          ),
                        );
                      },
                    ),
                    _ProfileMenuTile(
                      icon: Icons.description_outlined,
                      title: 'Kullanım Koşulları',
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => const LegalDocumentScreen(
                              title: 'Kullanım Koşulları',
                              assetPath: 'assets/legal/terms_of_use_tr.md',
                            ),
                          ),
                        );
                      },
                    ),
                    _ProfileMenuTile(
                      icon: Icons.mail_outline_rounded,
                      title: 'Destek',
                      subtitle: 'metin@metintiryaki.com',
                      onTap: _openSupport,
                    ),
                    const SizedBox(height: AppTokens.space4),
                    _ProfileMenuTile(
                      icon: Icons.logout_rounded,
                      title: 'Çıkış Yap',
                      onTap: _signOut,
                    ),
                    const SizedBox(height: AppTokens.space2),
                    _ProfileMenuTile(
                      icon: Icons.delete_forever_outlined,
                      title: 'Hesabı Sil',
                      destructive: true,
                      onTap: _deleteAccount,
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

class _AvatarSection extends StatelessWidget {
  const _AvatarSection({
    required this.avatarPath,
    required this.busy,
    required this.onTap,
  });

  final String? avatarPath;
  final bool busy;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: busy ? null : onTap,
      child: Stack(
        alignment: Alignment.bottomRight,
        children: [
          CircleAvatar(
            radius: 52,
            backgroundColor: AppTokens.scale100,
            backgroundImage:
                avatarPath != null ? FileImage(File(avatarPath!)) : null,
            child: avatarPath == null
                ? Icon(
                    Icons.person_rounded,
                    size: 48,
                    color: AppTokens.scale700.withValues(alpha: 0.7),
                  )
                : null,
          ),
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              gradient: AppTokens.primaryGradient,
              shape: BoxShape.circle,
              boxShadow: AppTokens.shadowSm(Theme.of(context).brightness),
            ),
            child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 18),
          ),
        ],
      ),
    );
  }
}

class _ProfileField extends StatelessWidget {
  const _ProfileField({
    required this.label,
    required this.controller,
    required this.onSubmitted,
  });

  final String label;
  final TextEditingController controller;
  final ValueChanged<String> onSubmitted;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      textCapitalization: TextCapitalization.words,
      textInputAction: TextInputAction.done,
      onSubmitted: onSubmitted,
      onEditingComplete: () => onSubmitted(controller.text),
      decoration: InputDecoration(
        labelText: label,
        filled: true,
        fillColor: Theme.of(context).colorScheme.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
          borderSide: BorderSide(
            color: AppTokens.scale700.withValues(alpha: 0.2),
          ),
        ),
      ),
    );
  }
}

class _ProfileMenuTile extends StatelessWidget {
  const _ProfileMenuTile({
    required this.icon,
    required this.title,
    this.subtitle,
    required this.onTap,
    this.destructive = false,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback onTap;
  final bool destructive;

  @override
  Widget build(BuildContext context) {
    final color = destructive ? AppTokens.error : AppTokens.scale900;
    return Padding(
      padding: const EdgeInsets.only(bottom: AppTokens.space2),
      child: Material(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(AppTokens.radiusMd),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
          child: Ink(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(AppTokens.radiusMd),
              border: Border.all(
                color: AppTokens.scale700.withValues(alpha: 0.12),
              ),
              boxShadow: AppTokens.shadowSm(Theme.of(context).brightness),
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: AppTokens.space4,
              vertical: 14,
            ),
            child: Row(
              children: [
                Icon(icon, color: color, size: 22),
                const SizedBox(width: AppTokens.space4),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: Theme.of(context).textTheme.labelLarge?.copyWith(
                              color: color,
                            ),
                      ),
                      if (subtitle != null)
                        Text(
                          subtitle!,
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                fontSize: 13,
                              ),
                        ),
                    ],
                  ),
                ),
                Icon(
                  Icons.chevron_right_rounded,
                  color: color.withValues(alpha: 0.45),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
