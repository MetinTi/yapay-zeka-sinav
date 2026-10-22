import 'package:flutter/material.dart';
import 'package:yz_egitim_sinav/app.dart';
import 'package:yz_egitim_sinav/config/app_bootstrap.dart';

Future<void> main() async {
  await AppBootstrap.init();
  runApp(const YzEgitimApp());
}
