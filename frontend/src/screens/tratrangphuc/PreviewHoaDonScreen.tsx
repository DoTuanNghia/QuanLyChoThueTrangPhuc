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
  const fmtVND = (v: number) => v?.toLocaleString('vi-VN') + 'đ';
  const soTienConLai = hoaDon.soTienConLai ?? (hoaDon.tongThanhToan - hoaDon.tienCoc);
  const khachTraThem = soTienConLai > 0;

  const handleXacNhan = async () => {
    try {
      setLoading(true);
      const result = await tratrangphucApi.xacNhanTra(request);
      navigation.replace('KetQua', { success: result.success, message: result.message, phieuTraId: result.phieuTraId });
    } catch (e: any) { Alert.alert('Lỗi', e.message); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.invHeader}>
          <Text style={styles.invEmoji}>🧾</Text>
          <Text style={styles.invTitle}>HÓA ĐƠN TRẢ TRANG PHỤC</Text>
          <Text style={styles.invDate}>Ngày trả: {hoaDon.ngayTra}</Text>
        </View>

        {/* KH info */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>THÔNG TIN KHÁCH HÀNG</Text>
          <InfoRow icon="👤" label="Tên KH" value={hoaDon.tenKhachHang} />
          <InfoRow icon="📞" label="SĐT" value={hoaDon.soDienThoaiKH || '—'} />
          <InfoRow icon="📍" label="Địa chỉ" value={hoaDon.diaChiKH || '—'} />
          <InfoRow icon="📋" label="Phiếu thuê" value={`#${hoaDon.phieuThueId} (${hoaDon.ngayThue})`} />
          <InfoRow icon="👨‍💼" label="Nhân viên" value={hoaDon.tenNhanVien} />
          <InfoRow icon="💰" label="Tiền đặt cọc" value={fmtVND(hoaDon.tienCoc)} highlight />
        </View>

        {/* Chi tiết */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CHI TIẾT TRANG PHỤC TRẢ</Text>
          {hoaDon.danhSachChiTiet.map((item, idx) => (
            <View key={idx} style={styles.itemBox}>
              <View style={styles.itemHdr}>
                <View style={styles.itemIdx}><Text style={styles.idxText}>{idx + 1}</Text></View>
                <Text style={styles.itemName}>{item.tenTrangPhuc}</Text>
              </View>
              <View style={styles.detailGrid}>
                <DCell label="Số lượng" value={`${item.soLuong} bộ`} />
                <DCell label="Đơn giá" value={fmtVND(item.donGia)} />
                <DCell label="Số ngày" value={`${item.soNgayThue} ngày`} />
                <DCell label="Tiền thuê" value={fmtVND(item.tienThue)} accent />
              </View>
              {item.danhSachLoi && item.danhSachLoi.length > 0 && (
                <View style={styles.loiSec}>
                  <Text style={styles.loiSecTitle}>⚠️ Lỗi hỏng</Text>
                  {item.danhSachLoi.map((l, li) => (
                    <View key={li} style={styles.loiRow}>
                      <Text style={styles.loiName}>• {l.tenLoi} (x{l.soLuong})</Text>
                      <Text style={styles.loiPhat}>{fmtVND(l.tienPhat)}</Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={styles.subTotals}>
                <View style={styles.subRow}><Text style={styles.subLabel}>Tiền thuê</Text><Text style={styles.subVal}>{fmtVND(item.tienThue)}</Text></View>
                {item.tienPhat > 0 && <View style={styles.subRow}><Text style={styles.subLabel}>Tiền phạt</Text><Text style={[styles.subVal, { color: '#E53935' }]}>{fmtVND(item.tienPhat)}</Text></View>}
                <View style={styles.itemTotalRow}><Text style={styles.itemTotalLabel}>Tổng cộng</Text><Text style={styles.itemTotalVal}>{fmtVND(item.tongCong)}</Text></View>
              </View>
            </View>
          ))}
        </View>

        {/* Tổng kết */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TỔNG KẾT THANH TOÁN</Text>
          <SumRow label="Tổng tiền thuê" value={fmtVND(hoaDon.tongTienThue)} />
          {hoaDon.tongTienPhat > 0 && <SumRow label="Tổng tiền phạt" value={fmtVND(hoaDon.tongTienPhat)} warning />}
          <View style={styles.sumDivider} />
          <SumRow label="Tổng thanh toán" value={fmtVND(hoaDon.tongThanhToan)} bold />
          <SumRow label="Tiền đã đặt cọc" value={`- ${fmtVND(hoaDon.tienCoc)}`} green />
          <View style={styles.sumDivider} />
          <View style={[styles.grandBox, { backgroundColor: khachTraThem ? '#FFF3F3' : '#E8F5E9' }]}>
            <View>
              <Text style={styles.grandLabel}>{khachTraThem ? 'KHÁCH HÀNG CẦN TRẢ' : 'TRẢ LẠI KHÁCH HÀNG'}</Text>
              <Text style={styles.grandSub}>{khachTraThem ? 'Số tiền KH phải trả thêm' : 'Số tiền hoàn lại cho KH'}</Text>
            </View>
            <Text style={[styles.grandVal, { color: khachTraThem ? '#E53935' : '#43A047' }]}>{fmtVND(Math.abs(soTienConLai))}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom confirm */}
      <View style={styles.confirmBar}>
        <View><Text style={styles.confirmLabel}>{khachTraThem ? 'KH cần trả' : 'Trả lại KH'}</Text>
          <Text style={[styles.confirmAmt, { color: khachTraThem ? '#E53935' : '#43A047' }]}>{fmtVND(Math.abs(soTienConLai))}</Text></View>
        <TouchableOpacity style={[styles.confirmBtn, loading && { opacity: 0.6 }]} onPress={handleXacNhan} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmBtnText}>✅ Xác nhận trả</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (<View style={ir.row}><Text style={ir.icon}>{icon}</Text><Text style={ir.label}>{label}</Text><Text style={[ir.value, highlight && { color: '#00897B', fontWeight: '700' }]}>{value}</Text></View>);
}
function DCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (<View style={dc.cell}><Text style={dc.label}>{label}</Text><Text style={[dc.value, accent && { color: '#00897B' }]}>{value}</Text></View>);
}
function SumRow({ label, value, bold, warning, green }: { label: string; value: string; bold?: boolean; warning?: boolean; green?: boolean }) {
  return (<View style={sr.row}><Text style={[sr.label, bold && { fontWeight: '700', color: '#1B2A4A' }]}>{label}</Text>
    <Text style={[sr.value, bold && { fontWeight: '800', fontSize: 16 }, warning && { color: '#E53935' }, green && { color: '#43A047' }]}>{value}</Text></View>);
}

const ir = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }, icon: { fontSize: 14, marginRight: 8, width: 20 }, label: { fontSize: 13, color: '#8892A6', flex: 1, fontWeight: '500' }, value: { fontSize: 13, fontWeight: '600', color: '#1B2A4A' } });
const dc = StyleSheet.create({ cell: { width: '48%', marginBottom: 10 }, label: { fontSize: 10, color: '#8892A6', fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 3 }, value: { fontSize: 13, fontWeight: '700', color: '#1B2A4A' } });
const sr = StyleSheet.create({ row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 }, label: { fontSize: 13, color: '#8892A6' }, value: { fontSize: 13, fontWeight: '600', color: '#1B2A4A' } });

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 16, gap: 14, paddingBottom: 110 },
  invHeader: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 22, alignItems: 'center', shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  invEmoji: { fontSize: 32, marginBottom: 8 },
  invTitle: { fontWeight: '800', fontSize: 16, color: '#1B2A4A', letterSpacing: 0.3 },
  invDate: { color: '#8892A6', fontSize: 13, marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardLabel: { fontSize: 11, fontWeight: '700', color: '#8892A6', letterSpacing: 1, marginBottom: 12 },
  itemBox: { borderWidth: 1, borderColor: '#F0F1F5', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  itemHdr: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#F8F9FC', gap: 10 },
  itemIdx: { width: 26, height: 26, borderRadius: 7, backgroundColor: '#EEF0FB', alignItems: 'center', justifyContent: 'center' },
  idxText: { color: '#5B6FE6', fontWeight: '800', fontSize: 12 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#1B2A4A', flex: 1 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12 },
  loiSec: { marginHorizontal: 12, marginBottom: 10, backgroundColor: '#FFF8F8', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#FFE0E0' },
  loiSecTitle: { fontSize: 11, fontWeight: '700', color: '#E53935', marginBottom: 6 },
  loiRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  loiName: { fontSize: 12, color: '#5A6478' },
  loiPhat: { fontSize: 12, color: '#E53935', fontWeight: '600' },
  subTotals: { borderTopWidth: 1, borderTopColor: '#F0F1F5', padding: 12 },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  subLabel: { fontSize: 12, color: '#8892A6' },
  subVal: { fontSize: 12, fontWeight: '600', color: '#1B2A4A' },
  itemTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1.5, borderTopColor: '#5B6FE6', marginTop: 6, paddingTop: 6 },
  itemTotalLabel: { fontSize: 13, fontWeight: '700', color: '#1B2A4A' },
  itemTotalVal: { fontSize: 14, fontWeight: '800', color: '#5B6FE6' },
  sumDivider: { height: 1, backgroundColor: '#F0F1F5', marginVertical: 4 },
  grandBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, padding: 16, marginTop: 8 },
  grandLabel: { fontSize: 12, fontWeight: '800', color: '#1B2A4A', letterSpacing: 0.3 },
  grandSub: { fontSize: 11, color: '#8892A6', marginTop: 2 },
  grandVal: { fontSize: 24, fontWeight: '900' },
  confirmBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F0F1F5', padding: 14, paddingBottom: 18, gap: 14 },
  confirmLabel: { fontSize: 11, color: '#8892A6', fontWeight: '500' },
  confirmAmt: { fontSize: 18, fontWeight: '800', marginTop: 1 },
  confirmBtn: { flex: 1, backgroundColor: '#5B6FE6', paddingVertical: 13, borderRadius: 12, alignItems: 'center', shadowColor: '#5B6FE6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
