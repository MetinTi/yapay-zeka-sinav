import 'package:flutter_test/flutter_test.dart';
import 'package:yz_egitim_sinav/app.dart';
import 'package:yz_egitim_sinav/screens/auth/login_screen.dart';
import 'package:yz_egitim_sinav/screens/home_screen.dart';

void main() {
  testWidgets('Firebase başlatılmadan ana sayfa yerine giriş ekranı açılır', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const YzEgitimApp());
    await tester.pumpAndSettle();

    expect(find.byType(LoginScreen), findsOneWidget);
    expect(find.byType(HomeScreen), findsNothing);
    expect(find.text('E-posta İle Giriş Yap'), findsOneWidget);
  });
}
