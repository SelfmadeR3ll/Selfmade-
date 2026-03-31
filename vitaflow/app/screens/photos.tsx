import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Card } from '../../components/Card';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

interface Photo { uri: string; date: string; }

export default function PhotosScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'VitaFlow needs photo library access to save progress photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (!result.canceled && result.assets[0]) {
      const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setPhotos((prev) => [{ uri: result.assets[0].uri, date }, ...prev]);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Progress Photos</Text>
          <TouchableOpacity onPress={handleUpload} style={styles.addBtn}>
            <Ionicons name="add" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {photos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📸</Text>
            <Text style={styles.emptyTitle}>Track Your Transformation</Text>
            <Text style={styles.emptyDesc}>
              Take monthly progress photos to see your transformation over time. Photos are stored privately on your device and optionally in your secure cloud storage.
            </Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
              <Ionicons name="camera-outline" size={20} color={Colors.primary} />
              <Text style={styles.uploadBtnText}>Add Your First Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Card style={styles.privacyNote}>
              <Ionicons name="lock-closed-outline" size={16} color={Colors.primary} />
              <Text style={styles.privacyText}>
                Photos are private and stored securely. Only you can see them.
              </Text>
            </Card>

            <View style={styles.photoGrid}>
              {photos.map((photo, i) => (
                <View key={i} style={styles.photoItem}>
                  <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                  <Text style={styles.photoDate}>{photo.date}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.addPhotoCard} onPress={handleUpload}>
                <Ionicons name="add-circle-outline" size={32} color={Colors.primary} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.md, gap: Spacing.sm },
  headerTitle: { flex: 1, fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: `${Colors.primary}18`, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', gap: Spacing.md, paddingTop: Spacing.xxl },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  emptyDesc: { color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, paddingHorizontal: Spacing.xl },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: `${Colors.primary}18`, borderRadius: Radius.lg, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderWidth: 1, borderColor: `${Colors.primary}30` },
  uploadBtnText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.md },
  privacyNote: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  privacyText: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.sm },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  photoItem: { width: '47%', gap: 4 },
  photoImage: { width: '100%', aspectRatio: 3 / 4, borderRadius: Radius.lg },
  photoDate: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  addPhotoCard: { width: '47%', aspectRatio: 3 / 4, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  addPhotoText: { color: Colors.textMuted, fontSize: FontSize.sm },
});
