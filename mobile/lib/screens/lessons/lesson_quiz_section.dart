import 'package:flutter/material.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';
import 'package:yz_egitim_sinav/models/lesson.dart';

class LessonQuizSection extends StatefulWidget {
  const LessonQuizSection({
    super.key,
    required this.section,
    this.showHeader = true,
  });

  final LessonSection section;
  final bool showHeader;

  @override
  State<LessonQuizSection> createState() => _LessonQuizSectionState();
}

class _LessonQuizSectionState extends State<LessonQuizSection> {
  final Map<int, int?> _selected = {};
  final Set<int> _revealed = {};

  String _levelLabel(String level) {
    switch (level) {
      case 'medium':
        return 'Orta';
      case 'hard':
        return 'Zor';
      default:
        return 'Kolay';
    }
  }

  Color _levelColor(String level) {
    switch (level) {
      case 'medium':
        return const Color(0xFFE67E22);
      case 'hard':
        return const Color(0xFFE74C3C);
      default:
        return const Color(0xFF27AE60);
    }
  }

  @override
  Widget build(BuildContext context) {
    final questions = widget.section.questions;
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (widget.showHeader) ...[
            Text(
              widget.section.body,
              style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
          ],
          ...List.generate(questions.length, (i) {
            final q = questions[i];
            final selected = _selected[i];
            final revealed = _revealed.contains(i);
            return Container(
              margin: const EdgeInsets.only(bottom: 14),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFE0E6ED)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: _levelColor(q.level).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          _levelLabel(q.level),
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: _levelColor(q.level),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Soru ${i + 1}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    q.question,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 10),
                  ...List.generate(q.options.length, (oi) {
                    final opt = q.options[oi];
                    if (opt.isEmpty) return const SizedBox.shrink();
                    final isCorrect = oi == q.correctIndex;
                    Color? tileColor;
                    if (revealed && selected == oi) {
                      tileColor = isCorrect
                          ? const Color(0xFFD5F5E3)
                          : const Color(0xFFFADBD8);
                    } else if (revealed && isCorrect) {
                      tileColor = const Color(0xFFD5F5E3);
                    }
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Material(
                        color: tileColor ?? const Color(0xFFF7F9FC),
                        borderRadius: BorderRadius.circular(8),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(8),
                          onTap: revealed
                              ? null
                              : () {
                                  setState(() {
                                    _selected[i] = oi;
                                    _revealed.add(i);
                                  });
                                },
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 10,
                            ),
                            child: Row(
                              children: [
                                Text(
                                  '${String.fromCharCode(65 + oi)}) ',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                                Expanded(
                                  child: Text(
                                    opt,
                                    style: const TextStyle(fontSize: 14, height: 1.35),
                                  ),
                                ),
                                if (revealed && isCorrect)
                                  const Icon(
                                    Icons.check_circle,
                                    color: Color(0xFF27AE60),
                                    size: 18,
                                  ),
                                if (revealed && selected == oi && !isCorrect)
                                  const Icon(
                                    Icons.cancel,
                                    color: Color(0xFFE74C3C),
                                    size: 18,
                                  ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
