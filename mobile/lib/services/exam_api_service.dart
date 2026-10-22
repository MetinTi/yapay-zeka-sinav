import 'dart:convert';
import 'dart:math';

import 'package:http/http.dart' as http;
import 'package:yz_egitim_sinav/config/exam_api_config.dart';

class ExamSubmissionState {
  const ExamSubmissionState({
    required this.saved,
    this.emailSent,
    this.errorMessage,
  });

  final bool saved;
  final bool? emailSent;
  final String? errorMessage;

  bool get emailDelivered => emailSent == true;
}

class ExamApiService {
  ExamApiService._();
  static final ExamApiService instance = ExamApiService._();

  static const _timeout = Duration(seconds: 15);

  String _newSubmissionId() {
    final n = Random().nextInt(999999);
    return 'sub_${DateTime.now().millisecondsSinceEpoch}_$n';
  }

  Future<ExamSubmissionState> submitResult({
    required String name,
    required String email,
    required int score,
    required int correct,
    required int wrong,
    required int empty,
    required String time,
  }) async {
    final payload = {
      'submissionId': _newSubmissionId(),
      'name': name.trim(),
      'email': email.trim().toLowerCase(),
      'score': score,
      'correct': correct,
      'wrong': wrong,
      'empty': empty,
      'time': time,
    };

    final getResult = await _submitViaGet(payload);
    if (getResult.saved) return getResult;

    final postResult = await _submitViaPost(payload);
    if (postResult.saved) return postResult;

    return ExamSubmissionState(
      saved: false,
      emailSent: false,
      errorMessage: getResult.errorMessage ?? postResult.errorMessage ?? 'Bağlantı hatası',
    );
  }

  Future<ExamSubmissionState> _submitViaGet(Map<String, dynamic> payload) async {
    try {
      final data = jsonEncode(payload);
      final uri = Uri.parse(examScriptUrl).replace(
        queryParameters: {'action': 'submit', 'data': data},
      );
      final response = await http.get(uri).timeout(_timeout);
      if (response.statusCode != 200) {
        return ExamSubmissionState(
          saved: false,
          emailSent: false,
          errorMessage: 'Sunucu yanıtı: ${response.statusCode}',
        );
      }
      return _parseResponse(response.body);
    } catch (e) {
      return ExamSubmissionState(
        saved: false,
        emailSent: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<ExamSubmissionState> _submitViaPost(Map<String, dynamic> payload) async {
    try {
      final response = await http
          .post(
            Uri.parse(examScriptUrl),
            body: {'data': jsonEncode(payload)},
          )
          .timeout(_timeout);
      if (response.statusCode != 200) {
        return ExamSubmissionState(
          saved: false,
          emailSent: false,
          errorMessage: 'POST yanıtı: ${response.statusCode}',
        );
      }
      return _parseResponse(response.body);
    } catch (e) {
      return ExamSubmissionState(
        saved: false,
        emailSent: false,
        errorMessage: e.toString(),
      );
    }
  }

  ExamSubmissionState _parseResponse(String body) {
    try {
      final json = jsonDecode(body) as Map<String, dynamic>;
      if (json['status'] == 'ok') {
        return ExamSubmissionState(
          saved: true,
          emailSent: json['emailSent'] as bool?,
        );
      }
      return ExamSubmissionState(
        saved: false,
        emailSent: false,
        errorMessage: json['message']?.toString() ?? 'Gönderim başarısız',
      );
    } catch (_) {
      return const ExamSubmissionState(
        saved: true,
        emailSent: null,
      );
    }
  }
}
