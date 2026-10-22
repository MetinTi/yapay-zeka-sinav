import 'dart:io';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';
import 'package:yz_egitim_sinav/models/lesson.dart';
import 'package:yz_egitim_sinav/screens/exam/exam_start_screen.dart';
import 'package:yz_egitim_sinav/screens/lessons/lesson_detail_screen.dart';
import 'package:yz_egitim_sinav/screens/lessons/lessons_list_screen.dart';
import 'package:yz_egitim_sinav/screens/profile/notification_settings_screen.dart';
import 'package:yz_egitim_sinav/screens/profile/profile_screen.dart';
import 'package:yz_egitim_sinav/services/lesson_progress_service.dart';
import 'package:yz_egitim_sinav/services/lesson_repository.dart';
import 'package:yz_egitim_sinav/services/user_profile_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<_HomeData> _dataFuture;
  int _navIndex = 0;

  @override
  void initState() {
    super.initState();
    _dataFuture = _load();
  }

  Future<_HomeData> _load() async {
    final lessons = await LessonRepository.instance.loadLessons();
    final completed = await LessonProgressService.instance.getCompletedIds();
    final profile = await UserProfileService.instance.load();
    return _HomeData(
      lessons: lessons,
      completedIds: completed,
      profile: profile,
    );
  }

  Future<void> _refresh() async {
    setState(() {
      _dataFuture = _load();
    });
    await _dataFuture;
  }

  void _onNavTap(int index) {
    if (index == _navIndex) return;
    switch (index) {
      case 1:
        Navigator.of(context)
            .push(
              MaterialPageRoute<void>(
                builder: (_) => const LessonsListScreen(),
              ),
            )
            .then((_) => _refresh());
        return;
      case 2:
        Navigator.of(context)
            .push(
              MaterialPageRoute<void>(builder: (_) => const ProfileScreen()),
            )
            .then((_) => _refresh());
        return;
      default:
        setState(() => _navIndex = index);
    }
  }

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: AppMeshBackground(
        child: SafeArea(
          bottom: false,
          child: FutureBuilder<_HomeData>(
            future: _dataFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(
                  child: CircularProgressIndicator(color: AppTokens.primary),
                );
              }
              if (snapshot.hasError) {
                return Center(child: Text('Yüklenemedi: ${snapshot.error}'));
              }
              final data = snapshot.data!;
              return RefreshIndicator(
                onRefresh: _refresh,
                color: AppTokens.primary,
                child: CustomScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  slivers: [
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(
                          AppTokens.space5,
                          AppTokens.space2,
                          AppTokens.space5,
                          0,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _HomeHeader(
                              profile: data.profile,
                              completedCount: data.completedCount,
                              totalCount: data.lessons.length,
                              onProfileTap: () {
                                Navigator.of(context)
                                    .push(
                                      MaterialPageRoute<void>(
                                        builder: (_) => const ProfileScreen(),
                                      ),
                                    )
                                    .then((_) => _refresh());
                              },
                              onNotifications: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute<void>(
                                    builder: (_) =>
                                        const NotificationSettingsScreen(),
                                  ),
                                );
                              },
                            ),
                            const SizedBox(height: AppTokens.space5),
                            _SearchBar(
                              onTap: () {
                                Navigator.of(context)
                                    .push(
                                      MaterialPageRoute<void>(
                                        builder: (_) =>
                                            const LessonsListScreen(),
                                      ),
                                    )
                                    .then((_) => _refresh());
                              },
                            ),
                            const SizedBox(height: AppTokens.space5),
                            if (data.recentLessons.isNotEmpty) ...[
                              const _SectionTitle('Son Çalışmalar'),
                              const SizedBox(height: AppTokens.space3),
                              SizedBox(
                                height: 228,
                                child: ListView.separated(
                                  scrollDirection: Axis.horizontal,
                                  itemCount: data.recentLessons.length,
                                  separatorBuilder: (context, index) =>
                                      const SizedBox(width: AppTokens.space3),
                                  itemBuilder: (context, index) {
                                    final lesson = data.recentLessons[index];
                                    final done = data.completedIds.contains(
                                      lesson.id,
                                    );
                                    return _RecentCard(
                                      lesson: lesson,
                                      completed: done,
                                      onTap: () => _openLesson(lesson),
                                    );
                                  },
                                ),
                              ),
                              const SizedBox(height: AppTokens.space6),
                            ],
                            const _SectionTitle('Önerilen Modüller'),
                            const SizedBox(height: AppTokens.space3),
                            SizedBox(
                              height: 218,
                              child: ListView.separated(
                                scrollDirection: Axis.horizontal,
                                itemCount: data.recommendedLessons.length,
                                separatorBuilder: (context, index) =>
                                    const SizedBox(width: AppTokens.space3),
                                itemBuilder: (context, index) {
                                  final lesson = data.recommendedLessons[index];
                                  return _RecommendedCard(
                                    lesson: lesson,
                                    onTap: () => _openLesson(lesson),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(height: AppTokens.space6),
                            const _SectionTitle('Hızlı Erişim'),
                            const SizedBox(height: AppTokens.space2),
                            _QuickTile(
                              title: 'Değerlendirme Sınavı',
                              subtitle: '111 havuz · 20 rastgele soru',
                              icon: Icons.quiz_outlined,
                              gradient: const LinearGradient(
                                colors: [AppTokens.success, Color(0xFF16A34A)],
                              ),
                              onTap: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute<void>(
                                    builder: (_) => const ExamStartScreen(),
                                  ),
                                );
                              },
                            ),
                            const SizedBox(height: AppTokens.space3),
                            _QuickTile(
                              title: 'Metin Tiryaki',
                              subtitle: 'metintiryaki.com',
                              icon: Icons.person_outline,
                              gradient: AppTokens.primaryGradient,
                              onTap: _openWebsite,
                            ),
                            const SizedBox(height: AppTokens.space5),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
      bottomNavigationBar: _HomeBottomNav(
        currentIndex: _navIndex,
        onTap: _onNavTap,
        brightness: brightness,
      ),
    );
  }

  Future<void> _openLesson(Lesson lesson) async {
    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => LessonDetailScreen(lessonId: lesson.id),
      ),
    );
    await _refresh();
  }

  Future<void> _openWebsite() async {
    final uri = Uri.parse('https://www.metintiryaki.com');
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Site açılamadı')));
    }
  }
}

