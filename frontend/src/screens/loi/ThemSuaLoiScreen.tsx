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

const PRESETS = [10000, 20000, 50000, 100000, 200000, 500000];

export default function ThemSuaLoiScreen({ navigation, route }: Props) {
  const existing = route.params?.loi;
  const isEdit = !!existing;

  const [tenLoi,  setTenLoi]  = useState(existing?.tenLoi  ?? '');
  const [mucPhat, setMucPhat] = useState(existing?.mucPhat?.toString() ?? '');
  const [moTa,    setMoTa]    = useState(existing?.moTa    ?? '');
  const [loading, setLoading] = useState(false);

  const fmtVND = (v: number) => v.toLocaleString('vi-VN') + 'đ';

  const validate = () => {
    if (!tenLoi.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên lỗi');
      return false;
    }
    if (!mucPhat || isNaN(Number(mucPhat)) || Number(mucPhat) < 0) {
      Alert.alert('Giá trị không hợp lệ', 'Mức phạt phải là số hợp lệ (≥ 0)');
      return false;
    }
    return true;
  };

  const handleLuu = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const dto = { tenLoi: tenLoi.trim(), mucPhat: Number(mucPhat), moTa: moTa.trim() };
      if (isEdit) {
        await loiApi.sua(existing!.id, dto);
        Alert.alert('Thành công ✅', 'Cập nhật lỗi thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await loiApi.them(dto);
        Alert.alert('Thành công ✅', 'Thêm lỗi mới thành công!', [
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
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.centerCol}>

          {/* Form header */}
          <View style={styles.formHeader}>
            <View style={[styles.headerIcon, { backgroundColor: isEdit ? '#FFF8E1' : '#EEF0FB' }]}>
              <Text style={styles.headerIconText}>{isEdit ? '✏️' : '➕'}</Text>
            </View>
            <View>
              <Text style={styles.formTitle}>
                {isEdit ? 'Chỉnh sửa lỗi hỏng' : 'Thêm lỗi hỏng mới'}
              </Text>
              <Text style={styles.formSub}>
                {isEdit
                  ? `Đang sửa: ${existing!.tenLoi}`
                  : 'Cấu hình loại lỗi và mức phạt tương ứng'}
              </Text>
            </View>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            {/* Tên lỗi */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Tên lỗi <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={tenLoi}
                onChangeText={setTenLoi}
                placeholder="VD: Rách nhẹ, Mất nút, Ố bẩn, Đứt chỉ..."
                placeholderTextColor="#B0B7C3"
              />
              <Text style={styles.hint}>Mô tả ngắn gọn về loại lỗi hỏng</Text>
            </View>

            {/* Mức phạt */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Mức phạt (VNĐ) <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.priceRow}>
                <TextInput
                  style={styles.priceInput}
                  value={mucPhat}
                  onChangeText={setMucPhat}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#B0B7C3"
                />
                <View style={styles.currencyBadge}>
                  <Text style={styles.currencyText}>VNĐ</Text>
                </View>
              </View>

              {/* Preview */}
              {mucPhat && !isNaN(Number(mucPhat)) && Number(mucPhat) > 0 && (
                <View style={styles.previewBox}>
                  <Text style={styles.previewLabel}>Hiển thị: </Text>
                  <Text style={styles.previewVal}>{fmtVND(Number(mucPhat))}</Text>
                </View>
              )}

              {/* Preset buttons */}
              <Text style={styles.presetLabel}>Chọn nhanh:</Text>
              <View style={styles.presets}>
                {PRESETS.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.presetBtn, Number(mucPhat) === p && styles.presetBtnActive]}
                    onPress={() => setMucPhat(String(p))}
                  >
                    <Text style={[styles.presetText, Number(mucPhat) === p && styles.presetTextActive]}>
                      {fmtVND(p)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Mô tả */}
            <View style={[styles.fieldGroup, { marginBottom: 0 }]}>
              <Text style={styles.label}>Mô tả chi tiết</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                value={moTa}
                onChangeText={setMoTa}
                multiline
                numberOfLines={4}
                placeholder="Mô tả chi tiết về loại lỗi, cách nhận biết, điều kiện áp dụng mức phạt..."
                placeholderTextColor="#B0B7C3"
                textAlignVertical="top"
              />
              <Text style={styles.hint}>Không bắt buộc — giúp nhân viên nhận biết lỗi dễ hơn</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>← Hủy bỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, loading && { opacity: 0.6 }]}
              onPress={handleLuu}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>
                    {isEdit ? '💾  Lưu thay đổi' : '✅  Tạo lỗi mới'}
                  </Text>
              }
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const ACCENT = '#5B6FE6';
const MAX_W  = 700;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F4F6FB' },
  scroll: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingBottom: 40 },
  centerCol: {
    width: '100%', maxWidth: MAX_W,
    paddingHorizontal: 24, paddingTop: 28,
  },

  formHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20,
  },
  headerIcon: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  headerIconText: { fontSize: 26 },
  formTitle: { fontSize: 20, fontWeight: '800', color: '#1B2A4A' },
  formSub: { fontSize: 13, color: '#8892A6', marginTop: 3 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 24, marginBottom: 16,
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
    borderWidth: 1, borderColor: '#ECEEF4',
  },

  fieldGroup: { marginBottom: 22 },
  label: { fontSize: 13, fontWeight: '700', color: '#5A6478', marginBottom: 8 },
  required: { color: '#E53935' },
  hint: { fontSize: 11, color: '#B0B7C3', marginTop: 6 },

  input: {
    borderWidth: 1.5, borderColor: '#E8EAF0', borderRadius: 12,
    padding: 14, fontSize: 15, color: '#1B2A4A',
    backgroundColor: '#FAFBFC', fontWeight: '500',
  },
  inputMulti: { minHeight: 110, textAlignVertical: 'top' },

  priceRow: {
    flexDirection: 'row', borderWidth: 1.5, borderColor: '#E8EAF0',
    borderRadius: 12, overflow: 'hidden', backgroundColor: '#FAFBFC',
  },
  priceInput: {
    flex: 1, padding: 14, fontSize: 16, color: '#1B2A4A', fontWeight: '700',
  },
  currencyBadge: {
    backgroundColor: '#EEF0FB', paddingHorizontal: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  currencyText: { color: ACCENT, fontWeight: '700', fontSize: 13 },

  previewBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 8, paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: '#E8F5E9', borderRadius: 8,
  },
  previewLabel: { fontSize: 12, color: '#00897B' },
  previewVal: { fontSize: 13, fontWeight: '800', color: '#00897B' },

  presetLabel: {
    fontSize: 11, color: '#8892A6', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginTop: 12, marginBottom: 8,
  },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetBtn: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8, borderWidth: 1.5, borderColor: '#E8EAF0',
    backgroundColor: '#F8F9FC',
  },
  presetBtnActive: { backgroundColor: '#EEF0FB', borderColor: ACCENT },
  presetText: { fontSize: 12, fontWeight: '600', color: '#8892A6' },
  presetTextActive: { color: ACCENT },

  actionRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, padding: 14, borderRadius: 13,
    borderWidth: 1.5, borderColor: '#E8EAF0', alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: { color: '#5A6478', fontWeight: '600', fontSize: 14 },
  saveBtn: {
    flex: 2, padding: 14, borderRadius: 13,
    backgroundColor: ACCENT, alignItems: 'center',
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
