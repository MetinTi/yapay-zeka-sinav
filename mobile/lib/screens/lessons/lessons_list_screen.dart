import 'package:flutter/material.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';
import 'package:yz_egitim_sinav/models/lesson.dart';
import 'package:yz_egitim_sinav/screens/lessons/lesson_detail_screen.dart';
import 'package:yz_egitim_sinav/services/lesson_progress_service.dart';
import 'package:yz_egitim_sinav/services/lesson_repository.dart';

class LessonsListScreen extends StatefulWidget {
  const LessonsListScreen({super.key});

  @override
  State<LessonsListScreen> createState() => _LessonsListScreenState();
}

class _LessonsListScreenState extends State<LessonsListScreen> {
  late Future<List<Lesson>> _lessonsFuture;
  Set<String> _completed = {};

  @override
  void initState() {
    super.initState();
    _lessonsFuture = _load();
  }

  Future<List<Lesson>> _load() async {
    final lessons = await LessonRepository.instance.loadLessons();
    _completed = await LessonProgressService.instance.getCompletedIds();
    return lessons;
  }

  Future<void> _refresh() async {
    setState(() {
      _lessonsFuture = _load();
    });
    await _lessonsFuture;
  }

  @override
  Widget build(BuildContext context) {
    return AppPageScaffold(
      title: 'Eğitim Modülleri',
      body: FutureBuilder<List<Lesson>>(
        future: _lessonsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: AppTokens.primary),
            );
          }
          if (snapshot.hasError) {
            return Center(child: Text('Yüklenemedi: ${snapshot.error}'));
          }
          final lessons = snapshot.data ?? [];
          final doneCount = lessons
              .where((l) => _completed.contains(l.id))
              .length;
          final progress = lessons.isEmpty ? 0.0 : doneCount / lessons.length;

          return RefreshIndicator(
            onRefresh: _refresh,
            color: AppTokens.primary,
            child: ListView.separated(
              padding: const EdgeInsets.fromLTRB(
                AppTokens.space5,
                AppTokens.space4,
                AppTokens.space5,
                AppTokens.space6,
              ),
              itemCount: lessons.length + 1,
              separatorBuilder: (context, index) =>
                  const SizedBox(height: AppTokens.space3),
              itemBuilder: (context, index) {
                if (index == 0) {
                  return _ProgressHeader(
                    completed: doneCount,
                    total: lessons.length,
                    progress: progress,
                  );
                }
                final lesson = lessons[index - 1];
                final done = _completed.contains(lesson.id);
                return _LessonCard(
                  lesson: lesson,
                  completed: done,
                  onTap: () async {
                    final completed = await Navigator.of(context).push<bool>(
                      MaterialPageRoute<bool>(
                        builder: (_) => LessonDetailScreen(lessonId: lesson.id),
                      ),
                    );
                    await _refresh();
                    if (!context.mounted || completed != true) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Modül ${lesson.order} tamamlandı'),
                      ),
                    );
                  },
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class _ProgressHeader extends StatelessWidget {
  const _ProgressHeader({
    required this.completed,
    required this.total,
    required this.progress,
  });

  final int completed;
  final int total;
  final double progress;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final surface = Theme.of(context).colorScheme.surface;

    return Container(
      margin: const EdgeInsets.only(bottom: AppTokens.space3),
      padding: const EdgeInsets.all(AppTokens.space5),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(AppTokens.radiusLg),
        boxShadow: AppTokens.shadowMd(brightness),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ShaderMask(
            shaderCallback: (bounds) =>
                AppTokens.primaryGradient.createShader(bounds),
            child: Text(
              '17 modüllük yolculuk',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(height: AppTokens.space2),
          Text(
            '$completed / $total modül tamamlandı',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: AppTokens.space4),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppTokens.radiusFull),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 8,
              backgroundColor: AppTokens.primary.withValues(alpha: 0.12),
              color: AppTokens.primary,
            ),
          ),
        ],
      ),
    );
  }
}

class _LessonCard extends StatelessWidget {
  const _LessonCard({
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
    final surface = Theme.of(context).colorScheme.surface;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTokens.radiusLg),
        child: Ink(
          decoration: BoxDecoration(
            color: surface,
            borderRadius: BorderRadius.circular(AppTokens.radiusLg),
            border: completed
                ? Border.all(
                    color: AppTokens.success.withValues(alpha: 0.4),
                    width: 1.5,
                  )
                : null,
            boxShadow: AppTokens.shadowMd(brightness),
          ),
          padding: const EdgeInsets.all(AppTokens.space4),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  gradient: completed
                      ? const LinearGradient(
                          colors: [AppTokens.success, Color(0xFF16A34A)],
                        )
                      : AppTokens.primaryGradient,
                  borderRadius: BorderRadius.circular(AppTokens.radiusMd),
                  boxShadow: completed ? null : AppTokens.shadowGlow,
                ),
                child: Center(
                  child: completed
                      ? const Icon(
                          Icons.check_rounded,
                          color: Colors.white,
                          size: 26,
                        )
                      : Text(
                          '${lesson.order}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                            fontSize: 18,
                          ),
                        ),
                ),
              ),
              const SizedBox(width: AppTokens.space4),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _shortTitle(lesson.title),
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontSize: 15,
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: AppTokens.space1),
                    Text(
                      lesson.subtitle,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(
                        context,
                      ).textTheme.bodyMedium?.copyWith(fontSize: 12),
                    ),
                    const SizedBox(height: AppTokens.space2),
                    Row(
                      children: [
                        Icon(
                          Icons.schedule_rounded,
                          size: 14,
                          color: Theme.of(
                            context,
                          ).colorScheme.onSurface.withValues(alpha: 0.4),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '~${lesson.estimatedMinutes} dk',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: completed
                                ? AppTokens.success
                                : AppTokens.primary,
                          ),
                        ),
                        if (completed) ...[
                          const SizedBox(width: AppTokens.space3),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: AppTokens.success.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(
                                AppTokens.radiusFull,
                              ),
                            ),
                            child: const Text(
                              'Tamam',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: AppTokens.success,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppTokens.space2),
              Icon(
                _moduleIcon(lesson.order),
                size: 22,
                color: Theme.of(
                  context,
                ).colorScheme.onSurface.withValues(alpha: 0.2),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

String _shortTitle(String title) {
  if (title.length <= 52) return title;
  return '${title.substring(0, 49)}…';
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
