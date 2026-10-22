import 'package:flutter/material.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';
import 'package:yz_egitim_sinav/models/exam_question.dart';
import 'package:yz_egitim_sinav/screens/exam/exam_start_screen.dart';
import 'package:yz_egitim_sinav/services/exam_api_service.dart';

class ExamResultScreen extends StatefulWidget {
  const ExamResultScreen({
    super.key,
    required this.participantName,
    required this.participantEmail,
    required this.result,
    required this.questions,
    required this.answers,
    required this.submission,
  });

  final String participantName;
  final String participantEmail;
  final ExamResult result;
  final List<ExamQuestion> questions;
  final Map<int, int?> answers;
  final ExamSubmissionState submission;

  @override
  State<ExamResultScreen> createState() => _ExamResultScreenState();
}

class _ExamResultScreenState extends State<ExamResultScreen> {
  bool _showReview = false;

  String get _timeText {
    final m = widget.result.elapsed.inMinutes;
    final s = widget.result.elapsed.inSeconds % 60;
    return '$m dakika $s saniye';
  }

  String get _message {
    final score = widget.result.score;
    if (score >= 90) return 'Mükemmel! Harika bir performans!';
    if (score >= 70) return 'Tebrikler! Başarılı oldunuz!';
    return 'Tekrar denemenizi öneririz.';
  }

  @override
  Widget build(BuildContext context) {
    final passed = widget.result.score >= 70;
    return Scaffold(
      appBar: AppBar(title: const Text('Sınav Sonucu')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Text(
              widget.participantName,
              style: const TextStyle(color: AppColors.textMuted, fontSize: 15),
            ),
            const SizedBox(height: 20),
            Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: passed
                      ? [AppColors.success, const Color(0xFF2ECC71)]
                      : [const Color(0xFFE74C3C), const Color(0xFFEC7063)],
                ),
              ),
              alignment: Alignment.center,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '${widget.result.score}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 42,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Text(
                    '/ 100',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.85),
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _Stat(value: '${widget.result.correct}', label: 'Doğru', color: AppColors.success),
                _Stat(value: '${widget.result.wrong}', label: 'Yanlış', color: const Color(0xFFE74C3C)),
                _Stat(value: '${widget.result.empty}', label: 'Boş', color: AppColors.textMuted),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              _message,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: passed ? AppColors.success : const Color(0xFFE74C3C),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Geçen süre: $_timeText',
              style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
            ),
            const SizedBox(height: 16),
            _EmailStatusBanner(
              submission: widget.submission,
              email: widget.participantEmail,
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => setState(() => _showReview = !_showReview),
                    child: Text(_showReview ? 'İncelemeyi Gizle' : 'Cevapları İncele'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pushAndRemoveUntil(
                        MaterialPageRoute<void>(
                          builder: (_) => const ExamStartScreen(),
                        ),
                        (route) => route.isFirst,
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                    ),
                    child: const Text('Yeni Sınav'),
                  ),
                ),
              ],
            ),
            if (_showReview) ...[
              const SizedBox(height: 20),
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Cevap anahtarı',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 12),
              ...List.generate(widget.questions.length, (i) {
                final q = widget.questions[i];
                final picked = widget.answers[i];
                final correct = picked == q.correctIndex;
                final unanswered = picked == null;
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: unanswered
                        ? const Color(0xFFF7F9FC)
                        : correct
                            ? const Color(0xFFE8F8F0)
                            : const Color(0xFFFDE8E8),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: unanswered
                          ? const Color(0xFFE0E6ED)
                          : correct
                              ? const Color(0xFF27AE60)
                              : const Color(0xFFE74C3C),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Soru ${i + 1}: ${q.question}',
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        unanswered
                            ? 'Cevap verilmedi'
                            : 'Seçiminiz: ${String.fromCharCode(65 + picked)} — '
                                '${correct ? "Doğru" : "Yanlış"}',
                        style: const TextStyle(fontSize: 13),
                      ),
                      Text(
                        'Doğru cevap: ${String.fromCharCode(65 + q.correctIndex)}) '
                        '${q.options[q.correctIndex]}',
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      if (q.feedback.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(q.feedback, style: const TextStyle(fontSize: 12, height: 1.35)),
                      ],
                    ],
                  ),
                );
              }),
            ],
            const SizedBox(height: 12),
            TextButton(
              onPressed: () => Navigator.of(context).popUntil((r) => r.isFirst),
              child: const Text('Ana Sayfaya Dön'),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmailStatusBanner extends StatelessWidget {
  const _EmailStatusBanner({required this.submission, required this.email});

  final ExamSubmissionState submission;
  final String email;

  @override
  Widget build(BuildContext context) {
    final Color bg;
    final Color border;
    final Color textColor;
    final IconData icon;
    final String message;

    if (submission.emailDelivered) {
      bg = const Color(0xFFE8F8F0);
      border = const Color(0xFFA9DFBF);
      textColor = const Color(0xFF1E8449);
      icon = Icons.mark_email_read_outlined;
      message = 'Sınav sonucunuz $email adresine gönderildi.';
    } else if (submission.saved && submission.emailSent == null) {
      bg = const Color(0xFFEEF6FF);
      border = const Color(0xFFC7DDF8);
      textColor = AppColors.primary;
      icon = Icons.info_outline;
      message = 'Sonuçlar kaydedildi. E-posta durumu doğrulanamadı; gelen kutunuzu kontrol edin.';
    } else if (submission.saved && submission.emailSent == false) {
      bg = const Color(0xFFFEF9E7);
      border = const Color(0xFFF9E79F);
      textColor = const Color(0xFF7D6608);
      icon = Icons.warning_amber_outlined;
      message = 'Sonuçlar kaydedildi ancak e-posta gönderilemedi.';
    } else {
      bg = const Color(0xFFFDE8E8);
      border = const Color(0xFFF5B7B1);
      textColor = const Color(0xFFC0392B);
      icon = Icons.error_outline;
      message = submission.errorMessage ??
          'Sonuçlar sunucuya iletilemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.';
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: textColor, size: 22),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: TextStyle(fontSize: 13, color: textColor, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.value, required this.label, required this.color});

  final String value;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: color)),
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
      ],
    );
  }
}
