import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { loiApi } from '../../api/loiApi';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ThemSuaLoi'>;
  route: RouteProp<RootStackParamList, 'ThemSuaLoi'>;
};

export default function ThemSuaLoiScreen({ navigation, route }: Props) {
  const existing = route.params?.loi;
  const [tenLoi, setTenLoi] = useState(existing?.tenLoi ?? '');
  const [mucPhat, setMucPhat] = useState(existing?.mucPhat?.toString() ?? '');
  const [moTa, setMoTa] = useState(existing?.moTa ?? '');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!tenLoi.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập tên lỗi'); return false; }
    if (!mucPhat || isNaN(Number(mucPhat)) || Number(mucPhat) < 0) {
      Alert.alert('Lỗi', 'Mức phạt phải là số hợp lệ (>= 0)'); return false;
    }
    return true;
  };

  const handleLuu = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const dto = { tenLoi: tenLoi.trim(), mucPhat: Number(mucPhat), moTa: moTa.trim() };
      if (existing) {
        await loiApi.sua(existing.id, dto);
        Alert.alert('Thành công', 'Cập nhật lỗi thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await loiApi.them(dto);
        Alert.alert('Thành công', 'Thêm lỗi mới thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Tên lỗi *</Text>
          <TextInput
            style={styles.input}
            value={tenLoi}
            onChangeText={setTenLoi}
            placeholder="VD: Rách nhẹ, Mất nút..."
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Mức phạt (VNĐ) *</Text>
          <TextInput
            style={styles.input}
            value={mucPhat}
            onChangeText={setMucPhat}
            keyboardType="numeric"
            placeholder="VD: 50000"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Mô tả</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={moTa}
            onChangeText={setMoTa}
            multiline
            numberOfLines={3}
            placeholder="Mô tả chi tiết về lỗi này..."
            placeholderTextColor="#aaa"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleLuu}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>💾 Lưu</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 10,
    padding: 12, fontSize: 15, color: '#1a1a2e', backgroundColor: '#fafafa',
  },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: '#e94560', padding: 16, borderRadius: 14,
    alignItems: 'center', marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
