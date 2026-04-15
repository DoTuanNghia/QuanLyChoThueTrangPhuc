import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Loi } from '../../types';
import { loiApi } from '../../api/loiApi';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'DanhSachLoi'> };

const fmtVND = (v: number) => v.toLocaleString('vi-VN') + 'đ';

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

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleXoa = (loi: Loi) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa lỗi "${loi.tenLoi}"?\nHành động này không thể hoàn tác.`,
      [
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
      ]
    );
  };

  const renderItem = ({ item }: { item: Loi }) => (
    <View style={styles.card}>
      <View style={styles.cardMain}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>⚠️</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.tenLoi}>{item.tenLoi}</Text>
          {item.moTa ? (
            <Text style={styles.moTa} numberOfLines={2}>{item.moTa}</Text>
          ) : (
            <Text style={[styles.moTa, { fontStyle: 'italic', color: '#B0B7C3' }]}>Chưa có mô tả</Text>
          )}
        </View>
        <View style={styles.phatSection}>
          <Text style={styles.phatLabel}>Mức phạt</Text>
          <Text style={styles.phatVal}>{fmtVND(item.mucPhat)}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.btnSua}
          onPress={() => navigation.navigate('ThemSuaLoi', { loi: item })}
          activeOpacity={0.8}
        >
          <Text style={styles.btnSuaText}>✏️  Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnXoa}
          onPress={() => handleXoa(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnXoaText}>🗑️  Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      {/* Page header */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.pageTitle}>Quản lý lỗi hỏng</Text>
          <Text style={styles.pageSub}>Cấu hình các loại lỗi và mức phạt tương ứng</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('ThemSuaLoi', {})}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnIcon}>＋</Text>
          <Text style={styles.addBtnText}>Thêm lỗi mới</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#5B6FE6" />
          <Text style={styles.loadingText}>Đang tải danh sách...</Text>
        </View>
      ) : (
        <FlatList
          data={danhSach}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} tintColor="#5B6FE6" />
          }
          ListHeaderComponent={
            danhSach.length > 0 ? (
              <View style={styles.listHeader}>
                <View style={styles.listHeaderDot} />
                <Text style={styles.listHeaderText}>
                  <Text style={styles.listHeaderBold}>{danhSach.length}</Text> loại lỗi đã cấu hình
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Chưa có lỗi nào</Text>
              <Text style={styles.emptyText}>
                Nhấn "Thêm lỗi mới" để bắt đầu cấu hình các loại lỗi hỏng và mức phạt
              </Text>
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => navigation.navigate('ThemSuaLoi', {})}
              >
                <Text style={styles.emptyAddBtnText}>＋  Thêm lỗi đầu tiên</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const ACCENT = '#5B6FE6';
const RED    = '#E53935';
const MAX_W  = 900;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F4F6FB' },

  pageHeader: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 28, paddingVertical: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: '#ECEEF4',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 3,
  },
  headerLeft: { flex: 1, marginRight: 16 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#1B2A4A' },
  pageSub: { fontSize: 13, color: '#8892A6', marginTop: 3 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: ACCENT, paddingHorizontal: 18, paddingVertical: 11,
    borderRadius: 12,
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  addBtnIcon: { fontSize: 16, color: '#fff', fontWeight: '700' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#8892A6' },

  listContent: {
    paddingHorizontal: 24, paddingVertical: 20, gap: 12,
    maxWidth: MAX_W, alignSelf: 'center', width: '100%',
  },
  listHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 6,
  },
  listHeaderDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },
  listHeaderText: { fontSize: 13, color: '#8892A6' },
  listHeaderBold: { fontWeight: '700', color: '#1B2A4A' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: '#ECEEF4',
  },
  cardMain: {
    flexDirection: 'row', alignItems: 'center',
    padding: 18, gap: 14,
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: '#FFF8E1',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  iconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  tenLoi: { fontSize: 15, fontWeight: '700', color: '#1B2A4A', marginBottom: 4 },
  moTa: { fontSize: 13, color: '#8892A6', lineHeight: 18 },
  phatSection: { alignItems: 'flex-end', flexShrink: 0 },
  phatLabel: {
    fontSize: 10, color: '#8892A6', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
  },
  phatVal: {
    fontSize: 16, fontWeight: '800', color: RED,
    backgroundColor: '#FFEBEE', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 8,
  },

  cardActions: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F4F6FB',
    paddingHorizontal: 14, paddingVertical: 10, gap: 8,
  },
  btnSua: {
    flex: 1, padding: 10, borderRadius: 10,
    backgroundColor: '#EEF0FB', alignItems: 'center',
  },
  btnSuaText: { color: ACCENT, fontWeight: '600', fontSize: 13 },
  btnXoa: {
    padding: 10, borderRadius: 10, backgroundColor: '#FFF3F3',
    paddingHorizontal: 18, alignItems: 'center',
  },
  btnXoaText: { color: RED, fontWeight: '600', fontSize: 13 },

  emptyBox: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1B2A4A', marginBottom: 8 },
  emptyText: {
    fontSize: 14, color: '#8892A6', textAlign: 'center',
    lineHeight: 22, marginBottom: 28,
  },
  emptyAddBtn: {
    backgroundColor: ACCENT, paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 12,
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  emptyAddBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
