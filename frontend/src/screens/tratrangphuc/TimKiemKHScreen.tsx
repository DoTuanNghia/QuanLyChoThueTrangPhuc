import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, KhachHang } from '../../types';
import { tratrangphucApi } from '../../api/tratrangphucApi';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'TimKiemKH'> };

const AVATAR_COLORS = ['#5B6FE6', '#00B894', '#E17055', '#0984E3', '#D63031', '#E84393', '#00CEC9', '#6C5CE7'];
const getColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

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

  const renderItem = ({ item }: { item: KhachHang }) => {
    const color = getColor(item.ten);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('DanhSachPhieuThue', { khachHang: item })}
        activeOpacity={0.75}
      >
        <View style={[styles.avatar, { backgroundColor: color + '18' }]}>
          <Text style={[styles.avatarText, { color }]}>{item.ten.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.tenKH}>{item.ten}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>📞 {item.soDienThoai || 'Chưa cập nhật'}</Text>
            {item.diaChi && <Text style={styles.metaDot}>·</Text>}
            {item.diaChi && (
              <Text style={styles.metaItem} numberOfLines={1}>
                📍 {item.diaChi}
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.arrowBox, { backgroundColor: color + '14' }]}>
          <Text style={[styles.arrow, { color }]}>→</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.page}>
      {/* Hero header */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>🔍</Text>
          </View>
          <View>
            <Text style={styles.heroTitle}>Trả trang phục</Text>
            <Text style={styles.heroSub}>Tìm khách hàng để bắt đầu quy trình trả</Text>
          </View>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>👤</Text>
            <TextInput
              style={styles.searchInput}
              value={tuKhoa}
              onChangeText={setTuKhoa}
              placeholder="Nhập tên khách hàng..."
              placeholderTextColor="#B0B7C3"
              onSubmitEditing={handleTimKiem}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleTimKiem} activeOpacity={0.8}>
              <Text style={styles.searchBtnText}>Tìm kiếm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Results area */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#5B6FE6" />
          <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
        </View>
      ) : (
        <FlatList
          data={danhSach}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            searched && danhSach.length > 0 ? (
              <View style={styles.resultHeader}>
                <View style={styles.resultDot} />
                <Text style={styles.resultCount}>
                  Tìm thấy <Text style={styles.resultCountBold}>{danhSach.length}</Text> khách hàng
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>{searched ? '🔍' : '👋'}</Text>
              <Text style={styles.emptyTitle}>
                {searched ? 'Không tìm thấy kết quả' : 'Bắt đầu tìm kiếm'}
              </Text>
              <Text style={styles.emptyText}>
                {searched
                  ? `Không có khách hàng nào tên "${tuKhoa}" đang mượn trang phục`
                  : 'Nhập tên khách hàng rồi nhấn "Tìm kiếm"'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const ACCENT = '#5B6FE6';

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F4F6FB' },

  heroSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28, paddingTop: 28, paddingBottom: 24,
    borderBottomWidth: 1, borderBottomColor: '#ECEEF4',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 3,
  },
  heroContent: {
    flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20,
  },
  heroIcon: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: '#EEF0FB',
    alignItems: 'center', justifyContent: 'center',
  },
  heroIconText: { fontSize: 24 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#1B2A4A' },
  heroSub: { fontSize: 13, color: '#8892A6', marginTop: 2 },

  searchWrapper: { maxWidth: 600 },
  searchBox: {
    flexDirection: 'row', backgroundColor: '#F4F6FB', borderRadius: 14,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#E8EAF0', overflow: 'hidden',
  },
  searchIcon: { paddingLeft: 16, fontSize: 16 },
  searchInput: {
    flex: 1, paddingVertical: 13, paddingHorizontal: 12,
    fontSize: 15, color: '#1B2A4A', fontWeight: '500',
  },
  searchBtn: {
    backgroundColor: ACCENT, paddingHorizontal: 22,
    paddingVertical: 13, margin: 3, borderRadius: 11,
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#8892A6' },

  listContent: { padding: 24, paddingTop: 16, gap: 10, maxWidth: 800, alignSelf: 'center', width: '100%' },

  resultHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 12, paddingVertical: 4,
  },
  resultDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },
  resultCount: { fontSize: 13, color: '#8892A6' },
  resultCountBold: { fontWeight: '700', color: '#1B2A4A' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: '#ECEEF4',
  },
  avatar: {
    width: 50, height: 50, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: 14, flexShrink: 0,
  },
  avatarText: { fontSize: 20, fontWeight: '800' },
  info: { flex: 1 },
  tenKH: { fontSize: 15, fontWeight: '700', color: '#1B2A4A', marginBottom: 5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  metaItem: { fontSize: 12, color: '#8892A6' },
  metaDot: { fontSize: 12, color: '#CBD0DC' },
  arrowBox: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  arrow: { fontSize: 16, fontWeight: 'bold' },

  emptyBox: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1B2A4A', marginBottom: 8 },
  emptyText: { fontSize: 13, color: '#8892A6', textAlign: 'center', lineHeight: 20 },
});
