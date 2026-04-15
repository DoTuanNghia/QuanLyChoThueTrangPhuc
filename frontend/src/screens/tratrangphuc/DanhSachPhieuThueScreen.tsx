import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator,
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
        if (!Array.isArray(data)) {
          Alert.alert('Thông báo', 'KH không có phiếu thuê đang mượn.');
          setPhieuThueList([]);
        } else {
          setPhieuThueList(data);
        }
      })
      .catch((e) => Alert.alert('Lỗi', e.message))
      .finally(() => setLoading(false));
  }, [khachHang.id]);

  const fmtVND = (v: number) => v.toLocaleString('vi-VN') + 'đ';

  const renderItem = ({ item, index }: { item: PhieuThue; index: number }) => {
    const soLoai = (item as any).danhSachChuaTra?.length ?? item.chiTietThueList?.length ?? 0;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ChonTra', { phieuThue: item, khachHang })}
        activeOpacity={0.75}
      >
        <View style={styles.cardLeft}>
          <View style={styles.cardIndex}>
            <Text style={styles.cardIndexText}>{String(index + 1).padStart(2, '0')}</Text>
          </View>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>Phiếu #{item.id}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Ngày lập</Text>
              <Text style={styles.infoValue}>{item.ngayLap}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Trang phục</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{soLoai} loại</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Tiền cọc</Text>
              <Text style={styles.moneyVal}>{fmtVND(item.tienCoc)}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Tổng tiền</Text>
              <Text style={styles.moneyVal}>{fmtVND(item.tongTien)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.arrowCol}>
          <Text style={styles.arrowText}>→</Text>
          <Text style={styles.arrowHint}>Chọn để trả</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.page}>
      {/* KH Info Header */}
      <View style={styles.khHeader}>
        <View style={styles.khAvatarWrap}>
          <View style={styles.khAvatar}>
            <Text style={styles.khAvatarText}>{khachHang.ten.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.khInfo}>
          <Text style={styles.khName}>{khachHang.ten}</Text>
          <Text style={styles.khPhone}>📞 {khachHang.soDienThoai || '—'}</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Đang mượn</Text>
        </View>
      </View>

      {/* Section header */}
      <View style={styles.sectionBar}>
        <Text style={styles.sectionTitle}>📋 Danh sách phiếu thuê chưa trả</Text>
        {!loading && phieuThueList.length > 0 && (
          <View style={styles.countChip}>
            <Text style={styles.countChipText}>{phieuThueList.length} phiếu</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#5B6FE6" />
          <Text style={styles.loadingText}>Đang tải phiếu thuê...</Text>
        </View>
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
              <Text style={styles.emptyText}>Khách hàng không có trang phục nào đang mượn</Text>
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

  khHeader: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    paddingHorizontal: 24, paddingVertical: 18,
    borderBottomWidth: 1, borderBottomColor: '#ECEEF4',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 3,
  },
  khAvatarWrap: { marginRight: 14 },
  khAvatar: {
    width: 50, height: 50, borderRadius: 14, backgroundColor: '#EEF0FB',
    alignItems: 'center', justifyContent: 'center',
  },
  khAvatarText: { color: ACCENT, fontSize: 20, fontWeight: '800' },
  khInfo: { flex: 1 },
  khName: { fontSize: 18, fontWeight: '800', color: '#1B2A4A' },
  khPhone: { fontSize: 13, color: '#8892A6', marginTop: 3 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 6,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#43A047' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#43A047' },

  sectionBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 14,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1B2A4A' },
  countChip: {
    backgroundColor: '#EEF0FB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  countChipText: { fontSize: 12, fontWeight: '700', color: ACCENT },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#8892A6' },

  listContent: { paddingHorizontal: 20, paddingBottom: 28, gap: 12, maxWidth: 900, alignSelf: 'center', width: '100%' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'stretch',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: '#ECEEF4',
  },
  cardLeft: {
    backgroundColor: '#F8F9FC', padding: 16,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRightWidth: 1, borderRightColor: '#ECEEF4', minWidth: 80,
  },
  cardIndex: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF0FB',
    alignItems: 'center', justifyContent: 'center',
  },
  cardIndexText: { color: ACCENT, fontWeight: '800', fontSize: 13 },
  idBadge: {
    backgroundColor: ACCENT + '14', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6,
  },
  idBadgeText: { color: ACCENT, fontWeight: '700', fontSize: 11 },

  cardBody: { flex: 1, padding: 16 },
  infoRow: { flexDirection: 'row', gap: 16 },
  infoCell: { flex: 1 },
  infoLabel: {
    fontSize: 10, color: '#8892A6', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5,
  },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1B2A4A' },
  moneyVal: { fontSize: 15, fontWeight: '800', color: '#00897B' },
  typeBadge: {
    backgroundColor: '#EDE7F6', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 7,
    alignSelf: 'flex-start',
  },
  typeText: { color: ACCENT, fontWeight: '700', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#F0F1F5', marginVertical: 12 },

  arrowCol: {
    padding: 16, alignItems: 'center', justifyContent: 'center',
    borderLeftWidth: 1, borderLeftColor: '#F0F1F5', gap: 4,
  },
  arrowText: { fontSize: 20, color: ACCENT, fontWeight: 'bold' },
  arrowHint: { fontSize: 10, color: '#8892A6', fontWeight: '500' },

  emptyBox: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1B2A4A', marginBottom: 8 },
  emptyText: { fontSize: 13, color: '#8892A6', textAlign: 'center', lineHeight: 20 },
});
