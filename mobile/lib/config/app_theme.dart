import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:yz_egitim_sinav/config/design_tokens.dart';

export 'design_tokens.dart' show AppColors, AppTokens;

ThemeData buildAppTheme({required Brightness brightness}) {
  final isDark = brightness == Brightness.dark;
  final bg = isDark ? AppTokens.bgDark : AppTokens.bgLight;
  final surface = isDark
      ? const Color(0xFF1A1A2E)
      : Colors.white;
  final textPrimary =
      isDark ? AppTokens.textPrimaryDark : AppTokens.textPrimaryLight;
  final textSecondary =
      isDark ? AppTokens.textSecondaryDark : AppTokens.textSecondaryLight;

  final baseText = GoogleFonts.interTextTheme(
    ThemeData(brightness: brightness).textTheme,
  ).apply(
    bodyColor: textPrimary,
    displayColor: textPrimary,
  );

  final colorScheme = ColorScheme(
    brightness: brightness,
    primary: AppTokens.primary,
    onPrimary: Colors.white,
    secondary: AppTokens.primaryEnd,
    onSecondary: Colors.white,
    surface: surface,
    onSurface: textPrimary,
    error: AppTokens.error,
    onError: Colors.white,
  );

  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    colorScheme: colorScheme,
    scaffoldBackgroundColor: bg,
    textTheme: baseText.copyWith(
      headlineLarge: baseText.headlineLarge?.copyWith(
        fontWeight: FontWeight.w900,
        fontSize: 32,
        letterSpacing: -0.03 * 32,
        height: 1.1,
        color: textPrimary,
      ),
      headlineMedium: baseText.headlineMedium?.copyWith(
        fontWeight: FontWeight.w700,
        fontSize: 26,
        letterSpacing: -0.02 * 26,
        height: 1.2,
        color: textPrimary,
      ),
      titleMedium: baseText.titleMedium?.copyWith(
        fontWeight: FontWeight.w700,
        fontSize: 16,
        color: textPrimary,
      ),
      bodyMedium: baseText.bodyMedium?.copyWith(
        fontSize: 15,
        height: 1.6,
        color: textSecondary,
      ),
      labelLarge: baseText.labelLarge?.copyWith(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: bg,
      surfaceTintColor: Colors.transparent,
      foregroundColor: textPrimary,
      iconTheme: IconThemeData(color: textPrimary),
      elevation: 0,
      centerTitle: true,
      scrolledUnderElevation: 0,
      systemOverlayStyle: isDark
          ? SystemUiOverlayStyle.light
          : SystemUiOverlayStyle.dark,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 17,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 0,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(
          horizontal: AppTokens.space6,
          vertical: AppTokens.space4,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    cardTheme: CardThemeData(
      color: surface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppTokens.radiusLg),
      ),
    ),
    dividerTheme: DividerThemeData(
      color: textSecondary.withValues(alpha: 0.2),
    ),
    snackBarTheme: SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppTokens.radiusSm),
      ),
    ),
  );
}

ThemeData get lightTheme => buildAppTheme(brightness: Brightness.light);

ThemeData get darkTheme => buildAppTheme(brightness: Brightness.dark);

/// Gradient primary button decoration (design_tokens primary → primary-end).
class AppGradientButton extends StatelessWidget {
  const AppGradientButton({
    super.key,
    required this.onPressed,
    required this.label,
    this.icon,
    this.expand = true,
  });

  final VoidCallback onPressed;
  final String label;
  final IconData? icon;
  final bool expand;

  @override
  Widget build(BuildContext context) {
    final child = Row(
      mainAxisSize: expand ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (icon != null) ...[
          Icon(icon, size: 20, color: Colors.white),
          const SizedBox(width: AppTokens.space2),
        ],
        Text(label),
      ],
    );

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(AppTokens.radiusMd),
        child: Ink(
          decoration: BoxDecoration(
            gradient: AppTokens.primaryGradient,
            borderRadius: BorderRadius.circular(AppTokens.radiusMd),
            boxShadow: AppTokens.shadowGlow,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: AppTokens.space6,
            vertical: AppTokens.space4,
          ),
          child: expand
              ? Center(child: child)
              : Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  child: child,
                ),
        ),
      ),
    );
  }
}

/// Standard inner page: mesh + visible back + title.
class AppPageScaffold extends StatelessWidget {
  const AppPageScaffold({
    super.key,
    required this.title,
    required this.body,
    this.actions,
  });

  final String title;
  final Widget body;
  final List<Widget>? actions;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      extendBodyBehindAppBar: false,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          tooltip: 'Geri',
          onPressed: () => Navigator.of(context).maybePop(),
        ),
        title: Text(title),
        actions: actions,
      ),
      body: AppMeshBackground(
        child: SafeArea(
          top: false,
          child: body,
        ),
      ),
    );
  }
}

/// Screen background mesh gradient per design_tokens.
class AppMeshBackground extends StatelessWidget {
  const AppMeshBackground({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: isDark
            ? AppTokens.heroGradientDark
            : AppTokens.heroGradientLight,
      ),
      child: child,
    );
  }
}
