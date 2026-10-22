import 'dart:io';

import 'package:flutter/material.dart';
import 'package:yz_egitim_sinav/config/app_bootstrap.dart';
import 'package:yz_egitim_sinav/config/app_theme.dart';
import 'package:yz_egitim_sinav/services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _busy = false;
  bool _isRegister = false;
  bool _obscurePassword = true;
  String? _error;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _run(Future<void> Function() action) async {
    if (_busy) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await action();
    } on AuthException catch (e) {
      setState(() => _error = e.message);
    } catch (e) {
      setState(() => _error = 'Giriş başarısız. Lütfen tekrar deneyin.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _submitEmail() async {
    if (!_formKey.currentState!.validate()) return;
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    await _run(() async {
      if (_isRegister) {
        await AuthService.instance.signUpWithEmail(
          email: email,
          password: password,
        );
      } else {
        await AuthService.instance.signInWithEmail(
          email: email,
          password: password,
        );
      }
    });
  }

  Future<void> _resetPassword() async {
    final email = _emailController.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      setState(() => _error = 'Önce geçerli bir e-posta adresi girin.');
      return;
    }
    await _run(() async {
      await AuthService.instance.sendPasswordResetEmail(email);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Sıfırlama bağlantısı $email adresine gönderildi.'),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final firebaseReady = AppBootstrap.firebaseReady;
    final canSubmit = firebaseReady && !_busy;

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: AppMeshBackground(
        child: SafeArea(
          bottom: false,
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(
              AppTokens.space5,
              AppTokens.space2,
              AppTokens.space5,
              AppTokens.space6,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(AppTokens.radiusLg),
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: Image.asset(
                      'assets/images/login_hero.png',
                      fit: BoxFit.cover,
                      alignment: Alignment.center,
                    ),
                  ),
                ),
                const SizedBox(height: AppTokens.space5),
                ShaderMask(
                  shaderCallback: (bounds) =>
                      AppTokens.primaryGradient.createShader(bounds),
                  child: Text(
                    'Yapay Zeka Eğitimi',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          height: 1.15,
                          letterSpacing: -0.5,
                        ),
                  ),
                ),
                const SizedBox(height: AppTokens.space2),
                Text(
                  'Metin TİRYAKİ',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.8,
                        color: AppTokens.scale700,
                      ),
                ),
                const SizedBox(height: AppTokens.space4),
                Text(
                  'Ücretsiz eğitim ve sınav.\nDevam etmek için giriş yapın.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontSize: 16,
                      ),
                ),
                const SizedBox(height: AppTokens.space5),
                if (!firebaseReady) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(AppTokens.space4),
                    decoration: BoxDecoration(
                      color: AppTokens.warning.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(AppTokens.radiusMd),
                      border: Border.all(
                        color: AppTokens.warning.withValues(alpha: 0.4),
                      ),
                    ),
                    child: const Text(
                      'Firebase henüz bağlanmadı. Geliştirici: '
                      'docs/FIREBASE_AUTH_ADS_SETUP.md adımlarını uygulayın.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 13, height: 1.45),
                    ),
                  ),
                  const SizedBox(height: AppTokens.space4),
                ],
                if (Platform.isIOS) ...[
                  _SocialButton(
                    label: 'Apple İle Devam Et',
                    icon: Icons.apple,
                    onPressed: canSubmit
                        ? () => _run(() async {
                              await AuthService.instance.signInWithApple();
                            })
                        : null,
                  ),
                  const SizedBox(height: AppTokens.space3),
                ],
                _SocialButton(
                  label: 'Google İle Devam Et',
                  icon: Icons.g_mobiledata_rounded,
                  onPressed: canSubmit
                      ? () => _run(() async {
                            await AuthService.instance.signInWithGoogle();
                          })
                      : null,
                ),
                const SizedBox(height: AppTokens.space4),
                _orDivider(context),
                const SizedBox(height: AppTokens.space4),
                Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      TextFormField(
                        controller: _emailController,
                        enabled: canSubmit,
                        keyboardType: TextInputType.emailAddress,
                        autocorrect: false,
                        textInputAction: TextInputAction.next,
                        decoration: _fieldDecoration('E-posta'),
                        validator: (v) {
                          final value = v?.trim() ?? '';
                          if (value.isEmpty) return 'E-posta gerekli.';
                          if (!value.contains('@')) {
                            return 'Geçerli bir e-posta girin.';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppTokens.space3),
                      TextFormField(
                        controller: _passwordController,
                        enabled: canSubmit,
                        obscureText: _obscurePassword,
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) {
                          if (canSubmit) _submitEmail();
                        },
                        decoration: _fieldDecoration('Şifre').copyWith(
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                            ),
                            onPressed: () => setState(
                              () => _obscurePassword = !_obscurePassword,
                            ),
                          ),
                        ),
                        validator: (v) {
                          if (v == null || v.isEmpty) {
                            return 'Şifre gerekli.';
                          }
                          if (v.length < 6) {
                            return 'Şifre en az 6 karakter olmalı.';
                          }
                          return null;
                        },
                      ),
                      if (!_isRegister) ...[
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: canSubmit ? _resetPassword : null,
                            child: const Text('Şifremi Unuttum'),
                          ),
                        ),
                      ] else
                        const SizedBox(height: AppTokens.space2),
                    ],
                  ),
                ),
                if (_error != null) ...[
                  const SizedBox(height: AppTokens.space2),
                  Text(
                    _error!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: AppTokens.error,
                      fontSize: 14,
                    ),
                  ),
                ],
                const SizedBox(height: AppTokens.space3),
                AppGradientButton(
                  label: _isRegister ? 'Hesap Oluştur' : 'E-posta İle Giriş Yap',
                  icon: Icons.email_outlined,
                  onPressed: canSubmit ? _submitEmail : () {},
                ),
                const SizedBox(height: AppTokens.space2),
                TextButton(
                  onPressed: canSubmit
                      ? () => setState(() {
                            _isRegister = !_isRegister;
                            _error = null;
                          })
                      : null,
                  child: Text(
                    _isRegister
                        ? 'Zaten hesabınız var mı? Giriş yapın'
                        : 'Hesabınız yok mu? Kayıt olun',
                  ),
                ),
                const SizedBox(height: AppTokens.space5),
                Text(
                  'Giriş yaparak gizlilik politikasını kabul etmiş olursunuz. '
                  'Uygulama ücretsizdir; modül sonlarında reklam gösterilebilir.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontSize: 11,
                        height: 1.4,
                      ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _orDivider(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Divider(
            color: AppTokens.scale700.withValues(alpha: 0.2),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppTokens.space3),
          child: Text(
            'veya',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontSize: 13,
                ),
          ),
        ),
        Expanded(
          child: Divider(
            color: AppTokens.scale700.withValues(alpha: 0.2),
          ),
        ),
      ],
    );
  }

  InputDecoration _fieldDecoration(String label) {
    return InputDecoration(
      labelText: label,
      filled: true,
      fillColor: Theme.of(context).colorScheme.surface,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppTokens.radiusMd),
        borderSide: BorderSide(
          color: AppTokens.scale700.withValues(alpha: 0.2),
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppTokens.radiusMd),
        borderSide: BorderSide(
          color: AppTokens.scale700.withValues(alpha: 0.2),
        ),
      ),
    );
  }
}

class _SocialButton extends StatelessWidget {
  const _SocialButton({
    required this.label,
    required this.icon,
    required this.onPressed,
  });

  final String label;
  final IconData icon;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final enabled = onPressed != null;
    return Opacity(
      opacity: enabled ? 1 : 0.45,
      child: Material(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(AppTokens.radiusMd),
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(AppTokens.radiusMd),
          child: Ink(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(AppTokens.radiusMd),
              border: Border.all(
                color: AppTokens.primary.withValues(alpha: 0.15),
              ),
              boxShadow: AppTokens.shadowSm(Theme.of(context).brightness),
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: AppTokens.space5,
              vertical: 14,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, size: 26, color: AppTokens.textPrimaryLight),
                const SizedBox(width: AppTokens.space3),
                Text(
                  label,
                  style: Theme.of(context).textTheme.labelLarge,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
