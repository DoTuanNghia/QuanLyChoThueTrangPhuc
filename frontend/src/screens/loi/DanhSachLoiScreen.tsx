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
    useCallback(() => {
      load();
    }, [load])
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
          } catch (e: any) {
            Alert.alert('Lỗi', e.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Loi }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.tenLoi}>{item.tenLoi}</Text>
        <Text style={styles.moTa}>{item.moTa || '—'}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.mucPhat}>{item.mucPhat.toLocaleString('vi-VN')}đ</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnSua]}
            onPress={() => navigation.navigate('ThemSuaLoi', { loi: item })}
          >
            <Text style={styles.btnText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnXoa]}
            onPress={() => handleXoa(item)}
          >
            <Text style={styles.btnText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('ThemSuaLoi', {})}
      >
        <Text style={styles.addBtnText}>+ Thêm Lỗi Mới</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={danhSach}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có lỗi nào được cấu hình</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  addBtn: {
    margin: 16, backgroundColor: '#e94560', padding: 14,
    borderRadius: 12, alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardLeft: { flex: 1, marginRight: 12 },
  tenLoi: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  moTa: { fontSize: 13, color: '#666' },
  cardRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  mucPhat: { fontSize: 15, fontWeight: '700', color: '#e94560' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnSua: { backgroundColor: '#0f3460' },
  btnXoa: { backgroundColor: '#c0392b' },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 60, fontSize: 15 },
});
