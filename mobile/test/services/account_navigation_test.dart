import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yz_egitim_sinav/screens/auth/auth_gate.dart';

void main() {
  testWidgets(
    'system back pops account route; switching UID removes pushed routes',
    (tester) async {
      var uid = 'A';
      late StateSetter update;
      await tester.pumpWidget(
        MaterialApp(
          home: StatefulBuilder(
            builder: (context, setState) {
              update = setState;
              return AccountNavigator(
                key: ValueKey(uid),
                child: Builder(
                  builder: (context) => Scaffold(
                    body: TextButton(
                      onPressed: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) =>
                              const Scaffold(body: Text('Private profile')),
                        ),
                      ),
                      child: Text('Home $uid'),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.text('Home A'));
      await tester.pumpAndSettle();
      expect(find.text('Private profile'), findsOneWidget);
      await tester.binding.handlePopRoute();
      await tester.pumpAndSettle();
      expect(find.text('Private profile'), findsNothing);
      expect(find.text('Home A'), findsOneWidget);
      await tester.tap(find.text('Home A'));
      await tester.pumpAndSettle();
      update(() => uid = 'B');
      await tester.pumpAndSettle();
      expect(find.text('Private profile'), findsNothing);
      expect(find.text('Home B'), findsOneWidget);
    },
  );
}
