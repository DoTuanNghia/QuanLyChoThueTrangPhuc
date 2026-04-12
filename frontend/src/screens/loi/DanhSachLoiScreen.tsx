import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, SafeAreaView, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Loi } from '../../types';
import { loiApi } from '../../api/loiApi';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'DanhSachLoi'> };

export default function DanhSachLoiScreen({ navigation }: Props) {
  const [danhSach, setDanhSach] = useState<Loi[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await loiApi.layTatCa();
      setDanhSach(data);
    } catch (e: any) {
      Alert.alert('Lỗi', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => { load(); }, [load])
  );

  const handleXoa = (loi: Loi) => {
    Alert.alert('Xác nhận xóa', `Xóa lỗi "${loi.tenLoi}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive',
        onPress: async () => {
          try {
            await loiApi.xoa(loi.id);
            setDanhSach((prev) => prev.filter((x) => x.id !== loi.id));
          } catch (e: any) { Alert.alert('Lỗi', e.message); }
        },
      },
    ]);
  };

  const formatVND = (v: number) => v.toLocaleString('vi-VN') + 'đ';

  const renderItem = ({ item }: { item: Loi }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>⚠️</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.tenLoi}>{item.tenLoi}</Text>
          <Text style={styles.moTa} numberOfLines={2}>{item.moTa || 'Chưa có mô tả'}</Text>
        </View>
        <View style={styles.phatBadge}>
          <Text style={styles.phatText}>{formatVND(item.mucPhat)}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.btnSua}
          onPress={() => navigation.navigate('ThemSuaLoi', { loi: item })}
        >
          <Text style={styles.btnSuaText}>✏️ Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnXoa} onPress={() => handleXoa(item)}>
          <Text style={styles.btnXoaText}>🗑️ Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('ThemSuaLoi', {})} activeOpacity={0.7}>
        <Text style={styles.addBtnIcon}>＋</Text>
        <Text style={styles.addBtnText}>Thêm Lỗi Mới</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#5B6FE6" />
        </View>
      ) : (
        <FlatList
          data={danhSach}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#5B6FE6" />}
          ListHeaderComponent={
            danhSach.length > 0 ? (
              <Text style={styles.listTitle}>{danhSach.length} loại lỗi đã cấu hình</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Chưa có lỗi nào</Text>
              <Text style={styles.emptyText}>Nhấn "Thêm Lỗi Mới" để bắt đầu cấu hình các loại lỗi hỏng phạt</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  addBtn: {
    margin: 16, backgroundColor: '#5B6FE6', padding: 15, borderRadius: 14,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6,
    shadowColor: '#5B6FE6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
  },
  addBtnIcon: { fontSize: 18, color: '#fff', fontWeight: '700' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  listContent: { paddingHorizontal: 16, paddingBottom: 30, gap: 12 },
  listTitle: { fontSize: 13, fontWeight: '600', color: '#8892A6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  cardTop: { flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 },
  iconBox: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFF8E1',
    alignItems: 'center', justifyContent: 'center',
  },
  iconText: { fontSize: 18 },
  cardInfo: { flex: 1 },
  tenLoi: { fontSize: 15, fontWeight: '700', color: '#1B2A4A', marginBottom: 3 },
  moTa: { fontSize: 13, color: '#8892A6', lineHeight: 18 },
  phatBadge: { backgroundColor: '#FFEBEE', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  phatText: { fontSize: 14, fontWeight: '800', color: '#E53935' },

  cardActions: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F0F1F5',
    paddingHorizontal: 12, paddingVertical: 10, gap: 8,
  },
  btnSua: { flex: 1, padding: 10, borderRadius: 10, backgroundColor: '#EEF0FB', alignItems: 'center' },
  btnSuaText: { color: '#5B6FE6', fontWeight: '600', fontSize: 13 },
  btnXoa: { padding: 10, borderRadius: 10, backgroundColor: '#FFF3F3', paddingHorizontal: 16, alignItems: 'center' },
  btnXoaText: { color: '#E53935', fontWeight: '600', fontSize: 13 },

  emptyBox: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1B2A4A', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#8892A6', textAlign: 'center', lineHeight: 22 },
});
