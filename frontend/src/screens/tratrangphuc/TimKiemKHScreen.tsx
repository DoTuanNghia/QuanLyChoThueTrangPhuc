import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, KhachHang } from '../../types';
import { tratrangphucApi } from '../../api/tratrangphucApi';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'TimKiemKH'> };

export default function TimKiemKHScreen({ navigation }: Props) {
  const [tuKhoa, setTuKhoa] = useState('');
  const [danhSach, setDanhSach] = useState<KhachHang[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTimKiem = async () => {
    try {
      setLoading(true);
      setSearched(true);
      const data = await tratrangphucApi.timKiemKhachHang(tuKhoa);
      setDanhSach(data);
    } catch (e: any) {
      Alert.alert('Lỗi', e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: KhachHang }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DanhSachPhieuThue', { khachHang: item })}
      activeOpacity={0.8}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.ten.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.tenKH}>{item.ten}</Text>
        <Text style={styles.sdt}>📞 {item.soDienThoai || '—'}</Text>
        <Text style={styles.diaChi} numberOfLines={1}>📍 {item.diaChi || '—'}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          value={tuKhoa}
          onChangeText={setTuKhoa}
          placeholder="Nhập tên khách hàng..."
          placeholderTextColor="#aaa"
          onSubmitEditing={handleTimKiem}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleTimKiem}>
          <Text style={styles.searchBtnText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={danhSach}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListEmptyComponent={
            searched ? (
              <Text style={styles.emptyText}>Không tìm thấy khách hàng nào</Text>
            ) : (
              <Text style={styles.emptyText}>Nhập tên và nhấn tìm kiếm</Text>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  searchBox: { flexDirection: 'row', margin: 16, gap: 10 },
  searchInput: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12,
    fontSize: 15, color: '#1a1a2e', borderWidth: 1.5, borderColor: '#ddd',
  },
  searchBtn: {
    backgroundColor: '#e94560', width: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  searchBtnText: { fontSize: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row',
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#1a1a2e',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  info: { flex: 1 },
  tenKH: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 3 },
  sdt: { fontSize: 13, color: '#555', marginBottom: 2 },
  diaChi: { fontSize: 13, color: '#777' },
  arrow: { fontSize: 28, color: '#e94560', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 60, fontSize: 15 },
});
