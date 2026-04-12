import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, PhieuThue } from '../../types';
import { tratrangphucApi } from '../../api/tratrangphucApi';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DanhSachPhieuThue'>;
  route: RouteProp<RootStackParamList, 'DanhSachPhieuThue'>;
};

export default function DanhSachPhieuThueScreen({ navigation, route }: Props) {
  const { khachHang } = route.params;
  const [phieuThueList, setPhieuThueList] = useState<PhieuThue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tratrangphucApi.layPhieuThueChuaTra(khachHang.id)
      .then((data) => {
        if (!Array.isArray(data)) { Alert.alert('Thông báo', 'KH không có phiếu thuê đang mượn.'); setPhieuThueList([]); }
        else setPhieuThueList(data);
      })
      .catch((e) => Alert.alert('Lỗi', e.message))
      .finally(() => setLoading(false));
  }, [khachHang.id]);

  const fmtVND = (v: number) => v.toLocaleString('vi-VN') + 'đ';

  const renderItem = ({ item }: { item: PhieuThue }) => {
    const soLoai = (item as any).danhSachChuaTra?.length ?? item.chiTietThueList?.length ?? 0;
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ChonTra', { phieuThue: item, khachHang })} activeOpacity={0.7}>
        <View style={styles.cardBadge}><Text style={styles.badgeText}>#{item.id}</Text></View>
        <View style={styles.cardBody}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.cellLabel}>Ngày thuê</Text>
              <Text style={styles.cellValue}>{item.ngayLap}</Text>
            </View>
            <View style={[styles.cell, { alignItems: 'flex-end' }]}>
              <Text style={styles.cellLabel}>Trang phục</Text>
              <View style={styles.countBadge}><Text style={styles.countText}>{soLoai} loại</Text></View>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.cellLabel}>Tiền cọc</Text>
              <Text style={styles.moneyVal}>{fmtVND(item.tienCoc)}</Text>
            </View>
            <View style={[styles.cell, { alignItems: 'flex-end' }]}>
              <Text style={styles.cellLabel}>Tổng tiền thuê</Text>
              <Text style={styles.moneyVal}>{fmtVND(item.tongTien)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.selectRow}>
          <Text style={styles.selectText}>Chọn để trả →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.khHeader}>
        <View style={styles.khAvatar}><Text style={styles.khAvatarText}>{khachHang.ten.charAt(0)}</Text></View>
        <View style={styles.khInfo}>
          <Text style={styles.khName}>{khachHang.ten}</Text>
          <Text style={styles.khPhone}>📞 {khachHang.soDienThoai || '—'}</Text>
        </View>
        <View style={styles.statusBadge}><View style={styles.statusDot} /><Text style={styles.statusText}>Đang mượn</Text></View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}><ActivityIndicator size="large" color="#5B6FE6" /></View>
      ) : (
        <FlatList
          data={phieuThueList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>Không có phiếu thuê</Text>
              <Text style={styles.emptyText}>KH không có trang phục nào đang mượn</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  khHeader: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    paddingHorizontal: 18, paddingVertical: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3,
  },
  khAvatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#EEF0FB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  khAvatarText: { color: '#5B6FE6', fontSize: 18, fontWeight: '800' },
  khInfo: { flex: 1 },
  khName: { fontSize: 17, fontWeight: '700', color: '#1B2A4A' },
  khPhone: { fontSize: 12, color: '#8892A6', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, gap: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#43A047' },
  statusText: { fontSize: 11, fontWeight: '600', color: '#43A047' },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, gap: 14 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  cardBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#EEF0FB', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6, zIndex: 1 },
  badgeText: { color: '#5B6FE6', fontWeight: '700', fontSize: 12 },
  cardBody: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: { flex: 1 },
  cellLabel: { fontSize: 11, color: '#8892A6', fontWeight: '500', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.3 },
  cellValue: { fontSize: 14, fontWeight: '600', color: '#1B2A4A' },
  moneyVal: { fontSize: 14, fontWeight: '700', color: '#00897B' },
  countBadge: { backgroundColor: '#EDE7F6', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6 },
  countText: { color: '#5B6FE6', fontWeight: '700', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#F0F1F5', marginVertical: 12 },
  selectRow: { borderTopWidth: 1, borderTopColor: '#F0F1F5', padding: 12, alignItems: 'center' },
  selectText: { color: '#5B6FE6', fontWeight: '700', fontSize: 14 },

  emptyBox: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#1B2A4A', marginBottom: 6 },
  emptyText: { fontSize: 13, color: '#8892A6', textAlign: 'center' },
});