class _HomeData {
  const _HomeData({
    required this.lessons,
    required this.completedIds,
    required this.profile,
  });

  final List<Lesson> lessons;
  final Set<String> completedIds;
  final UserProfileData profile;

  int get completedCount => completedIds.length;

  List<Lesson> get recentLessons {
    final incomplete = lessons
        .where((l) => !completedIds.contains(l.id))
        .toList();
    if (incomplete.isNotEmpty) {
      return incomplete.take(3).toList();
    }
    return lessons.reversed.take(3).toList().reversed.toList();
  }

  List<Lesson> get recommendedLessons => lessons.take(6).toList();
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader({
    required this.profile,
    required this.completedCount,
    required this.totalCount,
    required this.onProfileTap,
    required this.onNotifications,
  });

  final UserProfileData profile;
  final int completedCount;
  final int totalCount;
  final VoidCallback onProfileTap;
  final VoidCallback onNotifications;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final progress = totalCount > 0 ? completedCount / totalCount : 0.0;
    final displayName = profile.displayName;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onProfileTap,
            customBorder: const CircleBorder(),
            child: CircleAvatar(
              radius: 28,
              backgroundColor: AppTokens.scale100,
              backgroundImage: profile.avatarPath != null
                  ? FileImage(File(profile.avatarPath!))
                  : null,
              child: profile.avatarPath == null
                  ? Icon(
                      Icons.person_rounded,
                      size: 32,
                      color: AppTokens.scale700.withValues(alpha: 0.75),
                    )
                  : null,
            ),
          ),
        ),
        const SizedBox(width: AppTokens.space4),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (displayName.isNotEmpty)
                Text(
                  displayName,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    height: 1.15,
                  ),
                )
              else
                ShaderMask(
                  shaderCallback: (bounds) =>
                      AppTokens.primaryGradient.createShader(bounds),
                  child: Text(
                    'Merhaba',
                    style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      height: 1.05,
                    ),
                  ),
                ),
              const SizedBox(height: AppTokens.space1),
              Text(
                displayName.isNotEmpty
                    ? 'Bugün ne öğrenmek istersiniz?'
                    : 'Profil fotoğrafı ve adınızı ekleyin.',
                style: Theme.of(
                  context,
                ).textTheme.bodyMedium?.copyWith(fontSize: 14),
              ),
              if (totalCount > 0) ...[
                const SizedBox(height: AppTokens.space3),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppTokens.space3,
                    vertical: AppTokens.space2,
                  ),
                  decoration: BoxDecoration(
                    color: isDark
                        ? AppTokens.surfaceDark
                        : Colors.white.withValues(alpha: 0.85),
                    borderRadius: BorderRadius.circular(AppTokens.radiusFull),
                    border: Border.all(
                      color: AppTokens.primary.withValues(alpha: 0.2),
                    ),
                    boxShadow: AppTokens.shadowSm(Theme.of(context).brightness),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          value: progress,
                          strokeWidth: 2.5,
                          color: AppTokens.primary,
                          backgroundColor: AppTokens.primary.withValues(
                            alpha: 0.15,
                          ),
                        ),
                      ),
                      const SizedBox(width: AppTokens.space2),
                      Text(
                        '$completedCount / $totalCount modül',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppTokens.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
        Material(
          color: isDark
              ? AppTokens.surfaceDark
              : Colors.white.withValues(alpha: 0.85),
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
          elevation: 0,
          shadowColor: Colors.transparent,
          child: InkWell(
            onTap: onNotifications,
            borderRadius: BorderRadius.circular(AppTokens.radiusMd),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(AppTokens.radiusMd),
                boxShadow: AppTokens.shadowSm(Theme.of(context).brightness),
              ),
              padding: const EdgeInsets.all(AppTokens.space3),
              child: Icon(
                Icons.notifications_none_rounded,
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _SearchBar extends StatelessWidget {
  const _SearchBar({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Material(
      color: isDark
          ? AppTokens.surfaceDark
          : Colors.white.withValues(alpha: 0.88),
      borderRadius: BorderRadius.circular(AppTokens.radiusSm),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTokens.radiusSm),
        child: Ink(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(AppTokens.radiusSm),
            border: Border.all(
              color: AppTokens.primary.withValues(alpha: 0.12),
            ),
            boxShadow: AppTokens.shadowSm(Theme.of(context).brightness),
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: AppTokens.space4,
            vertical: 14,
          ),
          child: Row(
            children: [
              Icon(
                Icons.search_rounded,
                color: Theme.of(
                  context,
                ).colorScheme.onSurface.withValues(alpha: 0.45),
                size: 22,
              ),
              const SizedBox(width: AppTokens.space3),
              Text('Modül ara…', style: Theme.of(context).textTheme.bodyMedium),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: Theme.of(context).textTheme.titleMedium?.copyWith(
        fontSize: 18,
        fontWeight: FontWeight.w700,
      ),
    );
  }
}

class _RecentCard extends StatelessWidget {
  const _RecentCard({
    required this.lesson,
    required this.completed,
    required this.onTap,
  });

  final Lesson lesson;
  final bool completed;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final progress = completed ? 1.0 : 0.0;
    final progressLabel = completed ? 'Tamamlandı' : 'Devam Et';
    final surface = Theme.of(context).colorScheme.surface;

    return SizedBox(
      width: 268,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(AppTokens.radiusLg),
          child: Ink(
            decoration: BoxDecoration(
              color: surface,
              borderRadius: BorderRadius.circular(AppTokens.radiusLg),
              boxShadow: AppTokens.shadowMd(brightness),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  height: 92,
                  decoration: const BoxDecoration(
                    gradient: AppTokens.primaryGradient,
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(AppTokens.radiusLg),
                    ),
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        right: -12,
                        top: -12,
                        child: Icon(
                          _moduleIcon(lesson.order),
                          size: 72,
                          color: Colors.white.withValues(alpha: 0.18),
                        ),
                      ),
                      Center(
                        child: Icon(
                          _moduleIcon(lesson.order),
                          size: 40,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppTokens.space4,
                    AppTokens.space3,
                    AppTokens.space4,
                    AppTokens.space4,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Modül ${lesson.order}',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: AppTokens.space1),
                      Text(
                        _shortTitle(lesson.title),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.titleMedium
                            ?.copyWith(fontSize: 14, height: 1.2),
                      ),
                      const SizedBox(height: AppTokens.space3),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(AppTokens.radiusXs),
                        child: LinearProgressIndicator(
                          value: progress,
                          minHeight: 5,
                          backgroundColor: AppTokens.primary.withValues(
                            alpha: 0.12,
                          ),
                          color: AppTokens.primary,
                        ),
                      ),
                      const SizedBox(height: AppTokens.space1),
                      Text(
                        progressLabel,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: completed
                              ? AppTokens.success
                              : AppTokens.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RecommendedCard extends StatelessWidget {
  const _RecommendedCard({required this.lesson, required this.onTap});

  final Lesson lesson;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;

    return SizedBox(
      width: 168,
      height: 218,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(AppTokens.radiusLg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 136,
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: AppTokens.primaryGradient,
                  borderRadius: BorderRadius.circular(AppTokens.radiusLg),
                  boxShadow: [
                    ...AppTokens.shadowMd(brightness),
                    ...AppTokens.shadowGlow,
                  ],
                ),
                child: Stack(
                  children: [
                    Positioned(
                      right: -8,
                      bottom: -8,
                      child: Icon(
                        _moduleIcon(lesson.order),
                        size: 80,
                        color: Colors.white.withValues(alpha: 0.2),
                      ),
                    ),
                    Center(
                      child: Icon(
                        _moduleIcon(lesson.order),
                        size: 52,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppTokens.space2),
              Expanded(
                child: Text(
                  _shortTitle(lesson.title),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(
                    context,
                  ).textTheme.titleMedium?.copyWith(fontSize: 13, height: 1.2),
                ),
              ),
              Row(
                children: [
                  Icon(
                    Icons.menu_book_outlined,
                    size: 13,
                    color: Theme.of(
                      context,
                    ).colorScheme.onSurface.withValues(alpha: 0.45),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Modül ${lesson.order}',
                    style: Theme.of(
                      context,
                    ).textTheme.bodyMedium?.copyWith(fontSize: 12),
                  ),
                  const SizedBox(width: 8),
                  Icon(
                    Icons.schedule,
                    size: 14,
                    color: Theme.of(
                      context,
                    ).colorScheme.onSurface.withValues(alpha: 0.45),
                  ),
                  const SizedBox(width: 2),
                  Flexible(
                    child: Text(
                      '${lesson.estimatedMinutes} dk',
                      style: Theme.of(
                        context,
                      ).textTheme.bodyMedium?.copyWith(fontSize: 12),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _QuickTile extends StatelessWidget {
  const _QuickTile({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.gradient,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final Gradient gradient;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surface = isDark
        ? const Color(0xFF1A1A2E)
        : Colors.white.withValues(alpha: 0.9);

    return Material(
      color: surface,
      borderRadius: BorderRadius.circular(AppTokens.radiusMd),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTokens.radiusMd),
        child: Ink(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(AppTokens.radiusMd),
            boxShadow: AppTokens.shadowSm(Theme.of(context).brightness),
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: AppTokens.space4,
            vertical: 14,
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  gradient: gradient,
                  borderRadius: BorderRadius.circular(AppTokens.radiusSm),
                  boxShadow: AppTokens.shadowGlow,
                ),
                child: Icon(icon, color: Colors.white, size: 24),
              ),
              const SizedBox(width: AppTokens.space4),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: Theme.of(context).textTheme.labelLarge),
                    Text(
                      subtitle,
                      style: Theme.of(
                        context,
                      ).textTheme.bodyMedium?.copyWith(fontSize: 13),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.chevron_right_rounded,
                color: Theme.of(
                  context,
                ).colorScheme.onSurface.withValues(alpha: 0.35),
                size: 24,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _HomeBottomNav extends StatelessWidget {
  const _HomeBottomNav({
    required this.currentIndex,
    required this.onTap,
    required this.brightness,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;
  final Brightness brightness;

  @override
  Widget build(BuildContext context) {
    final isDark = brightness == Brightness.dark;
    final barColor = isDark
        ? AppTokens.bgDark.withValues(alpha: 0.75)
        : Colors.white.withValues(alpha: 0.72);

    final bottomInset = MediaQuery.paddingOf(context).bottom;

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          decoration: BoxDecoration(
            color: barColor,
            border: Border(
              top: BorderSide(color: AppTokens.primary.withValues(alpha: 0.1)),
            ),
          ),
          padding: EdgeInsets.only(
            top: 6,
            bottom: bottomInset > 0 ? bottomInset : 6,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _NavItem(
                icon: Icons.home_rounded,
                label: 'Ana Sayfa',
                selected: currentIndex == 0,
                onTap: () => onTap(0),
              ),
              _NavItem(
                icon: Icons.menu_book_rounded,
                label: 'Modüller',
                selected: false,
                onTap: () => onTap(1),
              ),
              _NavItem(
                icon: Icons.person_outline_rounded,
                label: 'Profil',
                selected: false,
                onTap: () => onTap(2),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final muted = Theme.of(
      context,
    ).colorScheme.onSurface.withValues(alpha: 0.45);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppTokens.radiusSm),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppTokens.space3,
          vertical: 2,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              height: 28,
              child: Center(
                child: selected
                    ? Container(
                        padding: const EdgeInsets.all(5),
                        decoration: BoxDecoration(
                          gradient: AppTokens.primaryGradient,
                          borderRadius: BorderRadius.circular(
                            AppTokens.radiusXs,
                          ),
                          boxShadow: AppTokens.shadowGlow,
                        ),
                        child: Icon(icon, color: Colors.white, size: 18),
                      )
                    : Icon(icon, color: muted, size: 22),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                color: selected ? AppTokens.primary : muted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

String _shortTitle(String title) {
  if (title.length <= 48) return title;
  return '${title.substring(0, 45)}…';
}

IconData _moduleIcon(int order) {
  const icons = [
    Icons.psychology_alt_outlined,
    Icons.hub_outlined,
    Icons.memory_outlined,
    Icons.smart_toy_outlined,
    Icons.biotech_outlined,
    Icons.analytics_outlined,
  ];
  return icons[(order - 1) % icons.length];
}
