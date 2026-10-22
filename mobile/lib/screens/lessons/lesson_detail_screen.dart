import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';
import 'package:yz_egitim_sinav/models/lesson.dart';
import 'package:yz_egitim_sinav/services/ad_service.dart';
import 'package:yz_egitim_sinav/services/lesson_progress_service.dart';
import 'package:yz_egitim_sinav/screens/lessons/lesson_quiz_sheet.dart';
import 'package:yz_egitim_sinav/services/lesson_repository.dart';

class LessonDetailScreen extends StatefulWidget {
  const LessonDetailScreen({super.key, required this.lessonId});

  final String lessonId;

  @override
  State<LessonDetailScreen> createState() => _LessonDetailScreenState();
}

class _LessonDetailScreenState extends State<LessonDetailScreen> {
  late Future<Lesson?> _lessonFuture;

  @override
  void initState() {
    super.initState();
    _lessonFuture = LessonRepository.instance.getById(widget.lessonId);
  }

  void _onCompletePressed(Lesson lesson) {
    final quiz = lesson.quizSection;
    if (quiz != null) {
      showLessonQuizSheet(
        context: context,
        quizSection: quiz,
        onFinish: () => _completeAndReturn(lesson),
      );
    } else {
      _completeAndReturn(lesson);
    }
  }

  Future<void> _completeAndReturn(Lesson lesson) async {
    await LessonProgressService.instance.markCompleted(lesson.id);
    if (!mounted) return;
    await AdService.instance.showInterstitialAfterLesson();
    if (!mounted) return;
    Navigator.of(context).pop(true);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Lesson?>(
      future: _lessonFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Scaffold(
            body: AppMeshBackground(
              child: Center(
                child: CircularProgressIndicator(color: AppTokens.primary),
              ),
            ),
          );
        }
        final lesson = snapshot.data;
        if (lesson == null) {
          return Scaffold(
            body: AppMeshBackground(
              child: const Center(child: Text('Modül bulunamadı')),
            ),
          );
        }
        return Scaffold(
          backgroundColor: Colors.transparent,
          extendBody: true,
          extendBodyBehindAppBar: false,
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_rounded),
              tooltip: 'Geri',
              onPressed: () => Navigator.of(context).pop(),
            ),
            title: Text('Modül ${lesson.order}'),
          ),
          body: AppMeshBackground(
            child: Column(
              children: [
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(
                      AppTokens.space5,
                      AppTokens.space4,
                      AppTokens.space5,
                      AppTokens.space5,
                    ),
                    children: [
                      _LessonHeroHeader(lesson: lesson),
                      const SizedBox(height: AppTokens.space5),
                      ...lesson.contentSections.map(_buildSection),
                    ],
                  ),
                ),
                _CompleteBar(onPressed: () => _onCompletePressed(lesson)),
              ],
            ),
          ),
        );
      },
    );
  }

  bool _isSectionHeading(String text) {
    if (text.length > 80 || text.endsWith('.')) return false;
    if (RegExp(r'^\d+\.\d+\s').hasMatch(text)) return true;
    final words = text.trim().split(RegExp(r'\s+'));
    return words.length <= 7 && text.length <= 48;
  }

  Widget _buildSection(LessonSection section) {
    if (section.isImage) {
      return _buildImageSection(section);
    }
    if (section.isTip) {
      return _ContentCard(
        margin: const EdgeInsets.only(bottom: AppTokens.space4),
        border: Border.all(
          color: AppTokens.primary.withValues(alpha: 0.25),
          width: 1.2,
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: AppTokens.primaryGradient,
                borderRadius: BorderRadius.circular(AppTokens.radiusSm),
                boxShadow: AppTokens.shadowGlow,
              ),
              child: const Icon(
                Icons.lightbulb_outline_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(width: AppTokens.space3),
            Expanded(
              child: Text(
                section.body,
                style: TextStyle(
                  fontSize: 14,
                  height: 1.55,
                  color: AppTokens.primary.withValues(alpha: 0.95),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      );
    }
    if (section.isBullet) {
      return _ContentCard(
        margin: const EdgeInsets.only(bottom: AppTokens.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (section.body.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: AppTokens.space3),
                child: Text(
                  section.body,
                  style: Theme.of(
                    context,
                  ).textTheme.titleMedium?.copyWith(fontSize: 15),
                ),
              ),
            ...section.items.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: AppTokens.space2),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      margin: const EdgeInsets.only(top: 6),
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        gradient: AppTokens.primaryGradient,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: AppTokens.space3),
                    Expanded(
                      child: Text(
                        item,
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          fontSize: 15,
                          height: 1.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    }

    if (_isSectionHeading(section.body)) {
      return Padding(
        padding: const EdgeInsets.only(
          top: AppTokens.space2,
          bottom: AppTokens.space3,
        ),
        child: ShaderMask(
          shaderCallback: (bounds) =>
              AppTokens.primaryGradient.createShader(bounds),
          child: Text(
            section.body,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontSize: 17,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              height: 1.25,
            ),
          ),
        ),
      );
    }

    return _ContentCard(
      margin: const EdgeInsets.only(bottom: AppTokens.space4),
      child: Text(
        section.body,
        style: Theme.of(
          context,
        ).textTheme.bodyLarge?.copyWith(fontSize: 15, height: 1.6),
      ),
    );
  }

  Widget _buildImageSection(LessonSection section) {
    final assetPath =
        section.items.length > 1 &&
            section.items[1].startsWith('assets/images/lessons/')
        ? section.items[1]
        : null;
    if (assetPath == null) return _imagePlaceholder(section);

    final isInfographic = assetPath.contains('modul-04-02');
    final brightness = Theme.of(context).brightness;

    if (isInfographic) {
      return _ContentCard(
        margin: const EdgeInsets.only(bottom: AppTokens.space4),
        padding: EdgeInsets.zero,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppTokens.space4,
                AppTokens.space4,
                AppTokens.space4,
                AppTokens.space2,
              ),
              child: Text(
                section.body,
                textAlign: TextAlign.center,
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontSize: 14),
              ),
            ),
            ClipRRect(
              borderRadius: const BorderRadius.vertical(
                bottom: Radius.circular(AppTokens.radiusLg - 1),
              ),
              child: Image.asset(
                assetPath,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stack) =>
                    _imagePlaceholder(section),
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      margin: const EdgeInsets.only(bottom: AppTokens.space4),
      height: 210,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppTokens.radiusLg),
        boxShadow: AppTokens.shadowMd(brightness),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppTokens.radiusLg),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.asset(
              assetPath,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stack) =>
                  _imagePlaceholder(section),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withValues(alpha: 0.65),
                    ],
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppTokens.space4,
                    vertical: AppTokens.space3,
                  ),
                  child: Text(
                    section.body,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _imagePlaceholder(LessonSection section) {
    final keywords = section.items.isNotEmpty ? section.items.first : '';
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return _ContentCard(
      margin: const EdgeInsets.only(bottom: AppTokens.space4),
      child: SizedBox(
        height: 140,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.image_outlined,
              size: 40,
              color: Theme.of(
                context,
              ).colorScheme.onSurface.withValues(alpha: 0.35),
            ),
            const SizedBox(height: AppTokens.space2),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppTokens.space4),
              child: Text(
                section.body,
                textAlign: TextAlign.center,
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontSize: 14),
              ),
            ),
            if (keywords.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                keywords,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontSize: 12,
                  color: isDark
                      ? AppTokens.textSecondaryDark
                      : AppTokens.textSecondaryLight,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _LessonHeroHeader extends StatelessWidget {
  const _LessonHeroHeader({required this.lesson});

  final Lesson lesson;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return _ContentCard(
      padding: const EdgeInsets.all(AppTokens.space5),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppTokens.space3,
              vertical: AppTokens.space1,
            ),
            decoration: BoxDecoration(
              gradient: AppTokens.primaryGradient,
              borderRadius: BorderRadius.circular(AppTokens.radiusFull),
              boxShadow: AppTokens.shadowGlow,
            ),
            child: Text(
              'MODÜL ${lesson.order}',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 11,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.6,
              ),
            ),
          ),
          const SizedBox(height: AppTokens.space4),
          Text(
            lesson.title,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              height: 1.2,
            ),
          ),
          const SizedBox(height: AppTokens.space2),
          Row(
            children: [
              Icon(
                Icons.schedule_rounded,
                size: 16,
                color: Theme.of(
                  context,
                ).colorScheme.onSurface.withValues(alpha: 0.45),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  lesson.subtitle,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppTokens.space3),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppTokens.radiusXs),
            child: LinearProgressIndicator(
              minHeight: 4,
              value: 0,
              backgroundColor: AppTokens.primary.withValues(alpha: 0.12),
              color: AppTokens.primary,
            ),
          ),
          const SizedBox(height: AppTokens.space1),
          Text(
            'Okumaya başlayın',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: isDark
                  ? AppTokens.textSecondaryDark
                  : AppTokens.textSecondaryLight,
            ),
          ),
        ],
      ),
    );
  }
}

