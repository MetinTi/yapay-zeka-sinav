import 'dart:io';

import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserProfileData {
  const UserProfileData({
    this.firstName = '',
    this.lastName = '',
    this.avatarPath,
  });

  final String firstName;
  final String lastName;
  final String? avatarPath;

  String get displayName {
    final full = '${firstName.trim()} ${lastName.trim()}'.trim();
    return full.isEmpty ? '' : full;
  }
}

/// Yerel profil (ad, soyad, avatar yolu) — cihazda saklanır.
class UserProfileService {
  UserProfileService._();
  static final UserProfileService instance = UserProfileService._();

  static const _keyFirstName = 'profile_first_name';
  static const _keyLastName = 'profile_last_name';
  static const _keyAvatarPath = 'profile_avatar_path';

  final ImagePicker _picker = ImagePicker();

  Future<UserProfileData> load() async {
    final prefs = await SharedPreferences.getInstance();
    final avatarPath = prefs.getString(_keyAvatarPath);
    if (avatarPath != null && !File(avatarPath).existsSync()) {
      await prefs.remove(_keyAvatarPath);
    }
    return UserProfileData(
      firstName: prefs.getString(_keyFirstName) ?? '',
      lastName: prefs.getString(_keyLastName) ?? '',
      avatarPath: avatarPath != null && File(avatarPath).existsSync()
          ? avatarPath
          : null,
    );
  }

  Future<void> saveNames({
    required String firstName,
    required String lastName,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyFirstName, firstName.trim());
    await prefs.setString(_keyLastName, lastName.trim());
  }

  Future<String?> pickAndSaveAvatar() async {
    final file = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 512,
      maxHeight: 512,
      imageQuality: 85,
    );
    if (file == null) return null;

    final dir = await getApplicationDocumentsDirectory();
    final dest = File('${dir.path}/profile_avatar.jpg');
    await File(file.path).copy(dest.path);

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyAvatarPath, dest.path);
    return dest.path;
  }

  Future<void> clearLocal() async {
    final prefs = await SharedPreferences.getInstance();
    final path = prefs.getString(_keyAvatarPath);
    if (path != null) {
      final file = File(path);
      if (file.existsSync()) {
        await file.delete();
      }
    }
    await prefs.remove(_keyFirstName);
    await prefs.remove(_keyLastName);
    await prefs.remove(_keyAvatarPath);
  }
}
