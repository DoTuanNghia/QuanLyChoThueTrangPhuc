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
      setLoading(true); setSearched(true);
      const data = await tratrangphucApi.timKiemKhachHang(tuKhoa);
      setDanhSach(data);
    } catch (e: any) { Alert.alert('Lỗi', e.message); }
    finally { setLoading(false); }
  };

  const getColor = (name: string) => {
    const colors = ['#5B6FE6', '#00B894', '#E17055', '#0984E3', '#D63031', '#E84393', '#00CEC9', '#FDCB6E'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const renderItem = ({ item }: { item: KhachHang }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DanhSachPhieuThue', { khachHang: item })}
      activeOpacity={0.7}
    >
      <View style={[styles.avatar, { backgroundColor: getColor(item.ten) + '18' }]}>
        <Text style={[styles.avatarText, { color: getColor(item.ten) }]}>{item.ten.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.tenKH}>{item.ten}</Text>
        <Text style={styles.detailText}>📞 {item.soDienThoai || 'Chưa cập nhật'}</Text>
        <Text style={styles.detailText} numberOfLines={1}>📍 {item.diaChi || 'Chưa cập nhật'}</Text>
      </View>
      <View style={styles.arrowBox}><Text style={styles.arrow}>→</Text></View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchSection}>
        <Text style={styles.heroTitle}>Tìm kiếm khách hàng</Text>
        <Text style={styles.heroSub}>Nhập tên KH để tìm các phiếu thuê đang mượn</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={tuKhoa} onChangeText={setTuKhoa}
            placeholder="Nhập tên khách hàng..." placeholderTextColor="#B0B7C3"
            onSubmitEditing={handleTimKiem} returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleTimKiem}>
            <Text style={styles.searchBtnText}>Tìm kiếm</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}><ActivityIndicator size="large" color="#5B6FE6" /></View>
      ) : (
        <FlatList
          data={danhSach}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            searched && danhSach.length > 0 ? (
              <Text style={styles.resultCount}>Tìm thấy {danhSach.length} khách hàng</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>{searched ? '🔍' : '👆'}</Text>
              <Text style={styles.emptyTitle}>{searched ? 'Không tìm thấy' : 'Bắt đầu tìm kiếm'}</Text>
              <Text style={styles.emptyText}>
                {searched ? `Không có KH nào tên "${tuKhoa}" đang mượn trang phục` : 'Nhập tên khách hàng rồi nhấn "Tìm kiếm"'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  searchSection: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#1B2A4A' },
  heroSub: { fontSize: 13, color: '#8892A6', marginTop: 4, marginBottom: 16 },
  searchBox: { flexDirection: 'row', backgroundColor: '#F5F6FA', borderRadius: 14, alignItems: 'center', overflow: 'hidden' },
  searchIcon: { paddingLeft: 14, fontSize: 16 },
  searchInput: { flex: 1, padding: 13, fontSize: 15, color: '#1B2A4A', fontWeight: '500' },
  searchBtn: { backgroundColor: '#5B6FE6', paddingHorizontal: 18, paddingVertical: 13, borderRadius: 12, margin: 3 },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, gap: 10 },
  resultCount: { fontSize: 13, fontWeight: '600', color: '#8892A6', marginBottom: 10 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  avatar: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: '800' },
  info: { flex: 1 },
  tenKH: { fontSize: 15, fontWeight: '700', color: '#1B2A4A', marginBottom: 3 },
  detailText: { fontSize: 12, color: '#8892A6', marginBottom: 1 },
  arrowBox: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F0F1F5', alignItems: 'center', justifyContent: 'center' },
  arrow: { fontSize: 14, color: '#5B6FE6', fontWeight: 'bold' },

  emptyBox: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#1B2A4A', marginBottom: 6 },
  emptyText: { fontSize: 13, color: '#8892A6', textAlign: 'center', lineHeight: 20 },
});
