import 'package:flutter/material.dart';

/// Flutter mirror of /design_tokens.md — single source for UI constants.
///
/// Brand scale (left → right): navy → teal → cyan (user palette).
abstract final class AppTokens {
  // Brand scale
  static const scale900 = Color(0xFF1B4372);
  static const scale700 = Color(0xFF307898);
  static const scale500 = Color(0xFF43A9B8);
  static const scale300 = Color(0xFF5EE2E6);
  static const scale100 = Color(0xFFD6F3F5);
  static const scale50 = Color(0xFFF0FCFD);

  // Brand — buttons & accents use dark → mid scale
  static const primary = scale900;
  static const primaryEnd = scale700;
  static const accent = Color(0xFFFF6B6B);
  static const accentSecondary = Color(0xFFFFB347);

  // Backgrounds — lightest scale for screens
  static const bgDark = Color(0xFF0D1A24);
  static const bgLight = scale50;
  static const surfaceDark = Color(0x14FFFFFF);
  static const surfaceLight = Color(0xB8FFFFFF);

  // Text — light mode
  static const textPrimaryLight = Color(0xFF0D0D1A);
  static const textSecondaryLight = Color(0x8C0D0D1A);

  // Text — dark mode
  static const textPrimaryDark = Color(0xFFFFFFFF);
  static const textSecondaryDark = Color(0x8CFFFFFF);

  // Semantic
  static const success = Color(0xFF22C55E);
  static const warning = Color(0xFFF59E0B);
  static const error = Color(0xFFEF4444);
  static const info = Color(0xFF3B82F6);

  // Radius
  static const radiusXs = 8.0;
  static const radiusSm = 12.0;
  static const radiusMd = 16.0;
  static const radiusLg = 24.0;
  static const radiusXl = 32.0;
  static const radiusFull = 999.0;

  // Spacing (8px base)
  static const space1 = 4.0;
  static const space2 = 8.0;
  static const space3 = 12.0;
  static const space4 = 16.0;
  static const space5 = 24.0;
  static const space6 = 32.0;
  static const space7 = 48.0;
  static const space8 = 64.0;

  /// Buttons, nav selection, card headers — dark end of scale.
  static const primaryGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [scale900, scale700],
  );

  /// Home & page mesh — lightest end of scale.
  static const heroGradientLight = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [scale50, scale100, Color(0xFFFAFEFE)],
    stops: [0.0, 0.5, 1.0],
  );

  static const heroGradientDark = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF0F2438), Color(0xFF163A52), bgDark],
    stops: [0.0, 0.5, 1.0],
  );

  static List<BoxShadow> shadowSm(Brightness brightness) => [
        BoxShadow(
          color: Colors.black.withValues(
            alpha: brightness == Brightness.dark ? 0.35 : 0.12,
          ),
          blurRadius: 12,
          offset: const Offset(0, 4),
        ),
      ];

  static List<BoxShadow> shadowMd(Brightness brightness) => [
        BoxShadow(
          color: Colors.black.withValues(
            alpha: brightness == Brightness.dark ? 0.45 : 0.18,
          ),
          blurRadius: 24,
          offset: const Offset(0, 8),
        ),
      ];

  static List<BoxShadow> shadowGlow = [
    BoxShadow(
      color: primary.withValues(alpha: 0.35),
      blurRadius: 40,
      spreadRadius: -4,
    ),
  ];
}

/// Back-compat alias used across existing screens.
abstract final class AppColors {
  static const primary = AppTokens.primary;
  static const primaryLight = AppTokens.primaryEnd;
  static const background = AppTokens.bgLight;
  static const screenMuted = AppTokens.bgLight;
  static const surface = Colors.white;
  static const textPrimary = AppTokens.textPrimaryLight;
  static const textMuted = AppTokens.textSecondaryLight;
  static const searchFill = Color(0xFFDAEEF1);
  static const success = AppTokens.success;
  static const cardBlue = AppTokens.scale700;
  static const cardBlueDark = AppTokens.scale900;
}
