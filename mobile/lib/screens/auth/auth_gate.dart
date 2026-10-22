import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:yz_egitim_sinav/config/app_bootstrap.dart';
import 'package:yz_egitim_sinav/config/design_tokens.dart';
import 'package:yz_egitim_sinav/screens/auth/login_screen.dart';
import 'package:yz_egitim_sinav/screens/home_screen.dart';
import 'package:yz_egitim_sinav/services/auth_service.dart';

/// Firebase oturumu yoksa giriş ekranı; varsa ana uygulama.
class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    if (!AppBootstrap.firebaseReady) {
      // Geliştirme: Firebase bağlanana kadar yalnızca giriş ekranı (butonlar pasif uyarılı).
      return const LoginScreen();
    }

    return StreamBuilder<User?>(
      stream: AuthService.instance.authStateChanges,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(color: AppTokens.primary),
            ),
          );
        }
        if (snapshot.data != null) {
          return AccountNavigator(
            key: ValueKey(snapshot.data!.uid),
            child: const HomeScreen(),
          );
        }
        return const LoginScreen();
      },
    );
  }
}

/// Disposes every authenticated route when its UID-keyed parent changes.
class AccountNavigator extends StatefulWidget {
  const AccountNavigator({super.key, required this.child});

  final Widget child;

  @override
  State<AccountNavigator> createState() => _AccountNavigatorState();
}

class _AccountNavigatorState extends State<AccountNavigator> {
  final _navigatorKey = GlobalKey<NavigatorState>();

  @override
  Widget build(BuildContext context) => NavigatorPopHandler<void>(
    onPopWithResult: (_) => _navigatorKey.currentState!.pop(),
    child: Navigator(
      key: _navigatorKey,
      onGenerateRoute: (_) =>
          MaterialPageRoute<void>(builder: (_) => widget.child),
    ),
  );
}
