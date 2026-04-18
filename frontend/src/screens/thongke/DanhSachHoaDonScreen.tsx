import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
  ActivityIndicator, ScrollView
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, HoaDonThongKe } from '../../types';
import { tratrangphucApi } from '../../api/tratrangphucApi';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DanhSachHoaDon'>;
  route: RouteProp<RootStackParamList, 'DanhSachHoaDon'>;
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' ₫';
}

export default function DanhSachHoaDonScreen({ navigation, route }: Props) {
  const { loai, nam, period, tenPeriod, color = '#5B6FE6', bg = '#EEF0FB' } = route.params;

  const [chiTiet, setChiTiet] = useState<HoaDonThongKe[]>([]);
  const [chiTietLoading, setChiTietLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setChiTietLoading(true);
    try {
      let result: HoaDonThongKe[] = [];
      if (loai === 'thang') result = await tratrangphucApi.chiTietTheoThang(nam, period);
      else if (loai === 'quy') result = await tratrangphucApi.chiTietTheoQuy(nam, period);
      else result = await tratrangphucApi.chiTietTheoNam(nam);
      setChiTiet(result);
    } catch {
      setChiTiet([]);
    } finally {
      setChiTietLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: color }]}>
        <Text style={styles.title}>Danh Sách Hóa Đơn</Text>
        <Text style={[styles.subtitle, { color: color }]}>{tenPeriod}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {chiTietLoading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={color} />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        )}

        {!chiTietLoading && chiTiet.length === 0 && (
          <View style={styles.centered}>
            <Text style={styles.emptyEmoji}>🗂️</Text>
            <Text style={styles.emptyText}>Không có hóa đơn nào</Text>
          </View>
        )}

        {!chiTietLoading && chiTiet.length > 0 && (
          <>
            {/* Summary */}
            <View style={[styles.summaryRow, { backgroundColor: bg }]}>
              <Text style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Tổng HĐ: </Text>
                <Text style={[styles.summaryVal, { color }]}>{chiTiet.length}</Text>
              </Text>
              <Text style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Tổng DT: </Text>
                <Text style={[styles.summaryVal, { color }]}>
                  {formatCurrency(chiTiet.reduce((s, h) => s + h.tongTienHoaDon, 0))}
                </Text>
              </Text>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.cID, styles.headerCell]}>ID</Text>
              <Text style={[styles.cKH, styles.headerCell]}>Khách hàng</Text>
              <Text style={[styles.cDate, styles.headerCell]}>Ng.Mượn</Text>
              <Text style={[styles.cQty, styles.headerCell]}>SL</Text>
              <Text style={[styles.cMoney, styles.headerCell]}>Tiền</Text>
            </View>

            {/* Table List */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
              {chiTiet.map((hd, idx) => (
                <TouchableOpacity
                  key={hd.phieuTraId}
                  style={[styles.row, idx % 2 === 1 && styles.rowAlt]}
                  activeOpacity={0.7}
                  onPress={async () => {
                    try {
                      // Ở màn hình mới thì chỉ cần gọi API ra và navigate
                      const hoadon = await tratrangphucApi.layChiTietHoaDon(hd.phieuTraId);
                      navigation.navigate('ChiTietHoaDon', { hoaDon: hoadon });
                    } catch (e: any) {
                      alert('Lỗi: ' + e.message);
                    }
                  }}
                >
                  <View style={styles.cID}>
                    <View style={[styles.idBadge, { backgroundColor: bg }]}>
                      <Text style={[styles.idText, { color }]}>
                        #{hd.phieuTraId}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.cKH, styles.cell]} numberOfLines={2}>{hd.tenKhachHang}</Text>
                  <Text style={[styles.cDate, styles.cell]}>{hd.ngayMuon}</Text>
                  <Text style={[styles.cQty, styles.cell]}>{hd.tongSoTrangPhuc}</Text>
                  <Text style={[styles.cMoney, styles.moneyCell, { color }]}>
                    {formatCurrency(hd.tongTienHoaDon)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#1B2A4A' },
  subtitle: { fontSize: 14, fontWeight: '600', marginTop: 4 },

  content: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { color: '#8892A6', fontSize: 14 },
  emptyEmoji: { fontSize: 44 },
  emptyText: { fontSize: 14, color: '#8892A6' },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  summaryItem: {},
  summaryLabel: { fontSize: 13, color: '#8892A6', fontWeight: '600' },
  summaryVal: { fontSize: 15, fontWeight: '800' },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2A4A',
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 6,
  },
  headerCell: { fontSize: 11, fontWeight: '700', color: '#A7B0C4' },
  
  list: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#F0F1F5',
  },
  rowAlt: { backgroundColor: '#FAFBFF' },
  cell: { fontSize: 12, color: '#4A5568' },
  
  cID: { width: 50 },
  cKH: { flex: 2.5 },
  cDate: { flex: 1.8 },
  cQty: { width: 30, textAlign: 'center' },
  cMoney: { flex: 2, textAlign: 'right' },
  
  moneyCell: { fontSize: 13, fontWeight: '700', textAlign: 'right' },
  idBadge: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  idText: { fontSize: 11, fontWeight: '700' },
});
