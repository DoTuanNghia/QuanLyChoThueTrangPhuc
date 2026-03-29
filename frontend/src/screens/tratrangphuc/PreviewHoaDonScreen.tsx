import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { tratrangphucApi } from '../../api/tratrangphucApi';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PreviewHoaDon'>;
  route: RouteProp<RootStackParamList, 'PreviewHoaDon'>;
};

export default function PreviewHoaDonScreen({ navigation, route }: Props) {
  const { request, hoaDon } = route.params;
  const [loading, setLoading] = useState(false);

  const formatVND = (v: number) => v.toLocaleString('vi-VN') + 'đ';

  const handleXacNhan = async () => {
    try {
      setLoading(true);
      const result = await tratrangphucApi.xacNhanTra(request);
      navigation.replace('KetQua', {
        success: result.success,
        message: result.message,
        phieuTraId: result.phieuTraId,
      });
    } catch (e: any) {
      Alert.alert('Lỗi', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceTitle}>🧾 HÓA ĐƠN TRẢ TRANG PHỤC</Text>
          <Text style={styles.invoiceDate}>Ngày trả: {hoaDon.ngayTra}</Text>
        </View>

        {/* Thong tin KH */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionLabel}>THÔNG TIN KHÁCH HÀNG</Text>
          <Row label="Tên KH" value={hoaDon.tenKhachHang} />
          <Row label="SĐT" value={hoaDon.soDienThoaiKH} />
          <Row label="Phiếu thuê" value={`#${hoaDon.phieuThueId} (${hoaDon.ngayThue})`} />
          <Row label="Nhân viên" value={hoaDon.tenNhanVien} />
          <Row label="Tiền cọc" value={formatVND(hoaDon.tienCoc)} highlight />
        </View>

        {/* Chi tiet */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionLabel}>CHI TIẾT TRANG PHỤC</Text>
          {hoaDon.danhSachChiTiet.map((item, idx) => (
            <View key={idx} style={styles.itemCard}>
              <Text style={styles.itemName}>{item.tenTrangPhuc}</Text>
              <Row label="Số lượng" value={`${item.soLuong} bộ`} />
              <Row label="Đơn giá" value={formatVND(item.donGia)} />
              <Row label="Số ngày thuê" value={`${item.soNgayThue} ngày`} />
              <Row label="Tiền thuê" value={formatVND(item.tienThue)} />

              {item.danhSachLoi && item.danhSachLoi.length > 0 && (
                <View style={styles.loiSection}>
                  <Text style={styles.loiTitle}>Lỗi hỏng:</Text>
                  {item.danhSachLoi.map((l, li) => (
                    <View key={li} style={styles.loiRow}>
                      <Text style={styles.loiName}>• {l.tenLoi} (x{l.soLuong})</Text>
                      <Text style={styles.loiPhat}>{formatVND(l.tienPhat)}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.itemTotal}>
                <Text style={styles.itemTotalLabel}>Tiền phạt</Text>
                <Text style={styles.itemTotalPhat}>{formatVND(item.tienPhat)}</Text>
              </View>
              <View style={[styles.itemTotal, { borderTopWidth: 1.5, borderTopColor: '#e94560' }]}>
                <Text style={styles.itemTotalLabel}>Tổng cộng</Text>
                <Text style={styles.itemTotalVal}>{formatVND(item.tongCong)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tong ket */}
        <View style={styles.totalsBox}>
          <Row label="Tổng tiền thuê" value={formatVND(hoaDon.tongTienThue)} />
          <Row label="Tổng tiền phạt" value={formatVND(hoaDon.tongTienPhat)} highlight />
          <View style={styles.grandTotal}>
            <Text style={styles.grandLabel}>TỔNG THANH TOÁN</Text>
            <Text style={styles.grandValue}>{formatVND(hoaDon.tongThanhToan)}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmBtn, loading && { opacity: 0.6 }]}
        onPress={handleXacNhan}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.confirmBtnText}>✅ Xác Nhận Trả</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, highlight && rowStyles.highlight]}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  highlight: { color: '#e94560' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content: { padding: 16, gap: 16, paddingBottom: 100 },
  invoiceHeader: { backgroundColor: '#1a1a2e', borderRadius: 14, padding: 20, alignItems: 'center' },
  invoiceTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  invoiceDate: { color: '#9ab', fontSize: 13 },
  infoSection: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
  },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#999', letterSpacing: 1, marginBottom: 10 },
  itemCard: {
    borderWidth: 1.5, borderColor: '#e8e8e8', borderRadius: 10, padding: 12, marginBottom: 10,
  },
  itemName: { fontSize: 15, fontWeight: '700', color: '#0f3460', marginBottom: 8 },
  loiSection: { backgroundColor: '#fff5f6', borderRadius: 8, padding: 8, marginVertical: 6 },
  loiTitle: { fontSize: 12, fontWeight: '700', color: '#e94560', marginBottom: 4 },
  loiRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  loiName: { fontSize: 13, color: '#555' },
  loiPhat: { fontSize: 13, color: '#e94560', fontWeight: '600' },
  itemTotal: {
    flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6, marginTop: 4,
  },
  itemTotalLabel: { fontSize: 13, color: '#555' },
  itemTotalPhat: { fontSize: 13, fontWeight: '700', color: '#e94560' },
  itemTotalVal: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  totalsBox: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
  },
  grandTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 10, paddingTop: 12, borderTopWidth: 2, borderTopColor: '#1a1a2e',
  },
  grandLabel: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  grandValue: { fontSize: 20, fontWeight: '900', color: '#e94560' },
  confirmBtn: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    backgroundColor: '#e94560', padding: 16, borderRadius: 14, alignItems: 'center',
  },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
