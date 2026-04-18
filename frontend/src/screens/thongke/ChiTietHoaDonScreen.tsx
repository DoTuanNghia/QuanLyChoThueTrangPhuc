import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChiTietHoaDon'>;
  route: RouteProp<RootStackParamList, 'ChiTietHoaDon'>;
};

// Component tiện ích cho thông tin từng hàng
function InfoRow({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (
    <View style={ir.row}>
      <Text style={ir.icon}>{icon}</Text>
      <Text style={ir.label}>{label}</Text>
      <Text style={[ir.value, highlight && { color: '#00897B', fontWeight: '700' }]}>{value}</Text>
    </View>
  );
}

// Component tiện ích cho phần tổng
function SumRow({ label, value, bold, warning, green }: {
  label: string; value: string; bold?: boolean; warning?: boolean; green?: boolean;
}) {
  return (
    <View style={sr.row}>
      <Text style={[sr.label, bold && { fontWeight: '700', color: '#1B2A4A' }]}>{label}</Text>
      <Text style={[
        sr.value,
        bold && { fontWeight: '800', fontSize: 16 },
        warning && { color: '#E53935' },
        green && { color: '#00897B' },
      ]}>{value}</Text>
    </View>
  );
}

export default function ChiTietHoaDonScreen({ navigation, route }: Props) {
  const { hoaDon } = route.params;

  if (!hoaDon) {
    return (
      <View style={styles.page}>
        <Text style={{ marginTop: 100, textAlign: 'center' }}>Không thể tải dữ liệu hóa đơn.</Text>
      </View>
    );
  }

  const fmtVND = (v: any) => {
    const num = Number(v);
    if (isNaN(num)) return '0đ';
    return num.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <View style={styles.page}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.centerCol}>

          {/* Invoice Header */}
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceLogoBox}>
              <Text style={styles.invoiceLogo}>🧾</Text>
            </View>
            <View style={styles.invoiceTitleGroup}>
              <Text style={styles.invoiceTitle}>CHI TIẾT HÓA ĐƠN TRẢ</Text>
              <Text style={styles.invoiceDate}>Ngày trả: {hoaDon.ngayTra}</Text>
            </View>
            <View style={styles.invoiceIdBox}>
              <Text style={styles.invoiceIdLabel}>Phiếu thuê</Text>
              <Text style={styles.invoiceId}>#{hoaDon.phieuThueId}</Text>
            </View>
          </View>

          {/* Two-column layout on wide screens */}
          <View style={styles.twoCol}>
            {/* Left: KH info */}
            <View style={[styles.card, styles.colLeft]}>
              <Text style={styles.cardLabel}>THÔNG TIN KHÁCH HÀNG</Text>
              <InfoRow icon="👤" label="Tên KH" value={hoaDon.tenKhachHang} />
              <InfoRow icon="📞" label="SĐT" value={hoaDon.soDienThoaiKH || '—'} />
              <InfoRow icon="📍" label="Địa chỉ" value={hoaDon.diaChiKH || '—'} />
              <InfoRow icon="📋" label="Ngày thuê" value={hoaDon.ngayThue} />
              <InfoRow icon="👨‍💼" label="Thu ngân" value={hoaDon.tenNhanVien} />
              <View style={styles.depositBox}>
                <Text style={styles.depositLabel}>💰 Tiền đặt cọc</Text>
                <Text style={styles.depositVal}>{fmtVND(hoaDon.tienCoc)}</Text>
              </View>
            </View>

            {/* Right: Summary */}
            <View style={[styles.card, styles.colRight]}>
              <Text style={styles.cardLabel}>TỔNG KẾT</Text>
              <SumRow label="Tổng tiền thuê" value={fmtVND(hoaDon.tongTienThue)} />
              {hoaDon.tongTienPhat > 0 && (
                <SumRow label="Tổng tiền phạt" value={fmtVND(hoaDon.tongTienPhat)} warning />
              )}
              <View style={styles.sumDivider} />
              <SumRow label="Tổng trị giá hóa đơn" value={fmtVND(hoaDon.tongThanhToan)} bold />
            </View>
          </View>

          {/* Chi tiết trang phục */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>DANH SÁCH MẶT HÀNG TRẢ</Text>
            <View style={styles.itemsList}>
              {(hoaDon.danhSachChiTiet || []).map((item, idx) => (
                <View key={idx} style={styles.itemBox}>
                  <View style={styles.itemHdr}>
                    <View style={styles.itemIdx}>
                      <Text style={styles.idxText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.itemName}>{item.tenTrangPhuc}</Text>
                    <Text style={styles.itemTotal}>{fmtVND(item.tongCong)}</Text>
                  </View>

                  <View style={styles.itemDetails}>
                    <View style={styles.detailGrid}>
                      {[
                        { label: 'Số lượng', val: `${item.soLuong} bộ` },
                        { label: 'Đơn giá', val: fmtVND(item.donGia) },
                        { label: 'Số ngày', val: `${item.soNgayThue} ngày` },
                        { label: 'Tiền thuê', val: fmtVND(item.tienThue), accent: true },
                      ].map((d) => (
                        <View key={d.label} style={styles.detailCell}>
                          <Text style={styles.detailLabel}>{d.label}</Text>
                          <Text style={[styles.detailVal, d.accent && { color: '#00897B' }]}>{d.val}</Text>
                        </View>
                      ))}
                    </View>

                    {item.danhSachLoi && item.danhSachLoi.length > 0 && (
                      <View style={styles.loiSec}>
                        <Text style={styles.loiSecTitle}>⚠️ Lỗi phạt (nếu có lúc trả)</Text>
                        {item.danhSachLoi.map((l, li) => (
                          <View key={li} style={styles.loiRow}>
                            <Text style={styles.loiName}>• {l.tenLoi} (×{(l as any).tongLoi ?? l.soLuong})</Text>
                            <Text style={styles.loiPhat}>{fmtVND(l.tienPhat)}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Float button to go back */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.backBtnWrapper} onPress={() => navigation.goBack()} activeOpacity={0.8}>
           <Text style={styles.backBtnText}>Về màn hình trước</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ir = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#F4F6FB' },
  icon: { fontSize: 15, marginRight: 10, width: 22 },
  label: { fontSize: 13, color: '#8892A6', flex: 1, fontWeight: '500' },
  value: { fontSize: 13, fontWeight: '600', color: '#1B2A4A', textAlign: 'right', flex: 1 },
});

const sr = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { fontSize: 13, color: '#8892A6' },
  value: { fontSize: 13, fontWeight: '600', color: '#1B2A4A' },
});

const ACCENT = '#5B6FE6';

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F4F6FB' },
  scroll: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingBottom: 100 /* space cho bottom bar */ },
  centerCol: { width: '100%', maxWidth: 1000, paddingHorizontal: 20, paddingTop: 20 },

  invoiceHeader: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    marginBottom: 16,
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  invoiceLogoBox: {
    width: 50, height: 50, borderRadius: 12, backgroundColor: '#EEF0FB',
    alignItems: 'center', justifyContent: 'center',
  },
  invoiceLogo: { fontSize: 24 },
  invoiceTitleGroup: { flex: 1 },
  invoiceTitle: { fontSize: 16, fontWeight: '800', color: '#1B2A4A' },
  invoiceDate: { fontSize: 12, color: '#8892A6', marginTop: 4 },
  invoiceIdBox: { alignItems: 'flex-end' },
  invoiceIdLabel: { fontSize: 9, color: '#8892A6', fontWeight: '700', textTransform: 'uppercase' },
  invoiceId: { fontSize: 18, fontWeight: '900', color: ACCENT },

  twoCol: { flexDirection: 'column', gap: 16, marginBottom: 0 },
  colLeft: {  },
  colRight: {  },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  cardLabel: {
    fontSize: 10, fontWeight: '800', color: '#8892A6',
    letterSpacing: 1.2, marginBottom: 12, textTransform: 'uppercase',
  },

  depositBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 12, backgroundColor: '#F0FBF7', borderRadius: 10, padding: 12,
  },
  depositLabel: { fontSize: 13, fontWeight: '600', color: '#00897B' },
  depositVal: { fontSize: 16, fontWeight: '800', color: '#00897B' },

  sumDivider: { height: 1, backgroundColor: '#F0F1F5', marginVertical: 6 },

  itemsList: { gap: 10 },
  itemBox: {
    borderWidth: 1, borderColor: '#ECEEF4', borderRadius: 12, overflow: 'hidden',
  },
  itemHdr: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    backgroundColor: '#FAFBFF', gap: 10,
  },
  itemIdx: {
    width: 24, height: 24, borderRadius: 6, backgroundColor: '#EEF0FB',
    alignItems: 'center', justifyContent: 'center',
  },
  idxText: { color: ACCENT, fontWeight: '800', fontSize: 11 },
  itemName: { fontSize: 13, fontWeight: '700', color: '#1B2A4A', flex: 1 },
  itemTotal: { fontSize: 14, fontWeight: '800', color: ACCENT },

  itemDetails: { padding: 14 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  detailCell: { width: '47%' },
  detailLabel: {
    fontSize: 9, color: '#8892A6', fontWeight: '600',
    textTransform: 'uppercase', marginBottom: 2,
  },
  detailVal: { fontSize: 13, fontWeight: '700', color: '#1B2A4A' },

  loiSec: {
    backgroundColor: '#FFF8F8', borderRadius: 8, padding: 10,
    marginTop: 6, borderWidth: 1, borderColor: '#FFE4E4',
  },
  loiSecTitle: { fontSize: 11, fontWeight: '700', color: '#E53935', marginBottom: 6 },
  loiRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  loiName: { fontSize: 11, color: '#5A6478' },
  loiPhat: { fontSize: 11, color: '#E53935', fontWeight: '600' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingTop: 12, paddingBottom: 24, paddingHorizontal: 20,
    borderTopWidth: 1, borderColor: '#ECEEF4',
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 10,
  },
  backBtnWrapper: {
    backgroundColor: '#5B6FE6',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  backBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
