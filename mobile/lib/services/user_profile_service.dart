import 'dart:io';

import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:yz_egitim_sinav/services/account_local_data.dart';

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
  UserProfileService({
    AccountLocalData? accountData,
    Future<Directory> Function()? documentsDirectory,
    Future<XFile?> Function()? pickAvatar,
  }) : _accountData = accountData ?? AccountLocalData.instance,
       _documentsDirectory =
           documentsDirectory ?? getApplicationDocumentsDirectory,
       _pickAvatar =
           pickAvatar ??
           (() => ImagePicker().pickImage(
             source: ImageSource.gallery,
             maxWidth: 512,
             maxHeight: 512,
             imageQuality: 85,
           ));
  static final UserProfileService instance = UserProfileService();
  final AccountLocalData _accountData;

  static const _keyFirstName = 'profile_first_name';
  static const _keyLastName = 'profile_last_name';
  static const _keyAvatarPath = 'profile_avatar_path';

  final Future<Directory> Function() _documentsDirectory;
  final Future<XFile?> Function() _pickAvatar;

  Future<UserProfileData> load() async {
    final uid = _accountData.currentUid;
    if (uid == null) return const UserProfileData();
    final prefs = await SharedPreferences.getInstance();
    final avatarPath = prefs.getString(
      AccountLocalData.key(uid, _keyAvatarPath),
    );
    if (avatarPath != null && !File(avatarPath).existsSync()) {
      await prefs.remove(AccountLocalData.key(uid, _keyAvatarPath));
    }
    return UserProfileData(
      firstName:
          prefs.getString(AccountLocalData.key(uid, _keyFirstName)) ?? '',
      lastName: prefs.getString(AccountLocalData.key(uid, _keyLastName)) ?? '',
      avatarPath: avatarPath != null && File(avatarPath).existsSync()
          ? avatarPath
          : null,
    );
  }

  Future<void> saveNames({
    required String firstName,
    required String lastName,
  }) async {
    final uid = _accountData.requireUid();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      AccountLocalData.key(uid, _keyFirstName),
      firstName.trim(),
    );
    await prefs.setString(
      AccountLocalData.key(uid, _keyLastName),
      lastName.trim(),
    );
  }

  Future<String?> pickAndSaveAvatar() async {
    final uid = _accountData.requireUid();
    final file = await _pickAvatar();
    if (file == null) return null;

    final dir = await _documentsDirectory();
    final dest = File(
      '${dir.path}/profile_avatar_${AccountLocalData.ownerToken(uid)}.jpg',
    );
    await File(file.path).copy(dest.path);

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AccountLocalData.key(uid, _keyAvatarPath), dest.path);
    return dest.path;
  }

  Future<void> clearLocal(String uid) => _accountData.clear(uid);
}
