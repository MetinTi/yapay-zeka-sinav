import 'package:flutter/material.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';
import 'package:yz_egitim_sinav/models/exam_question.dart';
import 'package:yz_egitim_sinav/screens/exam/exam_screen.dart';
import 'package:yz_egitim_sinav/services/exam_repository.dart';

class ExamStartScreen extends StatefulWidget {
  const ExamStartScreen({super.key});

  @override
  State<ExamStartScreen> createState() => _ExamStartScreenState();
}

class _ExamStartScreenState extends State<ExamStartScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  ExamPool? _pool;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPool();
  }

  Future<void> _loadPool() async {
    final pool = await ExamRepository.instance.loadPool();
    if (mounted) {
      setState(() {
        _pool = pool;
        _loading = false;
      });
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _startExam() {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    if (name.isEmpty) {
      _showError('Lütfen adınızı ve soyadınızı girin');
      return;
    }
    if (!_isValidEmail(email)) {
      _showError('Lütfen geçerli bir e-posta adresi girin');
      return;
    }
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => ExamScreen(participantName: name, participantEmail: email),
      ),
    );
  }

  bool _isValidEmail(String email) {
    return RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(email);
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final pool = _pool;
    return Scaffold(
      appBar: AppBar(title: const Text('Değerlendirme Sınavı')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Sınava Hoş Geldiniz',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Eğitmen: Metin Tiryaki',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppColors.textMuted),
                  ),
                  const SizedBox(height: 24),
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Ad Soyad *',
                      border: OutlineInputBorder(),
                    ),
                    textCapitalization: TextCapitalization.words,
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: 'E-posta *',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.emailAddress,
                    autocorrect: false,
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF9E7),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFF9E79F)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.mail_outline, color: Color(0xFF7D6608), size: 20),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Sınav sonuçlarınız e-posta adresinize gönderilecektir.',
                            style: TextStyle(fontSize: 13, color: Color(0xFF7D6608), height: 1.35),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  _InfoGrid(
                    poolSize: pool?.poolSize ?? 111,
                    questionCount: pool?.examQuestionCount ?? 20,
                    minutes: pool?.durationMinutes ?? 45,
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _startExam,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text('Sınava Başla', style: TextStyle(fontSize: 16)),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}

class _InfoGrid extends StatelessWidget {
  const _InfoGrid({
    required this.poolSize,
    required this.questionCount,
    required this.minutes,
  });

  final int poolSize;
  final int questionCount;
  final int minutes;

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 10,
      crossAxisSpacing: 10,
      childAspectRatio: 1.6,
      children: [
        _InfoTile(icon: Icons.quiz_outlined, title: '$questionCount Soru', subtitle: '$poolSize havuzdan'),
        _InfoTile(icon: Icons.timer_outlined, title: '$minutes Dakika', subtitle: 'Geri sayım'),
        _InfoTile(icon: Icons.star_outline, title: '100 Puan', subtitle: 'Zorluk katsayılı'),
        _InfoTile(icon: Icons.shuffle, title: 'Rastgele', subtitle: 'Her sınav farklı'),
      ],
    );
  }
}

class _InfoTile extends StatelessWidget {
  const _InfoTile({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF7F9FC),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE0E6ED)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppColors.primary, size: 22),
          const Spacer(),
          Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
          Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
        ],
      ),
    );
  }
}
