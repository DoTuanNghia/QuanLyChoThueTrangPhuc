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
        if (!Array.isArray(data)) {
          Alert.alert('Thông báo', 'Khách hàng không có phiếu thuê nào đang mượn.');
          setPhieuThueList([]);
        } else {
          setPhieuThueList(data);
        }
      })
      .catch((e) => Alert.alert('Lỗi', e.message))
      .finally(() => setLoading(false));
  }, [khachHang.id]);

  const formatCurrency = (v: number) => v.toLocaleString('vi-VN') + 'đ';

  const renderItem = ({ item }: { item: PhieuThue }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ChonTra', { phieuThue: item, khachHang })}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.phieuId}>Phiếu #{item.id}</Text>
        <Text style={styles.ngayThue}>Ngày thuê: {item.ngayLap}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.infoText}>💰 Tiền cọc: {formatCurrency(item.tienCoc)}</Text>
        <Text style={styles.infoText}>📦 Tổng: {formatCurrency(item.tongTien)}</Text>
        <Text style={styles.soLuongText}>
          {item.chiTietThueList?.length ?? 0} loại trang phục
        </Text>
      </View>
      <Text style={styles.chonBtn}>Chọn để trả →</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.khHeader}>
        <Text style={styles.khName}>👤 {khachHang.ten}</Text>
        <Text style={styles.khInfo}>{khachHang.soDienThoai}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={phieuThueList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có phiếu thuê nào đang mượn</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  khHeader: { backgroundColor: '#1a1a2e', padding: 16 },
  khName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  khInfo: { fontSize: 13, color: '#9ab', marginTop: 2 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 8,
  },
  phieuId: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  ngayThue: { fontSize: 13, color: '#888' },
  cardBody: { gap: 4, marginBottom: 10 },
  infoText: { fontSize: 14, color: '#444' },
  soLuongText: { fontSize: 14, color: '#0f3460', fontWeight: '600' },
  chonBtn: { color: '#e94560', fontWeight: '700', fontSize: 14, textAlign: 'right' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 60, fontSize: 15 },
});
