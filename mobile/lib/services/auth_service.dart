import 'dart:io';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import 'package:yz_egitim_sinav/config/app_bootstrap.dart';

/// Google, Apple ve e-posta/şifre ile giriş (Firebase Auth).
class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  FirebaseAuth? get _auth =>
      AppBootstrap.firebaseReady ? FirebaseAuth.instance : null;

  Stream<User?> get authStateChanges {
    final auth = _auth;
    if (auth == null) {
      return const Stream<User?>.empty();
    }
    return auth.authStateChanges();
  }

  User? get currentUser => _auth?.currentUser;

  bool get isSignedIn => currentUser != null;

  Future<void> warmUp() async {
    if (!AppBootstrap.firebaseReady) return;
  }

  Future<UserCredential> signInWithGoogle() async {
    _requireFirebase();
    final googleUser = await GoogleSignIn().signIn();
    if (googleUser == null) {
      throw AuthException('Google girişi iptal edildi.');
    }
    final googleAuth = await googleUser.authentication;
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );
    return _auth!.signInWithCredential(credential);
  }

  Future<UserCredential> signInWithEmail({
    required String email,
    required String password,
  }) async {
    _requireFirebase();
    try {
      return await _auth!.signInWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      throw AuthException(_messageForFirebaseAuth(e));
    }
  }

  Future<UserCredential> signUpWithEmail({
    required String email,
    required String password,
  }) async {
    _requireFirebase();
    try {
      return await _auth!.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      throw AuthException(_messageForFirebaseAuth(e));
    }
  }

  Future<void> sendPasswordResetEmail(String email) async {
    _requireFirebase();
    try {
      await _auth!.sendPasswordResetEmail(email: email.trim());
    } on FirebaseAuthException catch (e) {
      throw AuthException(_messageForFirebaseAuth(e));
    }
  }

  Future<UserCredential> signInWithApple() async {
    _requireFirebase();
    if (!Platform.isIOS && !Platform.isMacOS) {
      throw AuthException(
        'Apple ile giriş yalnızca iOS/macOS üzerinde kullanılabilir.',
      );
    }

    final appleCredential = await SignInWithApple.getAppleIDCredential(
      scopes: [
        AppleIDAuthorizationScopes.email,
        AppleIDAuthorizationScopes.fullName,
      ],
    );

    final oauth = OAuthProvider('apple.com').credential(
      idToken: appleCredential.identityToken,
      accessToken: appleCredential.authorizationCode,
    );
    return _auth!.signInWithCredential(oauth);
  }

  Future<void> signOut() async {
    _requireFirebase();
    await Future.wait([
      _auth!.signOut(),
      GoogleSignIn().signOut(),
    ]);
  }

  /// Firebase Auth hesabını kalıcı siler. Son giriş gerekirse [AuthException].
  Future<void> deleteAccount() async {
    _requireFirebase();
    final user = _auth!.currentUser;
    if (user == null) {
      throw AuthException('Aktif oturum bulunamadı.');
    }
    try {
      await user.delete();
    } on FirebaseAuthException catch (e) {
      if (e.code == 'requires-recent-login') {
        throw AuthException(
          'Güvenlik için yeniden giriş yapın, ardından hesabı silin.',
        );
      }
      throw AuthException(
        e.message ?? 'Hesap silinemedi.',
      );
    }
    await GoogleSignIn().signOut();
  }

  void _requireFirebase() {
    if (!AppBootstrap.firebaseReady || _auth == null) {
      throw AuthException(
        'Firebase Auth henüz yapılandırılmadı. '
        'docs/FIREBASE_AUTH_ADS_SETUP.md dosyasına bakın.',
      );
    }
  }

  static String _messageForFirebaseAuth(FirebaseAuthException e) {
    switch (e.code) {
      case 'invalid-email':
        return 'Geçersiz e-posta adresi.';
      case 'user-disabled':
        return 'Bu hesap devre dışı bırakılmış.';
      case 'user-not-found':
      case 'invalid-credential':
        return 'E-posta veya şifre hatalı.';
      case 'wrong-password':
        return 'Hatalı şifre.';
      case 'email-already-in-use':
        return 'Bu e-posta adresi zaten kayıtlı.';
      case 'weak-password':
        return 'Şifre en az 6 karakter olmalıdır.';
      case 'too-many-requests':
        return 'Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin.';
      case 'operation-not-allowed':
        return 'E-posta girişi Firebase Console\'da etkin değil.';
      default:
        return e.message ?? 'Kimlik doğrulama hatası.';
    }
  }
}

class AuthException implements Exception {
  AuthException(this.message);
  final String message;

  @override
  String toString() => message;
}