class _ContentCard extends StatelessWidget {
  const _ContentCard({
    required this.child,
    this.margin,
    this.padding,
    this.border,
  });

  final Widget child;
  final EdgeInsetsGeometry? margin;
  final EdgeInsetsGeometry? padding;
  final Border? border;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final surface = Theme.of(context).colorScheme.surface;

    return Container(
      margin: margin,
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(AppTokens.radiusLg),
        border: border,
        boxShadow: AppTokens.shadowMd(brightness),
      ),
      child: Padding(
        padding: padding ?? const EdgeInsets.all(AppTokens.space4),
        child: child,
      ),
    );
  }
}

class _CompleteBar extends StatelessWidget {
  const _CompleteBar({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final barColor = isDark
        ? AppTokens.bgDark.withValues(alpha: 0.8)
        : Colors.white.withValues(alpha: 0.85);

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Container(
          decoration: BoxDecoration(
            color: barColor,
            border: Border(
              top: BorderSide(color: AppTokens.primary.withValues(alpha: 0.12)),
            ),
          ),
          child: SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                AppTokens.space5,
                AppTokens.space3,
                AppTokens.space5,
                AppTokens.space4,
              ),
              child: AppGradientButton(
                onPressed: onPressed,
                label: 'Modülü Tamamla',
                icon: Icons.check_circle_outline_rounded,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
