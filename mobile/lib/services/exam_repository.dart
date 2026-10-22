import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:yz_egitim_sinav/models/exam_question.dart';

class ExamRepository {
  ExamRepository._();
  static final ExamRepository instance = ExamRepository._();

  static const _assetPath = 'assets/data/exam_pool.json';
  ExamPool? _cached;

  Future<ExamPool> loadPool() async {
    if (_cached != null) return _cached!;
    final raw = await rootBundle.loadString(_assetPath);
    final json = jsonDecode(raw) as Map<String, dynamic>;
    _cached = ExamPool.fromJson(json);
    return _cached!;
  }
}
