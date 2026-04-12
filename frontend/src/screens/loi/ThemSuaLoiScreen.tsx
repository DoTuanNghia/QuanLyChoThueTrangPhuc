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
        Alert.alert('Thành công', 'Cập nhật lỗi thành công!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        await loiApi.them(dto);
        Alert.alert('Thành công', 'Thêm lỗi mới thành công!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F5F6FA' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>{existing ? '✏️' : '➕'}</Text>
            </View>
            <Text style={styles.cardTitle}>
              {existing ? 'Chỉnh sửa thông tin lỗi' : 'Thêm lỗi hỏng mới'}
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tên lỗi <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={tenLoi}
              onChangeText={setTenLoi}
              placeholder="VD: Rách nhẹ, Mất nút, Ố bẩn..."
              placeholderTextColor="#B0B7C3"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mức phạt (VNĐ) <Text style={styles.required}>*</Text></Text>
            <View style={styles.priceRow}>
              <TextInput
                style={styles.priceInput}
                value={mucPhat}
                onChangeText={setMucPhat}
                keyboardType="numeric"
                placeholder="50000"
                placeholderTextColor="#B0B7C3"
              />
              <View style={styles.currencyBox}>
                <Text style={styles.currencyText}>VNĐ</Text>
              </View>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              value={moTa}
              onChangeText={setMoTa}
              multiline numberOfLines={3}
              placeholder="Mô tả chi tiết về lỗi này..."
              placeholderTextColor="#B0B7C3"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.6 }]}
          onPress={handleLuu}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <Text style={styles.saveBtnText}>💾  Lưu {existing ? 'thay đổi' : 'lỗi mới'}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 16, gap: 16, paddingBottom: 40 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20,
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#F0F1F5',
  },
  headerIcon: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#EEF0FB',
    alignItems: 'center', justifyContent: 'center',
  },
  headerIconText: { fontSize: 20 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1B2A4A', flex: 1 },

  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#5A6478', marginBottom: 8 },
  required: { color: '#E53935' },
  input: {
    borderWidth: 1.5, borderColor: '#E8EAF0', borderRadius: 12,
    padding: 14, fontSize: 15, color: '#1B2A4A', backgroundColor: '#FAFBFC', fontWeight: '500',
  },
  inputMulti: { height: 90, textAlignVertical: 'top' },

  priceRow: {
    flexDirection: 'row', borderWidth: 1.5, borderColor: '#E8EAF0',
    borderRadius: 12, overflow: 'hidden', backgroundColor: '#FAFBFC',
  },
  priceInput: { flex: 1, padding: 14, fontSize: 15, color: '#1B2A4A', fontWeight: '600' },
  currencyBox: { backgroundColor: '#EEF0FB', paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  currencyText: { color: '#5B6FE6', fontWeight: '700', fontSize: 13 },

  saveBtn: {
    backgroundColor: '#5B6FE6', padding: 16, borderRadius: 14, alignItems: 'center',
    shadowColor: '#5B6FE6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
