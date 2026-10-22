import 'dart:async';

import 'package:flutter/material.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';
import 'package:yz_egitim_sinav/models/exam_question.dart';
import 'package:yz_egitim_sinav/screens/exam/exam_result_screen.dart';
import 'package:yz_egitim_sinav/services/exam_api_service.dart';
import 'package:yz_egitim_sinav/services/exam_engine.dart';
import 'package:yz_egitim_sinav/services/exam_repository.dart';

class ExamScreen extends StatefulWidget {
  const ExamScreen({
    super.key,
    required this.participantName,
    required this.participantEmail,
  });

  final String participantName;
  final String participantEmail;

  @override
  State<ExamScreen> createState() => _ExamScreenState();
}

class _ExamScreenState extends State<ExamScreen> {
  final _engine = ExamEngine();
  List<ExamQuestion> _questions = [];
  final Map<int, int?> _answers = {};
  bool _loading = true;
  bool _submitting = false;
  int _secondsLeft = 45 * 60;
  Timer? _timer;
  DateTime? _startedAt;

  @override
  void initState() {
    super.initState();
    _initExam();
  }

  Future<void> _initExam() async {
    final pool = await ExamRepository.instance.loadPool();
    final questions = await _engine.pickExamQuestions();
    if (!mounted) return;
    setState(() {
      _questions = questions;
      _secondsLeft = pool.durationMinutes * 60;
      _loading = false;
      _startedAt = DateTime.now();
    });
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      if (_secondsLeft <= 0) {
        _timer?.cancel();
        _finishExam(force: true);
        return;
      }
      setState(() => _secondsLeft--);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  int get _answeredCount =>
      _answers.values.where((v) => v != null).length;

  String get _timerText {
    final m = _secondsLeft ~/ 60;
    final s = _secondsLeft % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  Future<void> _finishExam({bool force = false}) async {
    final unanswered = _questions.length - _answeredCount;
    if (!force && unanswered > 0) {
      final ok = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Sınavı Bitir'),
          content: Text('$unanswered soru cevaplanmadı. Bitirmek istiyor musunuz?'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('İptal')),
            TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Bitir')),
          ],
        ),
      );
      if (ok != true || !mounted) return;
    }
    _timer?.cancel();
    final elapsed = DateTime.now().difference(_startedAt ?? DateTime.now());
    final result = _engine.calculateResult(
      questions: _questions,
      answers: _answers,
      elapsed: elapsed,
    );
    final timeStr = '${elapsed.inMinutes} dakika ${elapsed.inSeconds % 60} saniye';

    setState(() => _submitting = true);
    final submission = await ExamApiService.instance.submitResult(
      name: widget.participantName,
      email: widget.participantEmail,
      score: result.score,
      correct: result.correct,
      wrong: result.wrong,
      empty: result.empty,
      time: timeStr,
    );
    if (!mounted) return;
    setState(() => _submitting = false);

    await Navigator.of(context).pushReplacement(
      MaterialPageRoute<void>(
        builder: (_) => ExamResultScreen(
          participantName: widget.participantName,
          participantEmail: widget.participantEmail,
          result: result,
          questions: _questions,
          answers: Map.from(_answers),
          submission: submission,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Sınav')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final progress = _questions.isEmpty
        ? 0.0
        : _answeredCount / _questions.length;

    return Stack(
      children: [
        Scaffold(
      appBar: AppBar(
        title: Text(widget.participantName),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: Text(
                _timerText,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: _secondsLeft < 300 ? Colors.red.shade700 : Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Cevaplanan: $_answeredCount/${_questions.length}',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: progress,
                  minHeight: 6,
                  borderRadius: BorderRadius.circular(4),
                  backgroundColor: const Color(0xFFE0E6ED),
                  color: AppColors.success,
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _questions.length,
              itemBuilder: (context, index) => _QuestionCard(
                index: index,
                question: _questions[index],
                selected: _answers[index],
                onSelect: (opt) => setState(() => _answers[index] = opt),
              ),
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _finishExam,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE74C3C),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Text('Sınavı Bitir'),
                ),
              ),
            ),
          ),
        ],
      ),
    ),
        if (_submitting)
          Container(
            color: Colors.black54,
            child: const Center(
              child: Card(
                margin: EdgeInsets.all(32),
                child: Padding(
                  padding: EdgeInsets.all(28),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(height: 16),
                      Text(
                        'Sonuçlar gönderiliyor…',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      SizedBox(height: 6),
                      Text(
                        'E-postanıza iletiliyor',
                        style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _QuestionCard extends StatelessWidget {
  const _QuestionCard({
    required this.index,
    required this.question,
    required this.selected,
    required this.onSelect,
  });

  final int index;
  final ExamQuestion question;
  final int? selected;
  final ValueChanged<int> onSelect;

  Color _levelColor(String level) {
    switch (level) {
      case 'medium':
        return const Color(0xFFF39C12);
      case 'hard':
        return const Color(0xFFE74C3C);
      default:
        return const Color(0xFF27AE60);
    }
  }

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

  @override
  Widget build(BuildContext context) {
    final borderColor = _levelColor(question.level);
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: borderColor, width: 4)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'Soru ${index + 1}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: borderColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  _levelLabel(question.level),
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: borderColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            question.question,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500, height: 1.4),
          ),
          const SizedBox(height: 12),
          ...List.generate(question.options.length, (oi) {
            final opt = question.options[oi];
            if (opt.isEmpty) return const SizedBox.shrink();
            final isSelected = selected == oi;
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Material(
                color: isSelected ? const Color(0xFFE8F4FD) : const Color(0xFFFAFAFA),
                borderRadius: BorderRadius.circular(10),
                child: InkWell(
                  borderRadius: BorderRadius.circular(10),
                  onTap: () => onSelect(oi),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: isSelected ? AppColors.primary : const Color(0xFFE8E8E8),
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${String.fromCharCode(65 + oi)}) ',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Expanded(child: Text(opt, style: const TextStyle(height: 1.35))),
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
  }
}
