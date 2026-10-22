import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';

class LegalDocumentScreen extends StatelessWidget {
  const LegalDocumentScreen({
    super.key,
    required this.title,
    required this.assetPath,
  });

  final String title;
  final String assetPath;

  @override
  Widget build(BuildContext context) {
    return AppPageScaffold(
      title: title,
      body: FutureBuilder<String>(
        future: rootBundle.loadString(assetPath),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError || !snapshot.hasData) {
            return const Center(child: Text('Belge yüklenemedi.'));
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(
              AppTokens.space5,
              AppTokens.space2,
              AppTokens.space5,
              AppTokens.space7,
            ),
            child: Text(
              snapshot.data!,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontSize: 14,
                    height: 1.55,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
            ),
          );
        },
      ),
    );
  }
}
