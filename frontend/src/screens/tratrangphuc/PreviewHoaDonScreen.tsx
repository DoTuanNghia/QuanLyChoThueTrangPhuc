import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, Image, Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { tratrangphucApi } from '../../api/tratrangphucApi';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PreviewHoaDon'>;
  route: RouteProp<RootStackParamList, 'PreviewHoaDon'>;
};

function InfoRow({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (
    <View style={ir.row}>
      <Text style={ir.icon}>{icon}</Text>
      <Text style={ir.label}>{label}</Text>
      <Text style={[ir.value, highlight && { color: '#00897B', fontWeight: '700' }]}>{value}</Text>
    </View>
  );
}

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

export default function PreviewHoaDonScreen({ navigation, route }: Props) {
  const { request, hoaDon, nhanVien } = route.params;
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const fmtVND = (v: number) => v?.toLocaleString('vi-VN') + 'đ';
  const soTienConLai = hoaDon.soTienConLai ?? (hoaDon.tongThanhToan - hoaDon.tienCoc);
  const khachTraThem = soTienConLai > 0;

  const handleXacNhan = async () => {
    try {
      setLoading(true);
      const result = await tratrangphucApi.xacNhanTra(request);
      setShowQR(false);
      navigation.replace('KetQua', {
        success: result.success,
        message: result.message,
        phieuTraId: result.phieuTraId,
        nhanVien,
      });
    } catch (e: any) { Alert.alert('Lỗi', e.message); }
    finally { setLoading(false); }
  };

  const handleXacNhanMoi = () => {
    if (khachTraThem) {
      setShowQR(true);
    } else {
      handleXacNhan();
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.centerCol}>

          {/* Invoice Header */}
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceLogoBox}>
              <Text style={styles.invoiceLogo}>🧾</Text>
            </View>
            <View style={styles.invoiceTitleGroup}>
              <Text style={styles.invoiceTitle}>HÓA ĐƠN TRẢ TRANG PHỤC</Text>
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
              <InfoRow icon="👨‍💼" label="Nhân viên" value={hoaDon.tenNhanVien} />
              <View style={styles.depositBox}>
                <Text style={styles.depositLabel}>💰 Tiền đặt cọc</Text>
                <Text style={styles.depositVal}>{fmtVND(hoaDon.tienCoc)}</Text>
              </View>
            </View>

            {/* Right: Summary */}
            <View style={[styles.card, styles.colRight]}>
              <Text style={styles.cardLabel}>TỔNG KẾT THANH TOÁN</Text>
              <SumRow label="Tổng tiền thuê" value={fmtVND(hoaDon.tongTienThue)} />
              {hoaDon.tongTienPhat > 0 && (
                <SumRow label="Tổng tiền phạt" value={fmtVND(hoaDon.tongTienPhat)} warning />
              )}
              <View style={styles.sumDivider} />
              <SumRow label="Tổng thanh toán" value={fmtVND(hoaDon.tongThanhToan)} bold />
              <SumRow label="Tiền đã đặt cọc" value={`- ${fmtVND(hoaDon.tienCoc)}`} green />
              <View style={styles.sumDivider} />

              <View style={[styles.grandBox, { backgroundColor: khachTraThem ? '#FFF3F3' : '#E8F5E9' }]}>
                <View>
                  <Text style={styles.grandLabel}>
                    {khachTraThem ? '⬆️ KHÁCH CẦN TRẢ THÊM' : '⬇️ TRẢ LẠI KHÁCH HÀNG'}
                  </Text>
                  <Text style={styles.grandSub}>
                    {khachTraThem ? 'Số tiền KH phải thanh toán thêm' : 'Số tiền hoàn lại cho KH'}
                  </Text>
                </View>
                <Text style={[styles.grandVal, { color: khachTraThem ? '#E53935' : '#00897B' }]}>
                  {fmtVND(Math.abs(soTienConLai))}
                </Text>
              </View>
            </View>
          </View>

          {/* Chi tiết trang phục */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>CHI TIẾT TRANG PHỤC TRẢ</Text>
            <View style={styles.itemsList}>
              {hoaDon.danhSachChiTiet.map((item, idx) => (
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
                        <Text style={styles.loiSecTitle}>⚠️ Lỗi hỏng</Text>
                        {item.danhSachLoi.map((l, li) => (
                          <View key={li} style={styles.loiRow}>
                            <Text style={styles.loiName}>• {l.tenLoi} (×{l.soLuong})</Text>
                            <Text style={styles.loiPhat}>{fmtVND(l.tienPhat)}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.subTotals}>
                      <View style={styles.subRow}>
                        <Text style={styles.subLabel}>Tiền thuê</Text>
                        <Text style={styles.subVal}>{fmtVND(item.tienThue)}</Text>
                      </View>
                      {item.tienPhat > 0 && (
                        <View style={styles.subRow}>
                          <Text style={styles.subLabel}>Tiền phạt</Text>
                          <Text style={[styles.subVal, { color: '#E53935' }]}>{fmtVND(item.tienPhat)}</Text>
                        </View>
                      )}
                      <View style={styles.itemTotalRow}>
                        <Text style={styles.itemTotalLabel}>Tổng cộng</Text>
                        <Text style={styles.itemTotalVal}>{fmtVND(item.tongCong)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Spacer */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Confirm bar */}
      <View style={styles.confirmBar}>
        <View style={styles.confirmBarInner}>
          <View style={styles.confirmInfo}>
            <Text style={styles.confirmInfoLabel}>
              {khachTraThem ? 'Khách cần trả thêm' : 'Hoàn lại khách'}
            </Text>
            <Text style={[styles.confirmAmt, { color: khachTraThem ? '#E53935' : '#00897B' }]}>
              {fmtVND(Math.abs(soTienConLai))}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.confirmBtn, loading && { opacity: 0.6 }]}
            onPress={handleXacNhanMoi}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.confirmBtnText}>
                  {khachTraThem ? '💵 Thanh toán' : '✅ Xác nhận trả trang phục'}
                </Text>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* QR Code Modal for Payment */}
      <Modal visible={showQR} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalBox}>
            <Text style={styles.qrModalTitle}>Thanh toán bằng QR</Text>
            <Text style={styles.qrModalSub}>Khách hàng quét mã để thanh toán</Text>
            <Text style={styles.qrAmt}>{fmtVND(Math.abs(soTienConLai))}</Text>
            
            <View style={styles.qrImageBox}>
              <Image 
                source={require('../../assets/images/qr.jpg')} 
                style={styles.qrImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.qrActions}>
              <TouchableOpacity 
                style={styles.qrCancelBtn} 
                onPress={() => setShowQR(false)}
                disabled={loading}
              >
                <Text style={styles.qrCancelText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.qrConfirmBtn, loading && { opacity: 0.6 }]} 
                onPress={handleXacNhan}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.qrConfirmText}>✅ Xác nhận đã thanh toán</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
const MAX_W = 1000;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F4F6FB' },
  scroll: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingBottom: 24 },
  centerCol: { width: '100%', maxWidth: MAX_W, paddingHorizontal: 24, paddingTop: 24 },

  invoiceHeader: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24,
    flexDirection: 'row', alignItems: 'center', gap: 20,
    marginBottom: 16,
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
    borderWidth: 1, borderColor: '#ECEEF4',
  },
  invoiceLogoBox: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: '#EEF0FB',
    alignItems: 'center', justifyContent: 'center',
  },
  invoiceLogo: { fontSize: 28 },
  invoiceTitleGroup: { flex: 1 },
  invoiceTitle: { fontSize: 17, fontWeight: '800', color: '#1B2A4A', letterSpacing: 0.3 },
  invoiceDate: { fontSize: 13, color: '#8892A6', marginTop: 4 },
  invoiceIdBox: { alignItems: 'flex-end' },
  invoiceIdLabel: { fontSize: 10, color: '#8892A6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  invoiceId: { fontSize: 22, fontWeight: '900', color: ACCENT },

  twoCol: { flexDirection: 'row', gap: 16, marginBottom: 0 },
  colLeft: { flex: 1 },
  colRight: { flex: 1 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16,
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: '#ECEEF4',
  },
  cardLabel: {
    fontSize: 10, fontWeight: '800', color: '#8892A6',
    letterSpacing: 1.2, marginBottom: 14, textTransform: 'uppercase',
  },

  depositBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 12, backgroundColor: '#F0FBF7', borderRadius: 10, padding: 12,
  },
  depositLabel: { fontSize: 13, fontWeight: '600', color: '#00897B' },
  depositVal: { fontSize: 16, fontWeight: '800', color: '#00897B' },

  sumDivider: { height: 1, backgroundColor: '#F0F1F5', marginVertical: 6 },
  grandBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderRadius: 12, padding: 16, marginTop: 10,
  },
  grandLabel: { fontSize: 11, fontWeight: '800', color: '#1B2A4A', letterSpacing: 0.3 },
  grandSub: { fontSize: 11, color: '#8892A6', marginTop: 3 },
  grandVal: { fontSize: 26, fontWeight: '900' },

  itemsList: { gap: 12 },
  itemBox: {
    borderWidth: 1.5, borderColor: '#ECEEF4', borderRadius: 12, overflow: 'hidden',
  },
  itemHdr: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    backgroundColor: '#F8F9FC', gap: 12,
  },
  itemIdx: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: '#EEF0FB',
    alignItems: 'center', justifyContent: 'center',
  },
  idxText: { color: ACCENT, fontWeight: '800', fontSize: 13 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#1B2A4A', flex: 1 },
  itemTotal: { fontSize: 15, fontWeight: '800', color: ACCENT },

  itemDetails: { padding: 16 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  detailCell: { width: '47%' },
  detailLabel: {
    fontSize: 10, color: '#8892A6', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4,
  },
  detailVal: { fontSize: 14, fontWeight: '700', color: '#1B2A4A' },

  loiSec: {
    backgroundColor: '#FFF8F8', borderRadius: 10, padding: 12,
    marginBottom: 12, borderWidth: 1, borderColor: '#FFE4E4',
  },
  loiSecTitle: { fontSize: 11, fontWeight: '700', color: '#E53935', marginBottom: 8 },
  loiRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  loiName: { fontSize: 12, color: '#5A6478' },
  loiPhat: { fontSize: 12, color: '#E53935', fontWeight: '600' },

  subTotals: { borderTopWidth: 1, borderTopColor: '#F0F1F5', paddingTop: 12 },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  subLabel: { fontSize: 12, color: '#8892A6' },
  subVal: { fontSize: 12, fontWeight: '600', color: '#1B2A4A' },
  itemTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 2, borderTopColor: ACCENT + '40',
    marginTop: 8, paddingTop: 8,
  },
  itemTotalLabel: { fontSize: 13, fontWeight: '700', color: '#1B2A4A' },
  itemTotalVal: { fontSize: 15, fontWeight: '900', color: ACCENT },

  // Confirm bar
  confirmBar: {
    borderTopWidth: 1, borderTopColor: '#ECEEF4',
    backgroundColor: '#FFFFFF', paddingVertical: 16, paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 10,
  },
  confirmBarInner: {
    width: '100%', maxWidth: MAX_W,
    flexDirection: 'row', alignItems: 'center', gap: 20,
  },
  confirmInfo: { flex: 1 },
  confirmInfoLabel: { fontSize: 12, color: '#8892A6', fontWeight: '500' },
  confirmAmt: { fontSize: 22, fontWeight: '900', marginTop: 2 },
  confirmBtn: {
    backgroundColor: ACCENT, paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: 12, alignItems: 'center',
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
    minWidth: 220,
  },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(10,15,35,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  qrModalBox: {
    backgroundColor: '#FFFFFF', borderRadius: 24,
    padding: 32, width: '100%', maxWidth: 420,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15, shadowRadius: 30, elevation: 20,
  },
  qrModalTitle: { fontSize: 20, fontWeight: '800', color: '#1B2A4A', marginBottom: 6 },
  qrModalSub: { fontSize: 14, color: '#8892A6', marginBottom: 16 },
  qrAmt: { fontSize: 32, fontWeight: '900', color: ACCENT, marginBottom: 24 },
  qrImageBox: {
    width: 240, height: 240, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#ECEEF4', backgroundColor: '#F8F9FC',
    alignItems: 'center', justifyContent: 'center', marginBottom: 30,
    padding: 10,
  },
  qrImage: { width: '100%', height: '100%' },
  qrActions: { flexDirection: 'row', gap: 12, width: '100%' },
  qrCancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#ECEEF4', alignItems: 'center',
  },
  qrCancelText: { color: '#5A6478', fontWeight: '700', fontSize: 15 },
  qrConfirmBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: ACCENT, alignItems: 'center',
  },
  qrConfirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
